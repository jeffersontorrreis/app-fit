import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  borderRadius,
  spacing,
  typography,
} from '../../config/styles';

export function createHomeStyles(
  theme: AppTheme
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
    content: {
      flex: 1,
      justifyContent:
        'flex-start',
      paddingTop: spacing['4xl'],
      gap: spacing.md,
    },
    title: {
      fontSize:
        typography.fontSize['2xl'],
      color: theme.text,
      fontWeight: '700',
      alignSelf: 'flex-start',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    summaryRow: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
      rowGap: spacing.sm,
    },
    summaryItem: {
      width: '48.5%',
      minHeight: 116,
      backgroundColor:
        theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      justifyContent:
        'space-between',
    },
    summaryValue: {
      color: theme.text,
      fontSize:
        typography.fontSize.lg,
      fontWeight: '700',
    },
    summaryLabel: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.xs,
      marginTop: spacing.sm,
      lineHeight: 16,
    },
  });
}
