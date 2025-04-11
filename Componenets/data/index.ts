/**
 * Models
 */
export { type Difficulty, type Exercise, type ExerciseType, type ExerciseStep, type ExerciseSession } from './models/Exercise';
export { type User, type UserSettings, type UserStats, type Achievement, type DailyGoal } from './models/User';
export { 
  type ProgressData, 
  type ExerciseEntry, 
  type ScreenTimeEntry, 
  type BlinkRateEntry, 
  type WeeklyActivityData,
  type MonthlyProgressData 
} from './models/ProgressData';

/**
 * Services
 */
export { StorageService, STORAGE_KEYS } from './services/StorageService';
export { default as ExerciseService } from './services/ExerciseService';
export { default as UserService } from './services/UserService';
export { default as AnalyticsService } from './services/AnalyticsService';

/**
 * Context
 */
export { 
  default as AppDataContext, 
  AppDataProvider, 
  useAppData 
} from './context/AppDataContext';

/**
 * Hooks
 */
export { default as useExercise } from './hooks/useExercise';
export { default as useAnalytics } from './hooks/useAnalytics'; 