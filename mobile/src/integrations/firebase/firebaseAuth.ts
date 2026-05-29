import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Auth } from '@firebase/auth';
import { getAuth } from '@firebase/auth';

import { getFirebaseApp } from './firebaseApp';

const reactNativeAuth = require(
  '@firebase/auth/dist/rn/index.js'
) as {
  getReactNativePersistence: (
    storage: typeof AsyncStorage
  ) => unknown;
  initializeAuth: (
    app: ReturnType<
      typeof getFirebaseApp
    >,
    deps?: {
      persistence?: unknown;
    }
  ) => Auth;
};

let firebaseAuth: Auth | null =
  null;

export function getFirebaseAuth(): Auth {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const app = getFirebaseApp();

  try {
    firebaseAuth =
      reactNativeAuth.initializeAuth(
        app,
        {
          persistence:
            reactNativeAuth.getReactNativePersistence(
              AsyncStorage
            ),
        }
      );
  } catch {
    firebaseAuth = getAuth(app);
  }

  return firebaseAuth;
}
