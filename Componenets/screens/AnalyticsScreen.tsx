import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const AnalyticsScreen: React.FC = () => {
  // Sample data for weekly activity
  const weeklyData = [
    { day: 'Mon', minutes: 15 },
    { day: 'Tue', minutes: 25 },
    { day: 'Wed', minutes: 10 },
    { day: 'Thu', minutes: 30 },
    { day: 'Fri', minutes: 20 },
    { day: 'Sat', minutes: 35 },
    { day: 'Sun', minutes: 25 },
  ];

  // Max minutes value for scaling bars
  const maxMinutes = Math.max(...weeklyData.map(item => item.minutes));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headerTitle}>Your Progress</Text>
        
        {/* Weekly Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Activity</Text>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((data, index) => (
              <View key={index} style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: (data.minutes / maxMinutes) * 150 }
                  ]}
                />
                <Text style={styles.barLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Stats Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2h 15m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.8</Text>
              <Text style={styles.statLabel}>Days Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>75%</Text>
              <Text style={styles.statLabel}>Goal Reached</Text>
            </View>
          </View>
        </View>
        
        {/* Exercise Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exercise Breakdown</Text>
          
          <View style={styles.exerciseList}>
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseLeftSection}>
                <View style={[styles.exerciseIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.exerciseName}>Eye Rolling</Text>
              </View>
              <Text style={styles.exerciseTime}>35 min</Text>
            </View>
            
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseLeftSection}>
                <View style={[styles.exerciseIndicator, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.exerciseName}>Blinking</Text>
              </View>
              <Text style={styles.exerciseTime}>45 min</Text>
            </View>
            
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseLeftSection}>
                <View style={[styles.exerciseIndicator, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.exerciseName}>Focusing</Text>
              </View>
              <Text style={styles.exerciseTime}>25 min</Text>
            </View>
            
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseLeftSection}>
                <View style={[styles.exerciseIndicator, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.exerciseName}>Other</Text>
              </View>
              <Text style={styles.exerciseTime}>30 min</Text>
            </View>
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
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 10,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 35,
  },
  bar: {
    width: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  barLabel: {
    marginTop: 10,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#555',
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  exerciseLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
  },
  exerciseTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AnalyticsScreen; 