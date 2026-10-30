import { useEffect, useRef, useState } from 'react';
import { LogoMark } from './Logo.jsx';
import { pillars, site } from '../data/content.js';

/*
 * Website chat box.
 * - When site.chatApiUrl points at the deployed whatsapp-bridge Worker, messages go to the
 *   team's WhatsApp and replies (sent as "BH CODE reply") appear here.
 * - Until then it runs in "offline" mode: the visitor's message is carried into the enquiry form.
 */
const API = (site.chatApiUrl || '').replace(/\/$/, '');
const STORE_KEY = 'bhumaji-chat-session';
const GREETING = {
  id: 'hello',
  from: 'agent',
  text: 'Hi! Tell us what you are working on: a cloud migration, an ML platform, an app or something else. A member of the Bhumaji Systems team will reply here.',
};

const loadSession = () => {
  try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); } catch { return null; }
};
const saveSession = (s) => {
  try { s ? sessionStorage.setItem(STORE_KEY, JSON.stringify(s)) : sessionStorage.removeItem(STORE_KEY); } catch { /* storage blocked */ }
};

async function call(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(loadSession);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [unread, setUnread] = useState(false);
  const [offlineNote, setOfflineNote] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const seen = useRef(0);

  // Poll the bridge for replies while a session exists (faster while the panel is open).
  useEffect(() => {
    if (!API || !session) return undefined;
    let stop = false;
    const tick = async () => {
      try {
        const data = await call('/api/poll', session);
        if (stop) return;
        const list = data.messages || [];
        setMessages(list.length ? list : [GREETING]);
        const agentCount = list.filter((m) => m.from === 'agent').length;
        if (agentCount > seen.current && !open) setUnread(true);
        seen.current = agentCount;
      } catch (e) {
        if (e.status === 401) { saveSession(null); setSession(null); }
      }
    };
    tick();
    const id = setInterval(tick, open ? 5000 : 20000);
    return () => { stop = true; clearInterval(id); };
  }, [session, open]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, offlineNote]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); launcherRef.current && launcherRef.current.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const body = text.trim();
    if (!body || sending) return;
    setError('');
    setDraft('');

    if (!API) {
      setMessages((m) => [...m, { id: `v${Date.now()}`, from: 'visitor', text: body }]);
      setOfflineNote(true);
      return;
    }

    setSending(true);
    setMessages((m) => [...m, { id: `pending${Date.now()}`, from: 'visitor', text: body, pending: true }]);
    try {
      let s = session;
      if (!s) {
        const created = await call('/api/session');
        s = { sessionId: created.sessionId, token: created.token };
        saveSession(s);
        setSession(s);
      }
      await call('/api/message', { ...s, text: body });
      const data = await call('/api/poll', s);
      setMessages(data.messages && data.messages.length ? data.messages : [GREETING]);
    } catch (e) {
      setError(e.message || 'Your message could not be sent. Please try again or use the enquiry form.');
      setMessages((m) => m.filter((x) => !x.pending));
      setDraft(body);
      if (e.status === 401) { saveSession(null); setSession(null); }
    } finally {
      setSending(false);
    }
  };

  const continueInForm = () => {
    const text = messages.filter((m) => m.from === 'visitor').map((m) => m.text).join('\n');
    window.dispatchEvent(new CustomEvent('bhumaji:prefill', { detail: text }));
    setOpen(false);
    window.location.hash = 'contact';
    const el = document.getElementById('contact');
    el && el.scrollIntoView({ block: 'start' });
  };

  const visitorSent = messages.some((m) => m.from === 'visitor');

  return (
    <div className={`chat${open ? ' is-open' : ''}`}>
      <section className="chat-panel" role="dialog" aria-modal="false" aria-label="Chat with Bhumaji Systems" hidden={!open}>
        <header className="chat-head">
          <LogoMark size={36} />
          <div className="chat-head-text">
            <p className="chat-title">Bhumaji Systems</p>
            <p className="chat-sub"><span className="chat-live" aria-hidden="true" />Talk to an engineer</p>
          </div>
          <button type="button" className="chat-close" aria-label="Close chat" onClick={() => { setOpen(false); launcherRef.current && launcherRef.current.focus(); }}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </header>

        <div className="chat-log" ref={listRef} aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`msg msg-${m.from}${m.pending ? ' is-pending' : ''}`}>
              <p>{m.text}</p>
            </div>
          ))}
          {offlineNote && (
            <div className="msg msg-agent">
              <p>Thanks! Live chat is being connected. Your message is ready to send through our enquiry form, so add your email there and we&rsquo;ll reply directly.</p>
              <button type="button" className="chat-inline-btn" onClick={continueInForm}>Continue in the enquiry form →</button>
            </div>
          )}
          {!visitorSent && (
            <div className="chat-topics" aria-label="Suggested topics">
              {pillars.map((p) => (
                <button type="button" key={p.id} className={`chat-topic tone-${p.tone}`} onClick={() => send(`I'd like to discuss ${p.title}.`)}>
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="chat-error" role="alert">{error}</p>}

        <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
          <label htmlFor="chat-input" className="sr-only">Your message</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            maxLength={1000}
            value={draft}
            placeholder="Type your message…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(draft); } }}
          />
          <button type="submit" className="chat-send" aria-label="Send message" disabled={!draft.trim() || sending}>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </form>
        <p className="chat-privacy">Messages are sent to the Bhumaji Systems team. See our <a href="/privacy-policy.html">privacy policy</a>.</p>
      </section>

      <button
        type="button"
        ref={launcherRef}
        className="chat-launcher"
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with us'}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            <span className="chat-launcher-label">Chat with us</span>
          </>
        )}
        {unread && !open && <span className="chat-unread" aria-label="New reply" />}
      </button>
    </div>
  );
}
