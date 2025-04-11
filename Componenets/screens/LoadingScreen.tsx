import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';

// Custom loading animation component
const GlassesIcon = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.glassesContainer, { opacity: fadeAnim }]}>
      <View style={styles.glasses}>
        <View style={styles.lens}></View>
        <View style={styles.bridge}></View>
        <View style={styles.lens}></View>
      </View>
      <View style={styles.temples}>
        <View style={styles.temple}></View>
        <View style={styles.temple}></View>
      </View>
    </Animated.View>
  );
};

const LoadingScreen = ({ message = "Loading app data..." }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 10000, // 10 seconds
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loadingBox}>
        <GlassesIcon />
        
        <Text style={styles.title}>EyeCare Pro</Text>
        <Text style={styles.loadingText}>{message}</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width: progressWidth }
            ]} 
          />
        </View>
        
        <Text style={styles.loadingSubText}>This may take a moment on first launch</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    width: '90%',
    maxWidth: 360,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  loadingSubText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  progressContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 10,
  },
  // Glasses icon styles
  glassesContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  glasses: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lens: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#4285F4',
    margin: 5,
  },
  bridge: {
    width: 15,
    height: 4,
    backgroundColor: '#4285F4',
  },
  temples: {
    flexDirection: 'row',
    width: 90,
    justifyContent: 'space-between',
    marginTop: 2,
  },
  temple: {
    width: 24,
    height: 4,
    backgroundColor: '#4285F4',
  },
});

export default LoadingScreen; 