import { NextRequest, NextResponse } from 'next/server';
import { PlannerAgent } from '@/agents/plannerAgent';
import type { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json() as { task: Pick<Task, 'title' | 'deadline'> };
    if (!task) return NextResponse.json({ error: 'No task provided' }, { status: 400 });
    const result = await PlannerAgent.breakdownTask(task);
    const withIds = PlannerAgent.generateSubtaskIds(result);
    return NextResponse.json({ success: true, data: withIds });
  } catch (error) {
    return NextResponse.json({ error: 'Task breakdown failed' }, { status: 500 });
  }
}
