'use server';

/**
 * @fileOverview A flow to automatically generate keywords for uploaded notes using AI.
 *
 * - provideNoteKeywords - A function that generates keywords for a given note.
 * - ProvideNoteKeywordsInput - The input type for the provideNoteKeywords function.
 * - ProvideNoteKeywordsOutput - The return type for the provideNoteKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z, type MediaPart} from 'genkit';

const ProvideNoteKeywordsInputSchema = z.object({
  noteFile: z.custom<MediaPart>()
    .describe('The course note file for which keywords need to be generated.'),
});
export type ProvideNoteKeywordsInput = z.infer<typeof ProvideNoteKeywordsInputSchema>;

const ProvideNoteKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('An array of keywords generated for the note content.'),
});
export type ProvideNoteKeywordsOutput = z.infer<typeof ProvideNoteKeywordsOutputSchema>;

export async function provideNoteKeywords(input: ProvideNoteKeywordsInput): Promise<ProvideNoteKeywordsOutput> {
  return provideNoteKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideNoteKeywordsPrompt',
  input: {schema: ProvideNoteKeywordsInputSchema},
  output: {schema: ProvideNoteKeywordsOutputSchema},
  prompt: `You are an expert in identifying keywords from text content.
  Given the content of the attached course note document, generate a list of 3-5 keywords that accurately represent the note's topic and key concepts.
  Return the keywords as an array of strings.

  Note Document:
  {{media url=noteFile}}`,
});

const provideNoteKeywordsFlow = ai.defineFlow(
  {
    name: 'provideNoteKeywordsFlow',
    inputSchema: ProvideNoteKeywordsInputSchema,
    outputSchema: ProvideNoteKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
