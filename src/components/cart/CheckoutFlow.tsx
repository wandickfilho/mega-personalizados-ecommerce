'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ExternalLink, LockKeyhole, MapPin, MessageCircle, PackageCheck, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { ResolvedCartItem } from '@/lib/cart';
import { CONTACT } from '@/config/site';
import { getArtworkOriginal } from '@/lib/artworkStore';
import { dataUrlToBlob } from '@/lib/personalization';
import type { OrderPayload, OrderResponse } from '@/lib/orders';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthPanel from '@/components/auth/AuthPanel';
import OrderItemList from './OrderItemList';
import OrderSummary from './OrderSummary';

const steps = ['Carrinho', 'Identificação', 'Entrega', 'Pagamento', 'Confirmação'];
type FormFields = Record<string, string>;
const initialForm: FormFields = { firstName: '', lastName: '', email: '', phone: '', delivery: 'address', cep: '', street: '', number: '', neighborhood: '', city: '', state: '', complement: '', payment: 'quote' };

export default function CheckoutFlow({ items }: { items: ResolvedCartItem[] }) {
  const { user, configured } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const prefilled = useRef(false);

  useEffect(() => {
    if (!user || prefilled.current) return;
    prefilled.current = true;
    const metadata = user.user_metadata as { full_name?: string; name?: string } | undefined;
    const fullName = String(metadata?.full_name ?? metadata?.name ?? '').trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    setForm((current) => ({
      ...current,
      firstName: current.firstName || parts[0] || '',
      lastName: current.lastName || parts.slice(1).join(' ') || '',
      email: current.email || user.email || '',
      phone: current.phone || String(user.user_metadata?.phone ?? ''),
    }));
  }, [user]);

  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function lookupCep() {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) { setError('Informe um CEP válido com 8 dígitos.'); return; }
    setCepLoading(true);
    setError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const address = await response.json() as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (address.erro) { setError('CEP não encontrado. Preencha o endereço manualmente.'); return; }
      setForm((current) => ({ ...current, street: address.logradouro ?? current.street, neighborhood: address.bairro ?? current.neighborhood, city: address.localidade ?? current.city, state: address.uf ?? current.state }));
    } catch {
      setError('Não foi possível consultar o CEP. Preencha o endereço manualmente.');
    } finally {
      setCepLoading(false);
    }
  }

  function validateIdentity() {
    if (!form.firstName.trim() || !form.lastName.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.phone.replace(/\D/g, '').length < 10) {
      setError('Informe nome, sobrenome, e-mail válido e telefone com DDD.');
      return false;
    }
    return true;
  }

  function advance() {
    setError('');
    if (step === 1 && !user) { if (!configured) { setError('A autenticação precisa ser configurada para concluir o pedido.'); return; } setStep(2); return; }
    if (step === 2) {
      if (!user) { setError('Entre na sua conta para continuar.'); return; }
      if (!validateIdentity()) return;
    }
    if (step === 3 && form.delivery === 'address' && (!form.cep || !form.street || !form.number || !form.neighborhood || !form.city || !form.state)) {
      setError('Preencha os dados obrigatórios do endereço.');
      return;
    }
    setStep((current) => Math.min(5, current + 1));
  }

  async function submitOrder() {
    if (!user) { setError('Entre na sua conta para enviar o pedido.'); return; }
    if (!validateIdentity()) { setStep(2); return; }
    setSubmitting(true);
    setError('');
    try {
      const payload: OrderPayload = {
        customer: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim() },
        delivery: form.delivery === 'pickup' ? { method: 'pickup' } : {
          method: 'address',
          cep: form.cep, street: form.street, number: form.number, neighborhood: form.neighborhood, city: form.city, state: form.state, complement: form.complement,
        },
        payment: { method: 'quote', note: 'Solicitação de confirmação de orçamento e pagamento.' },
        items: items.map((item) => ({
          kind: item.kind,
          phoneId: item.phoneId,
          variantId: item.variantId,
          productId: item.productId,
          productSlug: item.productSlug,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          demonstrativePrice: item.demonstrativePrice,
          details: item.details,
          personalization: item.personalization ? {
            text: item.personalization.text,
            color: item.personalization.color,
            textColor: item.personalization.textColor,
            size: item.personalization.size,
            model: item.personalization.model,
            material: item.personalization.material,
            font: item.personalization.font,
            engraving: item.personalization.engraving,
            notes: item.personalization.notes,
            editor: item.personalization.editor,
            faceTexts: item.personalization.faceTexts,
            activeFace: item.personalization.activeFace,
            layers: (item.personalization.layers ?? []).map((layer) => ({
              id: layer.id,
              name: layer.name,
              fileName: layer.fileName,
              storageKey: layer.storageKey,
              naturalWidth: layer.naturalWidth,
              naturalHeight: layer.naturalHeight,
              baseWidth: layer.baseWidth,
              positionX: layer.positionX,
              positionY: layer.positionY,
              scale: layer.scale,
              rotation: layer.rotation,
            })),
          } : undefined,
        })),
      };

      const data = new FormData();
      data.set('payload', JSON.stringify(payload));
      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        const item = items[itemIndex];
        if (!item.personalization) continue;
        const layers = item.personalization.layers ?? [];
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
          const layer = layers[layerIndex];
          let blob: Blob | undefined;
          try { blob = await getArtworkOriginal(layer.storageKey); } catch { blob = undefined; }
          if (!blob && layer.preview) blob = dataUrlToBlob(layer.preview);
          if (blob) data.append(`art-${itemIndex}-${layerIndex}`, blob, layer.fileName);
        }
        const previewSource = item.personalization.previewImage || layers[0]?.preview;
        if (previewSource) data.append(`preview-${itemIndex}`, dataUrlToBlob(previewSource), `preview-${itemIndex}.webp`);
      }

      const response = await fetch('/api/orders', { method: 'POST', body: data });
      const result = await response.json() as OrderResponse & { error?: string };
      if (!response.ok) { setError(result.error ?? 'Não foi possível salvar o pedido.'); return; }
      setOrder(result);
      setStep(5);
    } catch {
      setError('Não foi possível enviar o pedido. Verifique sua conexão e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="checkout-page py-6 sm:py-10">
    <div className="section-shell max-w-6xl">
      <Link href="/carrinho" className="custom-back"><ArrowLeft className="h-4 w-4" /> Voltar ao carrinho</Link>
      <div className="premium-page-heading">
        <div><span className="premium-kicker"><LockKeyhole className="h-4 w-4" /> Checkout seguro</span><h1>Finalizar pedido</h1><p>Revise, identifique-se e envie sua personalização para a equipe Mega.</p></div>
        <div className="premium-secure-badge"><ShieldCheck className="h-5 w-5" /><span>Dados protegidos<br /><b>Pedido com confirmação humana</b></span></div>
      </div>

      <ol className="premium-steps" aria-label="Etapas do checkout">
        {steps.map((name, index) => {
          const number = index + 1;
          const state = step === number ? 'current' : step > number ? 'done' : 'upcoming';
          return <li key={name} className={state}>
            <span className="premium-step-dot">{step > number ? <Check className="h-3.5 w-3.5" /> : number}</span>
            <span className="premium-step-label">{name}</span>
          </li>;
        })}
      </ol>

      <div className="premium-checkout-grid">
        <section className="premium-panel premium-checkout-main">
          <div className="premium-panel-head"><div><span className="premium-step-eyebrow">Etapa {step} de 5</span><h2>{step === 2 && !user ? 'Acesso obrigatório' : steps[step - 1]}</h2></div>{user && <span className="premium-user-chip"><CheckCircle2 className="h-3.5 w-3.5" /> {user.email}</span>}</div>

          {step === 1 && <>
            <OrderItemList items={items} />
            <p className="premium-hint">Revise suas personalizações antes de continuar. O carrinho permanece salvo mesmo após entrar na conta.</p>
          </>}

          {step === 2 && <>
            {!user ? <>
              <div className="premium-auth-intro"><LockKeyhole className="h-5 w-5" /><div><strong>Entre para concluir a compra</strong><p>Você pode navegar e personalizar sem login. Para enviar o pedido, use Google ou e-mail.</p></div></div>
              <AuthPanel next="/finalizar-pedido" title="Identifique-se para continuar" subtitle="Sua sacola e suas personalizações serão preservadas após o acesso." />
            </> : <>
              <div className="checkout-fields premium-fields">
                <Field label="Nome" value={form.firstName} onChange={(value) => set('firstName', value)} required autoComplete="given-name" />
                <Field label="Sobrenome" value={form.lastName} onChange={(value) => set('lastName', value)} required autoComplete="family-name" />
                <Field label="E-mail" type="email" value={form.email} onChange={(value) => set('email', value)} required autoComplete="email" />
                <Field label="Telefone com DDD" value={form.phone} onChange={(value) => set('phone', value)} required autoComplete="tel" placeholder="(83) 99999-9999" />
              </div>
              <div className="premium-session-note"><ShieldCheck className="h-4 w-4" /> Sessão autenticada. Você pode editar os dados de contato do pedido.</div>
            </>}
          </>}

          {step === 3 && <div className="checkout-fields premium-fields">
            <div className="premium-delivery-options">
              <label className={`checkout-choice premium-choice ${form.delivery === 'address' ? 'selected' : ''}`}><input type="radio" checked={form.delivery === 'address'} onChange={() => set('delivery', 'address')} /><span><strong>Entrega no endereço</strong><small>A equipe confirma frete e prazo pelo WhatsApp.</small></span></label>
              <label className={`checkout-choice premium-choice ${form.delivery === 'pickup' ? 'selected' : ''}`}><input type="radio" checked={form.delivery === 'pickup'} onChange={() => set('delivery', 'pickup')} /><span><strong>Retirada na loja</strong><small>Sousa-PB, no endereço cadastrado da Mega.</small></span></label>
            </div>
            {form.delivery === 'pickup' ? <div className="premium-address-card"><MapPin className="h-5 w-5 text-brand" /><div><strong>Mega Eletrônicos & Personalizados</strong><p>{CONTACT.address}</p><p>{CONTACT.hours}</p></div></div> : <>
              <div className="premium-field-with-action"><Field label="CEP" value={form.cep} onChange={(value) => set('cep', value)} onBlur={() => void lookupCep()} required autoComplete="postal-code" /><button type="button" onClick={() => void lookupCep()} className="premium-cep-button" disabled={cepLoading}>{cepLoading ? 'Buscando...' : 'Buscar CEP'}</button></div>
              <Field label="Rua" value={form.street} onChange={(value) => set('street', value)} required autoComplete="address-line1" />
              <div className="premium-two-cols"><Field label="Número" value={form.number} onChange={(value) => set('number', value)} required autoComplete="address-line2" /><Field label="Complemento" value={form.complement} onChange={(value) => set('complement', value)} autoComplete="address-line3" /></div>
              <Field label="Bairro" value={form.neighborhood} onChange={(value) => set('neighborhood', value)} required autoComplete="address-level3" />
              <div className="premium-two-cols"><Field label="Cidade" value={form.city} onChange={(value) => set('city', value)} required autoComplete="address-level2" /><Field label="Estado" value={form.state} onChange={(value) => set('state', value)} required autoComplete="address-level1" /></div>
              <p className="premium-hint">O frete não é calculado automaticamente. A equipe informará valor e prazo antes da produção.</p>
            </>}
          </div>}

          {step === 4 && <div className="premium-payment">
            <label className="checkout-choice premium-choice selected"><input type="radio" checked readOnly /><span><strong>Confirmar orçamento com a equipe</strong><small>Pix, cartão e frete são combinados no atendimento.</small></span></label>
            <div className="premium-payment-note"><ShieldCheck className="h-5 w-5" /><div><strong>Nenhum pagamento será simulado</strong><p>Este pedido entra como solicitação. A Mega confirmará disponibilidade, arte, valor, frete e forma de pagamento antes de qualquer cobrança.</p></div></div>
            <div className="premium-order-mini"><span>Resumo</span><strong>{items.length} item(ns) · {items.reduce((total, item) => total + item.quantity, 0)} unidade(s)</strong><small>Valores sob consulta serão confirmados pela equipe.</small></div>
          </div>}

          {step === 5 && order && <div className="premium-confirmation">
            <div className="premium-confirmation-icon"><CheckCircle2 className="h-9 w-9" /></div>
            <span className="premium-kicker">Solicitação registrada</span>
            <h2>Pedido {order.orderNumber}</h2>
            <p>Recebemos sua personalização. A equipe Mega vai confirmar arte, disponibilidade, frete e pagamento antes da produção.</p>
            <div className="premium-confirmation-actions">
              {order.whatsappUrl ? <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="premium-primary"><MessageCircle className="h-4 w-4" /> Enviar pedido ao vendedor</a> : <div className="premium-warning"><MessageCircle className="h-4 w-4" /><span>O WhatsApp do vendedor ainda não está configurado. O pedido já está salvo e pode ser acessado pelo link abaixo.</span></div>}
              <a href={order.detailsUrl} target="_blank" rel="noreferrer" className="premium-secondary"><ExternalLink className="h-4 w-4" /> Ver detalhes e arquivos</a>
            </div>
            {!order.whatsappConfigured && <p className="premium-hint">Para habilitar o envio automático da mensagem, configure <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> e <code>NEXT_PUBLIC_SITE_URL</code>.</p>}
            <div className="premium-confirmation-summary"><PackageCheck className="h-5 w-5" /><div><strong>Entrega: {form.delivery === 'pickup' ? 'Retirada na loja' : 'Endereço informado'}</strong><span>Pagamento aguardando confirmação. Nenhuma cobrança foi realizada.</span></div></div>
          </div>}

          {error && <p className="auth-message error mt-5" role="alert">{error}</p>}

          {step < 5 && <div className="premium-checkout-actions">
            <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1} className="premium-secondary"><ArrowLeft className="h-4 w-4" /> Voltar</button>
            {step < 4 && <button type="button" onClick={advance} className="premium-primary">Continuar <ArrowRight className="h-4 w-4" /></button>}
            {step === 4 && <button type="button" onClick={() => void submitOrder()} disabled={submitting || !user || !configured} className="premium-primary">{submitting ? 'Enviando pedido...' : 'Enviar pedido'} <ArrowRight className="h-4 w-4" /></button>}
          </div>}
          {step === 5 && <Link href="/" className="premium-secondary mt-5 inline-flex"><ShoppingBag className="h-4 w-4" /> Voltar ao início</Link>}
        </section>

        <aside className="premium-checkout-aside">
          <OrderSummary items={items} />
          <div className="premium-aside-note"><ShieldCheck className="h-4 w-4" /><p>Seus dados são processados com sessão autenticada. Arquivos de personalização ficam em armazenamento privado, acessível apenas pelo pedido.</p></div>
          <details className="premium-panel premium-mobile-items"><summary><span>Ver itens do pedido</span><span>{items.length}</span></summary><div><OrderItemList items={items} /></div></details>
        </aside>
      </div>
    </div>
  </main>;
}

function Field({ label, value, onChange, type = 'text', required, onBlur, autoComplete, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; onBlur?: () => void; autoComplete?: string; placeholder?: string }) {
  return <label>{label}{required && <span className="text-brand"> *</span>}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} required={required} autoComplete={autoComplete} placeholder={placeholder} /></label>;
}
