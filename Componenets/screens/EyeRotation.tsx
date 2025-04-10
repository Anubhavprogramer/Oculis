import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Play button icon
const PlayIcon = () => (
  <View style={styles.playIcon}>
    <View style={styles.triangle} />
  </View>
);

const EyeRotation: React.FC = () => {
  const navigation = useNavigation();
  const [currentPoint, setCurrentPoint] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(60); // 1 minute countdown

  // Points for the eye rotation exercise
  const points = [
    { id: 1, x: width * 0.3, y: height * 0.7, active: true },
    { id: 2, x: width * 0.5, y: height * 0.4, active: false },
    { id: 3, x: width * 0.7, y: height * 0.2, active: false },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive) {
      // Timer for countdown
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            navigation.goBack();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Interval for changing active point
      const pointInterval = setInterval(() => {
        setCurrentPoint((prev) => (prev % 3) + 1);
      }, 3000); // Change point every 3 seconds

      return () => {
        clearInterval(intervalId);
        clearInterval(pointInterval);
      };
    }

    return () => clearInterval(intervalId);
  }, [isActive, navigation]);

  const handleStartPress = () => {
    setIsActive(true);
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
        <Text style={styles.title}>Eye Rotation</Text>
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
        </View>
      </View>

      <View style={styles.content}>
        {/* SVG for exercise visualization */}
        <Svg height="100%" width="100%" style={styles.svgContainer}>
          {/* Connect the dots with lines */}
          <Line
            x1={points[0].x}
            y1={points[0].y}
            x2={points[1].x}
            y2={points[1].y}
            stroke="#4ECDC4"
            strokeWidth="2"
          />
          <Line
            x1={points[1].x}
            y1={points[1].y}
            x2={points[2].x}
            y2={points[2].y}
            stroke="#4ECDC4"
            strokeWidth="2"
          />
          
          {/* Draw the points */}
          {points.map((point) => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={20}
              fill={currentPoint === point.id ? "#4ECDC4" : "white"}
              stroke="#4ECDC4"
              strokeWidth="2"
              opacity={currentPoint === point.id ? 1 : 0.7}
            />
          ))}
        </Svg>

        {/* Timer at the bottom */}
        <View style={styles.timerContainer}>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatTime()}</Text>
          </View>
        </View>

        {/* Play/Start Button */}
        {!isActive && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleStartPress}
          >
            <PlayIcon />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timerContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  timer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  actionButton: {
    position: 'absolute',
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
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

export default EyeRotation; 