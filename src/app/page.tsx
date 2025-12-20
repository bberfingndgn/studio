
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Companion } from '@/components/dashboard/Companion';
import { Flower } from '@/components/dashboard/Flower';
import { StudyTimer } from '@/components/dashboard/StudyTimer';
import { UpcomingAchievements } from '@/components/dashboard/UpcomingAchievements';
import { SECONDS_TO_GROW_FLOWER, USER_NAME } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { achievements } from '@/lib/data';
import { useFirebase, useUser, useDoc, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { GrownFlowerCard } from '@/components/garden/GrownFlowerCard';
import type { GrownFlower, StudySession } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type TimerStatus = 'running' | 'paused' | 'stopped';

const subjectToFlowerType: Record<string, string> = {
  "Mathematics": "rose",
  "Science": "sunflower",
  "Social Studies": "tulip",
  "English": "daisy",
};


export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(() => 
    user ? doc(firestore, 'users', user.uid) : null,
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{totalStudyTime: number}>(userProfileRef);

  const studySessionsRef = useMemoFirebase(() =>
    user ? collection(firestore, 'users', user.uid, 'studySessions') : null, [firestore, user]
  );
  
  const { data: studySessions, isLoading: isSessionsLoading } = useCollection<StudySession>(studySessionsRef);

  const [timerStatus, setTimerStatus] = useState<TimerStatus>('stopped');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const { toast } = useToast();
  
  const [sessionProgress, setSessionProgress] = useState(0);

  const flowerDataMap = useMemo(() => placeholderImages.reduce((acc, img) => {
    acc[img.id] = img;
    return acc;
  }, {} as Record<string, ImagePlaceholder>), []);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const totalStudyTime = userProfile?.totalStudyTime ?? 0;
  
  const grownFlowers: GrownFlower[] = useMemo(() => {
    if (!studySessions) return [];

    const subjectTimes: Record<string, number> = {};
    studySessions.forEach(session => {
        const subject = session.subjectId; // subjectId is the name for now
        if (!subjectTimes[subject]) {
            subjectTimes[subject] = 0;
        }
        subjectTimes[subject] += session.duration * 60; // convert minutes to seconds
    });

    const flowers: GrownFlower[] = [];
    Object.keys(subjectTimes).forEach(subject => {
        const totalTime = subjectTimes[subject];
        const flowersGrown = Math.floor(totalTime / SECONDS_TO_GROW_FLOWER);
        const flowerTypeId = subjectToFlowerType[subject] || 'rose';

        for(let i=0; i<flowersGrown; i++) {
            flowers.push({
                id: `${subject}-${i}`,
                subject: subject,
                flowerTypeId: flowerTypeId,
                grownAt: new Date(), // This could be made more precise if needed
            });
        }
    });

    return flowers;

  }, [studySessions]);

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

    setSessionProgress(0); // Reset progress on complete

  }, [totalStudyTime, user, userProfileRef, toast, firestore]);

  const handleStatusChange = (status: TimerStatus) => {
    setTimerStatus(status);
     if (status === 'stopped' || status === 'paused') {
      setSessionProgress(0); // Reset progress if stopped or paused
    }
  };
  
  const handleProgressChange = (progress: number) => {
    setSessionProgress(progress);
  };

  if (isUserLoading || isProfileLoading || isSessionsLoading) {
      return (
          <div className="flex items-center justify-center flex-1">
              <p>Loading...</p>
          </div>
      )
  }
  
  if (!user) {
      return null;
  }

  const flowerProgress = status === 'running' || status === 'paused' 
    ? sessionProgress 
    : (totalStudyTime % SECONDS_TO_GROW_FLOWER) / SECONDS_TO_GROW_FLOWER * 100;

  return (
    <div className="flex-1 container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
        
        <div className="lg:col-span-1 xl:col-span-1 w-full order-2 lg:order-1">
          <Companion
            timerStatus={timerStatus}
            progressPercentage={flowerProgress}
            userName={user.displayName || USER_NAME}
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center gap-8 order-1 lg:order-2">
          <Flower progress={flowerProgress} subject={selectedSubject} />
          <StudyTimer 
            onSessionComplete={handleSessionComplete}
            onStatusChange={handleStatusChange}
            onProgressChange={handleProgressChange}
            subject={selectedSubject}
            onSubjectChange={setSelectedSubject}
          />
        </div>
        
        <div className="lg:col-span-1 xl:col-span-1 w-full order-3 lg:order-3">
          <UpcomingAchievements currentStudyTime={totalStudyTime} />
        </div>

      </div>

       <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-headline text-primary">My Garden</h2>
            <p className="text-muted-foreground mt-2">A collection of flowers you've grown.</p>
          </div>
           {grownFlowers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {grownFlowers.map((flower) => {
                const flowerData = flowerDataMap[flower.flowerTypeId];
                if (!flowerData) return null;
                return (
                  <GrownFlowerCard 
                    key={flower.id} 
                    flower={flower} 
                    flowerData={flowerData}
                  />
                );
              })}
            </div>
           ) : (
             <div className="col-span-full text-center py-16 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Your garden is waiting to bloom!</p>
                <p className="text-sm text-muted-foreground/80">Complete study sessions to grow your first flower.</p>
             </div>
           )}
       </div>

    </div>
  );
}
