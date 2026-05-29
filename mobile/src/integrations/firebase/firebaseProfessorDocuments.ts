/**
 * Cole\u00e7\u00e3o: professorDocuments
 *
 * Armazena a foto do documento (CNH ou RG) do professor em um documento
 * SEPARADO do perfil do usu\u00e1rio, evitando estourar o limite de 1 MB do
 * Firestore por documento e sem precisar do Firebase Storage (plano pago).
 *
 * Estrutura: professorDocuments/{uid} { uid, documentoFotoUrl, createdAt }
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';

const COLLECTION = 'professorDocuments';

export interface ProfessorDocument {
  uid: string;
  documentoFotoUrl: string;
  createdAt: string;
}

/** Salva (ou sobrescreve) o documento do professor. */
export async function saveProfessorDocument(
  uid: string,
  documentoFotoUrl: string
): Promise<void> {
  const db = getFirebaseFirestore();
  await setDoc(doc(db, COLLECTION, uid), {
    uid,
    documentoFotoUrl,
    createdAt: new Date().toISOString(),
  });
}

/** Busca o documento do professor. Retorna null se n\u00e3o existir. */
export async function getProfessorDocument(
  uid: string
): Promise<ProfessorDocument | null> {
  const db = getFirebaseFirestore();
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return snap.data() as ProfessorDocument;
}
