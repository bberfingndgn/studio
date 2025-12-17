"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Companion } from '@/components/dashboard/Companion';
import { Flower } from '@/components/dashboard/Flower';
import { StudyTimer } from '@/components/dashboard/StudyTimer';
import { UpcomingAchievements } from '@/components/dashboard/UpcomingAchievements';
import { SECONDS_TO_GROW_FLOWER, USER_NAME } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { achievements } from '@/lib/data';
import { useFirebase, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, collection } from 'firebase/firestore';

type TimerStatus = 'running' | 'paused' | 'stopped';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(() => 
    user ? doc(firestore, 'users', user.uid) : null,
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{totalStudyTime: number}>(userProfileRef);

  const [timerStatus, setTimerStatus] = useState<TimerStatus>('stopped');
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const totalStudyTime = userProfile?.totalStudyTime ?? 0;
  const flowerProgress = (totalStudyTime % SECONDS_TO_GROW_FLOWER) / SECONDS_TO_GROW_FLOWER * 100;

  const handleSessionComplete = useCallback(async (sessionDuration: number, subject: string) => {
    if (!user || !userProfileRef || !firestore) return;

    const newTotalStudyTime = totalStudyTime + sessionDuration;
    
    const now = new Date();
    const startTime = new Date(now.getTime() - sessionDuration * 1000);

    const studySessionRef = collection(firestore, 'users', user.uid, 'studySessions');
    addDocumentNonBlocking(studySessionRef, {
      userId: user.uid,
      subjectId: subject, // Using subject name as ID for simplicity
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      duration: sessionDuration / 60, // duration in minutes
    });
    
    // This is a non-blocking update
    setDoc(userProfileRef, { totalStudyTime: newTotalStudyTime }, { merge: true });
    
    const oldFlowers = Math.floor(totalStudyTime / SECONDS_TO_GROW_FLOWER);
    const newFlowers = Math.floor(newTotalStudyTime / SECONDS_TO_GROW_FLOWER);

    if (newFlowers > oldFlowers) {
      toast({
        title: "New Flower Grown! 🌸",
        description: "You've completed a full growth cycle. Check your garden!",
      });
    }
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked && newTotalStudyTime >= (achievement.milestoneHours * 3600)) {
        achievement.unlocked = true; 
        toast({
          title: "Achievement Unlocked! 🏆",
          description: `You've earned the "${achievement.title}" badge!`,
        });
      }
    });

  }, [totalStudyTime, user, userProfileRef, toast, firestore]);

  const handleStatusChange = (status: TimerStatus) => {
    setTimerStatus(status);
  };
  
  if (isUserLoading || isProfileLoading) {
      // You can return a loading spinner here
      return (
          <div className="flex items-center justify-center flex-1">
              <p>Loading...</p>
          </div>
      )
  }
  
  if (!user) {
      return null; // or a message encouraging login
  }


  return (
    <div className="flex-1 container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
        
        {/* Left Column: Companion */}
        <div className="lg:col-span-1 xl:col-span-1 w-full order-2 lg:order-1">
          <Companion
            timerStatus={timerStatus}
            progressPercentage={flowerProgress}
            userName={user.displayName || USER_NAME}
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
          <UpcomingAchievements currentStudyTime={totalStudyTime} />
        </div>

      </div>
    </div>
  );
}
