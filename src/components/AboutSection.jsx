import React from 'react';
import './AboutSection.css';

export default function AboutSection() {
  return (
    <section className="about-pro" id="about">
      <div className="pro-left">
        <h2>Backend automation with product clarity</h2>
        <p className="tagline">
          An engineer who designs AI-powered automation systems that adapt to <strong>any industry</strong> and transform
          chaotic operations into structured, reliable, data-driven workflows.
        </p>

        <div className="identity-card">
          <h3>Akosile Olaide Joseph</h3>
          <p>
            Intelligent Operations Automation Engineer specializing in AI-driven workflow systems that scale across{' '}
            <strong>any operational domain</strong>. I focus on clarity, reliability, and automation depth — turning
            real-world operations into predictable systems that teams can trust.
          </p>

          <div className="skill-grid">
            <span className="skill-pill">AI Logic</span>
            <span className="skill-pill">Workflow Engines</span>
            <span className="skill-pill">Automation</span>
            <span className="skill-pill">RBAC</span>
            <span className="skill-pill">API Design</span>
            <span className="skill-pill">Observability</span>
            <span className="skill-pill">Node.js</span>
            <span className="skill-pill">MongoDB</span>
          </div>
        </div>

        <div className="approach-card">
          <h4>Work principles</h4>
          <ul className="approach-list">
            <li>Clarity first: write the workflow and contracts before shipping code.</li>
            <li>Depth over hacks: validation, observability, and rollback are default.</li>
            <li>Docs as part of delivery: decisions captured so teams stay aligned.</li>
          </ul>
        </div>
      </div>

      <div className="workflow-pro">
        <h4>How I work</h4>

        <div className="flow-container">
          <div className="flow-path">
            <svg viewBox="0 0 440 230" preserveAspectRatio="none">
              <path d="M10 10 C 150 100, 250 0, 430 90" className="flow-line" />
              <path d="M10 90 C 160 140, 260 40, 430 140" className="flow-line" />
              <path d="M10 170 C 180 220, 260 120, 430 210" className="flow-line" />
            </svg>
          </div>

          <div className="flow-node flow-node-1">
            <div className="node-circle">1</div>
            <div className="node-text">Map messy operations into clean, automated workflow models.</div>
          </div>

          <div className="flow-node flow-node-2">
            <div className="node-circle">2</div>
            <div className="node-text">Define API, RBAC, and decision logic before any code is written.</div>
          </div>

          <div className="flow-node flow-node-3">
            <div className="node-circle">3</div>
            <div className="node-text">Implement systems with validation, observability, and rollback safety.</div>
          </div>

          <div className="flow-node flow-node-4">
            <div className="node-circle">4</div>
            <div className="node-text">
              Document and communicate so distributed teams stay aligned and confident.
            </div>
          </div>
        </div>

        <div className="principles-pro">
          <strong>Principles:</strong> clarity, fast feedback, dependable automation, and intentional UX for internal
          operations.
        </div>
      </div>
    </section>
  );
}
