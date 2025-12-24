import { useEffect } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useScrollReveal(targets = []) {
  useEffect(() => {
    const elements = Array.from(targets || []).filter(Boolean);
    if (!elements.length) return undefined;

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.classList.add('in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          io.unobserve(en.target);
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [targets]);
}
