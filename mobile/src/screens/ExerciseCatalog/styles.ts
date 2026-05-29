import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  borderRadius,
  spacing,
  typography,
} from '../../config/styles';

export function createExerciseCatalogStyles(
  theme: AppTheme,
  isDarkMode: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.background,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      justifyContent:
        'space-between',
    },
    scroll: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      gap: spacing.md,
      paddingBottom: spacing['4xl'],
    },
    title: {
      fontSize:
        typography.fontSize['2xl'],
      color: theme.text,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.base,
    },
    overlay: {
      flex: 1,
      backgroundColor: isDarkMode
        ? 'rgba(0,0,0,0.6)'
        : 'rgba(5,5,5,0.34)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor:
        theme.surface,
      borderTopLeftRadius:
        borderRadius['2xl'],
      borderTopRightRadius:
        borderRadius['2xl'],
      padding: spacing['2xl'],
      gap: spacing.sm,
    },
    modalTitle: {
      color: theme.text,
      fontSize:
        typography.fontSize.xl,
      fontWeight:
        typography.fontWeight.bold,
      marginBottom: spacing.sm,
    },
    label: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      marginTop: spacing.sm,
    },
    hint: {
      color: theme.placeholder,
      fontSize:
        typography.fontSize.xs,
      marginTop: -spacing.xs,
    },
    input: {
      backgroundColor:
        theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      color: theme.text,
      fontSize:
        typography.fontSize.base,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor:
        theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    cancelText: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.base,
      fontWeight:
        typography.fontWeight.semibold,
    },
  });
}
