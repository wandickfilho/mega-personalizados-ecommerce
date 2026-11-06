'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type AuthResult = { error: string | null };

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  signInWithGoogle: (next?: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, fullName?: string, next?: string) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (normalized.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (normalized.includes('user already registered')) return 'Este e-mail já possui uma conta.';
  if (normalized.includes('password should be')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (normalized.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  return message;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    client.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    const { data: subscription } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    async function ensureClient() {
      const client = getSupabaseBrowserClient();
      if (!client) return { client: null, error: 'A autenticação ainda não foi configurada. Preencha as variáveis do Supabase no ambiente.' };
      return { client, error: null };
    }

    return {
      configured,
      loading,
      user,
      async signInWithGoogle(next = '/conta') {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
        const result = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
        return { error: result.error ? friendlyError(result.error.message) : null };
      },
      async signUpWithEmail(email, password, fullName, next = '/conta') {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const result = await client.auth.signUp({
          email,
          password,
          options: {
            data: fullName ? { full_name: fullName } : undefined,
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (result.error) return { error: friendlyError(result.error.message) };
        return { error: null, needsConfirmation: !result.data.session };
      },
      async signInWithEmail(email, password) {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const result = await client.auth.signInWithPassword({ email, password });
        return { error: result.error ? friendlyError(result.error.message) : null };
      },
      async resetPassword(email) {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const result = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/redefinir-senha')}` });
        return { error: result.error ? friendlyError(result.error.message) : null };
      },
      async updatePassword(password) {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const result = await client.auth.updateUser({ password });
        return { error: result.error ? friendlyError(result.error.message) : null };
      },
      async signOut() {
        const { client, error } = await ensureClient();
        if (!client) return { error };
        const result = await client.auth.signOut();
        return { error: result.error ? friendlyError(result.error.message) : null };
      },
    };
  }, [configured, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
