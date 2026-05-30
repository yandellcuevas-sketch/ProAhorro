import 'react-native-reanimated';
import React, { useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
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
    <GestureHandlerRootView style={styles.appWrapper} onLayout={onLayoutRootView}>
      <View style={[styles.root, Platform.OS === 'web' && styles.webContainer]}>
        <StatusBar style="light" />
        <RootNavigator />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appWrapper: { flex: 1, backgroundColor: '#E5E7EB' }, // Gris neutro de fondo web
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  webContainer: {
    maxWidth: 480,
    width: '100%',
    marginHorizontal: 'auto',
    overflow: 'hidden',
    // boxShadow no existe nativamente en StyleSheet para web sin fallar en TS, usamos shadow:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
});
