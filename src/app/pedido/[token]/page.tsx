import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Download, ExternalLink, FileImage, MapPin, Package, Phone, ShieldCheck } from 'lucide-react';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/config';
import type { OrderItemPayload, StoredOrder } from '@/lib/orders';

export const metadata: Metadata = { title: 'Detalhes do pedido | Mega Personalizados', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return <main className="checkout-page"><div className="section-shell max-w-2xl py-16"><div className="premium-panel p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-brand" /><h1 className="mt-4 font-display text-2xl font-bold text-navy">Persistência de pedidos não configurada</h1><p className="mt-3 text-sm text-graphite/70">Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>SUPABASE_SERVICE_ROLE_KEY</code> para acessar os arquivos de produção.</p></div></div></main>;
  }
  const { data } = await admin.from('orders').select('*').eq('share_token', token).maybeSingle();
  if (!data) notFound();
  const order = data as StoredOrder;
  const items = Array.isArray(order.items) ? order.items as OrderItemPayload[] : [];
  const paths = items.flatMap((item) => [item.previewPath, ...(item.personalization?.layers ?? []).map((layer) => layer.assetPath)]).filter((path): path is string => Boolean(path));
  const signed = paths.length ? await admin.storage.from(STORAGE_BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7) : { data: [] };
  const urls = new Map<string, string>();
  (signed.data ?? []).forEach((entry) => { if (entry.path && entry.signedUrl) urls.set(entry.path, entry.signedUrl); });
  const subtotal = Number(order.subtotal ?? 0);

  return <main className="checkout-page py-8 sm:py-12">
    <div className="section-shell max-w-5xl">
      <div className="premium-panel overflow-hidden">
        <header className="order-detail-head">
          <div>
            <span className="premium-kicker"><CheckCircle2 className="h-4 w-4" /> Pedido recebido</span>
            <h1>{order.order_number}</h1>
            <p>{new Date(order.created_at).toLocaleString('pt-BR')}</p>
          </div>
          <span className="order-status">Aguardando confirmação</span>
        </header>
        <div className="order-detail-grid">
          <section>
            <h2><Package className="h-4 w-4" /> Itens e personalização</h2>
            <div className="order-detail-items">
              {items.map((item, index) => <article key={`${item.name}-${index}`} className="order-detail-item">
                <div className="order-detail-item-head">
                  <div><strong>{item.name}</strong><span>Quantidade: {item.quantity}</span></div>
                  <span className="order-detail-price">{item.unitPrice === null ? 'Sob consulta' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}</span>
                </div>
                {item.details.length > 0 && <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
                {item.personalization && <div className="order-personalization">
                  <h3><FileImage className="h-4 w-4" /> Arquivos e parâmetros</h3>
                  {item.previewPath && (urls.get(item.previewPath) ? <a className="order-preview" href={urls.get(item.previewPath)} target="_blank" rel="noreferrer"><img src={urls.get(item.previewPath)} alt={`Prévia de ${item.name}`} /><span><ExternalLink className="h-3.5 w-3.5" /> Abrir prévia final</span></a> : <p className="order-file-missing">Prévia indisponível.</p>)}
                  <div className="order-params">
                    {item.personalization.model && <span>Modelo: <b>{item.personalization.model}</b></span>}
                    {item.personalization.material && <span>Material: <b>{item.personalization.material}</b></span>}
                    {item.personalization.color && <span>Cor: <b>{item.personalization.color}</b></span>}
                    {item.personalization.text && <span>Texto: <b>{item.personalization.text}</b></span>}
                    {item.personalization.notes && <span>Observações: <b>{item.personalization.notes}</b></span>}
                  </div>
                  <div className="order-files">
                    {item.personalization.layers.map((layer, layerIndex) => <a key={layer.id} href={layer.assetPath ? urls.get(layer.assetPath) : undefined} target="_blank" rel="noreferrer">
                      <span><FileImage className="h-4 w-4" /> Imagem {layerIndex + 1} — {layer.fileName}</span>
                      <span className="order-file-meta">X {Math.round(layer.positionX)}% · Y {Math.round(layer.positionY)}% · {Math.round(layer.scale)}% · {Math.round(layer.rotation)}°</span>
                      <Download className="h-4 w-4" />
                    </a>)}
                  </div>
                </div>}
              </article>)}
            </div>
          </section>
          <aside>
            <h2><Phone className="h-4 w-4" /> Cliente</h2>
            <div className="order-side-card">
              <p><strong>{order.customer.firstName} {order.customer.lastName}</strong></p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
            <h2><MapPin className="h-4 w-4" /> Entrega</h2>
            <div className="order-side-card">
              {order.delivery.method === 'pickup' ? <p>Retirada na loja Mega, Sousa-PB.</p> : <>
                <p>{order.delivery.street}, {order.delivery.number}{order.delivery.complement ? ` — ${order.delivery.complement}` : ''}</p>
                <p>{order.delivery.neighborhood} · {order.delivery.city} / {order.delivery.state}</p>
                <p>CEP {order.delivery.cep}</p>
              </>}
            </div>
            <div className="order-total-box">
              <span>Subtotal conhecido</span>
              <strong>{subtotal > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal) : 'Valor a confirmar'}</strong>
              <p>Frete e pagamento serão confirmados pela equipe. Nenhum pagamento foi capturado.</p>
            </div>
          </aside>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-graphite/55">Link privado de produção. Não compartilhe fora da equipe Mega.</p>
      <p className="mt-2 text-center text-xs"><Link href="/" className="font-bold text-brand">Voltar ao site</Link></p>
    </div>
  </main>;
}
