import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevNavBar } from '../../components';
import { createExerciseTutorialStyles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ExerciseTutorial } from './components/ExerciseTutorial';
import {
  listAdminTrainingPlans,
  TrainingPlan,
} from '../../database/repositories/trainingPlanRepository';
import {
  Exercise,
  listExercisesWithMuscles,
} from '../../database/repositories/exerciseRepository';

interface ExerciseTutorialScreenProps {
  navigation: any;
}
export function ExerciseTutorialScreen({
  navigation,
}: ExerciseTutorialScreenProps) {
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const styles = createExerciseTutorialStyles(theme, isDarkMode);
  const [plans, setPlans] =
    useState<TrainingPlan[]>([]);

  const [selectedPlanId, setSelectedPlanId] =
    useState<string | null>(null);

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        
        const loadedPlans =
          await listAdminTrainingPlans();

        const loadedExercises =
          await listExercisesWithMuscles();
        setPlans(loadedPlans);
        setExercises(loadedExercises);
        if (loadedPlans.length > 0) {
          setSelectedPlanId(
            loadedPlans[0].id
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  const selectedPlan = plans.find(
    (plan) => plan.id === selectedPlanId
  );
  const tutorialExercises = exercises.filter(
    (exercise) =>
      selectedPlan?.items.some(
        (item) =>
          item.exercise_name
            .trim()
            .toLowerCase() ===
          exercise.name
            .trim()
            .toLowerCase()
      )
  );
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Guia de Exercícios
        </Text>
        <Text style={styles.subtitle}>
          Selecione um plano para visualizar os exercícios.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.planSelector}
        >
          {plans.map((plan) => {
            const isSelected =
              selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() =>
                  setSelectedPlanId(plan.id)
                }
                style={[
                  styles.planButton,
                  isSelected &&
                    styles.planButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.planButtonText,
                    isSelected &&
                      styles.planButtonTextActive,
                  ]}
                >
                  {plan.name}
                </Text>

              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {!loading &&
          plans.length === 0 && (

          <Text style={styles.emptyText}>
            Nenhum plano registrado.
          </Text>
        )}
        {tutorialExercises.map((exercise) => (

          <ExerciseTutorial
            key={exercise.id}
            title={exercise.name}
            muscleGroups={exercise.muscleGroups}
          />
        ))}
        <Text style={styles.footerNote}>
        * As imagens utilizadas nesta tela foram obtidas do
        Wikimedia Commons e disponibilizadas sob licenças livres.
      </Text>
      </ScrollView>
      <DevNavBar
        activeRoute="TrainingPlan"
        onGoHome={() =>
          navigation.navigate('Home')
        }
        onGoTrainingPlan={() =>
          navigation.navigate(
            user?.perfil === 'ADMIN'
              ? 'TrainingPlanAdmin'
              : 'TrainingPlanUser'
          )
        }
        onGoWorkoutLog={() =>
          navigation.navigate(
            'WorkoutLog'
          )
        }
        onGoAccount={() =>
          navigation.navigate('Account')
        }
      />
    </SafeAreaView>
  );
}
