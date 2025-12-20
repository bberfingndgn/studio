
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: username });
      
      const userDocRef = doc(firestore, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        id: firebaseUser.uid,
        username: username,
        email: firebaseUser.email,
        createdAt: new Date().toISOString(),
        totalStudyTime: 0,
        companionClicks: 0,
      });

      router.push('/');

    } catch (err: any) {
      // More user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  if (isUserLoading || user) {
    return <div className="flex-1 flex items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create an account to start your focus journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your Name"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline font-medium text-primary">
                    Login
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
