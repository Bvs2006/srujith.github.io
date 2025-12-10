'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Logo } from '@/components/logo';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subject: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!studentData.name.trim()) {
        throw new Error('Please enter your name');
      }
      if (!studentData.email.trim()) {
        throw new Error('Please enter your email');
      }
      if (!validateEmail(studentData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (studentData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (studentData.password !== studentData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Register student
      register({
        id: `user_${Date.now()}`,
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        role: 'student',
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!teacherData.name.trim()) {
        throw new Error('Please enter your name');
      }
      if (!teacherData.email.trim()) {
        throw new Error('Please enter your email');
      }
      if (!validateEmail(teacherData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (!teacherData.subject.trim()) {
        throw new Error('Please enter your subject');
      }
      if (teacherData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (teacherData.password !== teacherData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Register teacher
      register({
        id: `user_${Date.now()}`,
        name: teacherData.name,
        email: teacherData.email,
        password: teacherData.password,
        role: 'teacher',
        subject: teacherData.subject,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      });

      router.push('/teacher/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-6 inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Create Account</CardTitle>
            <CardDescription className="text-lg">Join Course Companion as a student or teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userRole} onValueChange={(val) => {
              setUserRole(val as 'student' | 'teacher');
              setError('');
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>

              {/* Student Registration */}
              <TabsContent value="student">
                <form onSubmit={handleStudentRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input
                      id="student-name"
                      placeholder="Enter your full name"
                      value={studentData.name}
                      onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="Enter your email"
                      value={studentData.email}
                      onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input
                      id="student-password"
                      type="password"
                      placeholder="Create a password"
                      value={studentData.password}
                      onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-confirm-password">Confirm Password</Label>
                    <Input
                      id="student-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={studentData.confirmPassword}
                      onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading} size="lg">
                    {loading ? 'Creating Account...' : 'Create Student Account'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>

              {/* Teacher Registration */}
              <TabsContent value="teacher">
                <form onSubmit={handleTeacherRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-name">Full Name</Label>
                    <Input
                      id="teacher-name"
                      placeholder="Enter your full name"
                      value={teacherData.name}
                      onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="Enter your email"
                      value={teacherData.email}
                      onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-subject">Subject</Label>
                    <Input
                      id="teacher-subject"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      value={teacherData.subject}
                      onChange={(e) => setTeacherData({ ...teacherData, subject: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input
                      id="teacher-password"
                      type="password"
                      placeholder="Create a password"
                      value={teacherData.password}
                      onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-confirm-password">Confirm Password</Label>
                    <Input
                      id="teacher-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={teacherData.confirmPassword}
                      onChange={(e) => setTeacherData({ ...teacherData, confirmPassword: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading} size="lg">
                    {loading ? 'Creating Account...' : 'Create Teacher Account'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
