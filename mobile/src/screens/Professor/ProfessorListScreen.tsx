import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { listActiveProfessors } from '../../integrations/firebase/firebaseProfessorRequests';
import { FirebaseUserProfile } from '../../integrations/firebase/firebaseUserProfile';

interface Props {
  navigation: any;
}

export function ProfessorListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [professors, setProfessors] = useState<FirebaseUserProfile[]>([]);
  const [filtered, setFiltered] = useState<FirebaseUserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listActiveProfessors()
      .then((data) => {
        setProfessors(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      professors.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          (p.especialidade ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, professors]);

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
    specialty: { fontSize: 13, color: theme.textSecondary ?? '#888', marginTop: 4 },
    empty: { textAlign: 'center', color: theme.textSecondary ?? '#888', marginTop: 40 },
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
        <Text style={styles.title}>Professores</Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="Buscar por nome ou especialidade..."
        placeholderTextColor={theme.textSecondary ?? '#aaa'}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum professor encontrado.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProfessorProfile', { professor: item })
            }
          >
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.specialty}>
              {item.especialidade ?? 'Especialidade não informada'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
