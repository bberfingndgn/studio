import type { LucideIcon } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  milestoneHours: number;
  unlocked: boolean;
  Icon: LucideIcon;
  hidden?: boolean; // For secret achievements
  reward?: {
    type: 'flower' | 'decoration' | 'costume';
    item: string;
  }
}

export interface GrownFlower {
  id: string;
  flowerTypeId: string;
  grownAt: Date;
  subject: string;
}

export interface StudySession {
    id: string;
    userId: string;
    subjectId: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    totalStudyTime: number;
    companionClicks: number;
}
