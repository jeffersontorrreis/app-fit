import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  borderRadius,
  spacing,
  typography,
} from '../../config/styles';

export function createWorkoutLogStyles(
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
      paddingBottom: spacing.lg,
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
      color: theme.text,
      fontSize:
        typography.fontSize['3xl'],
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.base,
      lineHeight: 22,
    },
    currentCard: {
      backgroundColor:
        theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      gap: spacing.md,
    },
    cardLabel: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '600',
    },
    currentExercise: {
      color: theme.secondary,
      fontSize:
        typography.fontSize['2xl'],
      fontWeight: '700',
    },
    quickForm: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    metricCard: {
      flex: 1,
      backgroundColor:
        theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      gap: spacing.sm,
    },
    label: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '600',
    },
    metricInput: {
      color: theme.text,
      fontSize:
        typography.fontSize['3xl'],
      fontWeight: '700',
      borderBottomWidth: 1,
      borderBottomColor:
        theme.border,
      paddingVertical: spacing.xs,
    },
    quickButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    quickButton: {
      flex: 1,
      backgroundColor:
        theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    quickButtonText: {
      color: theme.text,
      fontSize:
        typography.fontSize.base,
      fontWeight: '700',
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
    loggedSetCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor:
        theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
    loggedSetNumber: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor:
        theme.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loggedSetNumberText: {
      color: theme.textInverse,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '700',
    },
    loggedSetInfo: {
      flex: 1,
    },
    loggedSetTitle: {
      color: theme.text,
      fontSize:
        typography.fontSize.base,
      fontWeight: '700',
    },
    loggedSetMeta: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      marginTop: spacing.xs,
    },
    noExerciseHint: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.base,
      fontStyle: 'italic',
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      textAlign: 'center',
      paddingVertical: spacing.md,
    },
    restOptions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    restOptionBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      backgroundColor:
        theme.surfaceVariant,
    },
    restOptionBtnActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    restOptionText: {
      color: theme.textSecondary,
      fontSize:
        typography.fontSize.sm,
      fontWeight: '700',
    },
    restOptionTextActive: {
      color: theme.textInverse,
    },
    restStartBtn: {
      backgroundColor:
        theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    restStartBtnText: {
      color: theme.text,
      fontSize:
        typography.fontSize.base,
      fontWeight: '700',
    },
  });
}
