export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl: string;
  subject?: string; // For teachers
};

export type Note = {
  id: string;
  title: string;
  subject: string;
  semester: string;
  teacherId: string;
  teacherName: string;
  content: string; // The actual content of the note for AI processing
  summary?: string;
  keywords?: string[];
  downloadCount: number;
  viewCount: number;
  createdAt: string; // ISO date string
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
