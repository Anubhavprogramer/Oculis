// Data model for tracking user progress and analytics
export interface ProgressData {
  id: string;
  userId: string;
  date: Date;
  healthScore: number;
  dailyExercises: ExerciseEntry[];
  screenTime: ScreenTimeEntry[];
  blinkRate: BlinkRateEntry[];
  weeklyActivity: WeeklyActivityData;
}

export interface ExerciseEntry {
  exerciseId: string;
  duration: number; // in seconds
  completed: boolean;
  timeOfDay: Date;
}

export interface ScreenTimeEntry {
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  category?: 'work' | 'entertainment' | 'social' | 'other';
}

export interface BlinkRateEntry {
  timeRecorded: Date;
  rate: number; // blinks per minute
  duration: number; // measurement period in seconds
}

export interface WeeklyActivityData {
  startDate: Date; // First day of the week
  endDate: Date; // Last day of the week
  totalExerciseTime: number; // in minutes
  averageHealthScore: number;
  dailyData: {
    date: Date;
    exerciseTime: number; // in minutes
    healthScore: number;
    exercisesCompleted: number;
  }[];
}

export interface MonthlyProgressData {
  month: number; // 0-11
  year: number;
  averageHealthScore: number;
  totalExerciseTime: number; // in minutes
  longestStreak: number;
  mostPerformedExercise: string;
  weeklyData: WeeklyActivityData[];
} 