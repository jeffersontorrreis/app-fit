import React, { useState } from "react";

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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  AppModal,
  Logo,
  PrimaryButton,
  SecondaryButton,
} from "../../components";

import { borderRadius, spacing, typography } from "../../config/styles";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface SignInScreenProps {
  navigation: any;
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const [modalMessage, setModalMessage] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const { signIn } = useAuth();
  const { theme } = useTheme();

  const showAttentionModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const realizarLogin = async () => {
    if (!email || !senha) {
      showAttentionModal("Preencha todos os campos.");
      return;
    }

    try {
      await signIn(email, senha);
      // Navigation happens automatically when user state changes
      // due to conditional rendering in RootNavigator
    } catch (error) {
      showAttentionModal(
        error instanceof Error
          ? error.message
          : "Nao foi possivel realizar o login.",
      );
    }
  };

  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing["3xl"],
    },

    logoContainer: {
      alignItems: "center",
      marginBottom: spacing["2xl"],
    },

    tagline: {
      fontSize: typography.fontSize.sm,
      color: theme.primary,
      marginTop: spacing.sm,
      fontWeight: "500",
      textAlign: "center",
    },

    subtitle: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: spacing["3xl"],
      lineHeight: 24,
    },

    formContainer: {},

    inputContainer: {
      marginBottom: spacing.lg,
    },

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

    buttonContainer: {
      marginTop: spacing["2xl"],
    },

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
        title="Atencao"
        message={modalMessage}
        onClose={() => setIsModalVisible(false)}
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

        <Text style={styles.subtitle}>Faca login para acessar sua conta.</Text>

        <View style={styles.formContainer}>
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
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label="Entrar"
            onPress={realizarLogin}
            style={{
              marginBottom: spacing.md,
            }}
          />

          <SecondaryButton label="Criar Conta" onPress={goToSignUp} />
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
