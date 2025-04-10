import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import ExerciseIntro from '../screens/ExerciseIntro';
import BlinkExercise from '../screens/BlinkExercise';
import EyeRotation from '../screens/EyeRotation';
import SettingsScreen from '../screens/SettingsScreen';

// Define the navigator parameter list
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  ExerciseIntro: undefined;
  BlinkExercise: undefined;
  EyeRotation: undefined;
  Settings: undefined;
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
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="ExerciseIntro" component={ExerciseIntro} />
        <Stack.Screen name="BlinkExercise" component={BlinkExercise} />
        <Stack.Screen name="EyeRotation" component={EyeRotation} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 