// ============================================================
// DEADLINE GUARDIAN AI — Risk Agent
// ============================================================
import { generateStructuredJSON } from '@/lib/gemini';
import { buildRiskPredictionPrompt } from '@/prompts/riskPrediction';
import type { Task, RiskPredictionResult, RiskLevel } from '@/types';

export class RiskAgent {
  static async assessRisk(task: Task): Promise<RiskPredictionResult> {
    const input = {
      taskTitle: task.title,
      deadline: task.deadline instanceof Date ? task.deadline.toISOString() : String(task.deadline),
      estimatedHours: task.estimatedHours,
      completedHours: task.completedHours,
      currentTime: new Date().toISOString(),
    };

    const prompt = buildRiskPredictionPrompt(input);

    try {
      return await generateStructuredJSON<RiskPredictionResult>(prompt);
    } catch {
      // Fallback calculation
      const deadlineDate = new Date(task.deadline);
      const now = new Date();
      const hoursUntilDeadline = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      const hoursNeeded = task.estimatedHours - task.completedHours;
      const ratio = hoursUntilDeadline / Math.max(hoursNeeded, 0.1);
      const prob = Math.min(95, Math.max(5, ratio * 60));

      let riskLevel: RiskLevel = 'low';
      if (prob < 30) riskLevel = 'critical';
      else if (prob < 55) riskLevel = 'high';
      else if (prob < 75) riskLevel = 'medium';

      return {
        riskLevel,
        successProbability: Math.round(prob),
        factors: [
          { factor: 'Time Available', impact: ratio > 1.5 ? 'positive' : 'negative', weight: 9, description: `${hoursUntilDeadline.toFixed(1)} hours until deadline` },
          { factor: 'Work Remaining', impact: hoursNeeded < 4 ? 'positive' : 'negative', weight: 8, description: `${hoursNeeded.toFixed(1)} hours of work left` },
        ],
        recommendations: [
          ratio < 1.2 ? 'Start immediately — no time to spare' : 'Begin within the next 2 hours',
          'Break work into 90-minute focused sessions',
          'Eliminate all distractions during work blocks',
        ],
        urgencyScore: Math.round(100 - prob),
        estimatedCompletionTime: `${hoursNeeded.toFixed(1)} hours of focused work`,
      };
    }
  }

  static getRiskColor(level: RiskLevel): string {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
    }
  }

  static getRiskLabel(level: RiskLevel): string {
    switch (level) {
      case 'low': return 'ON TRACK';
      case 'medium': return 'WATCH OUT';
      case 'high': return 'AT RISK';
      case 'critical': return 'CRITICAL';
    }
  }
}
