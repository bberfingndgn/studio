

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { type GrownFlower } from '@/lib/types';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { Calendar, Book } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface GrownFlowerCardProps {
  flower: GrownFlower;
  flowerData: ImagePlaceholder;
}

const subjectColors: Record<string, string> = {
  "Mathematics": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
  "Science": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
  "Social Studies": "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700",
  "English": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700",
}

export function GrownFlowerCard({ flower, flowerData }: GrownFlowerCardProps) {
  const formattedDate = flower.grownAt.toLocaleDateString();

  return (
    <Link href={`/subjects/${encodeURIComponent(flower.subject)}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="aspect-square overflow-hidden">
            <Image
              src={flowerData.imageUrl}
              alt={flowerData.description || flower.subject}
              width={400}
              height={400}
              data-ai-hint={flowerData.imageHint}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4 bg-card space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <Badge variant="outline" className={cn("font-medium", subjectColors[flower.subject] || 'border-gray-300')}>
                  <Book className="w-3.5 h-3.5 mr-1.5" />
                  {flower.subject}
              </Badge>
              <h3 className="font-semibold capitalize text-foreground mt-3">{flower.subject}</h3>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Grown on {formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
