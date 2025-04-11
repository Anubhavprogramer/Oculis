import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { User } from '../models/User';
import { Exercise, ExerciseSession } from '../models/Exercise';
import { ProgressData, WeeklyActivityData } from '../models/ProgressData';

import UserService from '../services/UserService';
import ExerciseService from '../services/ExerciseService';
import AnalyticsService from '../services/AnalyticsService';
import { StorageService } from '../services/StorageService';

interface AppDataContextType {
  // User
  user: User | null;
  isLoading: boolean;
  error: string | null;
  createUser: (name: string, email?: string) => Promise<User>;
  updateUserSettings: (settings: any) => Promise<void>;
  
  // Exercises
  exercises: Exercise[];
  getExerciseById: (id: string) => Exercise | null;
  startExerciseSession: (exerciseId: string) => Promise<ExerciseSession>;
  completeExerciseSession: (sessionId: string) => Promise<ExerciseSession | null>;
  
  // Progress & Analytics
  weeklyActivity: WeeklyActivityData | null;
  healthScore: number;
  recordExercise: (exerciseId: string, duration: number, completed: boolean) => Promise<void>;
  recordScreenTime: (duration: number, category?: 'work' | 'entertainment' | 'social' | 'other') => Promise<void>;
  recordBlinkRate: (rate: number, duration: number) => Promise<void>;
  calculateHealthScore: () => Promise<number>;
  refreshData: () => Promise<void>;

  exerciseService: ExerciseService;
  userService: UserService;
  analyticsService: AnalyticsService;
  storageService: StorageService;
  isInitialized: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData | null>(null);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [services, setServices] = useState<{
    exerciseService: ExerciseService;
    userService: UserService;
    analyticsService: AnalyticsService;
    storageService: StorageService;
  } | null>(null);

  // Initialize services
  useEffect(() => {
    console.log('[AppDataContext] Starting service initialization');
    const initializeServices = async () => {
      setIsLoading(true);
      try {
        console.log('[AppDataContext] Creating StorageService');
        const storageService = new StorageService();
        
        console.log('[AppDataContext] Creating ExerciseService');
        const exerciseService = new ExerciseService(storageService);
        
        console.log('[AppDataContext] Creating UserService');
        const userService = new UserService(storageService);
        
        console.log('[AppDataContext] Creating AnalyticsService');
        const analyticsService = new AnalyticsService(storageService);

        // Test storage initialization
        console.log('[AppDataContext] Testing storage initialization');
        await storageService.loadData('test');
        console.log('[AppDataContext] Storage initialization test complete');

        setServices({
          exerciseService,
          userService,
          analyticsService,
          storageService,
        });
        setIsInitialized(true);
        console.log('[AppDataContext] Services initialized successfully');
      } catch (err) {
        console.error('[AppDataContext] Error initializing services:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize services');
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  // Load data after services are initialized
  useEffect(() => {
    console.log('[AppDataContext] Load data effect triggered. Initialized:', isInitialized, 'Services:', !!services);
    const loadData = async () => {
      if (!isInitialized || !services) {
        console.log('[AppDataContext] Services not ready yet, skipping data load');
        return;
      }
      
      console.log('[AppDataContext] Starting to load app data');
      try {
        // Check if we need to start a new week
        console.log('[AppDataContext] Checking for new week');
        await services.analyticsService.startNewWeek();
        
        // Load user
        console.log('[AppDataContext] Loading user data');
        const userData = await services.userService.getCurrentUser();
        setUser(userData);
        console.log('[AppDataContext] User data loaded:', !!userData);

        // Load exercises
        console.log('[AppDataContext] Loading exercises');
        const exercisesData = services.exerciseService.getExercises();
        setExercises(exercisesData);
        console.log('[AppDataContext] Exercises loaded:', exercisesData.length);

        // Load weekly activity
        console.log('[AppDataContext] Loading weekly activity');
        const weeklyData = services.analyticsService.getWeeklyActivity();
        setWeeklyActivity(weeklyData);
        console.log('[AppDataContext] Weekly activity loaded');

        // Load health score
        if (userData) {
          console.log('[AppDataContext] Setting health score from user data');
          setHealthScore(userData.stats.healthScore);
        }
        
        console.log('[AppDataContext] All data loaded successfully');
      } catch (error) {
        console.error('[AppDataContext] Error loading app data:', error);
        setError('Failed to load app data. Some features may be limited.');
      } finally {
        console.log('[AppDataContext] Setting loading state to false');
        setIsLoading(false);
      }
    };

    loadData();
  }, [isInitialized, services]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading app data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Initializing App</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorHelp}>Please try restarting the app. If the problem persists, contact support.</Text>
      </View>
    );
  }

  if (!services) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Service Initialization Failed</Text>
        <Text style={styles.errorHelp}>Please restart the app to try again.</Text>
      </View>
    );
  }

  // Create a new user
  const createUser = async (name: string, email?: string): Promise<User> => {
    try {
      const newUser = await services.userService.createUser(name, email);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  };

  // Update user settings
  const updateUserSettings = async (settings: any): Promise<void> => {
    try {
      const updatedSettings = await services.userService.updateSettings(settings);
      if (updatedSettings && user) {
        setUser({ ...user, settings: updatedSettings });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  };

  // Get exercise by ID
  const getExerciseById = (id: string): Exercise | null => {
    try {
      return services.exerciseService.getExerciseById(id);
    } catch (error) {
      console.error('Error getting exercise:', error);
      return null;
    }
  };

  // Start an exercise session
  const startExerciseSession = async (exerciseId: string): Promise<ExerciseSession> => {
    try {
      const session = await services.exerciseService.startExerciseSession(exerciseId);
      return session;
    } catch (error) {
      console.error('Error starting exercise session:', error);
      throw new Error('Failed to start exercise session');
    }
  };

  // Complete an exercise session
  const completeExerciseSession = async (sessionId: string): Promise<ExerciseSession | null> => {
    try {
      const completed = await services.exerciseService.completeExerciseSession(sessionId);
      
      // Refresh exercises after completion to update stats
      if (completed) {
        const updatedExercises = services.exerciseService.getExercises();
        setExercises(updatedExercises);
      }
      
      return completed;
    } catch (error) {
      console.error('Error completing exercise session:', error);
      throw new Error('Failed to complete exercise session');
    }
  };

  // Record a completed exercise
  const recordExercise = async (
    exerciseId: string, 
    duration: number, 
    completed: boolean
  ): Promise<void> => {
    try {
      await services.analyticsService.recordExercise(exerciseId, duration, completed);
      
      // Update weekly activity
      const updatedWeekly = services.analyticsService.getWeeklyActivity();
      setWeeklyActivity(updatedWeekly);
      
      // Get updated user
      const updatedUser = await services.userService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error recording exercise:', error);
      throw new Error('Failed to record exercise');
    }
  };

  // Record screen time
  const recordScreenTime = async (
    duration: number, 
    category: 'work' | 'entertainment' | 'social' | 'other' = 'other'
  ): Promise<void> => {
    try {
      await services.analyticsService.recordScreenTime(duration, category);
      
      // Get updated user
      const updatedUser = await services.userService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error recording screen time:', error);
      throw new Error('Failed to record screen time');
    }
  };

  // Record blink rate
  const recordBlinkRate = async (rate: number, duration: number): Promise<void> => {
    try {
      await services.analyticsService.recordBlinkRate(rate, duration);
      
      // Get updated user
      const updatedUser = await services.userService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error recording blink rate:', error);
      throw new Error('Failed to record blink rate');
    }
  };

  // Calculate health score
  const calculateHealthScore = async (): Promise<number> => {
    try {
      const score = await services.analyticsService.calculateHealthScore();
      setHealthScore(score);
      
      // Get updated user
      const updatedUser = await services.userService.getCurrentUser();
      setUser(updatedUser);
      
      return score;
    } catch (error) {
      console.error('Error calculating health score:', error);
      throw new Error('Failed to calculate health score');
    }
  };

  // Refresh all data
  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we need to start a new week
      await services.analyticsService.startNewWeek();
      
      // Reload user
      const userData = await services.userService.getCurrentUser();
      setUser(userData);

      // Reload exercises
      const exercisesData = services.exerciseService.getExercises();
      setExercises(exercisesData);

      // Reload weekly activity
      const weeklyData = services.analyticsService.getWeeklyActivity();
      setWeeklyActivity(weeklyData);

      // Update health score
      if (userData) {
        setHealthScore(userData.stats.healthScore);
      }
    } catch (error) {
      console.error('Error refreshing app data:', error);
      setError('Failed to refresh app data. Some features may be limited.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AppDataContextType = {
    user,
    isLoading,
    error,
    createUser,
    updateUserSettings,
    exercises,
    getExerciseById,
    startExerciseSession,
    completeExerciseSession,
    weeklyActivity,
    healthScore,
    recordExercise,
    recordScreenTime,
    recordBlinkRate,
    calculateHealthScore,
    refreshData,
    exerciseService: services.exerciseService,
    userService: services.userService,
    analyticsService: services.analyticsService,
    storageService: services.storageService,
    isInitialized,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

// Custom hook to use the AppData context
export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

export default AppDataContext;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorHelp: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
}); 