export const MAX_ARTWORK_LAYERS = 5;
export const MAX_ARTWORK_BYTES = 8 * 1024 * 1024;

export type StageEditor = 'mug' | 'tshirt' | 'bottle' | 'phone-case' | 'mousepad' | 'generic';

export interface ArtworkLayer {
  id: string;
  name: string;
  fileName: string;
  preview: string;
  storageKey: string;
  naturalWidth: number;
  naturalHeight: number;
  baseWidth: number;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  /** Face do produto 2D à qual a arte pertence. */
  faceId?: string;
}

export interface TextLayer {
  value: string;
  positionX: number;
  positionY: number;
  rotation: number;
  size: number;
  color: string;
  font: string;
  bold: boolean;
}

export interface PrintableAreaConfig {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
  label: string;
}

export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getPrintableArea(editor: StageEditor, model?: string): PrintableAreaConfig {
  if (editor === 'phone-case') {
    if (model === 'Samsung Galaxy') return { left: 8, top: 28, width: 84, height: 64, radius: 10, label: 'Area de impressao da capinha' };
    if (model === 'Motorola') return { left: 8, top: 26, width: 84, height: 66, radius: 10, label: 'Area de impressao da capinha' };
    return { left: 9, top: 25, width: 82, height: 67, radius: 10, label: 'Area de impressao da capinha' };
  }
  if (editor === 'mousepad') return { left: 6, top: 7, width: 88, height: 86, radius: 3, label: 'Superficie de impressao do mousepad' };
  return { left: 10, top: 10, width: 80, height: 80, radius: 2, label: 'Area de personalizacao' };
}

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Nao foi possivel ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, body] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? 'application/octet-stream';
  if (header.includes(';base64')) {
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Imagem invalida.'));
    image.src = source;
  });
}

export async function createArtworkLayer(file: File): Promise<ArtworkLayer> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Envie uma imagem PNG, JPG ou WebP.');
  }
  if (file.size > MAX_ARTWORK_BYTES) {
    throw new Error('Cada imagem deve ter no maximo 8 MB.');
  }
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const maxSide = 760;
  const ratio = Math.max(1, Math.max(image.width, image.height) / maxSide);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width / ratio));
  canvas.height = Math.max(1, Math.round(image.height / ratio));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Nao foi possivel preparar a imagem.');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  let preview = '';
  try {
    preview = canvas.toDataURL('image/webp', 0.86);
  } catch {
    preview = canvas.toDataURL('image/png');
  }
  if (!preview || preview === 'data:,') preview = canvas.toDataURL('image/png');
  const imageRatio = image.width / Math.max(1, image.height);
  const baseWidth = imageRatio >= 1 ? 46 : Math.max(20, 46 * imageRatio);
  return {
    id: createId(),
    name: file.name.replace(/\.[^.]+$/, '').slice(0, 42) || 'Minha arte',
    fileName: file.name,
    preview,
    storageKey: `${createId()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '-').slice(-48)}`,
    naturalWidth: image.width,
    naturalHeight: image.height,
    baseWidth,
    positionX: 50,
    positionY: 50,
    scale: 100,
    rotation: 0,
  };
}

export function layerWidthPercent(layer: ArtworkLayer) {
  return Math.max(4, layer.baseWidth * (layer.scale / 100));
}

const PREVIEW_SIZE = 900;
const PALETTES: Record<string, { case: string; pad: string; ink: string; line: string }> = {
  navy: { case: '#0b1743', pad: '#0b1743', ink: '#f5f7fb', line: 'rgba(255,255,255,.2)' },
  royal: { case: '#1537a0', pad: '#1537a0', ink: '#fff', line: 'rgba(255,255,255,.24)' },
  red: { case: '#e32636', pad: '#e32636', ink: '#fff', line: 'rgba(255,255,255,.28)' },
  ice: { case: '#dce6f7', pad: '#dce6f7', ink: '#0b1743', line: 'rgba(11,23,67,.14)' },
  white: { case: '#ffffff', pad: '#ffffff', ink: '#0b1743', line: 'rgba(11,23,67,.12)' },
};

interface PreviewOptions {
  editor: StageEditor;
  model?: string;
  tone?: string;
  layers: ArtworkLayer[];
  text?: string;
  textColor?: string;
  font?: string;
  textSize?: number;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawCamera(context: CanvasRenderingContext2D, model: string, x: number, y: number, cell: number) {
  context.save();
  if (model === 'Samsung Galaxy') {
    roundedRect(context, x, y, cell * 0.95, cell * 1.55, cell * 0.32);
    context.fillStyle = '#1c2433';
    context.fill();
    [0.34, 0.76, 1.18].forEach((offset) => {
      context.beginPath();
      context.arc(x + cell * 0.47, y + cell * offset, cell * 0.17, 0, Math.PI * 2);
      context.fillStyle = '#0b0f18';
      context.fill();
      context.beginPath();
      context.arc(x + cell * 0.47, y + cell * offset, cell * 0.075, 0, Math.PI * 2);
      context.fillStyle = '#3b4b6b';
      context.fill();
    });
  } else if (model === 'Motorola') {
    roundedRect(context, x, y, cell * 1.05, cell * 1.35, cell * 0.28);
    context.fillStyle = '#1b2330';
    context.fill();
    [[0.38, 0.36], [0.38, 0.88], [0.78, 0.62]].forEach(([ox, oy]) => {
      context.beginPath();
      context.arc(x + cell * ox, y + cell * oy, cell * 0.16, 0, Math.PI * 2);
      context.fillStyle = '#090d15';
      context.fill();
      context.beginPath();
      context.arc(x + cell * ox, y + cell * oy, cell * 0.07, 0, Math.PI * 2);
      context.fillStyle = '#41527a';
      context.fill();
    });
  } else {
    roundedRect(context, x, y, cell, cell * 1.02, cell * 0.26);
    context.fillStyle = '#1b2330';
    context.fill();
    [[0.32, 0.3], [0.7, 0.3], [0.32, 0.7], [0.7, 0.7]].forEach(([ox, oy], index) => {
      context.beginPath();
      context.arc(x + cell * ox, y + cell * oy, cell * (index === 3 ? 0.1 : 0.16), 0, Math.PI * 2);
      context.fillStyle = index === 3 ? '#f4d06f' : '#090d15';
      context.fill();
      if (index !== 3) {
        context.beginPath();
        context.arc(x + cell * ox, y + cell * oy, cell * 0.065, 0, Math.PI * 2);
        context.fillStyle = '#41527a';
        context.fill();
      }
    });
  }
  context.restore();
}

export async function renderCompositePreview(options: PreviewOptions): Promise<string> {
  const { editor, model = '', tone = 'navy', layers, text, textColor, font, textSize = 18 } = options;
  const palette = PALETTES[tone] ?? PALETTES.navy;
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');
  if (!context) return '';
  context.fillStyle = '#eef2f8';
  context.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

  let area = { left: 0, top: 0, width: PREVIEW_SIZE, height: PREVIEW_SIZE };

  if (editor === 'phone-case') {
    context.save();
    context.shadowColor = 'rgba(7,23,67,.18)';
    context.shadowBlur = 42;
    context.shadowOffsetY = 26;
    roundedRect(context, 248, 72, 404, 756, 72);
    context.fillStyle = palette.case;
    context.fill();
    context.restore();
    roundedRect(context, 248, 72, 404, 756, 72);
    context.strokeStyle = palette.line;
    context.lineWidth = 6;
    context.stroke();
    drawCamera(context, model, 282, 106, 92);
    const config = getPrintableArea('phone-case', model);
    area = {
      left: 248 + (config.left / 100) * 404,
      top: 72 + (config.top / 100) * 756,
      width: (config.width / 100) * 404,
      height: (config.height / 100) * 756,
    };
  } else if (editor === 'mousepad') {
    context.save();
    context.shadowColor = 'rgba(7,23,67,.16)';
    context.shadowBlur = 32;
    context.shadowOffsetY = 18;
    roundedRect(context, 78, 238, 744, 424, 58);
    context.fillStyle = palette.pad;
    context.fill();
    context.restore();
    roundedRect(context, 78, 238, 744, 424, 58);
    context.strokeStyle = palette.line;
    context.lineWidth = 5;
    context.stroke();
    roundedRect(context, 94, 252, 712, 396, 46);
    context.strokeStyle = 'rgba(255,255,255,.18)';
    context.lineWidth = 2;
    context.stroke();
    const config = getPrintableArea('mousepad');
    area = {
      left: 78 + (config.left / 100) * 744,
      top: 238 + (config.top / 100) * 424,
      width: (config.width / 100) * 744,
      height: (config.height / 100) * 424,
    };
  }

  for (const layer of layers) {
    if (!layer.preview) continue;
    try {
      const image = await loadImage(layer.preview);
      const width = (layerWidthPercent(layer) / 100) * area.width;
      const height = width * (image.height / Math.max(1, image.width));
      const centerX = area.left + (layer.positionX / 100) * area.width;
      const centerY = area.top + (layer.positionY / 100) * area.height;
      context.save();
      context.translate(centerX, centerY);
      context.rotate((layer.rotation * Math.PI) / 180);
      context.drawImage(image, -width / 2, -height / 2, width, height);
      context.restore();
    } catch {
      // Ignore an unreadable preview while composing the order snapshot.
    }
  }

  if (text) {
    context.save();
    const textFamilies: Record<string, string> = { Classica: 'Georgia, serif', Manuscrita: 'cursive', Moderna: 'Manrope, sans-serif' };
    context.fillStyle = textColor === 'Vermelho' ? '#ff2448' : textColor === 'Preto' ? '#17233b' : '#071743';
    context.font = `800 ${Math.max(18, textSize * 2.6)}px ${textFamilies[font ?? ''] ?? 'Manrope, sans-serif'}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text.slice(0, 48), area.left + area.width / 2, area.top + area.height * 0.52, area.width * 0.9);
    context.restore();
  }

  try {
    return canvas.toDataURL('image/webp', 0.9);
  } catch {
    return canvas.toDataURL('image/png');
  }
}
