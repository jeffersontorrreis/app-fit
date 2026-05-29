import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { borderRadius, spacing, typography } from '../../../config/styles';
import { AppTheme } from '../../../config/colors';
import { useTheme } from '../../../context/ThemeContext';

// Etapa 0 (plataforma): habilita animacao de layout no Android para suavizar expandir/recolher.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Etapa 1 (dados): contrato de cada exercicio exibido no detalhe do card.
interface WorkoutExercise {
    id: string; // ID unico para cada exercicio, usado como key na lista.
    name: string; // Nome do exercicio, ex: "Supino reto".
    load: string; // Carga utilizada, ex: "40kg". Pode ser string para incluir unidades ou simbolos.
}

// Etapa 1 (dados): contrato de entrada do componente.
interface PlanHistoryCardUserProps {
    title: string; // Titulo do treino, ex: "Treino A - Superiores".
    createdAt: string; // Data de criacao do treino, ex: "02/05/2026".
    exercises: WorkoutExercise[]; // Lista de exercicios registrados no treino.
}

export function PlanHistoryCardUser({
    title,
    createdAt,
    exercises,
}: PlanHistoryCardUserProps) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Etapa 2 (estado): controla se o card esta fechado (false) ou expandido (true).
    const [isExpanded, setIsExpanded] = useState(false);

    // Etapa 3 (interacao): ao clicar, anima e alterna o estado do card.
    const handleToggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded((prev) => !prev);
    };

    return (
        // Etapa 4 (UI base): area clicavel que dispara a interacao de expandir/recolher.
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleToggleExpand}
            style={styles.card}
        >
            {/* Etapa 4.1 (UI fechada): sempre visivel com titulo e resumo rapido. */}
            <View style={styles.headerRow}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>
                        {exercises.length} exercicios registrados
                    </Text>
                </View>

                <View style={styles.chevronBadge}>
                    <Text style={styles.chevronText}>{isExpanded ? '-' : '+'}</Text>
                </View>
            </View>

            {/* Etapa 4.2 (UI condicional): detalhe so aparece quando isExpanded for true. */}
            {isExpanded ? (
                <View style={styles.detailsSection}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Criado em</Text>
                        <Text style={styles.metaValue}>{createdAt}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Exercicios do plano</Text>

                    {/* Etapa 4.3 (UI de lista): renderiza cada exercicio com sua carga. */}
                    {exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseRow}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseLoad}>{exercise.load}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

function createStyles(theme: AppTheme) {
return StyleSheet.create({
    card: {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    headerContent: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        color: theme.text,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    subtitle: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    chevronBadge: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: theme.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chevronText: {
        color: theme.textInverse,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.fontSize.xl,
    },
    detailsSection: {
        borderTopWidth: 1,
        borderTopColor: theme.divider,
        paddingTop: spacing.md,
        gap: spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    metaLabel: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    metaValue: {
        color: theme.secondary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    sectionTitle: {
        color: theme.text,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        marginTop: spacing.xs,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: theme.surfaceVariant,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
    },
    exerciseName: {
        flex: 1,
        color: theme.text,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
    },
    exerciseLoad: {
        color: theme.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
    },
});
}
