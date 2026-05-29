import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { typography, spacing, borderRadius } from '../config/styles';
import { useTheme } from '../context/ThemeContext';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: SecondaryButtonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: disabled ? theme.disabled : theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color: disabled ? theme.disabled : theme.primary,
      fontSize: typography.fontSize.base,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Perceba que por enquanto só estamos utilizando o "darktheme", mas futuramente, quando implementarmos a troca de tema, 
    poderemos usar o "theme" para acessar as cores dinamicamente. */
