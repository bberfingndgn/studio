
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { StudySession } from '@/lib/types';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AnalysisPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      // For this demonstration, we won't redirect, so we can see the mock data.
      // router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const studySessionsQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'studySessions') : null),
    [firestore, user]
  );
  
  const { data: studySessions, isLoading: isSessionsLoading } = useCollection<StudySession>(studySessionsQuery);

  const chartData = useMemo(() => {
    // If logged in and has data, use it. Otherwise, use mock data.
    if (user && studySessions && studySessions.length > 0) {
      const subjectDurations: { [key: string]: number } = {};
      studySessions.forEach(session => {
        const subjectName = session.subjectId || 'Uncategorized';
        if (!subjectDurations[subjectName]) {
          subjectDurations[subjectName] = 0;
        }
        subjectDurations[subjectName] += session.duration;
      });

      return Object.keys(subjectDurations).map(subject => ({
        subject,
        minutes: Math.round(subjectDurations[subject]),
      }));
    }
    
    // Return mock data for logged-out or initial state for demonstration
    return [
      { subject: 'Mathematics', minutes: 60 },
      { subject: 'English', minutes: 25 },
    ];
  }, [studySessions, user]);

  const isLoading = isUserLoading || (user && isSessionsLoading);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline text-primary">Analysis</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Here's a breakdown of your study time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Spent per Subject</CardTitle>
          <CardDescription>Total minutes studied for each subject.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="subject" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} min`} />
                    <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{fill: "hsl(var(--secondary))"}} 
                    />
                    <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>No study data yet. Complete a session to see your analysis!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
