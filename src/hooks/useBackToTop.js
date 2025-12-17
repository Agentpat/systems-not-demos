import { useEffect } from 'react';

export function useBackToTop(button) {
  useEffect(() => {
    const btn = button?.current || button;
    if (!btn) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = () => {
      btn.classList.toggle('show', window.scrollY > 900);
    };

    const onClick = () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      btn.removeEventListener('click', onClick);
    };
  }, [button]);
}
