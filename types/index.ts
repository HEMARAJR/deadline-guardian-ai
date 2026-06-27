// ============================================================
// DEADLINE GUARDIAN AI — Core Types
// ============================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  xp: number;
  level: number;
  streak: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  deadline: Date | string;
  estimatedHours: number;
  completedHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'rescued';
  riskLevel: RiskLevel;
  successProbability: number;
  subtasks: SubTask[];
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  rescuePlanId?: string;
  voiceCreated?: boolean;
  category: 'work' | 'study' | 'personal' | 'health' | 'finance' | 'other';
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface RescuePlan {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  createdAt: Date | string;
  schedule: ScheduleBlock[];
  emergencyMode: boolean;
  rescueScore: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface ScheduleBlock {
  time: string;
  activity: string;
  duration: number;
  priority: 'critical' | 'high' | 'medium';
}

export interface FutureSimulation {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  scenarios: SimulationScenario[];
  createdAt: Date | string;
}

export interface SimulationScenario {
  label: string;
  description: string;
  successProbability: number;
  impact: {
    productivity: number;
    stress: number;
    career: number;
    time: number;
  };
  recommendation: string;
  color: string;
}

export interface VoiceLog {
  id: string;
  userId: string;
  transcript: string;
  intent: string;
  extractedTask?: Partial<Task>;
  response: string;
  timestamp: Date | string;
}

export interface Analytics {
  userId: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  rescuedTasks: number;
  avgSuccessProbability: number;
  streakDays: number;
  xpEarned: number;
  weeklyData: WeeklyDataPoint[];
}

export interface WeeklyDataPoint {
  day: string;
  tasks: number;
  completed: number;
  risk: number;
}

export interface RiskAssessment {
  riskLevel: RiskLevel;
  successProbability: number;
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  factor: string;
  impact: 'positive' | 'negative';
  weight: number;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TaskBreakdownResult {
  subtasks: {
    title: string;
    estimatedMinutes: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  totalEstimatedHours: number;
  suggestedDeadlineBuffer: number;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface RiskPredictionResult {
  riskLevel: RiskLevel;
  successProbability: number;
  factors: RiskFactor[];
  recommendations: string[];
  urgencyScore: number;
  estimatedCompletionTime: string;
}

export interface FutureSimulationResult {
  scenarios: SimulationScenario[];
  bestCourseOfAction: string;
  criticalPath: string[];
}

export interface RescuePlanResult {
  emergencyMode: boolean;
  rescueScore: number;
  schedule: ScheduleBlock[];
  motivationalMessage: string;
  keyMilestones: string[];
}

export interface VoiceCommandResult {
  intent: 'create_task' | 'check_risk' | 'get_rescue' | 'simulate_future' | 'general_query' | 'unknown';
  extractedTask?: {
    title: string;
    deadline: string;
    estimatedHours: number;
    category: Task['category'];
    description?: string;
  };
  response: string;
  followUpAction?: string;
}
