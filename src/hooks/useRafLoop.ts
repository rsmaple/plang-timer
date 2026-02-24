import { useEffect, useRef } from 'react';

export function useRafLoop(callback: () => void, active: boolean): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    let rafId: number;

    const loop = () => {
      savedCallback.current();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
}
