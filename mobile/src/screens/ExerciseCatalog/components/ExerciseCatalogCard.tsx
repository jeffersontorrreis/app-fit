import React, { useState } from 'react';
import {
    Alert,
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


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MuscleGroup {
    muscleGroup: string; // Grupo muscular alvo, ex: "Peito".
}

interface ExerciseDetail {
    id: string; // ID unico para cada exercicio, usado como key na lista.
    muscleGroup: MuscleGroup[]; // Grupo muscular alvo, ex: "Peito".
    description: string; // Descricao do exercicio, ex: "Deitado em um banco, empurre a barra para cima...".
}

// Etapa 1 (dados): contrato de entrada do componente.
interface ExerciseDetailCardProps {
    title: string; // Titulo do exercicio. Supino reto
    exercises: ExerciseDetail[]; // Lista de exercicios registrados no treino.
    onEdit?: () => void;
    onDelete?: () => void;
}

export function ExerciseDetailCard({
    title,
    exercises,
    onEdit,   // Callback para abrir o modal de edição.
    onDelete, // Callback para excluir o exercício.
}: ExerciseDetailCardProps) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    // Etapa 2 (estado): controla se o card esta fechado (false) ou expandido (true).
    const [isExpanded, setIsExpanded] = useState(false);

    // Etapa 3 (interacao): ao clicar, anima e alterna o estado do card.
    const handleToggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded((prev) => !prev);
    };

    // Etapa 3.1 (interacao): confirmacao antes de excluir para evitar exclusao acidental.
    const handleDelete = () => {
        Alert.alert(
            'Excluir exercício',
            `Deseja excluir "${title}" do catálogo?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: onDelete },
            ]
        );
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
                </View>

                <View style={styles.chevronBadge}>
                    <Text style={styles.chevronText}>{isExpanded ? '-' : '+'}</Text>
                </View>
            </View>

            {/* Etapa 4.2 (UI condicional): detalhe so aparece quando isExpanded for true. */}
            {isExpanded ? (
                <View style={styles.detailsSection}>
                    {/* Grupo muscular em lista de chips para suportar multiplos grupamentos */}
                    {exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.metaSection}>
                            <Text style={styles.metaLabel}>Grupo Muscular</Text>
                            <View style={styles.muscleChipList}>
                                {exercise.muscleGroup.map((muscle) => (
                                    <View key={muscle.muscleGroup} style={styles.muscleChip}>
                                        <Text style={styles.muscleBadgeText}>{muscle.muscleGroup}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Descricao com rótulo proprio */}
                    {exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.descriptionBlock}>
                            <Text style={styles.metaLabel}>Descrição</Text>
                            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                        </View>
                    ))}

                    {/* Etapa 4.3 (UI de ação): botões só aparecem se os callbacks foram passados. */}
                    {(onEdit || onDelete) && (
                        <View style={styles.actionRow}>
                            {onEdit && (
                                <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                            )}
                            {onDelete && (
                                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                    <Text style={styles.deleteButtonText}>Excluir</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            ) : null}

            
        </TouchableOpacity>
    );
}

function createStyles(
    theme: AppTheme,
    isDarkMode: boolean
) {
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
    metaSection: {
        gap: spacing.sm,
    },
    metaLabel: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    muscleChipList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    muscleChip: {
        backgroundColor: isDarkMode
            ? 'rgba(18, 247, 122, 0.12)'
            : 'rgba(18, 247, 122, 0.18)',
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    muscleBadgeText: {
        color: theme.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
    },
    descriptionBlock: {
        gap: spacing.xs,
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: theme.surfaceVariant,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
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
    exerciseDescription: {
        color: theme.text,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.divider,
        paddingTop: spacing.md,
    },
    editButton: {
        flex: 1,
        backgroundColor: theme.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.primary,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    editButtonText: {
        color: theme.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: theme.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.error,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: theme.error,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
});
}
