import { useState } from 'react';
import './App.css';

type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  status: TimerStatus;
  elapsed: number;
}

const App = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    status: 'idle',
    elapsed: 0,
  });

  const handleStart = () => {
    setTimerState({ status: 'running', elapsed: 0 });
  };

  const handlePause = () => {
    setTimerState({ ...timerState, status: 'paused' });
  };

  const handleReset = () => {
    setTimerState({ status: 'idle', elapsed: 0 });
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1>timer</h1>

      <span>{timerState.status}</span>
      <div>{timerState.elapsed}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={timerState.status === 'running'}
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          disabled={timerState.status !== 'running'}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={timerState.status === 'idle'}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
