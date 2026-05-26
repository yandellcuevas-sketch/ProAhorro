import 'react-native-reanimated';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Mantener splash nativo hasta que carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'DMSans-Regular': require('../src/assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../src/assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../src/assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('../src/assets/fonts/DMSans-Bold.ttf'),
    'Sora-Regular': require('../src/assets/fonts/Sora-Regular.ttf'),
    'Sora-SemiBold': require('../src/assets/fonts/Sora-SemiBold.ttf'),
    'Sora-Bold': require('../src/assets/fonts/Sora-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
