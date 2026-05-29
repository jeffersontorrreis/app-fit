import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  borderRadius,
  spacing,
  typography,
} from '../config/styles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type NavRoute =
  | 'Home'
  | 'TrainingPlan'
  | 'WorkoutLog'
  | 'Account';

interface DevNavBarProps {
  activeRoute: NavRoute;
  onGoHome: () => void;
  onGoTrainingPlan?: () => void;
  onGoWorkoutLog?: () => void;
  onGoAccount: () => void;
  /** Quais botões exibir. Padrão: todos os 4. */
  visibleItems?: NavRoute[];
}

interface NavItem {
  route: NavRoute;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function DevNavBar({
  activeRoute,
  onGoHome,
  onGoTrainingPlan,
  onGoWorkoutLog,
  onGoAccount,
  visibleItems,
}: DevNavBarProps) {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(theme, isDarkMode);

  const isProfessor = user?.role === 'PROFESSOR';

  // Se não passado explicitamente, professor vê só Início+Perfil; aluno vê tudo
  const resolvedItems: NavRoute[] = visibleItems ?? (
    isProfessor ? ['Home', 'Account'] : ['Home', 'TrainingPlan', 'WorkoutLog', 'Account']
  );

  const allItems: NavItem[] = [
    {
      route: 'Home',
      label: 'Inicio',
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
      onPress: onGoHome,
    },
    {
      route: 'TrainingPlan',
      label: 'Plano',
      activeIcon: 'clipboard',
      inactiveIcon: 'clipboard-outline',
      onPress: onGoTrainingPlan ?? onGoHome,
    },
    {
      route: 'WorkoutLog',
      label: 'Registro',
      activeIcon: 'barbell',
      inactiveIcon: 'barbell-outline',
      onPress: onGoWorkoutLog ?? onGoHome,
    },
    {
      route: 'Account',
      label: 'Perfil',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
      onPress: onGoAccount,
    },
  ];

  const items = allItems.filter((i) => resolvedItems.includes(i.route));

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive =
          activeRoute === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={item.onPress}
            activeOpacity={0.75}
          >
            {isActive ? (
              <View style={styles.activeIndicator} />
            ) : null}

            <View style={styles.iconWrap}>
              <Ionicons
                name={
                  isActive
                    ? item.activeIcon
                    : item.inactiveIcon
                }
                size={21}
                color={
                  isActive
                    ? theme.primary
                    : theme.textSecondary
                }
              />
            </View>

            <Text
              style={[
                styles.label,
                isActive
                  ? styles.labelActive
                  : undefined,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  container: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 62,
    backgroundColor: isDarkMode
      ? 'rgba(20, 22, 27, 0.98)'
      : '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    shadowColor: '#000000',
    shadowOpacity: isDarkMode
      ? 0.18
      : 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 22,
    height: 3,
    borderRadius:
      borderRadius.full,
    backgroundColor:
      theme.primary,
  },
  iconWrap: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.textSecondary,
    fontSize:
      typography.fontSize.xs,
    fontWeight: '600',
  },
  labelActive: {
    color: theme.text,
    fontWeight: '700',
  },
});
