import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';
import { S, Theme } from '../../theme/style';
import { ONBOARDING_SLIDES, STORAGE_KEYS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

// ─── Dot nativo (sin reanimated) ────────────────────────────
const DotIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const widthAnim = useRef(new Animated.Value(isActive ? 24 : 8)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isActive ? 24 : 8,
        friction: 8,
        tension: 50,
        useNativeDriver: false, // width no soporta nativeDriver
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.4,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      style={{
        height: 8,
        width: widthAnim,
        borderRadius: 4,
        backgroundColor: Theme.color.white,
        opacity: opacityAnim,
      }}
    />
  );
};

// ─── Pantalla principal ──────────────────────────────────────
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const markDone = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    onFinish();
  };

  const goNext = () => {
    const next = currentIndex + 1;
    if (next >= ONBOARDING_SLIDES.length) {
      markDone();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: Theme.color.primaryDarker }}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />

      {/* Botón saltar */}
      <Pressable
        style={{
          position: 'absolute',
          top: 60,
          right: Theme.space.md,
          zIndex: 10,
          padding: Theme.space.sm,
        }}
        onPress={markDone}
      >
        <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.75)' }]}>
          Saltar
        </Text>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item: any) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(idx);
        }}
        renderItem={({ item }: any) => (
          <LinearGradient
            colors={[Theme.color.primaryDarker, Theme.color.primaryDark, '#0D6B3D']}
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: Theme.space.xl,
              gap: Theme.space.lg,
              paddingTop: 80,
            }}
          >
            {/* Ícono circular */}
            <View style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Theme.space.md,
            }}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={80}
                color={Theme.color.white}
              />
            </View>

            <Text style={[S.Typography.displayMd, {
              color: Theme.color.white,
              textAlign: 'center',
              lineHeight: 36,
            }]}>
              {item.title}
            </Text>

            <Text style={[S.Typography.bodyLg, {
              color: 'rgba(255,255,255,0.75)',
              textAlign: 'center',
              lineHeight: 26,
            }]}>
              {item.subtitle}
            </Text>
          </LinearGradient>
        )}
      />

      {/* Controles inferiores */}
      <View style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        paddingHorizontal: Theme.space.md,
        gap: Theme.space.lg,
      }}>
        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {ONBOARDING_SLIDES.map((_: any, i: number) => (
            <DotIndicator key={i} isActive={i === currentIndex} />
          ))}
        </View>

        <Button
          label={isLast ? 'Empezar' : 'Siguiente'}
          variant="primary"
          onPress={goNext}
          iconRight={isLast ? 'check-circle-outline' : 'arrow-right'}
        />
      </View>
    </View>
  );
};
