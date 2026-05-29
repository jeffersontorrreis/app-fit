import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

import { getFirebaseAuth } from '../../integrations/firebase/firebaseAuth';
import { getFirebaseFirestore } from '../../integrations/firebase/firebaseApp';

export type TrainingPlanItem = {
    id?: string;
    exercise_name: string;
    sets: number;
    reps: number;
    order_index: number;
};

export type TrainingPlan = {
    id: string;
    user_uid: string | null;
    name: string;
    trainer_name: string;
    created_by_admin: number;
    created_at: string;
    items: TrainingPlanItem[];
};

const COLLECTION = 'trainingPlans';

function db() {
    return getFirebaseFirestore();
}

function mapTrainingPlan(planDoc: { id: string; data: () => any }): TrainingPlan {
    const data = planDoc.data();
    const rawItems = Array.isArray(data.items) ? data.items : [];

    return {
        id: planDoc.id,
        user_uid:
            typeof data.alunoUid === 'string'
                ? data.alunoUid
                : typeof data.user_uid === 'string'
                    ? data.user_uid
                    : null,
        name: typeof data.name === 'string' ? data.name : '',
        trainer_name:
            typeof data.trainerName === 'string'
                ? data.trainerName
                : typeof data.trainer_name === 'string'
                    ? data.trainer_name
                    : '',
        created_by_admin:
            typeof data.createdByAdmin === 'boolean'
                ? (data.createdByAdmin ? 1 : 0)
                : typeof data.created_by_admin === 'number'
                    ? data.created_by_admin
                    : 0,
        created_at:
            typeof data.createdAt === 'string'
                ? data.createdAt
                : typeof data.created_at === 'string'
                    ? data.created_at
                    : new Date().toISOString(),
        items: rawItems
            .map((item, index) => ({
                id: `${planDoc.id}_${index + 1}`,
                exercise_name:
                    typeof item?.exercise_name === 'string'
                        ? item.exercise_name
                        : '',
                sets:
                    typeof item?.sets === 'number'
                        ? item.sets
                        : 0,
                reps:
                    typeof item?.reps === 'number'
                        ? item.reps
                        : 0,
                order_index:
                    typeof item?.order_index === 'number'
                        ? item.order_index
                        : index,
            }))
            .filter((item) => item.exercise_name.length > 0)
            .sort((a, b) => a.order_index - b.order_index),
    };
}

export async function saveTrainingPlan(
    userUid: string,
    name: string,
    trainerName: string,
    items: Omit<TrainingPlanItem, 'id'>[],
    createdByAdmin: boolean = true
): Promise<void> {
    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
        throw new Error('Usuario autenticado nao encontrado.');
    }

    await addDoc(collection(db(), COLLECTION), {
        alunoUid: userUid,
        professorUid: currentUser.uid,
        name,
        trainerName,
        items,
        createdByAdmin,
        createdAt: new Date().toISOString(),
        // Campos legados para compatibilidade local
        user_uid: userUid,
        trainer_name: trainerName,
        created_by_admin: createdByAdmin ? 1 : 0,
        created_at: new Date().toISOString(),
    });
}

export async function loadLatestTrainingPlan(
    userUid: string
): Promise<TrainingPlan | null> {
    const q = query(
        collection(db(), COLLECTION),
        where('alunoUid', '==', userUid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        return null;
    }

    const latest = snap.docs
        .map((planDoc) => mapTrainingPlan(planDoc))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

    return latest ?? null;
}

export async function listAdminTrainingPlans(): Promise<TrainingPlan[]> {
    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
        return [];
    }

    const [asAlunoSnap, asProfessorSnap] = await Promise.all([
        getDocs(
            query(
                collection(db(), COLLECTION),
                where('alunoUid', '==', currentUser.uid)
            )
        ),
        getDocs(
            query(
                collection(db(), COLLECTION),
                where('professorUid', '==', currentUser.uid)
            )
        ),
    ]);

    const merged = new Map<string, TrainingPlan>();

    for (const planDoc of asAlunoSnap.docs) {
        merged.set(planDoc.id, mapTrainingPlan(planDoc));
    }

    for (const planDoc of asProfessorSnap.docs) {
        merged.set(planDoc.id, mapTrainingPlan(planDoc));
    }

    return Array.from(merged.values()).sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
    );
}
