// ============================================================
// DEADLINE GUARDIAN AI — Rescue Plan API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { RescueAgent } from '@/agents/rescueAgent';
import type { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json() as { task: Task };

    if (!task) {
      return NextResponse.json({ error: 'No task provided' }, { status: 400 });
    }

    const rescuePlan = await RescueAgent.generateRescuePlan(task);
    return NextResponse.json({ success: true, data: rescuePlan });
  } catch (error) {
    console.error('Rescue API error:', error);
    return NextResponse.json(
      { error: 'Rescue plan generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
