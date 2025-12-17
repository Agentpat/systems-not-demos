import React from 'react';

export function SignalsRow() {
  const signals = ['MERN', 'RBAC', 'Automation flows', 'Observability', 'APIs', 'Retries/Fallbacks'];

  return (
    <section className="section signals-row">
      <div className="glass card signals-card">
        <div className="signals-header">
          <div>
            <p className="eyebrow">Signals</p>
            <h3>Stacks and patterns I ship confidently</h3>
          </div>
          <a className="btn primary small" href="#contact">
            Book a 15-min fit call
          </a>
        </div>
        <div className="pill-row">
          {signals.map((sig) => (
            <span key={sig} className="pill">
              {sig}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
