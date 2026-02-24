import { useState } from 'react';
import './App.css';
import { useRafTimer } from './hooks/useRafTimer';
import { useTimer } from './hooks/useTimer';
import { formatTime } from './time';

function IntervalTimer({
  goalSeconds,
}: { goalSeconds: number | null }) {
  const { status, elapsed, start, pause, reset } = useTimer(goalSeconds);
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>setInterval (1s tick)</h2>
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
}

function RafTimer({ goalSeconds }: { goalSeconds: number | null }) {
  const { status, elapsed, start, pause, reset } = useRafTimer(goalSeconds);
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>rAF (~60fps)</h2>
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
}

const App = () => {
  const [goalInput, setGoalInput] = useState('');
  const goalSeconds = goalInput !== '' ? Number(goalInput) : null;

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

      <div className="flex gap-8">
        <IntervalTimer goalSeconds={goalSeconds} />
        <RafTimer goalSeconds={goalSeconds} />
      </div>
    </div>
  );
};

export default App;
