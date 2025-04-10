# Oculis - Eye Care Application

Oculis is a mobile application designed to help users maintain good eye health by providing guided eye exercises, tracking eye health metrics, and encouraging healthy screen time habits.

## Features

### 1. Eye Exercises
- **Eye Rotation**: Guided exercises for strengthening eye muscles
- **Blinking Exercises**: Timed exercises to prevent dry eyes
- **Full Exercise Routine**: Complete set of eye exercises in sequence

### 2. Health Tracking
- **Eye Health Score**: Monitor your overall eye health 
- **Blink Gap**: Track how often you blink when using screens
- **App Usage Time**: Monitor your daily screen time

### 3. Customizable Settings
- **Work Time Settings**: Customize work periods between breaks
- **Exercise Duration**: Adjust duration of each exercise type
- **Exercise Cycles**: Set the number of exercise cycles

## Getting Started

### Prerequisites
- Node.js 
- npm or yarn
- React Native development environment

### Installation

1. Clone the repository:
```
git clone [repository-url]
```

2. Install dependencies:
```
cd Oculis
npm install
```

3. For iOS, install pods:
```
cd ios && pod install && cd ..
```

### Running the App

For iOS:
```
npm run ios
```

For Android:
```
npm run android
```

## Project Structure

```
/Componenets
  /screens        # Main application screens
  /Cards          # Reusable card components
  /navigation     # Navigation configuration
  /context        # App state management
```

## Technologies Used

- React Native
- TypeScript
- React Navigation
- React Native SVG (for eye tracking exercises)

## Future Enhancements

- Notification reminders for taking eye breaks
- Statistics dashboard with charts
- User profiles to track multiple users
- Eye exercise history and progress tracking
- Integration with health apps

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons and graphics designed specifically for Oculis
- Eye exercise techniques based on vision therapy practices
