'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AlignCenter, Camera, Check, ChevronDown, ChevronLeft, ImagePlus, Maximize2, Minus, Plus, RotateCcw, RotateCw, ShoppingBag, Trash2, Upload, X, ArrowUp, ArrowDown, Layers } from 'lucide-react';
import type { PersonalizedProduct } from '@/data/personalizedProducts';
import ArtworkCanvas from '@/components/customizer/ArtworkCanvas';
import { useCart, type PersonalizationState } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';
import { createArtworkLayer, layerWidthPercent, MAX_ARTWORK_LAYERS, renderCompositePreview, type ArtworkLayer, type StageEditor } from '@/lib/personalization';
import { removeArtworkOriginal, saveArtworkOriginal } from '@/lib/artworkStore';

const Product3DViewer = dynamic(() => import('@/components/customizer3d/Product3DViewer'), { ssr: false, loading: () => <div className="viewer-3d-loading">Preparando visualizador 3D...</div> });

const TEXT_COLORS: Record<string, string> = { 'Azul-marinho': '#071743', Vermelho: '#ff2448', Preto: '#17233b' };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PersonalizedProductStudio({ product }: { product: PersonalizedProduct }) {
  const { addPersonalizedItem, updatePersonalizedItem, items, isHydrated } = useCart();
  const options = product.options ?? {};
  const has3D = Boolean(product.model3d);
  const editor2d: StageEditor = product.editor2d ?? 'generic';

  const fileInput = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const addedTimer = useRef<number | null>(null);
  const captureTimer = useRef<number | null>(null);
  const pendingAdd = useRef(false);

  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(options.colors?.[0] ?? '');
  const [textColor, setTextColor] = useState(options.textColors?.[0] ?? 'Azul-marinho');
  const [model, setModel] = useState(options.models?.[0] ?? '');
  const [material, setMaterial] = useState(options.materials?.[0] ?? '');
  const [font, setFont] = useState(options.fonts?.[0] ?? 'Moderna');
  const [engraving, setEngraving] = useState(options.engravingTypes?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [textSize, setTextSize] = useState(18);
  const [layers, setLayers] = useState<ArtworkLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editLoaded, setEditLoaded] = useState(false);
  const [captureRequest, setCaptureRequest] = useState(0);
  const [resetRequest, setResetRequest] = useState(0);
  const [captureResult, setCaptureResult] = useState<{ image: string; nonce: number } | null>(null);

  useEffect(() => {
    if (!isHydrated || editLoaded) return;
    const frame = window.requestAnimationFrame(() => {
      const editId = new URLSearchParams(window.location.search).get('edit');
      if (!editId) { setEditLoaded(true); return; }
      const item = items.find((entry) => entry.kind === 'personalized' && entry.id === editId);
      if (!item || item.kind !== 'personalized') { setEditLoaded(true); return; }
      const personalization = item.personalization;
      setEditingItemId(editId);
      setLayers(personalization.layers ?? []);
      setSelectedId(personalization.layers?.[0]?.id ?? null);
      setText(personalization.text ?? '');
      setNotes(personalization.notes ?? '');
      setColor(personalization.color ?? color);
      setTextColor(personalization.textColor ?? textColor);
      setModel(personalization.model ?? model);
      setMaterial(personalization.material ?? material);
      setFont(personalization.font ?? font);
      setEngraving(personalization.engraving ?? engraving);
      setQuantity(item.quantity);
      setStep(2);
      setEditLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, items, editLoaded]);

  useEffect(() => () => {
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
    if (captureTimer.current) window.clearTimeout(captureTimer.current);
  }, []);

  useEffect(() => {
    if (!pendingAdd.current || !captureResult) return;
    pendingAdd.current = false;
    if (captureTimer.current) window.clearTimeout(captureTimer.current);
    finishAdd(captureResult.image);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureResult]);

  async function handleFile(file?: File) {
    if (!file) return;
    if (layers.length >= MAX_ARTWORK_LAYERS) { setError('Limite de 5 imagens por produto.'); return; }
    setUploading(true);
    setError('');
    try {
      const layer = await createArtworkLayer(file);
      await saveArtworkOriginal(layer.storageKey, file);
      setLayers((current) => [...current, layer]);
      setSelectedId(layer.id);
      setStep((current) => (current < 2 ? 2 : current));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível preparar a imagem.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function updateLayer(id: string, patch: Partial<ArtworkLayer>) {
    setLayers((current) => current.map((layer) => layer.id === id ? { ...layer, ...patch } : layer));
  }

  function moveLayer(id: string, positionX: number, positionY: number) {
    updateLayer(id, { positionX: clamp(positionX, 4, 96), positionY: clamp(positionY, 4, 96) });
  }

  function centerLayer(id: string) {
    updateLayer(id, { positionX: 50, positionY: 50, rotation: 0 });
  }

  function removeLayer(id: string) {
    const target = layers.find((layer) => layer.id === id);
    if (target) void removeArtworkOriginal(target.storageKey).catch(() => undefined);
    setLayers((current) => current.filter((layer) => layer.id !== id));
    setSelectedId((current) => current === id ? null : current);
  }

  function reorderLayer(id: string, direction: -1 | 1) {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function changeSelectedPosition(patch: { positionX?: number; positionY?: number }) {
    const targetId = selectedId ?? layers[0]?.id;
    if (!targetId) return;
    const target = layers.find((layer) => layer.id === targetId);
    if (!target) return;
    updateLayer(targetId, {
      positionX: patch.positionX ?? target.positionX,
      positionY: patch.positionY ?? target.positionY,
    });
  }

  function reset() {
    layers.forEach((layer) => { void removeArtworkOriginal(layer.storageKey).catch(() => undefined); });
    setLayers([]);
    setSelectedId(null);
    setText('');
    setNotes('');
    setTextSize(18);
    setError('');
    setCaptureResult(null);
  }

  function buildPersonalization(previewImage: string): PersonalizationState {
    const first = layers[0];
    return {
      layers,
      text: text.trim() || undefined,
      color: color || undefined,
      textColor: text.trim() ? textColor : undefined,
      model: model || undefined,
      material: material || undefined,
      font: text.trim() ? font : undefined,
      engraving: engraving || undefined,
      notes: notes.trim() || undefined,
      editor: product.editor2d,
      artworkName: layers.map((layer) => layer.fileName).join(', ') || undefined,
      previewImage: previewImage || undefined,
      design: {
        positionX: first?.positionX ?? 50,
        positionY: first?.positionY ?? 50,
        scale: first?.scale ?? 100,
        rotation: first?.rotation ?? 0,
        textSize,
        imageStorage: layers.length ? 'pending-secure-upload' : 'none',
      },
    };
  }

  function finishAdd(previewImage: string) {
    const personalization = buildPersonalization(previewImage);
    if (editingItemId) updatePersonalizedItem(editingItemId, personalization, quantity);
    else addPersonalizedItem(product, personalization, quantity);
    setAdded(true);
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 2400);
  }

  async function renderPreview() {
    if (has3D) return '';
    return renderCompositePreview({ editor: editor2d, model, tone: product.tone, layers, text: text.trim(), textColor, font, textSize });
  }

  async function addToCart() {
    setError('');
    if (has3D) {
      pendingAdd.current = true;
      setCaptureRequest((value) => value + 1);
      if (captureTimer.current) window.clearTimeout(captureTimer.current);
      captureTimer.current = window.setTimeout(() => {
        if (!pendingAdd.current) return;
        pendingAdd.current = false;
        const fallback = layers[0]?.preview ?? '';
        void renderPreview().then((preview) => finishAdd(preview || fallback)).catch(() => finishAdd(fallback));
      }, 2400);
      return;
    }
    try {
      const preview = await renderPreview();
      finishAdd(preview);
    } catch {
      finishAdd('');
    }
  }

  const priceLabel = product.demonstrativePrice ? formatCurrency(product.demonstrativePrice) : 'Sob consulta';
  const canAdd = !uploading;

  return <main className="custom-studio-page">
    <div className="section-shell py-5 sm:py-8">
      <Link href="/personalizados" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar aos personalizados</Link>
      <header className="custom-studio-heading">
        <div><p>MEGA CUSTOM STUDIO</p><h1>{product.name}</h1></div>
        <span>{editingItemId ? 'Editando personalização' : priceLabel}</span>
      </header>
      <div className="custom-studio-layout">
        <section className="custom-preview-panel" aria-label="Prévia da personalização">
          <div className="custom-preview-bar">
            <span><span className="custom-status-dot" /> {has3D ? 'Visualizador 3D ilustrativo' : 'Editor 2D ilustrativo'}</span>
            <div className="viewer-toolbar">
              {has3D && <>
                <button type="button" onClick={() => setResetRequest((value) => value + 1)} aria-label="Restaurar câmera"><RotateCcw className="h-4 w-4" /></button>
                <button type="button" onClick={() => setCaptureRequest((value) => value + 1)} aria-label="Capturar prévia"><Camera className="h-4 w-4" /></button>
                <button type="button" onClick={() => stageRef.current?.requestFullscreen?.().catch(() => undefined)} aria-label="Tela cheia"><Maximize2 className="h-4 w-4" /></button>
              </>}
              <span>{options.printableArea ?? 'Área de personalização'}</span>
            </div>
          </div>
          <div ref={stageRef} className={`custom-product-stage ${has3D ? `custom-product-${product.mockup}` : `custom-product-2d custom-product-${product.mockup}`}`}>
            {has3D && product.model3d
              ? <Product3DViewer
                  product={product.model3d}
                  color={color}
                  design={{ layers: layers.map((layer) => ({ preview: layer.preview, positionX: layer.positionX, positionY: layer.positionY, scale: layer.scale, rotation: layer.rotation })), text: text || undefined, textColor, font, positionX: layers[0]?.positionX ?? 50, positionY: layers[0]?.positionY ?? 50, scale: layers[0]?.scale ?? 100, rotation: layers[0]?.rotation ?? 0, textSize }}
                  captureRequest={captureRequest}
                  resetRequest={resetRequest}
                  onCapture={(image) => setCaptureResult({ image, nonce: Date.now() })}
                  onDesignChange={changeSelectedPosition}
                />
              : <ArtworkCanvas editor={editor2d} model={model} tone={product.tone} layers={layers} selectedId={selectedId} text={text} textColor={textColor} font={font} textSize={textSize} onSelect={setSelectedId} onMove={moveLayer} />}
          </div>
          <div className="custom-preview-foot">
            <span>{has3D ? 'Arraste para girar. Use "Arrastar arte" para reposicionar a imagem selecionada.' : 'Arraste as imagens diretamente na área pontilhada do produto.'}</span>
            <span>{layers.length > 0 ? `${layers.length} de ${MAX_ARTWORK_LAYERS} imagens` : 'Prévia ilustrativa'}</span>
          </div>
        </section>

        <section className="custom-controls">
          <div className="custom-progress" aria-label={`Etapa ${step} de 4`}>
            {['Produto', 'Personalize', 'Confira', 'Carrinho'].map((label, index) => <button type="button" key={label} onClick={() => setStep(index + 1)} className={step >= index + 1 ? 'active' : ''}><i>{index + 1}</i><span>{label}</span></button>)}
          </div>
          <div className="custom-control-content">
            {step === 1 && <>
              <p className="custom-eyebrow">Etapa 1</p>
              <h2>Escolha seu produto</h2>
              <p className="custom-description">{product.description}</p>
              <OptionCards label="Modelo" values={options.models} value={model} onChange={setModel} />
              <OptionCards label="Material" values={options.materials} value={material} onChange={setMaterial} />
              <OptionCards label="Cor" values={options.colors} value={color} onChange={setColor} colors />
              {product.editor2d === 'phone-case' && <p className="custom-notice">Representações ilustrativas por família de aparelho. A compatibilidade com o modelo exato é confirmada pela equipe antes da produção.</p>}
            </>}

            {step === 2 && <>
              <p className="custom-eyebrow">Etapa 2</p>
              <h2>Crie sua composição</h2>
              {options.artwork && <>
                <input ref={fileInput} id="artwork" type="file" accept="image/png,image/jpeg,image/webp" className="studio-file-input" onChange={(event) => void handleFile(event.target.files?.[0])} />
                <div className="studio-uploader">
                  <button type="button" className="studio-upload-add" onClick={() => fileInput.current?.click()} disabled={uploading || layers.length >= MAX_ARTWORK_LAYERS}>
                    {layers.length === 0 ? <Upload className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
                    <span>{uploading ? 'Preparando imagem...' : layers.length === 0 ? 'Enviar primeira imagem' : '+ Adicionar outra imagem'}</span>
                  </button>
                  <div className="studio-upload-meta"><span>PNG, JPG ou WebP · até 8 MB</span><b>{layers.length}/{MAX_ARTWORK_LAYERS}</b></div>
                  {layers.length >= MAX_ARTWORK_LAYERS && <p className="layer-limit">Limite de 5 imagens atingido. Remova uma imagem para adicionar outra.</p>}
                </div>
              </>}

              {layers.length > 0 && <div className="artwork-layers">
                <div className="artwork-layers-head"><span><Layers className="h-4 w-4" /> Camadas de imagem</span><b>{layers.length}/{MAX_ARTWORK_LAYERS}</b></div>
                {layers.map((layer, index) => {
                  const selected = selectedId === layer.id;
                  return <div key={layer.id} className={`layer-card ${selected ? 'is-selected' : ''}`}>
                    <button type="button" className="layer-card-head" onClick={() => setSelectedId(selected ? null : layer.id)} aria-expanded={selected}>
                      <span className="layer-thumb"><img src={layer.preview} alt={layer.name} /></span>
                      <span className="layer-title"><strong>Imagem {index + 1} — {layer.name}</strong><small>X {Math.round(layer.positionX)}% · Y {Math.round(layer.positionY)}% · {Math.round(layerWidthPercent(layer))}% de largura</small></span>
                      <ChevronDown className={`h-4 w-4 ${selected ? 'rotate-180' : ''}`} />
                    </button>
                    {selected && <div className="layer-card-body">
                      <div className="layer-control-grid">
                        <RangeControl label="Posição X" value={layer.positionX} min={4} max={96} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { positionX: value })} />
                        <RangeControl label="Posição Y" value={layer.positionY} min={4} max={96} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { positionY: value })} />
                        <RangeControl label="Escala" value={layer.scale} min={20} max={220} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { scale: value })} />
                        <RangeControl label="Rotação" value={layer.rotation} min={-180} max={180} step={1} suffix="°" onChange={(value) => updateLayer(layer.id, { rotation: value })} />
                      </div>
                      <div className="layer-actions">
                        <button type="button" onClick={() => updateLayer(layer.id, { rotation: layer.rotation - 15 })} aria-label="Girar 15 graus à esquerda"><RotateCcw className="h-4 w-4" /></button>
                        <button type="button" onClick={() => centerLayer(layer.id)} aria-label="Centralizar imagem"><AlignCenter className="h-4 w-4" /></button>
                        <button type="button" onClick={() => updateLayer(layer.id, { rotation: layer.rotation + 15 })} aria-label="Girar 15 graus à direita"><RotateCw className="h-4 w-4" /></button>
                        <span className="layer-action-divider" />
                        <button type="button" onClick={() => reorderLayer(layer.id, -1)} disabled={index === 0} aria-label="Mover camada para cima"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" onClick={() => reorderLayer(layer.id, 1)} disabled={index === layers.length - 1} aria-label="Mover camada para baixo"><ArrowDown className="h-4 w-4" /></button>
                        <button type="button" className="danger" onClick={() => removeLayer(layer.id)} aria-label="Remover imagem"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>}
                  </div>;
                })}
              </div>}

              {options.text && <div className="studio-text-editor">
                <label htmlFor="custom-text">Adicionar texto<input id="custom-text" value={text} maxLength={options.characterLimit ?? 48} onChange={(event) => setText(event.target.value)} placeholder="Nome, frase ou iniciais" /></label>
                {text && <>
                  <OptionCards label="Fonte" values={options.fonts} value={font} onChange={setFont} />
                  <OptionCards label="Cor do texto" values={options.textColors} value={textColor} onChange={setTextColor} colors />
                  <RangeControl label="Tamanho do texto" value={textSize} min={12} max={32} step={1} suffix=" px" onChange={setTextSize} />
                </>}
              </div>}
            </>}

            {step === 3 && <>
              <p className="custom-eyebrow">Etapa 3</p>
              <h2>Confira sua criação</h2>
              <div className="custom-review">
                <p><strong>{product.name}</strong>{model && ` · ${model}`}{color && ` · ${color}`}</p>
                <p>{layers.length ? `${layers.length} imagem(ns): ${layers.map((layer) => layer.fileName).join(', ')}` : 'Nenhuma imagem enviada'}</p>
                <p>{text ? `Texto: ${text}` : 'Nenhum texto adicionado'}</p>
              </div>
              <div className="custom-notice">A prévia é ilustrativa. A arte final e a compatibilidade passam por aprovação antes da produção.</div>
              <label className="custom-notes">Observações<textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={300} placeholder="Alguma orientação para a equipe?" rows={3} /></label>
              <button type="button" onClick={reset} className="custom-reset"><RotateCcw className="h-4 w-4" /> Restaurar criação</button>
            </>}

            {step === 4 && <>
              <p className="custom-eyebrow">Etapa 4</p>
              <h2>{editingItemId ? 'Salvar alterações?' : 'Pronto para adicionar?'}</h2>
              <p className="custom-description">Revise a prévia e escolha a quantidade desejada.</p>
              <div className="custom-quantity"><span>Quantidade</span><div><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Minus className="h-4 w-4" /></button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Aumentar quantidade"><Plus className="h-4 w-4" /></button></div></div>
              <div className="custom-total"><span>{product.demonstrativePrice ? 'Valor demonstrativo' : 'Valor a confirmar'}</span><strong>{product.demonstrativePrice ? formatCurrency(product.demonstrativePrice * quantity) : 'Sob consulta'}</strong></div>
              <button type="button" onClick={() => void addToCart()} className="custom-add" disabled={!canAdd}><ShoppingBag className="h-5 w-5" />{added ? 'Personalização salva' : editingItemId ? 'Salvar alterações' : 'Adicionar ao carrinho'}</button>
              {added && <p className="custom-added"><Check className="h-4 w-4" /> {editingItemId ? 'Sua personalização foi atualizada.' : 'Sua criação foi adicionada ao carrinho.'} <Link href="/carrinho">Ver carrinho</Link></p>}
            </>}
            {error && <p className="custom-error" role="alert"><X className="h-4 w-4" /> {error}</p>}
            <div className="custom-navigation">
              <button type="button" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>Voltar</button>
              {step < 4 && <button type="button" onClick={() => setStep((current) => current + 1)}>Continuar</button>}
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>;
}

function OptionCards({ label, values, value, onChange, colors = false }: { label: string; values?: string[]; value: string; onChange: (value: string) => void; colors?: boolean }) {
  if (!values?.length) return null;
  return <fieldset className="studio-options"><legend>{label}</legend><div>{values.map((option) => <button type="button" key={option} onClick={() => onChange(option)} className={value === option ? 'selected' : ''}>{colors && <i style={{ background: TEXT_COLORS[option] ?? (option === 'Branca' ? '#fff' : option === 'Preta' ? '#17233b' : '#dbe3f1') }} />}{option}</button>)}</div></fieldset>;
}

function RangeControl({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="studio-range"><span>{label}<b>{Math.round(value)}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
