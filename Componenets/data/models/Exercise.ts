// Data model for exercises
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  color: string;
  type: ExerciseType;
  steps?: ExerciseStep[];
  benefitsForEyes: string[];
  completionCount: number;
  lastCompleted?: Date;
}

export type ExerciseType = 
  | 'quick' 
  | 'relaxation' 
  | 'strength' 
  | 'eyeRolling' 
  | 'eyeMovement'
  | 'focusing'
  | 'figureEight'
  | 'blinkPractice'
  | 'eyeYoga'
  | 'pencilPushups'
  | 'darkAdaptation';

export interface ExerciseStep {
  id: number;
  instruction: string;
  duration: number; // in seconds
  imageUrl?: string;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  completed: boolean;
  steps?: {
    stepId: number;
    completed: boolean;
    actualDuration: number; // in seconds
  }[];
} 