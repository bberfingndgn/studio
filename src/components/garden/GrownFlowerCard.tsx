import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { type GrownFlower } from '@/lib/types';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { Calendar } from 'lucide-react';

interface GrownFlowerCardProps {
  flower: GrownFlower;
  flowerData: ImagePlaceholder;
}

export function GrownFlowerCard({ flower, flowerData }: GrownFlowerCardProps) {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <Image
            src={flowerData.imageUrl}
            alt={flowerData.description}
            width={400}
            height={400}
            data-ai-hint={flowerData.imageHint}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 bg-card">
          <h3 className="font-semibold capitalize text-foreground">{flowerData.id.replace('-', ' ')}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Grown on {flower.grownAt.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
