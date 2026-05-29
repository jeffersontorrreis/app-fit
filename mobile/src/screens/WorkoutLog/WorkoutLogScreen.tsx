import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  DevNavBar,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import { createWorkoutLogStyles } from './styles';
import {
  FeedbackTone,
  InlineFeedback,
} from '../../components/InlineFeedback';
import { saveWorkoutSession } from '../../database/repositories/workoutRepository';
import {
  listMyPlans,
  FirebaseTrainingPlan,
} from '../../integrations/firebase/firebaseTrainingPlans';
import { WorkoutPlanCard } from './components/WorkoutPlanCard';
import {
  RestOption,
  RestTimer,
  REST_OPTIONS,
} from './components/RestTimer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface WorkoutLogScreenProps {
  navigation: any;
}

interface LoggedSet {
  id: string;
  exercise: string;
  load: string;
  reps: string;
}

export function WorkoutLogScreen({
  navigation,
}: WorkoutLogScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createWorkoutLogStyles(theme);

  const [plans, setPlans] =
    useState<FirebaseTrainingPlan[]>([]);
  const [
    isLoadingPlans,
    setIsLoadingPlans,
  ] = useState(true);
  const [
    selectedExercise,
    setSelectedExercise,
  ] = useState<string | null>(null);
  const [load, setLoad] =
    useState('');
  const [reps, setReps] =
    useState('');
  const [loggedSets, setLoggedSets] =
    useState<LoggedSet[]>([]);
  const [feedback, setFeedback] =
    useState<string | null>(null);
  const [
    feedbackTone,
    setFeedbackTone,
  ] = useState<FeedbackTone>('info');
  const [
    restDuration,
    setRestDuration,
  ] = useState<number | null>(null);
  const [
    selectedRestOption,
    setSelectedRestOption,
  ] = useState<RestOption>(60);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      setIsLoadingPlans(true);
      if (!user) { setIsLoadingPlans(false); return; }
      listMyPlans(user.uid)
        .then((data) => {
          if (active) setPlans(data);
        })
        .catch((err) =>
          console.error(
            'Erro ao carregar planos:',
            err
          )
        )
        .finally(() => {
          if (active)
            setIsLoadingPlans(false);
        });
      return () => {
        active = false;
      };
    }, [user])
  );

  const showFeedback = (
    message: string,
    tone: FeedbackTone = 'info'
  ) => {
    setFeedbackTone(tone);
    setFeedback(message);
    setTimeout(
      () => setFeedback(null),
      2500
    );
  };

  const sanitizeNumber = (
    value: string
  ) => value.replace(/[^0-9]/g, '');

  const handleQuickLoad = (
    amount: number
  ) => {
    const current = Number(load || 0);
    setLoad(
      String(
        Math.max(0, current + amount)
      )
    );
  };

  const handleQuickReps = (
    amount: number
  ) => {
    const current = Number(reps || 0);
    setReps(
      String(
        Math.max(0, current + amount)
      )
    );
  };

  const handleSelectExercise = (
    name: string
  ) => {
    setSelectedExercise(name);
    setLoad('');
    setReps('');
    showFeedback(
      `"${name}" selecionado. Informe carga e repetições.`,
      'info'
    );
  };

  const handleRegisterSet = () => {
    if (!selectedExercise) {
      showFeedback(
        'Selecione um exercício do plano acima.',
        'error'
      );
      return;
    }

    if (!load || !reps) {
      showFeedback(
        'Informe carga e repetições para registrar.',
        'error'
      );
      return;
    }

    setLoggedSets((prev) => [
      {
        id: String(Date.now()),
        exercise: selectedExercise,
        load,
        reps,
      },
      ...prev,
    ]);

    showFeedback(
      'Série registrada com sucesso.',
      'success'
    );
    setRestDuration(selectedRestOption);
  };

  const handleFinishWorkout =
    async () => {
      if (!user) {
        showFeedback(
          'Faça login novamente para salvar seu treino.',
          'error'
        );
        return;
      }

      if (loggedSets.length === 0) {
        showFeedback(
          'Registre ao menos uma série antes de finalizar.',
          'error'
        );
        return;
      }

      try {
        const performedAt =
          new Date().toISOString();

        const entries = loggedSets.map(
          (set, index) => ({
            exercise_name:
              set.exercise,
            load: Number(set.load),
            reps: Number(set.reps),
            set_number: index + 1,
          })
        );

        await saveWorkoutSession(
          user.uid,
          performedAt,
          entries
        );

        setLoggedSets([]);
        setSelectedExercise(null);
        setLoad('');
        setReps('');

        showFeedback(
          'Treino finalizado e salvo no Firestore com sucesso.',
          'success'
        );
      } catch (error) {
        console.error(
          'Erro ao salvar treino:',
          error
        );
        showFeedback(
          'Erro ao salvar treino. Tente novamente.',
          'error'
        );
      }
    };

  const goProgress = () => {
    navigation.navigate('Progress');
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      {feedback && (
        <InlineFeedback
          message={feedback}
          tone={feedbackTone}
        />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              styles.content
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >
        <View style={styles.header}>
          <Text style={styles.kicker}>
            Registro rápido
          </Text>
          <Text style={styles.title}>
            Treino em execução
          </Text>
          <Text style={styles.subtitle}>
            Escolha um exercício do seu plano, informe carga e repetições e registre cada série.
          </Text>
        </View>

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Planos de treino
            </Text>
          </View>

          {isLoadingPlans ? (
            <ActivityIndicator
              color={theme.primary}
            />
          ) : plans.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum plano cadastrado. Peça ao seu treinador para criar um plano.
            </Text>
          ) : (
            plans.map((plan) => (
              <WorkoutPlanCard
                key={plan.id}
                title={plan.name}
                trainerName={plan.trainerName}
                exercises={plan.items.map(
                  (item, idx) => ({
                    id: idx,
                    exercise_name:
                      item.exercise_name,
                    sets: item.sets,
                    reps: item.reps,
                  })
                )}
                selectedExercise={
                  selectedExercise
                }
                onSelectExercise={
                  handleSelectExercise
                }
              />
            ))
          )}
        </View>

        <View style={styles.currentCard}>
          <Text style={styles.cardLabel}>
            Exercício selecionado
          </Text>
          {selectedExercise ? (
            <Text
              style={
                styles.currentExercise
              }
            >
              {selectedExercise}
            </Text>
          ) : (
            <Text
              style={styles.noExerciseHint}
            >
              Expanda um plano acima e toque em "Selecionar"
            </Text>
          )}
        </View>

        <View style={styles.quickForm}>
          <View style={styles.metricCard}>
            <Text style={styles.label}>
              Carga (kg)
            </Text>
            <TextInput
              value={load}
              onChangeText={(value) =>
                setLoad(
                  sanitizeNumber(value)
                )
              }
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={
                theme.placeholder
              }
              style={styles.metricInput}
            />
            <View
              style={styles.quickButtons}
            >
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() =>
                  handleQuickLoad(-5)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.quickButtonText
                  }
                >
                  -5
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() =>
                  handleQuickLoad(5)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.quickButtonText
                  }
                >
                  +5
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.label}>
              Repetições
            </Text>
            <TextInput
              value={reps}
              onChangeText={(value) =>
                setReps(
                  sanitizeNumber(value)
                )
              }
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={
                theme.placeholder
              }
              style={styles.metricInput}
            />
            <View
              style={styles.quickButtons}
            >
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() =>
                  handleQuickReps(-1)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.quickButtonText
                  }
                >
                  -1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() =>
                  handleQuickReps(1)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.quickButtonText
                  }
                >
                  +1
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PrimaryButton
          label="Registrar série"
          onPress={handleRegisterSet}
        />

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Descanso entre séries
            </Text>
          </View>
          <View
            style={styles.restOptions}
          >
            {REST_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.restOptionBtn,
                  selectedRestOption ===
                    opt &&
                    styles.restOptionBtnActive,
                ]}
                onPress={() =>
                  setSelectedRestOption(opt)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.restOptionText,
                    selectedRestOption ===
                      opt &&
                      styles.restOptionTextActive,
                  ]}
                >
                  {opt >= 60
                    ? `${opt / 60}min`
                    : `${opt}s`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.restStartBtn}
            onPress={() =>
              setRestDuration(
                selectedRestOption
              )
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.restStartBtnText
              }
            >
              Iniciar descanso
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Séries registradas
            </Text>
            <Text
              style={
                styles.sectionCounter
              }
            >
              {loggedSets.length} hoje
            </Text>
          </View>

          {loggedSets.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhuma série registrada ainda.
            </Text>
          )}

          {loggedSets.map(
            (set, index) => (
              <View
                key={set.id}
                style={
                  styles.loggedSetCard
                }
              >
                <View
                  style={
                    styles.loggedSetNumber
                  }
                >
                  <Text
                    style={
                      styles.loggedSetNumberText
                    }
                  >
                    {loggedSets.length -
                      index}
                  </Text>
                </View>
                <View
                  style={
                    styles.loggedSetInfo
                  }
                >
                  <Text
                    style={
                      styles.loggedSetTitle
                    }
                  >
                    {set.exercise}
                  </Text>
                  <Text
                    style={
                      styles.loggedSetMeta
                    }
                  >
                    {set.load} kg ·{' '}
                    {set.reps} repetições
                  </Text>
                </View>
              </View>
            )
          )}

          <PrimaryButton
            label="Finalizar treino"
            onPress={
              handleFinishWorkout
            }
          />

          <SecondaryButton
            label="Histórico de treinos"
            onPress={() =>
              navigation.navigate(
                'TrainingHistory'
              )
            }
          />

          <SecondaryButton
            label="Ver progresso"
            onPress={goProgress}
          />
        </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <DevNavBar
        activeRoute="WorkoutLog"
        onGoHome={() =>
          navigation.navigate('Home')
        }
        onGoTrainingPlan={() =>
          navigation.navigate(
            user?.role === 'ADMIN' || user?.role === 'PROFESSOR'
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

      <RestTimer
        duration={restDuration}
        onClose={() =>
          setRestDuration(null)
        }
      />
    </SafeAreaView>
  );
}
