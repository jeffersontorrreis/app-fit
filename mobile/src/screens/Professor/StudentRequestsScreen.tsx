import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  listPendingRequests,
  ProfessorRequest,
} from '../../integrations/firebase/firebaseProfessorRequests';

interface Props {
  navigation: any;
}

export function StudentRequestsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [requests, setRequests] = useState<ProfessorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listPendingRequests(user.uid);
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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
    badge: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    card: {
      marginHorizontal: 20,
      marginBottom: 12,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#f59e0b',
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
        <Text style={styles.title}>Novas Solicitações</Text>
        {requests.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{requests.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        onRefresh={load}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma solicitação pendente.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('RequestDetail', { requestId: item.id })
            }
          >
            <Text style={styles.name}>{item.alunoNome}</Text>
            <Text style={styles.meta}>{item.alunoEmail}</Text>
            <Text style={styles.meta}>
              Objetivo: {item.objetivo.length > 60
                ? item.objetivo.substring(0, 60) + '...'
                : item.objetivo}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
