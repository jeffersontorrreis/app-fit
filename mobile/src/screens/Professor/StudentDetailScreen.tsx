import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  getInitialRequest,
  listEvaluations,
  ProfessorRequest,
  StudentEvaluation,
} from '../../integrations/firebase/firebaseProfessorRequests';
import {
  listPlansForStudent,
  FirebaseTrainingPlan,
} from '../../integrations/firebase/firebaseTrainingPlans';

interface Props {
  navigation: any;
  route: { params: { alunoUid: string; alunoNome: string } };
}

type Tab = 'avaliacao' | 'historico';

export function StudentDetailScreen({ navigation, route }: Props) {
  const { alunoUid, alunoNome } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();

  const [tab, setTab] = useState<Tab>('avaliacao');
  const [initialRequest, setInitialRequest] = useState<ProfessorRequest | null>(null);
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>([]);
  const [plans, setPlans] = useState<FirebaseTrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [req, evals, fetchedPlans] = await Promise.all([
        getInitialRequest(alunoUid, user.uid),
        listEvaluations(alunoUid, user.uid),
        listPlansForStudent(alunoUid, user.uid),
      ]);
      setInitialRequest(req);
      setEvaluations(evals);
      setPlans(fetchedPlans);
    } finally {
      setLoading(false);
    }
  }, [alunoUid, user]);

  useEffect(() => {
    load();
  }, [load]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    backBtn: { fontSize: 22, color: theme.primary },
    title: { fontSize: 20, fontWeight: '700', color: theme.text, flex: 1 },
    tabRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, gap: 10 },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tabText: { fontSize: 13, fontWeight: '600', color: theme.textSecondary ?? '#888' },
    tabTextActive: { color: '#fff' },
    section: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    label: { fontSize: 12, color: theme.textSecondary ?? '#888', marginBottom: 2 },
    value: { fontSize: 15, color: theme.text, marginBottom: 10 },
    row: { flexDirection: 'row', gap: 10 },
    fotosRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    foto: { height: 150, borderRadius: 10, flex: 1 },
    evalCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    evalDate: { fontSize: 12, color: theme.textSecondary ?? '#888', marginBottom: 6 },
    reavalBtn: {
      marginHorizontal: 20,
      marginBottom: 12,
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    planBtn: {
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    planBtnText: { color: theme.primary, fontWeight: '700', fontSize: 15 },
    reavalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    empty: { color: theme.textSecondary ?? '#888', textAlign: 'center', marginTop: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{alunoNome}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'avaliacao' && styles.tabActive]}
          onPress={() => setTab('avaliacao')}
        >
          <Text style={[styles.tabText, tab === 'avaliacao' && styles.tabTextActive]}>
            Avaliações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'historico' && styles.tabActive]}
          onPress={() => setTab('historico')}
        >
          <Text style={[styles.tabText, tab === 'historico' && styles.tabTextActive]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {tab === 'avaliacao' ? (
          <>
            {/* Avaliação inicial */}
            {initialRequest && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Avaliação Inicial</Text>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Peso</Text>
                      <Text style={styles.value}>{initialRequest.peso} kg</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Altura</Text>
                      <Text style={styles.value}>{initialRequest.altura} cm</Text>
                    </View>
                  </View>
                  <Text style={styles.label}>Objetivo</Text>
                  <Text style={styles.value}>{initialRequest.objetivo}</Text>
                  {initialRequest.fotos.length > 0 && (
                    <>
                      <Text style={styles.label}>Fotos iniciais</Text>
                      <View style={styles.fotosRow}>
                        {initialRequest.fotos.map((uri, i) => (
                          <Image key={i} source={{ uri }} style={styles.foto} resizeMode="cover" />
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </>
            )}

            {/* Reavaliações */}
            {evaluations.length > 0 && (
              <View style={[styles.section, { marginTop: 4 }]}>
                <Text style={styles.sectionTitle}>Reavaliações ({evaluations.length})</Text>
                {evaluations.map((ev) => (
                  <View key={ev.id} style={styles.evalCard}>
                    <Text style={styles.evalDate}>
                      {new Date(ev.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Peso</Text>
                        <Text style={styles.value}>{ev.peso} kg</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Altura</Text>
                        <Text style={styles.value}>{ev.altura} cm</Text>
                      </View>
                    </View>
                    {ev.observacoes ? (
                      <>
                        <Text style={styles.label}>Observações</Text>
                        <Text style={styles.value}>{ev.observacoes}</Text>
                      </>
                    ) : null}
                    {ev.fotos.length > 0 && (
                      <View style={styles.fotosRow}>
                        {ev.fotos.map((uri, i) => (
                          <Image key={i} source={{ uri }} style={styles.foto} resizeMode="cover" />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {!initialRequest && evaluations.length === 0 && (
              <Text style={styles.empty}>Nenhuma avaliação encontrada.</Text>
            )}
          </>
        ) : (
          /* Histórico — planos de treino criados por este professor para este aluno */
          <>
            {plans.length === 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Planos de Treino</Text>
                <Text style={styles.value}>
                  Nenhum plano criado ainda. Use o botão abaixo para criar o primeiro.
                </Text>
              </View>
            ) : (
              plans.map((plan) => (
                <View key={plan.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>{plan.name}</Text>
                  <Text style={styles.label}>
                    {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                  {plan.items.map((item, idx) => (
                    <Text key={idx} style={styles.value}>
                      {idx + 1}. {item.exercise_name} — {item.sets}x{item.reps}
                    </Text>
                  ))}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Botão de reavaliar */}
      <TouchableOpacity
        style={styles.reavalBtn}
        onPress={() =>
          navigation.navigate('EvaluationForm', { alunoUid, alunoNome })
        }
      >
        <Text style={styles.reavalBtnText}>+ Nova Reavaliação</Text>
      </TouchableOpacity>

      {/* Botão criar plano */}
      <TouchableOpacity
        style={styles.planBtn}
        onPress={() =>
          navigation.navigate('TrainingPlanAdmin', { alunoUid, alunoNome })
        }
      >
        <Text style={styles.planBtnText}>+ Criar Plano de Treino</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
