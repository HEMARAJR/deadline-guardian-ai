// ============================================================
// DEADLINE GUARDIAN AI — Future Simulation Prompt
// ============================================================
import type { FutureSimulationResult } from '@/types';

export function buildFutureSimulationPrompt(
  taskTitle: string,
  deadline: string,
  currentSuccessProbability: number,
  estimatedHours: number
): string {
  return `You are the Future Simulation Engine of Deadline Guardian AI.

Simulate multiple scenarios for completing this task:

Task: "${taskTitle}"
Deadline: ${deadline}
Current success probability: ${currentSuccessProbability}%
Estimated hours needed: ${estimatedHours}

Generate 4 scenarios: start immediately, delay 12h, delay 24h, delay 48h.

Return ONLY this exact JSON:
{
  "scenarios": [
    {
      "label": "string (e.g., 'Start Now')",
      "description": "string",
      "successProbability": number (0-100),
      "impact": {
        "productivity": number (-100 to 100),
        "stress": number (-100 to 100),
        "career": number (-100 to 100),
        "time": number (-100 to 100)
      },
      "recommendation": "string",
      "color": "string (hex color: #10b981 for good, #f59e0b for medium, #ef4444 for bad)"
    }
  ],
  "bestCourseOfAction": "string",
  "criticalPath": ["string"]
}

Make probabilities realistic and decreasing as delay increases.
Impact scores: positive = benefit, negative = harm.`;
}

export type { FutureSimulationResult };
