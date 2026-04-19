import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from '../../config/foundations';
import { useOrbmobileI18n } from '../../i18n';

export type MMessageBoxType = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface MMessageBoxProps {
  /** Whether the dialog is visible */
  open: boolean;
  /** Visual type */
  type?: MMessageBoxType;
  /** Dialog title */
  title?: string;
  /** Dialog body message */
  message?: string;
  /** Confirm button label */
  confirmText?: string;
  /** Cancel button label */
  cancelText?: string;
  /** Show the cancel button (default: true) */
  showCancel?: boolean;
  /** Called when confirm is pressed */
  onConfirm?: () => void;
  /** Called when cancel or backdrop is pressed */
  onClose?: () => void;
  /** Custom container style */
  style?: ViewStyle;
}

const TYPE_COLORS: Record<MMessageBoxType, string> = {
  success: BRAND_COLORS.success,
  warning: BRAND_COLORS.warning,
  error: BRAND_COLORS.error,
  info: BRAND_COLORS.info,
  default: BRAND_COLORS.primary,
};

const TYPE_ICONS: Record<MMessageBoxType, string> = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
  default: '●',
};

export const MMessageBox: React.FC<MMessageBoxProps> = ({
  open,
  type = 'default',
  title,
  message,
  confirmText,
  cancelText,
  showCancel = true,
  onConfirm,
  onClose,
  style,
}) => {
  const { t } = useOrbmobileI18n();
  const accent = TYPE_COLORS[type];

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.card, style]} onStartShouldSetResponder={() => true}>
          <View style={[styles.iconCircle, { backgroundColor: accent + '20' }]}>
            <Text style={[styles.iconText, { color: accent }]}>
              {TYPE_ICONS[type]}
            </Text>
          </View>

          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            {showCancel ? (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelLabel}>
                  {cancelText ?? t('common.cancel')}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: accent }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmLabel}>
                {confirmText ?? t('common.ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: BRAND_COLORS.divider,
  },
  cancelLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: BRAND_COLORS.textSecondary,
  },
  confirmLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
