import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
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

const HomeScreen: React.FC = () => {
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

  // Exercise data
  const exercises = [
    { id: 'quick', title: 'Quick', duration: '1 min', difficulty: 'Easy', color: '#E8ECC5' },
    { id: 'relaxation', title: 'Relaxation', duration: '2 min', difficulty: 'Medium', color: '#E8ECC5' },
    { id: 'strength', title: 'Strength', duration: '3 min', difficulty: 'Medium', color: '#E8ECC5' },
    { id: 'eyeRolling', title: 'Eye Rolling', duration: '1 min', difficulty: 'Easy', color: '#E8ECC5' },
    { id: 'eyeMovement', title: 'Eye Movement', duration: '2 min', difficulty: 'Medium', color: '#E8ECC5' },
    { id: 'focusing', title: 'Focusing', duration: '1 min', difficulty: 'Easy', color: '#E8ECC5' },
    { id: 'figureEight', title: 'Figure Eight', duration: '2 min', difficulty: 'Medium', color: '#E8ECC5' },
    { id: 'blinkPractice', title: 'Blink Practice', duration: '1 min', difficulty: 'Easy', color: '#E8ECC5' },
    { id: 'eyeYoga', title: 'Eye Yoga', duration: '3 min', difficulty: 'Hard', color: '#E8ECC5' },
    { id: 'pencilPushups', title: 'Pencil Pushups', duration: '2 min', difficulty: 'Medium', color: '#E8ECC5' },
    { id: 'darkAdaptation', title: 'Dark Adaptation', duration: '1 min', difficulty: 'Easy', color: '#E8ECC5' },
  ];

  // Handler for exercise card press
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'quick':
        navigation.navigate('QuickExercise');
        break;
      case 'eyeRolling':
        navigation.navigate('EyeRolling');
        break;
      case 'focusing':
        navigation.navigate('Focusing');
        break;
      case 'blinkPractice':
        navigation.navigate('BlinkExercise');
        break;
      default:
        navigation.navigate('ExerciseIntro');
        break;
    }
  };

  const renderDifficultyTag = (difficulty: string) => {
    let backgroundColor = '#4CAF50'; // Easy - green
    if (difficulty === 'Medium') {
      backgroundColor = '#FFC107'; // Medium - yellow
    } else if (difficulty === 'Hard') {
      backgroundColor = '#F44336'; // Hard - red
    }

    return (
      <View style={[styles.difficultyTag, { backgroundColor }]}>
        <Text style={styles.difficultyText}>{difficulty}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EyeCare Pro</Text>
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
          <Text style={styles.cardTitle}>Health Score</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircleWrapper}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>78</Text>
                <Text style={styles.scorePercent}>%</Text>
              </View>
              <Text style={styles.scoreLabel}>Good</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.healthTip}>Keep it up! Your eyes are healthier than last week.</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <EyeIcon />
                  <Text style={styles.statLabel}>Blink Rate</Text>
                  <Text style={styles.statValue}>15/min</Text>
                </View>
                
                <View style={styles.statItem}>
                  <ClockIcon />
                  <Text style={styles.statLabel}>Screen Time</Text>
                  <Text style={styles.statValue}>2.5 hrs</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <View style={styles.exercisesGrid}>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                onPress={() => handleExercisePress(exercise.id)}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                    {renderDifficultyTag(exercise.difficulty)}
                  </View>
                  
                  <View style={styles.exerciseIconPlaceholder}>
                    <Text style={styles.exerciseIconText}>{exercise.title.charAt(0)}</Text>
                  </View>
                  
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => handleExercisePress(exercise.id)}
                    >
                      <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircleWrapper: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    flexDirection: 'row',
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scorePercent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4CAF50',
  },
  scoreInfo: {
    flex: 1,
  },
  healthTip: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 10,
    minWidth: 90,
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
  exercisesSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exercisesGrid: {
    flexDirection: 'column',
  },
  exerciseCard: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  exerciseCardContent: {
    padding: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseIconText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseDuration: {
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  startButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 