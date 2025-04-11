import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import ExerciseIntro from '../screens/ExerciseIntro';
import BlinkExercise from '../screens/BlinkExercise';
import EyeRotation from '../screens/EyeRotation';
import SettingsScreen from '../screens/SettingsScreen';
import QuickExerciseScreen from '../screens/QuickExerciseScreen';
import EyeRollingScreen from '../screens/EyeRollingScreen';
import FocusingScreen from '../screens/FocusingScreen';
import TabNavigator from './TabNavigator';

// Define the navigator parameter list
export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  ExerciseIntro: undefined;
  BlinkExercise: undefined;
  EyeRotation: undefined;
  Settings: undefined;
  QuickExercise: undefined;
  EyeRolling: undefined;
  Focusing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFBCF' }
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ExerciseIntro" component={ExerciseIntro} />
        <Stack.Screen name="BlinkExercise" component={BlinkExercise} />
        <Stack.Screen name="EyeRotation" component={EyeRotation} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="QuickExercise" component={QuickExerciseScreen} />
        <Stack.Screen name="EyeRolling" component={EyeRollingScreen} />
        <Stack.Screen name="Focusing" component={FocusingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 