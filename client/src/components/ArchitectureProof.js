import React from 'react';

export function ArchitectureProof({ projects = [] }) {
  const archNotes = projects[0]?.architectureNotes || [
    'JWT/RBAC with scoped access and audit trails',
    'Retries/fallbacks on workflows and communications',
    'Observability: logging, metrics, release-aware timelines',
    'GridFS-backed media + validations on ingest',
  ];

  return (
    <section id="architecture-proof" className="section architecture-proof">
      <div className="section-header">
        <p className="eyebrow">Architecture proof</p>
        <h2>Reliability by design</h2>
        <p className="muted">Compact view of how I build safe, observable systems.</p>
      </div>
      <div className="glass card arch-card">
        <div className="arch-grid">
          <div>
            <p className="label">Principles</p>
            <ul className="list">
              <li>JWT/RBAC + scoped permissions for every role</li>
              <li>Validation, retries, fallbacks on critical workflows</li>
              <li>Logging/metrics with release-aware insights</li>
              <li>Auditability across dashboards and comms</li>
            </ul>
          </div>
          <div>
            <p className="label">Current build</p>
            <ul className="list">
              {archNotes.slice(0, 5).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Docs & walkthroughs</p>
            <ul className="list">
              <li>Architecture notes (per project)</li>
              <li>API contracts and RBAC matrices</li>
              <li>Runbooks and failure-mode mapping</li>
              <li>Demo videos and repo links</li>
            </ul>
          </div>
        </div>
        <div className="arch-cta-row">
          <a className="btn ghost small" href="#projects">
            View full architecture notes
          </a>
          <a className="btn primary small" href="#contact">
            Book a 15-min fit call
          </a>
        </div>
      </div>
    </section>
  );
}
