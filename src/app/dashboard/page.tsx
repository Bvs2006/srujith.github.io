'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteCard } from '@/components/note-card';
import { getNotes } from '@/lib/data';
import type { Note } from '@/lib/types';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('all');
  const [semester, setSemester] = useState('all');

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      setLoading(false);
    }
    fetchNotes();
  }, []);

  const uniqueSubjects = useMemo(() => ['all', ...Array.from(new Set(notes.map(n => n.subject)))], [notes]);
  const uniqueSemesters = useMemo(() => ['all', ...Array.from(new Set(notes.map(n => n.semester)))], [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        note.title.toLowerCase().includes(searchTermLower) ||
        note.summary.toLowerCase().includes(searchTermLower) ||
        note.teacherName.toLowerCase().includes(searchTermLower) ||
        note.keywords.some(k => k.toLowerCase().includes(searchTermLower));
      
      const matchesSubject = subject === 'all' || note.subject === subject;
      const matchesSemester = semester === 'all' || note.semester === semester;

      return matchesSearch && matchesSubject && matchesSemester;
    });
  }, [notes, searchTerm, subject, semester]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Find and explore notes from all your courses.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search notes, subjects, teachers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            {uniqueSubjects.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by semester" />
          </SelectTrigger>
          <SelectContent>
            {uniqueSemesters.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Semesters' : s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <h2 className="text-xl font-semibold">No Notes Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
