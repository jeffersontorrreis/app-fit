import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';

export function createExerciseTutorialStyles(
  theme: AppTheme,
  isDarkMode: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 120,
      gap: 20,
    },
    title: {
      color: theme.text,
      fontSize: 34,
      fontWeight: 'bold',
      marginTop: 12,
      letterSpacing: -1,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 16,
      lineHeight: 24,
    },
    planSelector: {
      gap: 12,
      paddingVertical: 8,
    },
    planButton: {
      backgroundColor:
        theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 999,
    },
    planButtonActive: {
      backgroundColor:
        theme.primary,
      borderColor: theme.primary,
    },
    planButtonText: {
      color: theme.text,
      fontWeight: '600',
      fontSize: 14,
    },
    planButtonTextActive: {
      color: theme.textInverse,
    },
    emptyText: {
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 40,
      fontSize: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerNote: {
      color: isDarkMode
        ? '#71717A'
        : theme.textTertiary,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 18,
    },
  });
}
