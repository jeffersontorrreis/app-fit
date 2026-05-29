import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateEmail,
  updatePassword,
} from '@firebase/auth';

import { getFirebaseAuth } from '../integrations/firebase/firebaseAuth';
import {
  deleteFirebaseUserProfile,
  FirebaseUserProfile,
  getFirebaseUserProfile,
  saveFirebaseUserProfile,
  UserRole,
  UserStatus,
} from '../integrations/firebase/firebaseUserProfile';
import {
  getProfessorDocument,
  saveProfessorDocument,
} from '../integrations/firebase/firebaseProfessorDocuments';

export interface User {
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
  photoUrl: string | null;
}

/**
 * Lançado quando um professor conclui o cadastro mas ainda aguarda aprovação.
 * NÃO é uma falha — a tela deve mostrar mensagem de "em análise".
 */
export class PendingApprovalError extends Error {
  readonly isPendingApproval = true;
  constructor(message: string) {
    super(message);
    this.name = 'PendingApprovalError';
  }
}

interface SignUpPayload {
  nome: string;
  dataNascimento: string;
  email: string;
  senha: string;
  role: UserRole;
  pesoAtual?: number | null;
  especialidade?: string | null;
  /** Foto do documento (CNH ou RG) em base64 — obrigatório para PROFESSOR */
  documentoFotoUrl?: string | null;
}

interface UpdateProfilePayload {
  nome: string;
  email: string;
  dataNascimento: string;
  role: UserRole;
  pesoAtual?: number | null;
  especialidade?: string | null;
  novaSenha?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProfessor: boolean;
  isAluno: boolean;
  isInitializing: boolean;
  signIn: (
    email: string,
    senha: string
  ) => Promise<void>;
  signUp: (
    payload: SignUpPayload
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (
    payload: UpdateProfilePayload
  ) => Promise<void>;
  updatePhoto: (base64: string | null) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

function mapFirebaseError(
  error: unknown
): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este email ja esta cadastrado.';
      case 'auth/invalid-email':
        return 'Informe um email valido.';
      case 'auth/weak-password':
        return 'A senha precisa ter pelo menos 6 caracteres.';
      case 'auth/configuration-not-found':
        return 'Nao foi possivel entrar agora. Tente novamente em alguns instantes.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou senha invalidos.';
      case 'auth/requires-recent-login':
        return 'Por seguranca, faca login novamente antes de alterar email ou senha.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}

function toSessionUser(
  profile: FirebaseUserProfile
): User {
  return {
    uid: profile.uid,
    nome: profile.nome,
    email: profile.email,
    role: profile.role,
    status: profile.status,
    dataNascimento: profile.dataNascimento,
    pesoAtual: profile.pesoAtual,
    especialidade: profile.especialidade,
    photoUrl: profile.photoUrl,
  };
}

function buildRemoteProfile(
  uid: string,
  payload: {
    nome: string;
    email: string;
    role: UserRole;
    dataNascimento?: string | null;
    pesoAtual?: number | null;
    especialidade?: string | null;
    /** URL do Firebase Storage — já processada antes de chamar esta função */
    documentoFotoUrl?: string | null;
  },
  createdAt?: string
): FirebaseUserProfile {
  const now = new Date().toISOString();

  return {
    uid,
    nome: payload.nome,
    email: payload.email,
    role: payload.role,
    // Aluno entra ATIVO; professor entra PENDENTE até aprovação
    status: payload.role === 'PROFESSOR' ? 'PENDENTE' : 'ATIVO',
    dataNascimento: payload.dataNascimento ?? null,
    pesoAtual: payload.role === 'ALUNO' ? (payload.pesoAtual ?? null) : null,
    especialidade:
      payload.role === 'PROFESSOR' ? (payload.especialidade ?? null) : null,
    photoUrl: null,
    documentoFotoUrl:
      payload.role === 'PROFESSOR' ? (payload.documentoFotoUrl ?? null) : null,
    createdAt: createdAt ?? now,
    updatedAt: now,
    approvedBy: null,
    approvedAt: null,
  };
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [
    isInitializing,
    setIsInitializing,
  ] = useState(true);

  async function syncUserSession(
    uid: string
  ) {
    const remoteProfile =
      await getFirebaseUserProfile(uid);

    if (!remoteProfile) {
      throw new Error(
        'Nao foi possivel carregar sua conta agora. Tente novamente.'
      );
    }

    setUser(
      toSessionUser(remoteProfile)
    );
  }

  async function refreshUserProfile() {
    const auth = getFirebaseAuth();
    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      setUser(null);
      return;
    }

    await syncUserSession(
      currentUser.uid
    );
  }

  async function signIn(
    email: string,
    senha: string
  ) {
    const auth = getFirebaseAuth();

    const credential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

    const remoteProfile =
      await getFirebaseUserProfile(credential.user.uid);

    if (!remoteProfile) {
      await firebaseSignOut(auth);
      throw new Error(
        'Nao foi possivel carregar sua conta. Tente novamente.'
      );
    }

    // Admin so acessa pelo painel web
    if (remoteProfile.role === 'ADMIN') {
      await firebaseSignOut(auth);
      throw new Error(
        'Administradores devem acessar pelo painel web.'
      );
    }

    // Professor pendente ainda em analise
    if (
      remoteProfile.role === 'PROFESSOR' &&
      remoteProfile.status === 'PENDENTE'
    ) {
      await firebaseSignOut(auth);
      throw new Error(
        'Seu cadastro esta em analise pela nossa equipe de suporte.'
      );
    }

    // Conta bloqueada
    if (remoteProfile.status === 'BLOQUEADO') {
      await firebaseSignOut(auth);
      throw new Error(
        'Sua conta foi desativada. Entre em contato com o suporte.'
      );
    }

    setUser(toSessionUser(remoteProfile));
  }

  async function signUp(
    payload: SignUpPayload
  ) {
    const auth = getFirebaseAuth();

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        payload.email.trim(),
        payload.senha
      );

    const uid = credential.user.uid;

    // ─── ORDEM IMPORTANTE ─────────────────────────────────────────────────────
    // O documento do professor DEVE ser salvo ANTES do perfil em users/{uid}.
    // Motivo: ao salvar o perfil, o onAuthStateChanged detecta status PENDENTE e
    // faz signOut imediatamente (race condition). Se tentarmos salvar o documento
    // depois, o usuário já está deslogado e o Firestore rejeita com PERMISSION_DENIED.
    // ──────────────────────────────────────────────────────────────────────────
    if (payload.role === 'PROFESSOR' && payload.documentoFotoUrl) {
      try {
        await saveProfessorDocument(uid, payload.documentoFotoUrl);

        // Confirma persistência para evitar cadastro inconsistente sem documento
        const savedDocument = await getProfessorDocument(uid);
        if (!savedDocument?.documentoFotoUrl) {
          throw new Error('Documento nao foi persistido. Tente novamente.');
        }
      } catch (error) {
        // Rollback: remove o usuário do Auth (sem perfil ainda, pois não foi salvo)
        try {
          await deleteUser(credential.user);
        } catch {
          // Melhor esforço de rollback
        }

        const reason =
          error instanceof Error && error.message
            ? ` Detalhe: ${error.message}`
            : '';

        throw new Error(
          'Nao foi possivel salvar a foto do documento. Tente uma foto mais leve.' + reason
        );
      }
    }

    // Salva o perfil no Firestore DEPOIS do documento — isso dispara onAuthStateChanged
    // que faz signOut do professor (status PENDENTE), o que é esperado.
    const remoteProfile = buildRemoteProfile(
      uid,
      {
        nome: payload.nome,
        email: payload.email.trim(),
        role: payload.role,
        dataNascimento: payload.dataNascimento,
        pesoAtual: payload.pesoAtual,
        especialidade: payload.especialidade,
        documentoFotoUrl: payload.documentoFotoUrl ? 'HAS_DOCUMENT' : null,
      }
    );

    await saveFirebaseUserProfile(remoteProfile);

    if (payload.role === 'PROFESSOR') {
      // Professor nao entra no app imediatamente — aguarda aprovacao
      await firebaseSignOut(auth);
      throw new PendingApprovalError(
        'Cadastro realizado! Seu acesso sera liberado apos a aprovacao da nossa equipe.'
      );
    }

    setUser(toSessionUser(remoteProfile));
  }

  async function updateProfile(
    payload: UpdateProfilePayload
  ) {
    const auth = getFirebaseAuth();
    const currentUser =
      auth.currentUser;

    if (!currentUser || !user) {
      throw new Error(
        'Nenhum usuario autenticado.'
      );
    }

    const email =
      payload.email.trim();

    if (email !== currentUser.email) {
      await updateEmail(
        currentUser,
        email
      );
    }

    if (payload.novaSenha) {
      await updatePassword(
        currentUser,
        payload.novaSenha
      );
    }

    const existingProfile =
      await getFirebaseUserProfile(
        currentUser.uid
      );

    const remoteProfile =
      buildRemoteProfile(
        currentUser.uid,
        {
          nome: payload.nome,
          email,
          role: payload.role,
          dataNascimento: payload.dataNascimento,
          pesoAtual: payload.pesoAtual,
          especialidade: payload.especialidade,
        },
        existingProfile?.createdAt
      );

    await saveFirebaseUserProfile(remoteProfile);
    setUser(toSessionUser(remoteProfile));
  }

  // Salva a foto de perfil como base64 no Firestore e atualiza o estado local
  async function updatePhoto(
    base64: string | null
  ) {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !user) {
      throw new Error(
        'Nenhum usuario autenticado.'
      );
    }

    // Busca o perfil atual para não sobrescrever outros campos
    const existingProfile =
      await getFirebaseUserProfile(
        currentUser.uid
      );

    const now = new Date().toISOString();
    const updated: FirebaseUserProfile = {
      // Preserva todos os campos existentes e substitui so photoUrl
      ...(existingProfile ?? {
        uid: currentUser.uid,
        nome: user.nome,
        email: user.email,
        role: user.role,
        status: user.status,
        dataNascimento: user.dataNascimento,
        pesoAtual: user.pesoAtual,
        especialidade: user.especialidade,
        photoUrl: null,
        documentoFotoUrl: null,
        createdAt: now,
        approvedBy: null,
        approvedAt: null,
      }),
      photoUrl: base64,
      updatedAt: now,
    };

    await saveFirebaseUserProfile(updated);
    // Atualiza o contexto para a UI refletir a nova foto imediatamente
    setUser(toSessionUser(updated));
  }

  async function signOut() {
    await firebaseSignOut(
      getFirebaseAuth()
    );
    setUser(null);
  }

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        getFirebaseAuth(),
        async (firebaseUser) => {
          try {
            if (!firebaseUser) {
              setUser(null);
            } else {
              const remoteProfile =
                await getFirebaseUserProfile(firebaseUser.uid);

              if (!remoteProfile) {
                setUser(null);
                return;
              }

              // Nao restaura sessao para contas bloqueadas ou nao autorizadas no mobile
              if (
                remoteProfile.role === 'ADMIN' ||
                remoteProfile.status === 'BLOQUEADO' ||
                (remoteProfile.role === 'PROFESSOR' &&
                  remoteProfile.status === 'PENDENTE')
              ) {
                await firebaseSignOut(getFirebaseAuth());
                setUser(null);
                return;
              }

              setUser(toSessionUser(remoteProfile));
            }
          } catch (error) {
            console.error(
              'Erro ao sincronizar sessao:',
              error
            );
            setUser(null);
          } finally {
            setIsInitializing(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'ADMIN',
      isProfessor: user?.role === 'PROFESSOR',
      isAluno: user?.role === 'ALUNO',
      isInitializing,
      signIn: async (email: string, senha: string) => {
        try {
          await signIn(email, senha);
        } catch (error) {
          throw new Error(mapFirebaseError(error));
        }
      },
      signUp: async (payload: SignUpPayload) => {
        try {
          await signUp(payload);
        } catch (error) {
          // PendingApprovalError deve passar direto para a tela tratar
          const isPendingApproval =
            error instanceof PendingApprovalError ||
            (error instanceof Error && error.name === 'PendingApprovalError') ||
            (typeof error === 'object' &&
              error !== null &&
              'isPendingApproval' in error &&
              (error as { isPendingApproval?: boolean }).isPendingApproval === true);

          if (isPendingApproval) throw error;
          throw new Error(mapFirebaseError(error));
        }
      },
      signOut: async () => {
        try {
          await signOut();
        } catch (error) {
          throw new Error(
            mapFirebaseError(error)
          );
        }
      },
      updateProfile: async (
        payload: UpdateProfilePayload
      ) => {
        try {
          await updateProfile(payload);
        } catch (error) {
          throw new Error(
            mapFirebaseError(error)
          );
        }
      },
      updatePhoto: async (base64: string | null) => {
        try {
          await updatePhoto(base64);
        } catch (error) {
          throw new Error(
            mapFirebaseError(error)
          );
        }
      },
      refreshUserProfile,
    }),
    [user, isInitializing]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
