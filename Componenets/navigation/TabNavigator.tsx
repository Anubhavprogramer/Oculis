import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icons
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    <View style={styles.homeIcon}>
      <View style={styles.homeRoof} />
      <View style={styles.homeBase} />
    </View>
  </View>
);

const AnalyticsIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    <View style={styles.analyticsIcon}>
      <View style={[styles.analyticsBar, { height: 10 }]} />
      <View style={[styles.analyticsBar, { height: 16 }]} />
      <View style={[styles.analyticsBar, { height: 22 }]} />
    </View>
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    <View style={styles.profileIcon}>
      <View style={styles.profileHead} />
      <View style={styles.profileBody} />
    </View>
  </View>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{
          tabBarIcon: ({ focused }) => <AnalyticsIcon focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#E8ECC5',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 5,
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  // Home icon
  homeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    position: 'absolute',
    top: -2,
  },
  homeBase: {
    width: 16,
    height: 12,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  // Analytics icon
  analyticsIcon: {
    width: 20,
    height: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  analyticsBar: {
    width: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
  },
  // Profile icon
  profileIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  profileHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  profileBody: {
    width: 20,
    height: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#000',
    marginTop: -2,
  },
});

export default TabNavigator; 