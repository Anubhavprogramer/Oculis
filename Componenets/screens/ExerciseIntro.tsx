import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ExerciseIntro: React.FC = () => {
  const navigation = useNavigation();

  const handleStartExercise = () => {
    navigation.navigate('BlinkExercise');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Oculis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Circle placeholder for exercise icon/animation */}
        <View style={styles.circleIcon}>
          {/* This could be replaced with a proper icon or animation */}
        </View>
        
        <Text style={styles.timerText}>1:00</Text>
        <Text style={styles.timerLabel}>Time Left</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartExercise}
        >
          <Text style={styles.startButtonText}>Start Exercise</Text>
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
    padding: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#9E8964',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circleIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    marginBottom: 80,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timerLabel: {
    fontSize: 18,
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ExerciseIntro; 