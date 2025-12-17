import React from 'react';
import { motion } from 'framer-motion';
import { fadeSlide, stagger } from '../utils/motion';

export function CaseStudies({ items = [] }) {
  return (
    <section id="case-studies" className="section case-studies">
      <motion.div className="section-header" variants={fadeSlide} initial="hidden" animate="show">
        <p className="eyebrow">Projects & Case Studies</p>
        <h2>High-end UI rich breakdowns</h2>
        <p className="muted">
          Each project comes with its own custom banner, deep explanations, diagrams, feature lists, and real outcomes
          so you can quickly understand the thinking behind the work.
        </p>
      </motion.div>

      <motion.div className="case-grid case-grid-duo" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        {items.map((item) => (
          <motion.article
            key={item.slug || item.title}
            id={`case-${item.slug || item.title?.toLowerCase().replace(/\s+/g, '-')}`}
            className="glass card case-card"
            variants={fadeSlide}
          >
            <div className="case-banner">
              <span className="pill small">{item.badge || 'Case Study'}</span>
              <h3>{item.title}</h3>
              <p className="body">{item.overview}</p>
            </div>

            <div className="case-body">
              <div className="case-block">
                <p className="label">My responsibilities</p>
                <ul className="list">
                  {(item.responsibilities || []).map((resp) => (
                    <li key={resp}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="case-block architecture">
                <p className="label">Architecture / flow</p>
                <div className="arch-diagram">
                  <span className="node">API</span>
                  <span className="node">Logic</span>
                  <span className="node">AI</span>
                  <span className="node">DB</span>
                  <span className="node">Users</span>
                </div>
                <ul className="list">
                  {(item.architectureNotes || []).map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="case-columns">
              <div>
                <p className="label">Features</p>
                <ul className="list">
                  {(item.features || []).map((feat) => (
                    <li key={feat}>{feat}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label">Results</p>
                <ul className="list">
                  {(item.results || []).map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              </div>
              <div className="case-links">
                <p className="label">Links</p>
                <div className="links">
                  {item.links?.live && (
                    <a className="text-link" href={item.links.live} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                  {item.links?.demo && (
                    <a className="text-link" href={item.links.demo} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
