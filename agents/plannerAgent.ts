// ============================================================
// DEADLINE GUARDIAN AI — Planner Agent
// ============================================================
import { generateStructuredJSON } from '@/lib/gemini';
import { buildTaskBreakdownPrompt } from '@/prompts/taskBreakdown';
import type { Task, TaskBreakdownResult } from '@/types';

export class PlannerAgent {
  static async breakdownTask(
    task: Pick<Task, 'title' | 'deadline'>,
    context?: string
  ): Promise<TaskBreakdownResult> {
    const deadlineStr = task.deadline instanceof Date
      ? task.deadline.toISOString()
      : String(task.deadline);

    const prompt = buildTaskBreakdownPrompt(task.title, deadlineStr, context);

    try {
      return await generateStructuredJSON<TaskBreakdownResult>(prompt);
    } catch {
      // Fallback for demo mode
      return {
        subtasks: [
          { title: `Research and plan ${task.title}`, estimatedMinutes: 30, priority: 'high' },
          { title: `Execute core work for ${task.title}`, estimatedMinutes: 90, priority: 'high' },
          { title: `Review and refine ${task.title}`, estimatedMinutes: 30, priority: 'medium' },
          { title: `Final check and submit`, estimatedMinutes: 20, priority: 'high' },
        ],
        totalEstimatedHours: 2.83,
        suggestedDeadlineBuffer: 0.5,
        complexity: 'moderate',
      };
    }
  }

  static generateSubtaskIds(result: TaskBreakdownResult): TaskBreakdownResult & {
    subtasks: (TaskBreakdownResult['subtasks'][0] & { id: string; completed: boolean })[]
  } {
    return {
      ...result,
      subtasks: result.subtasks.map((st, i) => ({
        ...st,
        id: `st_${Date.now()}_${i}`,
        completed: false,
      })),
    };
  }
}
