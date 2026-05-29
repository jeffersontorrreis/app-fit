import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevNavBar } from '../../components';
import { createTrainingHistoryStyles } from './styles';
import { WorkoutHistoryCard } from './components/WorkoutHistoryCardUser';
import { listWorkoutHistory, WorkoutSession } from '../../database/repositories/workoutRepository';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TrainingHistoryScreenProps {
  navigation: any;
}

export function TrainingHistoryScreen({ navigation }: TrainingHistoryScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createTrainingHistoryStyles(theme);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect recarrega o histórico toda vez que a tela recebe foco.
  // Assim, ao voltar do WorkoutLog após salvar, o novo treino aparece.
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      listWorkoutHistory(user.uid)
        .then(setSessions)
        .finally(() => setLoading(false));
    }, [user])
  );

  // Formata ISO string para dd/mm/yyyy legível.
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
        <Text style={styles.title}>Histórico de Treinos</Text>
        <Text style={styles.subtitle}>
          Toque no card para expandir e ver os detalhes do treino salvo.
        </Text>

        {loading && (
          <View style={{ paddingTop: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {!loading && sessions.length === 0 && (
          <Text style={styles.subtitle}>Nenhum treino registrado ainda.</Text>
        )}

        {sessions.map((session) => (
          <WorkoutHistoryCard
            key={session.id}
            title={`Treino - ${formatDate(session.performed_at)}`}
            createdAt={formatDate(session.performed_at)}
            exercises={session.entries.map((entry) => ({
              id: String(entry.id),
              name: entry.exercise_name,
              load: `${entry.load} kg — ${entry.reps} reps`,
            }))}
          />
        ))}
      </ScrollView>

      <DevNavBar
        activeRoute="Home"
        onGoHome={() => navigation.navigate('Home')}
        onGoTrainingPlan={() =>
          navigation.navigate(
            user?.perfil === 'ADMIN'
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

{/*Navegação com SafeAreaView para garantir que as 
  telas respeitem a area do topo do dispositivo.*/}
