import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';

const EyeRollingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);
  const [timerValue, setTimerValue] = useState(60); // 1 minute in seconds
  const [currentDirection, setCurrentDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [repetitions, setRepetitions] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const circleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };

  // Toggle active state
  const toggleActive = () => {
    if (isCompleted) {
      resetExercise();
      return;
    }
    setIsActive(!isActive);
  };

  // Reset exercise
  const resetExercise = () => {
    setIsActive(false);
    setTimerValue(60);
    setRepetitions(0);
    setCurrentDirection('clockwise');
    setIsCompleted(false);
    circleAnimation.setValue(0);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue((prev) => prev - 1);
      }, 1000);
    } else if (timerValue === 0) {
      setIsActive(false);
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timerValue]);

  // Circle animation effect
  useEffect(() => {
    if (isActive) {
      // Start animation
      Animated.loop(
        Animated.timing(circleAnimation, {
          toValue: 1,
          duration: 3000, // 3 seconds per rotation
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Change direction every 5 repetitions
      const interval = setInterval(() => {
        setRepetitions((prev) => {
          const newCount = prev + 1;
          if (newCount % 5 === 0) {
            setCurrentDirection((prevDir) =>
              prevDir === 'clockwise' ? 'counterclockwise' : 'clockwise'
            );
          }
          return newCount;
        });
      }, 3000); // Every complete rotation

      return () => {
        clearInterval(interval);
        circleAnimation.stopAnimation();
      };
    }
  }, [isActive, circleAnimation]);

  // Pulse effect for eye icon
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnimation, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      opacityAnimation.setValue(1);
    }

    return () => {
      opacityAnimation.stopAnimation();
    };
  }, [isActive, opacityAnimation]);

  // Calculate path positions for the circular motion
  const translateX = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, currentDirection === 'clockwise' ? 360 : -360],
  });

  // Get coordinates from angle
  const getCoordinates = (angle: number, radius: number) => {
    // Convert angle from degrees to radians
    const radians = (angle * Math.PI) / 180;
    
    // Calculate x and y coordinates on the circle
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    
    return { x, y };
  };

  // Get formatted time string
  const getTimeString = () => {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eye Rolling Exercise</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{getTimeString()}</Text>
          <Text style={styles.direction}>
            Direction: {currentDirection === 'clockwise' ? 'Clockwise' : 'Counterclockwise'}
          </Text>
          <Text style={styles.repetitions}>Repetitions: {repetitions}</Text>
        </View>

        <View style={styles.exerciseContainer}>
          <Svg height={300} width="100%" viewBox="-150 -150 300 300">
            {/* Circular path for eye to follow */}
            <Circle
              cx="0"
              cy="0"
              r="100"
              stroke="#C0E5C8"
              strokeWidth="4"
              fill="none"
              strokeDasharray="5,5"
            />

            {/* Animated Dot that moves along the path */}
            <G
              x="0"
              y="0"
              rotation={translateX}
              origin="0, 0"
            >
              <Circle
                cx="100"
                cy="0"
                r="12"
                fill="#4CAF50"
              />
            </G>
          </Svg>

          {/* Eye representation */}
          <Animated.View
            style={[
              styles.eyeContainer,
              {
                opacity: opacityAnimation,
              },
            ]}
          >
            <View style={styles.eye}>
              <View style={styles.pupil} />
            </View>
          </Animated.View>

          <Text style={styles.instruction}>
            {isActive
              ? "Follow the green dot with your eyes without moving your head"
              : isCompleted
              ? "Exercise completed! Great job!"
              : "Tap Start to begin the exercise"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isActive ? styles.pauseButton : styles.startButton,
            isCompleted ? styles.resetButton : null,
          ]}
          onPress={toggleActive}
        >
          <Text style={styles.actionButtonText}>
            {isActive ? "Pause" : isCompleted ? "Reset" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  direction: {
    fontSize: 18,
    marginTop: 8,
    color: '#555',
  },
  repetitions: {
    fontSize: 16,
    marginTop: 4,
    color: '#555',
  },
  exerciseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  eyeContainer: {
    position: 'absolute',
  },
  eye: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pupil: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 30,
    color: '#555',
  },
  actionButton: {
    alignSelf: 'center',
    width: 200,
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFA000',
  },
  resetButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EyeRollingScreen; 