import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AuthPanel from '@/components/auth/AuthPanel';

export default function LoginPage() {
  return <main className="checkout-page py-8 sm:py-14">
    <div className="section-shell max-w-6xl">
      <Link href="/" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar ao site</Link>
      <div className="auth-page-grid">
        <div className="auth-page-copy">
          <span className="premium-kicker">Conta Mega</span>
          <h1>Sua conta, suas criações.</h1>
          <p>Entre para finalizar pedidos, acompanhar solicitações e manter suas personalizações vinculadas ao seu histórico.</p>
          <ul>
            <li>Sessões reais protegidas pelo Supabase Auth.</li>
            <li>Pedidos e arquivos vinculados apenas à sua conta.</li>
            <li>Retorno automático ao checkout após o login.</li>
          </ul>
        </div>
        <AuthPanel redirectTo="/conta" title="Bem-vindo de volta" subtitle="Acesse com Google ou e-mail para continuar." />
      </div>
    </div>
  </main>;
}
