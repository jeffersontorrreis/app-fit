import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { AppModal, DevNavBar } from "../../components";

import { AppTheme } from "../../config/colors";
import { borderRadius, spacing, typography } from "../../config/styles";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface AccountScreenProps {
  navigation: any;
}

type AccountStyles = ReturnType<typeof createStyles>;

function ProfileInfoCard({
  icon,
  label,
  value,
  styles,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  styles: AccountStyles;
  theme: AppTheme;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>

      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function AccountScreen({ navigation }: AccountScreenProps) {
  const [modalMessage, setModalMessage] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Controla o spinner enquanto a foto está sendo salva no Firestore
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // updatePhoto vem do AuthContext e persiste a foto no Firestore
  const { user, signOut, updatePhoto } = useAuth();

  const { theme, isDarkMode, toggleTheme } = useTheme();

  const styles = createStyles(theme, isDarkMode);

  const [nome, setNome] = useState("");

  const [dataNascimento, setDataNascimento] = useState("");

  const [email, setEmail] = useState("");

  const [perfil, setPerfil] = useState<"COMUM" | "ADMIN">("COMUM");

  const [pesoAtual, setPesoAtual] = useState("");

  const [cargo, setCargo] = useState("");

  const showAttentionModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setNome(user.nome);
    setDataNascimento(user.dataNascimento || "");
    setEmail(user.email);
    setPerfil(user.perfil);
    setPesoAtual(user.pesoAtual !== null ? String(user.pesoAtual) : "");
    setCargo(user.cargo || "");
  }, [user]);

  // Exibe o Alert com as opções de origem da foto
  const handlePickPhoto = async () => {
    const options: Parameters<typeof Alert.alert>[2] = [
      {
        text: "Galeria",
        onPress: () => pickImage("library"),
      },
      {
        text: "Camera",
        onPress: () => pickImage("camera"),
      },
      // Opção de remover só aparece quando já existe uma foto salva
      ...(user?.photoUrl
        ? [
            {
              text: "Remover foto",
              style: "destructive" as const,
              onPress: removePhoto,
            },
          ]
        : []),
      { text: "Cancelar", style: "cancel" as const },
    ];

    Alert.alert("Foto de perfil", "Escolha uma opcao", options);
  };

  // Remove a foto atual, voltando ao placeholder sem foto
  const removePhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      await updatePhoto(null);
    } catch (error) {
      showAttentionModal(
        error instanceof Error
          ? error.message
          : "Nao foi possivel remover a foto.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Pede permissão, abre câmera ou galeria, converte para base64 e salva
  const pickImage = async (source: "library" | "camera") => {
    // Pede a permissão adequada antes de abrir câmera ou galeria
    const permissionResult =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showAttentionModal(
        "Permissao necessaria para acessar " +
          (source === "camera" ? "a camera." : "a galeria."),
      );
      return;
    }

    // Abre câmera ou galeria com crop quadrado (1:1) e qualidade 50%
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true, // retorna a imagem já em base64
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
          });

    // Usuário cancelou ou a imagem não veio com base64
    if (result.canceled || !result.assets?.[0]?.base64) return;

    // Monta a string data-URI para poder usar como src de <Image>
    const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

    setIsUploadingPhoto(true);
    try {
      // Persiste no Firestore e atualiza o contexto global
      await updatePhoto(base64);
    } catch (error) {
      showAttentionModal(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a foto.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const realizarLogout = async () => {
    try {
      await signOut();
      // Navigation happens automatically when user state changes to null
      // due to conditional rendering in RootNavigator
    } catch (error) {
      showAttentionModal(
        error instanceof Error
          ? error.message
          : "Nao foi possivel sair da conta.",
      );
    }
  };

  const renderInfoCard = (
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    value: string,
  ) => (
    <ProfileInfoCard
      icon={icon}
      label={label}
      value={value}
      styles={styles}
      theme={theme}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppModal
        visible={isModalVisible}
        title="Atencao"
        message={modalMessage}
        onClose={() => setIsModalVisible(false)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          {/* Avatar tocável — abre câmera/galeria ao clicar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickPhoto}
            activeOpacity={0.8}
            disabled={isUploadingPhoto}
          >
            {/* Se já tem foto: mostra a imagem; senão: placeholder com ícone */}
            {user?.photoUrl ? (
              <Image
                source={{ uri: user.photoUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={44} color={theme.textSecondary} />
              </View>
            )}

            {/* Badge inferior direito: spinner durante upload, câmera quando ocioso */}
            <View style={styles.avatarCameraBadge}>
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color={theme.background} />
              ) : (
                <Ionicons name="camera" size={16} color={theme.background} />
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>{user?.nome || "Perfil"}</Text>

          <Text style={styles.subtitle}>{user?.email || ""}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus dados</Text>

          {renderInfoCard("person", "Nome", nome || "-")}

          {renderInfoCard("mail", "Email", email || "-")}

          {renderInfoCard(
            "calendar",
            "Data de nascimento",
            dataNascimento || "-",
          )}

          {perfil === "COMUM" &&
            renderInfoCard(
              "barbell",
              "Peso atual",
              pesoAtual ? `${pesoAtual} kg` : "-",
            )}

          {perfil === "ADMIN" &&
            renderInfoCard("briefcase", "Cargo", cargo || "-")}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <TouchableOpacity
            style={styles.themeCard}
            activeOpacity={0.85}
            onPress={toggleTheme}
          >
            <View style={styles.themeIcon}>
              <Ionicons
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={22}
                color={theme.primary}
              />
            </View>

            <View style={styles.themeCopy}>
              <Text style={styles.actionTitle}>Tema do app</Text>
              <Text style={styles.actionText}>
                Usando tema {isDarkMode ? "escuro" : "claro"}. Toque para
                alternar.
              </Text>
            </View>

            <View style={styles.themeSwitch}>
              <View
                style={[
                  styles.themeSwitchKnob,
                  !isDarkMode && styles.themeSwitchKnobLight,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Ionicons name="create-outline" size={22} color={theme.primary} />
              <Text style={styles.actionTitle}>Editar perfil</Text>
              <Text style={styles.actionText}>
                Abra a tela de edicao e atualize seus dados.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={realizarLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={theme.warning}
              />
              <Text style={styles.actionTitle}>Sair</Text>
              <Text style={styles.actionText}>
                Encerrar a sessao neste dispositivo.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navWrap}>
        <DevNavBar
          activeRoute="Account"
          onGoHome={() => navigation.navigate("Home")}
          onGoTrainingPlan={() =>
            navigation.navigate(
              user?.perfil === "ADMIN"
                ? "TrainingPlanAdmin"
                : "TrainingPlanUser",
            )
          }
          onGoWorkoutLog={() => navigation.navigate("WorkoutLog")}
          onGoAccount={() => navigation.navigate("Account")}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme, isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: 120,
    },
    heroCard: {
      position: "relative",
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderRadius: borderRadius["2xl"],
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing["2xl"],
      marginBottom: spacing.xl,
    },
    heroGlow: {
      position: "absolute",
      top: -50,
      right: -10,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDarkMode
        ? "rgba(18, 247, 122, 0.10)"
        : "rgba(18, 247, 122, 0.18)",
    },
    avatarContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: spacing.md,
    },
    avatarImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    avatarPlaceholder: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: isDarkMode
        ? "rgba(18, 247, 122, 0.10)"
        : "rgba(18, 247, 122, 0.16)",
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarCameraBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.surface,
    },
    title: {
      color: theme.text,
      fontSize: typography.fontSize["2xl"],
      fontWeight: "700",
      marginTop: spacing.md,
      textAlign: "center",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.base,
      marginTop: spacing.xs,
      textAlign: "center",
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: typography.fontSize.lg,
      fontWeight: "700",
      marginBottom: spacing.md,
    },
    infoCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    infoIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: isDarkMode
        ? "rgba(18, 247, 122, 0.10)"
        : "rgba(18, 247, 122, 0.16)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    infoCopy: {
      flex: 1,
    },
    infoLabel: {
      color: theme.textTertiary,
      fontSize: typography.fontSize.xs,
      marginBottom: 2,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    infoValue: {
      color: theme.text,
      fontSize: typography.fontSize.base,
      fontWeight: "600",
    },
    themeCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
    },
    themeIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDarkMode
        ? "rgba(18, 247, 122, 0.10)"
        : "rgba(18, 247, 122, 0.16)",
      marginRight: spacing.md,
    },
    themeCopy: {
      flex: 1,
    },
    themeSwitch: {
      width: 48,
      height: 28,
      borderRadius: 14,
      padding: 3,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
    },
    themeSwitchKnob: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignSelf: "flex-end",
    },
    themeSwitchKnobLight: {
      alignSelf: "flex-start",
    },
    actionsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    actionCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
    },
    actionTitle: {
      color: theme.text,
      fontSize: typography.fontSize.base,
      fontWeight: "700",
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    actionText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: 20,
    },
    navWrap: {
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 20,
    },
  });
}
