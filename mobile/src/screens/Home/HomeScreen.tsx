import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevNavBar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { createHomeStyles } from './styles';


interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);

  const isProfessor = user?.role === 'PROFESSOR';
  const isAluno = user?.role === 'ALUNO';

  // Cards exclusivos do PROFESSOR
  const professorActions = [
    {
      id: 'students',
      title: 'Alunos',
      subtitle: 'Veja e gerencie seus alunos.',
      onPress: () => navigation.navigate('Students'),
    },
    {
      id: 'requests',
      title: 'Novas Solicitações',
      subtitle: 'Alunos aguardando sua resposta.',
      onPress: () => navigation.navigate('StudentRequests'),
    },
    {
      id: 'catalog',
      title: 'Catálogo de Exercícios',
      subtitle: 'Consulte opções para montar variações.',
      onPress: () => navigation.navigate('ExerciseCatalog'),
    },
  ];

  // Cards exclusivos do ALUNO
  const alunoActions = [
    {
      id: 'professor',
      title: 'Professor',
      subtitle: 'Encontre e solicite um personal trainer.',
      onPress: () => navigation.navigate('ProfessorList'),
    },
    {
      id: 'plan',
      title: 'Meu Plano',
      subtitle: 'Veja os planos criados pelo seu professor.',
      onPress: () => navigation.navigate('TrainingPlanUser'),
    },
    {
      id: 'log',
      title: 'Registro de Treino',
      subtitle: 'Registre cargas e repetições rapidamente.',
      onPress: () => navigation.navigate('WorkoutLog'),
    },
    {
      id: 'catalog',
      title: 'Catálogo de Exercícios',
      subtitle: 'Consulte opções para montar variações.',
      onPress: () => navigation.navigate('ExerciseCatalog'),
    },
    {
      id: 'logTraining',
      title: 'Histórico de Treino',
      subtitle: 'Revise seus treinos anteriores.',
      onPress: () => navigation.navigate('TrainingHistory'),
    },
    {
      id: 'progress',
      title: 'Ver Progresso',
      subtitle: 'Acompanhe sua evolução de carga e peso.',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      id: 'tutorial',
      title: 'Guia de Exercícios',
      subtitle: 'Aprenda a executar seus exercícios.',
      onPress: () => navigation.navigate('ExerciseTutorial'),
    },
    {
      id: 'account',
      title: 'Minha Conta',
      subtitle: 'Gerencie seus dados.',
      onPress: () => navigation.navigate('Account'),
    },
  ];

  const quickActions = isProfessor ? professorActions : alunoActions;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>
            Bem-vindo, {user?.nome || 'Usuário'}
          </Text>
          <Text style={styles.subtitle}>
            {isProfessor
              ? 'Gerencie seus alunos e treinamentos:'
              : 'Explore de forma rápida seus cards:'}
          </Text>

          <View style={styles.summaryRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.summaryItem}
                onPress={action.onPress}
                activeOpacity={0.85}
              >
                <Text style={styles.summaryValue}>{action.title}</Text>
                <Text style={styles.summaryLabel}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <DevNavBar
        activeRoute="Home"
        onGoHome={() => navigation.navigate('Home')}
        onGoTrainingPlan={() =>
          navigation.navigate(isProfessor ? 'TrainingPlanAdmin' : 'TrainingPlanUser')
        }
        onGoWorkoutLog={() => navigation.navigate('WorkoutLog')}
        onGoAccount={() => navigation.navigate('Account')}
        visibleItems={isProfessor ? ['Home', 'Account'] : ['Home', 'TrainingPlan', 'WorkoutLog', 'Account']}
      />
    </SafeAreaView>
  );
}

