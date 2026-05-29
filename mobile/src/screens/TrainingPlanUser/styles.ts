import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  spacing,
  typography,
} from '../../config/styles';

export function createTrainingPlanUserStyles(
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
  });
}
