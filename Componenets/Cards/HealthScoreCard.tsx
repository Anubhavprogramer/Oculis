import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Icons
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

interface HealthScoreCardProps {
  score: number;
  status: string;
  blinkGap: string;
  appTime: string;
  backgroundColor?: string;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  score,
  status,
  blinkGap,
  appTime,
  backgroundColor = '#E8ECC5'
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.container}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        
        <View style={styles.scoreInfo}>
          <Text style={styles.title}>Health Score</Text>
          <Text style={styles.status}>{status}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <EyeIcon />
              <Text style={styles.statLabel}>Blink Gap</Text>
              <Text style={styles.statValue}>{blinkGap}</Text>
            </View>
            
            <View style={styles.statItem}>
              <ClockIcon />
              <Text style={styles.statLabel}>App Time</Text>
              <Text style={styles.statValue}>{appTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  container: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
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
});

export default HealthScoreCard; 