'use client';

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  listPendingProfessors,
  listUsersByRole,
  approveProfessor,
  blockUser,
  unblockUser,
  getProfessorDocumentUrl,
  UserProfile,
} from '@/lib/users';

type Tab = 'pendentes' | 'professores' | 'alunos';

export default function DashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('pendentes');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [docModal, setDocModal] = useState<{ url: string; nome: string } | null>(null);
  const [docLoadingUid, setDocLoadingUid] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          router.push('/');
          return;
        }

        const collection = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLECTION ?? 'users';
        const snap = await getDoc(doc(db, collection, firebaseUser.uid));

        if (!snap.exists() || snap.data().role !== 'ADMIN') {
          await signOut(auth);
          router.push('/');
          return;
        }

        setAdminUser(firebaseUser);
      } catch (err) {
        console.error('Erro ao verificar admin:', err);
        setLoadError('Erro ao verificar permissoes. Tente recarregar a pagina.');
      } finally {
        setAuthChecked(true);
      }
    });

    return unsub;
  }, [router]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      if (tab === 'pendentes') {
        setUsers(await listPendingProfessors());
      } else if (tab === 'professores') {
        setUsers(await listUsersByRole('PROFESSOR'));
      } else {
        setUsers(await listUsersByRole('ALUNO'));
      }
    } catch (err) {
      console.error('Erro ao carregar usuarios:', err);
      setLoadError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (adminUser) loadUsers();
  }, [adminUser, loadUsers]);

  async function handleApprove(uid: string) {
    if (!adminUser) return;
    setActionLoading(uid + '_approve');
    await approveProfessor(uid, adminUser.uid);
    await loadUsers();
    setActionLoading(null);
  }

  async function handleBlock(uid: string) {
    setActionLoading(uid + '_block');
    await blockUser(uid);
    await loadUsers();
    setActionLoading(null);
  }

  async function handleUnblock(uid: string) {
    setActionLoading(uid + '_unblock');
    await unblockUser(uid);
    await loadUsers();
    setActionLoading(null);
  }

  async function handleViewDocument(uid: string, nome: string) {
    setDocLoadingUid(uid);

    try {
      const url = await getProfessorDocumentUrl(uid);
      if (url) {
        setDocModal({ url, nome });
      } else {
        setFeedbackMessage(
          'Documento nao encontrado para este professor. Peca um novo cadastro com foto do documento.'
        );
      }
    } finally {
      setDocLoadingUid(null);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    router.push('/');
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDENTE: 'bg-[var(--warning)]/20 text-[var(--warning)] border border-[var(--warning)]/40',
      ATIVO: 'bg-[var(--brand)]/20 text-[var(--brand)] border border-[var(--brand)]/40',
      BLOQUEADO: 'bg-[var(--danger)]/20 text-[var(--danger)] border border-[var(--danger)]/40',
    };

    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      {feedbackMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setFeedbackMessage(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">Documento</h2>
            <p className="mb-4 text-sm text-[var(--text-soft)]">{feedbackMessage}</p>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="w-full rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[#08140d] hover:bg-[var(--brand-strong)]"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {docModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDocModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-[var(--text)]">Documento - {docModal.nome}</h2>
              <button
                onClick={() => setDocModal(null)}
                className="text-xl text-[var(--text-soft)] hover:text-[var(--text)]"
              >
                x
              </button>
            </div>
            <img
              src={docModal.url}
              alt="Documento"
              className="max-h-[70vh] w-full rounded-xl border border-[var(--border)] object-contain"
            />
            <div className="mt-3 flex justify-end">
              <a
                href={docModal.url}
                download={`doc_${docModal.nome.replace(/\s+/g, '_')}.jpg`}
                className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[#08140d] hover:bg-[var(--brand-strong)]"
              >
                Baixar documento
              </a>
            </div>
          </div>
        </div>
      )}

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow)] md:px-6">
        <h1 className="text-xl font-bold text-[var(--brand)]">VivaFit Admin</h1>
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <span className="hidden text-sm text-[var(--text-soft)] md:inline">{adminUser?.email}</span>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-[var(--danger)]/50 px-3 py-2 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger)]/10"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl py-6 md:py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {(['pendentes', 'professores', 'alunos'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-[var(--brand)] text-[#07150d]'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-soft)] hover:border-[var(--brand)] hover:text-[var(--text)]'
              }`}
            >
              {t === 'pendentes' && 'Aguardando aprovacao'}
              {t === 'professores' && 'Professores'}
              {t === 'alunos' && 'Alunos'}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          {!authChecked || loading ? (
            <p className="p-8 text-center text-[var(--text-soft)]">Carregando...</p>
          ) : loadError ? (
            <div className="p-8 text-center">
              <p className="mb-3 text-[var(--danger)]">{loadError}</p>
              <button
                onClick={loadUsers}
                className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[#08140d] hover:bg-[var(--brand-strong)]"
              >
                Tentar novamente
              </button>
            </div>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-[var(--text-soft)]">Nenhum registro encontrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-soft)]">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">Nome</th>
                    <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">E-mail</th>
                    {tab !== 'alunos' && (
                      <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">Especialidade</th>
                    )}
                    {tab === 'pendentes' && (
                      <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">Documento (CNH/RG)</th>
                    )}
                    <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-[var(--text-soft)]">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/60">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-[var(--surface-soft)]/70">
                      <td className="px-6 py-4 font-medium text-[var(--text)]">{u.nome}</td>
                      <td className="px-6 py-4 text-[var(--text-soft)]">{u.email}</td>
                      {tab !== 'alunos' && (
                        <td className="px-6 py-4 text-[var(--text-soft)]">{u.especialidade ?? '-'}</td>
                      )}
                      {tab === 'pendentes' && (
                        <td className="px-6 py-4">
                          {u.documentoFotoUrl ? (
                            <button
                              onClick={() => handleViewDocument(u.uid, u.nome)}
                              disabled={docLoadingUid === u.uid}
                              className="rounded-xl border border-[var(--brand)]/45 bg-[var(--brand)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand)]/20 disabled:opacity-50"
                            >
                              {docLoadingUid === u.uid ? 'Carregando...' : 'Ver documento'}
                            </button>
                          ) : (
                            <span className="text-xs italic text-[var(--text-soft)]">Sem documento</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4">{statusBadge(u.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {u.status === 'PENDENTE' && (
                            <button
                              onClick={() => handleApprove(u.uid)}
                              disabled={actionLoading === u.uid + '_approve'}
                              className="rounded-xl bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-[#06140d] hover:bg-[var(--brand-strong)] disabled:opacity-50"
                            >
                              {actionLoading === u.uid + '_approve' ? '...' : 'Aprovar'}
                            </button>
                          )}
                          {u.status !== 'BLOQUEADO' && (
                            <button
                              onClick={() => handleBlock(u.uid)}
                              disabled={actionLoading === u.uid + '_block'}
                              className="rounded-xl bg-[var(--danger)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                            >
                              {actionLoading === u.uid + '_block' ? '...' : 'Bloquear'}
                            </button>
                          )}
                          {u.status === 'BLOQUEADO' && (
                            <button
                              onClick={() => handleUnblock(u.uid)}
                              disabled={actionLoading === u.uid + '_unblock'}
                              className="rounded-xl border border-[var(--brand)]/50 px-3 py-1 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand)]/20 disabled:opacity-50"
                            >
                              {actionLoading === u.uid + '_unblock' ? '...' : 'Desbloquear'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
