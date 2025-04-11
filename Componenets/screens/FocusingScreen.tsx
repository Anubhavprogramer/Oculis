import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FocusingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);
  const [timerValue, setTimerValue] = useState(60); // 1 minute in seconds
  const [focusDistance, setFocusDistance] = useState<'near' | 'far'>('far');
  const [cycleCount, setCycleCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const nearObjectScale = useRef(new Animated.Value(0.5)).current;
  const farObjectScale = useRef(new Animated.Value(1)).current;
  const nearObjectOpacity = useRef(new Animated.Value(0.3)).current;
  const farObjectOpacity = useRef(new Animated.Value(1)).current;

  // Switch focus between near and far objects
  useEffect(() => {
    if (isActive) {
      const focusInterval = setInterval(() => {
        setFocusDistance(prev => {
          const newDistance = prev === 'near' ? 'far' : 'near';
          if (prev === 'far' && newDistance === 'near') {
            // Completed one full cycle
            setCycleCount(prevCount => prevCount + 1);
          }
          return newDistance;
        });
      }, 5000); // Switch every 5 seconds
      
      return () => clearInterval(focusInterval);
    }
  }, [isActive]);

  // Handle animations when focus distance changes
  useEffect(() => {
    if (focusDistance === 'near') {
      // Animate to focus on near object
      Animated.parallel([
        Animated.timing(nearObjectScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(farObjectScale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(nearObjectOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(farObjectOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate to focus on far object
      Animated.parallel([
        Animated.timing(nearObjectScale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(farObjectScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(nearObjectOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(farObjectOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focusDistance]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Check for exercise completion
  useEffect(() => {
    if (cycleCount >= 10 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
    }
  }, [cycleCount]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const toggleExercise = () => {
    if (isCompleted) {
      // Reset if completed
      setTimerValue(60);
      setCycleCount(0);
      setFocusDistance('far');
      setIsCompleted(false);
    }
    setIsActive(!isActive);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Shifting</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.exerciseContent}>
        <View style={styles.focusObjects}>
          {/* Near object (thumb) */}
          <Animated.View 
            style={[
              styles.nearObject,
              { 
                transform: [{ scale: nearObjectScale }],
                opacity: nearObjectOpacity,
              }
            ]}
          >
            <View style={styles.thumbUp} />
          </Animated.View>

          {/* Far object (letter) */}
          <Animated.View 
            style={[
              styles.farObject,
              { 
                transform: [{ scale: farObjectScale }],
                opacity: farObjectOpacity,
              }
            ]}
          >
            <Text style={styles.farObjectText}>E</Text>
          </Animated.View>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.focusTarget}>
            Now focus on: <Text style={styles.focusHighlight}>{focusDistance === 'near' ? 'NEAR OBJECT' : 'FAR OBJECT'}</Text>
          </Text>
          <Text style={styles.instructionText}>
            Shift your focus between the near and far objects when indicated
          </Text>
          <Text style={styles.cycleText}>
            Completed Cycles: {cycleCount} / 10
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timerValue)}</Text>
          <Text style={styles.timerLabel}>Remaining Time</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.controlButton,
            isActive ? styles.pauseButton : styles.playButton,
            isCompleted && styles.completedButton
          ]}
          onPress={toggleExercise}
        >
          <Text style={styles.buttonText}>
            {isCompleted ? 'Start Again' : isActive ? 'Pause' : 'Start'}
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
  exerciseContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  focusObjects: {
    height: 300,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  nearObject: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  thumbUp: {
    width: 60,
    height: 80,
    backgroundColor: '#FFC107',
    borderRadius: 15,
    position: 'relative',
    transform: [{ rotate: '0deg' }],
  },
  farObject: {
    position: 'absolute',
    backgroundColor: '#E8ECC5',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  farObjectText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  focusTarget: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  focusHighlight: {
    color: '#4CAF50',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  cycleText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  completedButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FocusingScreen; 