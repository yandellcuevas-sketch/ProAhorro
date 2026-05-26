import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import { ONBOARDING_SLIDES, STORAGE_KEYS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      currentIndex.value = Math.round(event.contentOffset.x / SCREEN_WIDTH);
    },
  });

  const markDone = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    onFinish();
  };

  const goNext = () => {
    const next = Math.round(scrollX.value / SCREEN_WIDTH) + 1;
    if (next >= ONBOARDING_SLIDES.length) {
      markDone();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const isLast = () =>
    Math.round(scrollX.value / SCREEN_WIDTH) === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Skip */}
      <Pressable style={styles.skipBtn} onPress={markDone}>
        <Text style={styles.skipText}>Saltar</Text>
      </Pressable>

      <AnimatedFlatList
        ref={flatListRef as any}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item: any) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }: any) => (
          <LinearGradient
            colors={[Colors.primaryDeep, Colors.primaryDark, '#0D6B3D']}
            style={styles.slide}
          >
            <View style={styles.slideIconContainer}>
              <Ionicons name={item.icon as any} size={80} color={Colors.white} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </LinearGradient>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <DotIndicator key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        <Button
          label={isLast() ? 'Empezar' : 'Siguiente'}
          variant="primary"
          onPress={goNext}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
};

const DotIndicator: React.FC<{ index: number; scrollX: Animated.SharedValue<number> }> = ({
  index,
  scrollX,
}) => {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const width = interpolate(scrollX.value, inputRange, [8, 24, 8], 'clamp');
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], 'clamp');
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primaryDeep },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: Spacing.screenHorizontal,
    zIndex: 10,
    padding: Spacing[2],
  },
  skipText: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.7)',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[5],
    paddingTop: 80,
  },
  slideIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  slideTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
    textAlign: 'center',
    lineHeight: FontSize['2xl'] * 1.3,
  },
  slideSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
  },
  controls: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing[5],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  nextBtn: {},
});
