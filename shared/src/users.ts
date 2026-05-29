/**
 * Papéis de usuário no sistema VivaFit.
 *
 * ALUNO    — usuário comum que treina. Acessa o app mobile.
 * PROFESSOR — personal trainer. Acessa o app mobile após aprovação.
 * ADMIN    — administrador. Acessa apenas o painel web.
 */
export type UserRole = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

/**
 * Status de aprovação da conta.
 *
 * PENDENTE  — conta de professor aguardando aprovação do admin.
 * ATIVO     — conta aprovada e com acesso liberado.
 * BLOQUEADO — conta desativada pelo admin.
 */
export type UserStatus = 'PENDENTE' | 'ATIVO' | 'BLOQUEADO';

/**
 * Perfil completo do usuário salvo no Firestore.
 * Fonte de verdade para papel, status e dados de identificação.
 */
export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dataNascimento: string | null;
  /** Peso corporal (kg) — preenchido apenas para ALUNO */
  pesoAtual: number | null;
  /** Especialidade ou cargo — preenchido apenas para PROFESSOR */
  especialidade: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  /** UID do admin que aprovou a conta (apenas PROFESSOR) */
  approvedBy: string | null;
  /** ISO timestamp da aprovação (apenas PROFESSOR) */
  approvedAt: string | null;
}

/**
 * Payload mínimo necessário para criar um usuário no cadastro.
 */
export interface SignUpPayload {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  dataNascimento: string;
  pesoAtual?: number | null;
  especialidade?: string | null;
}

/**
 * Resposta padrão de operações assíncronas com erro amigável.
 */
export interface OperationResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}
