import { useState } from 'react';
import './App.css';
import { useTimer } from './hooks/useTimer';
import { formatTime } from './time';

const App = () => {
  const [goalInput, setGoalInput] = useState('');
  const goalSeconds = goalInput !== '' ? Number(goalInput) : null;

  const { status, elapsed, start, pause, reset } = useTimer(goalSeconds);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1>timer</h1>

      <div className="flex items-center gap-2">
        <label htmlFor="goal-input">목표 시간(초)</label>
        <input
          id="goal-input"
          type="number"
          min="1"
          placeholder="초 단위로 목표를 설정하세요"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
        />
      </div>

      <span>{status}</span>
      <div>{formatTime(elapsed)}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={start}
          disabled={status === 'running'}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          type="button"
          onClick={pause}
          disabled={status !== 'running'}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={status === 'idle'}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
