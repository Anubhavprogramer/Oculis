/**
 * Oculis - Main App Entry Point
 */

// Import polyfill for crypto.getRandomValues()
import 'react-native-get-random-values';

import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider, useAppData } from './Componenets/data';
import AppNavigator from './Componenets/navigation/AppNavigator';
import { SettingsProvider } from './Componenets/context/SettingsContext';
import { View, Text, StyleSheet } from 'react-native';
import LoadingScreen from './Componenets/screens/LoadingScreen';

// Error Fallback Component
const ErrorFallback = ({ error }: { error: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Oops! Something went wrong</Text>
    <Text style={styles.message}>{error}</Text>
    <Text style={styles.instruction}>
      Please try restarting the app. If the problem persists, contact support.
    </Text>
  </View>
);

// App Content Component
const AppContent = () => {
  const { isLoading, error, isInitialized } = useAppData();

  if (isLoading) {
    return <LoadingScreen message="Loading your eye care data..." />;
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return <AppNavigator />;
};

function App(): React.JSX.Element {
  // Added state to track initialization progress
  const [appReady, setAppReady] = useState(false);

  // Add a delay if needed to ensure proper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return <LoadingScreen message="Initializing app..." />;
  }

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
  },
});

export default App;