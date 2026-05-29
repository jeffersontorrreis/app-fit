import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';

const db = () => getFirebaseFirestore();

export interface TrainingPlanItemFirebase {
  exercise_name: string;
  sets: number;
  reps: number;
  order_index: number;
}

export interface FirebaseTrainingPlan {
  id: string;
  alunoUid: string;
  professorUid: string;
  name: string;
  trainerName: string;
  createdAt: string;
  items: TrainingPlanItemFirebase[];
}

/** Professor salva um plano de treino para um aluno específico */
export async function savePlanForStudent(payload: {
  alunoUid: string;
  professorUid: string;
  name: string;
  trainerName: string;
  items: TrainingPlanItemFirebase[];
}): Promise<string> {
  const ref = await addDoc(collection(db(), 'trainingPlans'), {
    ...payload,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

/**
 * Aluno: lista TODOS os seus planos (de qualquer professor que aceitou).
 * Firestore rule garante que só o próprio aluno lê.
 */
export async function listMyPlans(alunoUid: string): Promise<FirebaseTrainingPlan[]> {
  const q = query(
    collection(db(), 'trainingPlans'),
    where('alunoUid', '==', alunoUid)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as FirebaseTrainingPlan))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Professor: lista planos que ele criou para um aluno específico.
 * Firestore rule garante que só o professor que criou lê.
 */
export async function listPlansForStudent(
  alunoUid: string,
  professorUid: string
): Promise<FirebaseTrainingPlan[]> {
  const q = query(
    collection(db(), 'trainingPlans'),
    where('alunoUid', '==', alunoUid),
    where('professorUid', '==', professorUid)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as FirebaseTrainingPlan))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
