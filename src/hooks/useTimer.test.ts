import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('초기 상태는 idle이고 elapsed는 0이다', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.status).toBe('idle');
    expect(result.current.elapsed).toBe(0);
  });

  it('start를 호출하면 running 상태가 된다', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.status).toBe('running');
  });

  it('running 상태에서 시간이 경과하면 elapsed가 증가한다', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.elapsed).toBeGreaterThanOrEqual(3000);
  });

  it('pause를 호출하면 paused 상태가 되고 elapsed가 유지된다', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe('paused');
    const elapsedAtPause = result.current.elapsed;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.elapsed).toBe(elapsedAtPause);
  });

  it('pause 후 start하면 elapsed가 이어서 누적된다', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.pause();
    });

    const elapsedAtPause = result.current.elapsed;

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.elapsed).toBeGreaterThanOrEqual(
      elapsedAtPause + 1000,
    );
  });

  it('reset을 호출하면 idle 상태로 돌아가고 elapsed가 0이 된다', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.elapsed).toBe(0);
  });

  describe('goal', () => {
    it('목표 시간에 도달하면 paused 상태로 멈춘다', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});

      const { result } = renderHook(() => useTimer(3));

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(result.current.status).toBe('paused');
      expect(result.current.elapsed).toBe(3000);
    });

    it('목표 시간 도달 시 alert를 호출한다', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      const { result } = renderHook(() => useTimer(2));

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(alertSpy).toHaveBeenCalledOnce();
    });

    it('goal이 null이면 목표 없이 계속 진행된다', () => {
      const { result } = renderHook(() => useTimer(null));

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.status).toBe('running');
      expect(result.current.elapsed).toBeGreaterThanOrEqual(10000);
    });

    it('reset 후 goal 알림이 다시 동작한다', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      const { result } = renderHook(() => useTimer(2));

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(alertSpy).toHaveBeenCalledOnce();

      act(() => {
        result.current.reset();
      });

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(alertSpy).toHaveBeenCalledTimes(2);
    });
  });
});
