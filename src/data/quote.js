/*
 * Price list for the instant quotation page (/quote/).
 * Edit prices here: every amount is the typical price for that item, in INR (Indian clients)
 * and USD (international clients). The page shows the visitor an estimate range around the total.
 */

export const quoteSettings = {
  // The estimate range shown to visitors: total × low … total × high.
  rangeLow: 0.85,
  rangeHigh: 1.2,
  // How long a generated quotation stays valid.
  validDays: 15,
  // Set to 18 once Bhumaji Systems is GST-registered; Indian quotes then add GST.
  gstPercent: 0,
  // Prefix for quotation numbers, e.g. BS-Q-261102-4821.
  numberPrefix: 'BS-Q',
};

export const currencies = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', label: 'India (₹ INR)' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', label: 'International ($ USD)' },
};

/*
 * Each category: packages (pick one), add-ons (pick any), and optional multipliers.
 * Amounts: { INR, USD }. `monthly: true` marks a recurring monthly charge.
 */
export const quoteCatalog = [
  {
    id: 'website',
    pillar: 'mobile',
    tone: 'blue',
    title: 'Website Development',
    blurb: 'Business websites, e-commerce stores and web portals.',
    packages: [
      { id: 'landing', name: 'Landing page / starter site', detail: '1–5 pages, responsive, contact form, basic SEO', weeks: '1–2 weeks', price: { INR: 25000, USD: 700 } },
      { id: 'business', name: 'Business website', detail: '6–20 pages, custom design, SEO setup, blog, analytics', weeks: '3–5 weeks', price: { INR: 75000, USD: 2200 } },
      { id: 'ecommerce', name: 'E-commerce website', detail: 'Product catalogue, cart, checkout, orders, admin', weeks: '5–8 weeks', price: { INR: 175000, USD: 5500 } },
      { id: 'portal', name: 'Custom web application / portal', detail: 'Logins, dashboards, roles, database, APIs', weeks: '6–12 weeks', price: { INR: 350000, USD: 11000 } },
    ],
    addons: [
      { id: 'extra-pages', name: '10 extra pages', price: { INR: 15000, USD: 450 } },
      { id: 'payment', name: 'Payment gateway (Razorpay / Stripe)', price: { INR: 20000, USD: 600 } },
      { id: 'cms', name: 'Content management (edit pages yourself)', price: { INR: 20000, USD: 600 } },
      { id: 'multilang', name: 'Multi-language', price: { INR: 25000, USD: 700 } },
      { id: 'seo', name: 'SEO package (on-page + Google Business setup)', price: { INR: 20000, USD: 500 } },
      { id: 'copy', name: 'Content writing', price: { INR: 15000, USD: 450 } },
      { id: 'chatbot', name: 'AI chatbot / WhatsApp chat', price: { INR: 35000, USD: 1000 } },
      { id: 'hosting', name: 'Hosting, SSL & domain setup (1 year)', price: { INR: 8000, USD: 200 } },
      { id: 'maint', name: 'Maintenance & updates', price: { INR: 5000, USD: 150 }, monthly: true },
    ],
    design: true,
  },
  {
    id: 'mobile',
    pillar: 'mobile',
    tone: 'blue',
    title: 'Mobile App Development',
    blurb: 'Android, iOS and cross-platform apps with a backend.',
    packages: [
      { id: 'starter', name: 'Starter app', detail: '5–8 screens, login, simple backend (Firebase)', weeks: '4–6 weeks', price: { INR: 225000, USD: 6000 } },
      { id: 'business', name: 'Business app', detail: '10–20 screens, admin panel, API backend, push notifications', weeks: '8–14 weeks', price: { INR: 700000, USD: 21000 } },
      { id: 'advanced', name: 'Advanced app', detail: 'Payments, real-time features, multiple user roles, AWS backend', weeks: '3–6 months', price: { INR: 1750000, USD: 52000 } },
      { id: 'ondemand', name: 'On-demand platform (Uber / Swiggy style)', detail: 'Customer + partner apps + admin, scalable cloud', weeks: '6–12 months', price: { INR: 3500000, USD: 100000 } },
    ],
    platforms: [
      { id: 'android', name: 'Android only', factor: 1 },
      { id: 'ios', name: 'iOS only', factor: 1.1 },
      { id: 'cross', name: 'Android + iOS (cross-platform)', factor: 1.4 },
      { id: 'native', name: 'Android + iOS (separate native apps)', factor: 1.8 },
    ],
    addons: [
      { id: 'payment', name: 'Payment gateway (Razorpay / Stripe)', price: { INR: 45000, USD: 1200 } },
      { id: 'admin', name: 'Web admin dashboard', price: { INR: 100000, USD: 2800 } },
      { id: 'chat', name: 'Real-time chat', price: { INR: 85000, USD: 2500 } },
      { id: 'maps', name: 'Maps & live GPS tracking', price: { INR: 100000, USD: 2800 } },
      { id: 'otp', name: 'OTP / social login', price: { INR: 22000, USD: 600 } },
      { id: 'multilang', name: 'Multi-language', price: { INR: 35000, USD: 850 } },
      { id: 'ai', name: 'AI features (chatbot, recommendations)', price: { INR: 180000, USD: 5000 } },
      { id: 'publish', name: 'App Store & Play Store publishing', price: { INR: 15000, USD: 400 } },
      { id: 'maint', name: 'Maintenance & support', price: { INR: 25000, USD: 700 }, monthly: true },
    ],
    design: true,
  },
  {
    id: 'cloud',
    pillar: 'cloud',
    tone: 'cyan',
    title: 'Cloud & DevOps',
    blurb: 'AWS / Azure / GCP setup, migration, Kubernetes and CI/CD.',
    packages: [
      { id: 'setup', name: 'Cloud foundation setup', detail: 'Accounts, VPC, IAM, security baseline, Terraform', weeks: '2–3 weeks', price: { INR: 120000, USD: 3500 } },
      { id: 'cicd', name: 'CI/CD pipeline', detail: 'GitHub Actions / Jenkins / Argo CD, automated deploys', weeks: '1–3 weeks', price: { INR: 90000, USD: 2800 } },
      { id: 'k8s', name: 'Kubernetes / EKS platform', detail: 'Cluster, ingress, autoscaling, GitOps, Helm charts', weeks: '3–6 weeks', price: { INR: 250000, USD: 7500 } },
      { id: 'migration', name: 'Cloud migration (small–medium)', detail: 'Assessment, plan, migrate workloads with minimal downtime', weeks: '4–10 weeks', price: { INR: 600000, USD: 18000 } },
      { id: 'audit', name: 'Cloud cost & security audit', detail: 'Findings report with savings and fixes', weeks: '1–2 weeks', price: { INR: 60000, USD: 1800 } },
    ],
    addons: [
      { id: 'monitoring', name: 'Monitoring (Prometheus / Grafana / CloudWatch)', price: { INR: 60000, USD: 1800 } },
      { id: 'dr', name: 'Backup & disaster recovery', price: { INR: 75000, USD: 2200 } },
      { id: 'security', name: 'Security hardening & compliance checks', price: { INR: 80000, USD: 2400 } },
      { id: 'iac', name: 'Full Infrastructure as Code (Terraform)', price: { INR: 70000, USD: 2000 } },
      { id: 'training', name: 'Team handover & training', price: { INR: 25000, USD: 700 } },
      { id: 'managed', name: 'Managed DevOps / SRE support', price: { INR: 100000, USD: 3000 }, monthly: true },
    ],
  },
  {
    id: 'software',
    pillar: 'software',
    tone: 'lime',
    title: 'Software Engineering',
    blurb: 'Custom software, APIs, backends and modernisation.',
    packages: [
      { id: 'api', name: 'API / backend service', detail: 'REST or GraphQL APIs, database, authentication', weeks: '3–6 weeks', price: { INR: 200000, USD: 6000 } },
      { id: 'custom', name: 'Custom business software', detail: 'Workflows, dashboards, reports, user roles', weeks: '2–4 months', price: { INR: 600000, USD: 18000 } },
      { id: 'enterprise', name: 'Enterprise application', detail: 'Microservices, integrations, high availability', weeks: '4–8 months', price: { INR: 1800000, USD: 55000 } },
      { id: 'modernise', name: 'Legacy modernisation', detail: 'Move an old system to a modern stack and cloud', weeks: '2–6 months', price: { INR: 900000, USD: 27000 } },
    ],
    addons: [
      { id: 'integrations', name: 'Third-party integrations (per 3 systems)', price: { INR: 60000, USD: 1800 } },
      { id: 'reporting', name: 'Reports & analytics dashboard', price: { INR: 80000, USD: 2400 } },
      { id: 'testing', name: 'Automated testing suite', price: { INR: 60000, USD: 1800 } },
      { id: 'cicd', name: 'CI/CD & cloud deployment', price: { INR: 60000, USD: 1800 } },
      { id: 'maint', name: 'Maintenance & support', price: { INR: 40000, USD: 1200 }, monthly: true },
    ],
  },
  {
    id: 'ai',
    pillar: 'ai',
    tone: 'teal',
    title: 'AI / ML & MLOps',
    blurb: 'AI chatbots, generative AI and ML deployment pipelines.',
    packages: [
      { id: 'chatbot', name: 'AI chatbot / assistant', detail: 'Trained on your documents, website or WhatsApp', weeks: '2–4 weeks', price: { INR: 150000, USD: 4500 } },
      { id: 'genai', name: 'Generative AI integration', detail: 'Add AI features to an existing app or workflow', weeks: '3–6 weeks', price: { INR: 300000, USD: 9000 } },
      { id: 'mlops', name: 'MLOps pipeline', detail: 'Training, deployment and monitoring pipeline (MLflow, Kubernetes)', weeks: '4–8 weeks', price: { INR: 500000, USD: 15000 } },
      { id: 'custom-ml', name: 'Custom ML model', detail: 'Data preparation, model build and deployment', weeks: '2–4 months', price: { INR: 800000, USD: 24000 } },
    ],
    addons: [
      { id: 'data', name: 'Data pipeline & cleaning', price: { INR: 100000, USD: 3000 } },
      { id: 'monitoring', name: 'Model monitoring & alerts', price: { INR: 60000, USD: 1800 } },
      { id: 'ui', name: 'Web interface for the AI tool', price: { INR: 80000, USD: 2400 } },
      { id: 'managed', name: 'Managed AI operations', price: { INR: 60000, USD: 1800 }, monthly: true },
    ],
  },
];

export const designLevels = [
  { id: 'template', name: 'Template-based', note: 'Fastest and lowest cost', factor: 1 },
  { id: 'custom', name: 'Custom design', note: 'Designed for your brand', factor: 1.2 },
  { id: 'premium', name: 'Premium design', note: 'Figma prototypes, animations', factor: 1.4 },
];

export const timelines = [
  { id: 'normal', name: 'Standard timeline', factor: 1 },
  { id: 'urgent', name: 'Urgent (priority team)', factor: 1.25 },
];
