/**
 * Oculis - Main App Entry Point
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './Componenets/navigation/AppNavigator';
import { SettingsProvider } from './Componenets/context/SettingsContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;