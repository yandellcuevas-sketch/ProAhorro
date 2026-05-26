import 'react-native-reanimated';
import React, { useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RootNavigator } from './frontend/src/navigation/RootNavigator';

// Mantener splash nativo visible hasta que carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'DMSans-Regular': require('./frontend/src/assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('./frontend/src/assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('./frontend/src/assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('./frontend/src/assets/fonts/DMSans-Bold.ttf'),
    'Sora-Regular': require('./frontend/src/assets/fonts/Sora-Regular.ttf'),
    'Sora-SemiBold': require('./frontend/src/assets/fonts/Sora-SemiBold.ttf'),
    'Sora-Bold': require('./frontend/src/assets/fonts/Sora-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
