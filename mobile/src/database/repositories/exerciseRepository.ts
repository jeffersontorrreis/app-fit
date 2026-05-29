import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '../../integrations/firebase/firebaseApp';

// Tipo que a UI espera receber — igual ao formato dos cards da tela de catálogo.
export type Exercise = {
    id: string;
    name: string;
    description: string;
    muscleGroups: string[]; // Array porque um exercício pode ter vários grupos
};

const COLLECTION = 'exercises';

function db() {
    return getFirebaseFirestore();
}

// ─────────────────────────────────────────────
// LEITURA
// ─────────────────────────────────────────────

// Retorna todos os exercícios do catálogo com seus grupos musculares.
export async function listExercisesWithMuscles(): Promise<Exercise[]> {
    const snap = await getDocs(collection(db(), COLLECTION));

    return snap.docs
        .map((exerciseDoc) => {
            const data = exerciseDoc.data();
            const rawMuscles = data.muscleGroups;
            const muscleGroups = Array.isArray(rawMuscles)
                ? rawMuscles.filter((value): value is string => typeof value === 'string')
                : [];

            return {
                id: exerciseDoc.id,
                name: typeof data.name === 'string' ? data.name : '',
                description: typeof data.description === 'string' ? data.description : '',
                muscleGroups,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

// ─────────────────────────────────────────────
// ESCRITA
// ─────────────────────────────────────────────

// Insere um novo exercício com seus grupos musculares em uma transação.
export async function createExercise(
    name: string,
    description: string,
    muscleGroups: string[]
): Promise<void> {
    await addDoc(collection(db(), COLLECTION), {
        name,
        description,
        muscleGroups,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
}

// Atualiza nome, descrição e grupos musculares de um exercício existente.
export async function updateExercise(
    id: string,
    name: string,
    description: string,
    muscleGroups: string[]
): Promise<void> {
    await updateDoc(doc(db(), COLLECTION, id), {
        name,
        description,
        muscleGroups,
        updatedAt: new Date().toISOString(),
    });
}

// Remove um exercício e seus grupos musculares do catálogo.
export async function deleteExercise(id: string): Promise<void> {
    await deleteDoc(doc(db(), COLLECTION, id));
}