import { useEffect } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useModalParallax(container, layers = []) {
  useEffect(() => {
    const el = container?.current || container;
    const targets = Array.from(layers || []).filter(Boolean);
    if (!el || !targets.length || prefersReducedMotion()) return undefined;

    targets.forEach((node) => {
      node.style.willChange = 'transform';
    });

    let frame = null;
    const depths = targets.map((node, idx) => {
      const attr = parseFloat(node.getAttribute('data-depth'));
      if (!Number.isNaN(attr)) return attr;
      return idx === 0 ? 0.12 : 0.06;
    });

    const apply = () => {
      frame = null;
      const s = el.scrollTop || 0;
      targets.forEach((node, idx) => {
        node.style.transform = `translate3d(0, ${s * depths[idx]}px, 0)`;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    el.addEventListener('scroll', onScroll);
    apply();

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [container, layers]);
}
