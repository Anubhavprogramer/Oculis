// Import polyfill for crypto.getRandomValues()
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Exercise, ExerciseSession, ExerciseType } from '../models/Exercise';
import { StorageService, STORAGE_KEYS } from './StorageService';

/**
 * Service for managing exercises
 */
class ExerciseService {
  private storageService: StorageService;
  private exercises: Exercise[] = [];
  private exerciseSessions: ExerciseSession[] = [];

  constructor(storageService?: StorageService) {
    this.storageService = storageService || new StorageService();
    this.loadData();
  }

  /**
   * Load exercises and sessions from storage
   */
  private async loadData(): Promise<void> {
    try {
      const exercises = await this.storageService.loadData<Exercise[]>(STORAGE_KEYS.EXERCISES);
      if (exercises) {
        this.exercises = exercises;
      } else {
        // Initialize with default exercises if none exist
        this.exercises = this.getDefaultExercises();
        await this.saveExercises();
      }

      const sessions = await this.storageService.loadData<ExerciseSession[]>(
        STORAGE_KEYS.EXERCISE_SESSIONS
      );
      if (sessions) {
        this.exerciseSessions = sessions;
      }
    } catch (error) {
      console.error('Error loading exercise data:', error);
      this.exercises = this.getDefaultExercises();
    }
  }

  /**
   * Save exercises to storage
   */
  private async saveExercises(): Promise<void> {
    await this.storageService.saveData(STORAGE_KEYS.EXERCISES, this.exercises);
  }

  /**
   * Save exercise sessions to storage
   */
  private async saveExerciseSessions(): Promise<void> {
    await this.storageService.saveData(STORAGE_KEYS.EXERCISE_SESSIONS, this.exerciseSessions);
  }

  /**
   * Get all exercises
   * @returns Array of exercises
   */
  getExercises(): Exercise[] {
    return this.exercises;
  }

  /**
   * Get a specific exercise by ID
   * @param id Exercise ID
   * @returns The exercise or null if not found
   */
  getExerciseById(id: string): Exercise | null {
    return this.exercises.find((exercise) => exercise.id === id) || null;
  }

  /**
   * Get a specific exercise by type
   * @param type Exercise type
   * @returns The exercise or null if not found
   */
  getExerciseByType(type: ExerciseType): Exercise | null {
    return this.exercises.find((exercise) => exercise.type === type) || null;
  }

  /**
   * Add a new exercise
   * @param exercise Exercise to add
   * @returns The added exercise
   */
  async addExercise(exercise: Omit<Exercise, 'id' | 'completionCount'>): Promise<Exercise> {
    const newExercise: Exercise = {
      ...exercise,
      id: uuidv4(),
      completionCount: 0,
    };

    this.exercises.push(newExercise);
    await this.saveExercises();
    return newExercise;
  }

  /**
   * Update an existing exercise
   * @param id Exercise ID
   * @param updates Updates to apply
   * @returns The updated exercise
   */
  async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise | null> {
    const index = this.exercises.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.exercises[index] = { ...this.exercises[index], ...updates };
    await this.saveExercises();
    return this.exercises[index];
  }

  /**
   * Delete an exercise
   * @param id Exercise ID
   * @returns Success indicator
   */
  async deleteExercise(id: string): Promise<boolean> {
    const initialLength = this.exercises.length;
    this.exercises = this.exercises.filter((e) => e.id !== id);
    
    if (this.exercises.length !== initialLength) {
      await this.saveExercises();
      return true;
    }
    return false;
  }

  /**
   * Start a new exercise session
   * @param exerciseId Exercise ID
   * @returns The new session
   */
  async startExerciseSession(exerciseId: string): Promise<ExerciseSession> {
    const session: ExerciseSession = {
      id: uuidv4(),
      exerciseId,
      startTime: new Date(),
      duration: 0,
      completed: false,
    };

    this.exerciseSessions.push(session);
    await this.saveExerciseSessions();
    return session;
  }

  /**
   * Complete an exercise session
   * @param sessionId Session ID
   * @returns The updated session
   */
  async completeExerciseSession(sessionId: string): Promise<ExerciseSession | null> {
    const index = this.exerciseSessions.findIndex((s) => s.id === sessionId);
    if (index === -1) return null;

    const session = this.exerciseSessions[index];
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

    const updatedSession: ExerciseSession = {
      ...session,
      endTime,
      duration,
      completed: true,
    };

    this.exerciseSessions[index] = updatedSession;
    await this.saveExerciseSessions();

    // Update exercise completion count
    const exercise = this.getExerciseById(session.exerciseId);
    if (exercise) {
      await this.updateExercise(exercise.id, {
        completionCount: exercise.completionCount + 1,
        lastCompleted: new Date(),
      });
    }

    return updatedSession;
  }

  /**
   * Get exercise sessions for a specific exercise
   * @param exerciseId Exercise ID
   * @returns Array of sessions
   */
  getSessionsByExerciseId(exerciseId: string): ExerciseSession[] {
    return this.exerciseSessions.filter((s) => s.exerciseId === exerciseId);
  }

  /**
   * Get recent exercise sessions
   * @param limit Maximum number of sessions to return
   * @returns Array of sessions
   */
  getRecentSessions(limit: number = 10): ExerciseSession[] {
    return [...this.exerciseSessions]
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get most completed exercises
   * @param limit Maximum number of exercises to return
   * @returns Array of exercises
   */
  getMostCompletedExercises(limit: number = 5): Exercise[] {
    return [...this.exercises]
      .sort((a, b) => b.completionCount - a.completionCount)
      .slice(0, limit);
  }

  /**
   * Get default exercises
   * @returns Array of default exercises
   */
  private getDefaultExercises(): Exercise[] {
    return [
      {
        id: uuidv4(),
        title: 'Quick',
        description: 'A quick exercise routine for busy days',
        duration: '1 min',
        difficulty: 'Easy',
        color: '#E8ECC5',
        type: 'quick',
        steps: [
          { id: 1, instruction: 'Focus on a distant object for 20 seconds', duration: 20 },
          { id: 2, instruction: 'Blink rapidly for 5 seconds', duration: 5 },
          { id: 3, instruction: 'Roll your eyes clockwise 5 times', duration: 10 },
          { id: 4, instruction: 'Roll your eyes counterclockwise 5 times', duration: 10 },
          { id: 5, instruction: 'Look up and down 5 times', duration: 10 },
          { id: 6, instruction: 'Look left and right 5 times', duration: 10 },
        ],
        benefitsForEyes: ['Reduces eye strain', 'Improves focus', 'Quick relief'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Eye Rolling',
        description: 'Roll your eyes in circular motions to exercise eye muscles',
        duration: '1 min',
        difficulty: 'Easy',
        color: '#E8ECC5',
        type: 'eyeRolling',
        benefitsForEyes: ['Strengthens eye muscles', 'Improves blood circulation', 'Relieves strain'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Focusing',
        description: 'Shift focus between near and far objects to exercise eye focusing muscles',
        duration: '1 min',
        difficulty: 'Easy',
        color: '#E8ECC5',
        type: 'focusing',
        benefitsForEyes: ['Improves focusing ability', 'Reduces eye fatigue', 'Helps with eye coordination'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Blink Practice',
        description: 'Practice conscious blinking to keep your eyes lubricated',
        duration: '1 min',
        difficulty: 'Easy',
        color: '#E8ECC5',
        type: 'blinkPractice',
        benefitsForEyes: ['Prevents dry eyes', 'Improves tear production', 'Reduces eye strain'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Eye Yoga',
        description: 'Comprehensive yoga routine for your eyes',
        duration: '3 min',
        difficulty: 'Hard',
        color: '#E8ECC5',
        type: 'eyeYoga',
        benefitsForEyes: ['Complete eye relaxation', 'Strengthens all eye muscles', 'Improves vision clarity'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Relaxation',
        description: 'Gentle exercises to relax your eyes',
        duration: '2 min',
        difficulty: 'Medium',
        color: '#E8ECC5',
        type: 'relaxation',
        benefitsForEyes: ['Reduces eye tension', 'Relieves stress', 'Refreshes tired eyes'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Strength',
        description: 'Strengthen your eye muscles with these exercises',
        duration: '3 min',
        difficulty: 'Medium',
        color: '#E8ECC5',
        type: 'strength',
        benefitsForEyes: ['Builds eye muscle strength', 'Improves focus control', 'Enhances eye movement'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Eye Movement',
        description: 'Practice controlled eye movements in different directions',
        duration: '2 min',
        difficulty: 'Medium',
        color: '#E8ECC5',
        type: 'eyeMovement',
        benefitsForEyes: ['Improves eye coordination', 'Enhances eye tracking', 'Strengthens directional muscles'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Figure Eight',
        description: 'Trace a figure eight pattern with your eyes',
        duration: '2 min',
        difficulty: 'Medium',
        color: '#E8ECC5',
        type: 'figureEight',
        benefitsForEyes: ['Improves eye movement control', 'Enhances coordination', 'Strengthens muscles'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Pencil Pushups',
        description: 'Focus exercises using a pencil to train convergence',
        duration: '2 min',
        difficulty: 'Medium',
        color: '#E8ECC5',
        type: 'pencilPushups',
        benefitsForEyes: ['Improves convergence', 'Helps with focus', 'Strengthens eye teaming'],
        completionCount: 0,
      },
      {
        id: uuidv4(),
        title: 'Dark Adaptation',
        description: 'Help your eyes adjust between light and dark environments',
        duration: '1 min',
        difficulty: 'Easy',
        color: '#E8ECC5',
        type: 'darkAdaptation',
        benefitsForEyes: ['Improves light sensitivity', 'Reduces eye fatigue', 'Enhances night vision'],
        completionCount: 0,
      },
    ];
  }
}

export default ExerciseService; 