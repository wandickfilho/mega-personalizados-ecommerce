'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ResetPasswordPage() {
  const { updatePassword, configured, user } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('As senhas não conferem.'); return; }
    setBusy(true);
    const result = await updatePassword(password);
    setBusy(false);
    if (result.error) setError(result.error);
    else { setSuccess('Senha atualizada. Redirecionando...'); window.setTimeout(() => router.push('/conta'), 1200); }
  }

  return <main className="checkout-page py-8 sm:py-14">
    <div className="section-shell max-w-xl">
      <Link href="/entrar" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar ao acesso</Link>
      <div className="premium-panel mt-6 p-6 sm:p-8">
        <span className="auth-shield"><LockKeyhole className="h-5 w-5" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy">Definir nova senha</h1>
        <p className="mt-2 text-sm text-graphite/65">Use o link enviado ao seu e-mail para abrir esta página com uma sessão de recuperação válida.</p>
        {!configured && <p className="auth-config-warning mt-4"><AlertCircle className="h-5 w-5" /> Configure o Supabase Auth para usar a recuperação de senha.</p>}
        {configured && !user && <p className="auth-message error mt-4"><AlertCircle className="h-4 w-4" /> Abra esta página pelo link de recuperação enviado ao seu e-mail.</p>}
        <form onSubmit={(event) => void submit(event)} className="auth-form mt-5">
          <label>Nova senha<div className="auth-input"><LockKeyhole className="h-4 w-4" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} autoComplete="new-password" required /></div></label>
          <label>Confirmar senha<div className="auth-input"><LockKeyhole className="h-4 w-4" /><input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={6} autoComplete="new-password" required /></div></label>
          {error && <p className="auth-message error"><AlertCircle className="h-4 w-4" /> {error}</p>}
          {success && <p className="auth-message success"><CheckCircle2 className="h-4 w-4" /> {success}</p>}
          <button type="submit" disabled={busy || !configured || !user} className="auth-submit">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Atualizar senha</button>
        </form>
      </div>
    </div>
  </main>;
}
