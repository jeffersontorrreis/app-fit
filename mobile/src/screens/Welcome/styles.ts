import { StyleSheet } from 'react-native';
import { AppTheme } from '../../config/colors';
import {
  spacing,
  typography,
} from '../../config/styles';

export function createWelcomeStyles(
  theme: AppTheme
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing['4xl'],
    },
    logoContainer: {
      marginBottom: spacing['2xl'],
      alignItems: 'center',
    },
    logoWrapper: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    brandName: {
      fontSize:
        typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.text,
      marginTop: spacing.sm,
    },
    tagline: {
      fontSize:
        typography.fontSize.sm,
      color: theme.primary,
      marginTop: spacing.xs,
      fontWeight: '500',
    },
    contentContainer: {
      alignItems: 'center',
      marginBottom: spacing['4xl'],
    },
    mainTitle: {
      fontSize:
        typography.fontSize['3xl'],
      fontWeight: '700',
      color: theme.text,
      marginBottom: spacing.md,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize:
        typography.fontSize.base,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing['3xl'],
      paddingHorizontal: spacing.md,
    },
    buttonContainer: {
      width: '100%',
      gap: spacing.md,
    },
    primaryButtonStyle: {
      width: '100%',
    },
    secondaryButtonStyle: {
      width: '100%',
    },
    footerText: {
      fontSize:
        typography.fontSize.xs,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing['2xl'],
    },
  });
}
