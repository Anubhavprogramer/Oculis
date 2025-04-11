import { useState, useCallback, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { WeeklyActivityData, MonthlyProgressData } from '../models/ProgressData';

/**
 * Custom hook for analytics and progress tracking
 */
const useAnalytics = () => {
  const { 
    user, 
    weeklyActivity, 
    healthScore, 
    recordScreenTime, 
    recordBlinkRate,
    calculateHealthScore,
    refreshData
  } = useAppData();
  
  const [weeklyData, setWeeklyData] = useState<WeeklyActivityData | null>(weeklyActivity);
  const [currentHealthScore, setCurrentHealthScore] = useState<number>(healthScore);
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<MonthlyProgressData[]>([]);

  // Update state when context values change
  useEffect(() => {
    setWeeklyData(weeklyActivity);
    setCurrentHealthScore(healthScore);
  }, [weeklyActivity, healthScore]);

  /**
   * Refresh analytics data
   */
  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      await refreshData();
      // Calculate health score
      const score = await calculateHealthScore();
      setCurrentHealthScore(score);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshData, calculateHealthScore]);

  /**
   * Calculate current health score
   */
  const updateHealthScore = useCallback(async () => {
    setIsLoading(true);
    try {
      const score = await calculateHealthScore();
      setCurrentHealthScore(score);
      return score;
    } catch (error) {
      console.error('Error calculating health score:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [calculateHealthScore]);

  /**
   * Log screen time
   */
  const logScreenTime = useCallback(async (
    minutes: number, 
    category: 'work' | 'entertainment' | 'social' | 'other' = 'other'
  ) => {
    setIsLoading(true);
    try {
      await recordScreenTime(minutes, category);
      return true;
    } catch (error) {
      console.error('Error logging screen time:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [recordScreenTime]);

  /**
   * Log blink rate measurement
   */
  const logBlinkRate = useCallback(async (rate: number, measurementDuration: number) => {
    setIsLoading(true);
    try {
      await recordBlinkRate(rate, measurementDuration);
      return true;
    } catch (error) {
      console.error('Error logging blink rate:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [recordBlinkRate]);

  /**
   * Get days active streak
   */
  const getStreak = useCallback(() => {
    return user?.stats.streak || 0;
  }, [user]);

  /**
   * Get weekly activity data formatted for charts
   */
  const getWeeklyChartData = useCallback(() => {
    if (!weeklyData) return null;
    
    // Data for exercise time chart
    const exerciseTimeData = weeklyData.dailyData.map(day => ({
      day: day.date.toString().split(' ')[0], // Day of week (Mon, Tue, etc.)
      value: Math.round(day.exerciseTime),
    }));
    
    // Data for health score chart
    const healthScoreData = weeklyData.dailyData.map(day => ({
      day: day.date.toString().split(' ')[0],
      value: day.healthScore > 0 ? day.healthScore : null, // Only include recorded scores
    }));
    
    // Data for exercises completed chart
    const exercisesCompletedData = weeklyData.dailyData.map(day => ({
      day: day.date.toString().split(' ')[0],
      value: day.exercisesCompleted,
    }));
    
    return {
      exerciseTimeData,
      healthScoreData,
      exercisesCompletedData,
    };
  }, [weeklyData]);

  /**
   * Get daily goal progress
   */
  const getDailyGoalProgress = useCallback(() => {
    if (!user) return null;
    
    const { dailyGoals } = user;
    const { currentProgress } = dailyGoals;
    
    // Calculate progress percentages
    const exerciseProgress = Math.min(
      100, 
      (currentProgress.exercisesCompleted / dailyGoals.exercises) * 100
    );
    
    const screenTimeProgress = dailyGoals.screenTimeLimit > 0
      ? Math.min(100, (currentProgress.screenTime / dailyGoals.screenTimeLimit) * 100)
      : 0;
      
    const exerciseTimeProgress = Math.min(
      100, 
      (currentProgress.exerciseTime / dailyGoals.exerciseTime) * 100
    );
    
    // Calculate overall progress
    const overallProgress = (exerciseProgress + (100 - screenTimeProgress) + exerciseTimeProgress) / 3;
    
    return {
      exerciseProgress,
      screenTimeProgress,
      exerciseTimeProgress,
      overallProgress,
      goals: dailyGoals,
      progress: currentProgress,
    };
  }, [user]);

  return {
    // State
    weeklyData,
    currentHealthScore,
    isLoading,
    monthlyData,
    
    // Actions
    refreshAnalytics,
    updateHealthScore,
    logScreenTime,
    logBlinkRate,
    
    // Computed data
    getStreak,
    getWeeklyChartData,
    getDailyGoalProgress,
  };
};

export default useAnalytics; 