import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import {
  getRequest,
  updateRequestStatus,
  ProfessorRequest,
} from '../../integrations/firebase/firebaseProfessorRequests';

interface Props {
  navigation: any;
  route: { params: { requestId: string } };
}

export function RequestDetailScreen({ navigation, route }: Props) {
  const { requestId } = route.params;
  const { theme } = useTheme();
  const [request, setRequest] = useState<ProfessorRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getRequest(requestId)
      .then(setRequest)
      .finally(() => setLoading(false));
  }, [requestId]);

  async function handleDecision(accepted: boolean) {
    if (!request) return;
    Alert.alert(
      accepted ? 'Aceitar aluno?' : 'Recusar solicitação?',
      accepted
        ? `Confirma aceitar ${request.alunoNome} como seu aluno?`
        : `Confirma recusar a solicitação de ${request.alunoNome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: accepted ? 'default' : 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await updateRequestStatus(request.id, accepted ? 'ACEITO' : 'RECUSADO');
              Alert.alert(
                accepted ? 'Aluno aceito!' : 'Solicitação recusada',
                accepted
                  ? `${request.alunoNome} agora é seu aluno.`
                  : `A solicitação de ${request.alunoNome} foi recusada.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch {
              Alert.alert('Erro', 'Não foi possível processar. Tente novamente.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  }

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
    title: { fontSize: 20, fontWeight: '700', color: theme.text },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
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
      marginBottom: 12,
    },
    label: { fontSize: 12, color: theme.textSecondary ?? '#888', marginBottom: 2 },
    value: { fontSize: 15, color: theme.text, marginBottom: 10 },
    row: { flexDirection: 'row', gap: 10 },
    fotosRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    foto: { width: 120, height: 160, borderRadius: 10, flex: 1 },
    btnRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 32 },
    acceptBtn: {
      flex: 1,
      backgroundColor: '#16a34a',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    rejectBtn: {
      flex: 1,
      backgroundColor: '#dc2626',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  });

  if (loading || !request) {
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
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Solicitação</Text>
        </View>

        {/* Dados do aluno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Aluno</Text>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{request.alunoNome}</Text>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{request.alunoEmail}</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Peso</Text>
              <Text style={styles.value}>{request.peso} kg</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Altura</Text>
              <Text style={styles.value}>{request.altura} cm</Text>
            </View>
          </View>
        </View>

        {/* Objetivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo</Text>
          <Text style={styles.value}>{request.objetivo}</Text>
        </View>

        {/* Fotos */}
        {request.fotos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos Enviadas</Text>
            <View style={styles.fotosRow}>
              {request.fotos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.foto} resizeMode="cover" />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botões de ação */}
      {!actionLoading ? (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleDecision(false)}
          >
            <Text style={styles.btnText}>Recusar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleDecision(true)}
          >
            <Text style={styles.btnText}>Aceitar Aluno</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.btnRow, { justifyContent: 'center' }]}>
          <ActivityIndicator color={theme.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
