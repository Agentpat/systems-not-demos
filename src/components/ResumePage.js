import React, { useEffect } from 'react';
import './ResumePage.css';

const coreSkills = [
  'Backend Engineering',
  'Systems Engineering',
  'Platform Engineering',
  'Automation',
  'Node.js',
  'Express.js',
  'REST APIs',
  'Workflow Engines',
  'State Machines',
  'Event-Driven Architecture',
  'MongoDB',
  'Mongoose',
  'Data Modeling',
  'Background Jobs',
  'Monitoring Systems',
  'RBAC',
  'JWT Authentication',
  'Audit Logging',
  'MERN Stack',
];

const targetRoles = ['Backend Engineer', 'Systems Engineer', 'Platform Engineer', 'Automation Engineer', 'Backend-Focused Full-Stack Engineer'];

const experience = [
  {
    title: 'Automation Engineer / Systems Engineer',
    company: 'Chacon Strategies Limited - Denver, Colorado (Remote)',
    date: 'June 2023 - Present',
    bullets: [
      'Designed and built a service operations automation platform that replaced manual job coordination with structured workflows',
      'Implemented workflow engines with approvals, escalation paths, and audit trails',
      'Reduced manual service coordination by automating core workflows, enabling teams to operate with fewer handoffs and less human intervention',
      'Building a voice AI customer service platform that integrates into any website via a single-line embed',
      'Designed the system to autonomously handle customer interactions, routing, and responses',
      'Owned backend architecture, system design, and implementation independently',
      'Technologies: Node.js, Express.js, MongoDB, REST APIs, Workflow Automation, AI Integration',
    ],
  },
  {
    title: 'Online IT Support (Contract)',
    company: 'AXA Mansard Insurance',
    date: 'Feb 2025 - May 2025',
    bullets: [
      'Provided centralized online IT support for 32 insurance branches across Western Nigeria',
      'Supported internal systems, access control, and operational continuity',
      'Worked within regulated, compliance-driven insurance environments',
      'Assisted branch teams with system availability, troubleshooting, and incident resolution',
    ],
  },
  {
    title: 'Systems Engineer (Contract)',
    company: 'Healthcare Provider - Port Harcourt, Nigeria',
    date: 'March 2024 - August 2024',
    bullets: [
      'Designed and built an AI-powered Electronic Medical Records (EMR) system',
      'Implemented patient record management, medical history tracking, and operational data workflows',
      'Integrated AI-assisted features to improve data retrieval and operational efficiency',
      'Owned backend architecture, development, and deployment',
    ],
  },
];

const projects = [
  {
    title: 'UMARE - Unified Monitoring & Auto-Resolution Engine',
    bullets: [
      'Designed an operations engine for incident detection, triage, and automated remediation',
      'Implemented executable playbooks with verification, rollback, and escalation paths',
      'Targeted a 60-80% reduction in manual incident handling through automation',
      'Applied human-in-the-loop automation for safety-critical workflows',
    ],
  },
  {
    title: 'Cortex Ops - Operations Intelligence Dashboard',
    bullets: [
      'Designed a centralized truth layer for operational data to eliminate inconsistent metrics',
      'Built dashboards focused on bottlenecks, workload pressure, and decision support',
      'Improved early visibility into operational risk before incidents occurred',
    ],
  },
  {
    title: 'GBP Assistant - Local SEO Automation Platform',
    bullets: [
      'Built a multi-tenant, multi-role platform for Google Business Profile operations',
      'Implemented content workflows, approvals, scheduling, insights, and reporting',
      'Designed the system for repeatable scale across agencies and client accounts',
    ],
  },
];

const skillCategories = [
  {
    title: 'Backend & Systems',
    text: 'Node.js, Express.js, REST API Design, Workflow Engines, State Machines, Event-Driven Systems, Background Jobs, Monitoring Concepts, System Design',
  },
  {
    title: 'Security & Access Control',
    text: 'JWT Authentication, Role-Based Access Control (RBAC), Permission Management, Audit Trails',
  },
  {
    title: 'Data & Storage',
    text: 'MongoDB, Mongoose, Schema Design, Indexing, Aggregation Pipelines, Data Normalization',
  },
  {
    title: 'Automation & AI',
    text: 'Service Automation, Voice AI Systems, AI-Assisted Customer Support, Human-in-the-Loop Automation',
  },
  {
    title: 'Frontend (Supporting)',
    text: 'React.js, Role-Based Dashboards, Internal Tool Interfaces',
  },
];

export function ResumePage() {
  useEffect(() => {
    document.title = 'Olaide Akosile Joseph - Resume';
  }, []);

  return (
    <div className="resume-page">
      <div className="resume-container">
        <header className="resume-header">
          <h1>OLAIDE AKOSILE JOSEPH</h1>
          <div className="title">Systems Engineer | Backend &amp; Platform Automation</div>
          <div className="contact-info">
            <span>Location: Nigeria | Open to Remote (Global)</span>
            <span>
              Email:{' '}
              <a href="mailto:olaideakosile35@gmail.com" rel="noreferrer">
                olaideakosile35@gmail.com
              </a>
            </span>
            <span>
              GitHub:{' '}
              <a href="https://github.com/Agentpat/" target="_blank" rel="noreferrer">
                Agentpat
              </a>
            </span>
            <span>
              LinkedIn:{' '}
              <a href="https://linkedin.com/in/olaide" target="_blank" rel="noreferrer">
                linkedin.com/in/olaide
              </a>
            </span>
            <span>
              Portfolio:{' '}
              <a
                href="https://systems-not-demos-oaq72x7ix-olaideakosiles-projects.vercel.app"
                target="_blank"
                rel="noreferrer"
              >
                systems-not-demos
              </a>
            </span>
          </div>
        </header>

        <section className="section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">
            Systems-focused backend engineer with 4+ years of experience designing and building automation-first platforms. Specialized in service
            operations automation, workflow engines, monitoring systems, and internal tools. Proven ability to own system architecture end-to-end,
            reduce manual operational workload, and build scalable backend platforms using Node.js and MongoDB. Experience across insurance, healthcare,
            and service-based organizations.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Core Skills</h2>
          <div className="core-skills">
            {coreSkills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Professional Experience</h2>
          {experience.map((job) => (
            <div key={job.title} className="job">
              <div className="job-header">
                <div className="job-title">{job.title}</div>
                <div className="company">{job.company}</div>
                <div className="date">{job.date}</div>
              </div>
              <ul>
                {job.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="section">
          <h2 className="section-title">Independent Systems &amp; Case Studies</h2>
          {projects.map((proj) => (
            <div key={proj.title} className="project">
              <div className="project-header">
                <div className="project-title">{proj.title}</div>
              </div>
              <ul>
                {proj.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="section">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            {skillCategories.map((cat) => (
              <div key={cat.title} className="skill-category">
                <h4>{cat.title}</h4>
                <p>{cat.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Education</h2>
          <div className="job">
            <div className="job-header">
              <div className="job-title">Bachelor of Science (B.Sc.) in Computer Science</div>
              <div className="date">Graduated 2024</div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Target Roles</h2>
          <div className="target-roles">
            {targetRoles.map((role) => (
              <span key={role} className="role-tag">
                {role}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResumePage;
