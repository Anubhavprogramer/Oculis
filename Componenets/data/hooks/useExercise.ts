import { useState, useCallback } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Exercise, ExerciseSession } from '../models/Exercise';

/**
 * Custom hook for exercise related functionality
 */
const useExercise = (exerciseId?: string) => {
  const { 
    exercises, 
    getExerciseById, 
    startExerciseSession, 
    completeExerciseSession,
    recordExercise
  } = useAppData();
  
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(
    exerciseId ? getExerciseById(exerciseId) : null
  );
  const [currentSession, setCurrentSession] = useState<ExerciseSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [currentStep, setCurrentStep] = useState(0);

  /**
   * Load an exercise by ID
   */
  const loadExercise = useCallback((id: string) => {
    const exercise = getExerciseById(id);
    setCurrentExercise(exercise);
    
    // Reset state
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
    setProgress(0);
    setCurrentStep(0);
    
    return exercise;
  }, [getExerciseById]);

  /**
   * Start an exercise
   */
  const startExercise = useCallback(async (id: string = exerciseId || '') => {
    if (!id) return null;
    
    setIsLoading(true);
    try {
      // Load exercise if not already loaded
      if (!currentExercise || currentExercise.id !== id) {
        const exercise = loadExercise(id);
        if (!exercise) throw new Error('Exercise not found');
      }
      
      // Get total duration in seconds
      let duration = 60; // Default 1 minute
      if (currentExercise?.duration) {
        const match = currentExercise.duration.match(/(\d+)/);
        if (match && match[1]) {
          duration = parseInt(match[1], 10) * 60; // Convert minutes to seconds
        }
      }
      
      // Start session
      const session = await startExerciseSession(id);
      setCurrentSession(session);
      setTimeRemaining(duration);
      setIsActive(true);
      setProgress(0);
      setCurrentStep(0);
      
      return session;
    } catch (error) {
      console.error('Error starting exercise:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentExercise, exerciseId, loadExercise, startExerciseSession]);

  /**
   * Pause the current exercise
   */
  const pauseExercise = useCallback(() => {
    setIsActive(false);
  }, []);

  /**
   * Resume the current exercise
   */
  const resumeExercise = useCallback(() => {
    setIsActive(true);
  }, []);

  /**
   * Stop and complete the current exercise
   */
  const completeExercise = useCallback(async (completed: boolean = true) => {
    setIsActive(false);
    
    if (!currentSession) return null;
    
    setIsLoading(true);
    try {
      // Complete session
      const session = await completeExerciseSession(currentSession.id);
      
      if (session) {
        // Record exercise for analytics
        await recordExercise(
          session.exerciseId, 
          session.duration,
          completed
        );
      }
      
      // Reset state
      setCurrentSession(null);
      setTimeRemaining(0);
      setProgress(1); // Set to completed
      
      return session;
    } catch (error) {
      console.error('Error completing exercise:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, completeExerciseSession, recordExercise]);

  /**
   * Update the remaining time
   */
  const updateTimeRemaining = useCallback((seconds: number) => {
    setTimeRemaining(seconds);
    
    // Calculate progress if we know total duration
    if (currentExercise?.duration) {
      const match = currentExercise.duration.match(/(\d+)/);
      if (match && match[1]) {
        const totalDuration = parseInt(match[1], 10) * 60; // Convert minutes to seconds
        const newProgress = 1 - (seconds / totalDuration);
        setProgress(Math.min(Math.max(0, newProgress), 1)); // Clamp between 0-1
      }
    }
  }, [currentExercise]);

  /**
   * Go to next step in a multi-step exercise
   */
  const nextStep = useCallback(() => {
    if (!currentExercise?.steps || currentStep >= currentExercise.steps.length - 1) {
      return false;
    }
    
    setCurrentStep(prev => prev + 1);
    return true;
  }, [currentExercise, currentStep]);

  /**
   * Go to previous step in a multi-step exercise
   */
  const prevStep = useCallback(() => {
    if (currentStep <= 0) {
      return false;
    }
    
    setCurrentStep(prev => prev - 1);
    return true;
  }, [currentStep]);

  /**
   * Get the current step data
   */
  const getCurrentStepData = useCallback(() => {
    if (!currentExercise?.steps || currentStep >= currentExercise.steps.length) {
      return null;
    }
    
    return currentExercise.steps[currentStep];
  }, [currentExercise, currentStep]);

  /**
   * Format time in MM:SS format
   */
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }, []);

  return {
    // State
    exercises,
    currentExercise,
    currentSession,
    isLoading,
    isActive,
    timeRemaining,
    progress,
    currentStep,
    
    // Actions
    loadExercise,
    startExercise,
    pauseExercise,
    resumeExercise,
    completeExercise,
    updateTimeRemaining,
    nextStep,
    prevStep,
    
    // Helpers
    getCurrentStepData,
    formatTime,
  };
};

export default useExercise; 