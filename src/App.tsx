import { useRef, useState } from 'react';
import './App.css';
import { useInterval } from './hooks/useIterval';
import { formatTime, now, TICK_INTERVAL_MS } from './time';

type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  status: TimerStatus;
  elapsed: number;
}

interface TimerRef {
  status: TimerStatus;
  accumulated: number;
  startTime: number;
}

const App = () => {
  const [timer, setTimer] = useState<TimerState>({
    status: 'idle',
    elapsed: 0,
  });

  const ref = useRef<TimerRef>({
    status: 'idle',
    accumulated: 0,
    startTime: 0,
  });

  useInterval(
    () => {
      const elapsed = ref.current.accumulated + (now() - ref.current.startTime);
      setTimer({ status: 'running', elapsed });
    },
    timer.status === 'running' ? TICK_INTERVAL_MS : false,
  );

  const handleStart = () => {
    if (ref.current.status === 'running') return;

    ref.current.startTime = now();
    ref.current.status = 'running';
    setTimer((prev) => ({ ...prev, status: 'running' }));
  };

  const handlePause = () => {
    if (ref.current.status !== 'running') return;

    ref.current.accumulated += now() - ref.current.startTime;
    ref.current.status = 'paused';
    setTimer({ status: 'paused', elapsed: ref.current.accumulated });
  };

  const handleReset = () => {
    ref.current.accumulated = 0;
    ref.current.startTime = 0;
    ref.current.status = 'idle';
    setTimer({ status: 'idle', elapsed: 0 });
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1>timer</h1>

      <span>{timer.status}</span>
      <div>{formatTime(timer.elapsed)}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={timer.status === 'running'}
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          disabled={timer.status !== 'running'}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={timer.status === 'idle'}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
