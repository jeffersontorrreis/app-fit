import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import {
  getFirebaseFirestore,
} from '../../integrations/firebase/firebaseApp';

import {
  getWorkoutCollectionName,
  isFirebaseConfigured,
} from '../../integrations/firebase/firebaseConfig';

import {
  CloudSyncResult,
  CompletedWorkoutPayload,
  WorkoutCloudRepository,
} from './contracts';

export function createFirebaseWorkoutCloudRepository():
  WorkoutCloudRepository {
  return {
    isEnabled:
      isFirebaseConfigured,

    async saveCompletedWorkout(
      payload: CompletedWorkoutPayload
    ): Promise<CloudSyncResult> {
      if (!isFirebaseConfigured()) {
        return {
          status: 'disabled',
          reason:
            'Firebase não configurado.',
        };
      }

      try {
        const db =
          getFirebaseFirestore();

        const docRef = await addDoc(
          collection(
            db,
            getWorkoutCollectionName()
          ),
          {
            localSessionId:
              payload.localSessionId,
            performedAt:
              payload.performedAt,
            source: 'expo-mobile',
            syncVersion: 1,
            createdAt:
              serverTimestamp(),
            user: payload.user
              ? {
                  uid: payload.user.uid,
                  nome: payload.user.nome,
                  email:
                    payload.user.email,
                  perfil:
                    payload.user.perfil,
                }
              : null,
            summary: {
              totalSets:
                payload.entries.length,
              exercises:
                Array.from(
                  new Set(
                    payload.entries.map(
                      (
                        entry
                      ) =>
                        entry.exercise_name
                    )
                  )
                ),
            },
            entries: payload.entries.map(
              (entry) => ({
                exerciseName:
                  entry.exercise_name,
                load: entry.load,
                reps: entry.reps,
                setNumber:
                  entry.set_number,
              })
            ),
          }
        );

        return {
          status: 'synced',
          remoteId: docRef.id,
        };
      } catch (error) {
        const reason =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido';

        return {
          status: 'failed',
          reason,
        };
      }
    },
  };
}
