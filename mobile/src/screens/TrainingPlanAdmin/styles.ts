import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  borderRadius,
  spacing,
  typography,
} from '../../config/styles';

export function createTrainingPlanStyles(
  theme: AppTheme
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.background,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
    },
    scroll: {
      flex: 1,
    },
    content: {
      gap: spacing.lg,
      paddingBottom: spacing['4xl'],
    },
    header: {
      gap: spacing.sm,
    },
    kicker: {
      color: theme.primary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    title: {
      fontSize:
        typography.fontSize['3xl'],
      color: theme.text,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.base,
      lineHeight: 22,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    summaryItem: {
      flex: 1,
      backgroundColor:
        theme.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
    },
    summaryValue: {
      color: theme.secondary,
      fontSize:
        typography.fontSize.lg,
      fontWeight: '700',
    },
    summaryLabel: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.xs,
      marginTop: spacing.xs,
    },
    section: {
      gap: spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      color: theme.text,
      fontSize:
        typography.fontSize.lg,
      fontWeight: '700',
    },
    sectionCounter: {
      color: theme.primary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '700',
    },
    fieldGroup: {
      gap: spacing.xs,
    },
    label: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '600',
    },
    input: {
      backgroundColor:
        theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      color: theme.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize:
        typography.fontSize.base,
    },
    exerciseCard: {
      backgroundColor:
        theme.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    exerciseNumber: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor:
        theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exerciseNumberText: {
      color: theme.textInverse,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '700',
    },
    exerciseTitleArea: {
      flex: 1,
    },
    exerciseTitle: {
      color: theme.text,
      fontSize:
        typography.fontSize.base,
      fontWeight: '700',
    },
    exerciseMeta: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      marginTop: spacing.xs,
    },
    removeButton: {
      backgroundColor:
        theme.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    removeButtonText: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.xs,
      fontWeight: '700',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    half: {
      flex: 1,
      gap: spacing.xs,
    },
  });
}
