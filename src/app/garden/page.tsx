'use client';

import { useMemo } from 'react';
import { GrownFlowerCard } from '@/components/garden/GrownFlowerCard';
import { placeholderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { grownFlowers } from '@/lib/data'; // Import static data
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@/firebase';


export default function GardenPage() {
  const { isUserLoading } = useUser();

  const flowerDataMap = useMemo(() => placeholderImages.reduce((acc, img) => {
    acc[img.id] = img;
    return acc;
  }, {} as Record<string, ImagePlaceholder>), []);
  
  if (isUserLoading) {
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
          if (!flowerData) {
            console.warn(`No flower data found for typeId: ${flower.flowerTypeId}`);
            return null;
          };
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
