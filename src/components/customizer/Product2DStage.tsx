'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react';
import type { ArtworkLayer, TextLayer } from '@/lib/personalization';
import type { Editor2DConfig, EditorFace } from '@/lib/editor2d';
import { layerWidthPercent } from '@/lib/personalization';

const textColors: Record<string, string> = { 'Azul-marinho': '#071743', Vermelho: '#e62035', Preto: '#17233b' };
const fonts: Record<string, string> = { Clássica: 'Georgia, serif', Manuscrita: 'cursive', Moderna: 'Manrope, sans-serif' };

interface DragState {
  pointerId: number;
  target: HTMLElement;
  kind: 'image' | 'text';
  layerId?: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export default function Product2DStage({ config, face, layerFaceId, layers, selectedId, textLayer, showGuides, readOnly = false, presentation = 'mockup', onSelect, onMove, onMoveText }: {
  config: Editor2DConfig; face: EditorFace; layers: ArtworkLayer[]; selectedId: string | null; textLayer?: TextLayer; showGuides: boolean;
  layerFaceId?: string; readOnly?: boolean; presentation?: 'mockup' | 'flat';
  onSelect: (id: string | null) => void; onMove: (id: string, x: number, y: number) => void; onMoveText: (x: number, y: number) => void;
}) {
  const drag = useRef<DragState | null>(null);

  function endDrag(event?: React.PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || (event && current.pointerId !== event.pointerId)) return;
    if (current.target.hasPointerCapture(current.pointerId)) current.target.releasePointerCapture(current.pointerId);
    drag.current = null;
  }

  useEffect(() => {
    const cancel = () => endDrag();
    window.addEventListener('blur', cancel);
    return () => { window.removeEventListener('blur', cancel); cancel(); };
  }, []);

  useEffect(() => () => endDrag(), [face.id, presentation]);

  function startDrag(event: React.PointerEvent<HTMLElement>, kind: DragState['kind'], layer?: ArtworkLayer) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const box = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!box) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, target: event.currentTarget, kind, layerId: layer?.id, startX: event.clientX, startY: event.clientY, originX: layer?.positionX ?? textLayer?.positionX ?? 50, originY: layer?.positionY ?? textLayer?.positionY ?? 50, width: box.width, height: box.height };
  }

  function moveDrag(event: React.PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) { endDrag(event); return; }
    event.preventDefault();
    const positionX = Math.max(face.movementLimits.minX, Math.min(face.movementLimits.maxX, current.originX + ((event.clientX - current.startX) / current.width) * 100));
    const positionY = Math.max(face.movementLimits.minY, Math.min(face.movementLimits.maxY, current.originY + ((event.clientY - current.startY) / current.height) * 100));
    if (current.kind === 'image' && current.layerId) onMove(current.layerId, positionX, positionY);
    if (current.kind === 'text') onMoveText(positionX, positionY);
  }
  const faceLayers = layers.filter((layer) => layer.faceId === (layerFaceId ?? face.id) || (!layer.faceId && face.id === config.faces[0].id));
  const isFlatMug = config.kind === 'mug' && presentation === 'flat';
  const area = isFlatMug ? { left: 7, top: 10, width: 86, height: 80, radius: 1 } : face.area;
  return <div className={`product-2d-stage product-2d-${config.kind} product-2d-face-${face.id} ${isFlatMug ? 'product-2d-flat-art' : ''}`} style={face.mockup ? { aspectRatio: `${face.mockup.width} / ${face.mockup.height}` } : undefined}>
    {!isFlatMug && <ProductBase kind={config.kind} face={face} />}
    <div className={`product-2d-print-area ${selectedId ? 'has-selection' : ''} ${showGuides ? '' : 'guides-hidden'}`} style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%`, borderRadius: `${area.radius}%` }} onPointerDown={() => !readOnly && onSelect(null)}>
      {faceLayers.length === 0 && !textLayer?.value && showGuides && <span>Área de impressão</span>}
      {faceLayers.map((layer, index) => <div key={layer.id} className={`product-2d-layer ${selectedId === layer.id ? 'selected' : ''}`} style={{ left: `${layer.positionX}%`, top: `${layer.positionY}%`, width: `${layerWidthPercent(layer)}%`, transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)${config.kind === 'mug' && !isFlatMug ? ' scaleX(.92)' : ''}` }} onPointerDown={(event) => { if (readOnly) return; onSelect(layer.id); startDrag(event, 'image', layer); }} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
        <img src={layer.preview} alt={layer.name} draggable={false} /><b>{index + 1}</b>
      </div>)}
      {textLayer?.value && <span className="product-2d-text" style={{ left: `${textLayer.positionX}%`, top: `${textLayer.positionY}%`, color: textColors[textLayer.color] ?? '#071743', fontFamily: fonts[textLayer.font] ?? fonts.Moderna, fontSize: `${textLayer.size}px`, fontWeight: textLayer.bold ? 800 : 500, transform: `translate(-50%, -50%) rotate(${textLayer.rotation}deg)${config.kind === 'mug' && !isFlatMug ? ' scaleX(.92)' : ''}` }} onPointerDown={(event) => { if (!readOnly) startDrag(event, 'text'); }} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>{textLayer.value}</span>}
    </div>
  </div>;
}

function ProductBase({ kind, face }: { kind: Editor2DConfig['kind']; face: EditorFace }) {
  if (kind === 'mug') return <img className="product-2d-mug-photo" src="/produtos/mockups2d/caneca/frente.png" alt="Caneca branca de cerâmica" draggable={false} />;
  if (kind === 'tshirt' && face.mockup) return <img className="product-2d-tshirt-photo" src={face.mockup.src} alt={face.mockup.alt} draggable={false} />;
  if (kind === 'bottle' && face.mockup) return <img className="product-2d-bottle-photo" src={face.mockup.src} alt={face.mockup.alt} draggable={false} />;
  if (kind === 'phone-case' && face.mockup) return <img className="product-2d-phone-case-photo" src={face.mockup.src} alt={face.mockup.alt} draggable={false} />;
  if (kind === 'phone-case') return <svg viewBox="0 0 400 600" aria-hidden="true"><rect x="63" y="20" width="274" height="560" rx="44" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="8"/><rect x="88" y="48" width="92" height="106" rx="25" fill="#334155"/>{[0,1,2].map((i) => <circle key={i} cx={118 + (i % 2) * 34} cy={80 + Math.floor(i / 2) * 36} r="13" fill="#0f172a"/>)}</svg>;
  return <svg viewBox="0 0 700 430" aria-hidden="true"><rect x="25" y="50" width="650" height="330" rx="38" fill="#f8fafc" stroke="#334155" strokeWidth="12"/><rect x="42" y="67" width="616" height="296" rx="28" fill="none" stroke="#cbd5e1" strokeWidth="3"/></svg>;
}
