// ============================================================
// DEADLINE GUARDIAN AI — Future Simulation API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { FutureAgent } from '@/agents/futureAgent';
import type { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { task, currentSuccessProbability } = await req.json() as {
      task: Task;
      currentSuccessProbability: number;
    };

    if (!task) {
      return NextResponse.json({ error: 'No task provided' }, { status: 400 });
    }

    const simulation = await FutureAgent.simulate(task, currentSuccessProbability ?? 70);
    return NextResponse.json({ success: true, data: simulation });
  } catch (error) {
    console.error('Future API error:', error);
    return NextResponse.json(
      { error: 'Simulation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
