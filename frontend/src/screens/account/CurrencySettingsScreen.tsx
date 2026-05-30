import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { S, Theme } from '../../theme/style';
import { accountService } from '../../services/accountService';
import { useAuthStore } from '../../store/authStore';

const CURRENCIES = [
  { code: 'DOP', name: 'Peso dominicano', symbol: 'RD$', flag: '🇩🇴' },
  { code: 'USD', name: 'Dólar estadounidense', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£', flag: '🇬🇧' },
];

interface CurrencySettingsScreenProps {
  onBack: () => void;
}

export const CurrencySettingsScreen: React.FC<CurrencySettingsScreenProps> = ({ onBack }) => {
  const { user, refreshUser } = useAuthStore();
  const [selected, setSelected] = useState(user?.main_currency ?? 'DOP');
  const [saving, setSaving] = useState(false);

  // Animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await accountService.updateSettings({ main_currency: selected });
      await refreshUser();
      Alert.alert('Moneda actualizada', `Moneda principal: ${selected}`, [
        { text: 'OK', onPress: onBack },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={[Theme.color.primaryDarker, Theme.color.primaryDark]}
        style={{
          paddingTop: Platform.OS === 'ios' ? 52 : 40,
          paddingBottom: 28,
          paddingHorizontal: Theme.space.md,
          gap: 4,
        }}
      >
        <Pressable
          style={[
            S.Layout.backBtn,
            {
              marginBottom: Theme.space.sm,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.2)',
            },
          ]}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.color.white} />
        </Pressable>
        <Text style={[S.Typography.headingLg, { color: Theme.color.white }]}>Moneda principal</Text>
        <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.7)' }]}>
          Selecciona tu moneda de referencia
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={S.Layout.scrollPad} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], gap: Theme.space.md }}>
          <Text style={[S.Typography.bodyLg, { color: Theme.color.textMedium, lineHeight: 22, marginBottom: Theme.space.xs }]}>
            La moneda principal se usa para mostrar el total ahorrado en el dashboard. Puedes tener ahorros en múltiples monedas.
          </Text>

          {/* Lista de monedas en listSection */}
          <View style={S.Cards.listSection}>
            {CURRENCIES.map((c, i) => {
              const isSelected = selected === c.code;
              return (
                <Pressable
                  key={c.code}
                  style={({ pressed }) => [
                    S.ListItems.row,
                    i < CURRENCIES.length - 1 && S.ListItems.rowBorder,
                    isSelected && { backgroundColor: Theme.color.primaryLighter },
                    pressed && { backgroundColor: Theme.color.gray100 },
                  ]}
                  onPress={() => setSelected(c.code)}
                >
                  <Text style={{ fontSize: 28 }}>{c.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        S.ListItems.rowLabel,
                        isSelected && { color: Theme.color.primary, fontFamily: Theme.font.soraSemiBold },
                      ]}
                    >
                      {c.name}
                    </Text>
                    <Text style={S.ListItems.rowSublabel}>
                      {c.code} · {c.symbol}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialCommunityIcons name="check-circle" size={24} color={Theme.color.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Banner de información */}
          <View
            style={[
              S.Cards.base,
              {
                flexDirection: 'row',
                gap: Theme.space.sm,
                backgroundColor: Theme.color.primaryLighter,
                borderRadius: Theme.radius.md,
                padding: Theme.space.md,
                borderWidth: 1,
                borderColor: Theme.color.primaryLight,
              },
            ]}
          >
            <MaterialCommunityIcons name="information-outline" size={18} color={Theme.color.primary} />
            <Text style={[S.Typography.bodySm, { flex: 1, color: Theme.color.primaryDark, lineHeight: 18 }]}>
              Puedes agregar ahorros en cualquier moneda independientemente de tu moneda principal.
            </Text>
          </View>

          <Button
            label="Guardar moneda"
            variant="primary"
            loading={saving}
            onPress={handleSave}
            disabled={selected === user?.main_currency}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};
