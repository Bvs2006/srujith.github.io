'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { MOCK_USERS } from '@/lib/data';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (role: 'student' | 'teacher') => {
    const userToLogin = MOCK_USERS.find((user) => user.role === role);
    if (userToLogin) {
      login(userToLogin);
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Course Companion</CardTitle>
            <CardDescription className="text-lg">Your AI-powered learning assistant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Select your role to continue.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleLogin('teacher')}
              >
                I am a Teacher
                <ArrowRight />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={() => handleLogin('student')}
              >
                I am a Student
                <ArrowRight />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              This is a demo application. No real authentication is used.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
