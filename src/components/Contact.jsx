import { useEffect, useState } from 'react';
import { pillars, site } from '../data/content.js';

const TIMELINES = ['As soon as possible', 'Within 3 months', '3–6 months', 'Just exploring'];

/*
 * Emails the enquiry to site.enquiryEmail.
 * Primary: Web3Forms (needs site.web3formsKey). Otherwise: FormSubmit (needs one-time activation).
 * If both fail, the visitor is offered a pre-filled email instead, so no enquiry is lost.
 */
const servicesText = (data) => pillars.filter((p) => data.services.includes(p.id)).map((p) => p.title).join(', ');

const enquiryBody = (data) =>
  [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Services: ${servicesText(data)}`,
    `Timeline: ${data.timeline}`,
    '',
    data.message,
  ].join('\n');

export const mailtoHref = (data) =>
  `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Website enquiry: ${data.company || data.name}`)}&body=${encodeURIComponent(enquiryBody(data))}`;

async function submitEnquiry(data) {
  const subject = `New website enquiry: ${data.company} (${servicesText(data)})`;
  const fields = {
    Name: data.name,
    Company: data.company,
    Email: data.email,
    Services: servicesText(data),
    Timeline: data.timeline,
    Message: data.message,
    Page: window.location.href,
  };

  if (site.web3formsKey) {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: site.web3formsKey,
        subject,
        from_name: 'Bhumaji Systems website',
        replyto: data.email,
        botcheck: data.website ? true : '',
        ...fields,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.message || `Web3Forms error ${res.status}`);
    return json;
  }

  const res = await fetch(`https://formsubmit.co/ajax/${site.enquiryEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, _template: 'table', _replyto: data.email, _honey: data.website || '', ...fields }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || `FormSubmit error ${res.status}`);
  return json;
}

export default function Contact({ preselect }) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    services: preselect ? [preselect] : [],
    timeline: TIMELINES[1],
    message: '',
    website: '', // honeypot: real visitors never fill this
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | failed

  // The chat box can hand a visitor's message over to this form.
  useEffect(() => {
    const onPrefill = (e) => {
      setState('idle');
      setForm((f) => ({ ...f, message: e.detail || f.message }));
    };
    window.addEventListener('bhumaji:prefill', onPrefill);
    return () => window.removeEventListener('bhumaji:prefill', onPrefill);
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (id) =>
    setForm({ ...form, services: form.services.includes(id) ? form.services.filter((s) => s !== id) : [...form.services, id] });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter your name.';
    if (!form.company.trim()) e.company = 'Enter your company name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a work email like name@company.com.';
    if (!form.services.length) e.services = 'Choose at least one service area.';
    if (form.message.trim().length < 20) e.message = 'Tell us a little more: at least 20 characters.';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.getElementById(`f-${Object.keys(e)[0]}`);
      first && first.focus();
      return;
    }
    setState('sending');
    try {
      await submitEnquiry(form);
      setState('sent');
    } catch (err) {
      console.warn('Enquiry send failed:', err && err.message);
      setState('failed');
    }
  };

  const picked = pillars.filter((p) => form.services.includes(p.id)).map((p) => p.short);

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-layout">
        <div className="consult">
          <p className="eyebrow">Let&rsquo;s talk</p>
          <h2 id="contact-title" className="contact-title">Tell us what you&rsquo;re building.</h2>
          <p className="consult-body">
            Start with a free 30-minute architecture consultation. Bring a problem, a system diagram or just an idea.
          </p>
          <ul className="consult-list">
            <li><strong>Assess</strong> where your platform stands today</li>
            <li><strong>Prioritise</strong> the next three moves that matter most</li>
            <li><strong>Leave</strong> with a written summary and suggested approach</li>
          </ul>
          <div className="consult-meta">
            <span>{site.location}</span>
            {site.contactEmail && <span className="selectable">{site.contactEmail}</span>}
          </div>
        </div>

        <div className="enquiry">
          {state === 'sent' ? (
            <div className="sent" role="status">
              <div className="sent-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3>Enquiry received</h3>
              <p>Thanks, {form.name.split(' ')[0]}. We&rsquo;ll review your {picked.join(', ')} enquiry and reply to {form.email} to set up your consultation.</p>
              <button type="button" className="btn btn-ghost" onClick={() => { setState('idle'); setForm({ ...form, message: '' }); }}>Send another enquiry</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <fieldset className="svc-pick" aria-describedby={errors.services ? 'e-services' : undefined}>
                <legend>What do you need help with?</legend>
                <div className="svc-chips" id="f-services" tabIndex={-1}>
                  {pillars.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`svc-chip tone-${p.tone}${form.services.includes(p.id) ? ' is-on' : ''}`}
                      aria-pressed={form.services.includes(p.id)}
                      onClick={() => toggle(p.id)}
                    >
                      <span className="svc-check" aria-hidden="true" />
                      {p.title}
                    </button>
                  ))}
                </div>
                {errors.services && <p className="err" id="e-services">{errors.services}</p>}
              </fieldset>

              <div className="field-row">
                <Field id="name" label="Your name" error={errors.name}>
                  <input id="f-name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
                </Field>
                <Field id="company" label="Company" error={errors.company}>
                  <input id="f-company" autoComplete="organization" value={form.company} onChange={set('company')} aria-invalid={!!errors.company} />
                </Field>
              </div>
              <div className="field-row">
                <Field id="email" label="Work email" error={errors.email}>
                  <input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
                </Field>
                <Field id="timeline" label="Timeline">
                  <select id="f-timeline" value={form.timeline} onChange={set('timeline')}>
                    {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field id="message" label="Project description" error={errors.message}>
                <textarea
                  id="f-message"
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  aria-invalid={!!errors.message}
                  placeholder="e.g. We run 30 services on-premise and want to move to AWS EKS within six months."
                />
              </Field>
              <div className="hp" aria-hidden="true">
                <label htmlFor="f-website">Website</label>
                <input id="f-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </div>
              {state === 'failed' && (
                <div className="send-fallback" role="alert">
                  <p>We couldn&rsquo;t send your enquiry automatically. Send it from your email app instead; everything you typed is already filled in.</p>
                  <a className="btn btn-primary" href={mailtoHref(form)}>Send by email instead</a>
                  <p className="form-note">Or write to <span className="selectable">{site.contactEmail}</span></p>
                </div>
              )}
              <div className="form-foot">
                <button type="submit" className="btn btn-primary btn-lg" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending…' : 'Request a consultation'}
                </button>
                <p className="form-note">We only use these details to reply to your enquiry.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={`f-${id}`}>{label}</label>
      {children}
      {error && <p className="err" id={`e-${id}`}>{error}</p>}
    </div>
  );
}
