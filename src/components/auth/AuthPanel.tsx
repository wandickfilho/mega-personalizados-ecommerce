'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthProvider';

type Mode = 'login' | 'register' | 'recover';

export default function AuthPanel({ next, redirectTo, title = 'Acesse sua conta', subtitle = 'Entre para finalizar seu pedido com segurança e acompanhar suas solicitações.' }: { next?: string; redirectTo?: string; title?: string; subtitle?: string }) {
  const { configured, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function afterSuccess() {
    const destination = redirectTo ?? next;
    if (destination && destination !== pathname) router.push(destination);
    else router.refresh();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (mode !== 'recover' && password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Informe um e-mail válido.'); return; }
    setBusy(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error) setError(result.error);
        else afterSuccess();
      } else if (mode === 'register') {
        const result = await signUpWithEmail(email, password, name.trim() || undefined, next ?? redirectTo);
        if (result.error) setError(result.error);
        else if (result.needsConfirmation) setSuccess('Conta criada. Confira seu e-mail para confirmar o acesso antes de entrar.');
        else afterSuccess();
      } else {
        const result = await resetPassword(email);
        if (result.error) setError(result.error);
        else setSuccess('Enviamos um link de recuperação para o seu e-mail.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError('');
    setBusy(true);
    try {
      const result = await signInWithGoogle(next ?? redirectTo ?? '/conta');
      if (result.error) setError(result.error);
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-panel">
    <div className="auth-panel-head">
      <span className="auth-shield"><ShieldCheck className="h-5 w-5" /></span>
      <div><h2>{title}</h2><p>{subtitle}</p></div>
    </div>

    {!configured && <div className="auth-config-warning">
      <AlertCircle className="h-5 w-5" />
      <div>
        <strong>Autenticação aguardando configuração</strong>
        <p>Defina <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e <code>SUPABASE_SERVICE_ROLE_KEY</code> no ambiente. Nenhuma autenticação simulada será usada.</p>
      </div>
    </div>}

    {configured && <>
      <button type="button" onClick={() => void google()} disabled={busy} className="auth-google">
        <GoogleIcon /> Continuar com Google
      </button>
      <div className="auth-divider"><span>ou use seu e-mail</span></div>
    </>}

    <div className="auth-tabs" role="tablist" aria-label="Formas de acesso">
      <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Entrar</button>
      <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setSuccess(''); }}>Criar conta</button>
      <button type="button" role="tab" aria-selected={mode === 'recover'} className={mode === 'recover' ? 'active' : ''} onClick={() => { setMode('recover'); setError(''); setSuccess(''); }}>Recuperar</button>
    </div>

    <form onSubmit={(event) => void submit(event)} className="auth-form">
      {mode === 'register' && <label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como devemos chamar você?" autoComplete="name" /></label>}
      <label>E-mail<div className="auth-input"><Mail className="h-4 w-4" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" autoComplete="email" required /></div></label>
      {mode !== 'recover' && <label>Senha<div className="auth-input"><LockKeyhole className="h-4 w-4" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={6} /></div></label>}
      {error && <p className="auth-message error" role="alert"><AlertCircle className="h-4 w-4" /> {error}</p>}
      {success && <p className="auth-message success" role="status"><CheckCircle2 className="h-4 w-4" /> {success}</p>}
      <button type="submit" disabled={busy || !configured} className="auth-submit">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {mode === 'login' ? 'Entrar com e-mail' : mode === 'register' ? 'Criar minha conta' : 'Enviar link de recuperação'}
        {!busy && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>

    <p className="auth-privacy"><LockKeyhole className="h-3.5 w-3.5" /> Sessão protegida pelo Supabase Auth. Seus dados não são armazenados em texto puro no navegador.</p>
    <p className="auth-alt-link">Prefere ver os detalhes? <Link href="/conta">Minha conta e pedidos</Link></p>
  </div>;
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.29h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.57-5.15 3.57-8.64Z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z" /><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" /></svg>;
}
