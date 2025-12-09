'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import type { Note } from '@/lib/types';
import { getNotes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, PlusCircle, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherNotes() {
      if (user) {
        setLoading(true);
        const allNotes = await getNotes();
        const teacherNotes = allNotes.filter(note => note.teacherId === user.id);
        setNotes(teacherNotes);
        setLoading(false);
      }
    }
    fetchTeacherNotes();
  }, [user]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Manage your uploaded course notes.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/upload"><PlusCircle className="mr-2 h-4 w-4" /> Upload Note</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : notes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map(note => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.title}</TableCell>
                  <TableCell><Badge variant="outline">{note.subject}</Badge></TableCell>
                  <TableCell>{note.semester}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1"><Eye className="h-4 w-4 text-muted-foreground" /> {note.viewCount}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1"><Download className="h-4 w-4 text-muted-foreground" /> {note.downloadCount}</div>
                  </TableCell>
                  <TableCell>{format(parseISO(note.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-xl font-semibold">No Notes Uploaded Yet</h2>
            <p className="text-muted-foreground mt-2 mb-6">Start by uploading your first course note.</p>
            <Button asChild>
              <Link href="/teacher/upload"><PlusCircle className="mr-2 h-4 w-4" /> Upload Note</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
