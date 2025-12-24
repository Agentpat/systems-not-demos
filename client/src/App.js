import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useParallax } from './hooks/useParallax';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { useModalParallax } from './hooks/useModalParallax';
import { useBackToTop } from './hooks/useBackToTop';
import { QweMarkup } from './qweMarkup';
import ResumePage from './components/ResumePage';

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
    decisions: ['Central dispatcher chosen over ad-hoc assignment to avoid race conditions', 'Deterministic ordering over ÔÇ£next availableÔÇØ randomness', 'Dispatch logic isolated from workflow engine to swap strategies safely'],
    notAutomated: ['Forced vendor overrides require human approval', 'High-risk assignments do not auto-rotate', 'Bulk reassignments require explicit confirmation'],
    production: ['Queue ops are idempotent and retryable', 'Assignment changes are audited with actor + reason', 'RBAC enforces who can dispatch or override', 'Rollback to unassigned preserves SLA clocks and history'],
  },
  {
    id: 'statemachine',
    x: 52,
    y: 50,
    title: 'Job State Machine',
    why: 'Free-form status edits led to skipped steps, hidden failures, and untracked SLA drift.',
    how: ['Unassigned ÔåÆ Assigned ÔåÆ OnTheWay ÔåÆ Arrived ÔåÆ Completed state path', 'Guards enforce allowed actions per role', 'Each transition writes an event to the job timeline'],
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
    production: ['Ingestion errors logged with source identifiers', 'Access to add/edit sources is RBAC-controlled', 'All ingests are auditable with timestamps', 'Replays use idempotent writes to avoid duplication'],
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
    how: ['Draft ÔåÆ review ÔåÆ approval ÔåÆ publish flow', 'Role-based checkpoints before publish', 'Validation of assets and metadata per step'],
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
    production: ['Automation attempts logged with inputs and outputs', 'RBAC controls who can enable/disable automations', 'Failures degrade to manual workflows with alerts', 'Rollback paths defined for each automated action'],
  },
];

const DIAGRAMS = {
  serviceops: { nodes: SERVICE_OPS_NODES, defaultIdx: null },
  umare: { nodes: UMARE_NODES, defaultIdx: 2 },
  cortex: { nodes: CORTEX_NODES, defaultIdx: 1 },
  gbp: { nodes: GBP_NODES, defaultIdx: 1 },
};

function NodePopover({ nodeRef, open, data, onClose }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'top', ready: false });

  useLayoutEffect(() => {
    if (!open || !nodeRef?.current || !popRef.current) return;
    const margin = 12;
    const offset = 10;
    const rect = nodeRef.current.getBoundingClientRect();
    const popRect = popRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceTop = rect.top - margin;
    const spaceBottom = vh - rect.bottom - margin;
    const spaceRight = vw - rect.right - margin;
    let placement = 'top';
    if (popRect.height + offset <= spaceTop) placement = 'top';
    else if (popRect.height + offset <= spaceBottom) placement = 'bottom';
    else if (popRect.width + offset <= spaceRight) placement = 'right';
    else placement = 'left';
    let top = 0;
    let left = 0;
    if (placement === 'top') {
      top = rect.top - popRect.height - offset;
      left = rect.left + rect.width / 2 - popRect.width / 2;
    } else if (placement === 'bottom') {
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2 - popRect.width / 2;
    } else if (placement === 'right') {
      top = rect.top + rect.height / 2 - popRect.height / 2;
      left = rect.right + offset;
    } else {
      top = rect.top + rect.height / 2 - popRect.height / 2;
      left = rect.left - popRect.width - offset;
    }
    top = Math.max(margin, Math.min(top, vh - popRect.height - margin));
    left = Math.max(margin, Math.min(left, vw - popRect.width - margin));
    setPos({ top, left, placement, ready: true });
  }, [open, data, nodeRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open, onClose]);

  if (!open || !data) return null;

  const blocks = [];
  if (data.why) {
    blocks.push(
      <div key="why" className="npBlock">
        <div className="npLabel">Why this exists</div>
        <p className="npText">{data.why}</p>
      </div>
    );
  }
  const listBlock = (label, items, key) =>
    items?.length ? (
      <div key={key} className="npBlock">
        <div className="npLabel">{label}</div>
        <ul className="npList">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    ) : null;
  blocks.push(listBlock('How it works', data.how, 'how'));
  blocks.push(listBlock('Key design decisions', data.decisions, 'decisions'));
  blocks.push(listBlock('What I chose NOT to automate', data.notAutomated, 'not'));
  blocks.push(listBlock('Production considerations', data.production, 'prod'));

  const arrowStyle = (() => {
    const style = {};
    if (pos.placement === 'top') {
      style.bottom = -6;
      style.left = '50%';
      style.transform = 'translateX(-50%) rotate(45deg)';
    } else if (pos.placement === 'bottom') {
      style.top = -6;
      style.left = '50%';
      style.transform = 'translateX(-50%) rotate(45deg)';
    } else if (pos.placement === 'right') {
      style.left = -6;
      style.top = '50%';
      style.transform = 'translateY(-50%) rotate(45deg)';
    } else {
      style.right = -6;
      style.top = '50%';
      style.transform = 'translateY(-50%) rotate(45deg)';
    }
    return style;
  })();

  return ReactDOM.createPortal(
    <div
      role="tooltip"
      aria-hidden={open ? 'false' : 'true'}
      id="node-popover"
      className={`nodePopover ${pos.ready ? 'show' : ''}`}
      style={{ top: pos.top, left: pos.left }}
      ref={popRef}
    >
      <div className="npArrow" style={arrowStyle} />
      <div className="npBody">
        <div className="npHead">
          <div className="npTitle">{data.title}</div>
          <button className="ghostLink npClose" onClick={onClose} aria-label="Close" type="button">
            ├ù
          </button>
        </div>
        {blocks}
      </div>
    </div>,
    document.body
  );
}

const CASES = {
  serviceops: {
    title: 'Service Ops Automation Platform',
    lead: 'This system exists because manual operations failed at scale. Service lifecycle orchestration with workflow, SLAs, escalations, RBAC, and auditability.',
    tags: ['Service Ops', 'Workflow Engine', 'SLA / Escalations', 'RBAC', 'Audit Trail', 'Production'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Manual job coordination breaks when volume increases: inconsistent handoffs, unclear ownership, SLA misses, and no audit trail.',
      },
      {
        h: 'System Overview',
        p: 'The platform models the service lifecycle end-to-end: intake ÔåÆ assignment ÔåÆ execution ÔåÆ QA ÔåÆ completion, with approvals, escalations, role-based controls, and audit history.',
      },
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
      {
        h: 'Observed Outcome',
        p: 'Work becomes traceable and repeatable: every decision is logged, escalation paths are explicit, and ops is driven by workflow state rather than people memory.',
      },
      {
        h: 'Next Iteration',
        p: 'Expanding automation triggers and integrating a voice-based front door for customer intake and triage.',
      },
      { h: 'Design rationale', diagram: 'serviceops' },
    ],
  },
  schoolos: {
    title: 'AI-Powered School Management System (School OS)',
    lead: 'A modern, intelligent school operating system that replaces fragmented tools with a unified, explainable AI layer for day-to-day operations.',
    tags: ['EdTech', 'AI Insights', 'MERN', 'Role-Based Access'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Schools juggle fragmented tools for attendance, grades, finance, and communication. Leaders react late, teachers drown in admin work, data lacks meaning, and parents have little transparency.',
      },
      {
        h: 'System Overview',
        p: 'School OS unifies academic and operational data into a single, role-based system. Admins get real-time school health, teachers log attendance and assessments fast, parents see trusted progress updates, and an explainable AI layer surfaces anomalies with suggested actions.',
      },
      {
        h: 'Key Design Decisions',
        list: [
          'Single source-of-truth data model instead of disconnected modules or LMS customizations',
          'AI acts as an assistant with explainable insights; no opaque decisions are applied blindly',
          'Admin visibility shipped first, then expanded flows for teachers and parents',
          'Mobile-first access and modular rollout so schools can adopt incrementally',
        ],
      },
      {
        h: 'What Was Intentionally Not Automated',
        list: [
          'Grade changes, disciplinary actions, and compliance-sensitive updates without human approval',
          'AI auto-applying recommendations without confidence and rationale shown to staff',
          'Cross-student data merges or bulk edits without explicit review and audit',
        ],
      },
      {
        h: 'Operational Readiness',
        list: [
          'RBAC across admin, teacher, parent, and student roles with audit logging',
          'Validation on attendance, performance, and behavior inputs with override trails',
          'AI insight cards show confidence and rationale to maintain trust',
          'Deployable MERN stack with privacy guardrails and future compliance hooks',
        ],
      },
      {
        h: 'Observed Outcome',
        p: 'In build: core architecture, UI direction, and key modules are in place. Expected impact: reduced admin load, earlier risk detection, and clearer communication among administrators, teachers, and parents.',
      },
      {
        h: 'Next Iteration',
        p: 'Pilot with a school (starting in South Africa), add compliance and data governance, ship a mobile-first parent app, and train AI models on anonymized real data.',
      },
      { h: 'Design rationale', arch: true },
    ],
  },
  umare: {
    title: 'UMARE Monitoring & Auto-Resolution Engine',
    lead: 'This system exists because manual operations failed at scale. UMARE normalizes signals into incidents, applies triage rules, and executes verified remediation with auditability, rollback, and escalation paths.',
    tags: ['Incidents', 'Playbooks', 'Verification', 'Auditability'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Manual incident handling doesnÔÇÖt scale. Response quality varies by operator, resolution depends on tribal knowledge, and teams grow headcount instead of fixing root causes.',
      },
      {
        h: 'System Overview',
        p: 'UMARE normalizes signals into incidents, applies triage rules, and executes verified remediation playbooks with auditability, rollback, and escalation paths.',
      },
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
      {
        h: 'Observed Outcome',
        p: 'Operational response becomes consistent, traceable, and largely self-serving, with humans supervising only when confidence drops.',
      },
      {
        h: 'Next Iteration',
        p: 'Improving confidence scoring and expanding the playbook library to safely increase automation coverage.',
      },
      { h: 'Design rationale', diagram: 'umare' },
    ],
  },
  hyperflow: {
    title: 'HyperFlow ãÆ?" Workflow Execution Engine',
    lead: 'This system exists because manual operations failed at scale. HyperFlow models workflows as executable state machines with role routing, SLAs, timers, and escalation logic.',
    tags: ['State Machine', 'Routing', 'SLA', 'Audit Trails'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Operational workflows live in peopleÔÇÖs heads and documents, making exceptions expensive and scaling dependent on coordination roles.',
      },
      {
        h: 'System Overview',
        p: 'HyperFlow models workflows as executable state machines with role routing, SLAs, timers, and escalation logic.',
      },
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
      {
        h: 'Observed Outcome',
        p: 'Teams operate with fewer handoffs, predictable execution, and clear accountability across workflows.',
      },
      {
        h: 'Next Iteration',
        p: 'Hardening edge cases and expanding visual modeling into reusable workflow templates.',
      },
      { h: 'Design Rationale', arch: true },
    ],
  },
  cortex: {
    title: 'Cortex ãÆ?" Ops Intelligence Dashboard',
    lead: 'This system exists because manual operations failed at scale. Cortex defines a centralized truth layer and renders decision-oriented views focused on bottlenecks, pressure points, and risk.',
    tags: ['Truth Layer', 'Analytics', 'Alerts', 'Ownership'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Dashboards often lie because operational data lacks a consistent truth model and ownership.',
      },
      {
        h: 'System Overview',
        p: 'Cortex defines a centralized truth layer and renders decision-oriented views focused on bottlenecks, pressure points, and risk.',
      },
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
      {
        h: 'Observed Outcome',
        p: 'Leaders detect operational issues earlier and make decisions based on reality, not vanity metrics.',
      },
      {
        h: 'Next Iteration',
        p: 'Refining signal definitions and tightening feedback loops between metrics and actions.',
      },
      { h: 'Design rationale', diagram: 'cortex' },
    ],
  },
  gbp: {
    title: 'GBP Assistant ãÆ?" Local SEO Automation Platform',
    lead: 'This system exists because manual operations failed at scale. GBP Assistant structures content workflows, approvals, scheduling, and performance visibility in a multi-tenant platform.',
    tags: ['Automation', 'Approvals', 'Scheduling', 'Reporting'],
    sections: [
      {
        h: 'Problem Context',
        p: 'Local SEO operations break down at scale due to fragmented workflows, approvals, and reporting across accounts.',
      },
      {
        h: 'System Overview',
        p: 'GBP Assistant structures content workflows, approvals, scheduling, and performance visibility in a multi-tenant platform.',
      },
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
      {
        h: 'Observed Outcome',
        p: 'Agencies and clients operate consistently across locations with reduced manual oversight.',
      },
      {
        h: 'Next Iteration',
        p: 'Automating performance insights and tightening feedback between content actions and outcomes.',
      },
      { h: 'Design rationale', diagram: 'gbp' },
    ],
  },
};

function MainApp() {
  const rootRef = useRef(null);
  const popoverAnchorRef = useRef(null);
  const [popoverData, setPopoverData] = useState(null);
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || nodes) return;

    const select = (sel) => root.querySelector(sel);
    const selectAll = (sel) => Array.from(root.querySelectorAll(sel));

    setNodes({
      scope: root,
      parallax: selectAll('[data-depth]'),
      reveals: selectAll('.reveal'),
      hWrap: select('#hwrap'),
      hScroll: select('#hscroll'),
      csRight: select('#csRight'),
      modalLayers: [select('#csLayer1'), select('#csLayer2')].filter(Boolean),
      toTop: select('#toTop'),
      drawer: select('#drawer'),
      navLinks: selectAll('.navLink'),
      sections: selectAll('.navLink')
        .map((a) => select(a.getAttribute('href')))
        .filter(Boolean),
      progressCards: selectAll('[data-progress]'),
      roadItems: selectAll('[data-rp]'),
      counters: selectAll('.num[data-count]'),
      cards: selectAll('.card, .heroSide'),
      chips: selectAll('.chip'),
      tools: selectAll('.tool'),
      panels: selectAll('.panel'),
      year: select('#year'),
      csModal: select('#csModal'),
      csTitle: select('#csTitle'),
      csLead: select('#csLead'),
      csMeta: select('#csMeta'),
      csRightSection: select('#csRight'),
      menuBtn: select('.menuBtn'),
      drawerLinks: selectAll('#drawer a, #drawer button'),
    });
  }, [nodes]);

  useParallax(nodes?.parallax || []);
  useScrollReveal(nodes?.reveals || []);
  useHorizontalScroll(nodes?.hWrap);
  useModalParallax(nodes?.csRight, nodes?.modalLayers || []);
  useBackToTop(nodes?.toTop);

  useEffect(() => {
    if (!nodes) return undefined;
    const {
      year,
      drawer,
      menuBtn,
      drawerLinks,
      navLinks,
      sections,
      progressCards,
      roadItems,
      counters,
      cards,
      chips,
      tools,
      panels,
      csModal,
      csTitle,
      csLead,
      csMeta,
      csRightSection,
    } = nodes;

    const chipList = chips || [];
    const toolList = tools || [];
    const cardList = cards || [];
    const navLinkList = navLinks || [];
    const sectionList = sections || [];

    if (year) year.textContent = new Date().getFullYear();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Insert private systems callout below Case Studies heading
    const systemsHeading = nodes.scope?.querySelector('#systems .reveal');
    if (systemsHeading && !systemsHeading.dataset.calloutInserted) {
      const callout = document.createElement('div');
      callout.className = 'infoCallout';
      callout.setAttribute('aria-label', 'Private systems note');
      callout.innerHTML =
        '<span aria-hidden="true" style="margin-right:8px">­ƒöÆ</span><span>Several systems shown were built under client IP agreements or are part of private production environments. Architecture, decisions, and operational behavior are shared where code cannot be.</span>';
      systemsHeading.insertAdjacentElement('afterend', callout);
      systemsHeading.dataset.calloutInserted = 'true';
    }


    // Drawer
    const openDrawer = () => drawer?.classList.add('open');
    const closeDrawer = () => drawer?.classList.remove('open');
    const onDrawerOverlay = (e) => {
      if (e.target === drawer) closeDrawer();
    };
    drawer?.addEventListener('click', onDrawerOverlay);
    menuBtn?.addEventListener('click', openDrawer);
    drawerLinks?.forEach((el) => el.addEventListener('click', closeDrawer));
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;
    window.fakeRead = (e) => e.preventDefault();

    // Active nav highlight
    const navIO =
      sectionList.length
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const id = `#${en.target.id}`;
                navLinkList.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
              });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 }
          )
        : null;
    sectionList.forEach((s) => navIO?.observe(s));

    // Progress bars
    let progIO = null;
    if (prefersReduced) {
      progressCards?.forEach((en) => {
        const p = en.getAttribute('data-progress') || '45';
        const bar = en.querySelector('.progress i');
        if (bar) bar.style.setProperty('--p', `${p}%`);
      });
    } else if (progressCards && progressCards.length) {
      progIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const p = en.target.getAttribute('data-progress') || '45';
            const bar = en.target.querySelector('.progress i');
            if (bar) bar.style.setProperty('--p', `${p}%`);
            progIO.unobserve(en.target);
          });
        },
        { threshold: 0.25 }
      );
      progressCards.forEach((c) => progIO?.observe(c));
    }

    // Roadmap mini progress
    let roadIO = null;
    if (prefersReduced) {
      roadItems?.forEach((en) => {
        const p = en.getAttribute('data-rp') || '30';
        const bar = en.querySelector('.miniProgress i');
        if (bar) bar.style.setProperty('--rp', `${p}%`);
      });
    } else if (roadItems && roadItems.length) {
      roadIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const p = en.target.getAttribute('data-rp') || '30';
            const bar = en.target.querySelector('.miniProgress i');
            if (bar) bar.style.setProperty('--rp', `${p}%`);
            roadIO.unobserve(en.target);
          });
        },
        { threshold: 0.25 }
      );
      roadItems.forEach((i) => roadIO?.observe(i));
    }

    // Counters
    let countIO = null;
    if (prefersReduced) {
      counters?.forEach((el) => {
        const to = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.textContent.includes('%') ? '%' : '+';
        el.textContent = `${to}${suffix}`;
      });
    } else if (counters && counters.length) {
      countIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target;
            const to = parseInt(el.getAttribute('data-count'), 10) || 0;
            const suffix = el.textContent.includes('%') ? '%' : '+';
            const dur = 900;
            const t0 = performance.now();
            const tick = (t) => {
              const p = Math.min(1, (t - t0) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              const val = Math.round(to * eased);
              el.textContent = `${val}${suffix}`;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countIO.unobserve(el);
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((c) => countIO?.observe(c));
    }

    // Card spotlight
    const onCardMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      e.currentTarget.style.setProperty('--mx', `${mx}%`);
      e.currentTarget.style.setProperty('--my', `${my}%`);
    };
    cardList.forEach((c) => c.addEventListener('pointermove', onCardMove));

    // Arsenal filters
    const chipHandlers = new Map();
    const onChipClick = (chip) => {
      chipList.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.getAttribute('data-filter');
      toolList.forEach((t) => {
        const cat = t.getAttribute('data-cat');
        const show = f === 'all' || cat === f;
        t.classList.toggle('hide', !show);
      });
    };
    chipList.forEach((chip) => {
      const handler = () => onChipClick(chip);
      chipHandlers.set(chip, handler);
      chip.addEventListener('click', handler);
    });

    // Case study modal
    const COLLAPSIBLE_SECTIONS = ['Key Design Decisions', 'What Was Intentionally Not Automated', 'Operational Readiness'];

    const renderDetailSections = (node) => {
      if (!node) return '';
      const blocks = [];
      if (node.why) {
        blocks.push(
          `<div style="display:flex; flex-direction:column; gap:6px;">
            <div style="font:700 11px/1.4 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(233,233,241,.7);">Why this exists</div>
            <p style="margin:0; color: rgba(233,233,241,.85); line-height:1.6;">${node.why}</p>
          </div>`
        );
      }
      const listBlock = (label, items) =>
        `<div style="display:flex; flex-direction:column; gap:6px;">
          <div style="font:700 11px/1.4 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:rgba(233,233,241,.7);">${label}</div>
          <ul class="csList" style="margin:0; padding-left:18px; line-height:1.7; color:rgba(233,233,241,.8);">${items
            .map((i) => `<li>${i}</li>`)
            .join('')}</ul>
        </div>`;
      if (node.how?.length) blocks.push(listBlock('How it works', node.how));
      if (node.decisions?.length) blocks.push(listBlock('Key design decisions', node.decisions));
      if (node.notAutomated?.length) blocks.push(listBlock('What I chose NOT to automate', node.notAutomated));
      if (node.production?.length) blocks.push(listBlock('Production considerations', node.production));
      if (!blocks.length) return '';
      return `<div style="display:flex; flex-direction:column; gap:12px;">
        <div style="font-weight:700; color: rgba(255,255,255,.92); font-size:14px;">${node.title || ''}</div>
        ${blocks.join('')}
      </div>`;
    };

    const renderDesignRationale = (diagramKey, titleLabel) => {
      const config = DIAGRAMS[diagramKey];
      if (!config) return '';
      if (diagramKey === 'serviceops') {
        const dots = config.nodes
          .map(
            (node) => `<button type="button" class="drDot" data-node-id="${node.id}" aria-label="${node.title}" style="
              position:absolute;
              left:${node.x}%;
              top:${node.y}%;
              width:12px;
              height:12px;
              transform:translate(-50%,-50%);
              border-radius:999px;
              background: linear-gradient(135deg,var(--accent),var(--accent3));
              box-shadow: 0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20);
              border:1px solid rgba(255,255,255,.16);
              cursor:pointer;
            ">
            </button>`
          )
          .join('');
        return `
          <p style="margin:0 0 10px; color: rgba(233,233,241,.72); line-height:1.6;">Responsibilities are separated to reduce blast radius and enforce operational correctness.</p>
          <div class="csArch" data-diagram="${diagramKey}" style="padding:14px; min-height:220px; background:
            radial-gradient(520px 220px at 18% 24%, rgba(255,42,109,.14), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
            border:1px solid rgba(255,255,255,.12);">
            <div class="wire" aria-hidden="true"></div>
            <div class="drMap" style="position:relative; width:100%; height:100%; min-height:180px;">
              ${dots}
            </div>
          </div>
        `;
      }
      const nodes = config.nodes
        .map(
          (node, idx) => `<button type="button" class="drNode" data-idx="${idx}" role="tab" aria-selected="${
            idx === config.defaultIdx ? 'true' : 'false'
          }" style="border:1px solid rgba(255,255,255,.14); background:rgba(0,0,0,.22); color:rgba(233,233,241,.78); padding:10px 12px; border-radius:12px; display:flex; align-items:flex-start; gap:10px; width:100%; text-align:left; cursor:pointer; min-height:56px;">
            <span aria-hidden="true" style="width:10px; height:10px; border-radius:999px; background: linear-gradient(135deg,var(--accent),var(--accent3)); box-shadow: 0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20); flex-shrink:0; margin-top:4px;"></span>
            <span style="font-weight:600;">${node.title}</span>
          </button>`
        )
        .join('');

      return `
        <p style="margin:0 0 10px; color: rgba(233,233,241,.72); line-height:1.6;">Responsibilities are separated to reduce blast radius and enforce operational correctness.</p>
        <div class="csArch" data-diagram="${diagramKey}" style="padding:14px; min-height:auto; background:
          radial-gradient(520px 220px at 18% 24%, rgba(255,42,109,.14), transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          border:1px solid rgba(255,255,255,.12);">
          <div class="wire" aria-hidden="true"></div>
          <div class="drNodes" role="tablist" aria-label="${titleLabel || diagramKey} design rationale" style="position:relative; z-index:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
            ${nodes}
          </div>
          <div class="drDetail" data-detail style="position:relative; z-index:1; margin-top:12px; padding:12px 14px; border-radius:14px; border:1px solid rgba(255,255,255,.12); background: rgba(0,0,0,.26);"></div>
        </div>
      `;
    };

    const renderCase = (key) => {
      const data = CASES[key];
      if (!data || !csTitle || !csLead || !csMeta || !csRightSection) return;
      csTitle.textContent = data.title;
      csLead.textContent = data.lead;
      csMeta.innerHTML = data.tags.map((t) => `<span class="pill">${t}</span>`).join('');
      const html = data.sections
        .map((sec) => {
          const list = sec.list ? `<ul class="csList">${sec.list.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
          const diagram = sec.diagram ? renderDesignRationale(sec.diagram, data.title) : '';
          const arch = sec.arch
            ? `<div class="csArch" aria-hidden="true">
            <div class="wire"></div>
            <div class="node" style="left:12%; top:40%"></div>
            <div class="node" style="left:34%; top:26%"></div>
            <div class="node" style="left:56%; top:58%"></div>
            <div class="node" style="left:78%; top:34%"></div>
            <div class="node" style="left:86%; top:60%"></div>
          </div>`
            : '';
          const body = `${sec.p ? `<p>${sec.p}</p>` : ''}${list}${arch}${diagram}`;
          const isCollapsible = COLLAPSIBLE_SECTIONS.includes(sec.h);
          const toggle =
            isCollapsible &&
            `<button class="ghostLink csToggle" data-state="collapsed" aria-expanded="false" style="padding:6px 10px; font-size:11px;">Show details</button>`;
          return `<div class="csSection">
            <div class="csSectionHead"${isCollapsible ? ' data-collapsible="true"' : ''}>
              <h4>${sec.h}</h4>
              ${toggle || ''}
            </div>
            <div class="csSectionBody"${isCollapsible ? ' style="display:none;"' : ''}>
              ${body}
            </div>
          </div>`;
        })
        .join('');
      csRightSection.innerHTML = html;
      csRightSection.scrollTop = 0;
      setPopoverData(null);
      popoverAnchorRef.current = null;

      const initDesignRationale = () => {
        const diagrams = Array.from(csRightSection.querySelectorAll('[data-diagram]'));
        diagrams.forEach((diagramEl) => {
          const key = diagramEl.getAttribute('data-diagram');
            const cfg = DIAGRAMS[key];
            if (!cfg) return;
            if (key === 'serviceops') {
              const nodesEls = Array.from(diagramEl.querySelectorAll('[data-node-id]'));
              if (!nodesEls.length) return;
            if (prefersReduced) {
              nodesEls.forEach((n) => {
                n.style.transition = 'none';
              });
              }
              const hoverNone =
                typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches;
              let pinnedId = null;
              const setActive = (id) => {
                nodesEls.forEach((node) => {
                  const isActive = node.getAttribute('data-node-id') === id;
                  node.setAttribute('data-active', isActive ? 'true' : 'false');
                node.style.transform = isActive ? 'translate(-50%,-50%) scale(1.08)' : 'translate(-50%,-50%)';
                node.style.boxShadow = isActive
                  ? '0 0 0 8px rgba(255,42,109,.14), 0 26px 70px rgba(255,42,109,.30)'
                  : '0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20)';
                if (prefersReduced) {
                  node.style.transform = 'translate(-50%,-50%)';
                  node.style.boxShadow = '0 0 0 6px rgba(255,42,109,.10), 0 18px 50px rgba(255,42,109,.20)';
                }
              });
              if (!id) {
                setPopoverData(null);
                popoverAnchorRef.current = null;
                  nodesEls.forEach((n) => n.removeAttribute('aria-describedby'));
                  return;
                }
                const nodeData = cfg.nodes.find((n) => n.id === id);
                const nodeEl = nodesEls.find((n) => n.getAttribute('data-node-id') === id);
              if (!nodeData || !nodeEl) return;
              nodesEls.forEach((n) => n.removeAttribute('aria-describedby'));
              nodeEl.setAttribute('aria-describedby', 'node-popover');
              popoverAnchorRef.current = nodeEl;
              setPopoverData(nodeData);
            };
            if (window.__drOutside) window.__drOutside();
            const closeOnOutside = (e) => {
              if (!diagramEl.contains(e.target)) {
                pinnedId = null;
                setActive(null);
              }
            };
            document.addEventListener('click', closeOnOutside);
            window.__drOutside = () => document.removeEventListener('click', closeOnOutside);
            nodesEls.forEach((node) => {
              const id = node.getAttribute('data-node-id');
              const onEnter = () => {
                if (!hoverNone && !pinnedId) setActive(id);
              };
              const onLeave = () => {
                if (!hoverNone && !pinnedId) setActive(null);
              };
              const onFocus = () => {
                pinnedId = id;
                setActive(id);
              };
              const onBlur = () => {
                if (pinnedId === id) {
                  pinnedId = null;
                  setActive(null);
                }
              };
              const onClick = (evt) => {
                evt.stopPropagation();
                if (pinnedId === id) {
                  pinnedId = null;
                  setActive(null);
                } else {
                  pinnedId = id;
                  setActive(id);
                }
              };
              const onKey = (evt) => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                  evt.preventDefault();
                  if (pinnedId === id) {
                    pinnedId = null;
                    setActive(null);
                  } else {
                    pinnedId = id;
                    setActive(id);
                  }
                }
                if (evt.key === 'Escape') {
                  pinnedId = null;
                  setActive(null);
                }
              };
              node.addEventListener('mouseenter', onEnter);
              node.addEventListener('mouseleave', onLeave);
              node.addEventListener('focus', onFocus);
              node.addEventListener('blur', onBlur);
              node.addEventListener('click', onClick);
              node.addEventListener('keydown', onKey);
              node._handlers = { onEnter, onLeave, onClick, onKey, onFocus, onBlur };
            });
            diagramEl.addEventListener('mouseleave', () => {
              if (!hoverNone && !pinnedId) setActive(null);
            });
            diagramEl.addEventListener('keydown', (e) => {
              if (e.key === 'Escape') {
                pinnedId = null;
                setActive(null);
              }
            });
            setActive(null);
          } else {
            const detail = diagramEl.querySelector('[data-detail]');
            const buttons = Array.from(diagramEl.querySelectorAll('[data-idx]'));
            if (!detail || !buttons.length) return;
            if (prefersReduced) {
              diagramEl.style.transition = 'none';
              detail.style.transition = 'none';
            }
            const applyActive = (idx) => {
              buttons.forEach((btn, i) => {
                const active = i === idx;
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
                btn.setAttribute('data-active', active ? 'true' : 'false');
                btn.style.borderColor = active ? 'rgba(255,42,109,.38)' : 'rgba(255,255,255,.14)';
                btn.style.background = active ? 'rgba(255,42,109,.12)' : 'rgba(0,0,0,.22)';
              });
              const node = cfg.nodes[idx];
              if (!node || !detail) return;
              detail.innerHTML = renderDetailSections(node);
            };
            const setActive = (idx) => applyActive(idx);
            buttons.forEach((btn, idx) => {
              if (prefersReduced) btn.style.transition = 'none';
              const onActivate = () => setActive(idx);
              const onKey = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(idx);
                }
              };
              btn.addEventListener('click', onActivate);
              btn.addEventListener('keydown', onKey);
            });
            setActive(typeof cfg.defaultIdx === 'number' && cfg.defaultIdx !== null ? cfg.defaultIdx : 0);
          }
        });
      };

      const toggles = csRightSection.querySelectorAll('.csToggle');
      toggles.forEach((btn) => {
        const sec = btn.closest('.csSection');
        const body = sec?.querySelector('.csSectionBody');
        if (!body) return;
        const setState = (expanded) => {
          body.style.display = expanded ? '' : 'none';
          btn.textContent = expanded ? 'Hide details' : 'Show details';
          btn.setAttribute('aria-expanded', expanded);
          btn.setAttribute('data-state', expanded ? 'expanded' : 'collapsed');
        };
        setState(false);
        const handler = () => setState(btn.getAttribute('data-state') === 'collapsed');
        btn.addEventListener('click', handler);
        btn._handler = handler;
      });

      initDesignRationale();
    };

    const openCaseStudy = (key) => {
      renderCase(key);
      csModal?.classList.add('open');
      csModal?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeCaseStudy = () => {
      csModal?.classList.remove('open');
      csModal?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    window.openCaseStudy = openCaseStudy;
    window.closeCaseStudy = closeCaseStudy;

    const onModalClick = (e) => {
      if (e.target === csModal) closeCaseStudy();
    };
    csModal?.addEventListener('click', onModalClick);

    const panelKeys = ['serviceops', 'schoolos', 'umare', 'hyperflow', 'cortex', 'gbp'];
    const liveLinks = {
      serviceops: 'https://serviceops.pro/',
      schoolos: 'https://ai-school-os.vercel.app/',
    };
    panels?.forEach((panel, idx) => {
      const key = panelKeys[idx];
      const handler = () => openCaseStudy(key);
      panel.addEventListener('click', handler);
      panel.dataset.caseKey = key;
      panel.__handler = handler;

      const liveLink = liveLinks[key];
      if (liveLink && !panel.querySelector('.panelActions')) {
        const actions = document.createElement('div');
        actions.className = 'panelActions';
        actions.innerHTML = `<a class="ghostLink" href="${liveLink}" target="_blank" rel="noreferrer noopener" aria-label="Open ${key} live demo">Live Demo -></a>`;
        const bullets = panel.querySelector('.bullets');
        if (bullets) bullets.insertAdjacentElement('afterend', actions);
      }
    });

    // Escape handling
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        if (csModal?.classList.contains('open')) closeCaseStudy();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // Ensure modal layers reset on initial render
    if (!prefersReduced) {
      csRightSection?.scrollTo(0, 0);
    }

    return () => {
      drawer?.removeEventListener('click', onDrawerOverlay);
      menuBtn?.removeEventListener('click', openDrawer);
      drawerLinks?.forEach((el) => el.removeEventListener('click', closeDrawer));
      navIO?.disconnect();
      progIO?.disconnect();
      roadIO?.disconnect();
      countIO?.disconnect();
      cards?.forEach((c) => c.removeEventListener('pointermove', onCardMove));
      chipList.forEach((chip) => {
        const handler = chipHandlers.get(chip);
        if (handler) chip.removeEventListener('click', handler);
      });
      panels?.forEach((panel) => {
        if (panel.__handler) panel.removeEventListener('click', panel.__handler);
      });
      csModal?.removeEventListener('click', onModalClick);
      window.removeEventListener('keydown', onKeyDown);
      if (window.__drOutside) window.__drOutside();
      document.body.style.overflow = '';
    };
  }, [nodes]);

  return (
    <>
      <QweMarkup ref={rootRef} />
      <NodePopover
        open={!!popoverData}
        nodeRef={popoverAnchorRef}
        data={popoverData}
        onClose={() => {
          setPopoverData(null);
          popoverAnchorRef.current = null;
        }}
      />
    </>
  );
}

function App() {
  const isResumeRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/resume');
  return isResumeRoute ? <ResumePage /> : <MainApp />;
}

export default App;

