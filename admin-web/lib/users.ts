import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole = 'ALUNO' | 'PROFESSOR' | 'ADMIN';
export type UserStatus = 'PENDENTE' | 'ATIVO' | 'BLOQUEADO';

export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  especialidade: string | null;
  /** Foto do documento (CNH ou RG) em base64 — enviada no cadastro do professor */
  documentoFotoUrl: string | null;
  createdAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
}

const COLLECTION = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLECTION ?? 'users';

/** Retorna todos os professores com status PENDENTE (sem o campo base64 para performance) */
export async function listPendingProfessors(): Promise<UserProfile[]> {
  const q = query(
    collection(db, COLLECTION),
    where('role', '==', 'PROFESSOR'),
    where('status', '==', 'PENDENTE')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      nome: data.nome ?? '',
      email: data.email ?? '',
      role: data.role,
      status: data.status,
      especialidade: data.especialidade ?? null,
      // Apenas indica se existe o documento, sem carregar o base64 na listagem
      documentoFotoUrl: data.documentoFotoUrl ? '__HAS_DOCUMENT__' : null,
      createdAt: data.createdAt ?? '',
      approvedBy: data.approvedBy ?? null,
      approvedAt: data.approvedAt ?? null,
    } as UserProfile;
  });
}

/** Busca o base64 do documento de um professor específico (coleção professorDocuments) */
export async function getProfessorDocumentUrl(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'professorDocuments', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return typeof data.documentoFotoUrl === 'string' ? data.documentoFotoUrl : null;
}

/** Retorna todos os usuários por role */
export async function listUsersByRole(role: UserRole): Promise<UserProfile[]> {
  const q = query(collection(db, COLLECTION), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
}

/** Aprova um professor: muda status para ATIVO */
export async function approveProfessor(
  uid: string,
  adminUid: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, uid), {
    status: 'ATIVO',
    approvedBy: adminUid,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/** Bloqueia qualquer usuário */
export async function blockUser(uid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, uid), {
    status: 'BLOQUEADO',
    updatedAt: new Date().toISOString(),
  });
}

/** Desbloqueia um usuário (volta para ATIVO) */
export async function unblockUser(uid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, uid), {
    status: 'ATIVO',
    updatedAt: new Date().toISOString(),
  });
}
