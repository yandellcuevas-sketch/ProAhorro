import React, { useEffect, useRef } from 'react';
import { Image, View, Text, Animated } from 'react-native';
import { S, Theme } from '../../theme/style';

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
  // Reemplaza react-native-reanimated con Animated nativo (regla 4)
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      // Glow
      Animated.timing(glowOpacity, {
        toValue: 0.4,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo fade + escala
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      // Tagline — delay 300ms
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 1500);
    }
  }, []);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow verde suave */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 2,
          height: size * 2,
          borderRadius: size,
          backgroundColor: Theme.color.primary,
          opacity: glowOpacity,
        }}
      />

      {/* Logo */}
      <Animated.View style={{ zIndex: 1, opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image
          source={require('../../assets/images/imglogo.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Nombre y tagline */}
      {showTagline && (
        <Animated.View style={{ alignItems: 'center', marginTop: 20, opacity: taglineOpacity }}>
          <Text style={[S.Typography.displayMd, { color: Theme.color.white, letterSpacing: 0.5 }]}>
            ProAhorro
          </Text>
          <Text style={[S.Typography.bodyLg, { color: 'rgba(255,255,255,0.7)', marginTop: 4 }]}>
            Ahorra con claridad
          </Text>
        </Animated.View>
      )}
    </View>
  );
};
