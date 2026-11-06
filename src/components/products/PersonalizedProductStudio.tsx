'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlignCenter, Check, ChevronDown, ChevronLeft, ChevronRight, Eye, ImagePlus, Minus, Plus, RotateCcw, RotateCw, ShoppingBag, Trash2, Upload, X, ArrowUp, ArrowDown, Layers } from 'lucide-react';
import type { PersonalizedProduct } from '@/data/personalizedProducts';
import Product2DStage from '@/components/customizer/Product2DStage';
import { useCart, type PersonalizationState } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';
import { createArtworkLayer, renderCompositePreview, type ArtworkLayer, type StageEditor, type TextLayer } from '@/lib/personalization';
import { removeArtworkOriginal, saveArtworkOriginal } from '@/lib/artworkStore';
import { getEditor2DConfig, resolveEditorFace } from '@/lib/editor2d';

const TEXT_COLORS: Record<string, string> = { 'Azul-marinho': '#071743', Vermelho: '#ff2448', Preto: '#17233b' };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PersonalizedProductStudio({ product }: { product: PersonalizedProduct }) {
  const { addPersonalizedItem, updatePersonalizedItem, items, isHydrated } = useCart();
  const options = product.options ?? {};
  const editor2d: StageEditor = product.editor2d ?? 'generic';
  const editorConfig = getEditor2DConfig(product);

  const fileInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const addedTimer = useRef<number | null>(null);

  const [step, setStep] = useState(1);
  const [faceTexts, setFaceTexts] = useState<Record<string, TextLayer>>({});
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
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
  const [showGuides, setShowGuides] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mugPresentation, setMugPresentation] = useState<'mockup' | 'flat'>('mockup');
  const [replaceLayerId, setReplaceLayerId] = useState<string | null>(null);
  const activeFace = editorConfig.faces[activeFaceIndex];
  const resolvedFace = resolveEditorFace(editorConfig, activeFace, model);
  const activeDesignKey = editorConfig.kind === 'phone-case' ? `${activeFace.id}:${model}` : activeFace.id;
  const activeFaceImageCount = layers.filter((layer) => layer.faceId === activeDesignKey || (!layer.faceId && activeFace.id === editorConfig.faces[0].id)).length;
  const imageLimitCount = editorConfig.kind === 'tshirt' || editorConfig.kind === 'bottle' || editorConfig.kind === 'phone-case' ? activeFaceImageCount : layers.length;
  const textLayer = faceTexts[activeDesignKey];
  const text = textLayer?.value ?? '';
  const updateText = (patch: Partial<TextLayer>) => setFaceTexts((current) => {
    const fallback: TextLayer = { value: '', positionX: 50, positionY: 50, rotation: 0, size: 18, color: textColor, font, bold: false };
    return { ...current, [activeDesignKey]: { ...fallback, ...current[activeDesignKey], ...patch } };
  });

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
      setFaceTexts(personalization.faceTexts ?? (personalization.text ? { [personalization.activeFace ?? editorConfig.faces[0].id]: { value: personalization.text, positionX: 50, positionY: 50, rotation: 0, size: 18, color: personalization.textColor ?? textColor, font: personalization.font ?? font, bold: false } } : {}));
      setNotes(personalization.notes ?? '');
      setColor(personalization.color ?? color);
      setTextColor(personalization.textColor ?? textColor);
      setModel(personalization.model ?? model);
      setMaterial(personalization.material ?? material);
      setFont(personalization.font ?? font);
      setEngraving(personalization.engraving ?? engraving);
      setQuantity(item.quantity);
      setActiveFaceIndex(Math.max(0, editorConfig.faces.findIndex((face) => face.id === personalization.activeFace?.split(':')[0])));
      setStep(2);
      setEditLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, items, editLoaded]);

  useEffect(() => () => {
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
  }, []);

  async function handleFile(file?: File, replacingId?: string | null) {
    if (!file) return;
    if (!replacingId && imageLimitCount >= editorConfig.maxImages) { setError(`Limite de ${editorConfig.maxImages} imagem(ns) na área ${activeFace.name}.`); return; }
    setUploading(true);
    setError('');
    try {
      const layer = await createArtworkLayer(file);
      await saveArtworkOriginal(layer.storageKey, file);
      if (replacingId) {
        const previous = layers.find((item) => item.id === replacingId);
        if (previous) void removeArtworkOriginal(previous.storageKey).catch(() => undefined);
        setLayers((current) => current.map((item) => item.id === replacingId ? { ...layer, id: item.id, faceId: item.faceId } : item));
        setSelectedId(replacingId);
      } else { setLayers((current) => [...current, { ...layer, faceId: activeDesignKey }]); setSelectedId(layer.id); }
      setStep((current) => (current < 2 ? 2 : current));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível preparar a imagem.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
      if (replaceInput.current) replaceInput.current.value = '';
      setReplaceLayerId(null);
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

  function reset() {
    layers.forEach((layer) => { void removeArtworkOriginal(layer.storageKey).catch(() => undefined); });
    setLayers([]);
    setSelectedId(null);
    setFaceTexts({});
    setNotes('');
    setTextSize(18);
    setError('');
  }

  function buildPersonalization(previewImage: string): PersonalizationState {
    const first = layers[0];
    const textSummary = Object.entries(faceTexts).filter(([, value]) => value.value.trim()).map(([faceId, value]) => `${editorConfig.faces.find((face) => face.id === faceId)?.name ?? faceId}: ${value.value.trim()}`).join(' · ');
    return {
      layers,
      text: textSummary || undefined,
      faceTexts,
      activeFace: activeDesignKey,
      color: color || undefined,
      textColor: textSummary ? textColor : undefined,
      model: model || undefined,
      material: material || undefined,
      font: textSummary ? font : undefined,
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
    return renderCompositePreview({ editor: editor2d, model, tone: product.tone, layers, text: text.trim(), textColor, font, textSize });
  }

  async function addToCart() {
    setError('');
    try {
      const preview = await renderPreview();
      finishAdd(preview);
    } catch {
      finishAdd('');
    }
  }

  const priceLabel = product.demonstrativePrice ? formatCurrency(product.demonstrativePrice) : 'Sob consulta';
  const canAdd = !uploading;
  const restoreView = () => { setActiveFaceIndex(0); setSelectedId(null); setShowGuides(true); };

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
            <span className="custom-preview-status"><span className="custom-status-dot" /> {editorConfig.kind === 'mug' ? 'Mockup fotográfico · caneca cerâmica' : editorConfig.kind === 'tshirt' || editorConfig.kind === 'bottle' ? 'Editor 2D · base fotográfica' : 'Editor 2D · base neutra'}</span>
            <div className="viewer-toolbar">
              <div className="viewer-toolbar-actions">
                <button type="button" onClick={restoreView} aria-label="Restaurar visualização"><RotateCcw className="h-3.5 w-3.5" /><span>Restaurar</span></button>
                <button type="button" onClick={() => setShowGuides((value) => !value)} aria-label={showGuides ? 'Ocultar guias' : 'Mostrar guias'}><span>{showGuides ? 'Ocultar guias' : 'Mostrar guias'}</span></button>
              </div>
              {editorConfig.kind === 'mug' && <div className="mug-presentation-toggle" role="group" aria-label="Modo de visualização da caneca"><button type="button" className={mugPresentation === 'mockup' ? 'active' : ''} onClick={() => setMugPresentation('mockup')}>Visualizar na caneca</button><button type="button" className={mugPresentation === 'flat' ? 'active' : ''} onClick={() => setMugPresentation('flat')}>Visualizar arte completa</button></div>}
              <span className="viewer-face-label">{activeFace.name} · área de impressão</span>
            </div>
          </div>
          <div className="custom-product-stage custom-product-2d">
            <Product2DStage key={`${product.slug}-${activeDesignKey}`} config={editorConfig} face={resolvedFace} layerFaceId={activeDesignKey} layers={layers} selectedId={selectedId} textLayer={textLayer} showGuides={showGuides} presentation={editorConfig.kind === 'mug' ? mugPresentation : 'mockup'} onSelect={setSelectedId} onMove={moveLayer} onMoveText={(positionX, positionY) => updateText({ positionX, positionY})} />
          </div>
          {editorConfig.faces.length > 1 && <div className="face-navigation">
            <button type="button" onClick={() => setActiveFaceIndex((index) => (index + editorConfig.faces.length - 1) % editorConfig.faces.length)} aria-label="Face anterior"><ChevronLeft /></button>
            <div><div className="face-dots">{editorConfig.faces.map((face, index) => <button type="button" key={face.id} className={index === activeFaceIndex ? 'active' : ''} onClick={() => setActiveFaceIndex(index)} aria-label={`Ver ${face.name}`} />)}</div><strong>{activeFace.name} — Lado {activeFaceIndex + 1} de {editorConfig.faces.length}</strong></div>
            <button type="button" onClick={() => setActiveFaceIndex((index) => (index + 1) % editorConfig.faces.length)} aria-label="Próxima face"><ChevronRight /></button>
          </div>}
          <div className="custom-preview-foot">
            <span>Arraste as imagens diretamente dentro da área pontilhada.</span>
            <span>{layers.length > 0 ? `${layers.length} de ${editorConfig.maxImages} imagens` : 'Prévia ilustrativa'}</span>
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
                <input ref={replaceInput} type="file" accept="image/png,image/jpeg,image/webp" className="studio-file-input" onChange={(event) => void handleFile(event.target.files?.[0], replaceLayerId)} />
                <div className="studio-uploader">
                   <button type="button" className="studio-upload-add" onClick={() => fileInput.current?.click()} disabled={uploading || imageLimitCount >= editorConfig.maxImages}>
                    {layers.length === 0 ? <Upload className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
                    <span>{uploading ? 'Preparando imagem...' : layers.length === 0 ? 'Enviar primeira imagem' : '+ Adicionar outra imagem'}</span>
                  </button>
                   <div className="studio-upload-meta"><span>PNG, JPG ou WebP · até 8 MB · {activeFace.name}</span><b>{imageLimitCount}/{editorConfig.maxImages}</b></div>
                   {imageLimitCount >= editorConfig.maxImages && <p className="layer-limit">Limite de imagens atingido para esta área.</p>}
                </div>
              </>}

              {layers.length > 0 && <div className="artwork-layers">
                <div className="artwork-layers-head"><span><Layers className="h-4 w-4" /> Camadas de imagem</span><b>{imageLimitCount}/{editorConfig.maxImages}{editorConfig.kind === 'tshirt' || editorConfig.kind === 'bottle' ? ` · ${activeFace.name}` : editorConfig.kind === 'phone-case' ? ` · ${model}` : ''}</b></div>
                {layers.map((layer, index) => {
                  const selected = selectedId === layer.id;
                  return <div key={layer.id} className={`layer-card ${selected ? 'is-selected' : ''}`}>
                    <button type="button" className="layer-card-head" onClick={() => setSelectedId(selected ? null : layer.id)} aria-expanded={selected}>
                      <span className="layer-thumb"><img src={layer.preview} alt={layer.name} /></span>
                      <span className="layer-title"><strong>Imagem {index + 1} — {layer.name}</strong><small>{editorConfig.faces.find((face) => face.id === layer.faceId)?.name ?? activeFace.name} · X {Math.round(layer.positionX)}% · Y {Math.round(layer.positionY)}% · {Math.round(layer.scale)}%</small></span>
                      <ChevronDown className={`h-4 w-4 ${selected ? 'rotate-180' : ''}`} />
                    </button>
                    {selected && <div className="layer-card-body">
                      <div className="layer-control-grid">
                        <RangeControl label="Posição X" value={layer.positionX} min={4} max={96} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { positionX: value })} />
                        <RangeControl label="Posição Y" value={layer.positionY} min={4} max={96} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { positionY: value })} />
                        <RangeControl label="Escala" value={layer.scale} min={20} max={220} step={1} suffix="%" onChange={(value) => updateLayer(layer.id, { scale: value })} />
                        <RangeControl label="Rotação" value={layer.rotation} min={-180} max={180} step={1} suffix="°" onChange={(value) => updateLayer(layer.id, { rotation: value })} />
                      </div>
                      <div className="layer-actions layer-image-actions">
                        <button type="button" title="Restaurar transformações" onClick={() => updateLayer(layer.id, { positionX: 50, positionY: 50, scale: 100, rotation: 0 })} aria-label="Restaurar transformações"><RotateCcw className="h-4 w-4" /></button>
                        <button type="button" title="Alinhar ao centro" onClick={() => centerLayer(layer.id)} aria-label="Alinhar ao centro"><AlignCenter className="h-4 w-4" /></button>
                        <button type="button" title="Substituir imagem" onClick={() => { if (window.confirm(`Substituir “${layer.fileName}”?`)) { setReplaceLayerId(layer.id); replaceInput.current?.click(); } }} aria-label="Substituir imagem"><ImagePlus className="h-4 w-4" /></button>
                        <button type="button" title="Mover camada para frente" onClick={() => reorderLayer(layer.id, -1)} disabled={index === 0} aria-label="Mover camada para frente"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" title="Mover camada para trás" onClick={() => reorderLayer(layer.id, 1)} disabled={index === layers.length - 1} aria-label="Mover camada para trás"><ArrowDown className="h-4 w-4" /></button>
                        <button type="button" title="Excluir imagem" className="danger" onClick={() => removeLayer(layer.id)} aria-label="Excluir imagem"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>}
                  </div>;
                })}
              </div>}

              {options.text && <div className="studio-text-editor">
                <label htmlFor="custom-text">Adicionar texto em {activeFace.name}<input id="custom-text" value={text} maxLength={options.characterLimit ?? 48} onChange={(event) => updateText({ value: event.target.value })} placeholder="Nome, frase ou iniciais" /></label>
                {text && <>
                  <OptionCards label="Fonte" values={options.fonts} value={textLayer?.font ?? font} onChange={(value) => updateText({ font: value })} />
                  <OptionCards label="Cor do texto" values={options.textColors} value={textLayer?.color ?? textColor} onChange={(value) => updateText({ color: value })} colors />
                  <div className="layer-control-grid">
                    <RangeControl label="Tamanho do texto" value={textLayer?.size ?? textSize} min={12} max={48} step={1} suffix=" px" onChange={(value) => updateText({ size: value })} />
                     <RangeControl label="Posição X" value={textLayer?.positionX ?? 50} min={resolvedFace.movementLimits.minX} max={resolvedFace.movementLimits.maxX} step={1} suffix="%" onChange={(value) => updateText({ positionX: value })} />
                     <RangeControl label="Posição Y" value={textLayer?.positionY ?? 50} min={resolvedFace.movementLimits.minY} max={resolvedFace.movementLimits.maxY} step={1} suffix="%" onChange={(value) => updateText({ positionY: value })} />
                    <RangeControl label="Rotação" value={textLayer?.rotation ?? 0} min={-180} max={180} step={1} suffix="°" onChange={(value) => updateText({ rotation: value })} />
                  </div>
                  <div className="layer-actions"><button type="button" onClick={() => updateText({ bold: !textLayer?.bold })} className={textLayer?.bold ? 'active' : ''}>Negrito</button><button type="button" onClick={() => updateText({ positionX: 50, positionY: 50, rotation: 0 })}>Centralizar</button><button type="button" onClick={() => updateText({ value: '' })} className="danger">Excluir texto</button></div>
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
                <button type="button" className="custom-preview-result" onClick={() => setPreviewOpen(true)}><Eye className="h-4 w-4" /> Visualizar resultado</button>
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
      {previewOpen && <div className="editor-result-modal" role="dialog" aria-modal="true" aria-label="Resultado da personalização">
        <div className="editor-result-backdrop" onClick={() => setPreviewOpen(false)} />
        <section className="editor-result-panel">
          <header><div><p>PRÉVIA FINAL</p><h2>{product.name}</h2><span>{model && `${model} · `}Todas as faces sem guias de edição.</span></div><button type="button" onClick={() => setPreviewOpen(false)} aria-label="Voltar à edição"><X /></button></header>
          <div className="editor-result-faces">{editorConfig.faces.map((face) => { const previewFace = resolveEditorFace(editorConfig, face, model); const previewKey = editorConfig.kind === 'phone-case' ? `${face.id}:${model}` : face.id; return <article key={face.id}><h3>{face.name}</h3><Product2DStage config={editorConfig} face={previewFace} layerFaceId={previewKey} layers={layers} selectedId={null} textLayer={faceTexts[previewKey]} showGuides={false} readOnly onSelect={() => undefined} onMove={() => undefined} onMoveText={() => undefined} /></article>; })}</div>
          <footer><button type="button" className="premium-secondary" onClick={() => setPreviewOpen(false)}>Voltar à edição</button></footer>
        </section>
      </div>}
    </div>
  </main>;
}

function OptionCards({ label, values, value, onChange, colors = false }: { label: string; values?: string[]; value: string; onChange: (value: string) => void; colors?: boolean }) {
  if (!values?.length) return null;
  return <fieldset className="studio-options"><legend>{label}</legend><div>{values.map((option) => <button type="button" key={option} onClick={() => onChange(option)} className={value === option ? 'selected' : ''}>{colors && <i style={{ background: TEXT_COLORS[option] ?? (option === 'Branca' ? '#fff' : option === 'Preta' ? '#17233b' : '#dbe3f1') }} />}{option}</button>)}</div></fieldset>;
}

function RangeControl({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  const change = (next: number) => onChange(clamp(Number.isFinite(next) ? next : value, min, max));
  return <label className="studio-range"><span>{label}<b>{Math.round(value)}{suffix}</b></span><div className="studio-range-inputs"><input className="studio-range-slider" type="range" min={min} max={max} step={step} value={value} onChange={(event) => change(Number(event.target.value))} /><input className="studio-range-number" aria-label={`${label} valor numérico`} type="number" min={min} max={max} step={step} value={Math.round(value)} onChange={(event) => change(Number(event.target.value))} /></div></label>;
}
