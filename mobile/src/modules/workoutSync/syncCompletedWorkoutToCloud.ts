import {
  CloudSyncResult,
  CompletedWorkoutPayload,
} from './contracts';

import {
  createFirebaseWorkoutCloudRepository,
} from './firebaseWorkoutCloudRepository';

export async function syncCompletedWorkoutToCloud(
  payload: CompletedWorkoutPayload
): Promise<CloudSyncResult> {
  const repository =
    createFirebaseWorkoutCloudRepository();

  return repository
    .saveCompletedWorkout(payload);
}
