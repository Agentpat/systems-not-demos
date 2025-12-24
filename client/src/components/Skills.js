import React from 'react';
import { motion } from 'framer-motion';
import { fadeSlide, stagger, hoverPop } from '../utils/motion';

export function Skills({ skills = [] }) {
  const categories = skills.length
    ? skills
    : [
        { label: 'Backend Development', items: ['Node.js', 'Express', 'REST APIs', 'Authentication', 'RBAC'] },
        { label: 'Frontend Systems', items: ['React', 'Component systems', 'Dashboard UX', 'Animations'] },
        { label: 'Databases', items: ['MongoDB', 'Schema design', 'Indexing', 'Aggregation'] },
        { label: 'AI & Automation', items: ['Workflow engines', 'Voice AI', 'Prompt logic', 'Operational copilots'] },
        { label: 'DevOps', items: ['Docker', 'CI-ready pipelines', 'Observability habits'] },
      ];

  return (
    <section id="skills" className="section skills constellation">
      <motion.div className="section-header" variants={fadeSlide} initial="hidden" animate="show">
        <p className="eyebrow">Skills</p>
        <h2>Battle-tested, ship-ready skills</h2>
        <p className="muted">Stacks and practices mapped as a constellation of capabilities.</p>
      </motion.div>

      <motion.div className="constellation-map" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        {categories.map((bucket, idx) => (
          <motion.div key={bucket.label} className={`constellation-node node-${idx + 1}`} variants={fadeSlide} {...hoverPop}>
            <div className="node-core">
              <span>{idx + 1}</span>
              <p>{bucket.label}</p>
            </div>
            <div className="node-ring" />
            <div className="orbit">
              {(bucket.items || []).map((item) => (
                <span key={item} className="orbit-skill">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
