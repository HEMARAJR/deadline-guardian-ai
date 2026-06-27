// ============================================================
// DEADLINE GUARDIAN AI — Risk Prediction Prompt
// ============================================================
import type { RiskPredictionResult } from '@/types';

export interface RiskInput {
  taskTitle: string;
  deadline: string;
  estimatedHours: number;
  completedHours: number;
  currentTime: string;
  workload?: string;
}

export function buildRiskPredictionPrompt(input: RiskInput): string {
  const hoursRemaining = input.estimatedHours - input.completedHours;
  const deadlineDate = new Date(input.deadline);
  const now = new Date(input.currentTime);
  const hoursUntilDeadline = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));

  return `You are the Risk Detection Agent of Deadline Guardian AI.

Analyze the deadline risk for this task:

Task: "${input.taskTitle}"
Deadline: ${input.deadline}
Hours until deadline: ${hoursUntilDeadline.toFixed(1)}
Estimated hours needed: ${input.estimatedHours}
Hours already completed: ${input.completedHours}
Hours still needed: ${hoursRemaining.toFixed(1)}
Current workload: ${input.workload || 'moderate'}

Calculate success probability and risk level.

Return ONLY this exact JSON:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "successProbability": number (0-100),
  "factors": [
    {
      "factor": "string",
      "impact": "positive" | "negative",
      "weight": number (1-10),
      "description": "string"
    }
  ],
  "recommendations": ["string"],
  "urgencyScore": number (0-100),
  "estimatedCompletionTime": "string (human readable)"
}

Rules:
- successProbability: ratio of available time vs needed time (adjusted for realistic pace)
- riskLevel: critical <30%, high 30-55%, medium 55-75%, low 75%+
- Include 3-5 risk factors
- Give 2-4 specific actionable recommendations
- urgencyScore reflects how immediately action is needed`;
}

export type { RiskPredictionResult };
