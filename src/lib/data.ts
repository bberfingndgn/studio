import { type Achievement, type GrownFlower } from '@/lib/types';
import { Timer, Zap, Sun, Award, Mountain } from 'lucide-react';
import { placeholderImages } from './placeholder-images';

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Bloom',
    description: 'Complete your first study session.',
    milestoneHours: 25 / 60,
    unlocked: true,
    Icon: Timer,
  },
  {
    id: '2',
    title: 'Study Sprout',
    description: 'Accumulate 1 hour of focused study time.',
    milestoneHours: 1,
    unlocked: true,
    Icon: Zap,
  },
  {
    id: '3',
    title: 'Dedicated Gardener',
    description: 'Accumulate 5 hours of focused study time.',
    milestoneHours: 5,
    unlocked: false,
    Icon: Sun,
  },
  {
    id: '4',
    title: 'Focus Master',
    description: 'Accumulate 10 hours of focused study time.',
    milestoneHours: 10,
    unlocked: false,
    Icon: Award,
  },
  {
    id: '5',
    title: 'Bloom Expert',
    description: 'Grow your first complete flower.',
    milestoneHours: 4, 
    unlocked: true,
    Icon: Mountain,
  },
];

export const grownFlowers: GrownFlower[] = [
  {
    id: 'flower-1',
    flowerTypeId: placeholderImages[0].id,
    grownAt: new Date('2024-05-20T10:00:00Z'),
  },
  {
    id: 'flower-2',
    flowerTypeId: placeholderImages[1].id,
    grownAt: new Date('2024-05-22T14:30:00Z'),
  },
  {
    id: 'flower-3',
    flowerTypeId: placeholderImages[2].id,
    grownAt: new Date('2024-05-25T09:00:00Z'),
  },
];
