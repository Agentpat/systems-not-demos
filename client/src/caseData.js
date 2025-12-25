// Centralized case study data (cards + modal + diagrams)

// Design rationale node maps
const SERVICE_OPS_NODES = [
  {
    id: 'intake',
    x: 12,
    y: 40,
    title: 'Intake & Job Creation',
    why: 'This exists because unstructured requests were dropped or delayed, creating SLA misses before work even started.',
    how: ['Standardized job schema with required fields', 'Validation + dedupe before persistence', 'Assignability and SLA metadata captured at intake'],
    decisions: ['Enforced schema at the edge instead of cleaning later to avoid downstream breakage', 'Separated intake service so validation failures never pollute workflow state', 'Required ownership + SLA tags before a job can exist'],
    notAutomated: ['Ambiguous requests are queued for human triage', 'Billing-affecting fields are never auto-populated', 'Cross-tenant merges are blocked'],
    production: ['Validation errors return actionable messages', 'All creates/updates are logged with request context', 'RBAC gates who can create/edit jobs', 'Jobs can be rolled back to draft when intake is corrected'],
  },
  {
    id: 'engine',
    x: 34,
    y: 26,
    title: 'Assignment & Dispatch',
    why: 'Manual assignment caused idle jobs and double-booked vendors, breaking SLA promises.',
    how: ['Queue rules order work by SLA and geography', 'Role-based routing chooses eligible vendors', 'Reassignment keeps history and preserves timers'],
    decisions: ['Central dispatcher chosen over ad-hoc assignment to avoid race conditions', 'Deterministic ordering over "next available" randomness', 'Dispatch logic isolated from workflow engine to swap strategies safely'],
    notAutomated: ['Forced vendor overrides require human approval', 'High-risk assignments do not auto-rotate', 'Bulk reassignments require explicit confirmation'],
    production: ['Queue ops are idempotent and retryable', 'Assignment changes are audited with actor + reason', 'RBAC enforces who can dispatch or override', 'Rollback to unassigned preserves SLA clocks and history'],
  },
  {
    id: 'statemachine',
    x: 52,
    y: 50,
    title: 'Job State Machine',
    why: 'Free-form status edits led to skipped steps, hidden failures, and untracked SLA drift.',
    how: ['Unassigned -> Assigned -> OnTheWay -> Arrived -> Completed state path', 'Guards enforce allowed actions per role', 'Each transition writes an event to the job timeline'],
    decisions: ['Explicit state machine chosen over free-form updates to prevent invalid transitions', 'Forward-only flow with admin-only corrections to reduce churn', 'Embedded SLA timers per transition instead of cron-based checks'],
    notAutomated: ['Backward transitions require human sign-off', 'SLA overrides are never auto-applied', 'Completion cannot auto-fire from location alone'],
    production: ['Invalid transitions return clear errors', 'Every change is audited with before/after state', 'Role checks gate transitions', 'Admin correction paths include rollback notes for traceability'],
  },
  {
    id: 'location',
    x: 70,
    y: 28,
    title: 'Location Tracking (Polling-Based)',
    why: 'Realtime gaps caused missed arrivals and bad dispatch decisions when GPS signals dropped.',
    how: ['Vendors PATCH location at controlled intervals', 'Admin/customer polling loop reads lastKnownLocation', 'Offline detection uses lastSeenAt thresholds'],
    decisions: ['Polling chosen over push to avoid socket brittleness in the field', 'Coarse granularity favored to reduce noise and battery drain', 'Location separated from state transitions to prevent accidental auto-complete'],
    notAutomated: ['No auto-reassignment on short offline gaps', 'No auto state change from proximity alone', 'Geo-fencing alerts escalate but do not hard-block without review'],
    production: ['Location payloads validated and rate-limited', 'Location updates are audited with actor + timestamp', 'Write access limited to vendor/authenticated client', 'Rollback uses last trusted location when new data fails validation'],
  },
  {
    id: 'access',
    x: 24,
    y: 70,
    title: 'Role-Based Views & Access Control',
    why: 'Shared views led to cross-tenant mistakes and unauthorized edits.',
    how: ['Scoped queries per tenant and role', 'Action-level permission checks before mutations', 'Role-specific UIs for admin, vendor, and customer'],
    decisions: ['Deny-by-default permissions instead of permissive defaults', 'Separate role views instead of feature-flagging a single UI', 'Pre-flight access checks before state changes to avoid partial work'],
    notAutomated: ['Cross-tenant data access is never auto-approved', 'Bulk ops require confirmation and role scope checks', 'New roles are provisioned manually to avoid privilege creep'],
    production: ['Permission errors are explicit and logged', 'Access attempts are audited with actor + resource', 'RBAC enforced on every API boundary', 'Rollback by revoking roles/tokens is supported without data loss'],
  },
  {
    id: 'notifications',
    x: 50,
    y: 72,
    title: 'Notifications & Audit Trail',
    why: 'Without proactive signals and traceability, SLAs were missed silently and incidents lacked evidence.',
    how: ['Event stream drives notifications to the right role', 'SLA thresholds trigger alerts and reminders', 'Timeline combines state, assignments, and comms'],
    decisions: ['Notifications derived from events, not ad-hoc queries, to ensure consistency', 'Timeline stored as immutable events for auditability', 'Per-role routing chosen over broadcast to reduce noise'],
    notAutomated: ['No auto-escalation on repeated notification failures without human review', 'No destructive actions are triggered from notifications', 'High-noise channels are suppressed by default'],
    production: ['Delivery attempts are retried with backoff and idempotency keys', 'Audit log persists every notification and user acknowledgement', 'Subscription changes are RBAC controlled', 'Resends and corrections are replayed safely from the event log'],
  },
  {
    id: 'reliability',
    x: 86,
    y: 60,
    title: 'Reliability & Safety Rails',
    why: 'Operational errors compound quickly without guardrails, eroding trust in automation.',
    how: ['SLA timers and health checks watch workflow latency', 'Circuit breakers isolate flaky integrations', 'Idempotent commands protect against duplicate submissions'],
    decisions: ['Fail-closed defaults over optimistic retries to avoid hidden corruption', 'Staged rollout of automations to limit blast radius', 'Compensating actions defined for reversible steps'],
    notAutomated: ['Self-healing actions that bypass review are disabled', 'Aggressive auto-retries are capped to avoid duplication', 'Bulk data corrections require manual confirmation'],
    production: ['Retries have bounded attempts with alerting on exhaustion', 'Every guardrail event is logged for later review', 'Override paths are RBAC-protected', 'Rollback uses compensations and feature flags rather than hotfix edits'],
  },
];

const UMARE_NODES = [
  {
    title: 'Signal Ingestion',
    why: 'This exists because noisy alerts flooded ops and obscured real incidents.',
    how: ['Multiple signal sources normalized on entry', 'Deduplication and thresholding before incident creation', 'Confidence signals captured for later decisions'],
    decisions: ['Normalize at the edge instead of downstream to reduce blast radius', 'Prefer pull from sources where possible to avoid duplicate pushes', 'Store raw + normalized for audit and tuning'],
    notAutomated: ['Low-confidence signals do not auto-create incidents', 'Source-side remediation is never triggered automatically', 'Untrusted sources require manual promotion'],
    production: ['Parsing errors are logged with offending payloads', 'All ingestions are traceable to source and time', 'RBAC limits who can onboard new sources', 'Replay/reingest is possible with the same ids for consistency'],
  },
  {
    title: 'Incident Classification',
    why: 'Unclassified incidents stalled because responders lacked scope and ownership.',
    how: ['Classification rules map signals to incident types', 'Ownership and severity set up front', 'Timeline seeded with correlated signals'],
    decisions: ['Rule-based first pass chosen over opaque ML to stay debuggable', 'Severity defaulted conservatively to avoid under-response', 'Classification separated from remediation to allow safe reclass'],
    notAutomated: ['Sev downgrades are manual', 'Cross-service correlations require human confirm when confidence is low', 'Auto-closure is disabled without human review'],
    production: ['Rule hits and misses are logged for tuning', 'Changes to classification rules are audited', 'Access to edit rules is RBAC-restricted', 'Reclassifications keep original evidence for rollback'],
  },
  {
    title: 'Decision Engine & Guardrails',
    why: 'Automation without gating led to bad fixes and regressions.',
    how: ['Confidence thresholds gate which actions are eligible', 'Human-in-the-loop required below thresholds', 'Eligibility checks validate dependencies before execution'],
    decisions: ['Central decision point over scattered checks to keep behavior predictable', 'Confidence bands tuned per incident type', 'Pre-flight checks chosen to fail fast rather than mid-playbook'],
    notAutomated: ['No auto-action on degraded confidence', 'No parallel actions that could conflict', 'Escalations require human ack before branching'],
    production: ['Decisions are logged with inputs and chosen path', 'RBAC controls who can override gates', 'Retries are capped; failures escalate', 'Rollback path recorded for each decision outcome'],
  },
  {
    title: 'Playbook Execution',
    why: 'Manual runbooks were slow and inconsistent, extending outages.',
    how: ['Step-based playbooks with verification steps', 'Bounded blast radius per action', 'Stateful execution with checkpoints'],
    decisions: ['Executable playbooks over freeform scripts to keep auditability', 'Serial execution preferred unless dependencies allow parallelism', 'Verification embedded after risky steps instead of at the end'],
    notAutomated: ['Dangerous steps require human approval inline', 'Cross-system changes without rollback are blocked', 'Expansive cleanup is never auto-invoked'],
    production: ['Each step logs input/output and actor', 'Retries with backoff on idempotent steps only', 'Access to run/stop is role-gated', 'Failed steps can be rolled back via defined compensations'],
  },
  {
    title: 'Verification & Rollback',
    why: 'Unverified fixes reintroduced incidents and hid true recovery time.',
    how: ['Post-action verification checks signals and health', 'Rollback routines paired with risky actions', 'Timers ensure verification is not skipped'],
    decisions: ['Required verification before declaring resolved', 'Rollback primitives stored with the playbook, not ad-hoc', 'Time-bounded verification to avoid hanging incidents'],
    notAutomated: ['No automatic rollback without a failing verification signal', 'No auto-resolve on lack of data', 'Escalation triggers before rollback when uncertainty is high'],
    production: ['Verification outcomes are logged in the incident timeline', 'Rollbacks are idempotent and auditable', 'Only authorized roles can trigger rollback', 'Retries on rollback are limited with alerts on exhaustion'],
  },
  {
    title: 'Human-in-the-loop & Escalation',
    why: 'Pure automation missed edge cases and damaged trust with responders.',
    how: ['Escalation paths by severity and ownership', 'Hold states for human review when confidence drops', 'Explicit handoffs recorded in the incident'],
    decisions: ['Escalate on uncertainty instead of silent retries', 'Human checkpoints inserted before irreversible actions', 'Notification routing based on role and on-call schedules'],
    notAutomated: ['No auto-merge of similar incidents without review', 'No auto-close on silence', 'No paging of off-rotation responders'],
    production: ['Escalation attempts are logged with outcomes', 'RBAC controls who can accept/decline handoff', 'Audit trail captures all human decisions', 'Fallback paging has rate limits and retries with backoff'],
  },
];
const CORTEX_NODES = [
  {
    title: 'Data Ingestion',
    why: 'Metrics drifted because teams ingested inconsistent schemas and stale data.',
    how: ['Multiple source collectors normalized into a canonical model', 'Freshness tracked per source and metric', 'Raw + normalized stored for audit and backfill'],
    decisions: ['Normalize before compute to avoid downstream corrections', 'Prefer pull with checksums over blind push to detect gaps', 'Keep raw data to reprocess when definitions change'],
    notAutomated: ['No auto-onboarding of sources without schema review', 'No auto-heal on missing data without alerting', 'No automatic drop of outliers without inspection'],
    production: ['Ingestion errors are logged with source identifiers', 'Access to add/edit sources is RBAC-controlled', 'All ingests are auditable with timestamps', 'Replays use idempotent writes to avoid duplication'],
  },
  {
    title: 'Truth Layer',
    why: 'Competing dashboards contradicted each other and stalled decisions.',
    how: ['Authoritative metric definitions with owners', 'Derived metrics computed from normalized facts', 'Ownership mapped to every metric and dataset'],
    decisions: ['Central truth layer over team-specific pipelines to eliminate drift', 'Owners required for every metric to avoid orphaned signals', 'Versioned definitions to make changes reviewable'],
    notAutomated: ['No auto-creation of new metrics from ad-hoc queries', 'Conflicting definitions are not auto-resolved', 'Changes to ownership require approval'],
    production: ['Every metric update is logged with version + actor', 'RBAC restricts who can publish or deprecate metrics', 'Backfills are reversible with prior versions', 'Audit trails link dashboards to metric versions'],
  },
  {
    title: 'Bottleneck Detection',
    why: 'Teams missed emerging constraints because signals were vanity-focused.',
    how: ['Signals modeled around flow efficiency and queue depth', 'Risk indicators derived from trend + variance', 'Capacity pressure surfaced with thresholds'],
    decisions: ['Decision-first metrics over broad observability to stay actionable', 'Conservative thresholds to reduce under-alerting', 'Separate exploratory views from operational ones to avoid noise'],
    notAutomated: ['No automatic capacity scaling triggered from these signals', 'No ticket auto-generation without owner confirmation', 'No alert fan-out without defined action paths'],
    production: ['Threshold breaches are logged with current context', 'RBAC gates who can tune thresholds', 'Audit shows when/why a detection fired', 'Rollbacks to prior thresholds are supported if tuning backfires'],
  },
  {
    title: 'Decision-Oriented Dashboards',
    why: 'Dashboards lacked context, leading to slow or wrong decisions.',
    how: ['Role-specific views showing only owned metrics', 'Context panes with links to runbooks and owners', 'Comparative views for bottleneck triage'],
    decisions: ['Role-scoped dashboards instead of one-size-fits-all', 'Context rendered from truth layer to keep meaning intact', 'Avoided vanity charts to maintain signal-to-noise'],
    notAutomated: ['No auto-reflow of layouts that would hide critical metrics', 'No auto-expansion of metrics without owner buy-in', 'No push alerts from dashboards without action mapping'],
    production: ['View access enforced by RBAC and tenant', 'Dashboard renders use versioned metrics to avoid stale meaning', 'Audit logs capture view configurations and changes', 'Rollbacks to prior layouts are available if changes reduce clarity'],
  },
  {
    title: 'Alert Fatigue Prevention',
    why: 'Operators ignored alerts because volume and quality were poor.',
    how: ['Alerts tied to decision-ready metrics only', 'Routing based on ownership and on-call schedules', 'Cooldowns and suppression rules to avoid storms'],
    decisions: ['Actionable-only alerting instead of broad coverage', 'Central routing over team-specific ad-hoc rules', 'Suppression rules visible and auditable to avoid silent failures'],
    notAutomated: ['No auto-paging for low-severity signals', 'No auto-broadening of alert recipients', 'No automatic re-enablement of suppressed alerts without review'],
    production: ['Alert triggers and suppressions are logged', 'RBAC controls who can tune or disable alerts', 'Retries with backoff for delivery; failures escalate', 'Rollback to previous routing/suppression configs is supported'],
  },
];

const GBP_NODES = [
  {
    title: 'Account & Tenant Isolation',
    why: 'Agency teams previously leaked data across clients, creating compliance risk.',
    how: ['Tenant boundary enforced on every query', 'Role scopes applied per tenant', 'Data isolation for assets and analytics'],
    decisions: ['Hard tenant keys instead of soft filters to prevent accidental cross-read', 'Separate roles per tenant to avoid privilege bleed', 'Isolation enforced in code and data to reduce human error'],
    notAutomated: ['No auto-provisioning of cross-tenant roles', 'No bulk export across tenants without approval', 'No inferred permissions from directory groups'],
    production: ['Access attempts are audited with tenant context', 'RBAC enforced at API and UI layers', 'Isolation tests run on deploys', 'Rollback by revoking tokens/roles is immediate'],
  },
  {
    title: 'Content Workflow Engine',
    why: 'Unstructured publishing caused errors, inconsistencies, and brand risk.',
    how: ['Draft -> review -> approval -> publish flow', 'Role-based checkpoints before publish', 'Validation of assets and metadata per step'],
    decisions: ['Structured workflow over freeform editing to prevent mistakes', 'Inline approvals instead of post-publish audits', 'Per-step validations tailored by role to catch issues early'],
    notAutomated: ['No auto-publish from drafts', 'No auto-approve without human review', 'No bypass of review for new templates'],
    production: ['Every transition logged with actor and payload', 'Failed validations return precise errors', 'RBAC restricts who can approve/publish', 'Rollback to prior version is supported with history intact'],
  },
  {
    title: 'Scheduling & Execution',
    why: 'Missed windows and duplicate posts occurred when scheduling was ad-hoc.',
    how: ['Scheduled jobs stored with idempotency keys', 'Execution workers handle retries with visibility', 'Failure surfacing with per-location status'],
    decisions: ['Execution separated from workflow UI to keep runs deterministic', 'Idempotent publish operations to prevent duplicates', 'Visibility dashboards built from execution logs, not optimistic UI state'],
    notAutomated: ['No auto-reschedule on repeated failures without review', 'No silent retries beyond defined limits', 'No mass reschedule across tenants without approval'],
    production: ['Retries with backoff and caps', 'Execution attempts logged with correlation ids', 'Access to force-run or cancel is role-gated', 'Rollback via cancel and republish path retains audit trail'],
  },
  {
    title: 'Oversight & Auditability',
    why: 'Clients needed proof of actions and approvals for compliance and trust.',
    how: ['Content history tracked per location and tenant', 'Approvals and comments linked to each version', 'Reportable audit of who changed what and when'],
    decisions: ['Immutable audit log instead of mutable notes', 'Per-tenant reporting to avoid data bleed', 'Surface audit context in UI to reduce support load'],
    notAutomated: ['No auto-hide of failed or reverted actions', 'No auto-deletion of history', 'No automated approval of disputed changes'],
    production: ['Audit records are append-only with timestamps', 'RBAC controls who can view sensitive audit fields', 'Exports are logged and scoped per tenant', 'Rollback retains full history and marks corrections explicitly'],
  },
  {
    title: 'Safe Automation for Client Actions',
    why: 'Aggressive automation risked brand damage and policy violations.',
    how: ['Confidence thresholds before auto actions', 'Human review for brand-sensitive updates', 'Integrations wrapped with safeguards and retries'],
    decisions: ['Safety gates prioritized over coverage to protect client trust', 'Scoped automation per tenant to avoid global impact', 'Explicit fallbacks to human workflows when signals are weak'],
    notAutomated: ['No auto-response to negative reviews without approval', 'No bulk content changes without human oversight', 'No auto-escalation to new channels without client consent'],
    production: ['Automation attempts are logged with inputs and outputs', 'RBAC controls who can enable/disable automations', 'Failures degrade to manual workflows with alerts', 'Rollback paths defined for each automated action'],
  },
];

const DIAGRAMS = {
  serviceops: { nodes: SERVICE_OPS_NODES, defaultIdx: null },
  umare: { nodes: UMARE_NODES, defaultIdx: 2 },
  cortex: { nodes: CORTEX_NODES, defaultIdx: 1 },
  gbp: { nodes: GBP_NODES, defaultIdx: 1 },
};

// Case cards + modal content
const CASES = {
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
        { h: 'Design rationale', diagram: 'serviceops' },
      ],
    },
  },
  schoolos: {
    pill: 'School OS',
    title: 'AI-Powered School Management System',
    summary: 'Unified school OS with role-based dashboards, academic/behavior tracking, and explainable AI insights so leaders act early instead of reacting late.',
    meta: ['EdTech', 'AI Insights', 'MERN'],
    bullets: [
      'Role-based dashboards for admin, teachers, parents, students',
      'Attendance, performance, and behavior in one system',
      'Explainable AI flags anomalies with suggested actions',
      'Modular MERN stack, privacy and compliance ready',
    ],
    modal: {
      title: 'AI-Powered School Management System (School OS)',
      lead: 'A modern, intelligent school operating system that replaces fragmented tools with a unified, explainable AI layer for day-to-day operations.',
      tags: ['EdTech', 'AI Insights', 'MERN', 'Role-Based Access'],
      sections: [
        {
          h: 'Project Basics',
          list: [
            'Title: AI-Powered School Management System (School OS)',
            'Year/Duration: 2024 - Present (ongoing)',
            'Roles: Product Architect, Full-Stack Developer (MERN), UX/UI Designer, AI Systems Designer',
            'Team size: Solo founder/developer (future collaborators planned)',
            'Stakeholders: admin/leadership, teachers, students, parents/guardians, education partners (South Africa outreach)',
            'Domain: EdTech - school ops, academic management, AI decision support',
          ],
        },
        {
          h: 'Goals & Constraints',
          list: [
            'Business goals: replace fragmented tools; real-time clarity; reduce admin load; become the long-term digital backbone',
            'User goals: admin want clarity/control/insights; teachers want less admin + better tracking; parents want transparency; students want structure and fairness',
            'Success metrics: fewer manual tasks; faster accurate school-wide data; better attendance/performance/communication; cross-role adoption',
            'Constraints: solo/iterative delivery; bootstrapped budget; MERN for scalable but simple deploy; future privacy/compliance readiness',
          ],
        },
        {
          h: 'Problem Framing',
          list: [
            'Target users: primary admin/leadership; secondary teachers/parents; tertiary students',
            'Core problems: fragmented systems; reactive management; data without meaning; manual/repetitive work; poor visibility',
            'Scope: end-to-end school management (academic/operational/behavioral) with AI-assisted analytics and decision support',
            'Assumptions: explainable AI; mobile-first access; simplicity drives adoption',
            'Risks: change resistance; data quality affecting AI; over-engineering too early',
          ],
        },
        {
          h: 'Process',
          list: [
            'Discovery: analyzed existing school systems; mapped admission -> academics -> reporting; studied AI use cases and pain points',
            'Key insights: schools need clarity over feature bloat; dashboards should tell a story; AI should surface patterns/anomalies/risks, not replace humans',
            'Key decisions: single unified system; AI as assistant; admin visibility first, then teachers/parents',
            'Alternatives rejected: off-the-shelf LMS customization; heavy ERP; AI-first without data foundation',
            'Timeline: architecture/data model -> UI prototype -> core modules -> AI metrics/insights -> iterative testing',
          ],
        },
        {
          h: 'Solution Details',
          list: [
            'Core features: role-based system (admin, teacher, student, parent); central dashboard; attendance/performance/behavior tracking; AI insights engine',
            'Core flows: admin views school health; AI highlights risks; drill into classes/students; teachers log daily data; parents see transparent updates',
            'Information architecture: role-separated; dashboard -> module -> detail; data flows up, insights flow down',
            'Design/engineering choices: dark UI for readability; modular backend; explainable AI metrics; prototype-first before React rebuild',
            'Tools & stack: React, external CSS; Node/Express; MongoDB; rule-based + ML-ready AI layer; custom HTML/CSS prototype',
          ],
        },
        {
          h: 'Evidence',
          list: [
            'Live UI prototype used as reference',
            'React rebuild in progress from prototype',
            'Modular MERN codebase with defined AI metrics',
            'Before: manual, disconnected processes; After: unified, insight-driven system',
            'Public link: https://ai-school-os.vercel.app/',
          ],
        },
        {
          h: 'Outcomes (Current & Expected)',
          list: [
            'Current: architecture completed; UI direction finalized; key modules implemented; AI logic framework defined',
            'Expected: reduced admin workload; earlier risk detection; better stakeholder communication; leadership decisions based on real-time data',
            'Qualitative feedback: "control center" feel; leaders can see what is happening without chasing updates',
          ],
        },
        {
          h: 'Reflection & Next',
          list: [
            'Next: pilot with a school (South Africa), add compliance/data governance, ship mobile-first parent app, train AI on anonymized real data',
            'Lessons: clarity beats complexity; AI only valuable when trusted; strong architecture over flashy features',
            'Trade-offs: slower delivery for correctness; focused scope; manual AI logic before full ML',
            'Roadmap: multi-school analytics; district/government reporting; predictive enrollment/staffing; national education system integrations',
          ],
        },
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
        { h: 'Design rationale', diagram: 'umare' },
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
        { h: 'Design rationale', diagram: 'cortex' },
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
        { h: 'Design rationale', diagram: 'gbp' },
      ],
    },
  },
};

export { SERVICE_OPS_NODES, UMARE_NODES, CORTEX_NODES, GBP_NODES, DIAGRAMS, CASES };
