import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevNavBar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { listMyPlans, FirebaseTrainingPlan } from '../../integrations/firebase/firebaseTrainingPlans';
import { PlanHistoryCardUser } from './components/PlanHistoryCardUser';
import { createTrainingPlanUserStyles } from './styles';

interface TrainingPlanScreenUserProps {
  navigation: any;
}

export function TrainingPlanScreenUser({ navigation }: TrainingPlanScreenUserProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createTrainingPlanUserStyles(theme);
  const [plans, setPlans] = useState<FirebaseTrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Recarrega os planos sempre que a tela recebe foco.
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setLoading(true);
      listMyPlans(user.uid)
        .then(setPlans)
        .finally(() => setLoading(false));
    }, [user])
  );

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Meu Plano</Text>
        <Text style={styles.subtitle}>
          Planos criados pelo seu professor. Toque para expandir e ver os exercícios.
        </Text>

        {loading && (
          <View style={{ paddingTop: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {!loading && plans.length === 0 && (
          <Text style={styles.subtitle}>Nenhum plano disponível no momento.</Text>
        )}

        {plans.map((plan) => (
          <PlanHistoryCardUser
            key={plan.id}
            title={`${plan.name}${plan.trainerName ? ` · ${plan.trainerName}` : ''}`}
            createdAt={formatDate(plan.createdAt)}
            exercises={plan.items.map((item, idx) => ({
              id: `${plan.id}-${idx}`,
              name: item.exercise_name,
              load: `${item.sets}x${item.reps}`,
            }))}
          />
        ))}
      </ScrollView>

      <DevNavBar
        activeRoute="TrainingPlan"
        onGoHome={() => navigation.navigate('Home')}
        onGoTrainingPlan={() =>
          navigation.navigate(
            user?.role === 'ADMIN' || user?.role === 'PROFESSOR'
              ? 'TrainingPlanAdmin'
              : 'TrainingPlanUser'
          )
        }
        onGoWorkoutLog={() => navigation.navigate('WorkoutLog')}
        onGoAccount={() => navigation.navigate('Account')}
      />
    </SafeAreaView>
  );
}
