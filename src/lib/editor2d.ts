import type { PersonalizedProduct } from '@/data/personalizedProducts';

export type EditorFaceId = 'front' | 'right' | 'back' | 'sleeve' | 'top';

export interface EditorFace {
  id: EditorFaceId;
  name: string;
  area: { left: number; top: number; width: number; height: number; radius: number };
  movementLimits: { minX: number; maxX: number; minY: number; maxY: number };
  mockup?: { src: string; width: number; height: number; alt: string };
}

export interface Editor2DConfig {
  kind: 'mug' | 'tshirt' | 'bottle' | 'phone-case' | 'mousepad';
  mockup: { width: number; height: number };
  maxImages: number;
  faces: EditorFace[];
}

const PHONE_CASE_MOCKUPS: Record<string, EditorFace['mockup'] & Pick<EditorFace, 'area' | 'movementLimits'>> = {
  iPhone: { src: '/produtos/mockups2d/capinha/iphone.png', width: 1024, height: 1536, alt: 'Capinha transparente para iPhone', area: { left: 15, top: 33, width: 70, height: 55, radius: 7 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 } },
  'Samsung Galaxy': { src: '/produtos/mockups2d/capinha/samsung.png', width: 1024, height: 1536, alt: 'Capinha transparente para Samsung Galaxy', area: { left: 17, top: 39, width: 68, height: 50, radius: 7 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 } },
  'Xiaomi Redmi': { src: '/produtos/mockups2d/capinha/xiaomi-redmi.png', width: 1024, height: 1536, alt: 'Capinha transparente para Xiaomi Redmi', area: { left: 16, top: 33, width: 69, height: 56, radius: 7 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 } },
};

const configs: Record<string, Editor2DConfig> = {
  'caneca-linha-premium': { kind: 'mug', mockup: { width: 1536, height: 1024 }, maxImages: 3, faces: [
    { id: 'front', name: 'Visualização principal', area: { left: 25, top: 19, width: 40, height: 68, radius: 4 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 } },
  ] },
  'camiseta-personalizada': { kind: 'tshirt', mockup: { width: 1199, height: 1312 }, maxImages: 3, faces: [
    { id: 'front', name: 'Frente', area: { left: 33, top: 25, width: 34, height: 48, radius: 3 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 }, mockup: { src: '/produtos/mockups2d/camiseta/frente.png', width: 1199, height: 1312, alt: 'Camiseta branca vista de frente' } },
    { id: 'back', name: 'Costas', area: { left: 31, top: 21, width: 38, height: 54, radius: 3 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 }, mockup: { src: '/produtos/mockups2d/camiseta/costas.png', width: 1199, height: 1312, alt: 'Camiseta branca vista por trás' } },
    { id: 'sleeve', name: 'Manga', area: { left: 43, top: 28, width: 28, height: 42, radius: 12 }, movementLimits: { minX: 8, maxX: 92, minY: 8, maxY: 92 }, mockup: { src: '/produtos/mockups2d/camiseta/manga.png', width: 1312, height: 1199, alt: 'Manga branca de camiseta em vista lateral' } },
  ] },
  'garrafa-personalizada': { kind: 'bottle', mockup: { width: 1024, height: 1536 }, maxImages: 3, faces: [
    { id: 'front', name: 'Frente', area: { left: 35, top: 31, width: 30, height: 57, radius: 11 }, movementLimits: { minX: 6, maxX: 94, minY: 4, maxY: 96 }, mockup: { src: '/produtos/mockups2d/garrafa/frente.png', width: 1024, height: 1536, alt: 'Garrafa branca vista de frente' } },
    { id: 'right', name: 'Lateral', area: { left: 36, top: 31, width: 28, height: 57, radius: 11 }, movementLimits: { minX: 8, maxX: 92, minY: 4, maxY: 96 }, mockup: { src: '/produtos/mockups2d/garrafa/lateral.png', width: 1024, height: 1536, alt: 'Garrafa branca vista de lado' } },
    { id: 'back', name: 'Verso', area: { left: 34, top: 31, width: 32, height: 57, radius: 11 }, movementLimits: { minX: 6, maxX: 94, minY: 4, maxY: 96 }, mockup: { src: '/produtos/mockups2d/garrafa/verso.png', width: 1024, height: 1536, alt: 'Garrafa branca vista por trás' } },
  ] },
  'capinha-identidade': { kind: 'phone-case', mockup: { width: 400, height: 600 }, maxImages: 1, faces: [
    { id: 'back', name: 'Parte traseira', area: { left: 14, top: 27, width: 72, height: 62, radius: 8 }, movementLimits: { minX: 4, maxX: 96, minY: 4, maxY: 96 } },
  ] },
  'mousepad-personalizado': { kind: 'mousepad', mockup: { width: 700, height: 430 }, maxImages: 1, faces: [
    { id: 'top', name: 'Vista superior', area: { left: 8, top: 12, width: 84, height: 76, radius: 5 }, movementLimits: { minX: 2, maxX: 98, minY: 3, maxY: 97 } },
  ] },
};

export function getEditor2DConfig(product: PersonalizedProduct): Editor2DConfig {
  return configs[product.slug] ?? configs['mousepad-personalizado'];
}

export function resolveEditorFace(config: Editor2DConfig, face: EditorFace, model?: string): EditorFace {
  if (config.kind !== 'phone-case') return face;
  const mockup = PHONE_CASE_MOCKUPS[model ?? 'iPhone'] ?? PHONE_CASE_MOCKUPS.iPhone;
  return { ...face, mockup: { src: mockup.src, width: mockup.width, height: mockup.height, alt: mockup.alt }, area: mockup.area, movementLimits: mockup.movementLimits };
}
