import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '../../integrations/firebase/firebaseApp';

export interface BodyWeightEntry {
    id?: string;
    user_uid?: string | null;
    date: string;
    value: number;
}

const COLLECTION = 'bodyWeightEntries';

function db() {
    return getFirebaseFirestore();
}

export async function saveWeight(
    userUid: string,
    value: number
): Promise<void> {
    const date = new Date()
        .toLocaleDateString('pt-BR')
        .substring(0, 5);

    await addDoc(collection(db(), COLLECTION), {
        user_uid: userUid,
        date,
        value,
        createdAt: new Date().toISOString(),
    });
}

export async function getWeightHistory(
    userUid: string
): Promise<BodyWeightEntry[]> {
    const q = query(
        collection(db(), COLLECTION),
        where('user_uid', '==', userUid)
    );

    const snap = await getDocs(q);

    return snap.docs
        .map((entryDoc) => {
            const data = entryDoc.data();
            return {
                id: entryDoc.id,
                user_uid:
                    typeof data.user_uid === 'string'
                        ? data.user_uid
                        : null,
                date:
                    typeof data.date === 'string'
                        ? data.date
                        : '',
                value:
                    typeof data.value === 'number'
                        ? data.value
                        : 0,
            } as BodyWeightEntry;
        })
        .sort((a, b) => {
            const aKey = a.id ?? '';
            const bKey = b.id ?? '';
            return bKey.localeCompare(aKey);
        })
        .slice(0, 50);
}
