'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-context';
import { uploadNoteAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, UploadCloud, FileText } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Processing PDF...
        </>
      ) : (
        <>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload and Generate
        </>
      )}
    </Button>
  );
}

export default function UploadPage() {
  const { user } = useAuth();
  const initialState = { message: null, errors: {} };
  
  const uploadNoteActionWithUserId = uploadNoteAction.bind(null, user?.id || '');
  const [state, dispatch] = useActionState(uploadNoteActionWithUserId, initialState);
  
  if (!user) return null; // Or a loading/error state

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload New Note</CardTitle>
          <CardDescription>
            Fill in the details below and upload your course note as a PDF. The content will be used to automatically generate a summary and keywords using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Note Title</Label>
                <Input id="title" name="title" placeholder="e.g., Introduction to Quantum Physics" required />
                {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g., Physics" required />
                {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject[0]}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" name="semester" placeholder="e.g., Fall 2024" required />
                {state.errors?.semester && <p className="text-sm text-destructive">{state.errors.semester[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Note PDF</Label>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground"/>
                <Input id="file" name="file" type="file" accept="application/pdf" required />
              </div>
              <p className="text-xs text-muted-foreground">Upload the note in PDF format. The AI will analyze it to create a summary and keywords.</p>
              {state.errors?.file && <p className="text-sm text-destructive">{state.errors.file[0]}</p>}
            </div>

            {state.message && !state.errors && <p className="text-sm text-destructive">{state.message}</p>}
            {state.message && state.errors && <p className="text-sm text-destructive">{state.message}</p>}


            <div className="flex gap-4">
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/teacher/dashboard">Cancel</Link>
                </Button>
                <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
