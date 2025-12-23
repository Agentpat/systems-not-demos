/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import './qweMarkup.css';

const logoImage = `${process.env.PUBLIC_URL}/logo.jpg`;

const heroPills = [
  '4+ years building',
  'MERN - MongoDB - Node',
  'Dashboards - Workflows',
  'Monitoring - Auto-resolution',
  'Shipped: Service Ops Automation Platform (Chacon Strategies, Denver, CO)',
  'Building now: Voice AI Customer Service Embed (1-line install)',
];

const focusAreas = [
  { icon: 'gear', title: 'Workflow engines', body: 'Role routing, SLAs, approvals, escalations, and auditability.' },
  { icon: 'chart', title: 'Operational visibility', body: 'Dashboards that represent reality: signals, trends, incidents, and ownership.' },
  { icon: 'shield', title: 'Safe automation', body: 'Playbooks with verification, rollback, and escalation paths.' },
];

const features = [
  { icon: 'WF', pill: 'Workflows', title: 'Workflow & Approval Engines', body: 'Role-based steps, escalations, audit trails, SLAs, and automation hooks.' },
  { icon: 'MON', pill: 'Monitoring', title: 'Monitoring & Auto-Resolution', body: 'Normalizes signals into incidents and runs verified playbooks for faster, auditable remediation while confidence and rollback paths are hardened.' },
  { icon: 'PLT', pill: 'Platforms', title: 'Internal Dashboards', body: 'Multi-role access, analytics, operational controls, and audit visibility.' },
  { icon: 'AI', pill: 'AI', title: 'Assistive Ops Layers', body: 'Summaries, anomaly hints, triage assistance, and reporting automation.' },
];
const cases = {
  serviceops: {
    pill: 'Service Ops',
    title: 'Service Ops Automation Platform',
    summary: 'Shipped: service lifecycle orchestration with intake -> assignment -> execution -> QA -> completion, SLA-aware escalations, and auditability.',
    meta: ['Shipped', 'Production', 'Workflow Engine'],
    bullets: [
      'Job lifecycle + approvals + role routing',
      'SLAs, escalations, and audit trail',
      'RBAC with assignment + queueing',
      'Solo build, CTO-level ownership',
    ],
    modal: {
      title: 'Service Ops Automation Platform',
      lead: 'This system exists because manual operations failed at scale. Service lifecycle orchestration with workflow, SLAs, escalations, RBAC, and auditability.',
      tags: ['Service Ops', 'Workflow Engine', 'SLA / Escalations', 'RBAC', 'Audit Trail', 'Production'],
      sections: [
        { h: 'Problem Context', p: 'Manual job coordination breaks when volume increases: inconsistent handoffs, unclear ownership, SLA misses, and no audit trail.' },
        { h: 'System Overview', p: 'The platform models the service lifecycle end-to-end: intake -> assignment -> execution -> QA -> completion, with approvals, escalations, role-based controls, and audit history.' },
        {
          h: 'Key Design Decisions',
          list: [
            'Chose workflow-driven orchestration over ad-hoc task handling to enforce consistency and traceability',
            'Modeled job lifecycles explicitly to support SLAs, escalations, and audit trails',
            'Avoided implicit automation; all automated transitions are verifiable and reversible',
            'Designed RBAC early to prevent privilege creep as operations scaled',
          ],
        },
        {
          h: 'What Was Intentionally Not Automated',
          list: [
            'Customer billing adjustments require explicit human approval',
            'Exception handling paths that could impact contractual obligations',
            'Final resolution sign-off for edge-case service failures',
          ],
        },
        {
          h: 'Operational Readiness',
          list: [
            'Job state transitions are validated and rejected if they violate lifecycle rules',
            'Errors surface with contextual job state to support fast diagnosis',
            'All actions are logged for traceability across admin, vendor, and customer flows',
            'Access is enforced via role-based permissions to prevent cross-job impact',
          ],
        },
        { h: 'Observed Outcome', p: 'Work becomes traceable and repeatable: every decision is logged, escalation paths are explicit, and ops is driven by workflow state rather than people memory.' },
        { h: 'Next Iteration', p: 'Expanding automation triggers and integrating a voice-based front door for customer intake and triage.' },
        { h: 'Design Rationale', arch: true },
      ],
    },
  },
  umare: {
    pill: 'UMARE',
    title: 'Monitoring & Auto-Resolution Engine',
    summary: 'Normalizes signals into incidents, applies triage rules, and runs verified remediation with rollback and escalation for consistent, auditable recovery.',
    meta: ['Incidents', 'Playbooks', 'SLA'],
    bullets: [
      'Signal ingestion + normalization',
      'Auto-triage + confidence scoring',
      'Verification + rollback paths',
      'Operator cockpit + audit timeline',
    ],
    modal: {
      title: 'UMARE - Monitoring & Auto-Resolution Engine',
      lead: 'This system exists because manual operations failed at scale. UMARE normalizes signals into incidents, applies triage rules, and executes verified remediation with auditability, rollback, and escalation paths.',
      tags: ['Incidents', 'Playbooks', 'Verification', 'Auditability'],
      sections: [
        { h: 'Problem Context', p: "Manual incident handling doesn't scale. Response quality varies by operator, resolution depends on tribal knowledge, and teams grow headcount instead of fixing root causes." },
        { h: 'System Overview', p: 'UMARE normalizes signals into incidents, applies triage rules, and executes verified remediation playbooks with auditability, rollback, and escalation paths.' },
        {
          h: 'Key Design Decisions',
          list: [
            'Chose event-driven workflows to support retries, observability, and auditability',
            'Separated signal ingestion from resolution logic to reduce blast radius',
            'Avoided real-time automation for low-confidence incidents; escalated instead',
            'Required verification and rollback paths for every executable playbook',
          ],
        },
        {
          h: 'What Was Intentionally Not Automated',
          list: [
            'Low-confidence incidents escalate instead of triggering auto-remediation',
            'Actions without a clear verification step or rollback path',
            'Cross-system changes that exceed defined safety boundaries',
          ],
        },
        {
          h: 'Operational Readiness',
          list: [
            'Incident timelines capture signals, decisions, and actions as a single record',
            'Automated actions are reversible and monitored after execution',
            'Failures degrade to human escalation instead of silent retries',
            'System behavior remains observable without inspecting raw logs',
          ],
        },
        { h: 'Observed Outcome', p: 'Operational response becomes consistent, traceable, and largely self-serving, with humans supervising only when confidence drops.' },
        { h: 'Next Iteration', p: 'Improving confidence scoring and expanding the playbook library to safely increase automation coverage.' },
        { h: 'Design Rationale', arch: true },
      ],
    },
  },
  hyperflow: {
    pill: 'HyperFlow',
    title: 'Workflow Execution Engine',
    summary: 'Compiles modeled workflows into executable state machines with routing, SLAs, timers, and escalation logic.',
    meta: ['Rules', 'Queues', 'RBAC'],
    bullets: [
      'Workflow -> state machine compiler',
      'Role routing + assignment rules',
      'Timers, SLAs, escalation branches',
      'Auditable history + debugging',
    ],
    modal: {
      title: 'HyperFlow - Workflow Execution Engine',
      lead: 'This system exists because manual operations failed at scale. HyperFlow models workflows as executable state machines with role routing, SLAs, timers, and escalation logic.',
      tags: ['State Machine', 'Routing', 'SLA', 'Audit Trails'],
      sections: [
        { h: 'Problem Context', p: "Operational workflows live in people's heads and documents, making exceptions expensive and scaling dependent on coordination roles." },
        { h: 'System Overview', p: 'HyperFlow models workflows as executable state machines with role routing, SLAs, timers, and escalation logic.' },
        {
          h: 'Key Design Decisions',
          list: [
            'Represented workflows as executable state machines instead of static diagrams',
            'Modeled time explicitly (timers, SLAs) rather than relying on human reminders',
            'Separated workflow definition from execution to allow safe iteration',
            'Prioritized auditability over speed to support compliance and debugging',
          ],
        },
        {
          h: 'What Was Intentionally Not Automated',
          list: [
            'Workflow transitions that bypass required approvals',
            'SLA overrides without explicit operator intent',
            'Structural workflow changes without versioned validation',
          ],
        },
        {
          h: 'Operational Readiness',
          list: [
            'Workflow execution is deterministic and versioned for safe iteration',
            'State transitions are persisted to allow recovery and replay',
            'Failures are isolated to individual workflows',
            'Operators can intervene without corrupting system state',
          ],
        },
        { h: 'Observed Outcome', p: 'Teams operate with fewer handoffs, predictable execution, and clear accountability across workflows.' },
        { h: 'Next Iteration', p: 'Hardening edge cases and expanding visual modeling into reusable workflow templates.' },
        { h: 'Design Rationale', arch: true },
      ],
    },
  },
  cortex: {
    pill: 'Cortex',
    title: 'Ops Intelligence Dashboard',
    summary: 'Defines a centralized truth layer and decision views around bottlenecks, pressure, and risk.',
    meta: ['Analytics', 'Alerts', 'Trends'],
    bullets: [
      'Truth layer for operational data',
      'Bottleneck + queue pressure views',
      'Actionable alerts (not noise)',
      'Role-based dashboards',
    ],
    modal: {
      title: 'Cortex - Ops Intelligence Dashboard',
      lead: 'This system exists because manual operations failed at scale. Cortex defines a centralized truth layer and renders decision-oriented views focused on bottlenecks, pressure points, and risk.',
      tags: ['Truth Layer', 'Analytics', 'Alerts', 'Ownership'],
      sections: [
        { h: 'Problem Context', p: 'Dashboards often lie because operational data lacks a consistent truth model and ownership.' },
        { h: 'System Overview', p: 'Cortex defines a centralized truth layer and renders decision-oriented views focused on bottlenecks, pressure points, and risk.' },
        {
          h: 'Key Design Decisions',
          list: [
            'Introduced a centralized truth layer before visualization to prevent metric drift',
            'Designed dashboards around decisions, not raw data availability',
            'Avoided real-time alerts without clear action paths to reduce noise',
            'Enforced ownership mapping between metrics and responsible roles',
          ],
        },
        {
          h: 'What Was Intentionally Not Automated',
          list: [
            'Automated decisions based solely on incomplete or lagging data',
            'Alerting without a defined owner or action path',
            'Metric aggregation that obscures root cause analysis',
          ],
        },
        {
          h: 'Operational Readiness',
          list: [
            'Metrics are computed from normalized sources to avoid drift',
            'Data gaps and freshness are explicitly surfaced',
            'Dashboards expose ownership and decision context',
            'Alerts map to actions, not just thresholds',
          ],
        },
        { h: 'Observed Outcome', p: 'Leaders detect operational issues earlier and make decisions based on reality, not vanity metrics.' },
        { h: 'Next Iteration', p: 'Refining signal definitions and tightening feedback loops between metrics and actions.' },
        { h: 'Design Rationale', arch: true },
      ],
    },
  },
  gbp: {
    pill: 'GBP Assistant',
    title: 'Local SEO Automation Platform',
    summary: 'Structures content workflows, approvals, scheduling, and performance visibility across accounts.',
    meta: ['Automation', 'Approvals', 'Reporting'],
    bullets: [
      'Client / Agency / Admin roles',
      'Content workflow + approvals',
      'Scheduling + publishing',
      'Insights + reporting',
    ],
    modal: {
      title: 'GBP Assistant - Local SEO Automation Platform',
      lead: 'This system exists because manual operations failed at scale. GBP Assistant structures content workflows, approvals, scheduling, and performance visibility in a multi-tenant platform.',
      tags: ['Automation', 'Approvals', 'Scheduling', 'Reporting'],
      sections: [
        { h: 'Problem Context', p: 'Local SEO operations break down at scale due to fragmented workflows, approvals, and reporting across accounts.' },
        { h: 'System Overview', p: 'GBP Assistant structures content workflows, approvals, scheduling, and performance visibility in a multi-tenant platform.' },
        {
          h: 'Key Design Decisions',
          list: [
            'Designed multi-tenancy and role separation from the start to support agencies',
            'Structured content workflows with approvals to reduce posting errors at scale',
            'Avoided direct publishing without review to protect brand consistency',
            'Treated reporting as an operational feedback loop, not a vanity feature',
          ],
        },
        {
          h: 'What Was Intentionally Not Automated',
          list: [
            'Content publishing without human review',
            'Brand-sensitive changes across multiple client accounts',
            'Automated responses to negative reviews without approval',
          ],
        },
        {
          h: 'Operational Readiness',
          list: [
            'Content actions are logged with author, approver, and timestamp',
            'Publishing failures surface clearly without silent drops',
            'Role boundaries prevent cross-account effects',
            'Reporting reflects actual outcomes, not queued intent',
          ],
        },
        { h: 'Observed Outcome', p: 'Agencies and clients operate consistently across locations with reduced manual oversight.' },
        { h: 'Next Iteration', p: 'Automating performance insights and tightening feedback between content actions and outcomes.' },
        { h: 'Design Rationale', arch: true },
      ],
    },
  },
};
const statusBlocks = [
  { title: 'Workflow modeling', note: 'design', pill: 'active' },
  { title: 'Automation safety', note: 'prototype', pill: 'build' },
  { title: 'Operator cockpit', note: 'iteration', pill: 'ship' },
];

const activeWork = [
  {
    pill: 'Building',
    title: 'Voice AI Customer Service Embed (1-line install)',
    tag: 'Voice AI',
    desc: 'A voice-based customer service layer that attaches to any website via a one-line embed. Intake -> intent detection -> responses -> routing -> escalation -> logging hooks for follow-up.',
    progress: 68,
  },
  {
    pill: 'Build',
    title: 'Auto-Resolution Playbook Layer',
    tag: 'UMARE',
    desc: 'Encoding remediation decisions into executable playbooks with verification and rollback, tightening safety nets before scaling automation.',
    progress: 62,
  },
  {
    pill: 'Prototype',
    title: 'Workflow -> State Machine Compiler',
    tag: 'HyperFlow',
    desc: 'Compiling workflows into execution with routing, timers, SLAs, and escalations so next iteration can absorb edge cases without human babysitting.',
    progress: 48,
  },
  {
    pill: 'Research',
    title: 'Ops Truth Layer',
    tag: 'Cortex',
    desc: 'Normalizing operational data into a truth model so dashboards reflect reality before we push the next round of ownership and feedback loops.',
    progress: 35,
  },
];

const roadmap = [
  {
    status: 'build',
    title: 'Voice AI customer service embed (1-line)',
    pill: 'Voice AI',
    desc: 'Voice-first customer relation automation: intake -> intent detection -> responses -> routing -> escalation -> CRM/logging hooks, with confidence thresholds and human fallback.',
    meta: ['Voice AI', 'Customer Ops', 'Integrations'],
    progress: 64,
    hint: 'Focus: safe automation with auditability of conversations',
  },
  {
    status: 'build',
    title: 'Automation safety under partial confidence',
    pill: 'UMARE',
    desc: 'Executing remediation with guarded playbooks: verifying outcomes, rolling back on failure, escalating on low confidence, and keeping the audit path intact before widening automation.',
    meta: ['confidence', 'verification', 'rollback'],
    progress: 72,
    hint: 'Primary constraint: safe remediation with noisy signals',
  },
  {
    status: 'proto',
    title: 'Exception handling without human bottlenecks',
    pill: 'HyperFlow',
    desc: 'Proving workflows survive real exceptions: retries, escalations, reassignments, and SLA-aware branching with a full audit timeline before handing more volume to the engine.',
    meta: ['timers', 'RBAC', 'escalations'],
    progress: 52,
    hint: 'Primary constraint: exceptions as first-class behavior',
  },
  {
    status: 'research',
    title: 'Inconsistent data ownership across systems',
    pill: 'Cortex',
    desc: 'Enforcing a truth model for operational data: canonical definitions, ownership, and feedback loops so dashboards map to decisions and remediation, not vanity metrics.',
    meta: ['normalization', 'ownership', 'feedback'],
    progress: 34,
    hint: 'Primary constraint: unify meaning across sources',
  },
];

const arsenalFilters = ['all', 'backend', 'frontend', 'db', 'ops', 'ai'];

const arsenalTools = [
  { cat: 'backend', title: 'Node.js + Express', note: 'APIs, auth, queues, services', tag: 'backend' },
  { cat: 'db', title: 'MongoDB + Mongoose', note: 'schemas, indexing, aggregates', tag: 'data' },
  { cat: 'frontend', title: 'React', note: 'dashboards, role-based UI', tag: 'frontend' },
  { cat: 'ops', title: 'Monitoring & incidents', note: 'signals, routing, SLAs', tag: 'ops' },
  { cat: 'backend', title: 'JWT / RBAC', note: 'permissioned systems', tag: 'backend' },
  { cat: 'ops', title: 'Audit trails', note: 'who did what and why', tag: 'ops' },
  { cat: 'db', title: 'Data modeling', note: 'workflows & event schemas', tag: 'data' },
  { cat: 'frontend', title: 'UI systems', note: 'states, layouts, components', tag: 'frontend' },
  { cat: 'ai', title: 'Assistive AI UX', note: 'summaries, triage, reporting', tag: 'ai' },
  { cat: 'backend', title: 'Queues / background jobs', note: 'BullMQ + Redis for workflow orchestration', tag: 'backend' },
  { cat: 'ops', title: 'Webhooks + rate limiting', note: 'safe external triggers and backpressure', tag: 'ops' },
  { cat: 'ops', title: 'Logging & monitoring', note: 'observable playbooks and voice sessions', tag: 'ops' },
  { cat: 'frontend', title: 'WebSockets / real-time', note: 'live status for jobs and conversations', tag: 'frontend' },
  { cat: 'ai', title: 'Speech-to-text / TTS', note: 'voice intake + responses', tag: 'ai' },
  { cat: 'ai', title: 'LLM + vector search', note: 'OpenAI integration for intent + retrieval', tag: 'ai' },
  { cat: 'ops', title: 'Telephony (Twilio/Vonage)', note: 'voice channel integration', tag: 'ops' },
];

const principles = ['Visibility before optimization', 'Automation before hiring', 'Auditability is mandatory', 'Failures must be designed'];

const articles = [
  {
    pill: 'System Design',
    title: 'Why internal tools fail',
    body: "This article exists because at scale, missing ownership, exceptions, and auditability kept breaking internal tools; here's how to bake them in.",
    time: '6 min',
  },
  {
    pill: 'Operations',
    title: 'Automation before hiring',
    body: "This article exists because hiring ahead of automation repeatedly cemented manual bottlenecks; here's how to reverse that path.",
    time: '5 min',
  },
  {
    pill: 'Dashboards',
    title: 'Dashboards and truth',
    body: "This article exists because dashboards repeatedly failed teams once systems reached scale; here's how to tie metrics to real decisions and remediation.",
    time: '7 min',
  },
];
const metrics = [
  { kicker: 'EXPERIENCE', count: 4, suffix: '+', label: 'Years building systems', note: 'End-to-end platforms, dashboards, and ops automation patterns.' },
  { kicker: 'WORKFLOWS', count: 20, suffix: '+', label: 'Complex flows modeled', note: 'Approvals, escalations, SLAs, auditability, roles.' },
  { kicker: 'PLATFORMS', count: 6, suffix: '+', label: 'Systems built / prototyped', note: 'Reusable engines and repeatable architectures.' },
  { kicker: 'AUTOMATION', count: 70, suffix: '%', label: 'Manual work target', note: 'Design goal: operators supervise; systems execute.' },
];

const contactItems = [
  { label: 'Email', value: 'olaideakosile35@gmail.com', href: 'mailto:olaideakosile35@gmail.com' },
  { label: 'Resume', value: 'View resume', href: '/resume' },
  { label: 'LinkedIn', value: '/in/olaide', href: '#', placeholder: true },
  { label: 'X (Twitter)', value: '@olaide__akosile', href: 'https://x.com/olaide__akosile' },
];

const socialLinks = [
  { label: 'X profile', text: 'X', href: 'https://x.com/olaide__akosile' },
  { label: 'LinkedIn', text: 'in', href: '#', placeholder: true },
  { label: 'Email', text: '@', href: 'mailto:olaideakosile35@gmail.com' },
];

const drawerNav = [
  { href: '#what', title: 'What I Build', hint: 'capabilities' },
  { href: '#systems', title: 'Systems', hint: 'case studies' },
  { href: '#active', title: 'In Progress', hint: 'work' },
  { href: '#roadmap', title: 'Roadmap', hint: 'active' },
  { href: '#arsenal', title: 'Arsenal', hint: 'tools' },
  { href: '#notes', title: 'Field Notes', hint: 'writing' },
  { href: '#metrics', title: 'Proof', hint: 'signals' },
  { href: '#contact', title: 'Contact', hint: 'cta' },
];

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

function preventDefault(e) {
  e.preventDefault();
}

const focusIcons = {
  gear: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.6 5.2l2.1 2.1M17.3 17.3l2.1 2.1M3 12h3M18 12h3M4.6 18.8l2.1-2.1M17.3 6.7l2.1-2.1" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <rect x="6" y="12" width="3" height="6" rx="1" />
      <rect x="11" y="9" width="3" height="9" rx="1" />
      <rect x="16" y="6" width="3" height="12" rx="1" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 4.2 3.1 6.9 7 9 3.9-2.1 7-4.8 7-9V6l-7-3Z" />
      <path d="m9.5 12.5 2 2 3-3.5" />
    </svg>
  ),
};

const QweMarkup = forwardRef(function QweMarkup(_props, forwardedRef) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(null);
  const [filter, setFilter] = useState('all');
  const rootRef = useRef(null);
  const csRightRef = useRef(null);
  const csLayer1Ref = useRef(null);
  const csLayer2Ref = useRef(null);
  const toTopRef = useRef(null);
  const mergedRef = mergeRefs(forwardedRef, rootRef);
  const selectedCase = activeCase ? cases[activeCase] : null;
  const year = useMemo(() => new Date().getFullYear(), []);
  useEffect(() => {
    if (activeCase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCase]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const cleanups = [];

    const revealEls = root.querySelectorAll('.reveal');
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    const workEls = root.querySelectorAll('[data-progress]');
    const workIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const val = el.getAttribute('data-progress') || '45';
          const bar = el.querySelector('.progress i');
          if (bar) bar.style.setProperty('--p', `${val}%`);
          workIO.unobserve(el);
        });
      },
      { threshold: 0.25 },
    );
    workEls.forEach((el) => workIO.observe(el));
    cleanups.push(() => workIO.disconnect());

    const roadEls = root.querySelectorAll('[data-rp]');
    const roadIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const val = el.getAttribute('data-rp') || '30';
          const bar = el.querySelector('.miniProgress i');
          if (bar) bar.style.setProperty('--rp', `${val}%`);
          roadIO.unobserve(el);
        });
      },
      { threshold: 0.25 },
    );
    roadEls.forEach((el) => roadIO.observe(el));
    cleanups.push(() => roadIO.disconnect());

    const counterEls = root.querySelectorAll('.num[data-count]');
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.getAttribute('data-count')) || 0;
          const suffix = el.textContent.includes('%') ? '%' : '+';
          const duration = 900;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(target * eased);
            el.textContent = `${val}${suffix}`;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.35 },
    );
    counterEls.forEach((el) => counterIO.observe(el));
    cleanups.push(() => counterIO.disconnect());
    const layers = root.querySelectorAll('[data-depth]');
    let rafId;
    const parallax = () => {
      const y = window.scrollY || 0;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
        layer.style.transform = `translate3d(0, ${-y * depth}px, 0)`;
      });
      rafId = requestAnimationFrame(parallax);
    };
    rafId = requestAnimationFrame(parallax);
    cleanups.push(() => cancelAnimationFrame(rafId));

    const cards = root.querySelectorAll('.card, .heroSide');
    const onPointer = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      e.currentTarget.style.setProperty('--mx', `${mx}%`);
      e.currentTarget.style.setProperty('--my', `${my}%`);
    };
    cards.forEach((card) => card.addEventListener('pointermove', onPointer));
    cleanups.push(() => cards.forEach((card) => card.removeEventListener('pointermove', onPointer)));

    const hwrap = root.querySelector('#hwrap');
    const hscroll = root.querySelector('#hscroll');
    if (hwrap && hscroll) {
      const onWheel = (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          hscroll.scrollLeft += e.deltaY;
        }
      };
      hwrap.addEventListener('wheel', onWheel, { passive: false });
      cleanups.push(() => hwrap.removeEventListener('wheel', onWheel));
    }

    const navLinks = Array.from(root.querySelectorAll('.navLink'));
    const sections = navLinks.map((a) => root.querySelector(a.getAttribute('href'))).filter(Boolean);
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 },
    );
    sections.forEach((s) => navIO.observe(s));
    cleanups.push(() => navIO.disconnect());

    const onScroll = () => {
      if (toTopRef.current) {
        toTopRef.current.classList.toggle('show', window.scrollY > 900);
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setActiveCase(null);
      }
    };
    window.addEventListener('keydown', onKey);
    cleanups.push(() => window.removeEventListener('keydown', onKey));

    return () => {
      cleanups.forEach((fn) => fn && fn());
    };
  }, []);

  useEffect(() => {
    const right = csRightRef.current;
    const l1 = csLayer1Ref.current;
    const l2 = csLayer2Ref.current;
    if (!right || !l1 || !l2) return undefined;

    const onScroll = () => {
      const s = right.scrollTop || 0;
      l1.style.setProperty('--csY1', `${s * 0.12}px`);
      l2.style.setProperty('--csY2', `${s * 0.06}px`);
    };

    right.addEventListener('scroll', onScroll);
    onScroll();

    return () => right.removeEventListener('scroll', onScroll);
  }, [activeCase]);

  const filteredTools = arsenalTools.map((tool) => ({ ...tool, hide: filter !== 'all' && tool.cat !== filter }));

  return (
    <div ref={mergedRef}>
      <div className="noise" />
      <div
        className={`drawer ${drawerOpen ? 'open' : ''}`}
        id="drawer"
        onClick={(e) => {
          if (e.target === e.currentTarget) setDrawerOpen(false);
        }}
      >
        <div className="drawerPanel" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="drawerHead">
            <a className="brand" href="#top" onClick={() => setDrawerOpen(false)}>
              <div className="logo" aria-hidden="true" style={{ backgroundImage: `url(${logoImage})` }} />
              <div>
                <strong>Olaide - Systems</strong>
                <span>automation - ops - platforms</span>
              </div>
            </a>
            <button className="btn" style={{ padding: '10px 12px' }} onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              x
            </button>
          </div>

          <ul>
            {drawerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setDrawerOpen(false)}>
                  <span>{item.title}</span>
                  <small>{item.hint}</small>
                </a>
              </li>
            ))}
          </ul>

          <div className="divider" />
          <a className="btn primary" href="#systems" onClick={() => setDrawerOpen(false)}>
            View Systems -&gt;
          </a>
        </div>
      </div>

      <header>
        <div className="container nav">
          <a className="brand" href="#top">
            <div className="logo" aria-hidden="true" style={{ backgroundImage: `url(${logoImage})` }} />
            <div>
              <strong>Olaide - Systems</strong>
              <span>automation - ops - platforms</span>
            </div>
          </a>

          <nav aria-label="Primary navigation">
            <ul>
              <li>
                <a href="#what" className="navLink">
                  What I Build
                </a>
              </li>
              <li>
                <a href="#systems" className="navLink">
                  Systems
                </a>
              </li>
              <li>
                <a href="#active" className="navLink">
                  In Progress
                </a>
              </li>
              <li>
                <a href="#roadmap" className="navLink">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#arsenal" className="navLink">
                  Arsenal
                </a>
              </li>
              <li>
                <a href="#notes" className="navLink">
                  Field Notes
                </a>
              </li>
              <li>
                <a href="#metrics" className="navLink">
                  Proof
                </a>
              </li>
            </ul>
          </nav>

          <div className="navRight">
            <button className="menuBtn" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="hero">
        <div className="parallaxLayer" data-depth="0.25" style={{ left: '-140px', top: '40px' }}>
          <div className="blob" />
        </div>
        <div className="parallaxLayer" data-depth="0.14" style={{ right: '-180px', top: '120px' }}>
          <div className="ring" />
        </div>
        <div className="parallaxLayer" data-depth="0.08" style={{ left: '10%', bottom: '-120px' }}>
          <div className="gridGlow" />
        </div>

        <div className="container">
          <div className="heroGrid">
            <section className="reveal">
              <div className="kicker">SYSTEMS ENGINEER - MERN - AUTOMATION</div>
              <h1 className="headline">
                I build <span className="grad">systems</span>
                <br />
                that replace manual work.
              </h1>
              <p className="sub">
                I design operational leverage: systems that absorb complexity and remove manual touch points.
                <br />
                Automating workflows, reducing ops load, and scaling teams without headcount.
              </p>

              <div className="heroMeta">
                {heroPills.map((pill) => (
                  <span key={pill} className="pill dot">
                    {pill}
                  </span>
                ))}
              </div>

              <div className="heroActions">
                <a className="btn primary" href="#systems">
                  Case Studies -&gt;
                </a>
                <a className="ghostLink" href="#roadmap">
                  Current work
                  <span style={{ opacity: 0.7 }}>-&gt;</span>
                </a>
              </div>

              <div className="divider" />
            <div className="muted2" style={{ font: '800 12px/1.6 var(--mono)', letterSpacing: '.08em' }}>
              <span className="grad" style={{ font: '900 12px/1.6 var(--mono)', WebkitTextFillColor: 'transparent' }}>
                Approach
              </span>
              : observe -&gt; automate safely -&gt; remove human load -&gt; harden failure paths
              </div>
            </section>

            <aside className="heroSide reveal" aria-label="System focus areas">
              <div className="miniTitle">Focus areas</div>
              <div className="stack">
                {focusAreas.map((item) => (
                  <div key={item.title} className="stackItem">
                    <div className="stackIcon" aria-hidden="true">
                      {focusIcons[item.icon] || item.icon}
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <div className="scrollHint" aria-hidden="true">
          <div className="mouse" />
          scroll
        </div>
      </main>
      <section className="section" id="what">
        <div className="container">
          <div className="grid whatGrid">
            <div className="reveal">
              <div className="kicker">CAPABILITIES</div>
              <h2 className="h2">System patterns</h2>
              <p className="sub">Recurring patterns used when operations become fragile, manual, or dependent on tribal knowledge.</p>
              <div className="divider" />
              <a className="btn" href="#arsenal">
                Arsenal -&gt;
              </a>
            </div>

            <div className="grid cards4">
              {features.map((feature) => (
                <div key={feature.title} className="feature reveal card">
                  <div className="top">
                    <div className="icon">{feature.icon}</div>
                    <span className="pill">{feature.pill}</span>
                  </div>
                  <strong>{feature.title}</strong>
                  <p>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" id="systems">
        <div className="container">
          <div className="reveal">
            <div className="kicker">SYSTEMS</div>
            <h2 className="h2">Case studies</h2>
            <p className="sub">Each system is designed as an engine: explicit ownership, failure modes, and recovery paths.</p>
          </div>

          <div className="hScrollWrap reveal" id="hwrap">
            <div className="hScroll" id="hscroll" aria-label="Horizontal case studies">
              {Object.entries(cases).map(([key, data]) => (
                <article key={key} className="panel" onClick={() => setActiveCase(key)}>
                  <div className="panelTop">
                    <div>
                      <span className="pill dot">{data.pill}</span>
                      <h3>{data.title}</h3>
                      <p className="sub">{data.summary}</p>
                    </div>
                    <div className="meta">
                      {data.meta.map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bullets">
                    {data.bullets.map((bullet) => (
                      <div key={bullet} className="bullet">
                        {bullet}
                      </div>
                    ))}
                  </div>

                  <div className="panelArt" aria-hidden="true">
                    <div className="wire" />
                    <div className="node" style={{ left: '16%', top: '44%' }} />
                    <div className="node" style={{ left: '38%', top: '26%' }} />
                    <div className="node" style={{ left: '60%', top: '54%' }} />
                    <div className="node" style={{ left: '82%', top: '32%' }} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="active">
        <div className="container">
          <div className="reveal">
            <div className="kicker">ACTIVE</div>
            <h2 className="h2">Work in progress</h2>
            <p className="sub">These systems are being hardened, expanded, or refined based on real operational feedback.</p>
          </div>

          <div className="grid stickyGrid" style={{ marginTop: '18px' }}>
            <aside className="stickyLeft reveal">
              <div className="kicker">FOCUS</div>
              <h3 style={{ margin: '10px 0 8px', fontSize: '22px', letterSpacing: '-.02em' }}>Current loops</h3>
              <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
                observe reality, automate safely, remove human load, harden failure paths.
              </p>

              <div className="statusList">
                {statusBlocks.map((item) => (
                  <div key={item.title} className="status">
                    <div>
                      <strong>{item.title}</strong>
                      <br />
                      <small>{item.note}</small>
                    </div>
                    <span className="pill">{item.pill}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <a className="btn" href="#systems">
                Review case studies
              </a>
            </aside>

            <div className="activeRight">
              {activeWork.map((item) => (
                <article key={item.title} className="workCard card reveal" data-progress={item.progress}>
                  <div className="workTop">
                    <div>
                      <span className="pill dot">{item.pill}</span>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="pill">{item.tag}</span>
                  </div>
                  <p>{item.desc}</p>
                  <div className="progress">
                    <i style={{ '--p': '10%' }} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="roadmap">
        <div className="container">
          <div className="reveal">
            <div className="kicker">ROADMAP</div>
            <h2 className="h2">Active problems</h2>
            <p className="sub">These are the systems currently being hardened, expanded, or refined based on real operational feedback.</p>
          </div>

          <div className="roadmapWrap">
            <div className="roadmapGrid">
              {roadmap.map((item) => (
                <article key={item.title} className="roadItem card reveal" data-rp={item.progress}>
                  <div className="roadTop">
                    <div>
                      <span className={`statusBadge ${item.status}`}>
                        {item.status === 'build' && 'Building'}
                        {item.status === 'proto' && 'Prototype'}
                        {item.status === 'research' && 'Research'}
                      </span>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="pill">{item.pill}</span>
                  </div>
                  <p>{item.desc}</p>
                  <div className="roadMeta">
                    {item.meta.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="miniProgress">
                    <i style={{ '--rp': '10%' }} />
                  </div>
                  <div className="roadHint">{item.hint}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="arsenal">
        <div className="container">
          <div className="reveal">
              <div className="kicker">ARSENAL</div>
              <h2 className="h2">Production tools</h2>
              <p className="sub">Tools used in production environments - selected for failure tolerance, observability, and maintainability.</p>

            <div className="filters" role="tablist" aria-label="Arsenal filters">
              {arsenalFilters.map((f) => (
                <button key={f} className={`chip ${filter === f ? 'active' : ''}`} data-filter={f} role="tab" onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid arsenalGrid reveal" id="arsenalGrid">
            {filteredTools.map((tool) => (
              <div key={`${tool.cat}-${tool.title}`} className={`tool${tool.hide ? ' hide' : ''}`} data-cat={tool.cat}>
                <div>
                  <b>{tool.title}</b>
                  <small>{tool.note}</small>
                </div>
                <div className="tag">{tool.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section tight" id="principles">
        <div className="container">
          <div className="reveal">
            <div className="kicker">PRINCIPLES</div>
            <h2 className="h2">Design rules</h2>
            <p className="sub">Rules used to prevent systems from collapsing under load, ambiguity, or organizational drift.</p>
          </div>

          <div className="principles">
            <div className="quote reveal">
              <div className="kicker">OPERATING MODEL</div>
              <h3 style={{ margin: '10px 0 10px', fontSize: '24px', letterSpacing: '-.02em' }}>Build once. Automate continuously.</h3>
              <p>
                Systems are built for leverage: observability first, safe automation next, self-service workflows, and hardened failure paths.
              </p>
              <div className="sig">- Olaide</div>
            </div>

            <div className="principleCard card reveal">
              <div className="kicker">RULES</div>
              <div className="divider" />

              {principles.map((rule, idx) => (
                <div key={rule} className="principleLine" style={idx > 0 ? { marginTop: '12px' } : undefined}>
                  <strong>{rule}</strong>
                  <span>{`P0${idx + 1}`}</span>
                </div>
              ))}

              <div className="divider" />
              <a className="btn" href="#notes">
                Field Notes -&gt;
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="notes">
        <div className="container">
          <div className="reveal">
            <div className="kicker">FIELD NOTES</div>
            <h2 className="h2">Writing</h2>
            <p className="sub">Notes from production systems: why failures surfaced, what fixed them, and how the patterns scale.</p>
          </div>

          <div className="grid articleGrid">
            {articles.map((article) => (
              <article key={article.title} className="article card reveal">
                <a href="#notes">
                  <span className="pill dot">{article.pill}</span>
                  <h3>{article.title}</h3>
                  <p>{article.body}</p>
                  <div className="footer">
                    <span>{article.time}</span>
                    <span>Open -&gt;</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="metrics">
        <div className="container">
          <div className="reveal">
            <div className="kicker">SIGNALS</div>
            <h2 className="h2">Operational signals</h2>
            <p className="sub">Quantitative signals derived from shipped systems and ongoing prototypes.</p>
          </div>

          <div className="grid metrics">
            {metrics.map((metric) => (
              <div key={metric.label} className="metric card reveal">
                <div className="kicker">{metric.kicker}</div>
                <div className="num" data-count={metric.count}>{`0${metric.suffix}`}</div>
                <div className="label">{metric.label}</div>
                <div className="note">{metric.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="contact">
        <div className="container">
          <div className="ctaWrap reveal" id="cta">
            <div className="ctaLeft">
              <div className="content">
                <div className="kicker">CONTACT</div>
                <h3>Reducing operational load through systems.</h3>
                <p className="sub" style={{ maxWidth: '55ch' }}>
                  For teams where manual coordination is becoming a scaling constraint.
                </p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a className="btn primary" href="/resume" target="_blank" rel="noreferrer noopener">
                    View resume
                  </a>
                  <a className="btn" href="mailto:olaideakosile35@gmail.com">
                    Discuss operational bottlenecks
                  </a>
                  <a className="btn" href="#systems">
                    Review case studies
                  </a>
                </div>
              </div>
            </div>

            <aside className="ctaRight">
              <div className="kicker">LINKS</div>
              <div className="contactGrid">
                {contactItems.map((item) => (
                  <div key={item.label} className="contactItem">
                    <b>{item.label}</b>
                    {item.placeholder ? (
                      <a href={item.href} onClick={preventDefault}>{item.value}</a>
                    ) : (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                      >
                        {item.value}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="socials" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    aria-label={link.label}
                    onClick={link.placeholder ? preventDefault : undefined}
                  >
                    {link.text}
                  </a>
                ))}
              </div>

              <div className="divider" />
              <div className="muted2" style={{ font: '800 11px/1.6 var(--mono)', letterSpacing: '.16em' }}>
                Minimal links. Clear entry points.
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className={`csModal ${selectedCase ? 'open' : ''}`} id="csModal" aria-hidden={!selectedCase}>
        <div className="csDialog" role="dialog" aria-modal="true" aria-label="Case study modal">
          <button className="csClose" onClick={() => setActiveCase(null)} aria-label="Close case study">
            x
          </button>
          <div className="csGrid">
            <aside className="csLeft">
              <div className="csLeftArt" aria-hidden="true">
                <div className="csLayer" id="csLayer1" ref={csLayer1Ref} style={{ left: '-120px', top: '-120px' }} />
                <div className="csLayer l2" id="csLayer2" ref={csLayer2Ref} style={{ left: '-180px', top: '40px' }} />
                <div className="csNoise" />
              </div>

              <div className="csLeftInner">
                <div className="kicker" id="csKicker">
                  CASE STUDY
                </div>
                <div className="csTitle" id="csTitle">
                  {selectedCase?.modal.title || 'Title'}
                </div>
                <p className="csLead" id="csLead">
                  {selectedCase?.modal.lead || ''}
                </p>

                <div className="csMetaRow" id="csMeta">
                  {selectedCase?.modal.tags.map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="divider" />
                <div className="muted2" style={{ font: '800 11px/1.6 var(--mono)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
                  Right panel scrolls.
                </div>
              </div>
            </aside>

            <section className="csRight" id="csRight" ref={csRightRef}>
              {selectedCase?.modal.sections.map((sec) => (
                <div key={sec.h} className="csSection">
                  <h4>{sec.h}</h4>
                  {sec.p ? <p>{sec.p}</p> : null}
                  {sec.list ? (
                    <ul className="csList">
                      {sec.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {sec.arch ? (
                    <>
                      <div className="csArch csRationaleDesktop" aria-hidden="true">
                        <div className="wire" />
                        <div className="node" style={{ left: '12%', top: '40%' }} />
                        <div className="node" style={{ left: '34%', top: '26%' }} />
                        <div className="node" style={{ left: '56%', top: '58%' }} />
                        <div className="node" style={{ left: '78%', top: '34%' }} />
                        <div className="node" style={{ left: '86%', top: '60%' }} />
                      </div>
                      <div className="csRationaleMobile">
                        {selectedCase?.modal.sections.find((s) => s.h.toLowerCase().includes('problem'))?.p ? (
                          <div className="csRationaleItem">
                            <div className="csRationaleLabel">Problem context</div>
                            <div className="csRationaleItemTitle">Why it exists</div>
                            <p>{selectedCase.modal.sections.find((s) => s.h.toLowerCase().includes('problem'))?.p}</p>
                          </div>
                        ) : null}
                        {selectedCase?.modal.sections.find((s) => s.h.toLowerCase().includes('system'))?.p ? (
                          <div className="csRationaleItem">
                            <div className="csRationaleLabel">System overview</div>
                            <div className="csRationaleItemTitle">How it works</div>
                            <p>{selectedCase.modal.sections.find((s) => s.h.toLowerCase().includes('system'))?.p}</p>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      <footer>(c) {year} - Operational systems portfolio - Continuously evolving</footer>

      <button className="toTop" id="toTop" aria-label="Back to top" title="Back to top" ref={toTopRef} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5l-7 7m7-7l7 7M12 5v14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
});

export { QweMarkup };
export default QweMarkup;


