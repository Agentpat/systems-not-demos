import { useEffect } from 'react';

const layerRegistry = new Set();
let rafId = null;
let lastY = 0;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function step() {
  const y = window.scrollY || 0;
  if (Math.abs(y - lastY) > 0.1) {
    lastY = y;
    layerRegistry.forEach(({ el, depth }) => {
      if (!el) return;
      el.style.transform = `translate3d(0, ${-y * depth}px, 0)`;
    });
  }
  rafId = window.requestAnimationFrame(step);
}

function startLoop() {
  if (rafId == null) {
    rafId = window.requestAnimationFrame(step);
  }
}

function stopLoop() {
  if (layerRegistry.size === 0 && rafId != null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
    lastY = 0;
  }
}

export function useParallax(layers = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) return undefined;
    const items = Array.from(layers || [])
      .filter(Boolean)
      .map((el) => ({
        el,
        depth: Math.min(0.3, Math.max(0.05, parseFloat(el.getAttribute('data-depth')) || 0.1)),
      }));

    items.forEach(({ el }) => {
      el.style.willChange = 'transform';
    });

    items.forEach((item) => layerRegistry.add(item));
    if (items.length) startLoop();

    return () => {
      items.forEach((item) => layerRegistry.delete(item));
      stopLoop();
    };
  }, [layers]);
}
