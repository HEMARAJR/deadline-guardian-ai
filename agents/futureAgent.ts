// ============================================================
// DEADLINE GUARDIAN AI — Future Simulation Agent
// ============================================================
import { generateStructuredJSON } from '@/lib/gemini';
import { buildFutureSimulationPrompt } from '@/prompts/futureSimulation';
import type { Task, FutureSimulationResult } from '@/types';

export class FutureAgent {
  static async simulate(task: Task, currentSuccessProbability: number): Promise<FutureSimulationResult> {
    const prompt = buildFutureSimulationPrompt(
      task.title,
      task.deadline instanceof Date ? task.deadline.toISOString() : String(task.deadline),
      currentSuccessProbability,
      task.estimatedHours
    );

    try {
      return await generateStructuredJSON<FutureSimulationResult>(prompt);
    } catch {
      // Fallback scenarios
      const base = currentSuccessProbability;
      return {
        scenarios: [
          {
            label: 'Start Now',
            description: 'Begin working immediately with full focus',
            successProbability: Math.min(95, base + 15),
            impact: { productivity: 80, stress: -20, career: 70, time: 60 },
            recommendation: 'Best option. Start now and maintain momentum.',
            color: '#10b981',
          },
          {
            label: 'Delay 12 Hours',
            description: 'Start work tomorrow morning',
            successProbability: Math.max(10, base - 20),
            impact: { productivity: 20, stress: 40, career: -20, time: -30 },
            recommendation: 'Risky. You lose your best working hours.',
            color: '#f59e0b',
          },
          {
            label: 'Delay 24 Hours',
            description: 'Push to the day after',
            successProbability: Math.max(5, base - 40),
            impact: { productivity: -30, stress: 70, career: -50, time: -60 },
            recommendation: 'Very risky. Emergency mode likely required.',
            color: '#ef4444',
          },
          {
            label: 'Delay 48 Hours',
            description: 'Leave it for much later',
            successProbability: Math.max(2, base - 60),
            impact: { productivity: -70, stress: 90, career: -80, time: -90 },
            recommendation: 'Failure is almost certain. Do not delay.',
            color: '#dc2626',
          },
        ],
        bestCourseOfAction: 'Start working on this task immediately with zero interruptions.',
        criticalPath: [
          'Begin within the next 30 minutes',
          'Work in 90-minute deep focus blocks',
          'Complete highest-priority subtasks first',
          'Review and submit before deadline',
        ],
      };
    }
  }
}
