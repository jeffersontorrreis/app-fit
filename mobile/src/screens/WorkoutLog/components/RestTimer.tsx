import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import { AppTheme } from '../../../config/colors';
import { borderRadius, spacing, typography } from '../../../config/styles';
import { useTheme } from '../../../context/ThemeContext';

interface RestTimerProps {
  duration: number | null;
  onClose: () => void;
}

// Opções de duração
export const REST_OPTIONS = [10, 60, 90, 120] as const;
export type RestOption = (typeof REST_OPTIONS)[number];

// Helpers

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

async function tocarAlarme() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      require('../../../../assets/alarme.mp3'),
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Se o arquivo não existir, usa só vibração
    console.warn('Som não encontrado, usando vibração:', error);
  }
  // Vibração de reforço
  Vibration.vibrate([0, 300, 100, 300, 100, 500]);
}

// Componente

export function RestTimer({ duration, onClose }: RestTimerProps) {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);

  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reinicia sempre que uma nova duração chegar
  useEffect(() => {
    if (duration === null) return;
    setRemaining(duration);
    setPaused(false);
  }, [duration]);

  // Contagem regressiva
  useEffect(() => {
    if (duration === null || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          tocarAlarme();
          return 0;
        }
        // Vibração curta nos últimos 3 segundos
        if (prev <= 4) Vibration.vibrate(80);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, paused]);

  // Pulso visual nos últimos 3 segundos
  useEffect(() => {
    if (remaining > 0 && remaining <= 3) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 250, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [remaining]);

  if (duration === null) return null;

  const progress = duration > 0 ? remaining / duration : 0;
  const isWarning = remaining <= 10 && remaining > 0;
  const isDone = remaining === 0;

  const timerColor = isDone
    ? theme.success
    : isWarning
    ? theme.error
    : theme.primary;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          <Text style={styles.title}>Descanse agora</Text>

          {/* Número grande do cronômetro */}
          <Animated.Text
            style={[styles.timerText, { color: timerColor, transform: [{ scale: pulseAnim }] }]}
          >
            {isDone ? 'VAI!' : formatTime(remaining)}
          </Animated.Text>

          {/* Barra de progresso */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` as any, backgroundColor: timerColor },
              ]}
            />
          </View>

          {isDone && (
            <Text style={styles.doneMessage}>
              Descanso concluído! Pronto para a próxima série?
            </Text>
          )}

          {/* Botões */}
          <View style={styles.buttons}>
            {!isDone && (
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setPaused((p) => !p)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSecondaryText}>
                  {paused ? '▶ Retomar' : '⏸ Pausar'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>
                {isDone ? 'Continuar' : 'Pular descanso'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

// Estilos

function createStyles(
  theme: AppTheme,
  isDarkMode: boolean
) {
return {
  overlay: {
    flex: 1,
    backgroundColor: isDarkMode
      ? 'rgba(0,0,0,0.80)'
      : 'rgba(5,5,5,0.42)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%' as const,
    gap: spacing.lg,
    alignItems: 'center' as const,
  },
  title: {
    color: theme.textSecondary,
    fontSize: typography.fontSize.lg,
    fontWeight: '600' as const,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '800' as const,
    letterSpacing: -2,
  },
  progressBar: {
    width: '100%' as const,
    height: 8,
    backgroundColor: theme.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: 8,
    borderRadius: borderRadius.full,
  },
  doneMessage: {
    color: theme.success,
    fontSize: typography.fontSize.base,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  buttons: {
    width: '100%' as const,
    gap: spacing.sm,
  },
  btnPrimary: {
    backgroundColor: theme.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
  },
  btnPrimaryText: {
    color: theme.textInverse,
    fontSize: typography.fontSize.base,
    fontWeight: '700' as const,
  },
  btnSecondary: {
    backgroundColor: theme.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
  },
  btnSecondaryText: {
    color: theme.text,
    fontSize: typography.fontSize.base,
    fontWeight: '700' as const,
  },
};
}
