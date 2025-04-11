import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QuickExerciseScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [timerValue, setTimerValue] = useState(60); // 1 minute in seconds
  const [isActive, setIsActive] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const exerciseSteps = [
    "Focus on a distant object for 20 seconds",
    "Blink rapidly for 5 seconds",
    "Roll your eyes clockwise 5 times",
    "Roll your eyes counterclockwise 5 times",
    "Look up and down 5 times",
    "Look left and right 5 times",
  ];

  useEffect(() => {
    startPulseAnimation();
    
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue(prevTime => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            setIsActive(false);
          }
          return newTime;
        });
      }, 1000);
    } else if (timerValue === 0) {
      if (currentStep < exerciseSteps.length - 1) {
        // Move to next step
        setCurrentStep(prevStep => prevStep + 1);
        setTimerValue(60); // Reset timer for next step
      } else {
        // Exercise completed
        setIsActive(false);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timerValue, currentStep]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const progressPercentage = (currentStep / exerciseSteps.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Exercise</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {exerciseSteps.length}
        </Text>
      </View>

      <View style={styles.exerciseContent}>
        <Animated.View 
          style={[
            styles.exerciseVisual,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.visualText}>Q</Text>
        </Animated.View>

        <Text style={styles.instructionText}>
          {exerciseSteps[currentStep]}
        </Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timerValue)}</Text>
          <Text style={styles.timerLabel}>Remaining Time</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.controlButton,
            isActive ? styles.pauseButton : styles.playButton
          ]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBCF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
  },
  exerciseContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exerciseVisual: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E8ECC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  visualText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 16,
    color: '#555',
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuickExerciseScreen; 