// ============================================================
// DEADLINE GUARDIAN AI — Risk Prediction API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { RiskAgent } from '@/agents/riskAgent';
import type { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json() as { task: Task };

    if (!task) {
      return NextResponse.json({ error: 'No task provided' }, { status: 400 });
    }

    const assessment = await RiskAgent.assessRisk(task);
    return NextResponse.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Risk API error:', error);
    return NextResponse.json(
      { error: 'Risk assessment failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
