'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect based on role after login
      // The auth context will handle redirects
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'teacher') => {
    setError('');
    setLoading(true);

    try {
      if (role === 'student') {
        await login('a.johnson@student.edu', 'demo');
        router.push('/dashboard');
      } else {
        await login('e.reed@university.edu', 'demo');
        router.push('/teacher/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
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
          <CardContent className="space-y-6">
            {demoMode ? (
              <>
                <p className="text-center text-muted-foreground">
                  Select your role to continue.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleDemoLogin('teacher')}
                    disabled={loading}
                  >
                    I am a Teacher
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleDemoLogin('student')}
                    disabled={loading}
                  >
                    I am a Student
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDemoMode(false)}
                >
                  Login with Email & Password
                </Button>
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDemoMode(true);
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                  disabled={loading}
                >
                  Back to Demo Login
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {!demoMode && (
              <p className="text-center text-sm text-muted-foreground w-full">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Register here
                </Link>
              </p>
            )}
            <p className="text-xs text-muted-foreground text-center w-full">
              For demo purposes: use any registered email or try demo accounts.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
