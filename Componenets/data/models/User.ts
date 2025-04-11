// Data model for user data
export interface User {
  id: string;
  name: string;
  email?: string;
  profileImageUrl?: string;
  createdAt: Date;
  lastLogin: Date;
  settings: UserSettings;
  stats: UserStats;
  achievements: Achievement[];
  dailyGoals: DailyGoal;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  remindersEnabled: boolean;
  reminderTimes: string[]; // HH:mm format
  preferedExerciseType: string[];
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  language: string;
}

export interface UserStats {
  healthScore: number; // 0-100
  daysActive: number;
  totalExerciseTime: number; // in minutes
  streak: number;
  blinkRate: number; // per minute
  screenTime: number; // daily average in minutes
  exercisesCompleted: number;
  lastUpdateDate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  dateUnlocked?: Date;
  isUnlocked: boolean;
  requirement: {
    type: 'streak' | 'exerciseCount' | 'screenTime' | 'totalTime';
    value: number;
  };
}

export interface DailyGoal {
  exercises: number; // number of exercises to complete daily
  screenTimeLimit: number; // in minutes
  exerciseTime: number; // in minutes
  currentProgress: {
    exercisesCompleted: number;
    screenTime: number;
    exerciseTime: number;
  };
  lastUpdated: Date;
} 