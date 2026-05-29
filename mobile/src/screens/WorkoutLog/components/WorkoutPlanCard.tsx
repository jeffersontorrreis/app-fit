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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PlanExercise {
    id: number;
    exercise_name: string;
    sets: number;
    reps: number;
}

interface WorkoutPlanCardProps {
    title: string;
    trainerName: string;
    exercises: PlanExercise[];
    selectedExercise: string | null;
    onSelectExercise: (name: string) => void;
}

export function WorkoutPlanCard({
    title,
    trainerName,
    exercises,
    selectedExercise,
    onSelectExercise,
}: WorkoutPlanCardProps) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded((prev) => !prev);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleToggle}
                style={styles.headerRow}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>
                        {trainerName ? `Treinador: ${trainerName}` : `${exercises.length} exercícios`}
                    </Text>
                </View>
                <View style={styles.chevronBadge}>
                    <Text style={styles.chevronText}>{isExpanded ? '−' : '+'}</Text>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.exerciseList}>
                    <Text style={styles.listLabel}>Selecione um exercício:</Text>
                    {exercises.map((ex) => {
                        const isSelected = selectedExercise === ex.exercise_name;
                        return (
                            <TouchableOpacity
                                key={ex.id}
                                activeOpacity={0.8}
                                onPress={() => onSelectExercise(ex.exercise_name)}
                                style={[styles.exerciseRow, isSelected && styles.exerciseRowSelected]}
                            >
                                <View style={styles.exerciseInfo}>
                                    <Text style={[styles.exerciseName, isSelected && styles.exerciseNameSelected]}>
                                        {ex.exercise_name}
                                    </Text>
                                    <Text style={styles.exerciseMeta}>
                                        {ex.sets} séries × {ex.reps} reps
                                    </Text>
                                </View>
                                <View style={[styles.selectBadge, isSelected && styles.selectBadgeActive]}>
                                    <Text style={[styles.selectBadgeText, isSelected && styles.selectBadgeTextActive]}>
                                        {isSelected ? '✓' : 'Selecionar'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
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
    },
    headerContent: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        color: theme.text,
        fontSize: typography.fontSize.base,
        fontWeight: '700',
    },
    subtitle: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    chevronBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.md,
    },
    chevronText: {
        color: theme.primary,
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        lineHeight: 20,
    },
    exerciseList: {
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingTop: spacing.md,
    },
    listLabel: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    exerciseRowSelected: {
        borderColor: theme.primary,
        backgroundColor: `${theme.primary}18`,
    },
    exerciseInfo: {
        flex: 1,
        gap: 2,
    },
    exerciseName: {
        color: theme.text,
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
    },
    exerciseNameSelected: {
        color: theme.primary,
    },
    exerciseMeta: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.xs,
    },
    selectBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        marginLeft: spacing.sm,
    },
    selectBadgeActive: {
        borderColor: theme.primary,
        backgroundColor: theme.primary,
    },
    selectBadgeText: {
        color: theme.textSecondary,
        fontSize: typography.fontSize.xs,
        fontWeight: '700',
    },
    selectBadgeTextActive: {
        color: theme.textInverse,
    },
});
}
