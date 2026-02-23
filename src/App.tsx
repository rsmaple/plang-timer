import './App.css';
import { useTimer } from './hooks/useTimer';
import { formatTime } from './time';

const App = () => {
  const { status, elapsed, start, pause, reset } = useTimer();

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1>timer</h1>

      <span>{status}</span>
      <div>{formatTime(elapsed)}</div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={start} disabled={status === 'running'}>
          Start
        </button>
        <button type="button" onClick={pause} disabled={status !== 'running'}>
          Pause
        </button>
        <button type="button" onClick={reset} disabled={status === 'idle'}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
