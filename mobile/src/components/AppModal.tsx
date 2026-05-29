import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  borderRadius,
  spacing,
  typography,
} from '../config/styles';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton } from './PrimaryButton';

interface AppModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

export function AppModal({
  visible,
  title,
  message,
  buttonLabel = 'Entendi',
  onClose,
}: AppModalProps) {
  const { theme, isDarkMode } =
    useTheme();

  const styles = createStyles(
    theme,
    isDarkMode
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              !
            </Text>
          </View>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <PrimaryButton
            label={buttonLabel}
            onPress={onClose}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (
  theme: ReturnType<
    typeof useTheme
  >['theme'],
  isDarkMode: boolean
) =>
  StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      isDarkMode
        ? 'rgba(0, 0, 0, 0.82)'
        : 'rgba(5, 5, 5, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor:
      theme.surface,
    borderRadius:
      borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 12,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor:
      'rgba(239, 255, 0, 0.12)',
    borderWidth: 1,
    borderColor: theme.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badgeText: {
    color: theme.warning,
    fontSize:
      typography.fontSize['2xl'],
    fontWeight: '700',
  },
  title: {
    color: theme.text,
    fontSize:
      typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    color: theme.textSecondary,
    fontSize:
      typography.fontSize.base,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
  },
});
