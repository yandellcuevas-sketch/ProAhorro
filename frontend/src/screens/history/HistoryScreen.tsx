import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  SectionList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';
import { EmptyState } from '../../components/ui/EmptyState';

type FilterType = 'all' | 'free' | 'goal' | 'batch';
type MovType    = 'free' | 'goal' | 'batch';

interface Movement {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  type: MovType;
  icon: string;
  iconColor: string;
  date: string;
}

interface Section { title: string; data: Movement[] }

const ALL_MOVEMENTS: Section[] = [
  {
    title: 'Hoy',
    data: [
      { id: '1', title: 'Ahorro libre', subtitle: 'Efectivo', amount: 500, currency: 'RD$', type: 'free', icon: 'cash-multiple', iconColor: Theme.color.primary, date: '10:30 AM' },
    ],
  },
  {
    title: 'Ayer',
    data: [
      { id: '2', title: 'Viaje a Europa',    subtitle: 'Transferencia · Meta', amount: 2000, currency: 'RD$', type: 'goal',  icon: 'airplane',             iconColor: '#1976D2', date: 'May 25' },
      { id: '3', title: 'Fondo emergencia',  subtitle: 'Efectivo · Meta',      amount: 800,  currency: 'RD$', type: 'goal',  icon: 'shield-check-outline', iconColor: '#00796B', date: 'May 25' },
    ],
  },
  {
    title: 'May 24',
    data: [
      { id: '4', title: 'Repartición · 3 metas', subtitle: 'Lote · Viaje, Carro, Libre', amount: 4300, currency: 'RD$', type: 'batch', icon: 'arrow-split-vertical', iconColor: '#F57F17', date: 'May 24' },
    ],
  },
  {
    title: 'May 20',
    data: [
      { id: '5', title: 'Ahorro libre', subtitle: 'Tarjeta',                amount: 1200, currency: 'RD$', type: 'free', icon: 'cash-multiple', iconColor: Theme.color.primary, date: 'May 20' },
      { id: '6', title: 'Carro nuevo',  subtitle: 'Transferencia · Meta',   amount: 3000, currency: 'RD$', type: 'goal', icon: 'car-outline',   iconColor: '#7B1FA2',          date: 'May 20' },
    ],
  },
];

const TYPE_ICON: Record<MovType, { iconWrapStyle: object; tint: string }> = {
  free:  { iconWrapStyle: S.IconWrap.free,  tint: Theme.color.primary },
  goal:  { iconWrapStyle: S.IconWrap.goal,  tint: '#1565C0'           },
  batch: { iconWrapStyle: S.IconWrap.batch, tint: '#F57F17'           },
};

const FILTERS: { key: FilterType; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
  { key: 'all',   icon: 'view-list-outline',    label: 'Todos'  },
  { key: 'free',  icon: 'piggy-bank-outline',   label: 'Libres' },
  { key: 'goal',  icon: 'bullseye-arrow',       label: 'Metas'  },
  { key: 'batch', icon: 'arrow-split-vertical', label: 'Lotes'  },
];

const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredSections: Section[] = ALL_MOVEMENTS.map(section => ({
    ...section,
    data: section.data.filter(m => activeFilter === 'all' || m.type === activeFilter),
  })).filter(s => s.data.length > 0);

  const renderItem = ({ item, index, section }: { item: Movement; index: number; section: Section }) => {
    const isLast = index === section.data.length - 1;
    const cfg    = TYPE_ICON[item.type];
    return (
      <TouchableOpacity
        style={[
          S.Cards.movement,
          !isLast && S.ListItems.rowBorder,
        ]}
        activeOpacity={0.7}
      >
        <View style={[cfg.iconWrapStyle as any, { backgroundColor: undefined }]}>
          <MaterialCommunityIcons name={item.icon as any} size={18} color={item.iconColor} />
        </View>
        <View style={[S.Layout.flex1, { minWidth: 0 }]}>
          <Text style={[S.Typography.headingSm, { fontSize: Theme.size.sm }]}>{item.title}</Text>
          <Text style={S.ListItems.rowSublabel}>{item.subtitle}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[S.Typography.amountXs, { color: Theme.color.primary, letterSpacing: -0.2 }]}>
            +{item.currency}{item.amount.toLocaleString()}
          </Text>
          <Text style={[S.ListItems.rowSublabel, { marginTop: 1 }]}>{item.date}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={16} color={Theme.color.textPlaceholder} />
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={S.ListItems.sectionHeader}>
      <Text style={S.ListItems.sectionHeaderText}>{section.title}</Text>
      <Text style={S.ListItems.sectionHeaderCount}>{section.data.length} movimientos</Text>
    </View>
  );

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Historial</Text>
        <TouchableOpacity style={S.Layout.iconBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="magnify" size={20} color={Theme.color.textDark} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={{ paddingBottom: Theme.space.sm }}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={i => i.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Theme.space.md, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={activeFilter === item.key ? S.Chips.filterActive : S.Chips.filter}
              onPress={() => setActiveFilter(item.key)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={14}
                color={activeFilter === item.key ? Theme.color.white : Theme.color.textMedium}
              />
              <Text style={activeFilter === item.key ? S.Chips.filterTextActive : S.Chips.filterText}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <SectionList
        sections={filteredSections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[S.Layout.scrollPad, { paddingTop: 4 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => null}
        renderSectionFooter={() => <View style={S.Cards.listSection} />}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title="Sin movimientos"
            subtitle="Aquí aparecerán tus ahorros registrados"
          />
        }
      />
    </View>
  );
};

export default HistoryScreen;
