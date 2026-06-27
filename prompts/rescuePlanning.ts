// ============================================================
// DEADLINE GUARDIAN AI — Rescue Planning Prompt
// ============================================================
import type { RescuePlanResult } from '@/types';

export function buildRescuePlanningPrompt(
  taskTitle: string,
  deadline: string,
  hoursRemaining: number,
  subtasks: string[],
  currentTime: string
): string {
  return `You are the Deadline Rescue Agent of Deadline Guardian AI.

A task is at HIGH RISK. Generate an emergency rescue plan.

Task: "${taskTitle}"
Deadline: ${deadline}
Hours remaining until deadline: ${hoursRemaining}
Current time: ${currentTime}
Subtasks to complete: ${subtasks.join(', ') || 'Break down the main task'}

Create a concrete hour-by-hour rescue schedule starting NOW.

Return ONLY this exact JSON:
{
  "emergencyMode": boolean,
  "rescueScore": number (0-100, likelihood of success with this plan),
  "schedule": [
    {
      "time": "string (e.g., '7:00 PM - 8:00 PM')",
      "activity": "string (specific task)",
      "duration": number (minutes),
      "priority": "critical" | "high" | "medium"
    }
  ],
  "motivationalMessage": "string (energizing, coach-like)",
  "keyMilestones": ["string"]
}

Requirements:
- Schedule must fit within the hours remaining
- Start immediately (from current time)
- Include short breaks (5-10 min) every 90 min
- Be very specific about what to do in each block
- emergencyMode = true if <40% success probability
- rescueScore should be realistic based on available time`;
}

export type { RescuePlanResult };
