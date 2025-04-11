// Import polyfill for crypto.getRandomValues()
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { User, UserSettings, UserStats, Achievement } from '../models/User';
import { StorageService, STORAGE_KEYS } from './StorageService';

/**
 * Service for managing user data
 */
class UserService {
  private storageService: StorageService;
  private currentUser: User | null = null;

  constructor(storageService?: StorageService) {
    this.storageService = storageService || new StorageService();
    this.loadUser();
  }

  /**
   * Load user from storage
   */
  private async loadUser(): Promise<void> {
    try {
      const user = await this.storageService.loadData<User>(STORAGE_KEYS.USER);
      if (user) {
        this.currentUser = user;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  /**
   * Save user to storage
   */
  private async saveUser(): Promise<void> {
    if (this.currentUser) {
      await this.storageService.saveData(STORAGE_KEYS.USER, this.currentUser);
    }
  }

  /**
   * Get current user
   * @returns Current user or null if not set
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user exists
   * @returns Boolean indicating if user exists
   */
  async hasUser(): Promise<boolean> {
    return await this.storageService.hasData(STORAGE_KEYS.USER);
  }

  /**
   * Create a new user
   * @param name User name
   * @param email Optional email
   * @returns The created user
   */
  async createUser(name: string, email?: string): Promise<User> {
    const now = new Date();
    
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      createdAt: now,
      lastLogin: now,
      settings: this.getDefaultSettings(),
      stats: this.getDefaultStats(),
      achievements: this.getDefaultAchievements(),
      dailyGoals: {
        exercises: 3,
        screenTimeLimit: 120, // 2 hours
        exerciseTime: 10, // 10 minutes
        currentProgress: {
          exercisesCompleted: 0,
          screenTime: 0,
          exerciseTime: 0,
        },
        lastUpdated: now,
      },
    };

    this.currentUser = newUser;
    await this.saveUser();
    return newUser;
  }

  /**
   * Update user information
   * @param updates Updates to apply
   * @returns The updated user
   */
  async updateUser(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) return null;

    this.currentUser = { ...this.currentUser, ...updates };
    await this.saveUser();
    return this.currentUser;
  }

  /**
   * Update user settings
   * @param settings Updates to apply
   * @returns The updated settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings | null> {
    if (!this.currentUser) return null;

    const updatedSettings = { ...this.currentUser.settings, ...settings };
    this.currentUser.settings = updatedSettings;
    await this.saveUser();
    return updatedSettings;
  }

  /**
   * Update user stats
   * @param stats Updates to apply
   * @returns The updated stats
   */
  async updateStats(stats: Partial<UserStats>): Promise<UserStats | null> {
    if (!this.currentUser) return null;

    const updatedStats = { ...this.currentUser.stats, ...stats };
    this.currentUser.stats = updatedStats;
    await this.saveUser();
    return updatedStats;
  }

  /**
   * Update health score
   * @param score New health score (0-100)
   * @returns The updated score
   */
  async updateHealthScore(score: number): Promise<number | null> {
    if (!this.currentUser) return null;

    // Ensure score is within valid range
    const validScore = Math.max(0, Math.min(100, score));
    
    this.currentUser.stats.healthScore = validScore;
    this.currentUser.stats.lastUpdateDate = new Date();
    await this.saveUser();
    
    // Update last calculation time
    await this.storageService.saveData(
      STORAGE_KEYS.LAST_HEALTH_CALCULATION,
      new Date().toISOString()
    );
    
    return validScore;
  }

  /**
   * Increment user streak
   * @returns The updated streak
   */
  async incrementStreak(): Promise<number | null> {
    if (!this.currentUser) return null;

    const newStreak = this.currentUser.stats.streak + 1;
    this.currentUser.stats.streak = newStreak;
    await this.saveUser();

    // Check achievements
    await this.checkAchievements();
    
    return newStreak;
  }

  /**
   * Reset user streak
   * @returns Success indicator
   */
  async resetStreak(): Promise<boolean> {
    if (!this.currentUser) return false;

    this.currentUser.stats.streak = 0;
    await this.saveUser();
    return true;
  }

  /**
   * Reset daily goals progress
   * @returns Success indicator
   */
  async resetDailyProgress(): Promise<boolean> {
    if (!this.currentUser) return false;

    this.currentUser.dailyGoals.currentProgress = {
      exercisesCompleted: 0,
      screenTime: 0,
      exerciseTime: 0,
    };
    this.currentUser.dailyGoals.lastUpdated = new Date();
    await this.saveUser();
    return true;
  }

  /**
   * Log exercise completion
   * @param duration Duration in seconds
   * @returns Success indicator
   */
  async logExercise(duration: number): Promise<boolean> {
    if (!this.currentUser) return false;

    // Update stats
    this.currentUser.stats.exercisesCompleted += 1;
    this.currentUser.stats.totalExerciseTime += duration / 60; // Convert to minutes
    
    // Update daily progress
    this.currentUser.dailyGoals.currentProgress.exercisesCompleted += 1;
    this.currentUser.dailyGoals.currentProgress.exerciseTime += duration / 60;
    this.currentUser.dailyGoals.lastUpdated = new Date();
    
    await this.saveUser();
    
    // Check achievements
    await this.checkAchievements();
    
    return true;
  }

  /**
   * Log screen time
   * @param duration Duration in minutes
   * @returns Success indicator
   */
  async logScreenTime(duration: number): Promise<boolean> {
    if (!this.currentUser) return false;

    // Update daily progress
    this.currentUser.dailyGoals.currentProgress.screenTime += duration;
    this.currentUser.dailyGoals.lastUpdated = new Date();
    
    // Update average screen time (with smoothing)
    const currentAvg = this.currentUser.stats.screenTime;
    const newAvg = currentAvg * 0.7 + duration * 0.3; // 70% old value, 30% new value
    this.currentUser.stats.screenTime = newAvg;
    
    await this.saveUser();
    return true;
  }

  /**
   * Update blink rate
   * @param rate Blinks per minute
   * @returns Updated rate
   */
  async updateBlinkRate(rate: number): Promise<number | null> {
    if (!this.currentUser) return null;

    // Update with smoothing
    const currentRate = this.currentUser.stats.blinkRate;
    const newRate = currentRate * 0.7 + rate * 0.3; // 70% old value, 30% new value
    this.currentUser.stats.blinkRate = newRate;
    
    await this.saveUser();
    return newRate;
  }

  /**
   * Check and update achievements
   * @returns Updated achievements
   */
  async checkAchievements(): Promise<Achievement[]> {
    if (!this.currentUser) return [];

    const updatedAchievements = [...this.currentUser.achievements];
    let hasUpdates = false;

    for (const achievement of updatedAchievements) {
      if (achievement.isUnlocked) continue;

      let isUnlocked = false;
      
      switch (achievement.requirement.type) {
        case 'streak':
          isUnlocked = this.currentUser.stats.streak >= achievement.requirement.value;
          break;
        case 'exerciseCount':
          isUnlocked = this.currentUser.stats.exercisesCompleted >= achievement.requirement.value;
          break;
        case 'screenTime':
          isUnlocked = this.currentUser.stats.screenTime <= achievement.requirement.value;
          break;
        case 'totalTime':
          isUnlocked = this.currentUser.stats.totalExerciseTime >= achievement.requirement.value;
          break;
      }

      if (isUnlocked) {
        achievement.isUnlocked = true;
        achievement.dateUnlocked = new Date();
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      this.currentUser.achievements = updatedAchievements;
      await this.saveUser();
    }

    return updatedAchievements;
  }

  /**
   * Get default settings
   * @returns Default settings
   */
  private getDefaultSettings(): UserSettings {
    return {
      notificationsEnabled: true,
      darkModeEnabled: false,
      remindersEnabled: true,
      reminderTimes: ['09:00', '12:00', '15:00', '18:00'],
      preferedExerciseType: ['quick', 'focusing', 'eyeRolling'],
      workDuration: 25, // 25 minutes (pomodoro style)
      breakDuration: 5, // 5 minutes
      language: 'en', // English
    };
  }

  /**
   * Get default stats
   * @returns Default stats
   */
  private getDefaultStats(): UserStats {
    return {
      healthScore: 70, // Starting value
      daysActive: 0,
      totalExerciseTime: 0,
      streak: 0,
      blinkRate: 15, // Average blink rate
      screenTime: 120, // 2 hours per day (starting value)
      exercisesCompleted: 0,
      lastUpdateDate: new Date(),
    };
  }

  /**
   * Get default achievements
   * @returns Default achievements
   */
  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: uuidv4(),
        title: '3 Day Streak',
        description: 'Use the app for 3 consecutive days',
        iconName: '🔥',
        isUnlocked: false,
        requirement: {
          type: 'streak',
          value: 3,
        },
      },
      {
        id: uuidv4(),
        title: 'First Exercise',
        description: 'Complete your first eye exercise',
        iconName: '⭐',
        isUnlocked: false,
        requirement: {
          type: 'exerciseCount',
          value: 1,
        },
      },
      {
        id: uuidv4(),
        title: '1 Hour Total',
        description: 'Complete 60 minutes of eye exercises',
        iconName: '🏆',
        isUnlocked: false,
        requirement: {
          type: 'totalTime',
          value: 60,
        },
      },
      {
        id: uuidv4(),
        title: 'Perfect Week',
        description: 'Complete all daily goals for 7 consecutive days',
        iconName: '🥇',
        isUnlocked: false,
        requirement: {
          type: 'streak',
          value: 7,
        },
      },
      {
        id: uuidv4(),
        title: 'Exercise Master',
        description: 'Complete 50 eye exercises',
        iconName: '👁️',
        isUnlocked: false,
        requirement: {
          type: 'exerciseCount',
          value: 50,
        },
      },
      {
        id: uuidv4(),
        title: 'Screen Time Hero',
        description: 'Reduce average screen time below 2 hours',
        iconName: '📱',
        isUnlocked: false,
        requirement: {
          type: 'screenTime',
          value: 120, // 2 hours in minutes
        },
      },
      {
        id: uuidv4(),
        title: 'Eye Care Pro',
        description: 'Complete 5 hours of total eye exercises',
        iconName: '👑',
        isUnlocked: false,
        requirement: {
          type: 'totalTime',
          value: 300, // 5 hours in minutes
        },
      },
    ];
  }
}

export default UserService; 