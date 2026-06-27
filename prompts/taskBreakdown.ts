// ============================================================
// DEADLINE GUARDIAN AI — Task Breakdown Prompt
// ============================================================
import type { TaskBreakdownResult } from '@/types';

export function buildTaskBreakdownPrompt(taskTitle: string, deadline: string, context?: string): string {
  return `You are an expert project planner and AI Chief-of-Staff.

Break down the following task into actionable subtasks.

Task: "${taskTitle}"
Deadline: ${deadline}
${context ? `Context: ${context}` : ''}

Analyze complexity and generate a realistic breakdown.

Return ONLY this exact JSON structure:
{
  "subtasks": [
    {
      "title": "string (specific actionable step)",
      "estimatedMinutes": number,
      "priority": "high" | "medium" | "low"
    }
  ],
  "totalEstimatedHours": number,
  "suggestedDeadlineBuffer": number,
  "complexity": "simple" | "moderate" | "complex"
}

Requirements:
- Generate 3-8 subtasks depending on complexity
- Be specific and actionable (not vague like "do research")
- estimatedMinutes should be realistic (15-180 per subtask)
- totalEstimatedHours must sum all subtask minutes
- suggestedDeadlineBuffer is extra hours needed for review/polish
- complexity reflects overall task difficulty`;
}

export const taskBreakdownSchema = `{
  subtasks: Array<{ title: string, estimatedMinutes: number, priority: "high"|"medium"|"low" }>,
  totalEstimatedHours: number,
  suggestedDeadlineBuffer: number,
  complexity: "simple" | "moderate" | "complex"
}`;

export type { TaskBreakdownResult };
