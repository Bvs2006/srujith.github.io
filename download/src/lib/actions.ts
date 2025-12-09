'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateSummary } from '@/ai/flows/summarize-notes';
import { provideNoteKeywords } from '@/ai/flows/provide-note-keywords';
import { answerQuestionsAboutNotes } from '@/ai/flows/answer-questions-about-notes';
import { addChatMessage, addNote, getNoteById, getUserById, updateUser } from './data';
import type { ChatMessage, Note, User } from './types';
import { asMediaPart } from 'genkit';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = ['application/pdf'];

// Schema for note upload form
const UploadNoteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  subject: z.string().min(2, 'Subject must be at least 2 characters.'),
  semester: z.string().min(3, 'Semester must be at least 3 characters.'),
  file: z
    .instanceof(File)
    .refine(file => file.size > 0, 'A file must be selected.')
    .refine(file => file.size <= FILE_SIZE_LIMIT, `File size must be less than 5MB.`)
    .refine(file => ALLOWED_FILE_TYPES.includes(file.type), 'Only PDF files are allowed.'),
});

export async function uploadNoteAction(userId: string, prevState: any, formData: FormData) {
  try {
    const user = await getUserById(userId);
    if (!user || user.role !== 'teacher') {
      return { message: 'Unauthorized access.' };
    }

    const validatedFields = UploadNoteSchema.safeParse({
      title: formData.get('title'),
      subject: formData.get('subject'),
      semester: formData.get('semester'),
      file: formData.get('file'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed. Please check your inputs.',
      };
    }
    
    const { title, subject, semester, file } = validatedFields.data;

    // For simplicity, we'll store a placeholder for the PDF content.
    // In a real app, you'd upload this to a storage service (e.g., Firebase Storage)
    // and store the URL.
    const fileContentPlaceholder = `PDF content for "${file.name}" uploaded. In a real app, this would be a viewable document.`;

    const newNote: Note = {
      id: `note_${Date.now()}`,
      title,
      subject,
      semester,
      content: fileContentPlaceholder,
      teacherId: user.id,
      teacherName: user.name,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };

    await addNote(newNote);
    
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred during note upload.' };
  }
  
  revalidatePath('/teacher/dashboard');
  redirect('/teacher/dashboard');
}


export async function sendChatMessageAction(noteId: string, userId: string, message: string): Promise<ChatMessage[]> {
    if (!message.trim()) return [];

    const user = await getUserById(userId);
    const note = await getNoteById(noteId);

    if (!user || !note) {
        throw new Error("User or Note not found");
    }

    const userMessage: ChatMessage = { id: `msg_${Date.now()}`, role: 'user', content: message };
    await addChatMessage(noteId, userMessage);

    const aiResponse = await answerQuestionsAboutNotes({
        question: message,
        noteContent: note.content,
    });

    const assistantMessage: ChatMessage = { id: `msg_${Date.now() + 1}`, role: 'assistant', content: aiResponse.answer };
    await addChatMessage(noteId, assistantMessage);
    
    revalidatePath(`/notes/${noteId}`);
    return [userMessage, assistantMessage];
}


const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  subject: z.string().optional(),
});


export async function updateTeacherProfileAction(userId: string, prevState: any, formData: FormData) {
    try {
        const user = await getUserById(userId);
        if (!user || user.role !== 'teacher') {
            return { message: 'Unauthorized access.' };
        }

        const validatedFields = UpdateProfileSchema.safeParse({
            name: formData.get('name'),
            subject: formData.get('subject'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Validation failed.',
            };
        }

        const { name, subject } = validatedFields.data;

        const updatedUser: User = {
            ...user,
            name,
            subject: subject || user.subject,
        };

        await updateUser(updatedUser);

    } catch (e) {
        return { message: 'Failed to update profile.' };
    }

    revalidatePath('/teacher/profile');
    revalidatePath('/teacher/dashboard');
    return { message: 'Profile updated successfully!' };
}
