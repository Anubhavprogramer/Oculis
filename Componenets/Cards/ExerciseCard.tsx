import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ExerciseCardProps {
  title: string;
  progress?: string;
  onPress: () => void;
  buttonText?: string;
  backgroundColor?: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  progress,
  onPress,
  buttonText = 'Start',
  backgroundColor = '#E8ECC5'
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      {progress && <Text style={styles.progress}>{progress}</Text>}
      
      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progress: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseCard; 