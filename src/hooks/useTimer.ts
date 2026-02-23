import { useCallback, useRef, useState } from 'react';
import { now, TICK_INTERVAL_MS } from '../time';
import { useInterval } from './useIterval';

export type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  status: TimerStatus;
  elapsed: number;
}

interface TimerRef {
  status: TimerStatus;
  accumulated: number;
  startTime: number;
  goalNotified: boolean;
}

export function useTimer(goalSeconds: number | null = null) {
  const [state, setState] = useState<TimerState>({
    status: 'idle',
    elapsed: 0,
  });

  const ref = useRef<TimerRef>({
    status: 'idle',
    accumulated: 0,
    startTime: 0,
    goalNotified: false,
  });

  useInterval(
    () => {
      const elapsed = ref.current.accumulated + (now() - ref.current.startTime);

      if (
        goalSeconds !== null &&
        !ref.current.goalNotified &&
        elapsed >= goalSeconds * 1000
      ) {
        ref.current.goalNotified = true;
        ref.current.accumulated = goalSeconds * 1000;
        ref.current.status = 'paused';
        setState({ status: 'paused', elapsed: goalSeconds * 1000 });
        alert(`>>>${goalSeconds}<<<`);
        return;
      }

      setState({ status: 'running', elapsed });
    },
    state.status === 'running' ? TICK_INTERVAL_MS : false,
  );

  const start = useCallback(() => {
    if (ref.current.status === 'running') return;

    ref.current.startTime = now();
    ref.current.status = 'running';
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const pause = useCallback(() => {
    if (ref.current.status !== 'running') return;

    ref.current.accumulated += now() - ref.current.startTime;
    ref.current.status = 'paused';
    setState({ status: 'paused', elapsed: ref.current.accumulated });
  }, []);

  const reset = useCallback(() => {
    ref.current.accumulated = 0;
    ref.current.startTime = 0;
    ref.current.status = 'idle';
    ref.current.goalNotified = false;
    setState({ status: 'idle', elapsed: 0 });
  }, []);

  return {
    status: state.status,
    elapsed: state.elapsed,
    start,
    pause,
    reset,
  };
}
