import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SettingsContextType {
  // Work and exercise time settings
  workTime: number;
  totalCycles: number;
  
  // Exercise settings
  eyeRotationTime: number;
  blinkingTime: number;
  blinkGap: number;
  
  // User statistics
  eyeHealthScore: number;
  appUsageTime: number;
  
  // Functions to update settings
  setWorkTime: (minutes: number) => void;
  setTotalCycles: (cycles: number) => void;
  setEyeRotationTime: (minutes: number) => void;
  setBlinkingTime: (minutes: number) => void;
  setBlinkGap: (seconds: number) => void;
  
  // Function to reset data
  resetData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Initialize state with default values
  const [workTime, setWorkTimeState] = useState(1);
  const [totalCycles, setTotalCyclesState] = useState(5);
  const [eyeRotationTime, setEyeRotationTimeState] = useState(1);
  const [blinkingTime, setBlinkingTimeState] = useState(1);
  const [blinkGap, setBlinkGapState] = useState(2);
  const [eyeHealthScore, setEyeHealthScore] = useState(0);
  const [appUsageTime, setAppUsageTime] = useState(0);

  // Wrapper functions to perform additional logic if needed
  const setWorkTime = (minutes: number) => {
    setWorkTimeState(minutes);
    // You could add additional logic here like saving to async storage
  };

  const setTotalCycles = (cycles: number) => {
    setTotalCyclesState(cycles);
  };

  const setEyeRotationTime = (minutes: number) => {
    setEyeRotationTimeState(minutes);
  };

  const setBlinkingTime = (minutes: number) => {
    setBlinkingTimeState(minutes);
  };

  const setBlinkGap = (seconds: number) => {
    setBlinkGapState(seconds);
  };

  const resetData = () => {
    // Reset all user statistics
    setEyeHealthScore(0);
    setAppUsageTime(0);
    
    // You could also reset all settings to default values
    // setWorkTimeState(1);
    // setTotalCyclesState(5);
    // etc.
  };

  const value = {
    workTime,
    totalCycles,
    eyeRotationTime,
    blinkingTime,
    blinkGap,
    eyeHealthScore,
    appUsageTime,
    setWorkTime,
    setTotalCycles,
    setEyeRotationTime,
    setBlinkingTime,
    setBlinkGap,
    resetData,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext; 