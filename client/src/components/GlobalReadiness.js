import React from 'react';

export function GlobalReadiness({ profile }) {
  const readiness = [
    { label: 'Time zones', value: 'Async-first across NA / EU; overlap hours available' },
    { label: 'Languages', value: 'English (fluent); clear written docs' },
    { label: 'Collab kit', value: 'Architecture notes, ADRs, runbooks, demo videos' },
    { label: 'Handoffs', value: 'Structured updates with owners, risks, next steps' },
  ];

  return (
    <section className="section global-ready">
      <div className="glass card">
        <div className="section-header">
          <p className="eyebrow">Global readiness</p>
          <h2>Ready to ship with distributed teams</h2>
          <p className="muted">Async habits, documentation, and handoffs that keep momentum across time zones.</p>
        </div>
        <div className="readiness-grid">
          {readiness.map((item) => (
            <div key={item.label} className="readiness-item">
              <span className="label">{item.label}</span>
              <p className="body">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
