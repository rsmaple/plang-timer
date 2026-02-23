import { useState } from 'react';
import './App.css';
import { useInterval } from './hooks/useIterval';
import { formatTime, now, TICK_INTERVAL_MS } from './time';

type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  status: TimerStatus;
  elapsed: number;
  startTime: number;
  accumulated: number;
}

const App = () => {
  const [timer, setTimer] = useState<TimerState>({
    status: 'idle',
    elapsed: 0,
    startTime: 0,
    accumulated: 0,
  });

  useInterval(
    () => {
      const elapsed = timer.accumulated + (now() - timer.startTime);
      setTimer((prev) => ({ ...prev, elapsed }));
    },
    timer.status === 'running' ? TICK_INTERVAL_MS : false,
  );

  const handleStart = () => {
    setTimer((prev) => ({
      ...prev,
      status: 'running',
      startTime: now(),
      accumulated: prev.status === 'paused' ? prev.accumulated : 0,
      elapsed: prev.status === 'paused' ? prev.elapsed : 0,
    }));
  };

  const handlePause = () => {
    setTimer((prev) => ({
      ...prev,
      status: 'paused',
      accumulated: prev.accumulated + (now() - prev.startTime),
    }));
  };

  const handleReset = () => {
    setTimer({ status: 'idle', elapsed: 0, startTime: 0, accumulated: 0 });
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
