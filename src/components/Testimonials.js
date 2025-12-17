import React from 'react';

const testimonials = [
  {
    quote: 'Olaide shipped automation that cut manual dispatch work in half and kept SLAs tight under pressure.',
    author: 'Ops Lead, Roadside Services',
  },
  {
    quote: 'He documents clearly, adds safeguards by default, and is reliable across time zones.',
    author: 'Product Manager, SaaS Platform',
  },
];

export function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="section-header">
        <p className="eyebrow">Testimonials</p>
        <h2>Refs on reliability and speed</h2>
      </div>
      <div className="grid">
        {testimonials.map((item) => (
          <article key={item.author} className="glass card testimonial-card">
            <p className="body">“{item.quote}”</p>
            <p className="label">{item.author}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
