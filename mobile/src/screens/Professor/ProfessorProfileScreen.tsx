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
import { sendProfessorRequest } from '../../integrations/firebase/firebaseProfessorRequests';
import { FirebaseUserProfile } from '../../integrations/firebase/firebaseUserProfile';

interface Props {
  navigation: any;
  route: { params: { professor: FirebaseUserProfile } };
}

export function ProfessorProfileScreen({ navigation, route }: Props) {
  const { professor } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    if (fotos.length >= 2) {
      Alert.alert('Limite', 'Selecione no máximo 2 fotos.');
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

  async function handleSolicitar() {
    if (!objetivo.trim()) {
      Alert.alert('Obrigatório', 'Informe seu objetivo.');
      return;
    }
    if (!peso || !altura) {
      Alert.alert('Obrigatório', 'Informe peso e altura.');
      return;
    }
    if (fotos.length < 2) {
      Alert.alert('Fotos', 'Adicione pelo menos 2 fotos.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await sendProfessorRequest({
        alunoUid: user.uid,
        alunoNome: user.nome,
        alunoEmail: user.email,
        professorUid: professor.uid,
        objetivo,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        fotos,
      });
      Alert.alert(
        'Solicitação enviada!',
        `Sua solicitação foi enviada para ${professor.nome}. Aguarde a confirmação.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a solicitação. Tente novamente.');
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
    card: {
      margin: 20,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
    },
    name: { fontSize: 22, fontWeight: '800', color: theme.text },
    specialty: {
      fontSize: 15,
      color: theme.primary,
      marginTop: 6,
      fontWeight: '600',
    },
    divider: { height: 1, backgroundColor: theme.border, marginVertical: 16 },
    label: { fontSize: 13, color: theme.textSecondary ?? '#888', marginBottom: 2 },
    value: { fontSize: 15, color: theme.text },
    solicitarBtn: {
      marginHorizontal: 20,
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    solicitarBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    formSection: { marginHorizontal: 20, marginTop: 8 },
    formTitle: { fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 16 },
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
    },
    row: { flexDirection: 'row', gap: 10 },
    flex1: { flex: 1 },
    fotosRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    fotosThumb: { width: 80, height: 80, borderRadius: 10 },
    addFotoBtn: {
      width: 80,
      height: 80,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addFotoBtnText: { color: theme.primary, fontSize: 28 },
    submitBtn: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 32,
    },
    submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Perfil do Professor</Text>
        </View>

        {/* Card do professor */}
        <View style={styles.card}>
          <Text style={styles.name}>{professor.nome}</Text>
          <Text style={styles.specialty}>
            {professor.especialidade ?? 'Especialidade não informada'}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{professor.email}</Text>
        </View>

        {/* Botão de solicitar ou formulário */}
        {!showForm ? (
          <TouchableOpacity
            style={styles.solicitarBtn}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.solicitarBtnText}>Solicitar este Professor</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Preencha sua avaliação inicial</Text>

            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              placeholder="Qual é o seu objetivo? (ex: emagrecer, ganhar massa)"
              placeholderTextColor={theme.textSecondary ?? '#aaa'}
              value={objetivo}
              onChangeText={setObjetivo}
              multiline
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="Peso (kg)"
                placeholderTextColor={theme.textSecondary ?? '#aaa'}
                value={peso}
                onChangeText={setPeso}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="Altura (cm)"
                placeholderTextColor={theme.textSecondary ?? '#aaa'}
                value={altura}
                onChangeText={setAltura}
                keyboardType="decimal-pad"
              />
            </View>

            <Text style={[styles.label, { marginBottom: 8 }]}>
              Fotos atuais ({fotos.length}/2 — mínimo 2)
            </Text>
            <View style={styles.fotosRow}>
              {fotos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.fotosThumb} />
              ))}
              {fotos.length < 2 && (
                <TouchableOpacity style={styles.addFotoBtn} onPress={pickImage}>
                  <Text style={styles.addFotoBtnText}>+</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSolicitar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Enviar Solicitação</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
