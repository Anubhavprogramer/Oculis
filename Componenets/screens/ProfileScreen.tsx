import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>A</Text>
            </View>
          </View>
          
          <Text style={styles.userName}>Alex</Text>
          <Text style={styles.userStats}>Level 3 • Eye Care Pro</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.8</Text>
              <Text style={styles.statLabel}>Avg. Score</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, styles.achievementCompleted]}>
                <Text style={styles.achievementEmoji}>🔥</Text>
              </View>
              <Text style={styles.achievementName}>3 Day Streak</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, styles.achievementCompleted]}>
                <Text style={styles.achievementEmoji}>⭐</Text>
              </View>
              <Text style={styles.achievementName}>First Exercise</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, styles.achievementCompleted]}>
                <Text style={styles.achievementEmoji}>🏆</Text>
              </View>
              <Text style={styles.achievementName}>1 Hour Total</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>🥇</Text>
              </View>
              <Text style={styles.achievementName}>Perfect Week</Text>
            </View>
          </View>
        </View>
        
        {/* Settings Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Account Settings</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Notification Preferences</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Exercise Reminders</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Dark Mode</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Language</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>Help & Support</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleSettingsPress}>
              <Text style={styles.optionText}>About</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
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
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userStats: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementCompleted: {
    backgroundColor: '#FFD700',
  },
  achievementEmoji: {
    fontSize: 30,
  },
  achievementName: {
    fontSize: 16,
  },
  optionsList: {
    backgroundColor: '#E8ECC5',
    borderRadius: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 18,
  },
  optionArrow: {
    fontSize: 24,
    color: '#555',
  },
});

export default ProfileScreen; 