import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/answer-questions-about-notes.ts';
import '@/ai/flows/provide-note-keywords.ts';