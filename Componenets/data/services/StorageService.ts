import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const STORAGE_KEYS = {
  USER: 'eyecare_user',
  EXERCISES: 'eyecare_exercises',
  EXERCISE_SESSIONS: 'eyecare_exercise_sessions',
  PROGRESS_DATA: 'eyecare_progress',
  SETTINGS: 'eyecare_settings',
  LAST_HEALTH_CALCULATION: 'eyecare_last_health_calc',
};

// In-memory storage fallback
const memoryStorage: Record<string, string> = {};

/**
 * Service for handling persistent storage operations
 */
class StorageService {
  private isAsyncStorageAvailable: boolean = false;
  private initializationPromise: Promise<void>;

  constructor() {
    this.initializationPromise = this.initializeAsyncStorage();
  }

  private async initializeAsyncStorage(): Promise<void> {
    try {
      // Test AsyncStorage
      await AsyncStorage.getItem('test');
      this.isAsyncStorageAvailable = true;
      console.log('AsyncStorage is available');
    } catch (error) {
      console.warn('AsyncStorage is not available, using in-memory storage:', error);
      this.isAsyncStorageAvailable = false;
    }
  }

  /**
   * Save data to storage
   * @param key Storage key
   * @param data Data to save
   */
  async saveData<T>(key: string, data: T): Promise<void> {
    await this.initializationPromise;
    
    try {
      const jsonValue = JSON.stringify(data);
      if (this.isAsyncStorageAvailable) {
        await AsyncStorage.setItem(key, jsonValue);
      } else {
        memoryStorage[key] = jsonValue;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Fallback to memory storage
      memoryStorage[key] = JSON.stringify(data);
    }
  }

  /**
   * Load data from storage
   * @param key Storage key
   * @returns The stored data, or null if not found
   */
  async loadData<T>(key: string): Promise<T | null> {
    await this.initializationPromise;
    
    try {
      let jsonValue: string | null;
      if (this.isAsyncStorageAvailable) {
        jsonValue = await AsyncStorage.getItem(key);
      } else {
        jsonValue = memoryStorage[key] || null;
      }
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      // Try to get from memory storage
      const memoryValue = memoryStorage[key];
      return memoryValue ? JSON.parse(memoryValue) : null;
    }
  }

  /**
   * Remove data from storage
   * @param key Storage key
   */
  async removeData(key: string): Promise<void> {
    await this.initializationPromise;
    
    try {
      if (this.isAsyncStorageAvailable) {
        await AsyncStorage.removeItem(key);
      }
      delete memoryStorage[key];
    } catch (error) {
      console.error('Error removing data:', error);
      delete memoryStorage[key];
    }
  }

  /**
   * Clear all app data from storage
   */
  async clearAllData(): Promise<void> {
    await this.initializationPromise;
    
    try {
      if (this.isAsyncStorageAvailable) {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
      }
      // Clear memory storage
      Object.keys(memoryStorage).forEach(key => {
        delete memoryStorage[key];
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      // Clear memory storage as fallback
      Object.keys(memoryStorage).forEach(key => {
        delete memoryStorage[key];
      });
    }
  }

  /**
   * Update a specific field in a stored object
   * @param key Storage key
   * @param field Field to update
   * @param value New value
   */
  async updateField<T>(key: string, field: keyof T, value: any): Promise<void> {
    await this.initializationPromise;
    
    try {
      const data = await this.loadData<T>(key);
      if (data) {
        data[field] = value;
        await this.saveData(key, data);
      }
    } catch (error) {
      console.error('Error updating field:', error);
    }
  }

  /**
   * Check if data exists for a specific key
   * @param key Storage key
   * @returns Boolean indicating if data exists
   */
  async hasData(key: string): Promise<boolean> {
    await this.initializationPromise;
    
    try {
      if (this.isAsyncStorageAvailable) {
        const value = await AsyncStorage.getItem(key);
        return value != null;
      }
      return key in memoryStorage;
    } catch (error) {
      console.error('Error checking data:', error);
      return key in memoryStorage;
    }
  }
}

export { StorageService, STORAGE_KEYS }; 