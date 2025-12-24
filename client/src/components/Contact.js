import React from 'react';
import { motion } from 'framer-motion';
import { fadeSlide, stagger, hoverPop } from '../utils/motion';

export function Contact({ contacts = {} }) {
  const email = contacts.email || 'olaideakosile35@gmail.com';

  return (
    <section id="contact" className="section contact">
      <motion.div className="glass card contact-card" variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
        <motion.div variants={stagger(0.08)}>
          <p className="eyebrow">Let&apos;s automate</p>
          <h2>Let&apos;s automate something meaningful.</h2>
          <p className="body">
            If you&apos;re improving internal operations, building automation, or designing AI-driven workflows, I can help
            architect and ship systems that reduce manual work and improve reliability.
          </p>
          <div className="cta-row">
            <motion.a className="btn primary" href={`mailto:${email}`} {...hoverPop}>
              Get in touch
            </motion.a>
            {contacts.calendly && (
              <motion.a className="btn ghost" href={contacts.calendly} target="_blank" rel="noreferrer" {...hoverPop}>
                Book a call
              </motion.a>
            )}
          </div>
        </motion.div>
        <motion.div className="contact-links" variants={fadeSlide}>
          <p className="label">Let&apos;s talk</p>
          <ul className="list">
            {contacts.email && (
              <li>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </li>
            )}
            {contacts.linkedin && (
              <li>
                <a href={contacts.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            )}
            {contacts.twitter && (
              <li>
                <a href={contacts.twitter} target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>
            )}
            {contacts.resumeUrl && (
              <li>
                <a href={contacts.resumeUrl} target="_blank" rel="noreferrer">
                  Download resume
                </a>
              </li>
            )}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
