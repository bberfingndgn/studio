import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type Achievement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { title, description, unlocked, Icon } = achievement;

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      unlocked ? 'border-primary/50 bg-card' : 'bg-muted/60'
    )}>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center",
          unlocked ? 'bg-primary/10' : 'bg-secondary'
        )}>
          <Icon className={cn(
            "w-12 h-12",
            unlocked ? 'text-primary' : 'text-muted-foreground'
          )} />
          {!unlocked && (
            <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full border">
                <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className={cn(
            "font-semibold font-headline text-lg",
            unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
