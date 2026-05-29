import { User } from '../../context/AuthContext';

export type WorkoutEntryPayload = {
  exercise_name: string;
  load: number;
  reps: number;
  set_number: number;
};

export type CompletedWorkoutPayload = {
  localSessionId: number;
  performedAt: string;
  entries: WorkoutEntryPayload[];
  user: User | null;
};

export type CloudSyncResult = {
  status: 'synced' | 'disabled' | 'failed';
  remoteId?: string;
  reason?: string;
};

export interface WorkoutCloudRepository {
  isEnabled: () => boolean;
  saveCompletedWorkout: (
    payload: CompletedWorkoutPayload
  ) => Promise<CloudSyncResult>;
}
