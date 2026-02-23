import { useSyncExternalStore } from 'react';
import { TimerStore } from '../timerStore';

export type { TimerStatus } from '../timerStore';

const store = new TimerStore();

export function useTimer(goalSeconds: number | null = null) {
  store.setGoalSeconds(goalSeconds);

  const { status, elapsed } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return {
    status,
    elapsed,
    start: store.start,
    pause: store.pause,
    reset: store.reset,
  };
}
