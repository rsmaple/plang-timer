import { useCallback, useRef, useState } from 'react';
import { now, TICK_INTERVAL_MS } from '../time';
import { useInterval } from './useInterval';

export type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  status: TimerStatus;
  elapsed: number;
}

interface TimerInternals {
  accumulated: number;
  startTime: number;
  goalNotified: boolean;
}

export function useTimer(goalSeconds: number | null = null) {
  const [state, setState] = useState<TimerState>({
    status: 'idle',
    elapsed: 0,
  });

  const ref = useRef<TimerInternals>({
    accumulated: 0,
    startTime: 0,
    goalNotified: false,
  });

  useInterval(
    () => {
      const { accumulated, startTime } = ref.current;
      const elapsed = accumulated + (now() - startTime);

      if (
        goalSeconds !== null &&
        !ref.current.goalNotified &&
        elapsed >= goalSeconds * 1000
      ) {
        ref.current.goalNotified = true;
        ref.current.accumulated = goalSeconds * 1000;
        setState({ status: 'paused', elapsed: goalSeconds * 1000 });
        alert(`>>>${goalSeconds}<<<`);
        return;
      }

      if (ref.current.goalNotified) return;

      setState({ status: 'running', elapsed });
    },
    state.status === 'running' ? TICK_INTERVAL_MS : false,
  );

  const start = useCallback(() => {
    if (state.status === 'running') return;

    ref.current.startTime = now();
    setState((prev) => ({ ...prev, status: 'running' }));
  }, [state.status]);

  const pause = useCallback(() => {
    if (state.status !== 'running') return;

    ref.current.accumulated += now() - ref.current.startTime;
    setState({ status: 'paused', elapsed: ref.current.accumulated });
  }, [state.status]);

  const reset = useCallback(() => {
    ref.current.accumulated = 0;
    ref.current.startTime = 0;
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
