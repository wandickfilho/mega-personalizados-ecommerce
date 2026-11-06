import type { Editor2DConfig } from '@/lib/editor2d';
import type { ArtworkLayer, TextLayer } from '@/lib/personalization';

/** Serializável e independente de URLs temporárias; pronto para a futura integração de pedido. */
export interface PersonalizationDocument {
  schemaVersion: 1;
  productId: string;
  productSlug: string;
  selectedModel?: string;
  faces: Array<{
    id: string;
    name: string;
    printableArea: { left: number; top: number; width: number; height: number; radius: number };
    elements: { images: ArtworkLayer[]; text?: TextLayer };
    preview: { status: 'render-on-demand' };
  }>;
}

export function createPersonalizationDocument({ productId, productSlug, selectedModel, config, layers, texts }: {
  productId: string; productSlug: string; selectedModel?: string; config: Editor2DConfig; layers: ArtworkLayer[]; texts: Record<string, TextLayer>;
}): PersonalizationDocument {
  return {
    schemaVersion: 1, productId, productSlug, selectedModel,
    faces: config.faces.map((face) => ({
      id: face.id, name: face.name, printableArea: face.area,
      elements: { images: layers.filter((layer) => layer.faceId === face.id), text: texts[face.id]?.value ? texts[face.id] : undefined },
      preview: { status: 'render-on-demand' },
    })),
  };
}
