import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Moneda principal</Text>
        <Text style={styles.headerSub}>Selecciona tu moneda de referencia</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.explanation}>
          La moneda principal se usa para mostrar el total ahorrado en el dashboard. Puedes tener ahorros en múltiples monedas.
        </Text>

        <View style={styles.currencyList}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c.code}
              style={({ pressed }) => [
                styles.currencyRow,
                selected === c.code && styles.currencyRowSelected,
                pressed && styles.currencyRowPressed,
              ]}
              onPress={() => setSelected(c.code)}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <View style={styles.currencyInfo}>
                <Text style={[styles.currencyName, selected === c.code && styles.currencyNameSelected]}>
                  {c.name}
                </Text>
                <Text style={styles.currencyCode}>{c.code} · {c.symbol}</Text>
              </View>
              {selected === c.code && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.noteText}>
            Puedes agregar ahorros en cualquier moneda independientemente de tu moneda principal.
          </Text>
        </View>

        <Button
          label="Guardar moneda"
          variant="primary"
          loading={saving}
          onPress={handleSave}
          style={styles.saveBtn}
          disabled={selected === user?.main_currency}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 28, paddingHorizontal: Spacing.screenHorizontal, gap: 4 },
  backBtn: { marginBottom: Spacing[3] },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize.xl, color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  explanation: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textMedium, lineHeight: FontSize.base * 1.5, marginBottom: Spacing[5] },
  currencyList: { backgroundColor: Colors.white, borderRadius: BorderRadius.card, overflow: 'hidden', ...Shadows.sm, marginBottom: Spacing[4] },
  currencyRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing[4], gap: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.divider },
  currencyRowSelected: { backgroundColor: Colors.primarySoft },
  currencyRowPressed: { backgroundColor: Colors.backgroundMain },
  flag: { fontSize: 28 },
  currencyInfo: { flex: 1 },
  currencyName: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.base, color: Colors.textDark },
  currencyNameSelected: { color: Colors.primary, fontFamily: FontFamily.dmSansSemiBold },
  currencyCode: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  checkmark: {},
  note: { flexDirection: 'row', gap: Spacing[2], backgroundColor: Colors.primarySoft, borderRadius: BorderRadius.md, padding: Spacing[4], borderWidth: 1, borderColor: Colors.primaryLight, marginBottom: Spacing[4] },
  noteText: { flex: 1, fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.primaryDeep, lineHeight: FontSize.sm * 1.5 },
  saveBtn: {},
});
