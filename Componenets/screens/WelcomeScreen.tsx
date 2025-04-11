import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importing a simple SVG component for glasses
const GlassesIcon = () => (
  <View style={styles.glassesContainer}>
    <View style={styles.glasses}>
      <View style={styles.lens}></View>
      <View style={styles.lens}></View>
    </View>
  </View>
);

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GlassesIcon />
        
        <Text style={styles.title}>Welcome to EyeCare Pro!</Text>
        
        <Text style={styles.subtitle}>
          Improve your eye health with simple exercises and keep your vision sharp.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBCF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  glassesContainer: {
    marginBottom: 60,
  },
  glasses: {
    width: 150,
    height: 60,
    borderWidth: 5,
    borderColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  lens: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#1A0F0F',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 100,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 