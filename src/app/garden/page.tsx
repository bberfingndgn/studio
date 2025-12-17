import { GrownFlowerCard } from '@/components/garden/GrownFlowerCard';
import { grownFlowers } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

export default function GardenPage() {
  const flowerDataMap = placeholderImages.reduce((acc, img) => {
    acc[img.id] = img;
    return acc;
  }, {} as Record<string, ImagePlaceholder>);

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
