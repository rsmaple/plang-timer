import { now, TICK_INTERVAL_MS } from './time';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSnapshot {
  status: TimerStatus;
  elapsed: number;
}

const INITIAL_SNAPSHOT: TimerSnapshot = { status: 'idle', elapsed: 0 };

export class TimerStore {
  private status: TimerStatus = 'idle';
  private accumulated = 0;
  private startTime = 0;
  private goalNotified = false;
  private goalSeconds: number | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<() => void>();
  private snapshot: TimerSnapshot = INITIAL_SNAPSHOT;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    // 구독 listener 추가 될 떄 running 상태면 타이머 다시 시작
    // if (this.status === 'running') {
    //   this.startTick();
    // }

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopTick();
      }
    };
  };

  getSnapshot = (): TimerSnapshot => this.snapshot;

  setGoalSeconds = (goal: number | null) => {
    this.goalSeconds = goal;
  };

  start = () => {
    if (this.status === 'running') return;
    this.startTime = now();
    this.status = 'running';
    this.startTick();
    this.emit();
  };

  pause = () => {
    if (this.status !== 'running') return;
    this.accumulated += now() - this.startTime;
    this.status = 'paused';
    this.stopTick();
    this.emit();
  };

  reset = () => {
    this.accumulated = 0;
    this.startTime = 0;
    this.goalNotified = false;
    this.status = 'idle';
    this.stopTick();
    this.emit();
  };

  private tick = () => {
    const elapsed = this.accumulated + (now() - this.startTime);

    if (
      this.goalSeconds !== null &&
      !this.goalNotified &&
      elapsed >= this.goalSeconds * 1000
    ) {
      this.goalNotified = true;
      this.accumulated = this.goalSeconds * 1000;
      this.status = 'paused';
      this.stopTick();
      this.emit();
      alert(`>>>${this.goalSeconds}<<<`);
      return;
    }

    this.snapshot = { status: this.status, elapsed };
    this.notify();
  };

  private emit() {
    const elapsed =
      this.status === 'running'
        ? this.accumulated + (now() - this.startTime)
        : this.accumulated;
    this.snapshot = { status: this.status, elapsed };
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private startTick() {
    if (this.intervalId !== null) return;
    this.intervalId = setInterval(this.tick, TICK_INTERVAL_MS);
  }

  private stopTick() {
    if (this.intervalId === null) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
