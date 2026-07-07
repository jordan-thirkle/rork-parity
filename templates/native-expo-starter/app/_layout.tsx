import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GameScene from './GameScene';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GameScene />
    </SafeAreaProvider>
  );
}
