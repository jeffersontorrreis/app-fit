import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';
import { getUserCollectionName } from './firebaseConfig';
import { FirebaseUserProfile } from './firebaseUserProfile';

const db = () => getFirebaseFirestore();

export type RequestStatus = 'PENDENTE' | 'ACEITO' | 'RECUSADO';

export interface ProfessorRequest {
  id: string;
  alunoUid: string;
  alunoNome: string;
  alunoEmail: string;
  professorUid: string;
  status: RequestStatus;
  objetivo: string;
  peso: number;
  altura: number;
  fotos: string[]; // base64 ou URLs
  createdAt: string;
  updatedAt: string;
}

export interface StudentEvaluation {
  id: string;
  alunoUid: string;
  professorUid: string;
  peso: number;
  altura: number;
  fotos: string[];
  observacoes: string;
  createdAt: string;
}

// ─── PROFESSORES ────────────────────────────────────────────

/** Lista todos os professores com status ATIVO */
export async function listActiveProfessors(): Promise<FirebaseUserProfile[]> {
  const q = query(
    collection(db(), getUserCollectionName()),
    where('role', '==', 'PROFESSOR'),
    where('status', '==', 'ATIVO')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FirebaseUserProfile));
}

// ─── SOLICITAÇÕES ────────────────────────────────────────────

/** Aluno envia solicitação para um professor */
export async function sendProfessorRequest(payload: {
  alunoUid: string;
  alunoNome: string;
  alunoEmail: string;
  professorUid: string;
  objetivo: string;
  peso: number;
  altura: number;
  fotos: string[];
}): Promise<string> {
  const ref = await addDoc(collection(db(), 'professorRequests'), {
    ...payload,
    status: 'PENDENTE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

/** Professor lista suas solicitações pendentes */
export async function listPendingRequests(professorUid: string): Promise<ProfessorRequest[]> {
  const q = query(
    collection(db(), 'professorRequests'),
    where('professorUid', '==', professorUid),
    where('status', '==', 'PENDENTE')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProfessorRequest));
}

/** Busca uma solicitação específica por ID */
export async function getRequest(requestId: string): Promise<ProfessorRequest | null> {
  const snap = await getDoc(doc(db(), 'professorRequests', requestId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ProfessorRequest;
}

/** Professor aceita ou recusa uma solicitação */
export async function updateRequestStatus(
  requestId: string,
  status: 'ACEITO' | 'RECUSADO'
): Promise<void> {
  await updateDoc(doc(db(), 'professorRequests', requestId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

// ─── ALUNOS DO PROFESSOR ─────────────────────────────────────

/** Lista alunos aceitos de um professor */
export async function listAcceptedStudents(professorUid: string): Promise<ProfessorRequest[]> {
  const q = query(
    collection(db(), 'professorRequests'),
    where('professorUid', '==', professorUid),
    where('status', '==', 'ACEITO')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProfessorRequest));
}

/** Busca perfil completo de um aluno pelo UID */
export async function getStudentProfile(uid: string): Promise<FirebaseUserProfile | null> {
  const snap = await getDoc(doc(db(), getUserCollectionName(), uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as FirebaseUserProfile;
}

/** Busca a solicitação inicial do aluno (avaliação inicial) */
export async function getInitialRequest(
  alunoUid: string,
  professorUid: string
): Promise<ProfessorRequest | null> {
  const q = query(
    collection(db(), 'professorRequests'),
    where('alunoUid', '==', alunoUid),
    where('professorUid', '==', professorUid),
    where('status', '==', 'ACEITO')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as ProfessorRequest;
}

// ─── AVALIAÇÕES ──────────────────────────────────────────────

/** Professor cria uma reavaliação do aluno */
export async function addEvaluation(payload: {
  alunoUid: string;
  professorUid: string;
  peso: number;
  altura: number;
  fotos: string[];
  observacoes: string;
}): Promise<string> {
  const ref = await addDoc(collection(db(), 'studentEvaluations'), {
    ...payload,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

/** Lista avaliações de um aluno feitas por um professor */
export async function listEvaluations(
  alunoUid: string,
  professorUid: string
): Promise<StudentEvaluation[]> {
  const q = query(
    collection(db(), 'studentEvaluations'),
    where('alunoUid', '==', alunoUid),
    where('professorUid', '==', professorUid)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as StudentEvaluation))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
