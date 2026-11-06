'use client';

import { useRef } from 'react';
import type { ArtworkLayer, StageEditor } from '@/lib/personalization';
import { getPrintableArea, layerWidthPercent } from '@/lib/personalization';
import { Mousepad2D, PhoneCase2D } from './DeviceMockups';

const TEXT_COLORS: Record<string, string> = { 'Azul-marinho': '#071743', Vermelho: '#ff2448', Preto: '#17233b' };
const FONT_FAMILIES: Record<string, string> = { Classica: 'Georgia, serif', Manuscrita: 'cursive', Moderna: 'Manrope, sans-serif' };

interface ArtworkCanvasProps {
  editor: StageEditor;
  model?: string;
  tone?: string;
  layers: ArtworkLayer[];
  selectedId: string | null;
  text?: string;
  textColor?: string;
  font?: string;
  textSize?: number;
  onSelect: (id: string) => void;
  onMove: (id: string, positionX: number, positionY: number) => void;
}

interface DragState {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function ArtworkCanvas({ editor, model, tone, layers, selectedId, text, textColor = 'Azul-marinho', font = 'Moderna', textSize = 18, onSelect, onMove }: ArtworkCanvasProps) {
  const drag = useRef<DragState | null>(null);
  const area = getPrintableArea(editor, model);

  function startDrag(event: React.PointerEvent<HTMLDivElement>, layer: ArtworkLayer) {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: layer.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: layer.positionX, originY: layer.positionY, width: rect.width, height: rect.height };
    onSelect(layer.id);
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const nextX = clamp(current.originX + ((event.clientX - current.startX) / current.width) * 100, 4, 96);
    const nextY = clamp(current.originY + ((event.clientY - current.startY) / current.height) * 100, 4, 96);
    onMove(current.id, Number(nextX.toFixed(1)), Number(nextY.toFixed(1)));
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  }

  const printable = <div
    className={`artwork-print-area ${selectedId ? 'has-selection' : ''}`}
    style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%`, borderRadius: `${area.radius}%` }}
    aria-label={area.label}
  >
    {layers.length === 0 && !text && <span className="artwork-empty-hint">Arraste ou envie sua arte<br />para esta area</span>}
    {layers.map((layer, index) => <div
      key={layer.id}
      className={`artwork-layer ${selectedId === layer.id ? 'selected' : ''}`}
      style={{ left: `${layer.positionX}%`, top: `${layer.positionY}%`, width: `${layerWidthPercent(layer)}%`, transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)` }}
      onPointerDown={(event) => startDrag(event, layer)}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="button"
      tabIndex={0}
      aria-label={`${layer.name}. Arraste para reposicionar.`}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(layer.id); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={layer.preview} alt={layer.name} draggable={false} />
      <b className="artwork-layer-index">{index + 1}</b>
    </div>)}
    {text && <span className="artwork-text" style={{ color: TEXT_COLORS[textColor] ?? '#071743', fontFamily: FONT_FAMILIES[font] ?? 'Manrope, sans-serif', fontSize: `${textSize}px` }}>{text}</span>}
  </div>;

  if (editor === 'mousepad') return <div className="device-stage device-stage-mousepad"><Mousepad2D tone={tone}>{printable}</Mousepad2D></div>;
  if (editor === 'phone-case') return <div className="device-stage device-stage-phone"><PhoneCase2D model={model} tone={tone}>{printable}</PhoneCase2D></div>;
  return <div className="device-stage device-stage-generic">{printable}</div>;
}
