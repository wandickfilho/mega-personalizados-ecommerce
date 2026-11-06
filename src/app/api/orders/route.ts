import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isWhatsAppConfigured, ORDER_WHATSAPP_NUMBER, PUBLIC_SITE_URL, STORAGE_BUCKET } from '@/lib/supabase/config';
import { PHONES } from '@/data/phones';
import { CONDITION_LABEL } from '@/lib/phones';
import { PERSONALIZED_PRODUCTS } from '@/data/personalizedProducts';
import { getEditor2DConfig } from '@/lib/editor2d';
import type { OrderItemPayload, OrderPayload } from '@/lib/orders';

export const runtime = 'nodejs';

class OrderInputError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function safeFileName(name: string, fallback: string) {
  const extension = /\.([a-z0-9]+)$/i.exec(name)?.[1]?.toLowerCase() ?? 'bin';
  return `${fallback}.${extension.replace(/[^a-z0-9]/g, '') || 'bin'}`;
}

function orderNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `MP-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase não configurado.' }, { status: 503 });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const { data, error } = await supabase.from('orders').select('order_number, share_token, status, created_at, items, customer, subtotal').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'A persistência de pedidos ainda não foi configurada. Defina as variáveis do Supabase.' }, { status: 503 });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return NextResponse.json({ error: 'Entre na sua conta para enviar o pedido.' }, { status: 401 });

  const admin = createSupabaseAdminClient();
  if (!admin || !isSupabaseAdminConfigured()) return NextResponse.json({ error: 'A chave de serviço do Supabase não está configurada no servidor.' }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Não foi possível ler os dados do pedido.' }, { status: 400 });
  }

  let payload: OrderPayload;
  try {
    payload = JSON.parse(String(form.get('payload') ?? '{}')) as OrderPayload;
  } catch {
    return NextResponse.json({ error: 'Dados do pedido inválidos.' }, { status: 400 });
  }

  if (!payload.items?.length) return NextResponse.json({ error: 'O pedido não possui itens.' }, { status: 400 });
  const customer = {
    firstName: text(payload.customer?.firstName, 80),
    lastName: text(payload.customer?.lastName, 80),
    email: text(payload.customer?.email, 160),
    phone: text(payload.customer?.phone, 40),
  };
  if (!customer.firstName || !customer.lastName || !/^\S+@\S+\.\S+$/.test(customer.email) || customer.phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Dados de identificação incompletos.' }, { status: 400 });
  }
  const delivery = payload.delivery?.method === 'pickup' ? { method: 'pickup' as const } : {
    method: 'address' as const,
    cep: text(payload.delivery?.cep, 12),
    street: text(payload.delivery?.street, 160),
    number: text(payload.delivery?.number, 20),
    neighborhood: text(payload.delivery?.neighborhood, 100),
    city: text(payload.delivery?.city, 100),
    state: text(payload.delivery?.state, 40),
    complement: text(payload.delivery?.complement, 140),
  };
  if (delivery.method === 'address' && (!delivery.cep || !delivery.street || !delivery.number || !delivery.neighborhood || !delivery.city || !delivery.state)) {
    return NextResponse.json({ error: 'Endereço de entrega incompleto.' }, { status: 400 });
  }

  const orderId = crypto.randomUUID();
  const shareToken = crypto.randomUUID();
  const order = orderNumber();
  const uploadedPaths: string[] = [];

  try {
    const items: OrderItemPayload[] = [];
    for (let itemIndex = 0; itemIndex < payload.items.length; itemIndex += 1) {
      const input = payload.items[itemIndex];
      if (input.kind === 'personalized') {
        const product = PERSONALIZED_PRODUCTS.find((entry) => entry.id === input.productId);
        if (!product) continue;
        const personalization = input.personalization;
        const maxImages = product.editor2d ? getEditor2DConfig(product).maxImages : 5;
        if ((personalization?.layers?.length ?? 0) > maxImages) throw new OrderInputError(`O item ${product.name} excede o limite de ${maxImages} imagem(ns).`);
        const layers = [];
        for (let layerIndex = 0; layerIndex < (personalization?.layers?.length ?? 0); layerIndex += 1) {
          const layer = personalization!.layers[layerIndex];
          const file = form.get(`art-${itemIndex}-${layerIndex}`);
          if (!(file instanceof File)) throw new OrderInputError(`A imagem ${layerIndex + 1} de ${product.name} não chegou ao servidor. Reenvie a arte e tente novamente.`);
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new OrderInputError(`Formato inválido na imagem ${layerIndex + 1} de ${product.name}.`);
          if (file.size > 8 * 1024 * 1024) throw new OrderInputError(`A imagem ${layerIndex + 1} de ${product.name} excede 8 MB.`);
          const path = `${userData.user.id}/${orderId}/${safeFileName(file.name || layer.fileName, `art-${itemIndex}-${layerIndex}`)}`;
          const { error: uploadError } = await admin.storage.from(STORAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
          if (uploadError) throw new Error(`Falha ao enviar a imagem original: ${uploadError.message}`);
          uploadedPaths.push(path);
          layers.push({ ...layer, assetPath: path });
        }
        let previewPath: string | undefined;
        const preview = form.get(`preview-${itemIndex}`);
        if (preview instanceof File) {
          const path = `${userData.user.id}/${orderId}/preview-${itemIndex}.webp`;
          const { error: previewError } = await admin.storage.from(STORAGE_BUCKET).upload(path, preview, { contentType: preview.type || 'image/webp', upsert: false });
          if (previewError) throw new Error(`Falha ao enviar a prévia: ${previewError.message}`);
          uploadedPaths.push(path);
          previewPath = path;
        }
        items.push({
          kind: 'personalized',
          productId: product.id,
          productSlug: product.slug,
          name: product.name,
          quantity: Math.max(1, Math.min(99, Math.floor(input.quantity || 1))),
          unitPrice: null,
          demonstrativePrice: product.demonstrativePrice,
          details: (Array.isArray(input.details) ? input.details : []).map((detail) => text(detail, 200)).filter(Boolean),
          personalization: {
            text: text(personalization?.text, 200) || undefined,
            color: text(personalization?.color, 80) || undefined,
            textColor: text(personalization?.textColor, 80) || undefined,
            size: text(personalization?.size, 40) || undefined,
            model: text(personalization?.model, 80) || undefined,
            material: text(personalization?.material, 80) || undefined,
            font: text(personalization?.font, 80) || undefined,
            engraving: text(personalization?.engraving, 80) || undefined,
            notes: text(personalization?.notes, 600) || undefined,
            editor: text(personalization?.editor, 40) || undefined,
            faceTexts: Object.fromEntries(Object.entries(personalization?.faceTexts ?? {}).filter(([, value]) => Boolean(value?.value)).map(([face, value]) => {
              const layer = value && typeof value === 'object' ? value as unknown as Record<string, unknown> : {};
              return [text(face, 40), { value: text(layer.value, 200), positionX: Number.isFinite(layer.positionX) ? Math.max(0, Math.min(100, Number(layer.positionX))) : 50, positionY: Number.isFinite(layer.positionY) ? Math.max(0, Math.min(100, Number(layer.positionY))) : 50, rotation: Number.isFinite(layer.rotation) ? Math.max(-180, Math.min(180, Number(layer.rotation))) : 0, size: Number.isFinite(layer.size) ? Math.max(12, Math.min(48, Number(layer.size))) : 18, color: text(layer.color, 40) || 'Azul-marinho', font: text(layer.font, 40) || 'Moderna', bold: Boolean(layer.bold) }];
            })),
            activeFace: text(personalization?.activeFace, 40) || undefined,
            layers,
          },
          previewPath,
        });
      } else {
        const phone = PHONES.find((entry) => entry.id === input.phoneId) ?? PHONES.find((entry) => entry.name === input.name);
        const variant = phone?.variants.find((entry) => entry.id === input.variantId);
        if (!phone || !variant) throw new OrderInputError('Um dos aparelhos do carrinho não está mais disponível. Revise a sacola.');
        items.push({
          kind: 'phone',
          name: phone.name,
          quantity: Math.max(1, Math.min(99, Math.floor(input.quantity || 1))),
          unitPrice: variant.price,
          details: [[variant.storage, variant.colorName, CONDITION_LABEL[variant.condition]].filter(Boolean).join(' / ')],
        });
      }
    }

    if (!items.length) return NextResponse.json({ error: 'Nenhum item válido foi encontrado no pedido.' }, { status: 400 });
    const subtotal = items.reduce((total, item) => total + (item.unitPrice ?? 0) * item.quantity, 0);

    const { error: insertError } = await admin.from('orders').insert({
      id: orderId,
      order_number: order,
      share_token: shareToken,
      user_id: userData.user.id,
      status: 'awaiting_confirmation',
      customer,
      delivery,
      payment: { method: 'quote', note: 'Pedido aguardando confirmação de valor, frete e pagamento.' },
      items,
      subtotal,
    });
    if (insertError) throw new Error(insertError.message);

    const baseUrl = (PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/$/, '');
    const detailsUrl = `${baseUrl}/pedido/${shareToken}`;
    const productLines = items.map((item) => `• ${item.name} × ${item.quantity}${item.details.length ? ` — ${item.details.join(' / ')}` : ''}`).join('\n');
    const message = [
      `Novo pedido ${order} — Mega Personalizados`,
      '',
      `Cliente: ${customer.firstName} ${customer.lastName}`,
      `Contato: ${customer.email} · ${customer.phone}`,
      '',
      'Produtos:',
      productLines,
      '',
      `Detalhes, prévias e arquivos originais: ${detailsUrl}`,
      'O pedido aguarda confirmação de orçamento e pagamento.',
    ].join('\n');
    const whatsappUrl = isWhatsAppConfigured() ? `https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : '';

    return NextResponse.json({ orderNumber: order, token: shareToken, detailsUrl, whatsappUrl, whatsappConfigured: isWhatsAppConfigured() });
  } catch (cause) {
    if (uploadedPaths.length) await admin.storage.from(STORAGE_BUCKET).remove(uploadedPaths).catch(() => undefined);
    const status = cause instanceof OrderInputError ? cause.status : 500;
    return NextResponse.json({ error: cause instanceof Error ? cause.message : 'Não foi possível salvar o pedido.' }, { status });
  }
}
