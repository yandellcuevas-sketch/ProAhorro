import React, { useEffect } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize } from '../../theme';

interface AnimatedLogoProps {
  showTagline?: boolean;
  size?: number;
  onAnimationComplete?: () => void;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  showTagline = true,
  size = 100,
  onAnimationComplete,
}) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const taglineOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  useEffect(() => {
    const easingOut = Easing.out(Easing.cubic);

    // Glow
    glowOpacity.value = withTiming(0.4, { duration: 800, easing: easingOut });

    // Logo: fade in + scale up
    logoOpacity.value = withTiming(1, { duration: 700, easing: easingOut });
    logoScale.value = withTiming(1, { duration: 700, easing: easingOut });

    // Tagline: aparece 300ms después
    taglineOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 600, easing: easingOut })
    );

    // Callback cuando termina
    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 1500);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Glow verde suave detrás del logo */}
      <Animated.View
        style={[
          styles.glow,
          { width: size * 2, height: size * 2, borderRadius: size },
          glowAnimStyle,
        ]}
      />

      {/* Logo principal */}
      <Animated.View style={[styles.logoWrapper, logoAnimStyle]}>
        <Image
          source={require('../../assets/images/imglogo.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Nombre y tagline */}
      {showTagline && (
        <Animated.View style={[styles.textContainer, taglineAnimStyle]}>
          <Text style={styles.appName}>ProAhorro</Text>
          <Text style={styles.tagline}>Ahorra con claridad</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    opacity: 0,
  },
  logoWrapper: {
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
