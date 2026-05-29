export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const requiredFirebaseEnv = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env
      .EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
} as const;

export function getFirebaseConfig():
  | FirebaseWebConfig
  | null {
  const hasAllRequiredValues =
    Object.values(
      requiredFirebaseEnv
    ).every(Boolean);

  if (!hasAllRequiredValues) {
    return null;
  }

  return {
    apiKey: requiredFirebaseEnv.apiKey!,
    authDomain:
      requiredFirebaseEnv.authDomain!,
    projectId:
      requiredFirebaseEnv.projectId!,
    storageBucket:
      requiredFirebaseEnv.storageBucket!,
    messagingSenderId:
      requiredFirebaseEnv.messagingSenderId!,
    appId: requiredFirebaseEnv.appId!,
    measurementId:
      process.env
        .EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured():
  boolean {
  return getFirebaseConfig() !== null;
}

export function getWorkoutCollectionName():
  string {
  return (
    process.env
      .EXPO_PUBLIC_FIREBASE_WORKOUT_COLLECTION ||
    'workoutSessions'
  );
}

export function getUserCollectionName():
  string {
  return (
    process.env
      .EXPO_PUBLIC_FIREBASE_USER_COLLECTION ||
    'users'
  );
}
