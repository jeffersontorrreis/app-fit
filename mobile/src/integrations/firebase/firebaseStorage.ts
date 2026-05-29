import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';

import { getFirebaseApp } from './firebaseApp';

function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

/**
 * Faz upload de uma imagem em base64 (formato "data:image/...;base64,...")
 * para o Firebase Storage e retorna a URL pública de download.
 *
 * @param storagePath Caminho no Storage, ex: "users/uid123/profile.jpg"
 * @param base64DataUrl String base64 no formato data URL
 */
export async function uploadBase64Image(
  storagePath: string,
  base64DataUrl: string
): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, storagePath);
  await uploadString(storageRef, base64DataUrl, 'data_url');
  return getDownloadURL(storageRef);
}

/**
 * Remove um arquivo do Storage a partir do seu caminho.
 * Erros são ignorados (arquivo pode já ter sido deletado).
 */
export async function deleteStorageFile(storagePath: string): Promise<void> {
  try {
    const storage = getFirebaseStorage();
    await deleteObject(ref(storage, storagePath));
  } catch {
    // Ignora — arquivo pode não existir
  }
}
