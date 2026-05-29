import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '../../integrations/firebase/firebaseApp';

export type WorkoutEntry = {
    exercise_name: string;
    load: number;
    reps: number;
    set_number: number;
};

export type WorkoutSession = {
    id: string;
    user_uid: string | null;
    performed_at: string;
    entries: {
        id: string;
        exercise_name: string;
        load: number;
        reps: number;
        set_number: number;
    }[];
};

const COLLECTION = 'workoutSessions';

function db() {
    return getFirebaseFirestore();
}

export async function saveWorkoutSession(
    userUid: string,
    performedAt: string,
    entries: WorkoutEntry[]
): Promise<string> {
    const ref = await addDoc(collection(db(), COLLECTION), {
        performedAt,
        user_uid: userUid,
        user: {
            uid: userUid,
        },
        entries: entries.map((entry) => ({
            exercise_name: entry.exercise_name,
            load: entry.load,
            reps: entry.reps,
            set_number: entry.set_number,
        })),
        createdAt: new Date().toISOString(),
    });

    return ref.id;
}

export async function listWorkoutHistory(
    userUid: string
): Promise<WorkoutSession[]> {
    const q = query(
        collection(db(), COLLECTION),
        where('user.uid', '==', userUid)
    );

    const snap = await getDocs(q);

    return snap.docs
        .map((sessionDoc) => {
            const data = sessionDoc.data();
            const rawEntries = Array.isArray(data.entries) ? data.entries : [];

            const entries = rawEntries
                .map((entry, index) => ({
                    id: `${sessionDoc.id}_${index + 1}`,
                    exercise_name:
                        typeof entry?.exercise_name === 'string'
                            ? entry.exercise_name
                            : typeof entry?.exerciseName === 'string'
                              ? entry.exerciseName
                              : '',
                    load:
                        typeof entry?.load === 'number'
                            ? entry.load
                            : 0,
                    reps:
                        typeof entry?.reps === 'number'
                            ? entry.reps
                            : 0,
                    set_number:
                        typeof entry?.set_number === 'number'
                            ? entry.set_number
                            : typeof entry?.setNumber === 'number'
                              ? entry.setNumber
                              : index + 1,
                }))
                .filter((entry) => entry.exercise_name.length > 0)
                .sort((a, b) => a.set_number - b.set_number);

            return {
                id: sessionDoc.id,
                user_uid:
                    typeof data.user_uid === 'string'
                        ? data.user_uid
                        : typeof data.user?.uid === 'string'
                          ? data.user.uid
                          : null,
                performed_at:
                    typeof data.performedAt === 'string'
                        ? data.performedAt
                        : typeof data.performed_at === 'string'
                          ? data.performed_at
                          : '',
                entries,
            } as WorkoutSession;
        })
        .sort((a, b) => b.performed_at.localeCompare(a.performed_at));
}

export async function getExerciseProgress(
    userUid: string,
    exerciseName: string
) {
    const sessions = await listWorkoutHistory(userUid);
    const normalizedExercise = exerciseName.trim().toLowerCase();

    const progress = sessions
        .map((session) => {
            const loads = session.entries
                .filter(
                    (entry) =>
                        entry.exercise_name.trim().toLowerCase() === normalizedExercise
                )
                .map((entry) => entry.load);

            if (loads.length === 0) {
                return null;
            }

            const date = new Date(session.performed_at)
                .toLocaleDateString('pt-BR')
                .substring(0, 5);

            return {
                date,
                max_load: Math.max(...loads),
                performedAt: session.performed_at,
            };
        })
        .filter((item): item is { date: string; max_load: number; performedAt: string } => item !== null)
        .sort((a, b) => a.performedAt.localeCompare(b.performedAt))
        .slice(-15)
        .map(({ date, max_load }) => ({ date, max_load }));

    return progress as {
        date: string;
        max_load: number;
    }[];
}

export async function getAllExerciseNames(
    userUid: string
): Promise<string[]> {
    const sessions = await listWorkoutHistory(userUid);
    return Array.from(
        new Set(
            sessions.flatMap((session) =>
                session.entries.map((entry) => entry.exercise_name)
            )
        )
    ).sort((a, b) => a.localeCompare(b));
}

export async function seedTestData(
    userUid: string
) {
    const existing = await listWorkoutHistory(userUid);
    if (existing.length > 0) {
        return;
    }

    const today = new Date();
    const dates = [
        new Date(
            today.getTime() -
                4 * 24 * 60 * 60 * 1000
        ).toISOString(),
        new Date(
            today.getTime() -
                2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        today.toISOString(),
    ];

    for (let i = 0; i < dates.length; i++) {
        await saveWorkoutSession(userUid, dates[i], [
            {
                exercise_name: 'Supino Inclinado (Halteres)',
                load: 30 + i * 5,
                reps: 10,
                set_number: 1,
            },
            {
                exercise_name: 'Agachamento Livre',
                load: 50 + i * 10,
                reps: 8,
                set_number: 1,
            },
        ]);
    }
}
