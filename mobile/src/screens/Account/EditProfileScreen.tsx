import React, {
  useEffect,
  useState,
} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppModal,
  Logo,
  PrimaryButton,
  SecondaryButton,
} from '../../components';

import {
  borderRadius,
  spacing,
  typography,
} from '../../config/styles';
import { AppTheme } from '../../config/colors';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface EditProfileScreenProps {
  navigation: any;
}

function formatBirthDate(
  value: string
) {
  const digits = value
    .replace(/\D/g, '')
    .slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(
      0,
      2
    )}/${digits.slice(2)}`;
  }

  return `${digits.slice(
    0,
    2
  )}/${digits.slice(
    2,
    4
  )}/${digits.slice(4)}`;
}

export function EditProfileScreen({
  navigation,
}: EditProfileScreenProps) {
  const [
    modalMessage,
    setModalMessage,
  ] = useState('');

  const [
    isModalVisible,
    setIsModalVisible,
  ] = useState(false);

  const {
    user,
    updateProfile,
  } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [nome, setNome] =
    useState('');
  const [
    dataNascimento,
    setDataNascimento,
  ] = useState('');
  const [email, setEmail] =
    useState('');
  const [
    novaSenha,
    setNovaSenha,
  ] = useState('');
  const [perfil, setPerfil] =
    useState<'COMUM' | 'ADMIN'>(
      'COMUM'
    );
  const [pesoAtual, setPesoAtual] =
    useState('');
  const [cargo, setCargo] =
    useState('');

  const showAttentionModal = (
    message: string
  ) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setNome(user.nome);
    setDataNascimento(
      user.dataNascimento || ''
    );
    setEmail(user.email);
    setPerfil(user.perfil);
    setPesoAtual(
      user.pesoAtual !== null
        ? String(user.pesoAtual)
        : ''
    );
    setCargo(user.cargo || '');
    setNovaSenha('');
  }, [user]);

  const salvarAlteracoes =
    async () => {
      if (
        !nome ||
        !dataNascimento ||
        !email
      ) {
        showAttentionModal(
          'Preencha os campos obrigatorios.'
        );
        return;
      }

      if (
        perfil === 'COMUM' &&
        !pesoAtual
      ) {
        showAttentionModal(
          'Informe o peso atual.'
        );
        return;
      }

      if (
        perfil === 'ADMIN' &&
        !cargo
      ) {
        showAttentionModal(
          'Informe o cargo.'
        );
        return;
      }

      try {
        await updateProfile({
          nome,
          email,
          dataNascimento,
          perfil,
          pesoAtual:
            perfil === 'COMUM'
              ? Number(pesoAtual)
              : null,
          cargo:
            perfil === 'ADMIN'
              ? cargo
              : null,
          novaSenha:
            novaSenha || undefined,
        });

        navigation.goBack();
      } catch (error) {
        showAttentionModal(
          error instanceof Error
            ? error.message
            : 'Nao foi possivel salvar.'
        );
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppModal
        visible={isModalVisible}
        title="Atencao"
        message={modalMessage}
        onClose={() =>
          setIsModalVisible(false)
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >
        <View
          style={styles.logoContainer}
        >
          <Logo size="large" />

          <Text style={styles.tagline}>
            Treine. Evolua. Supere-se.
          </Text>
        </View>

        <Text style={styles.title}>
          Editar Perfil
        </Text>

        <Text
          style={styles.subtitle}
        >
          Atualize seus dados
          cadastrais.
        </Text>

        <View
          style={styles.inputContainer}
        >
          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor={
              theme.placeholder
            }
          />
        </View>

        <View
          style={styles.inputContainer}
        >
          <Text style={styles.label}>
            Data de nascimento
          </Text>

          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={(value) =>
              setDataNascimento(
                formatBirthDate(value)
              )
            }
            placeholder="DD/MM/AAAA"
            placeholderTextColor={
              theme.placeholder
            }
            keyboardType="numeric"
          />
        </View>

        {perfil === 'COMUM' && (
          <View
            style={
              styles.inputContainer
            }
          >
            <Text style={styles.label}>
              Peso atual
            </Text>

            <TextInput
              style={styles.input}
              value={pesoAtual}
              onChangeText={
                setPesoAtual
              }
              placeholder="Digite seu peso"
              placeholderTextColor={
                theme.placeholder
              }
              keyboardType="numeric"
            />
          </View>
        )}

        {perfil === 'ADMIN' && (
          <View
            style={
              styles.inputContainer
            }
          >
            <Text style={styles.label}>
              Cargo
            </Text>

            <TextInput
              style={styles.input}
              value={cargo}
              onChangeText={setCargo}
              placeholder="Digite seu cargo"
              placeholderTextColor={
                theme.placeholder
              }
            />
          </View>
        )}

        <View
          style={styles.inputContainer}
        >
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor={
              theme.placeholder
            }
            autoCapitalize="none"
          />
        </View>

        <View
          style={styles.inputContainer}
        >
          <Text style={styles.label}>
            Nova senha
          </Text>

          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            placeholder="Preencha so se quiser alterar"
            placeholderTextColor={
              theme.placeholder
            }
            secureTextEntry
          />
        </View>

        <View
          style={styles.buttonContainer}
        >
          <PrimaryButton
            label="Salvar Alteracoes"
            onPress={
              salvarAlteracoes
            }
            style={{
              marginBottom:
                spacing.md,
            }}
          />

          <SecondaryButton
            label="Voltar"
            onPress={() =>
              navigation.goBack()
            }
          />
        </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      theme.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal:
      spacing.lg,
    paddingVertical:
      spacing['3xl'],
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom:
      spacing['2xl'],
  },

  tagline: {
    fontSize:
      typography.fontSize.sm,
    color: theme.primary,
    marginTop: spacing.sm,
    fontWeight: '500',
    textAlign: 'center',
  },

  title: {
    fontSize:
      typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    fontSize:
      typography.fontSize.base,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom:
      spacing['3xl'],
    lineHeight: 24,
  },

  inputContainer: {
    marginBottom: spacing.lg,
  },

  label: {
    color: theme.text,
    fontSize:
      typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  input: {
    backgroundColor:
      theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius:
      borderRadius.lg,
    paddingHorizontal:
      spacing.md,
    paddingVertical:
      spacing.md,
    color: theme.text,
    fontSize:
      typography.fontSize.base,
  },

  buttonContainer: {
    marginTop:
      spacing['2xl'],
  },
  });
}
