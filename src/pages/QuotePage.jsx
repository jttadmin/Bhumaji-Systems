import { useEffect, useMemo, useState } from 'react';
import logoUrl from '../assets/bhumaji-logo.png';
import { site } from '../data/content.js';
import { quoteCatalog, quoteSettings, currencies, designLevels, timelines } from '../data/quote.js';
import Contact from '../components/Contact.jsx';

/*
 * Instant quotation: the visitor picks a service, package and extras and sees a live estimate.
 * After entering their details they get a numbered quotation they can save as a PDF,
 * and a copy is emailed to Bhumaji Systems through Web3Forms (same key as the enquiry form).
 */

const roundTo = (n, cur) => (cur === 'INR' ? Math.round(n / 1000) * 1000 : Math.round(n / 50) * 50);
const money = (n, cur) =>
  new Intl.NumberFormat(currencies[cur].locale, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);

/** Price breakdown for the current selection. */
export function calculate(sel, cur) {
  const cat = quoteCatalog.find((c) => c.id === sel.category);
  const pkg = cat.packages.find((p) => p.id === sel.package) || cat.packages[0];
  const platform = cat.platforms?.find((p) => p.id === sel.platform) || cat.platforms?.[0];
  const design = cat.design ? designLevels.find((d) => d.id === sel.design) || designLevels[0] : null;
  const timeline = timelines.find((t) => t.id === sel.timeline) || timelines[0];

  const notes = [platform?.name, design?.name].filter(Boolean).join(' · ');
  const baseAmt = roundTo(pkg.price[cur] * (platform?.factor || 1) * (design?.factor || 1), cur);
  const lines = [{ name: pkg.name, note: notes || pkg.detail, amount: baseAmt }];

  const chosen = cat.addons.filter((a) => sel.addons.includes(a.id));
  chosen.filter((a) => !a.monthly).forEach((a) => lines.push({ name: a.name, amount: a.price[cur] }));

  let oneTime = lines.reduce((s, l) => s + l.amount, 0);
  if (timeline.factor > 1) {
    const extra = roundTo(oneTime * (timeline.factor - 1), cur);
    lines.push({ name: 'Priority delivery', note: `+${Math.round((timeline.factor - 1) * 100)}% for an urgent timeline`, amount: extra });
    oneTime += extra;
  }
  const monthlyLines = chosen.filter((a) => a.monthly).map((a) => ({ name: a.name, amount: a.price[cur] }));
  const monthly = monthlyLines.reduce((s, l) => s + l.amount, 0);
  const gst = cur === 'INR' && quoteSettings.gstPercent ? roundTo((oneTime * quoteSettings.gstPercent) / 100, cur) : 0;

  return {
    cat, pkg, platform, design, timeline, lines, monthlyLines, oneTime, monthly, gst,
    total: oneTime + gst,
    low: roundTo(oneTime * quoteSettings.rangeLow, cur),
    high: roundTo(oneTime * quoteSettings.rangeHigh, cur),
  };
}

const newQuoteNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${quoteSettings.numberPrefix}-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
};
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const quoteText = (q, cur, client) =>
  [
    `Quotation ${q.number} (${fmtDate(q.date)})`,
    `Service: ${q.calc.cat.title} — ${q.calc.pkg.name}`,
    ...q.calc.lines.map((l) => `• ${l.name}${l.note ? ` (${l.note})` : ''}: ${money(l.amount, cur)}`),
    q.calc.gst ? `GST ${quoteSettings.gstPercent}%: ${money(q.calc.gst, cur)}` : '',
    `Total (one-time): ${money(q.calc.total, cur)}  [estimate range ${money(q.calc.low, cur)} – ${money(q.calc.high, cur)}]`,
    ...q.calc.monthlyLines.map((l) => `• Monthly — ${l.name}: ${money(l.amount, cur)}/month`),
    `Timeline: ${q.calc.pkg.weeks}`,
    '',
    `Client: ${client.name}, ${client.company || '—'}, ${client.email}${client.phone ? `, ${client.phone}` : ''}, ${client.country || ''}`,
    client.notes ? `Notes: ${client.notes}` : '',
  ].filter(Boolean).join('\n');

async function sendQuote(q, cur, client) {
  if (!site.web3formsKey) throw new Error('Web3Forms access key not set');
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: site.web3formsKey,
      subject: `New quotation ${q.number}: ${client.company || client.name} — ${q.calc.cat.title} (${money(q.calc.total, cur)})`,
      from_name: 'Bhumaji Systems website — Quotations',
      replyto: client.email,
      botcheck: client.website ? true : '',
      Quotation: q.number,
      Name: client.name,
      Company: client.company,
      Email: client.email,
      Phone: client.phone,
      Country: client.country,
      Service: `${q.calc.cat.title} — ${q.calc.pkg.name}`,
      Total: money(q.calc.total, cur),
      Monthly: q.calc.monthly ? `${money(q.calc.monthly, cur)}/month` : 'None',
      Details: quoteText(q, cur, client),
      Page: window.location.href,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || `Web3Forms error ${res.status}`);
}

const firstPackage = (catId) => quoteCatalog.find((c) => c.id === catId).packages[0].id;

export default function QuotePage() {
  const [cur, setCur] = useState('INR');
  const [sel, setSel] = useState({
    category: 'website', package: firstPackage('website'), platform: 'android', design: 'custom', timeline: 'normal', addons: [],
  });
  const [step, setStep] = useState('build'); // build | details | quote
  const [client, setClient] = useState({ name: '', company: '', email: '', phone: '', country: '', notes: '', website: '' });
  const [errors, setErrors] = useState({});
  const [quote, setQuote] = useState(null);
  const [sendState, setSendState] = useState('idle'); // idle | sending | sent | failed

  // After load: international visitors see USD; ?service=cloud opens that service.
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (!/Calcutta|Kolkata/.test(tz)) setCur('USD');
    } catch { /* keep INR */ }
    const want = new URLSearchParams(window.location.search).get('service');
    if (want && quoteCatalog.some((c) => c.id === want)) setSel((s) => ({ ...s, category: want, package: firstPackage(want), addons: [] }));
  }, []);

  // Lift the chat button above the phone estimate bar while building a quote.
  useEffect(() => {
    document.documentElement.classList.toggle('quote-building', step !== 'quote');
    return () => document.documentElement.classList.remove('quote-building');
  }, [step]);

  const calc = useMemo(() => calculate(sel, cur), [sel, cur]);
  const cat = calc.cat;

  const pickCategory = (id) => setSel((s) => ({ ...s, category: id, package: firstPackage(id), addons: [] }));
  const toggleAddon = (id) =>
    setSel((s) => ({ ...s, addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id] }));
  const setC = (k) => (e) => setClient({ ...client, [k]: e.target.value });

  const goDetails = () => {
    setStep('details');
    requestAnimationFrame(() => document.getElementById('quote-details')?.scrollIntoView({ block: 'start' }));
  };

  const onGenerate = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!client.name.trim()) e.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) e.email = 'Enter an email like name@company.com.';
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`q-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const date = new Date();
    const q = { number: newQuoteNumber(), date, validUntil: new Date(date.getTime() + quoteSettings.validDays * 864e5), calc, cur };
    setQuote(q);
    setStep('quote');
    requestAnimationFrame(() => document.getElementById('quote-doc')?.scrollIntoView({ block: 'start' }));
    setSendState('sending');
    try {
      await sendQuote(q, cur, client);
      setSendState('sent');
    } catch (err) {
      console.warn('Quotation send failed:', err && err.message);
      setSendState('failed');
    }
  };

  const mailto = quote
    ? `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Quotation ${quote.number}`)}&body=${encodeURIComponent(quoteText(quote, quote.cur, client))}`
    : '#';

  return (
    <div className={`quote-page tone-${cat.tone}`}>
      <section className="svc-hero quote-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Instant quotation</span>
          </nav>
          <p className="eyebrow">Instant quotation</p>
          <h1 className="svc-title">Get your project price in two minutes.</h1>
          <p className="svc-lede">
            Choose a service, pick what you need and receive a numbered quotation you can download and share. No sign-up.
          </p>
          <div className="cur-switch" role="group" aria-label="Currency">
            {Object.values(currencies).map((c) => (
              <button key={c.code} type="button" className={cur === c.code ? 'is-on' : ''} aria-pressed={cur === c.code} onClick={() => setCur(c.code)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {step !== 'quote' && (
        <section className="section quote-builder" aria-label="Build your quotation">
          <div className="wrap quote-layout">
            <div className="quote-steps">
              <fieldset className="q-step">
                <legend><span className="q-num">1</span> Service</legend>
                <div className="q-cats">
                  {quoteCatalog.map((c) => (
                    <button key={c.id} type="button" className={`q-cat tone-${c.tone}${sel.category === c.id ? ' is-on' : ''}`} aria-pressed={sel.category === c.id} onClick={() => pickCategory(c.id)}>
                      <strong>{c.title}</strong>
                      <span>{c.blurb}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="q-step">
                <legend><span className="q-num">2</span> Package</legend>
                <div className="q-options">
                  {cat.packages.map((p) => (
                    <label key={p.id} className={`q-opt${sel.package === p.id ? ' is-on' : ''}`}>
                      <input type="radio" name="package" checked={sel.package === p.id} onChange={() => setSel({ ...sel, package: p.id })} />
                      <span className="q-opt-main">
                        <strong>{p.name}</strong>
                        <span>{p.detail}</span>
                        <span className="q-weeks">{p.weeks}</span>
                      </span>
                      <span className="q-price">from {money(p.price[cur], cur)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {(cat.platforms || cat.design) && (
                <fieldset className="q-step">
                  <legend><span className="q-num">3</span> Platform &amp; design</legend>
                  {cat.platforms && (
                    <div className="q-pills" role="radiogroup" aria-label="Platform">
                      {cat.platforms.map((p) => (
                        <button key={p.id} type="button" role="radio" aria-checked={sel.platform === p.id} className={sel.platform === p.id ? 'is-on' : ''} onClick={() => setSel({ ...sel, platform: p.id })}>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {cat.design && (
                    <div className="q-pills" role="radiogroup" aria-label="Design level">
                      {designLevels.map((d) => (
                        <button key={d.id} type="button" role="radio" aria-checked={sel.design === d.id} className={sel.design === d.id ? 'is-on' : ''} onClick={() => setSel({ ...sel, design: d.id })} title={d.note}>
                          {d.name}
                        </button>
                      ))}
                    </div>
                  )}
                </fieldset>
              )}

              <fieldset className="q-step">
                <legend><span className="q-num">{cat.platforms || cat.design ? 4 : 3}</span> Add-ons</legend>
                <div className="q-addons">
                  {cat.addons.map((a) => (
                    <button key={a.id} type="button" className={`svc-chip q-addon${sel.addons.includes(a.id) ? ' is-on' : ''}`} aria-pressed={sel.addons.includes(a.id)} onClick={() => toggleAddon(a.id)}>
                      <span className="svc-check" aria-hidden="true" />
                      <span className="q-addon-name">{a.name}</span>
                      <span className="q-addon-price">+{money(a.price[cur], cur)}{a.monthly ? '/mo' : ''}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="q-step">
                <legend><span className="q-num">{cat.platforms || cat.design ? 5 : 4}</span> Timeline</legend>
                <div className="q-pills" role="radiogroup" aria-label="Timeline">
                  {timelines.map((t) => (
                    <button key={t.id} type="button" role="radio" aria-checked={sel.timeline === t.id} className={sel.timeline === t.id ? 'is-on' : ''} onClick={() => setSel({ ...sel, timeline: t.id })}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </fieldset>

              {step === 'details' && (
                <form id="quote-details" className="q-step q-details enquiry" onSubmit={onGenerate} noValidate>
                  <h2 className="q-details-title">Where should we send your quotation?</h2>
                  <div className="field-row">
                    <QField id="name" label="Your name" error={errors.name}>
                      <input id="q-name" autoComplete="name" value={client.name} onChange={setC('name')} aria-invalid={!!errors.name} />
                    </QField>
                    <QField id="company" label="Company (optional)">
                      <input id="q-company" autoComplete="organization" value={client.company} onChange={setC('company')} />
                    </QField>
                  </div>
                  <div className="field-row">
                    <QField id="email" label="Email" error={errors.email}>
                      <input id="q-email" type="email" autoComplete="email" value={client.email} onChange={setC('email')} aria-invalid={!!errors.email} />
                    </QField>
                    <QField id="phone" label="Phone / WhatsApp (optional)">
                      <input id="q-phone" type="tel" autoComplete="tel" value={client.phone} onChange={setC('phone')} />
                    </QField>
                  </div>
                  <QField id="country" label="Country">
                    <input id="q-country" autoComplete="country-name" value={client.country} onChange={setC('country')} placeholder={cur === 'INR' ? 'India' : 'e.g. United States'} />
                  </QField>
                  <QField id="notes" label="Anything else we should know? (optional)">
                    <textarea id="q-notes" rows={3} value={client.notes} onChange={setC('notes')} placeholder="e.g. We need it live before our product launch in March." />
                  </QField>
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="q-website">Website</label>
                    <input id="q-website" tabIndex={-1} autoComplete="off" value={client.website} onChange={setC('website')} />
                  </div>
                  <div className="form-foot">
                    <button type="submit" className="btn btn-primary btn-lg">Generate my quotation <span aria-hidden="true">→</span></button>
                    <p className="form-note">We only use these details to follow up on this quotation.</p>
                  </div>
                </form>
              )}
            </div>

            <aside className="q-summary" aria-live="polite">
              <p className="eyebrow">Your estimate</p>
              <p className="q-summary-svc">{cat.title}</p>
              <ul className="q-lines">
                {calc.lines.map((l) => (
                  <li key={l.name}><span>{l.name}</span><span>{money(l.amount, cur)}</span></li>
                ))}
              </ul>
              <div className="q-total">
                <span>Estimated total</span>
                <strong>{money(calc.oneTime, cur)}</strong>
              </div>
              <p className="q-range">Typical range {money(calc.low, cur)} – {money(calc.high, cur)} · {calc.pkg.weeks}</p>
              {calc.monthly > 0 && <p className="q-monthly">+ {money(calc.monthly, cur)} / month ongoing</p>}
              {step === 'build' && (
                <button type="button" className="btn btn-primary btn-lg q-cta" onClick={goDetails}>
                  Get my quotation <span aria-hidden="true">→</span>
                </button>
              )}
              <p className="form-note">
                {cur === 'INR' && !quoteSettings.gstPercent ? 'Taxes extra as applicable. ' : ''}
                Final price is confirmed after a free 30-minute scoping call.
              </p>
            </aside>
          </div>
        </section>
      )}

      {step === 'quote' && quote && (
        <section className="section quote-result" aria-label="Your quotation">
          <div className="wrap">
            <div className="q-actions" role="status">
              <p>
                {sendState === 'sending' && 'Saving your quotation…'}
                {sendState === 'sent' && `Quotation ${quote.number} is ready. Our team has a copy and will contact ${client.email} within one working day.`}
                {sendState === 'failed' && (
                  <>We couldn&rsquo;t send a copy to our team automatically. <a href={mailto}>Email it to us instead</a> — everything is already filled in.</>
                )}
              </p>
              <div className="q-actions-btns">
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>Download PDF / Print</button>
                <a className="btn btn-ghost" href="#contact">Book a scoping call</a>
                <button type="button" className="btn btn-ghost" onClick={() => { setStep('build'); setQuote(null); setSendState('idle'); }}>Edit quotation</button>
              </div>
            </div>
            <QuoteDocument quote={quote} client={client} />
          </div>
        </section>
      )}

      <Contact preselect={cat.pillar} />
    </div>
  );
}

function QField({ id, label, error, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={`q-${id}`}>{label}</label>
      {children}
      {error && <p className="err" id={`qe-${id}`}>{error}</p>}
    </div>
  );
}

function QuoteDocument({ quote, client }) {
  const { calc, cur } = quote;
  return (
    <article className="quote-doc" id="quote-doc">
      <header className="qd-head">
        <img src={logoUrl} alt="Bhumaji Systems" width="168" height="42" />
        <div className="qd-head-meta">
          <p className="qd-label">QUOTATION</p>
          <p className="qd-number">{quote.number}</p>
        </div>
      </header>

      <div className="qd-parties">
        <div>
          <p className="qd-label">From</p>
          <p><strong>{site.name}</strong></p>
          <p>Bengaluru, Karnataka, India</p>
          <p>{site.contactEmail} · www.{site.domain}</p>
        </div>
        <div>
          <p className="qd-label">Prepared for</p>
          <p><strong>{client.name}</strong></p>
          {client.company && <p>{client.company}</p>}
          <p>{client.email}{client.phone ? ` · ${client.phone}` : ''}</p>
          {client.country && <p>{client.country}</p>}
        </div>
        <div>
          <p className="qd-label">Date</p>
          <p>{fmtDate(quote.date)}</p>
          <p className="qd-label">Valid until</p>
          <p>{fmtDate(quote.validUntil)}</p>
        </div>
      </div>

      <p className="qd-scope"><strong>{calc.cat.title}:</strong> {calc.pkg.name} — {calc.pkg.detail}. Estimated delivery {calc.pkg.weeks}.</p>

      <table className="qd-table">
        <thead>
          <tr><th scope="col">#</th><th scope="col">Item</th><th scope="col">Amount ({cur})</th></tr>
        </thead>
        <tbody>
          {calc.lines.map((l, i) => (
            <tr key={l.name}>
              <td>{i + 1}</td>
              <td>{l.name}{l.note && <span className="qd-note">{l.note}</span>}</td>
              <td>{money(l.amount, cur)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td /><td>Subtotal</td><td>{money(calc.oneTime, cur)}</td></tr>
          {calc.gst > 0 && <tr><td /><td>GST ({quoteSettings.gstPercent}%)</td><td>{money(calc.gst, cur)}</td></tr>}
          <tr className="qd-grand"><td /><td>Total (one-time)</td><td>{money(calc.total, cur)}</td></tr>
        </tfoot>
      </table>

      {calc.monthlyLines.length > 0 && (
        <table className="qd-table qd-monthly">
          <thead><tr><th scope="col" colSpan={2}>Ongoing services</th><th scope="col">Per month</th></tr></thead>
          <tbody>
            {calc.monthlyLines.map((l) => (
              <tr key={l.name}><td colSpan={2}>{l.name}</td><td>{money(l.amount, cur)}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      {client.notes && <p className="qd-scope"><strong>Client notes:</strong> {client.notes}</p>}

      <div className="qd-terms">
        <p className="qd-label">Terms</p>
        <ol>
          <li>This is an estimate based on the options selected. The final price is confirmed in a written proposal after a free scoping call; it typically falls between {money(calc.low, cur)} and {money(calc.high, cur)}.</li>
          <li>Payment schedule: 40% to start, 40% at the main milestone, 20% on delivery.</li>
          <li>{cur === 'INR' ? (quoteSettings.gstPercent ? 'Prices include GST as shown.' : 'Taxes extra as applicable.') : 'Prices in US dollars. Bank charges and local taxes, if any, are extra.'}</li>
          <li>Third-party costs (cloud hosting, app store accounts, paid plugins, domains) are billed at actual cost unless listed above.</li>
          <li>This quotation is valid for {quoteSettings.validDays} days from the date above.</li>
        </ol>
      </div>

      <footer className="qd-foot">
        <span>{site.name} · {site.tagline}</span>
        <span>Accept or ask questions: {site.contactEmail}</span>
      </footer>
    </article>
  );
}
