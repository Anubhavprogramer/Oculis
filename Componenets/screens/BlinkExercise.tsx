import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Play button icon
const PlayIcon = () => (
  <View style={styles.playIcon}>
    <View style={styles.triangle} />
  </View>
);

const BlinkExercise: React.FC = () => {
  const navigation = useNavigation();
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState(60); // 1 minute countdown
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Exercise finished
            setIsActive(false);
            navigation.goBack();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, navigation]);

  const handlePress = () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      // Increment blink counter
      setCounter(prevCounter => prevCounter + 1);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Oculis</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Blink Exercise</Text>
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.indicatorActive]} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Counter */}
        <Text style={styles.counterText}>{counter}</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatTime()}</Text>
          </View>
        </View>

        {/* Play/Blink Button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handlePress}
        >
          <PlayIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    fontSize: 16,
    color: '#9E8964',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    width: 10,
    height: 15,
    backgroundColor: '#D8C9A7',
    marginLeft: 5,
  },
  indicatorActive: {
    backgroundColor: '#9E8964',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 50,
  },
  counterText: {
    fontSize: 100,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{ rotate: '90deg' }],
  },
});

export default BlinkExercise; 