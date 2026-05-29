import React, { useState } from "react";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AppModal,
  Logo,
  PrimaryButton,
  SecondaryButton,
} from "../../components";

import { borderRadius, spacing, typography } from "../../config/styles";

import { PendingApprovalError, useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { UserRole } from "../../integrations/firebase/firebaseUserProfile";

interface SignUpScreenProps {
  navigation: any;
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Atencao");
  const [navigateAfterModal, setNavigateAfterModal] = useState(false);

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [documentoFotoUrl, setDocumentoFotoUrl] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("ALUNO");

  const { signUp } = useAuth();
  const { theme } = useTheme();
  const MAX_DOCUMENT_BYTES = 900 * 1024;

  const showModal = (title: string, message: string, goToLoginOnClose = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setNavigateAfterModal(goToLoginOnClose);
    setIsModalVisible(true);
  };

  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const compressDocumentFromUri = async (uri: string): Promise<string | null> => {
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.35, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!compressed.base64) return null;

    const base64SizeBytes = Math.ceil((compressed.base64.length * 3) / 4);
    if (base64SizeBytes > MAX_DOCUMENT_BYTES) {
      showModal(
        "Imagem muito grande",
        "A foto do documento ainda ficou grande. Tente aproximar mais e recortar apenas o documento."
      );
      return null;
    }

    return "data:image/jpeg;base64," + compressed.base64;
  };

  const pickDocument = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showModal("Permissao negada", "Permita o acesso a galeria nas configuracoes do dispositivo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const documento = await compressDocumentFromUri(result.assets[0].uri);
      if (documento) setDocumentoFotoUrl(documento);
    }
  };

  const takeDocumentPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showModal("Permissao negada", "Permita o acesso a camera nas configuracoes do dispositivo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const documento = await compressDocumentFromUri(result.assets[0].uri);
      if (documento) setDocumentoFotoUrl(documento);
    }
  };

  const realizarCadastro = async () => {
    if (!nome || !dataNascimento || !email || !senha) {
      showModal("Atencao", "Preencha todos os campos.");
      return;
    }

    if (role === "PROFESSOR" && !especialidade) {
      showModal("Atencao", "Informe sua especialidade.");
      return;
    }

    if (role === "PROFESSOR" && !documentoFotoUrl) {
      showModal("Documento obrigatorio", "Envie uma foto da sua CNH ou RG para que possamos validar seu CREF.");
      return;
    }

    try {
      await signUp({
        nome,
        dataNascimento,
        email,
        senha,
        role,
        especialidade: role === "PROFESSOR" ? especialidade : null,
        documentoFotoUrl: role === "PROFESSOR" ? documentoFotoUrl : null,
      });
      // Aluno: navegacao automatica pelo RootNavigator
    } catch (error) {
      const isPendingApproval =
        error instanceof PendingApprovalError ||
        (error instanceof Error && error.name === "PendingApprovalError") ||
        (typeof error === "object" &&
          error !== null &&
          "isPendingApproval" in error &&
          (error as { isPendingApproval?: boolean }).isPendingApproval === true);

      if (isPendingApproval) {
        showModal(
          "Cadastro enviado!",
          error instanceof Error
            ? error.message
            : "Seu acesso sera liberado apos a aprovacao da nossa equipe.",
          true
        );
        return;
      }
      showModal(
        "Atencao",
        error instanceof Error
          ? error.message
          : "Nao foi possivel realizar o cadastro."
      );
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing["3xl"],
    },
    logoContainer: { alignItems: "center", marginBottom: spacing["2xl"] },
    tagline: {
      fontSize: typography.fontSize.sm,
      color: theme.primary,
      marginTop: spacing.sm,
      fontWeight: "500",
      textAlign: "center",
    },
    title: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: "700",
      color: theme.text,
      marginBottom: spacing.sm,
      textAlign: "center",
    },
    subtitle: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: spacing["3xl"],
      lineHeight: 24,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: typography.fontSize.lg,
      fontWeight: "700",
      marginBottom: spacing.md,
      marginTop: spacing.md,
    },
    roleRow: {
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    roleButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      alignItems: "center",
    },
    roleButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: "700",
    },
    inputContainer: { marginBottom: spacing.lg },
    label: {
      color: theme.text,
      fontSize: typography.fontSize.sm,
      fontWeight: "600",
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      color: theme.text,
      fontSize: typography.fontSize.base,
    },
    pendingNote: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    pendingNoteText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: 20,
      textAlign: "center",
    },
    buttonContainer: { marginTop: spacing["2xl"] },
    footerText: {
      fontSize: typography.fontSize.xs,
      color: theme.textTertiary,
      textAlign: "center",
      marginTop: spacing["2xl"],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <AppModal
        visible={isModalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setIsModalVisible(false);
          if (navigateAfterModal) {
            setNavigateAfterModal(false);
            navigation.replace("SignIn");
          }
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Logo size="large" />
              <Text style={styles.tagline}>Treine. Evolua. Supere-se.</Text>
            </View>

            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Escolha seu perfil e comece sua jornada.
            </Text>

            {/* Seletor de papel */}
            <Text style={styles.sectionTitle}>Quem e voce?</Text>
            <View style={styles.roleRow}>
              {(["ALUNO", "PROFESSOR"] as UserRole[]).map((r) => {
                const selected = role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.roleButton,
                      {
                        borderColor: selected ? theme.primary : theme.border,
                        backgroundColor: selected
                          ? theme.primary + "22"
                          : theme.surface,
                      },
                    ]}
                    onPress={() => setRole(r)}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        { color: selected ? theme.primary : theme.textSecondary },
                      ]}
                    >
                      {r === "ALUNO" ? "Quero Treinar" : "Sou Personal"}
                    </Text>
                    
                  </TouchableOpacity>
                );
              })}
            </View>

            {role === "PROFESSOR" && (
              <View style={styles.pendingNote}>
                <Text style={styles.pendingNoteText}>
                  Seu cadastro passara por analise antes de liberar o acesso.
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Dados pessoais</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor={theme.placeholder}
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={theme.placeholder}
                value={dataNascimento}
                onChangeText={(v) => setDataNascimento(formatBirthDate(v))}
                keyboardType="numeric"
              />
            </View>

            {role === "PROFESSOR" && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Especialidade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Musculacao, Funcional..."
                  placeholderTextColor={theme.placeholder}
                  value={especialidade}
                  onChangeText={setEspecialidade}
                />
              </View>
            )}

            {role === "PROFESSOR" && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Documento de identidade (CNH ou RG) *
                </Text>
                <Text style={[styles.pendingNoteText, { marginBottom: spacing.md, textAlign: "left" }]}>
                  A foto do documento e usada para validar seu CREF. Somente a equipe de suporte tera acesso.
                </Text>

                {documentoFotoUrl ? (
                  <View>
                    <Image
                      source={{ uri: documentoFotoUrl }}
                      style={{
                        width: "100%",
                        height: 180,
                        borderRadius: borderRadius.lg,
                        marginBottom: spacing.sm,
                      }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setDocumentoFotoUrl(null)}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        backgroundColor: theme.surface,
                        borderRadius: borderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.border,
                      }}
                    >
                      <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                        Remover foto
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <TouchableOpacity
                      onPress={pickDocument}
                      style={{
                        flex: 1,
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.lg,
                        borderWidth: 1,
                        borderColor: theme.primary,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>
                        Galeria
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={takeDocumentPhoto}
                      style={{
                        flex: 1,
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.lg,
                        borderWidth: 1,
                        borderColor: theme.primary,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>
                        Camera
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>Conta</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor={theme.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                label="Cadastrar"
                onPress={realizarCadastro}
                style={{ marginBottom: spacing.md }}
              />
              <SecondaryButton label="Voltar" onPress={() => navigation.goBack()} />
            </View>

            <Text style={styles.footerText}>
              © 2026 VivaFit. Todos os direitos reservados.
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

