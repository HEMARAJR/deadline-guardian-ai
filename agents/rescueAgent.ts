// ============================================================
// DEADLINE GUARDIAN AI — Rescue Agent
// ============================================================
import { generateStructuredJSON } from '@/lib/gemini';
import { buildRescuePlanningPrompt } from '@/prompts/rescuePlanning';
import type { Task, RescuePlanResult } from '@/types';

export class RescueAgent {
  static async generateRescuePlan(task: Task): Promise<RescuePlanResult> {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const hoursRemaining = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    const subtasks = task.subtasks.filter(s => !s.completed).map(s => s.title);

    const prompt = buildRescuePlanningPrompt(
      task.title,
      task.deadline instanceof Date ? task.deadline.toISOString() : String(task.deadline),
      hoursRemaining,
      subtasks,
      now.toISOString()
    );

    try {
      return await generateStructuredJSON<RescuePlanResult>(prompt);
    } catch {
      // Fallback rescue plan
      const now = new Date();
      const blocks = [];
      let currentHour = now.getHours();
      const tasksToSchedule = subtasks.length > 0
        ? subtasks
        : [`Work on ${task.title}`, 'Review progress', 'Final polish', 'Submit'];

      for (let i = 0; i < Math.min(tasksToSchedule.length, Math.floor(hoursRemaining)); i++) {
        const startHour = currentHour + i;
        const endHour = startHour + 1;
        blocks.push({
          time: `${startHour}:00 - ${endHour}:00`,
          activity: tasksToSchedule[i] || `Focus session ${i + 1}`,
          duration: 60,
          priority: i === 0 ? 'critical' as const : 'high' as const,
        });
      }

      return {
        emergencyMode: task.successProbability < 40,
        rescueScore: Math.min(80, task.successProbability + 25),
        schedule: blocks,
        motivationalMessage: `You've got this. ${hoursRemaining.toFixed(1)} hours is enough if you start RIGHT NOW. Every minute counts. Lock in, eliminate distractions, and go.`,
        keyMilestones: [
          'Begin first work session immediately',
          'Complete 50% of work within first half of available time',
          'Final review 30 minutes before deadline',
        ],
      };
    }
  }
}
