import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DevNavBar,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  savePlanForStudent,
} from '../../integrations/firebase/firebaseTrainingPlans';
import { createTrainingPlanStyles } from './styles';

interface TrainingPlanScreenProps {
  navigation: any;
  route?: { params?: { alunoUid?: string; alunoNome?: string } };
}

interface ExerciseItem {
  id: string;
  name: string;
  sets: string;
  reps: string;
}

export function TrainingPlanScreenAdmin({
  navigation,
  route,
}: TrainingPlanScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createTrainingPlanStyles(theme);

  const alunoUid = route?.params?.alunoUid;
  const alunoNome = route?.params?.alunoNome;

  const [planName, setPlanName] = useState('Treino A - Superiores');
  const [trainerName, setTrainerName] = useState('');
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);

  useEffect(() => {
    // Auto-preenche nome do professor como responsável
    if (user?.nome) {
      setTrainerName(user.nome);
    }
  }, [user]);

  const handleExerciseChange = (
    id: string,
    field: keyof Omit<
      ExerciseItem,
      'id'
    >,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: '',
        sets: '',
        reps: '',
      },
    ]);
  };

  const handleRemoveExercise = (
    id: string
  ) => {
    setExercises((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const handleSave =
    async () => {
      if (!planName.trim()) {
        Alert.alert(
          'Campo obrigatorio',
          'Informe o nome do plano antes de salvar.'
        );
        return;
      }

      if (!user) {
        Alert.alert(
          'Erro',
          'Faca login novamente para salvar o plano.'
        );
        return;
      }

      if (!alunoUid) {
        Alert.alert(
          'Aluno não selecionado',
          'Acesse a tela de um aluno e use o botão "Criar Plano de Treino".'
        );
        return;
      }

      try {
        const items = exercises.map(
          (exercise, index) => ({
            exercise_name: exercise.name,
            sets: Number(exercise.sets) || 0,
            reps: Number(exercise.reps) || 0,
            order_index: index,
          })
        );

        await savePlanForStudent({
          alunoUid,
          professorUid: user.uid,
          name: planName,
          trainerName,
          items,
        });

        Alert.alert(
          'Plano salvo',
          `Plano enviado para ${alunoNome ?? 'o aluno'} com sucesso!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('Erro ao salvar plano:', error);
        Alert.alert(
          'Erro',
          'Não foi possível salvar o plano. Tente novamente.'
        );
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
    >
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
          <Text style={styles.title}>
            {alunoNome ? `Plano para ${alunoNome}` : 'Plano de Treino'}
          </Text>
          <Text
            style={styles.subtitle}
          >
            Organize exercicios,
            series e repeticoes em
            uma ficha simples para
            consultar durante o
            treino.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View
            style={styles.summaryItem}
          >
            <Text
              style={
                styles.summaryValue
              }
            >
              {exercises.length}
            </Text>
            <Text
              style={
                styles.summaryLabel
              }
            >
              exercicios
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <Text
              style={
                styles.summaryValue
              }
            >
              AB
            </Text>
            <Text
              style={
                styles.summaryLabel
              }
            >
              modelo
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <Text
              style={
                styles.summaryValue
              }
            >
              ativo
            </Text>
            <Text
              style={
                styles.summaryLabel
              }
            >
              status
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Dados do plano
          </Text>

          <View
            style={styles.fieldGroup}
          >
            <Text style={styles.label}>
              Nome do plano
            </Text>
            <TextInput
              value={planName}
              onChangeText={setPlanName}
              placeholder="Ex: Treino A - Peito e triceps"
              placeholderTextColor={
                theme.placeholder
              }
              style={styles.input}
            />
          </View>

          <View
            style={styles.fieldGroup}
          >
            <Text style={styles.label}>
              Profissional responsavel
            </Text>
            <TextInput
              value={trainerName}
              onChangeText={
                setTrainerName
              }
              placeholder="Nome do profissional de Educacao Fisica"
              placeholderTextColor={
                theme.placeholder
              }
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Exercicios
            </Text>
            <Text
              style={
                styles.sectionCounter
              }
            >
              {exercises.length}{' '}
              cadastrados
            </Text>
          </View>

          {exercises.map(
            (exercise, index) => (
              <View
                key={exercise.id}
                style={
                  styles.exerciseCard
                }
              >
                <View
                  style={
                    styles.exerciseHeader
                  }
                >
                  <View
                    style={
                      styles.exerciseNumber
                    }
                  >
                    <Text
                      style={
                        styles.exerciseNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.exerciseTitleArea
                    }
                  >
                    <Text
                      style={
                        styles.exerciseTitle
                      }
                    >
                      {exercise.name ||
                        'Novo exercicio'}
                    </Text>
                    <Text
                      style={
                        styles.exerciseMeta
                      }
                    >
                      {exercise.sets || '0'}{' '}
                      series x{' '}
                      {exercise.reps || '0'}{' '}
                      repeticoes
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      handleRemoveExercise(
                        exercise.id
                      )
                    }
                    style={
                      styles.removeButton
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={
                        styles.removeButtonText
                      }
                    >
                      Remover
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={styles.fieldGroup}
                >
                  <Text
                    style={styles.label}
                  >
                    Exercicio
                  </Text>
                  <TextInput
                    value={exercise.name}
                    onChangeText={(
                      value
                    ) =>
                      handleExerciseChange(
                        exercise.id,
                        'name',
                        value
                      )
                    }
                    placeholder="Ex: Leg press 45"
                    placeholderTextColor={
                      theme.placeholder
                    }
                    style={styles.input}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.half}>
                    <Text
                      style={styles.label}
                    >
                      Series
                    </Text>
                    <TextInput
                      value={exercise.sets}
                      onChangeText={(
                        value
                      ) =>
                        handleExerciseChange(
                          exercise.id,
                          'sets',
                          value.replace(
                            /[^0-9]/g,
                            ''
                          )
                        )
                      }
                      placeholder="4"
                      placeholderTextColor={
                        theme.placeholder
                      }
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.half}>
                    <Text
                      style={styles.label}
                    >
                      Repeticoes
                    </Text>
                    <TextInput
                      value={exercise.reps}
                      onChangeText={(
                        value
                      ) =>
                        handleExerciseChange(
                          exercise.id,
                          'reps',
                          value.replace(
                            /[^0-9]/g,
                            ''
                          )
                        )
                      }
                      placeholder="10"
                      placeholderTextColor={
                        theme.placeholder
                      }
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>
            )
          )}

          <SecondaryButton
            label="Adicionar exercicio"
            onPress={handleAddExercise}
          />
        </View>

        <PrimaryButton
          label="Salvar plano"
          onPress={handleSave}
        />
      </ScrollView>

      <DevNavBar
        activeRoute="TrainingPlan"
        onGoHome={() =>
          navigation.navigate('Home')
        }
        onGoTrainingPlan={() =>
          navigation.navigate(
            'TrainingPlanAdmin'
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
