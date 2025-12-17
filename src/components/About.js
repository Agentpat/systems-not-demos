import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import { fadeSlide, stagger } from '../utils/motion';

export function About({ profile }) {
  const style = useParallax(3);
  const initials =
    profile?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AO';

  return (
    <section id="about" className="section about">
      <motion.div className="section-header" variants={fadeSlide} initial="hidden" animate="show">
        <p className="eyebrow">Who I Am</p>
        <h2>Backend automation with product taste</h2>
        <p className="muted">
          A backend engineer who blends system design, AI logic, and interface clarity so ops teams move faster with
          confidence.
        </p>
      </motion.div>

      <motion.div className="about-grid" style={style} variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.div className="about-identity" variants={fadeSlide}>
          <div className="avatar-ring">
            <span>{initials}</span>
          </div>
          <div>
            <p className="label">{profile?.roleTitle || 'Intelligent Operations Automation Engineer'}</p>
            <h3>{profile?.name || 'Akosile Olaide Joseph'}</h3>
            <p className="body">{profile?.about}</p>
          </div>
          <div className="badge-grid">
            {(profile?.skillIcons || []).map((skill) => (
              <motion.span key={skill} className="chip" variants={fadeSlide}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass card about-card" variants={fadeSlide}>
          <p className="label">How I work</p>
          <p className="body">
            I map messy operations into clear workflows, set API and RBAC contracts before code, and ship with
            validation, observability, and rollback plans. Documentation is built-in so distributed teams stay aligned.
          </p>
          {profile?.howIWork && profile.howIWork.length > 0 && (
            <div className="pill-row">
              {profile.howIWork.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          )}
          <div className="meta-grid">
            <div className="meta">
              <span className="label">Workflow</span>
              <span className="value">Discovery - Design - Build - Launch</span>
            </div>
            <div className="meta">
              <span className="label">Principles</span>
              <span className="value">Clarity, fast feedback, observable systems, intentional UX</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
