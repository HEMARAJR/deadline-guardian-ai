// ============================================================
// DEADLINE GUARDIAN AI — Gemini Integration
// ============================================================
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getGeminiModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
}

export async function generateStructuredJSON<T>(
  prompt: string,
  schema?: string
): Promise<T> {
  const model = getGeminiModel();

  const systemInstructions = `You are the Deadline Guardian AI — an expert AI Chief-of-Staff that predicts deadline risks and generates rescue plans.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no explanations outside the JSON.
${schema ? `\nExpected schema:\n${schema}` : ''}`;

  const fullPrompt = `${systemInstructions}\n\n${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text().trim();

    // Strip any markdown code blocks if model adds them
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateText(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Demo mode for when API key is not set
export function isDemoMode(): boolean {
  return !apiKey;
}
