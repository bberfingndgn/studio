
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, User, Mail, Calendar, Clock } from 'lucide-react';
import { doc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => 
    user ? doc(firestore, 'users', user.uid) : null,
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    displayName: string;
    email: string;
    createdAt: string;
    totalStudyTime: number;
  }>(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading || !userProfile) {
    return <div className="flex-1 flex items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  const formatStudyTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
  }
  
  const memberSince = new Date(userProfile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/adventurer/svg?seed=${user.uid}`} alt={userProfile.displayName} />
              <AvatarFallback>{userProfile.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold">{userProfile.displayName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
             <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">{userProfile.email}</span>
            </div>
             <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Member since {memberSince}</span>
            </div>
            <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Total study time: <strong>{formatStudyTime(userProfile.totalStudyTime)}</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

