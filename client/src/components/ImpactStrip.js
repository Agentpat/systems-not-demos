import React from 'react';

export function ImpactStrip({ projects = [] }) {
  const cards = [
    {
      title: projects[0]?.title || 'ServiceOps — service operations automation',
      headline: 'Automated ~70% of dispatch + comms',
      detail: 'SLA breaches down ~30% with timers, routing, and auditable runbooks.',
      link: projects[0]?.links?.video || projects[0]?.links?.live || '#projects',
      cta: 'Watch demo',
    },
    {
      title: projects[1]?.title || 'PulseOps — engineering observability cockpit',
      headline: 'Triage 2x faster',
      detail: 'Release-aware timelines and role-based insights cut confusion during incidents.',
      link: projects[1]?.links?.video || projects[1]?.links?.live || '#projects',
      cta: 'View demo',
    },
    {
      title: 'Reliability playbook',
      headline: 'JWT/RBAC + retries/fallbacks',
      detail: 'Observability, audit logs, and safeguards baked into every service I ship.',
      link: '#architecture-proof',
      cta: 'View architecture notes',
    },
  ];

  return (
    <section className="section impact-strip">
      <div className="section-header">
        <p className="eyebrow">Impact reel</p>
        <h2>Proof in shipped outcomes</h2>
        <p className="muted">Quantified results with demos and repos attached.</p>
      </div>
      <div className="impact-grid">
        {cards.map((card, idx) => (
          <article key={idx} className="glass card impact-card">
            <p className="label">{card.title}</p>
            <h3>{card.headline}</h3>
            <p className="body">{card.detail}</p>
            <a className="text-link" href={card.link} target="_blank" rel="noreferrer">
              {card.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
