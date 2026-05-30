import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';

// ─── AccountScreen ────────────────────────────────────────────
export const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const SECTIONS = [
    {
      title: 'Mi cuenta',
      items: [
        { icon: 'account-circle-outline', label: 'Editar perfil',   sub: '',            arrow: true, onPress: () => {} },
        { icon: 'wallet-outline',         label: 'Monedas y tasas', sub: '',            arrow: true, onPress: () => {} },
        { icon: 'bell-outline',           label: 'Notificaciones',  sub: '',            arrow: true, onPress: () => {} },
      ],
    },
    {
      title: 'Seguridad',
      items: [
        { icon: 'shield-lock-outline', label: 'Privacidad y seguridad', sub: '', arrow: true, onPress: () => navigation.navigate('Privacy') },
        { icon: 'lock-reset',          label: 'Cambiar contraseña',     sub: '', arrow: true, onPress: () => {} },
        { icon: 'fingerprint',         label: 'Biometría',              sub: '', arrow: true, onPress: () => {} },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { icon: 'help-circle-outline',  label: 'Centro de ayuda',   sub: '', arrow: true, onPress: () => {} },
        { icon: 'message-text-outline', label: 'Contactar soporte', sub: '', arrow: true, onPress: () => {} },
        { icon: 'star-outline',         label: 'Calificar la app',  sub: '', arrow: true, onPress: () => {} },
      ],
    },
  ];

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <Text style={S.Layout.headerTitle}>Cuenta</Text>
        <TouchableOpacity style={S.Layout.iconBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color={Theme.color.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.Layout.scrollPad}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ─── PROFILE CARD ─── */}
          <View style={[S.Cards.basePadLg, { alignItems: 'center', marginBottom: Theme.space.lg }]}>
            <View style={{ position: 'relative', marginBottom: Theme.space.md }}>
              <Image
                source={require('../../assets/images/imglogo.png')}
                style={{ width: 72, height: 72, borderRadius: Theme.radius.lg }}
                resizeMode="cover"
              />
              <View style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 22, height: 22, borderRadius: 11,
                backgroundColor: Theme.color.primary,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: Theme.color.bgCard,
              }}>
                <MaterialCommunityIcons name="pencil" size={11} color={Theme.color.white} />
              </View>
            </View>

            <View style={{ alignItems: 'center', marginBottom: Theme.space.md }}>
              <Text style={[S.Typography.headingLg, { marginBottom: 3 }]}>Yandell García</Text>
              <Text style={S.Typography.bodyMd}>yandell@correo.com</Text>
            </View>

            {/* Stats */}
            <View style={[S.Layout.row, {
              gap: Theme.space.lg, paddingTop: Theme.space.md,
              borderTopWidth: 1, borderTopColor: Theme.color.borderLight,
              width: '100%', justifyContent: 'center',
            }]}>
              {[
                { val: '47', label: 'Ahorros' },
                { val: '5',  label: 'Metas'   },
                { val: '8',  label: 'Meses'   },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={S.Typography.headingLg}>{s.val}</Text>
                    <Text style={S.Typography.caption}>{s.label}</Text>
                  </View>
                  {i < arr.length - 1 && (
                    <View style={{ width: 1, height: 28, backgroundColor: Theme.color.borderLight }} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* ─── SECTIONS ─── */}
          {SECTIONS.map(section => (
            <View key={section.title} style={{ marginBottom: Theme.space.md }}>
              <Text style={[S.Typography.label, { marginBottom: Theme.space.sm, paddingLeft: 2 }]}>
                {section.title}
              </Text>
              <View style={S.Cards.listSection}>
                {section.items.map((item, i) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      S.ListItems.row,
                      i < section.items.length - 1 && S.ListItems.rowBorder,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={S.IconWrap.sm}>
                      <MaterialCommunityIcons name={item.icon as any} size={17} color={Theme.color.primary} />
                    </View>
                    <Text style={S.ListItems.rowLabel}>{item.label}</Text>
                    {item.arrow && (
                      <MaterialCommunityIcons name="chevron-right" size={18} color={Theme.color.textPlaceholder} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* ─── SIGN OUT ─── */}
          <TouchableOpacity
            style={[S.Buttons.dangerGhost, { marginBottom: Theme.space.sm }]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout-variant" size={18} color={Theme.color.danger} />
            <Text style={S.Buttons.dangerGhostText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <Text style={[S.Typography.caption, { textAlign: 'center', marginBottom: Theme.space.sm }]}>
            ProAhorro v1.0.0
          </Text>

          <View style={{ height: Theme.space.xl }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ─── PrivacyScreen ────────────────────────────────────────────
export const PrivacyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Privacidad y seguridad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.Layout.scrollPad}>

        <View style={S.Cards.listSection}>
          {[
            { icon: 'lock-outline',     label: 'PIN de acceso',      sub: 'Desactivado'      },
            { icon: 'fingerprint',      label: 'Acceso biométrico',  sub: 'Desactivado'      },
            { icon: 'eye-off-outline',  label: 'Ocultar saldos',     sub: 'Al abrir la app'  },
            { icon: 'download-outline', label: 'Exportar mis datos', sub: 'CSV / PDF'         },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[
                S.ListItems.row,
                i < arr.length - 1 && S.ListItems.rowBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={S.IconWrap.sm}>
                <MaterialCommunityIcons name={item.icon as any} size={17} color={Theme.color.primary} />
              </View>
              <View style={S.Layout.flex1}>
                <Text style={S.ListItems.rowLabel}>{item.label}</Text>
                <Text style={S.ListItems.rowSublabel}>{item.sub}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={Theme.color.textPlaceholder} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── DANGER ZONE ─── */}
        <View style={{ marginTop: Theme.space.xl }}>
          <View style={[S.Layout.row, { gap: 6, marginBottom: Theme.space.sm }]}>
            <MaterialCommunityIcons name="alert-octagon-outline" size={18} color={Theme.color.danger} />
            <Text style={[S.Typography.label, { color: Theme.color.danger }]}>Zona de riesgo</Text>
          </View>
          <View style={[S.Cards.listSection, { borderColor: Theme.color.dangerLight }]}>
            <TouchableOpacity
              style={S.ListItems.row}
              onPress={() => navigation.navigate('DeleteAccount')}
              activeOpacity={0.7}
            >
              <View style={[S.IconWrap.sm, { backgroundColor: Theme.color.dangerLight }]}>
                <MaterialCommunityIcons name="trash-can-outline" size={17} color={Theme.color.danger} />
              </View>
              <View style={S.Layout.flex1}>
                <Text style={[S.ListItems.rowLabel, { color: Theme.color.danger }]}>Eliminar cuenta</Text>
                <Text style={S.ListItems.rowSublabel}>Acción permanente e irreversible</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={Theme.color.danger} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Theme.space.xl }} />
      </ScrollView>
    </View>
  );
};

// ─── DeleteAccountScreen ──────────────────────────────────────
export const DeleteAccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText.trim().toUpperCase() === 'ELIMINAR';

  const handleDelete = () => {
    Alert.alert(
      'Última confirmación',
      'Esta acción es permanente. ¿Estás seguro de que quieres eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: () => {
            navigation.reset({ index: 0, routes: [{ name: 'DeleteConfirmed' }] });
          },
        },
      ],
    );
  };

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Eliminar cuenta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.Layout.scrollPad}>

        {/* Warning icon */}
        <View style={[S.DeleteAccount.iconWrap, { marginTop: Theme.space.sm }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={Theme.color.danger} />
        </View>

        <Text style={[S.Typography.headingXl, { textAlign: 'center', marginBottom: Theme.space.sm }]}>
          ¿Eliminar tu cuenta?
        </Text>
        <Text style={[S.Typography.bodyLg, { textAlign: 'center', marginBottom: Theme.space.xl }]}>
          Esta acción es permanente e irreversible. No podrás recuperar tu información.
        </Text>

        {/* Consequences */}
        <View style={[S.Cards.danger, { marginBottom: Theme.space.xl }]}>
          <Text style={[S.Typography.danger, { marginBottom: Theme.space.sm }]}>
            Se eliminarán permanentemente:
          </Text>
          {[
            { icon: 'cash-multiple',         label: 'Todos tus ahorros registrados'    },
            { icon: 'bullseye-arrow',         label: 'Todas tus metas y su progreso'    },
            { icon: 'receipt-text-outline',   label: 'Todo tu historial de movimientos' },
            { icon: 'tune-variant',           label: 'Tus preferencias y configuración' },
            { icon: 'account-circle-outline', label: 'Tu perfil y datos personales'     },
          ].map(item => (
            <View key={item.label} style={S.DeleteAccount.consequenceRow}>
              <View style={S.DeleteAccount.xCircle}>
                <MaterialCommunityIcons name="close" size={11} color={Theme.color.white} />
              </View>
              <MaterialCommunityIcons name={item.icon as any} size={15} color={Theme.color.danger} />
              <Text style={S.DeleteAccount.consequenceText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Confirm input */}
        <View style={{ marginBottom: Theme.space.lg }}>
          <Text style={[S.Typography.label, { marginBottom: 8 }]}>
            Escribe <Text style={S.DeleteAccount.confirmKeyword}>ELIMINAR</Text> para confirmar
          </Text>
          <View style={[
            S.Forms.inputWrap,
            isConfirmed && S.DeleteAccount.confirmInputReady,
          ]}>
            <TextInput
              style={[S.Forms.input, { fontWeight: '700', letterSpacing: 1 }]}
              placeholder="Escribe ELIMINAR"
              placeholderTextColor={Theme.color.textPlaceholder}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
            />
            {isConfirmed && (
              <MaterialCommunityIcons name="check-circle" size={20} color={Theme.color.danger} />
            )}
          </View>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={[S.Buttons.danger, !isConfirmed && S.Buttons.disabled, { marginBottom: Theme.space.sm }]}
          activeOpacity={0.85}
          disabled={!isConfirmed}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={Theme.color.white} />
          <Text style={S.Buttons.dangerText}>Eliminar mi cuenta definitivamente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: 14 }}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={S.Typography.bodyMd}>Cancelar, mantener mi cuenta</Text>
        </TouchableOpacity>

        <View style={{ height: Theme.space.xl }} />
      </ScrollView>
    </View>
  );
};
