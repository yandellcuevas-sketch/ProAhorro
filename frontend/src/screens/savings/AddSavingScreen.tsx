import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';

type Method     = 'cash' | 'transfer' | 'card' | 'other';
type Destination = 'free' | 'goal' | 'split' | 'new';
type Currency   = 'DOP' | 'USD' | 'EUR';

const METHODS: { key: Method; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
  { key: 'cash',     icon: 'cash',               label: 'Efectivo'      },
  { key: 'transfer', icon: 'bank-transfer',       label: 'Transferencia' },
  { key: 'card',     icon: 'credit-card-outline', label: 'Tarjeta'       },
  { key: 'other',    icon: 'dots-horizontal',     label: 'Otro'          },
];

const CURRENCIES: { key: Currency; symbol: string }[] = [
  { key: 'DOP', symbol: 'RD$' },
  { key: 'USD', symbol: 'US$' },
  { key: 'EUR', symbol: '€'   },
];

const DESTINATIONS: { key: Destination; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; desc: string }[] = [
  { key: 'free',  icon: 'piggy-bank-outline',  label: 'Ahorro libre', desc: 'Sin meta asignada'     },
  { key: 'goal',  icon: 'bullseye-arrow',       label: 'Una meta',     desc: 'Asignar a una meta'    },
  { key: 'split', icon: 'arrow-split-vertical', label: 'Repartir',     desc: 'Entre varias metas'    },
  { key: 'new',   icon: 'flag-outline',         label: 'Nueva meta',   desc: 'Crear y asignar ahora' },
];

const AddSavingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [amount, setAmount]                 = useState('');
  const [currency, setCurrency]             = useState<Currency>('DOP');
  const [method, setMethod]                 = useState<Method>('cash');
  const [destination, setDestination]       = useState<Destination>('free');
  const [note, setNote]                     = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const currentSymbol = CURRENCIES.find(c => c.key === currency)?.symbol ?? 'RD$';

  return (
    <KeyboardAvoidingView
      style={S.Layout.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Nuevo ahorro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.Layout.scrollPad}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ─── MONTO ─── */}
          <View style={[S.Cards.amountInput, { marginBottom: Theme.space.lg }]}>
            <Text style={[S.Typography.label, { color: Theme.color.primaryDark, marginBottom: Theme.space.sm }]}>
              ¿Cuánto ahorraste hoy?
            </Text>
            <View style={[S.Layout.row, { gap: 8 }]}>
              <Text style={S.Forms.amountSymbol}>{currentSymbol}</Text>
              <TextInput
                style={S.Forms.amountField}
                placeholder="0.00"
                placeholderTextColor={Theme.color.borderMid}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={S.Forms.amountCurrencyPill}
                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
                activeOpacity={0.7}
              >
                <Text style={S.Forms.amountCurrencyPillText}>{currency}</Text>
                <MaterialCommunityIcons name="chevron-down" size={14} color={Theme.color.primary} />
              </TouchableOpacity>
            </View>

            {/* Currency picker inline */}
            {showCurrencyPicker && (
              <View style={[S.Cards.listSection, { marginTop: Theme.space.sm }]}>
                {CURRENCIES.map((c, i) => (
                  <TouchableOpacity
                    key={c.key}
                    style={[
                      S.ListItems.row,
                      i < CURRENCIES.length - 1 && S.ListItems.rowBorder,
                      currency === c.key && { backgroundColor: Theme.color.primaryLighter },
                    ]}
                    onPress={() => { setCurrency(c.key); setShowCurrencyPicker(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[S.ListItems.rowLabel, currency === c.key && { color: Theme.color.primary }]}>
                      {c.symbol}  {c.key}
                    </Text>
                    {currency === c.key && (
                      <MaterialCommunityIcons name="check" size={18} color={Theme.color.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ─── MÉTODO ─── */}
          <Text style={[S.Typography.label, { marginBottom: Theme.space.sm }]}>Método</Text>
          <View style={[S.Layout.rowWrap, { marginBottom: Theme.space.lg }]}>
            {METHODS.map(m => (
              <TouchableOpacity
                key={m.key}
                style={method === m.key ? S.Chips.methodActive : S.Chips.method}
                onPress={() => setMethod(m.key)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={m.icon}
                  size={16}
                  color={method === m.key ? Theme.color.white : Theme.color.textMedium}
                />
                <Text style={method === m.key ? S.Chips.methodTextActive : S.Chips.methodText}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ─── DESTINO ─── */}
          <Text style={[S.Typography.label, { marginBottom: Theme.space.sm }]}>Destino del ahorro</Text>
          <View style={[S.DestinationPicker.grid, { marginBottom: Theme.space.lg }]}>
            {DESTINATIONS.map(d => (
              <TouchableOpacity
                key={d.key}
                style={[
                  S.DestinationPicker.option,
                  destination === d.key && S.DestinationPicker.optionActive,
                ]}
                onPress={() => setDestination(d.key)}
                activeOpacity={0.75}
              >
                <View style={[
                  S.DestinationPicker.iconWrap,
                  destination === d.key && S.DestinationPicker.iconWrapActive,
                ]}>
                  <MaterialCommunityIcons
                    name={d.icon}
                    size={22}
                    color={destination === d.key ? Theme.color.primary : Theme.color.textMuted}
                  />
                </View>
                <Text style={[
                  S.DestinationPicker.label,
                  destination === d.key && S.DestinationPicker.labelActive,
                ]}>
                  {d.label}
                </Text>
                <Text style={S.DestinationPicker.desc}>{d.desc}</Text>
                {destination === d.key && (
                  <View style={S.DestinationPicker.checkmark}>
                    <MaterialCommunityIcons name="check" size={11} color={Theme.color.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ─── NOTA ─── */}
          <Text style={[S.Typography.label, { marginBottom: Theme.space.sm }]}>
            Nota{' '}
            <Text style={[S.Typography.muted, { fontFamily: Theme.font.dmSansRegular }]}>(opcional)</Text>
          </Text>
          <View style={[S.Forms.textareaWrap, { marginBottom: Theme.space.xl }]}>
            <MaterialCommunityIcons name="pencil-outline" size={16} color={Theme.color.textPlaceholder} style={{ marginTop: 2 }} />
            <TextInput
              style={S.Forms.textarea}
              placeholder="Ej: Sueldo de mayo, vuelto del mercado..."
              placeholderTextColor={Theme.color.textPlaceholder}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* ─── GUARDAR ─── */}
          <TouchableOpacity style={S.Buttons.primaryLg} activeOpacity={0.85}>
            <MaterialCommunityIcons name="check-circle-outline" size={20} color={Theme.color.white} />
            <Text style={S.Buttons.primaryText}>Guardar ahorro</Text>
          </TouchableOpacity>

          <View style={{ height: Theme.space.xl }} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddSavingScreen;
