/*
 * All editable website copy lives here.
 * Engagements describe the kind of work we deliver (no client names or results).
 * Add real case studies and testimonials only with client approval.
 */

export const site = {
  name: 'Bhumaji Systems',
  tagline: 'Cloud. Intelligence. Engineering.',
  domain: 'bhumaji.com',
  // Add your real contact details here before launch.
  contactEmail: 'info@bhumaji.com',
  // Enquiry form submissions are emailed here through Web3Forms (https://web3forms.com).
  enquiryEmail: 'info@bhumaji.com',
  // Web3Forms access key created for enquiryEmail. It is public by design (safe in website code).
  // Paste it here, or set the repository variable WEB3FORMS_KEY.
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || '0b00f561-768d-4917-b1f9-f7048dac2e7d',
  phone: '',
  location: 'Bengaluru, India · Serving clients worldwide',
  // URL of the deployed whatsapp-bridge Worker (e.g. https://bhumaji-chat-bridge.<account>.workers.dev).
  // Leave empty until the Worker is live; the chat box then hands messages to the enquiry form.
  chatApiUrl: import.meta.env.VITE_CHAT_API_URL || '',
};

// Social media profiles shown under the logo in the footer.
// Paste each full profile URL; until a URL is set the icon shows but is not clickable.
export const social = [
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/bhumajisystems/' },
  { id: 'linkedin', label: 'LinkedIn', url: '' },
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@bhumajisystems' },
  { id: 'x', label: 'X', url: '' },
];

export const hero = {
  eyebrow: 'Cloud · Intelligence · Engineering',
  lineOne: 'Engineering the Future.',
  lineTwo: 'Powering Digital Transformation.',
  body:
    'From cloud infrastructure and intelligent operations to software and application development, we help businesses build, modernize and scale technology with confidence.',
  primaryCta: { label: 'Explore Our Expertise', href: '#what-we-do' },
  secondaryCta: { label: "Let's Talk", href: '#contact' },
};

export const pillars = [
  {
    id: 'cloud',
    route: 'service-cloud',
    // Real URL for this page; route is the old '#service-…' link, kept so shared links still work.
    path: '/services/cloud-services-migration/',
    seoTitle: 'Cloud Services & Cloud Migration Company in Bengaluru | AWS, Azure, GCP',
    seoDescription: 'Cloud consulting, AWS, Azure and Google Cloud migration, Kubernetes, Terraform and DevOps services from Bengaluru. Bhumaji Systems designs, migrates and runs secure, cost-optimized cloud platforms.',
    faqs: [
      { q: 'Which cloud platforms do you work with?', a: 'We design, migrate and run workloads on Amazon Web Services (AWS), Microsoft Azure and Google Cloud, including hybrid and multi-cloud setups.' },
      { q: 'Can you migrate our existing applications to the cloud?', a: 'Yes. We plan migrations in waves, each with a rollback path, monitoring from day one and a cost baseline, so your business keeps running while systems move.' },
      { q: 'Do you work with businesses outside Bengaluru?', a: 'Yes. We are based in Bengaluru, India and work with startups, growing businesses and enterprises across India and worldwide.' },
    ],
    tone: 'cyan',
    code: 'CLD',
    title: 'Cloud Services & Migration',
    short: 'Cloud',
    lede: 'Landing zones, migrations and platforms built to run for years, not quarters.',
    description:
      'We design, migrate and operate infrastructure on AWS, Azure and Google Cloud, with Kubernetes, Infrastructure as Code and the security and cost controls an enterprise expects.',
    items: [
      'AWS, Microsoft Azure and Google Cloud',
      'Cloud architecture and infrastructure',
      'Cloud migration and modernization',
      'Hybrid and multi-cloud solutions',
      'Kubernetes and container platforms',
      'Infrastructure as Code',
      'Cloud security and governance',
      'Cloud cost optimization',
      'Disaster recovery and high availability',
    ],
    approach:
      'Every engagement starts with a landing zone that is versioned, policy-checked and repeatable. Workloads then move in waves, each with a rollback path, observability from day one and a cost baseline you can track.',
  },
  {
    id: 'ai',
    route: 'service-ai',
    // Real URL for this page; route is the old '#service-…' link, kept so shared links still work.
    path: '/services/ai-ml-mlops/',
    seoTitle: 'AI & Machine Learning Development and MLOps Services in Bengaluru',
    seoDescription: 'AI and machine learning development, generative AI integration and MLOps services from Bengaluru. Bhumaji Systems takes models from experiment to reliable, monitored production.',
    faqs: [
      { q: 'What AI services do you offer?', a: 'We build machine learning solutions, integrate generative AI into existing products, and set up the MLOps pipelines, infrastructure and monitoring that keep models reliable in production.' },
      { q: 'Can you add generative AI to our existing application?', a: 'Yes. We integrate generative AI features into existing software through well-designed APIs, with evaluation, monitoring and data governance built in.' },
      { q: 'Do you work with businesses outside Bengaluru?', a: 'Yes. We are based in Bengaluru, India and work with clients across India and worldwide.' },
    ],
    tone: 'teal',
    code: 'AI/ML',
    title: 'AI / ML & MLOps',
    short: 'AI & MLOps',
    lede: 'Models that leave the notebook and earn their place in production.',
    description:
      'We build the pipelines, infrastructure and monitoring that take machine learning and generative AI from experiment to reliable, governed production systems.',
    items: [
      'AI and machine learning solutions',
      'MLOps architecture and implementation',
      'Model training and deployment pipelines',
      'Model monitoring and observability',
      'ML infrastructure and automation',
      'Generative AI integration',
      'Data and model lifecycle management',
    ],
    approach:
      'We treat models like software: versioned data and artefacts, automated training and evaluation, gated promotion to production and drift monitoring that tells you when a model needs attention.',
  },
  {
    id: 'software',
    route: 'service-software',
    // Real URL for this page; route is the old '#service-…' link, kept so shared links still work.
    path: '/services/software-development/',
    seoTitle: 'Custom Software Development Company in Bengaluru | Enterprise, API & Backend',
    seoDescription: 'Custom software development company in Bengaluru: enterprise applications, backend and API development, microservices, legacy modernization and DevOps CI/CD automation by Bhumaji Systems.',
    faqs: [
      { q: 'What kind of software do you build?', a: 'Custom and enterprise applications, backends, APIs and integrations, microservices and databases, along with the CI/CD pipelines that make every release routine.' },
      { q: 'Can you modernize our legacy system?', a: 'Yes. We modernize legacy systems step by step behind stable interfaces, so the business keeps running while the code changes.' },
      { q: 'Do you work with businesses outside Bengaluru?', a: 'Yes. We are based in Bengaluru, India and work with clients across India and worldwide.' },
    ],
    tone: 'lime',
    code: 'ENG',
    title: 'Software Engineering',
    short: 'Software',
    lede: 'Backends, APIs and platforms engineered for the load you are planning for.',
    description:
      'Custom and enterprise software built on clean service boundaries, well-designed APIs and delivery pipelines that make every release routine.',
    items: [
      'Custom software development',
      'Enterprise application development',
      'Backend engineering',
      'API development and integration',
      'Microservices architecture',
      'Database engineering',
      'Legacy modernization',
      'DevOps and CI/CD automation',
    ],
    approach:
      'Small, senior teams own a service end to end: design, code, tests, pipelines and runbooks. Legacy systems are modernized incrementally behind stable interfaces, so the business keeps running while the code changes.',
  },
  {
    id: 'mobile',
    route: 'service-mobile',
    // Real URL for this page; route is the old '#service-…' link, kept so shared links still work.
    path: '/services/mobile-app-website-development/',
    seoTitle: 'Mobile App & Website Development Company in Bengaluru | Android, iOS, Web',
    seoDescription: 'Mobile app and website development company in Bengaluru: Android and iOS apps, cross-platform apps, web applications and UI/UX design by Bhumaji Systems.',
    faqs: [
      { q: 'Do you build both Android and iOS apps?', a: 'Yes. We build native Android and iOS apps as well as cross-platform apps that share one codebase, and publish them through automated store releases.' },
      { q: 'Do you also build websites and web applications?', a: 'Yes. We design and develop websites and web applications, from company websites to customer portals and internal tools, with UI/UX design included.' },
      { q: 'Do you work with businesses outside Bengaluru?', a: 'Yes. We are based in Bengaluru, India and work with clients across India and worldwide.' },
    ],
    tone: 'blue',
    code: 'APP',
    title: 'Mobile & Application Development',
    short: 'Mobile & Apps',
    lede: 'Native-quality apps on every screen your customers use.',
    description:
      'Android, iOS, cross-platform and web applications designed with your users, built on solid APIs and released through automated pipelines.',
    items: [
      'Android application development',
      'iOS application development',
      'Cross-platform applications',
      'Web application development',
      'UI/UX design',
      'Application modernization',
      'API and third-party integrations',
    ],
    approach:
      'Design and engineering work in the same sprint. We prototype the key journeys first, test them with real users, then build on a shared component system with automated store and web releases.',
  },
];

export const techRings = [
  {
    id: 'platform',
    label: 'Cloud & platform',
    note: 'Where workloads run',
    tone: 'cyan',
    items: [
      { name: 'AWS', role: 'Public cloud' },
      { name: 'Azure', role: 'Public cloud' },
      { name: 'Google Cloud', role: 'Public cloud' },
      { name: 'Kubernetes', role: 'Container orchestration' },
      { name: 'Docker', role: 'Containers' },
      { name: 'Terraform', role: 'Infrastructure as Code' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery & operations',
    note: 'How changes ship and stay healthy',
    tone: 'lime',
    items: [
      { name: 'Jenkins', role: 'CI/CD pipelines' },
      { name: 'GitHub Actions', role: 'CI/CD workflows' },
      { name: 'Argo CD', role: 'GitOps delivery' },
      { name: 'Prometheus', role: 'Metrics & alerting' },
    ],
  },
  {
    id: 'build',
    label: 'Data, AI & applications',
    note: 'What we build with',
    tone: 'teal',
    items: [
      { name: 'Python', role: 'Data & ML engineering' },
      { name: 'TensorFlow', role: 'Model training' },
      { name: 'PyTorch', role: 'Model training' },
      { name: 'MLflow', role: 'Model lifecycle' },
      { name: 'React', role: 'Web interfaces' },
      { name: 'Node.js', role: 'Services & APIs' },
      { name: 'PostgreSQL', role: 'Relational data' },
    ],
  },
];

export const industries = [
  {
    id: 'bfsi',
    name: 'Banking & Financial Services',
    short: 'BFSI',
    pressure: 'Regulated workloads, zero tolerance for downtime and auditors who ask for evidence.',
    build: ['Compliant landing zones', 'Real-time fraud scoring', 'Core-system API layers'],
    change: 'Releases move from quarterly windows to controlled, audited weekly changes.',
    wave: [3, 0.6, 1.2],
  },
  {
    id: 'health',
    name: 'Healthcare',
    short: 'Health',
    pressure: 'Sensitive patient data spread across ageing systems that must keep running.',
    build: ['Secure data platforms', 'Interoperable APIs', 'Clinical-ops mobile apps'],
    change: 'Care teams get one reliable view of the data they need, protected end to end.',
    wave: [2, 0.9, 0.4],
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    short: 'Retail',
    pressure: 'Traffic that spikes tenfold on sale days and customers who leave after a slow page.',
    build: ['Autoscaling storefronts', 'Recommendation models', 'Omnichannel apps'],
    change: 'Peak days become planned capacity events instead of incident calls.',
    wave: [4, 0.5, 2.1],
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    short: 'Logistics',
    pressure: 'Fleets, partners and warehouses generating events faster than systems can use them.',
    build: ['Event-streaming backbones', 'Route & demand forecasting', 'Driver and ops apps'],
    change: 'Operations teams act on what is happening now, not on yesterday’s report.',
    wave: [2.5, 0.8, 3.0],
  },
  {
    id: 'saas',
    name: 'SaaS & Technology',
    short: 'SaaS',
    pressure: 'Multi-tenant platforms where every new customer adds load, cost and risk.',
    build: ['Multi-tenant Kubernetes', 'Platform engineering', 'Usage-aware cost controls'],
    change: 'Engineering ships features while the platform scales itself underneath.',
    wave: [3.5, 0.7, 0.9],
  },
  {
    id: 'startups',
    name: 'Startups & Emerging Businesses',
    short: 'Startups',
    pressure: 'A small team that needs enterprise-grade foundations without enterprise overhead.',
    build: ['MVP to scale architecture', 'Lean CI/CD from day one', 'App & API launches'],
    change: 'Founders keep their runway focused on product, not on rebuilding infrastructure.',
    wave: [5, 0.4, 1.6],
  },
];

export const process = [
  {
    name: 'Discover',
    line: 'Understand the business, the systems and the constraints.',
    activities: ['Stakeholder and architecture workshops', 'Current-state and cost assessment', 'Risk and dependency mapping'],
    outputs: ['Assessment report', 'Prioritised roadmap'],
  },
  {
    name: 'Architect',
    line: 'Design a target state that is secure, scalable and affordable.',
    activities: ['Reference and target architecture', 'Security and compliance design', 'Build-versus-buy decisions'],
    outputs: ['Architecture decision records', 'Delivery plan'],
  },
  {
    name: 'Build',
    line: 'Engineer the platform, software and pipelines in short increments.',
    activities: ['Infrastructure as Code', 'Application and API development', 'Automated testing'],
    outputs: ['Working increments every sprint', 'Versioned codebases'],
  },
  {
    name: 'Modernize',
    line: 'Move workloads and refactor legacy systems without disrupting the business.',
    activities: ['Wave-based migration', 'Strangler-pattern refactoring', 'Data migration and validation'],
    outputs: ['Migrated workloads', 'Rollback plans for every wave'],
  },
  {
    name: 'Automate',
    line: 'Make releases, scaling and recovery routine instead of heroic.',
    activities: ['CI/CD and GitOps', 'Policy as code', 'Self-healing and autoscaling'],
    outputs: ['Pipelines and runbooks', 'Automated guardrails'],
  },
  {
    name: 'Optimize',
    line: 'Measure what runs and keep improving cost, speed and reliability.',
    activities: ['Observability and SLOs', 'FinOps reviews', 'Performance tuning'],
    outputs: ['SLO dashboards', 'Quarterly optimisation backlog'],
  },
];

export const projects = [
  {
    id: 'p1',
    kind: 'Cloud migration',
    tone: 'cyan',
    title: 'Data-centre exit to AWS',
    challenge: 'Ageing on-premise hardware, a contract end date and workloads nobody wants to touch.',
    approach: 'A Terraform landing zone, migration in waves with a rollback plan for each, managed databases and central logging from day one.',
    stack: ['AWS', 'Terraform', 'PostgreSQL', 'Prometheus'],
    deliverables: [
      { value: 'Landing zone', label: 'versioned and policy-checked' },
      { value: 'Wave plan', label: 'with rollback for every move' },
    ],
  },
  {
    id: 'p2',
    kind: 'Kubernetes platform engineering',
    tone: 'teal',
    title: 'An internal developer platform on Kubernetes',
    challenge: 'Every team runs its own clusters, pipelines and conventions, and releases depend on a few experts.',
    approach: 'A shared EKS platform with Argo CD GitOps, golden-path service templates and self-service namespaces.',
    stack: ['Kubernetes', 'Argo CD', 'GitHub Actions', 'Terraform'],
    deliverables: [
      { value: 'Golden paths', label: 'from repo to first deploy' },
      { value: 'GitOps', label: 'every change reviewed and traceable' },
    ],
  },
  {
    id: 'p3',
    kind: 'AI/ML deployment automation',
    tone: 'teal',
    title: 'From notebook to production for ML models',
    challenge: 'Models retrained by hand, deployed by copying files and never monitored once live.',
    approach: 'An MLflow model registry, automated training pipelines, gated promotion to production and drift alerts.',
    stack: ['Python', 'PyTorch', 'MLflow', 'Kubernetes'],
    deliverables: [
      { value: 'Retraining', label: 'scheduled and automated' },
      { value: 'Rollback', label: 'to any registered model version' },
    ],
  },
  {
    id: 'p4',
    kind: 'Enterprise software development',
    tone: 'lime',
    title: 'Breaking up a monolith without stopping the business',
    challenge: 'A large legacy application that only a few people can change safely.',
    approach: 'A strangler-pattern rewrite into Node.js services behind a stable API gateway, one capability at a time.',
    stack: ['Node.js', 'PostgreSQL', 'Docker', 'Jenkins'],
    deliverables: [
      { value: 'Services', label: 'with clear ownership and tests' },
      { value: 'CI/CD', label: 'so releases become routine' },
    ],
  },
  {
    id: 'p5',
    kind: 'Mobile application development',
    tone: 'blue',
    title: 'A field-operations app for drivers and dispatch',
    challenge: 'Teams in the field working from paper sheets and phone calls.',
    approach: 'A cross-platform app with offline sync and live tracking, plus a React console for dispatchers.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'GitHub Actions'],
    deliverables: [
      { value: 'Android + iOS', label: 'from one codebase' },
      { value: 'Offline-first', label: 'works with patchy coverage' },
    ],
  },
];

export const principles = [
  {
    term: 'End-to-end capability',
    promise: 'Cloud, AI, software and apps from one accountable team.',
    practice: 'One roadmap, one delivery rhythm, no hand-offs between vendors.',
  },
  {
    term: 'Practical engineering',
    promise: 'Solutions sized to the problem, not to a slide deck.',
    practice: 'We pick proven tools first and explain every trade-off.',
  },
  {
    term: 'Scalable architecture',
    promise: 'Systems designed for the load you are planning for.',
    practice: 'Load-tested designs, documented limits and headroom plans.',
  },
  {
    term: 'Security & reliability',
    promise: 'Guardrails built in from the first commit.',
    practice: 'Least-privilege access, policy as code, SLOs and runbooks.',
  },
  {
    term: 'Automation-first delivery',
    promise: 'If it happens twice, it gets a pipeline.',
    practice: 'Infrastructure, tests, releases and recovery all automated.',
  },
  {
    term: 'Business-focused outcomes',
    promise: 'Engineering measured in cost, speed and uptime.',
    practice: 'Agreed success metrics reviewed with you every month.',
  },
];

export const insights = [
  { topic: 'Cloud migration', title: 'A wave plan for leaving the data centre without a freeze' },
  { topic: 'MLOps', title: 'What production-ready actually means for a machine learning model' },
  { topic: 'Platform engineering', title: 'Golden paths: giving product teams Kubernetes without the cognitive load' },
];

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'What We Do', href: '/#what-we-do', mega: 'services' },
  { label: 'Cloud Services', href: '/services/cloud-services-migration/' },
  { label: 'AI & MLOps', href: '/services/ai-ml-mlops/' },
  { label: 'Software Engineering', href: '/services/software-development/' },
  { label: 'Industries', href: '/#industries', mega: 'industries' },
  { label: 'Insights', href: '/#insights' },
  { label: 'About Us', href: '/#about' },
];
