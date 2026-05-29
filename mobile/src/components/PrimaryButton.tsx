import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { typography, spacing, borderRadius } from '../config/styles';
import { useTheme } from '../context/ThemeContext';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: disabled ? theme.disabled : theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color: theme.textInverse,
      fontSize: typography.fontSize.base,
      fontWeight: '600',
      marginRight: loading ? spacing.sm : 0,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator color={theme.textInverse} size="small" />
      )}
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

{/* Perceba que por enquanto só estamos utilizando o "darktheme", mas futuramente, quando implementarmos a troca de tema, 
    poderemos usar o "theme" para acessar as cores dinamicamente. */}
