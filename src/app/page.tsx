"use client";

import { useState, useEffect, useCallback } from 'react';
import { Companion } from '@/components/dashboard/Companion';
import { Flower } from '@/components/dashboard/Flower';
import { StudyTimer } from '@/components/dashboard/StudyTimer';
import { UpcomingAchievements } from '@/components/dashboard/UpcomingAchievements';
import { SECONDS_TO_GROW_FLOWER, USER_NAME } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { achievements } from '@/lib/data';

type TimerStatus = 'running' | 'paused' | 'stopped';

export default function Home() {
  // Using a single state object to manage related states
  const [studyState, setStudyState] = useState({
    totalStudyTime: 14000, // Start with some progress
    timerStatus: 'stopped' as TimerStatus,
  });

  const { toast } = useToast();

  const flowerProgress = (studyState.totalStudyTime % SECONDS_TO_GROW_FLOWER) / SECONDS_TO_GROW_FLOWER * 100;

  const handleSessionComplete = useCallback((sessionDuration: number) => {
    const newTotalStudyTime = studyState.totalStudyTime + sessionDuration;
    
    // Check for flower completion
    const oldFlowers = Math.floor(studyState.totalStudyTime / SECONDS_TO_GROW_FLOWER);
    const newFlowers = Math.floor(newTotalStudyTime / SECONDS_TO_GROW_FLOWER);

    if (newFlowers > oldFlowers) {
      toast({
        title: "New Flower Grown! 🌸",
        description: "You've completed a full growth cycle. Check your garden!",
      });
    }
    
    // Check for achievement unlocks
    achievements.forEach(achievement => {
      if (!achievement.unlocked && newTotalStudyTime >= (achievement.milestoneHours * 3600)) {
        achievement.unlocked = true; // This would be a DB update in a real app
        toast({
          title: "Achievement Unlocked! 🏆",
          description: `You've earned the "${achievement.title}" badge!`,
        });
      }
    });

    setStudyState(prevState => ({ ...prevState, totalStudyTime: newTotalStudyTime }));
  }, [studyState.totalStudyTime, toast]);

  const handleStatusChange = (status: TimerStatus) => {
    setStudyState(prevState => ({ ...prevState, timerStatus: status }));
  };

  return (
    <div className="flex-1 container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
        
        {/* Left Column: Companion */}
        <div className="lg:col-span-1 xl:col-span-1 w-full order-2 lg:order-1">
          <Companion
            timerStatus={studyState.timerStatus}
            progressPercentage={flowerProgress}
            userName={USER_NAME}
          />
        </div>

        {/* Center Column: Flower & Timer */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center gap-8 order-1 lg:order-2">
          <Flower progress={flowerProgress} />
          <StudyTimer 
            onSessionComplete={handleSessionComplete}
            onStatusChange={handleStatusChange}
          />
        </div>
        
        {/* Right Column: Achievements */}
        <div className="lg:col-span-1 xl:col-span-1 w-full order-3 lg:order-3">
          <UpcomingAchievements currentStudyTime={studyState.totalStudyTime} />
        </div>

      </div>
    </div>
  );
}
