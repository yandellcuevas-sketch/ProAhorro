import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { accountService } from '../../services/accountService';
import { useAuthStore } from '../../store/authStore';

interface DeleteAccountScreenProps {
  onDeleted: () => void;
  onBack: () => void;
}

const CONFIRM_WORD = 'ELIMINAR';

const DATA_LIST = [
  { icon: 'wallet-outline', label: 'Todos tus ahorros registrados' },
  { icon: 'flag-outline', label: 'Tus metas de ahorro' },
  { icon: 'git-branch-outline', label: 'Reparticiones y lotes' },
  { icon: 'time-outline', label: 'Historial de movimientos' },
  { icon: 'cash-outline', label: 'Monedas personalizadas' },
  { icon: 'settings-outline', label: 'Configuración y preferencias' },
];

export const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({
  onDeleted,
  onBack,
}) => {
  const { logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isConfirmed = confirmText === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!isConfirmed) {
      setError(`Escribe "${CONFIRM_WORD}" para confirmar`);
      return;
    }

    Alert.alert(
      '¿Eliminar cuenta?',
      'Esta acción es permanente e irreversible. Todos tus datos serán eliminados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            setError('');
            try {
              await accountService.deleteAccount();
              onDeleted();
            } catch (err: any) {
              setError(err.message ?? 'Error al eliminar la cuenta. Intenta de nuevo.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.danger, '#C62828']}
        style={styles.header}
      >
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <View style={styles.headerIcon}>
          <Ionicons name="warning" size={36} color={Colors.white} />
        </View>
        <Text style={styles.headerTitle}>Eliminar cuenta</Text>
        <Text style={styles.headerSubtitle}>Esta acción no se puede deshacer</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Advertencia */}
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={20} color={Colors.danger} />
          <Text style={styles.warningText}>
            Eliminar tu cuenta borrará permanentemente todos tus datos en ProAhorro.
            Esta acción <Text style={styles.bold}>no se puede deshacer</Text>.
          </Text>
        </View>

        {/* Lista de datos que se eliminan */}
        <Text style={styles.listTitle}>Se eliminará permanentemente:</Text>
        <View style={styles.dataList}>
          {DATA_LIST.map((item) => (
            <View key={item.label} style={styles.dataItem}>
              <View style={styles.dataItemIcon}>
                <Ionicons name={item.icon as any} size={16} color={Colors.danger} />
              </View>
              <Text style={styles.dataItemLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Confirmación */}
        <View style={styles.confirmSection}>
          <Text style={styles.confirmLabel}>
            Para confirmar, escribe{' '}
            <Text style={styles.confirmWord}>ELIMINAR</Text>{' '}
            en el campo de abajo:
          </Text>
          <TextInput
            style={[
              styles.confirmInput,
              isConfirmed ? styles.confirmInputValid : null,
              (!!error && !isConfirmed) ? styles.confirmInputError : null,
            ]}
            value={confirmText}
            onChangeText={(t) => {
              setConfirmText(t.toUpperCase());
              setError('');
            }}
            placeholder="Escribe ELIMINAR"
            placeholderTextColor={Colors.textLight}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={10}
          />
          {isConfirmed && (
            <View style={styles.validRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
              <Text style={styles.validText}>Confirmado</Text>
            </View>
          )}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        {/* Botón eliminar */}
        <Button
          label={loading ? 'Eliminando...' : 'Eliminar mi cuenta'}
          variant="danger"
          loading={loading}
          onPress={handleDelete}
          disabled={!isConfirmed || loading}
          style={styles.deleteBtn}
        />

        <Button
          label="Cancelar"
          variant="outline"
          onPress={onBack}
          style={styles.cancelBtn}
        />

        <Text style={styles.footer}>
          Si necesitas ayuda, contacta a soporte@proahorro.app antes de eliminar tu cuenta.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: Spacing.screenHorizontal,
    alignItems: 'center',
    gap: Spacing[2],
  },
  backBtn: { position: 'absolute', top: 60, left: Spacing.screenHorizontal },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  headerTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenHorizontal, paddingBottom: 40 },

  warningBox: {
    flexDirection: 'row',
    gap: Spacing[3],
    backgroundColor: Colors.dangerLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: Colors.danger,
    marginBottom: Spacing[6],
    marginTop: Spacing[4],
  },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: Colors.danger,
    lineHeight: FontSize.sm * 1.6,
  },
  bold: { fontFamily: FontFamily.dmSansSemiBold },

  listTitle: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.base,
    color: Colors.textDark,
    marginBottom: Spacing[3],
  },
  dataList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    marginBottom: Spacing[6],
    ...Shadows.sm,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dataItemIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataItemLabel: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textDark,
    flex: 1,
  },

  confirmSection: { marginBottom: Spacing[6] },
  confirmLabel: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textDark,
    marginBottom: Spacing[3],
    lineHeight: FontSize.base * 1.5,
  },
  confirmWord: {
    fontFamily: FontFamily.dmSansBold,
    color: Colors.danger,
  },
  confirmInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing[4],
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.md,
    color: Colors.textDark,
    backgroundColor: Colors.backgroundInput,
    textAlign: 'center',
    letterSpacing: 2,
  },
  confirmInputValid: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  confirmInputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing[2],
  },
  validText: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  errorText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginTop: Spacing[2],
  },
  deleteBtn: { marginBottom: Spacing[3] },
  cancelBtn: { marginBottom: Spacing[6] },
  footer: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.6,
  },
});
