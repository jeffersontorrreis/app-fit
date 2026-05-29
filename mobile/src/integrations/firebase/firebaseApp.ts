import {
  FirebaseApp,
  getApps,
  initializeApp,
} from 'firebase/app';

import {
  Firestore,
  getFirestore,
} from 'firebase/firestore';

import { getFirebaseConfig } from './firebaseConfig';

let firebaseApp: FirebaseApp | null =
  null;

let firestoreDb: Firestore | null =
  null;

export function getFirebaseApp():
  FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = getFirebaseConfig();

  if (!config) {
    throw new Error(
      'Firebase não configurado. Defina as variáveis EXPO_PUBLIC_FIREBASE_* antes de usar a integração.'
    );
  }

  firebaseApp =
    getApps()[0] ??
    initializeApp(config);

  return firebaseApp;
}

export function getFirebaseFirestore():
  Firestore {
  if (firestoreDb) {
    return firestoreDb;
  }

  firestoreDb = getFirestore(
    getFirebaseApp()
  );

  return firestoreDb;
}
