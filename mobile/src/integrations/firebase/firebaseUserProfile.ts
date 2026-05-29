import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import {
  getFirebaseFirestore,
} from './firebaseApp';

import { getUserCollectionName } from './firebaseConfig';

/**
 * Papel do usuário no sistema.
 * ALUNO     — usuário comum que treina.
 * PROFESSOR — personal trainer (requer aprovação do admin).
 * ADMIN     — administrador (acessa o painel web).
 */
export type UserRole = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

/**
 * Status de aprovação da conta.
 * PENDENTE  — aguardando aprovação (professores recém cadastrados).
 * ATIVO     — conta aprovada com acesso liberado.
 * BLOQUEADO — conta desativada pelo admin.
 */
export type UserStatus = 'PENDENTE' | 'ATIVO' | 'BLOQUEADO';

export interface FirebaseUserProfile {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dataNascimento: string | null;
  /** Peso corporal (kg) — apenas para ALUNO */
  pesoAtual: number | null;
  /** Especialidade — apenas para PROFESSOR */
  especialidade: string | null;
  // Foto de perfil armazenada como string base64 (sem Firebase Storage)
  photoUrl: string | null;
  /** Foto do documento (CNH ou RG) — base64 — apenas para PROFESSOR (para análise do CREF) */
  documentoFotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  /** UID do admin que aprovou a conta (apenas PROFESSOR) */
  approvedBy: string | null;
  /** ISO timestamp da aprovação (apenas PROFESSOR) */
  approvedAt: string | null;
}

export async function getFirebaseUserProfile(
  uid: string
): Promise<FirebaseUserProfile | null> {
  const db = getFirebaseFirestore();

  const snapshot = await getDoc(
    doc(
      db,
      getUserCollectionName(),
      uid
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  // Compatibilidade com documentos antigos que usavam 'perfil' + 'COMUM'
  const rawRole = data.role ?? data.perfil;
  let role: UserRole;
  if (rawRole === 'ADMIN') role = 'ADMIN';
  else if (rawRole === 'PROFESSOR') role = 'PROFESSOR';
  else role = 'ALUNO';

  const rawStatus = data.status;
  let status: UserStatus;
  if (rawStatus === 'PENDENTE') status = 'PENDENTE';
  else if (rawStatus === 'BLOQUEADO') status = 'BLOQUEADO';
  else status = 'ATIVO';

  return {
    uid,
    nome:
      typeof data.nome === 'string'
        ? data.nome
        : '',
    email:
      typeof data.email === 'string'
        ? data.email
        : '',
    role,
    status,
    dataNascimento:
      typeof data.dataNascimento === 'string'
        ? data.dataNascimento
        : null,
    pesoAtual:
      typeof data.pesoAtual === 'number'
        ? data.pesoAtual
        : null,
    especialidade:
      typeof data.especialidade === 'string'
        ? data.especialidade
        : null,
    // Lê o campo photoUrl; retorna null se ainda não existir no documento
    photoUrl:
      typeof data.photoUrl === 'string'
        ? data.photoUrl
        : null,
    documentoFotoUrl:
      typeof data.documentoFotoUrl === 'string'
        ? data.documentoFotoUrl
        : null,
    createdAt:
      typeof data.createdAt === 'string'
        ? data.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof data.updatedAt === 'string'
        ? data.updatedAt
        : new Date().toISOString(),
    approvedBy:
      typeof data.approvedBy === 'string'
        ? data.approvedBy
        : null,
    approvedAt:
      typeof data.approvedAt === 'string'
        ? data.approvedAt
        : null,
  };
}

export async function saveFirebaseUserProfile(
  profile: FirebaseUserProfile
): Promise<void> {
  const db = getFirebaseFirestore();

  await setDoc(
    doc(
      db,
      getUserCollectionName(),
      profile.uid
    ),
    profile,
    { merge: true }
  );
}

export async function deleteFirebaseUserProfile(
  uid: string
): Promise<void> {
  const db = getFirebaseFirestore();

  await deleteDoc(
    doc(
      db,
      getUserCollectionName(),
      uid
    )
  );
}
