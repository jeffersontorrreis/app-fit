import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  borderRadius,
  spacing,
  typography,
} from '../config/styles';
import { useTheme } from '../context/ThemeContext';

export type FeedbackTone =
  | 'success'
  | 'error'
  | 'info';

interface InlineFeedbackProps {
  message: string;
  tone?: FeedbackTone;
}

export function InlineFeedback({
  message,
  tone = 'info',
}: InlineFeedbackProps) {
  const { theme, isDarkMode } =
    useTheme();

  const styles = createStyles(
    theme,
    isDarkMode
  );

  const toneMap: Record<
    FeedbackTone,
    {
      bg: string;
      border: string;
      icon: keyof typeof Ionicons.glyphMap;
      iconColor: string;
    }
  > = {
    success: {
      bg: isDarkMode
        ? '#0f2d1d'
        : '#dcfce7',
      border: theme.success,
      icon: 'checkmark-circle',
      iconColor: theme.success,
    },
    error: {
      bg: isDarkMode
        ? '#2d0f14'
        : '#fee2e2',
      border: theme.error,
      icon: 'alert-circle',
      iconColor: theme.error,
    },
    info: {
      bg: isDarkMode
        ? '#0f1e2d'
        : '#e0f2fe',
      border: theme.primary,
      icon: 'information-circle',
      iconColor: theme.primary,
    },
  };

  const config = toneMap[tone];

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor:
            config.bg,
          borderColor:
            config.border,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={18}
        color={config.iconColor}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const createStyles = (
  theme: ReturnType<
    typeof useTheme
  >['theme'],
  isDarkMode: boolean
) =>
  StyleSheet.create({
  box: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius:
      borderRadius.xl,
    shadowColor: '#000000',
    shadowOpacity: isDarkMode
      ? 0.5
      : 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
    color: theme.text,
    fontSize:
      typography.fontSize.sm,
    fontWeight: '600',
    lineHeight: 20,
  },
});
