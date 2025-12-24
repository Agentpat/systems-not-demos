import { useEffect } from 'react';

export function useHorizontalScroll(target) {
  useEffect(() => {
    const el = target?.current || target;
    if (!el) return undefined;
    const canHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!canHover) return undefined;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [target]);
}
