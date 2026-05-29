import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevNavBar, PrimaryButton } from '../../components';
import { createExerciseCatalogStyles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ExerciseDetailCard } from './components/ExerciseCatalogCard';
import { listExercisesWithMuscles, Exercise, updateExercise, deleteExercise } from '../../database/repositories/exerciseRepository';

interface ExerciseCatalogScreenProps {
  navigation: any;
}

export function ExerciseCatalogScreen({ navigation }: ExerciseCatalogScreenProps) {
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const styles = createExerciseCatalogStyles(theme, isDarkMode);
  // Lista de exercícios vinda do banco. Começa vazia.
  const [exercises, setExercises] = useState<Exercise[]>([]);
  // Controla o spinner enquanto carrega.
  const [loading, setLoading] = useState(true);
  // Editando exercício — null = modal fechado.
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  // Campos da edição, pega os dados do exercício selecionado.
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  // Grupos musculares como string separada por vírgula, igual ao padrão do TrainingPlanAdmin.
  const [editMuscles, setEditMuscles] = useState('');
  // Controla o spinner do botão Salvar enquanto grava no banco.
  const [saving, setSaving] = useState(false);

  // Carregamento dos exercícios separado para chamar após salvar/excluir.
  const loadExercises = () => {
    listExercisesWithMuscles()
      .then(setExercises)
      .finally(() => setLoading(false));
  };

  // Carrega exercícios do banco quando a tela abre
  useEffect(() => {
    loadExercises();
  }, []);

  // Preenche o formulário com os dados do exercício e abre o modal.
  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditName(exercise.name);
    setEditDescription(exercise.description);
    setEditMuscles(exercise.muscleGroups.join(', '));
  };

  // Fecha o modal e limpa o exercício em edição.
  const handleCloseModal = () => {
    setEditingExercise(null);
  };

  // Grava as alterações no banco e recarrega a lista.
  const handleSave = async () => {
    if (!editingExercise) return;
    if (!editName.trim() || !editDescription.trim()) return;

    // Converte "Peito, Tríceps" → ['Peito', 'Tríceps']
    const muscles = editMuscles
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await updateExercise(editingExercise.id, editName.trim(), editDescription.trim(), muscles);
      handleCloseModal();
      loadExercises();
    } finally {
      setSaving(false);
    }
  };

  // Remove o exercício do banco e recarrega a lista.
  const handleDelete = async (id: string) => {
    await deleteExercise(id);
    loadExercises();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Catálogo de Exercícios</Text>
        <Text style={styles.subtitle}>
          Toque no card para expandir e ver os detalhes do exercício.
        </Text>

        {/* Enquanto carrega, mostra spinner */}
        {loading && (
          <View style={{ paddingTop: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {/* Catálogo vazio após carregamento */}
        {!loading && exercises.length === 0 && (
          <Text style={styles.subtitle}>Nenhum exercício encontrado.</Text>
        )}

        {/* Lista de exercícios vindos do banco */}
        {exercises.map((exercise) => (
          <ExerciseDetailCard
            key={exercise.id}
            title={exercise.name}
            exercises={[
              {
                id: String(exercise.id),
                // Converte string[] para o formato { muscleGroup: string }[] que o card espera
                muscleGroup: exercise.muscleGroups.map((mg) => ({ muscleGroup: mg })),
                description: exercise.description,
              },
            ]}
            onEdit={() => handleEdit(exercise)}
            onDelete={() => handleDelete(exercise.id)}
          />
        ))}
      </ScrollView>

      {/* Modal de edição — bottom sheet seguindo o padrão de formulários do TrainingPlanAdmin. */}
      <Modal
        visible={editingExercise !== null}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay}>
              <View style={styles.sheet}>
            <Text style={styles.modalTitle}>Editar Exercício</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome do exercício"
              placeholderTextColor={theme.placeholder}
            />

            <Text style={styles.label}>Grupos Musculares</Text>
            <TextInput
              style={styles.input}
              value={editMuscles}
              onChangeText={setEditMuscles}
              placeholder="Ex: Peito, Tríceps"
              placeholderTextColor={theme.placeholder}
            />
            <Text style={styles.hint}>Separe múltiplos grupos por vírgula.</Text>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Descrição do exercício"
              placeholderTextColor={theme.placeholder}
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <PrimaryButton
                label="Salvar"
                onPress={handleSave}
                loading={saving}
                disabled={!editName.trim() || !editDescription.trim()}
                style={{ flex: 1 }}
              />
            </View>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

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
