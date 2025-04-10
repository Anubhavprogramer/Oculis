import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Play Button Icon
const PlayIcon = () => (
  <View style={styles.playIcon}>
    <View style={styles.triangle} />
  </View>
);

interface TrackerCardProps {
  title: string;
  time: string;
  onPlayPress: () => void;
  backgroundColor?: string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({
  title,
  time,
  onPlayPress,
  backgroundColor = '#E8ECC5'
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.timerContainer}>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{time}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.playButton}
        onPress={onPlayPress}
      >
        <PlayIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
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
});

export default TrackerCard; 