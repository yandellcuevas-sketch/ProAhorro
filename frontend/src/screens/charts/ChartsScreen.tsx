import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
  Dimensions, ActivityIndicator, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import { chartsService } from '../../services/chartsService';
import { formatAmount, monthLabel } from '../../utils/format';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.screenHorizontal * 2 - 32;

interface MonthlyStat { month: string; total: number }
interface CurrencyDist { currency: string; total: number; percentage: number }
interface GrowthPoint { date: string; cumulative: number }

const BAR_MAX_HEIGHT = 120;
const PALETTE = [Colors.primary, '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#14B8A6'];

export const ChartsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [monthly, setMonthly] = useState<MonthlyStat[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyDist[]>([]);
  const [growth, setGrowth] = useState<GrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);

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
    });
  }, []);

  const mainCurrency = user?.main_currency ?? 'DOP';
  const maxMonthly = Math.max(...monthly.map((m) => m.total), 1);

  if (loading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <Text style={styles.headerSub}>Visualiza tu progreso financiero</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── GRÁFICO DE BARRAS MENSUAL ─── */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ahorro mensual</Text>
          <Text style={styles.chartSubtitle}>Últimos {monthly.length} meses</Text>

          {monthly.length === 0 ? (
            <View style={styles.noData}><Text style={styles.noDataText}>Sin datos aún</Text></View>
          ) : (
            <View style={styles.barsContainer}>
              {monthly.map((m) => {
                const barH = Math.max(4, (m.total / maxMonthly) * BAR_MAX_HEIGHT);
                return (
                  <View key={m.month} style={styles.barWrapper}>
                    <Text style={styles.barValue}>
                      {m.total > 0 ? formatAmount(m.total, mainCurrency).replace('RD$', '').replace('$', '') : ''}
                    </Text>
                    <View style={styles.barTrack}>
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={[styles.bar, { height: barH }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{monthLabel(m.month)}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        {/* ─── DISTRIBUCIÓN POR MONEDA ─── */}
        {currencies.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución por moneda</Text>
            <Text style={styles.chartSubtitle}>Total ahorrado por moneda</Text>

            {/* Barras horizontales */}
            <View style={styles.currencyBars}>
              {currencies.map((c, i) => (
                <View key={c.currency} style={styles.currencyRow}>
                  <View style={styles.currencyLabelRow}>
                    <View style={[styles.currencyDot, { backgroundColor: PALETTE[i % PALETTE.length] }]} />
                    <Text style={styles.currencyLabel}>{c.currency}</Text>
                    <Text style={styles.currencyPct}>{Math.round(c.percentage)}%</Text>
                    <Text style={styles.currencyTotal}>{formatAmount(c.total, c.currency)}</Text>
                  </View>
                  <View style={styles.hTrack}>
                    <View style={[styles.hBar, { width: `${c.percentage}%`, backgroundColor: PALETTE[i % PALETTE.length] }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* ─── CRECIMIENTO ACUMULADO ─── */}
        {growth.length > 1 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Crecimiento acumulado</Text>
            <Text style={styles.chartSubtitle}>Últimos 90 días ({mainCurrency})</Text>

            {/* Mini sparkline SVG-like usando barras */}
            <View style={styles.sparkContainer}>
              {(() => {
                const maxG = Math.max(...growth.map((g) => g.cumulative), 1);
                const step = Math.max(1, Math.floor(growth.length / 30));
                const points = growth.filter((_, i) => i % step === 0 || i === growth.length - 1);
                return points.map((pt, i) => {
                  const h = Math.max(2, (pt.cumulative / maxG) * 60);
                  return (
                    <View key={pt.date} style={[styles.sparkBar, { height: h, backgroundColor: i === points.length - 1 ? Colors.primary : Colors.primaryLight }]} />
                  );
                });
              })()}
            </View>
            <Text style={styles.growthTotal}>
              Total actual: {formatAmount(growth[growth.length - 1]?.cumulative ?? 0, mainCurrency)}
            </Text>
          </Card>
        )}

        {/* ─── RESUMEN ─── */}
        <Card style={styles.summaryCard}>
          <Text style={styles.chartTitle}>Resumen</Text>
          <View style={styles.summaryGrid}>
            <SummaryItem icon="trending-up" label="Mejor mes" value={
              monthly.length > 0
                ? formatAmount(Math.max(...monthly.map((m) => m.total)), mainCurrency)
                : '—'
            } />
            <SummaryItem icon="cash" label="Promedio/mes" value={
              monthly.length > 0
                ? formatAmount(monthly.reduce((s, m) => s + m.total, 0) / monthly.length, mainCurrency)
                : '—'
            } />
            <SummaryItem icon="flag" label="Monedas" value={`${currencies.length}`} />
            <SummaryItem icon="calendar" label="Meses activos" value={`${monthly.filter((m) => m.total > 0).length}`} />
          </View>
        </Card>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const SummaryItem: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.summaryItem}>
    <View style={styles.summaryIcon}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  loadingRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: Spacing.screenHorizontal },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize['2xl'], color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  content: { padding: Spacing.screenHorizontal, paddingBottom: 24 },
  chartCard: { marginBottom: Spacing[4], gap: Spacing[3] },
  chartTitle: { fontFamily: FontFamily.dmSansSemiBold, fontSize: FontSize.md, color: Colors.textDark },
  chartSubtitle: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight, marginTop: -8 },
  noData: { height: 80, alignItems: 'center', justifyContent: 'center' },
  noDataText: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight, fontStyle: 'italic' },

  // Barras mensuales
  barsContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: BAR_MAX_HEIGHT + 48 },
  barWrapper: { alignItems: 'center', gap: 4 },
  barTrack: { justifyContent: 'flex-end', height: BAR_MAX_HEIGHT },
  bar: { width: 28, borderRadius: 6 },
  barValue: { fontFamily: FontFamily.soraSemiBold, fontSize: 9, color: Colors.textLight, textAlign: 'center' },
  barLabel: { fontFamily: FontFamily.dmSansRegular, fontSize: 11, color: Colors.textMedium },

  // Distribución monedas
  currencyBars: { gap: Spacing[3] },
  currencyRow: { gap: 6 },
  currencyLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currencyDot: { width: 10, height: 10, borderRadius: 5 },
  currencyLabel: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textDark },
  currencyPct: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.sm, color: Colors.primary, flex: 1 },
  currencyTotal: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight },
  hTrack: { height: 8, backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.full, overflow: 'hidden' },
  hBar: { height: 8, borderRadius: BorderRadius.full },

  // Sparkline
  sparkContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 64, gap: 2 },
  sparkBar: { flex: 1, borderRadius: 2, minHeight: 2 },
  growthTotal: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.base, color: Colors.primary },

  // Resumen
  summaryCard: { marginBottom: Spacing[4] },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
  summaryItem: { width: '47%', alignItems: 'center', backgroundColor: Colors.primarySoft, borderRadius: BorderRadius.md, padding: Spacing[4], gap: Spacing[2] },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontFamily: FontFamily.soraBold, fontSize: FontSize.lg, color: Colors.textDark },
  summaryLabel: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'center' },
});
