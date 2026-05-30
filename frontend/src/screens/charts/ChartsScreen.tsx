import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, StatusBar,
  Dimensions, ActivityIndicator, Pressable, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';
import { chartsService } from '../../services/chartsService';
import { formatAmount, monthLabel } from '../../utils/format';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Theme.space.md * 2 - 32;
const BAR_MAX_HEIGHT = 120;
const PALETTE = [Theme.color.primary, '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#14B8A6'];

interface MonthlyStat  { month: string; total: number }
interface CurrencyDist { currency: string; total: number; percentage: number }
interface GrowthPoint  { date: string; cumulative: number }

// ─── Barra mensual animada ───────────────────────────────────
const AnimatedBar: React.FC<{ value: number; maxValue: number; label: string; delay: number }> = ({
  value, maxValue, label, delay,
}) => {
  const barH    = Math.max(4, (value / maxValue) * BAR_MAX_HEIGHT);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: barH,
        duration: 700,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [barH]);

  const displayVal = value > 0
    ? formatAmount(value, 'DOP').replace('RD$', '').replace('$', '').trim()
    : '';

  return (
    <Animated.View style={{ alignItems: 'center', gap: 4, opacity: opacityAnim }}>
      <Text style={[S.Typography.caption, { fontSize: 9, textAlign: 'center' }]}>{displayVal}</Text>
      <View style={{ justifyContent: 'flex-end', height: BAR_MAX_HEIGHT }}>
        <Animated.View style={{ height: heightAnim, width: 28, borderRadius: 6, overflow: 'hidden' }}>
          <LinearGradient
            colors={[Theme.color.primary, Theme.color.primaryDark]}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
      <Text style={S.Typography.caption}>{label}</Text>
    </Animated.View>
  );
};

// ─── Item resumen ────────────────────────────────────────────
const SummaryItem: React.FC<{ icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }> = ({
  icon, label, value,
}) => (
  <View style={{
    width: '47%',
    alignItems: 'center',
    backgroundColor: Theme.color.primaryLighter,
    borderRadius: Theme.radius.md,
    padding: Theme.space.md,
    gap: Theme.space.sm,
  }}>
    <View style={S.IconWrap.lg}>
      <MaterialCommunityIcons name={icon} size={20} color={Theme.color.primary} />
    </View>
    <Text style={S.Typography.amountSm}>{value}</Text>
    <Text style={[S.Typography.caption, { textAlign: 'center' }]}>{label}</Text>
  </View>
);

// ─── Pantalla principal ──────────────────────────────────────
export const ChartsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [monthly, setMonthly]       = useState<MonthlyStat[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyDist[]>([]);
  const [growth, setGrowth]         = useState<GrowthPoint[]>([]);
  const [loading, setLoading]       = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Promise.all([
      chartsService.getMonthlySavings(6),
      chartsService.getCurrencyDistribution(),
      chartsService.getCumulativeGrowth(90),
    ]).then(([m, c, g]) => {
      setMonthly(m);
      setCurrencies(c);
      setGrowth(g);
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  }, []);

  const mainCurrency = user?.main_currency ?? 'DOP';
  const maxMonthly   = Math.max(...monthly.map(m => m.total), 1);

  if (loading) {
    return (
      <View style={[S.Layout.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={Theme.color.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />

      {/* Header degradado */}
      <LinearGradient
        colors={[Theme.color.primaryDarker, Theme.color.primaryDark]}
        style={{
          paddingTop: 60,
          paddingBottom: 24,
          paddingHorizontal: Theme.space.md,
        }}
      >
        <Text style={[S.Typography.displayMd, { color: Theme.color.white }]}>Estadísticas</Text>
        <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.7)', marginTop: 4 }]}>
          Visualiza tu progreso financiero
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={S.Layout.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ─── BARRAS MENSUALES ─── */}
          <View style={[S.Cards.basePadLg, { marginBottom: Theme.space.md, gap: Theme.space.sm }]}>
            <Text style={S.Typography.headingSm}>Ahorro mensual</Text>
            <Text style={S.Typography.bodySm}>Últimos {monthly.length} meses</Text>

            {monthly.length === 0 ? (
              <View style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[S.Typography.bodySm, { fontStyle: 'italic' }]}>Sin datos aún</Text>
              </View>
            ) : (
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                height: BAR_MAX_HEIGHT + 48,
              }}>
                {monthly.map((m, i) => (
                  <AnimatedBar
                    key={m.month}
                    value={m.total}
                    maxValue={maxMonthly}
                    label={monthLabel(m.month)}
                    delay={i * 80}
                  />
                ))}
              </View>
            )}
          </View>

          {/* ─── DISTRIBUCIÓN MONEDAS ─── */}
          {currencies.length > 0 && (
            <View style={[S.Cards.basePadLg, { marginBottom: Theme.space.md, gap: Theme.space.sm }]}>
              <Text style={S.Typography.headingSm}>Distribución por moneda</Text>
              <Text style={S.Typography.bodySm}>Total ahorrado por moneda</Text>

              <View style={{ gap: Theme.space.sm }}>
                {currencies.map((c, i) => (
                  <View key={c.currency} style={{ gap: 6 }}>
                    <View style={[S.Layout.row, { gap: 8 }]}>
                      <View style={{
                        width: 10, height: 10, borderRadius: 5,
                        backgroundColor: PALETTE[i % PALETTE.length],
                      }} />
                      <Text style={[S.Typography.headingSm, { fontSize: Theme.size.sm }]}>{c.currency}</Text>
                      <Text style={[S.Typography.amountXs, { color: PALETTE[i % PALETTE.length], flex: 1 }]}>
                        {Math.round(c.percentage)}%
                      </Text>
                      <Text style={S.Typography.bodySm}>{formatAmount(c.total, c.currency)}</Text>
                    </View>
                    {/* Barra horizontal */}
                    <View style={[S.Progress.trackSm, { height: 8 }]}>
                      <View style={[S.Progress.fill, {
                        width: `${c.percentage}%`,
                        backgroundColor: PALETTE[i % PALETTE.length],
                      }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── CRECIMIENTO ACUMULADO ─── */}
          {growth.length > 1 && (
            <View style={[S.Cards.basePadLg, { marginBottom: Theme.space.md, gap: Theme.space.sm }]}>
              <Text style={S.Typography.headingSm}>Crecimiento acumulado</Text>
              <Text style={S.Typography.bodySm}>Últimos 90 días ({mainCurrency})</Text>

              {/* Sparkline de barras */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 64, gap: 2 }}>
                {(() => {
                  const maxG  = Math.max(...growth.map(g => g.cumulative), 1);
                  const step  = Math.max(1, Math.floor(growth.length / 30));
                  const points = growth.filter((_, i) => i % step === 0 || i === growth.length - 1);
                  return points.map((pt, i) => {
                    const h = Math.max(2, (pt.cumulative / maxG) * 60);
                    return (
                      <View
                        key={pt.date}
                        style={{
                          flex: 1,
                          height: h,
                          borderRadius: 2,
                          minHeight: 2,
                          backgroundColor: i === points.length - 1
                            ? Theme.color.primary
                            : Theme.color.primaryLighter,
                        }}
                      />
                    );
                  });
                })()}
              </View>

              <Text style={[S.Typography.amountSm, { color: Theme.color.primary }]}>
                Total actual: {formatAmount(growth[growth.length - 1]?.cumulative ?? 0, mainCurrency)}
              </Text>
            </View>
          )}

          {/* ─── RESUMEN GRID ─── */}
          <View style={[S.Cards.basePadLg, { marginBottom: Theme.space.md }]}>
            <Text style={[S.Typography.headingSm, { marginBottom: Theme.space.sm }]}>Resumen</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Theme.space.sm }}>
              <SummaryItem
                icon="trending-up"
                label="Mejor mes"
                value={monthly.length > 0
                  ? formatAmount(Math.max(...monthly.map(m => m.total)), mainCurrency)
                  : '—'}
              />
              <SummaryItem
                icon="cash"
                label="Promedio/mes"
                value={monthly.length > 0
                  ? formatAmount(monthly.reduce((s, m) => s + m.total, 0) / monthly.length, mainCurrency)
                  : '—'}
              />
              <SummaryItem
                icon="flag-outline"
                label="Monedas"
                value={`${currencies.length}`}
              />
              <SummaryItem
                icon="calendar-month-outline"
                label="Meses activos"
                value={`${monthly.filter(m => m.total > 0).length}`}
              />
            </View>
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};
