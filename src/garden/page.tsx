'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GrownFlowerCard } from '@/components/garden/GrownFlowerCard';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { placeholderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { GrownFlower, StudySession } from '@/lib/types';
import { SECONDS_TO_GROW_FLOWER } from '@/lib/constants';
import { LoaderCircle } from 'lucide-react';

const subjectToFlowerType: Record<string, string> = {
  "Mathematics": "sunflower",
  "Science": "rose",
  "Social Studies": "tulip",
  "English": "daisy",
};

export default function GardenPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const studySessionsRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'studySessions') : null),
    [firestore, user]
  );
  const { data: studySessions, isLoading: isSessionsLoading } = useCollection<StudySession>(studySessionsRef);

  const flowerDataMap = useMemo(() => placeholderImages.reduce((acc, img) => {
    acc[img.id] = img;
    return acc;
  }, {} as Record<string, ImagePlaceholder>), []);
  
  const grownFlowers: GrownFlower[] = useMemo(() => {
    if (!studySessions) return [];

    const subjectTimes: Record<string, number> = {};
    studySessions.forEach(session => {
        const subject = session.subjectId;
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


  if (isUserLoading || isSessionsLoading) {
    return <div className="flex-1 flex items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline text-primary">My Garden</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A collection of all the beautiful flowers you've grown with your focus.
        </p>
      </div>

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
       {grownFlowers.length === 0 && (
          <div className="col-span-full text-center py-16 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Your garden is waiting to bloom!</p>
            <p className="text-sm text-muted-foreground/80">Complete study sessions to grow your first flower.</p>
          </div>
        )}
    </div>
  );
}
