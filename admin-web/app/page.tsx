'use client';

import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Verifica se é ADMIN no Firestore
      const collection = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLECTION ?? 'users';
      const snap = await getDoc(doc(db, collection, user.uid));
      if (!snap.exists()) {
        await auth.signOut();
        setError('Perfil não encontrado.');
        return;
      }

      const data = snap.data();
      if (data.role !== 'ADMIN') {
        await auth.signOut();
        setError('Acesso restrito a administradores.');
        return;
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto mb-6 flex w-full max-w-5xl justify-end">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex min-h-[72vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--brand)]">VivaFit</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Painel de suporte administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--brand)]"
                placeholder="admin@vivafit.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text)]">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--brand)]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-[var(--danger)]/50 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--brand)] py-2.5 font-semibold text-[#05120c] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
