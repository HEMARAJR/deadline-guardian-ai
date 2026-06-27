// ============================================================
// DEADLINE GUARDIAN AI — Chat API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredJSON, generateText } from '@/lib/gemini';
import { buildVoiceCommandPrompt } from '@/prompts/voiceCommand';
import type { VoiceCommandResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { transcript, mode = 'voice' } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const currentTime = new Date().toISOString();

    if (mode === 'voice') {
      const prompt = buildVoiceCommandPrompt(transcript, currentTime);
      const result = await generateStructuredJSON<VoiceCommandResult>(prompt);
      return NextResponse.json({ success: true, data: result });
    } else {
      // General chat mode
      const prompt = `You are Deadline Guardian AI — an expert AI Chief-of-Staff who helps users manage deadlines and predict risks.

User message: "${transcript}"

Respond helpfully and concisely (2-4 sentences max). Focus on productivity, deadlines, and actionable advice.
Be smart, encouraging, and direct.`;

      const response = await generateText(prompt);
      return NextResponse.json({ success: true, data: { response } });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'AI processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
