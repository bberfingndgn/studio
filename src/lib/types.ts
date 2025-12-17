import type { LucideIcon } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  milestoneHours: number;
  unlocked: boolean;
  Icon: LucideIcon;
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
