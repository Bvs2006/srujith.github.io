'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions about notes.
 *
 * - answerQuestionsAboutNotes - A function that handles the question answering process.
 * - AnswerQuestionsAboutNotesInput - The input type for the answerQuestionsAboutNotes function.
 * - AnswerQuestionsAboutNotesOutput - The return type for the answerQuestionsAboutNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutNotesInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  noteContent: z.string().describe('The content of the note.'),
});
export type AnswerQuestionsAboutNotesInput = z.infer<typeof AnswerQuestionsAboutNotesInputSchema>;

const AnswerQuestionsAboutNotesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsAboutNotesOutput = z.infer<typeof AnswerQuestionsAboutNotesOutputSchema>;

export async function answerQuestionsAboutNotes(
  input: AnswerQuestionsAboutNotesInput
): Promise<AnswerQuestionsAboutNotesOutput> {
  return answerQuestionsAboutNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutNotesPrompt',
  input: {schema: AnswerQuestionsAboutNotesInputSchema},
  output: {schema: AnswerQuestionsAboutNotesOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions about notes.

  Here is the content of the note:
  {{noteContent}}

  Now, answer the following question:
  {{question}}`,
});

const answerQuestionsAboutNotesFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutNotesFlow',
    inputSchema: AnswerQuestionsAboutNotesInputSchema,
    outputSchema: AnswerQuestionsAboutNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
