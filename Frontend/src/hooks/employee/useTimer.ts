// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime: number = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const start = useCallback((startTime?: number) => {
    if (startTime) setTime(startTime);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((resetTime?: number) => {
    setTime(resetTime || initialTime);
    setIsActive(false);
  }, [initialTime]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    isActive,
    start,
    stop,
    reset,
    formatTime: () => formatTime(time)
  };
};