'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Note } from '@/lib/types';
import { getNoteById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Chat } from '@/components/chat';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, Book, Download, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function NotePage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      if (noteId) {
        setLoading(true);
        const fetchedNote = await getNoteById(noteId);
        setNote(fetchedNote || null);
        setLoading(false);
      }
    }
    fetchNote();
  }, [noteId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Skeleton className="aspect-video w-full" />
            </div>
            <div className="lg:col-span-2">
                <Skeleton className="h-[70vh] w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return <div className="text-center py-20">Note not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{note.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2"><User className="h-4 w-4"/>{note.teacherName}</div>
                <div className="flex items-center gap-2"><Book className="h-4 w-4"/>{note.subject} - {note.semester}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/>{format(parseISO(note.createdAt), 'MMMM d, yyyy')}</div>
                <div className="flex items-center gap-2"><Download className="h-4 w-4"/>{note.downloadCount} downloads</div>
                <div className="flex items-center gap-2"><Eye className="h-4 w-4"/>{note.viewCount} views</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {note.keywords.map(keyword => (
                    <Badge key={keyword} variant="outline">{keyword}</Badge>
                ))}
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <div className="aspect-[4/5] w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
                <div className="text-center p-8">
                    <h3 className="text-lg font-semibold">PDF Viewer Placeholder</h3>
                    <p className="text-muted-foreground mt-2">In a real application, the PDF content for '{note.title}' would be displayed here.</p>
                </div>
            </div>
        </div>
        <div className="lg:col-span-2">
            <Chat noteId={note.id} />
        </div>
      </div>
    </div>
  );
}
