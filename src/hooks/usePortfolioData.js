import { useEffect, useState } from 'react';
import adminAidigest from '../images/serviceopsimages/adminimages/aidigest.png';
import adminDocumentHub from '../images/serviceopsimages/adminimages/documenthub.png';
import adminJobsTable from '../images/serviceopsimages/adminimages/jobstable.png';
import adminMissionControl from '../images/serviceopsimages/adminimages/missioncontrol.png';
import adminMissionControl2 from '../images/serviceopsimages/adminimages/missioncontrol2.png';
import adminSummary from '../images/serviceopsimages/adminimages/summary.png';

const fallbackProfile = {
  name: 'Akosile Olaide Joseph',
  roleTitle: 'Intelligent Operations Automation Engineer',
  heroHeadline: 'AI automation systems for end-to-end data operations and workflow execution.',
  heroSubtext:
    'I design operational leverage: systems that absorb complexity and remove manual touch points. Automating workflows, reducing ops load, and scaling teams without headcount.',
  heroBadges: [
    '✔ End-to-end workflow automation',
    '✔ Intelligent decision systems',
    '✔ Routing & SLA engines',
    '✔ Voice & text automation',
    '✔ Dashboards, reporting & audit',
  ],
  about:
    'An Intelligent Operations Automation Engineer who builds AI-powered systems that solve real business problems. I have spent 3 years developing production-grade systems across healthcare, logistics, customer service automation, and fintech innovation.',
  skillIcons: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'API Design', 'Automation', 'AI Logic'],
  howIWork: [
    'Map messy operations into clear, automated workflows',
    'Design API and RBAC contracts before code lands',
    'Ship with validation, observability, and rollback plans',
    'Document decisions so distributed teams stay aligned',
  ],
  skills: [
    {
      label: 'Backend Development',
      items: [
        'Node.js',
        'Express',
        'REST APIs',
        'Authentication / RBAC',
        'Event-driven architecture',
        'Message queues (Kafka / NATS patterns)',
        'Workflow engine design',
        'Rate limiting & throttling',
        'Error handling frameworks',
        'System resilience patterns (circuit breakers, retries)',
      ],
    },
    {
      label: 'Frontend Systems',
      items: [
        'React',
        'Component systems',
        'Dashboard UX',
        'Animation polish',
        'Optimized forms & data flows',
        'Custom hooks & state machines',
        'API-driven UI architecture',
        'Admin panel / operations UX patterns',
      ],
    },
    {
      label: 'Databases',
      items: [
        'MongoDB',
        'Schema design',
        'Indexing and performance',
        'Aggregation pipelines',
        'TTL jobs + scheduled tasks',
        'Data modeling for workflows',
        'Distributed locks (Mongo / Redis patterns)',
        'Caching strategies',
      ],
    },
    {
      label: 'Automation & AI',
      items: [
        'Voice AI',
        'Workflow engines',
        'Prompt design',
        'Operational copilots',
        'AI safety guardrails',
        'Intent-routing logic',
        'Decision-tree automation',
        'AI to workflow execution mapping',
      ],
    },
    {
      label: 'Rapid Learning',
      items: [
        'TypeScript + NestJS in 2 weeks',
        'Kafka / NATS ready',
        'Next.js / React Native in 3-4 weeks',
        'Fast adoption of new automation stacks',
        'Understanding new operational domains quickly',
      ],
    },
    {
      label: 'System Architecture',
      items: [
        'Distributed system thinking',
        'Scalable service design',
        'Workflow orchestration',
        'API contract-first design',
        'Rollback plans',
      ],
    },
    {
      label: 'Operational Engineering',
      items: [
        'SLA-based automation design',
        'Routing logic for operations',
        'Incident-ready architecture',
        'Audit trail design',
        'Business logic modeling',
      ],
    },
  ],
  contacts: {
    email: 'olaideakosile35@gmail.com',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/olaide__akosile',
    calendly: 'https://calendly.com/',
    resumeUrl: '/resume.pdf',
  },
};

const fallbackProjects = [
  {
    title: 'ServiceOps - Operations Automation Platform',
    summary: 'AI-driven workflow automation for a tow truck company handling end-to-end operations.',
    description:
      'Built for a tow truck company to handle end-to-end operations where every decision and data flow is fully automated—dispatch, routing, ETAs, customer updates, and auditable SLA timers.',
    stack: ['Node.js', 'Automation', 'Workflow Engine'],
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT', 'RBAC'],
    features: [
      'Automates about 70% of dispatch, ETA updates, and customer notifications',
      'AI suggestions pick the best vendor and route for each job',
      'Scenario-based runbooks with escalation guardrails',
    ],
    coverImage: adminMissionControl,
    media: [
      { imageUrl: adminMissionControl, originalName: 'ServiceOps admin dashboard - Mission Control (live overview)' },
      { imageUrl: adminMissionControl2, originalName: 'ServiceOps admin dashboard - Mission Control (drill-down)' },
      { imageUrl: adminJobsTable, originalName: 'ServiceOps admin dashboard - jobs and dispatch board' },
      { imageUrl: adminAidigest, originalName: 'ServiceOps admin dashboard - AI digest' },
      { imageUrl: adminSummary, originalName: 'ServiceOps admin dashboard - summary and insights' },
      { imageUrl: adminDocumentHub, originalName: 'ServiceOps admin dashboard - document hub and SOPs' },
    ],
    theme: 'aqua',
    caseStudyRef: '#case-serviceops',
    links: { live: 'https://serviceops.pro', video: 'https://www.loom.com/share/serviceops-demo' },
  },
  {
    title: 'AI-Enhanced EMR System',
    summary: 'Built a complete hospital record system with AI-driven clinical support.',
    description:
      'End-to-end EMR with intake, charting, orders, and AI assistance for clinicians. Role-based access, audit trails, and safety rails for protected data.',
    stack: ['Node.js', 'EMR', 'Healthcare', 'AI Assistant'],
    tech: ['Node.js', 'Express', 'MongoDB', 'RBAC'],
    features: ['AI-assisted chart drafting', 'Orders and medication guardrails', 'Audit-ready reporting and exports'],
    theme: 'orchid',
    caseStudyRef: '#case-emr',
    links: { video: '#', live: '#case-studies' },
  },
  {
    title: 'Voice AI Platform',
    summary: 'Customizable voice assistant with 99% accurate speech recognition.',
    description:
      'Voice pipelines with wake-word detection, transcription, intent routing, and real-time responses. Built for customer support teams that need hands-free speed.',
    stack: ['AI', 'Voice Processing', 'Real-time'],
    tech: ['LLM prompts', 'WebSockets', 'Edge transcription'],
    features: ['Low-latency streaming', 'Intent routing to workflows', 'Analytics on calls and completions'],
    theme: 'amber',
    caseStudyRef: '#case-voice',
    links: { video: '#', live: '#case-studies' },
  },
  {
    title: 'Fintech Cashback System',
    summary: 'Cashback and predictive AI model for grocery stores (in development).',
    description:
      'Personalized offers, spend forecasts, and fraud-aware guardrails. Designed to plug into POS systems with minimal integration effort.',
    stack: ['Fintech', 'AI Personalization'],
    tech: ['Node.js', 'MongoDB', 'Recommendation logic'],
    features: ['Predictive cashback offers', 'Spend and basket modeling', 'Fraud-aware triggers'],
    theme: 'slate',
    caseStudyRef: '#case-fintech',
    links: { live: '#', video: '#case-studies' },
  },
];

const fallbackCaseStudies = [
  {
    slug: 'serviceops',
    title: 'ServiceOps - Operations Automation Platform',
    badge: 'Operations AI',
    overview:
      'A control plane for a tow truck company, automating dispatch, routing, ETA comms, and customer updates—end-to-end decisions and data flows handled automatically.',
    responsibilities: ['System design and API contracts', 'Workflow engine plus SLA timers', 'Vendor and customer communications rails'],
    architectureNotes: [
      'Workflow engine with retries, fallbacks, and auditable actions',
      'JWT and RBAC with scoped dashboards for admin, vendor, and customer roles',
      'Geo routing with live ETA timers and breach warnings',
      'GridFS-backed evidence and SOP document hub',
    ],
    features: [
      'Mission Control dashboard with live job states and SLA heatmap',
      'AI vendor suggestions and route planning',
      'Scenario runbooks with escalation guardrails',
      'Customer-ready status pages and SMS updates',
    ],
    results: [
      'Automated about 70% of dispatch and communications',
      'SLA adherence improved with live breach warnings',
      'Clear audit trails lowered coordination friction',
    ],
    links: { live: 'https://serviceops.pro', demo: 'https://www.loom.com/share/serviceops-demo' },
  },
  {
    slug: 'emr',
    title: 'AI-Enhanced EMR System',
    badge: 'Healthcare',
    overview:
      'Built a complete EMR with AI-assisted charting, orders, and reporting. Role-based access ensures PHI safety while keeping clinicians fast.',
    responsibilities: ['Clinical workflow mapping', 'RBAC and audit-ready data model', 'AI-assisted chart experiences'],
    architectureNotes: [
      'Modular services for intake, charting, orders, and billing',
      'Role-based access with scoped tokens and audit logs',
      'AI co-pilot for chart drafting with guardrails on hallucinations',
      'Export pipelines for regulatory reporting',
    ],
    features: ['Chart drafting assist', 'Order sets with validation', 'Insights and alerts for clinicians'],
    results: ['Reduced charting time with AI assist', 'Improved data quality via validation and audits', 'Clear handoffs across care teams'],
    links: { demo: '#', live: '#case-studies' },
  },
  {
    slug: 'voice',
    title: 'Voice AI Platform',
    badge: 'Voice AI',
    overview:
      'Customizable voice assistant with wake-word, transcription, and intent routing for support teams that need hands-free speed.',
    responsibilities: ['Voice pipeline design', 'LLM prompt engineering', 'Real-time orchestration'],
    architectureNotes: [
      'Streaming transcription with partial-result buffering',
      'Intent router that maps calls to workflows and APIs',
      'Fallbacks to human agents with context handoff',
      'Analytics layer for call quality and completion',
    ],
    features: ['Low-latency streaming and responses', 'Workflow routing by intent', 'Scorecards per call'],
    results: ['High accuracy recognition target', 'Hands-free support flows with audit trails', 'Faster handling for repetitive requests'],
    links: { demo: '#', live: '#case-studies' },
  },
  {
    slug: 'fintech',
    title: 'Fintech Cashback System',
    badge: 'Fintech',
    overview:
      'Cashback plus predictive AI model for grocery stores. Personalized offers, spend forecasts, and fraud-aware guardrails.',
    responsibilities: ['Reward logic and data model', 'API design for POS integrations', 'Fraud and safety guardrails'],
    architectureNotes: [
      'Offer engine with predictive scoring and caps',
      'Event ingestion from POS with validation',
      'Audit logging for payouts and adjustments',
      'Export-ready reporting for finance teams',
    ],
    features: ['Predictive cashback offers', 'Spend and basket modeling', 'Fraud-aware triggers and alerts'],
    results: ['In-development prototype with offer simulation', 'Designed for minimal integration lift', 'AI personalization roadmap defined'],
    links: { demo: '#', live: '#case-studies' },
  },
];

export function usePortfolioData() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState(fallbackCaseStudies);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let isMounted = true;
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

    async function load() {
      setStatus('loading');
      try {
        const [pRes, projRes, csRes] = await Promise.all([
          fetch(`${base}/api/profile/public`),
          fetch(`${base}/api/projects/public`),
          fetch(`${base}/api/case-studies/public`),
        ]);

        const profileJson = pRes.ok ? await pRes.json() : fallbackProfile;
        const projectsJson = projRes.ok ? await projRes.json() : fallbackProjects;
        const caseJson = csRes.ok ? await csRes.json() : fallbackCaseStudies;

        if (!isMounted) return;
        setProfile(profileJson || fallbackProfile);
        setProjects(Array.isArray(projectsJson) ? projectsJson : fallbackProjects);
        const resolvedCases =
          Array.isArray(caseJson) && caseJson.length > 0 ? caseJson : fallbackCaseStudies;

        setCaseStudies(resolvedCases);
        setStatus('ready');
      } catch (err) {
        if (!isMounted) return;
        setProfile(fallbackProfile);
        setProjects(fallbackProjects);
        setCaseStudies(fallbackCaseStudies);
        setStatus('fallback');
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, projects, caseStudies, status };
}
