import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // States for settings values
  const [workTime, setWorkTime] = useState(1); // in minutes
  const [totalCycles, setTotalCycles] = useState(5);
  const [eyeRotationTime, setEyeRotationTime] = useState(1); // in minutes
  const [blinkingTime, setBlinkingTime] = useState(1); // in minutes
  const [blinkGap, setBlinkGap] = useState(2); // in seconds
  
  // Mock statistics
  const eyeHealthScore = 0;
  const todayAppUsage = '0 sec';

  const handleResetData = () => {
    // Reset all user data
    console.log('Resetting user data');
    // Here you would implement actual data reset functionality
  };

  const handleWorkTimeSelect = (minutes: number) => {
    setWorkTime(minutes);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const increaseCycles = () => {
    setTotalCycles(prev => prev + 1);
  };

  const decreaseCycles = () => {
    if (totalCycles > 1) {
      setTotalCycles(prev => prev - 1);
    }
  };

  const increaseEyeRotationTime = () => {
    setEyeRotationTime(prev => prev + 1);
  };

  const decreaseEyeRotationTime = () => {
    if (eyeRotationTime > 1) {
      setEyeRotationTime(prev => prev - 1);
    }
  };

  const increaseBlinkingTime = () => {
    setBlinkingTime(prev => prev + 1);
  };

  const decreaseBlinkingTime = () => {
    if (blinkingTime > 1) {
      setBlinkingTime(prev => prev - 1);
    }
  };

  const increaseBlinkGap = () => {
    setBlinkGap(prev => prev + 1);
  };

  const decreaseBlinkGap = () => {
    if (blinkGap > 1) {
      setBlinkGap(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.emptySpace} />
        </View>

        {/* WORK & EXERCISE TIME SECTION */}
        <Text style={styles.sectionTitle}>WORK & EXERCISE TIME</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Work Time</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.option, workTime === 1 && styles.optionSelected]}
              onPress={() => handleWorkTimeSelect(1)}
            >
              <Text style={[styles.optionText, workTime === 1 && styles.optionTextSelected]}>1 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.option, workTime === 2 && styles.optionSelected]}
              onPress={() => handleWorkTimeSelect(2)}
            >
              <Text style={[styles.optionText, workTime === 2 && styles.optionTextSelected]}>2 min</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.cardSubtitle}>Total Exercise Cycles</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Total Cycles</Text>
            <View style={styles.valueWithArrows}>
              <Text style={styles.settingValue}>{totalCycles} Cycles</Text>
              <TouchableOpacity onPress={decreaseCycles}>
                <Text style={[styles.arrow, styles.arrowDown]}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increaseCycles}>
                <Text style={[styles.arrow, styles.arrowUp]}>▲</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* USER STATISTICS SECTION */}
        <Text style={styles.sectionTitle}>USER STATISTICS</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Eye Health Score:</Text>
            <Text style={styles.statValue}>{eyeHealthScore}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Today's App Usage:</Text>
            <Text style={styles.statValue}>{todayAppUsage}</Text>
          </View>
        </View>

        {/* EXERCISE SETTINGS SECTION */}
        <Text style={styles.sectionTitle}>EXERCISE SETTINGS</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Eye Rotation</Text>
            <View style={styles.valueWithArrows}>
              <Text style={styles.settingValue}>{eyeRotationTime} min</Text>
              <TouchableOpacity onPress={decreaseEyeRotationTime}>
                <Text style={[styles.arrow, styles.arrowDown]}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increaseEyeRotationTime}>
                <Text style={[styles.arrow, styles.arrowUp]}>▲</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Blinking Time</Text>
            <View style={styles.valueWithArrows}>
              <Text style={styles.settingValue}>{blinkingTime} min</Text>
              <TouchableOpacity onPress={decreaseBlinkingTime}>
                <Text style={[styles.arrow, styles.arrowDown]}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increaseBlinkingTime}>
                <Text style={[styles.arrow, styles.arrowUp]}>▲</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Blink Gap</Text>
            <View style={styles.valueWithArrows}>
              <Text style={styles.settingValue}>{blinkGap} sec</Text>
              <TouchableOpacity onPress={decreaseBlinkGap}>
                <Text style={[styles.arrow, styles.arrowDown]}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increaseBlinkGap}>
                <Text style={[styles.arrow, styles.arrowUp]}>▲</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RESET DATA BUTTON */}
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetData}
        >
          <Text style={styles.resetButtonText}>Reset Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#E8E8E8',
  },
  optionText: {
    fontSize: 18,
    color: '#999',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  valueWithArrows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9E8964',
    marginRight: 10,
  },
  arrow: {
    fontSize: 14,
    marginLeft: 5,
    color: '#9E8964',
  },
  arrowUp: {
    marginBottom: 2,
  },
  arrowDown: {
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    width: 70,
  },
  backButtonText: {
    fontSize: 16,
    color: '#9E8964',
  },
  emptySpace: {
    width: 70,
  },
});

export default SettingsScreen; 