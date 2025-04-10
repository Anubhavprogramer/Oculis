import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icons
const PlayIcon = () => (
  <View style={styles.playIcon}>
    <View style={styles.triangle} />
  </View>
);

const EyeIcon = () => (
  <View style={styles.eyeIcon}>
    <View style={styles.eyeOuter} />
  </View>
);

const ClockIcon = () => (
  <View style={styles.clockIcon}>
    <View style={styles.clockInner} />
    <View style={styles.clockHand} />
  </View>
);

const MainScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleStartFullExercise = () => {
    navigation.navigate('ExerciseIntro');
  };

  const handleStartBlinking = () => {
    navigation.navigate('BlinkExercise');
  };

  const handleStartEyeRotation = () => {
    navigation.navigate('EyeRotation');
  };
  
  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oculis</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Track Your Work Card */}
      <View style={styles.trackCard}>
        <Text style={styles.cardTitle}>Track Your Work</Text>
        <View style={styles.timerContainer}>
          <View style={styles.timer}>
            <Text style={styles.timerText}>30 : 0</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playButton}>
          <PlayIcon />
        </TouchableOpacity>
      </View>

      {/* Health Score Card */}
      <View style={styles.healthCard}>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>0</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.healthTitle}>Health Score</Text>
            <Text style={styles.healthStatus}>Poor! Take care of your eyes ASAP.</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <EyeIcon />
                <Text style={styles.statLabel}>Blink Gap</Text>
                <Text style={styles.statValue}>2 sec</Text>
              </View>
              
              <View style={styles.statItem}>
                <ClockIcon />
                <Text style={styles.statLabel}>App Time</Text>
                <Text style={styles.statValue}>0 hrs</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Exercise Options */}
      <View style={styles.exerciseGrid}>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>Full Exercise</Text>
          <Text style={styles.exerciseProgress}>1/5</Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartFullExercise}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseOptionsColumn}>
          <TouchableOpacity 
            style={styles.exerciseOption}
            onPress={handleStartEyeRotation}
          >
            <Text style={styles.optionText}>Eye Rotation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exerciseOption}
            onPress={handleStartBlinking}
          >
            <View style={styles.optionContent}>
              <EyeIcon />
              <Text style={styles.optionText}>Blinking</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBCF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 24,
  },
  trackCard: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  timer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
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
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{ rotate: '90deg' }],
  },
  healthCard: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  healthStatus: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  eyeIcon: {
    marginBottom: 5,
  },
  eyeOuter: {
    width: 24,
    height: 12,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 5,
    position: 'relative',
  },
  clockInner: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#000',
    top: 2,
    left: 7,
  },
  clockHand: {
    position: 'absolute',
    width: 6,
    height: 2,
    backgroundColor: '#000',
    top: 7,
    left: 2,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    marginRight: 10,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseProgress: {
    fontSize: 24,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseOptionsColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  exerciseOption: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '48%',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default MainScreen; 