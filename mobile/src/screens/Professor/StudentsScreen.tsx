import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  listAcceptedStudents,
  ProfessorRequest,
} from '../../integrations/firebase/firebaseProfessorRequests';

interface Props {
  navigation: any;
}

export function StudentsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [students, setStudents] = useState<ProfessorRequest[]>([]);
  const [filtered, setFiltered] = useState<ProfessorRequest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listAcceptedStudents(user.uid);
      setStudents(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
      setSearch('');
    }, [load])
  );

  function handleSearch(text: string) {
    setSearch(text);
    const q = text.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          s.alunoNome.toLowerCase().includes(q) ||
          s.alunoEmail.toLowerCase().includes(q)
      )
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
    searchBox: {
      marginHorizontal: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.text,
      backgroundColor: theme.surface,
    },
    card: {
      marginHorizontal: 20,
      marginBottom: 12,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    name: { fontSize: 16, fontWeight: '700', color: theme.text },
    meta: { fontSize: 13, color: theme.textSecondary ?? '#888', marginTop: 4 },
    empty: {
      textAlign: 'center',
      color: theme.textSecondary ?? '#888',
      marginTop: 40,
      fontSize: 15,
    },
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
        <Text style={styles.title}>Meus Alunos</Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="Buscar aluno por nome ou e-mail..."
        placeholderTextColor={theme.textSecondary ?? '#aaa'}
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        onRefresh={load}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {search ? 'Nenhum aluno encontrado.' : 'Você ainda não tem alunos.'}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('StudentDetail', {
                alunoUid: item.alunoUid,
                alunoNome: item.alunoNome,
              })
            }
          >
            <Text style={styles.name}>{item.alunoNome}</Text>
            <Text style={styles.meta}>{item.alunoEmail}</Text>
            <Text style={styles.meta}>
              Objetivo: {item.objetivo.length > 50
                ? item.objetivo.substring(0, 50) + '...'
                : item.objetivo}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
