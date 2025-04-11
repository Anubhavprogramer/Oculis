// Import polyfill for crypto.getRandomValues()
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { 
  ProgressData, 
  ExerciseEntry, 
  ScreenTimeEntry, 
  WeeklyActivityData,
  BlinkRateEntry,
  MonthlyProgressData 
} from '../models/ProgressData';
import { StorageService, STORAGE_KEYS } from './StorageService';
import UserService from './UserService';

/**
 * Service for handling analytics and progress data
 */
class AnalyticsService {
  private storageService: StorageService;
  private userService: UserService;
  private progressData: ProgressData | null = null;

  constructor(storageService?: StorageService) {
    this.storageService = storageService || new StorageService();
    this.userService = new UserService(this.storageService);
    this.loadProgressData();
  }

  /**
   * Load progress data from storage
   */
  private async loadProgressData(): Promise<void> {
    try {
      const progressData = await this.storageService.loadData<ProgressData>(STORAGE_KEYS.PROGRESS_DATA);
      if (progressData) {
        this.progressData = progressData;
      } else {
        await this.initializeProgressData();
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      await this.initializeProgressData();
    }
  }

  /**
   * Initialize progress data with default values
   */
  private async initializeProgressData(): Promise<void> {
    const user = await this.userService.getCurrentUser();
    if (!user) return;

    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);

    this.progressData = {
      id: uuidv4(),
      userId: user.id,
      date: today,
      healthScore: user.stats.healthScore,
      dailyExercises: [],
      screenTime: [],
      blinkRate: [],
      weeklyActivity: {
        startDate: startOfWeek,
        endDate: endOfWeek,
        totalExerciseTime: 0,
        averageHealthScore: user.stats.healthScore,
        dailyData: this.initializeWeeklyData(startOfWeek),
      },
    };

    await this.saveProgressData();
  }

  /**
   * Save progress data to storage
   */
  private async saveProgressData(): Promise<void> {
    if (this.progressData) {
      await this.storageService.saveData(STORAGE_KEYS.PROGRESS_DATA, this.progressData);
    }
  }

  /**
   * Get current progress data
   * @returns The current progress data
   */
  getProgressData(): ProgressData | null {
    return this.progressData;
  }

  /**
   * Record a completed exercise
   * @param exerciseId Exercise ID
   * @param duration Duration in seconds
   * @param completed Whether the exercise was completed fully
   * @returns Success indicator
   */
  async recordExercise(exerciseId: string, duration: number, completed: boolean): Promise<boolean> {
    if (!this.progressData) return false;

    const exerciseEntry: ExerciseEntry = {
      exerciseId,
      duration,
      completed,
      timeOfDay: new Date(),
    };

    // Update progress data
    this.progressData.dailyExercises.push(exerciseEntry);
    
    // Update today's data in weekly activity
    const today = new Date();
    const dayIndex = today.getDay();
    if (dayIndex < this.progressData.weeklyActivity.dailyData.length) {
      this.progressData.weeklyActivity.dailyData[dayIndex].exerciseTime += duration / 60;
      this.progressData.weeklyActivity.dailyData[dayIndex].exercisesCompleted += 1;
      this.progressData.weeklyActivity.totalExerciseTime += duration / 60;
    }

    // Log to user service
    await this.userService.logExercise(duration);
    
    // Save progress data
    await this.saveProgressData();
    return true;
  }

  /**
   * Record screen time
   * @param duration Duration in minutes
   * @param category Optional category
   * @returns Success indicator
   */
  async recordScreenTime(
    duration: number, 
    category: 'work' | 'entertainment' | 'social' | 'other' = 'other'
  ): Promise<boolean> {
    if (!this.progressData) return false;

    const now = new Date();
    const startTime = new Date(now.getTime() - duration * 60 * 1000);

    const screenTimeEntry: ScreenTimeEntry = {
      startTime,
      endTime: now,
      duration,
      category,
    };

    // Update progress data
    this.progressData.screenTime.push(screenTimeEntry);
    
    // Log to user service
    await this.userService.logScreenTime(duration);
    
    // Save progress data
    await this.saveProgressData();
    return true;
  }

  /**
   * Record blink rate
   * @param rate Blinks per minute
   * @param duration Measurement duration in seconds
   * @returns Success indicator
   */
  async recordBlinkRate(rate: number, duration: number): Promise<boolean> {
    if (!this.progressData) return false;

    const blinkRateEntry: BlinkRateEntry = {
      timeRecorded: new Date(),
      rate,
      duration,
    };

    // Update progress data
    this.progressData.blinkRate.push(blinkRateEntry);
    
    // Update user service
    await this.userService.updateBlinkRate(rate);
    
    // Save progress data
    await this.saveProgressData();
    return true;
  }

  /**
   * Update health score
   * @param score New health score (0-100)
   * @returns Success indicator
   */
  async updateHealthScore(score: number): Promise<boolean> {
    if (!this.progressData) return false;

    // Ensure score is within valid range
    const validScore = Math.max(0, Math.min(100, score));
    
    // Update progress data
    this.progressData.healthScore = validScore;
    
    // Update today's score in weekly activity
    const today = new Date();
    const dayIndex = today.getDay();
    if (dayIndex < this.progressData.weeklyActivity.dailyData.length) {
      this.progressData.weeklyActivity.dailyData[dayIndex].healthScore = validScore;
      
      // Update average health score
      const totalScores = this.progressData.weeklyActivity.dailyData
        .map(day => day.healthScore)
        .filter(score => score > 0);
        
      if (totalScores.length > 0) {
        const sum = totalScores.reduce((a, b) => a + b, 0);
        this.progressData.weeklyActivity.averageHealthScore = sum / totalScores.length;
      }
    }
    
    // Update user service
    await this.userService.updateHealthScore(validScore);
    
    // Save progress data
    await this.saveProgressData();
    return true;
  }

  /**
   * Get weekly activity data
   * @returns Weekly activity data
   */
  getWeeklyActivity(): WeeklyActivityData | null {
    if (!this.progressData) return null;
    return this.progressData.weeklyActivity;
  }

  /**
   * Start a new week (used when transitioning to a new week)
   * @returns Success indicator
   */
  async startNewWeek(): Promise<boolean> {
    if (!this.progressData) return false;

    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);

    // Check if we're already in a new week
    if (
      this.progressData.weeklyActivity.startDate.getTime() <= startOfWeek.getTime() &&
      this.progressData.weeklyActivity.endDate.getTime() >= endOfWeek.getTime()
    ) {
      return true; // Already in current week
    }

    // Create monthly data if we just entered a new month
    if (
      this.progressData.weeklyActivity.startDate.getMonth() !== startOfWeek.getMonth() ||
      this.progressData.weeklyActivity.startDate.getFullYear() !== startOfWeek.getFullYear()
    ) {
      await this.finalizeMonthlyData();
    }

    // Store previous week's data
    const previousWeek = { ...this.progressData.weeklyActivity };

    // Reset for new week
    this.progressData.weeklyActivity = {
      startDate: startOfWeek,
      endDate: endOfWeek,
      totalExerciseTime: 0,
      averageHealthScore: this.progressData.healthScore,
      dailyData: this.initializeWeeklyData(startOfWeek),
    };

    // Reset daily exercise tracking but keep last 50 entries for history
    if (this.progressData.dailyExercises.length > 50) {
      this.progressData.dailyExercises = this.progressData.dailyExercises.slice(-50);
    }

    // Reset screen time tracking but keep last 50 entries for history
    if (this.progressData.screenTime.length > 50) {
      this.progressData.screenTime = this.progressData.screenTime.slice(-50);
    }

    // Reset blink rate tracking but keep last 50 entries for history
    if (this.progressData.blinkRate.length > 50) {
      this.progressData.blinkRate = this.progressData.blinkRate.slice(-50);
    }

    await this.saveProgressData();
    return true;
  }

  /**
   * Finalize monthly data by aggregating weekly data
   */
  private async finalizeMonthlyData(): Promise<void> {
    if (!this.progressData) return;

    const previousMonth = this.progressData.weeklyActivity.startDate.getMonth();
    const previousYear = this.progressData.weeklyActivity.startDate.getFullYear();

    // Load existing monthly data
    const existingMonthlyData = await this.storageService.loadData<MonthlyProgressData[]>(
      `${STORAGE_KEYS.PROGRESS_DATA}_monthly`
    );

    // Get data for the month
    let monthData = existingMonthlyData?.find(
      data => data.month === previousMonth && data.year === previousYear
    );

    if (!monthData) {
      monthData = {
        month: previousMonth,
        year: previousYear,
        averageHealthScore: this.progressData.weeklyActivity.averageHealthScore,
        totalExerciseTime: this.progressData.weeklyActivity.totalExerciseTime,
        longestStreak: 0,
        mostPerformedExercise: '',
        weeklyData: [this.progressData.weeklyActivity],
      };
    } else {
      // Update existing month data
      monthData.weeklyData.push(this.progressData.weeklyActivity);
      
      // Recalculate averages
      let totalScore = 0;
      let totalTime = 0;
      let validWeeks = 0;
      
      for (const week of monthData.weeklyData) {
        if (week.averageHealthScore > 0) {
          totalScore += week.averageHealthScore;
          validWeeks++;
        }
        totalTime += week.totalExerciseTime;
      }
      
      if (validWeeks > 0) {
        monthData.averageHealthScore = totalScore / validWeeks;
      }
      
      monthData.totalExerciseTime = totalTime;
    }

    // Get user data for streak info
    const user = await this.userService.getCurrentUser();
    if (user) {
      monthData.longestStreak = Math.max(monthData.longestStreak, user.stats.streak);
    }

    // Save updated monthly data
    const updatedMonthlyData = existingMonthlyData ? 
      existingMonthlyData.filter(data => !(data.month === previousMonth && data.year === previousYear))
      : [];
      
    updatedMonthlyData.push(monthData);
    
    await this.storageService.saveData(
      `${STORAGE_KEYS.PROGRESS_DATA}_monthly`, 
      updatedMonthlyData
    );
  }

  /**
   * Get monthly progress data
   * @param month Month (0-11)
   * @param year Year
   * @returns Monthly progress data or null if not found
   */
  async getMonthlyData(month: number, year: number): Promise<MonthlyProgressData | null> {
    const monthlyData = await this.storageService.loadData<MonthlyProgressData[]>(
      `${STORAGE_KEYS.PROGRESS_DATA}_monthly`
    );
    
    if (!monthlyData) return null;
    
    return monthlyData.find(data => data.month === month && data.year === year) || null;
  }

  /**
   * Get all available monthly data
   * @returns Array of monthly progress data
   */
  async getAllMonthlyData(): Promise<MonthlyProgressData[]> {
    const monthlyData = await this.storageService.loadData<MonthlyProgressData[]>(
      `${STORAGE_KEYS.PROGRESS_DATA}_monthly`
    );
    
    return monthlyData || [];
  }

  /**
   * Initialize weekly data structure
   * @param startOfWeek Start date of the week
   * @returns Array of daily data
   */
  private initializeWeeklyData(startOfWeek: Date): WeeklyActivityData['dailyData'] {
    const dailyData: WeeklyActivityData['dailyData'] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      
      dailyData.push({
        date,
        exerciseTime: 0,
        healthScore: i === 0 ? this.progressData?.healthScore || 70 : 0,
        exercisesCompleted: 0,
      });
    }
    
    return dailyData;
  }

  /**
   * Get start of the week for a given date
   * @param date Date
   * @returns Date representing the start of the week (Sunday)
   */
  private getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of the week for a given date
   * @param date Date
   * @returns Date representing the end of the week (Saturday)
   */
  private getEndOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() + (6 - day));
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Calculate health score based on various factors
   * @returns Calculated health score (0-100)
   */
  async calculateHealthScore(): Promise<number> {
    if (!this.progressData) return 0;
    
    const user = await this.userService.getCurrentUser();
    if (!user) return 0;
    
    // Get today's data
    const today = new Date();
    const todayStr = today.toDateString();
    
    const todaysExercises = this.progressData.dailyExercises.filter(
      exercise => exercise.timeOfDay.toDateString() === todayStr
    );
    
    const todaysScreenTime = this.progressData.screenTime.filter(
      entry => entry.startTime.toDateString() === todayStr
    );
    
    const recentBlinkRate = this.progressData.blinkRate.slice(-5);
    
    // Calculate score components
    
    // 1. Exercise component (30 points)
    let exerciseScore = 0;
    const exerciseCount = todaysExercises.length;
    const exerciseMinutes = todaysExercises.reduce((acc, ex) => acc + ex.duration / 60, 0);
    
    if (exerciseCount >= user.dailyGoals.exercises) {
      exerciseScore = 30; // Full score for meeting goal
    } else if (exerciseCount > 0) {
      exerciseScore = Math.round((exerciseCount / user.dailyGoals.exercises) * 30);
    }
    
    // 2. Screen time component (30 points)
    let screenTimeScore = 30;
    const dailyScreenTime = todaysScreenTime.reduce((acc, entry) => acc + entry.duration, 0);
    
    if (dailyScreenTime > user.dailyGoals.screenTimeLimit) {
      // Deduct points for exceeding limit
      const exceededRatio = Math.min(1, (dailyScreenTime - user.dailyGoals.screenTimeLimit) / user.dailyGoals.screenTimeLimit);
      screenTimeScore = Math.round(30 * (1 - exceededRatio));
    }
    
    // 3. Blink rate component (20 points)
    let blinkRateScore = 0;
    if (recentBlinkRate.length > 0) {
      const avgBlinkRate = recentBlinkRate.reduce((acc, entry) => acc + entry.rate, 0) / recentBlinkRate.length;
      
      // Optimal blink rate is around 15-20 blinks per minute
      if (avgBlinkRate >= 15 && avgBlinkRate <= 20) {
        blinkRateScore = 20; // Optimal
      } else if (avgBlinkRate >= 10 && avgBlinkRate <= 25) {
        blinkRateScore = 15; // Good
      } else if (avgBlinkRate >= 5 && avgBlinkRate <= 30) {
        blinkRateScore = 10; // Fair
      } else {
        blinkRateScore = 5; // Poor
      }
    } else {
      blinkRateScore = 10; // Default if no measurements
    }
    
    // 4. Streak component (20 points)
    let streakScore = Math.min(20, user.stats.streak * 2);
    
    // Calculate total score
    const healthScore = exerciseScore + screenTimeScore + blinkRateScore + streakScore;
    
    // Update and save
    await this.updateHealthScore(healthScore);
    
    return healthScore;
  }
}

export default AnalyticsService; 