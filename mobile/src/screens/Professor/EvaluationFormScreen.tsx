import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { addEvaluation } from '../../integrations/firebase/firebaseProfessorRequests';

interface Props {
  navigation: any;
  route: { params: { alunoUid: string; alunoNome: string } };
}

export function EvaluationFormScreen({ navigation, route }: Props) {
  const { alunoUid, alunoNome } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();

  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    if (fotos.length >= 4) {
      Alert.alert('Limite', 'Máximo de 4 fotos por avaliação.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0].base64) {
      setFotos((prev) => [...prev, `data:image/jpeg;base64,${result.assets[0].base64}`]);
    }
  }

  function removePhoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSalvar() {
    if (!peso || !altura) {
      Alert.alert('Obrigatório', 'Preencha peso e altura.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await addEvaluation({
        alunoUid,
        professorUid: user.uid,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        fotos,
        observacoes,
      });
      Alert.alert('Salvo!', 'Reavaliação registrada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary ?? '#888',
      marginHorizontal: 20,
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.text,
      backgroundColor: theme.surface,
      marginBottom: 12,
      marginHorizontal: 20,
    },
    row: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 12 },
    flex1: { flex: 1 },
    inputInRow: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.text,
      backgroundColor: theme.surface,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    fotosRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    fotoWrapper: { position: 'relative' },
    foto: { width: 90, height: 120, borderRadius: 10 },
    removeBtn: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: '#dc2626',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    addFotoBtn: {
      width: 90,
      height: 120,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addFotoBtnText: { color: theme.primary, fontSize: 28 },
    saveBtn: {
      marginHorizontal: 20,
      marginBottom: 32,
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nova Reavaliação</Text>
        </View>

        <Text style={styles.subtitle}>Aluno: {alunoNome}</Text>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <TextInput
              style={styles.inputInRow}
              placeholder="Peso (kg)"
              placeholderTextColor={theme.textSecondary ?? '#aaa'}
              value={peso}
              onChangeText={setPeso}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.flex1}>
            <TextInput
              style={styles.inputInRow}
              placeholder="Altura (cm)"
              placeholderTextColor={theme.textSecondary ?? '#aaa'}
              value={altura}
              onChangeText={setAltura}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          placeholder="Observações (opcional)"
          placeholderTextColor={theme.textSecondary ?? '#aaa'}
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <Text style={styles.label}>Fotos ({fotos.length}/4)</Text>
        <View style={styles.fotosRow}>
          {fotos.map((uri, i) => (
            <View key={i} style={styles.fotoWrapper}>
              <Image source={{ uri }} style={styles.foto} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePhoto(i)}
              >
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {fotos.length < 4 && (
            <TouchableOpacity style={styles.addFotoBtn} onPress={pickImage}>
              <Text style={styles.addFotoBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Reavaliação</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
