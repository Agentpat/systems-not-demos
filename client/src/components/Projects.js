import React from 'react';
import { motion } from 'framer-motion';
import { fadeSlide, stagger, hoverPop } from '../utils/motion';

export function Projects({ projects = [] }) {
  const renderImpact = (project) => {
    if (project.features && project.features.length) {
      return project.features.slice(0, 3).join('  ');
    }
    return project.description || project.summary || 'Built for reliability, clarity, and measurable impact.';
  };

  const renderTags = (project) => {
    const tags = project.stack?.length ? project.stack : project.tech || [];
    return tags.slice(0, 4);
  };

  return (
    <section id="projects" className="section projects-dark">
      <motion.div className="projects-header" variants={fadeSlide} initial="hidden" animate="show">
        <p className="eyebrow">Projects</p>
        <h2>Automation engines & case studies</h2>
        <p className="projects-sub">
          Operational automation systems built to reduce manual work, create clarity, and improve how organizations function.
        </p>
      </motion.div>

      <motion.div className="projects-grid-dark" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        {projects.map((project, idx) => (
          <motion.article key={project.title || idx} className="project-card-dark" variants={fadeSlide} {...hoverPop}>
            <h3 className="project-title-dark">{project.title}</h3>
            <p className="project-sub-dark">{project.summary || project.description}</p>

            <div className="meta-dark">
              {renderTags(project).map((tag) => (
                <span key={tag} className="meta-tag-dark">
                  {tag}
                </span>
              ))}
            </div>

            <div className="diagram">
              <div className="diagram-line" />
              <div className="diagram-node" />
              <div className="diagram-node" />
              <div className="diagram-node" />
              <div className="diagram-node" />
            </div>

            <p className="impact-dark">
              <strong>Impact:</strong> {renderImpact(project)}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
