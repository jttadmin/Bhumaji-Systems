// Bhumaji Systems — website enquiry handler.
// Receives the contact form (JSON) from API Gateway and emails it to the team through Amazon SES.
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const ses = new SESv2Client({});
const TO = process.env.ENQUIRY_TO;
const FROM = process.env.ENQUIRY_FROM;
const ALLOWED = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);

const LIMITS = { name: 120, company: 160, email: 200, timeline: 60, message: 5000, page: 300 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reply = (status, body) => ({
  statusCode: status,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ');
const esc = (v) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function parseEnquiry(raw) {
  let data;
  try {
    data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return { error: 'Invalid request body.' };
  }
  if (!data || typeof data !== 'object') return { error: 'Invalid request body.' };

  const e = {
    name: oneLine(clean(data.name, LIMITS.name)),
    company: oneLine(clean(data.company, LIMITS.company)),
    email: oneLine(clean(data.email, LIMITS.email)),
    timeline: oneLine(clean(data.timeline, LIMITS.timeline)),
    message: clean(data.message, LIMITS.message),
    page: oneLine(clean(data.page, LIMITS.page)),
    services: (Array.isArray(data.services) ? data.services : [])
      .slice(0, 6)
      .map((s) => oneLine(clean(s, 80)))
      .filter(Boolean),
    honeypot: clean(data.website, 200),
  };

  if (!e.name || !e.company || !EMAIL_RE.test(e.email) || e.message.length < 10 || !e.services.length) {
    return { error: 'Please complete all required fields.' };
  }
  return { enquiry: e };
}

export function buildEmail(e) {
  const services = e.services.join(', ');
  const subject = `New website enquiry: ${e.company} (${services})`.slice(0, 200);
  const rows = [
    ['Name', e.name],
    ['Company', e.company],
    ['Email', e.email],
    ['Services', services],
    ['Timeline', e.timeline || 'Not given'],
    ['Sent from', e.page || 'bhumaji.com'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nProject description:\n${e.message}\n\nReply to this email to answer ${e.name} directly.`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0a1530;max-width:640px">
<h2 style="margin:0 0 12px;font-size:20px">New website enquiry</h2>
<table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="border-bottom:1px solid #e3e8f0;color:#5b6780;width:120px">${esc(k)}</td><td style="border-bottom:1px solid #e3e8f0"><strong>${esc(v)}</strong></td></tr>`).join('\n')}
</table>
<h3 style="margin:20px 0 8px;font-size:16px">Project description</h3>
<p style="white-space:pre-wrap;font-size:14px;line-height:1.5;margin:0">${esc(e.message)}</p>
<p style="color:#5b6780;font-size:12px;margin-top:24px">Reply to this email to answer ${esc(e.name)} directly.</p>
</div>`;
  return { subject, text, html };
}

export const handler = async (event) => {
  const origin = event?.headers?.origin || event?.headers?.Origin || '';
  if (ALLOWED.length && !ALLOWED.includes(origin)) return reply(403, { ok: false, error: 'Origin not allowed.' });

  const body = event?.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event?.body;
  if (!body || body.length > 20000) return reply(400, { ok: false, error: 'Invalid request body.' });

  const { enquiry, error } = parseEnquiry(body);
  if (error) return reply(400, { ok: false, error });
  if (enquiry.honeypot) return reply(200, { ok: true }); // bot: pretend success, send nothing

  const { subject, text, html } = buildEmail(enquiry);
  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: `Bhumaji Systems website <${FROM}>`,
        Destination: { ToAddresses: [TO] },
        ReplyToAddresses: [enquiry.email],
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: text, Charset: 'UTF-8' }, Html: { Data: html, Charset: 'UTF-8' } },
          },
        },
      })
    );
  } catch (err) {
    console.error('SES send failed', err?.name, err?.message);
    return reply(502, { ok: false, error: 'Could not send the enquiry.' });
  }
  console.log('Enquiry sent', { company: enquiry.company, services: enquiry.services });
  return reply(200, { ok: true });
};
