"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { STUDY_SESSION_DURATION_MINUTES } from '@/lib/constants';

type TimerStatus = 'running' | 'paused' | 'stopped';

interface StudyTimerProps {
  onSessionComplete: (durationInSeconds: number) => void;
  onStatusChange: (status: TimerStatus) => void;
}

export function StudyTimer({ onSessionComplete, onStatusChange }: StudyTimerProps) {
  const sessionDurationSeconds = useMemo(() => STUDY_SESSION_DURATION_MINUTES * 60, []);
  const [secondsLeft, setSecondsLeft] = useState(sessionDurationSeconds);
  const [status, setStatus] = useState<TimerStatus>('stopped');

  useEffect(() => {
    onStatusChange(status);
    let interval: NodeJS.Timeout | null = null;
    
    if (status === 'running' && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (status === 'running' && secondsLeft === 0) {
      onSessionComplete(sessionDurationSeconds);
      setStatus('stopped');
      setSecondsLeft(sessionDurationSeconds);
      // Optionally play a sound here
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, secondsLeft, onStatusChange, onSessionComplete, sessionDurationSeconds]);

  const handleStartPause = () => {
    if (status === 'running') {
      setStatus('paused');
    } else {
      setStatus('running');
    }
  };

  const handleReset = () => {
    setStatus('stopped');
    setSecondsLeft(sessionDurationSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = (secondsLeft / sessionDurationSeconds) * 100;
  const strokeDasharray = 2 * Math.PI * 90; // Circumference of the circle
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  return (
    <Card className="w-full max-w-md shadow-lg border-2 border-primary/20">
      <CardContent className="flex flex-col items-center justify-center p-6 sm:p-10 gap-6">
        <div className="relative w-52 h-52 sm:w-64 sm:h-64">
          <svg className="absolute inset-0" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="transparent"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              style={{
                strokeDasharray: strokeDasharray,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold font-headline text-foreground tabular-nums">
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={handleReset} variant="outline" size="lg" className="rounded-full w-24">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
          <Button onClick={handleStartPause} size="lg" className="rounded-full w-36 text-lg font-bold">
            {status === 'running' ? (
              <>
                <Pause className="h-6 w-6 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-6 w-6 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
