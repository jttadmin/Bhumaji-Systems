/**
 * Bhumaji Systems private website chat ↔ WhatsApp bridge.
 *
 * Configure a Cloudflare KV namespace binding named CHAT_KV and these secrets:
 * WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN,
 * WHATSAPP_APP_SECRET, WHATSAPP_OWNER_PHONE (digits only), ALLOWED_ORIGIN.
 *
 * Website visitor sessions are private; owner replies to the API-enabled number
 * using: BH <6-character-code> <reply text>
 */
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });

function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "https://bhumaji.com").split(",").map(x => x.trim());
  if (origin && !allowed.includes(origin)) return null;
  return {
    "access-control-allow-origin": origin || allowed[0],
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}
function randomHex(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
}
function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return Array.from(a, b => alphabet[b % alphabet.length]).join("");
}
async function getSession(env, id) {
  if (!/^[a-f0-9]{32}$/.test(id || "")) return null;
  const raw = await env.CHAT_KV.get("session:" + id);
  return raw ? JSON.parse(raw) : null;
}
async function saveSession(env, id, value) {
  await env.CHAT_KV.put("session:" + id, JSON.stringify(value), { expirationTtl: 86400 });
}
async function sendWhatsApp(env, to, body) {
  const version = env.WHATSAPP_API_VERSION || "v23.0";
  const response = await fetch("https://graph.facebook.com/" + version + "/" + env.WHATSAPP_PHONE_NUMBER_ID + "/messages", {
    method: "POST",
    headers: { "authorization": "Bearer " + env.WHATSAPP_TOKEN, "content-type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body } })
  });
  if (!response.ok) throw new Error("WhatsApp API returned HTTP " + response.status);
}
async function verifySignature(request, env, rawBody) {
  const signature = request.headers.get("x-hub-signature-256") || "";
  if (!signature.startsWith("sha256=") || !env.WHATSAPP_APP_SECRET) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.WHATSAPP_APP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const hex = Array.from(digest, b => b.toString(16).padStart(2, "0")).join("");
  const expected = "sha256=" + hex;
  if (signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
async function handleWebhook(request, env, url) {
  if (request.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    return mode === "subscribe" && token && token === env.WHATSAPP_VERIFY_TOKEN
      ? new Response(challenge || "", { status: 200 })
      : new Response("Forbidden", { status: 403 });
  }
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const raw = await request.text();
  if (!(await verifySignature(request, env, raw))) return new Response("Invalid signature", { status: 401 });
  let payload;
  try { payload = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }

  const entries = payload.entry || [];
  for (const entry of entries) for (const change of (entry.changes || [])) {
    const value = change.value || {};
    for (const message of (value.messages || [])) {
      if (message.type !== "text" || !message.from || !message.text?.body) continue;
      if (String(message.from).replace(/\D/g, "") !== String(env.WHATSAPP_OWNER_PHONE || "").replace(/\D/g, "")) continue;
      const match = message.text.body.trim().match(/^BH\s+([A-Z0-9]{6})\s+([\s\S]{1,1500})$/i);
      if (!match) {
        try { await sendWhatsApp(env, env.WHATSAPP_OWNER_PHONE, "To reply to a website chat, send: BH CODE your reply. Use the six-character code shown with each website enquiry."); } catch {}
        continue;
      }
      const code = match[1].toUpperCase();
      const sessionId = await env.CHAT_KV.get("code:" + code);
      if (!sessionId) {
        try { await sendWhatsApp(env, env.WHATSAPP_OWNER_PHONE, "That website chat code has expired or is invalid. Ask the visitor to send a new message."); } catch {}
        continue;
      }
      const session = await getSession(env, sessionId);
      if (!session) continue;
      session.messages.push({ id: randomHex(8), from: "agent", text: match[2], at: Date.now() });
      session.messages = session.messages.slice(-40);
      await saveSession(env, sessionId, session);
    }
  }
  return new Response("EVENT_RECEIVED", { status: 200 });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/webhook") return handleWebhook(request, env, url);
    const headers = cors(request, env);
    if (!headers) return json({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (url.pathname === "/health") return json({ ok: true, service: "bhumaji-chat-bridge" }, 200, headers);
    if (!env.CHAT_KV) return json({ error: "Chat storage is not configured" }, 503, headers);

    if (url.pathname === "/api/session" && request.method === "POST") {
      const id = randomHex(16);
      let code = randomCode();
      for (let i = 0; i < 5 && await env.CHAT_KV.get("code:" + code); i++) code = randomCode();
      const session = { token: randomHex(24), code, messages: [{ id: randomHex(8), from: "agent", text: "Hi! Thanks for contacting Bhumaji Systems. A team member will reply here as soon as possible.", at: Date.now() }] };
      await saveSession(env, id, session);
      await env.CHAT_KV.put("code:" + code, id, { expirationTtl: 86400 });
      return json({ sessionId: id, token: session.token, code }, 201, headers);
    }
    if (url.pathname === "/api/message" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400, headers); }
      const id = String(body.sessionId || "");
      const session = await getSession(env, id);
      if (!session || typeof body.token !== "string" || body.token !== session.token) return json({ error: "Session expired" }, 401, headers);
      const text = String(body.text || "").trim().slice(0, 1000);
      if (!text) return json({ error: "Message is empty" }, 400, headers);
      session.messages.push({ id: randomHex(8), from: "visitor", text, at: Date.now() });
      session.messages = session.messages.slice(-40);
      await saveSession(env, id, session);
      try {
        await sendWhatsApp(env, env.WHATSAPP_OWNER_PHONE, "New Bhumaji Systems website chat [" + session.code + "]\n" + text + "\n\nReply in this WhatsApp chat using:\nBH " + session.code + " your reply");
      } catch (e) {
        return json({ error: "Message could not be delivered to the support inbox. Please try again or use the Contact Us form." }, 502, headers);
      }
      return json({ ok: true }, 200, headers);
    }
    if (url.pathname === "/api/poll" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400, headers); }
      const session = await getSession(env, String(body.sessionId || ""));
      if (!session || typeof body.token !== "string" || body.token !== session.token) return json({ error: "Session expired" }, 401, headers);
      return json({ messages: session.messages }, 200, headers);
    }
    return json({ error: "Not found" }, 404, headers);
  }
};
