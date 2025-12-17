import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import aiVisual from '../images/ai.jpg';
import { fadeSlide, stagger, hoverPop } from '../utils/motion';

export function Hero({ profile }) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const parallaxStyle = useParallax(6, motionEnabled);
  const defaultPills = [
    'End-to-end workflow automation',
    'AI decision & routing engines',
    'Dashboards, audit & safeguards',
  ];
  const metaPills =
    profile?.heroBadges && profile.heroBadges.length > 0 ? profile.heroBadges.slice(0, 3) : defaultPills;
  const headline = profile?.heroHeadline;
  const subtext = profile?.heroSubtext;

  return (
    <section id="hero" className="section hero hero-landing">
      <motion.div
        className="hero-shell glass hero-prototype"
        style={parallaxStyle}
        variants={fadeSlide}
        initial="hidden"
        animate="show"
      >
        <motion.div className="hero-prototype-grid" variants={stagger(0.12)} initial="hidden" animate="show">
          <motion.div className="hero-left" variants={fadeSlide}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>Automation platforms that run entire operations</span>
            </div>

            <div className="hero-eyebrow">{profile?.roleTitle || 'Intelligent Operations Automation Engineer'}</div>

            <h1 className="hero-headline hero-headline-prototype">
              {headline ? (
                headline
              ) : (
                <>
                  AI automation systems for end-to-end <span>data operations</span> and workflow execution.
                </>
              )}
            </h1>

            <p className="hero-subtext hero-subtext-prototype">
              {subtext ||
                'I design operational leverage: systems that absorb complexity and remove manual touch points. Automating workflows, reducing ops load, and scaling teams without headcount.'}
            </p>

            <div className="hero-meta-row">
              {metaPills.map((pill) => (
                <motion.span key={pill} className="hero-meta-pill" variants={fadeSlide}>
                  {pill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div className="hero-right" variants={fadeSlide}>
            <div className="hero-visual-shell">
              <div className="hero-visual-inner">
                <div className="hero-hint-label">{'AI brain <-> workflow network'}</div>

                <div className="hero-visual-img">
                  <motion.img
                    src={aiVisual}
                    alt="AI automation brain and workflow grid"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>

                <div className="hero-visual-glow" />

                <div className="hero-metric-card metric-one">
                  <span className="metric-tag">Manual work removed</span>
                  <strong>70%+</strong>
                </div>
                <div className="hero-metric-card metric-two">
                  <span className="metric-tag">Operations covered</span>
                  <strong>Company-wide</strong>
                </div>
                <div className="hero-metric-card metric-three">
                  <span className="metric-tag">Designed for</span>
                  <strong>Any industry</strong>
                </div>
              </div>
            </div>

            <div className="hero-cta-row hero-cta-right">
              <motion.a href="#projects" className="hero-cta hero-cta-primary" {...hoverPop}>
                View portfolio
              </motion.a>
              <motion.a href="#case-studies" className="hero-cta hero-cta-ghost" {...hoverPop}>
                See one flagship system
              </motion.a>
              <motion.button
                type="button"
                className="hero-cta hero-cta-ghost motion-toggle"
                onClick={() => setMotionEnabled((prev) => !prev)}
                {...hoverPop}
              >
                {motionEnabled ? 'Disable bending animation' : 'Enable bending animation'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
