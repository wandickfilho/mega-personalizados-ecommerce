'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Bounds, Center, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Custom3DModel } from '@/data/personalizedProducts';

export interface ThreeArtworkLayer {
  preview: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
}

export interface ThreeDesign {
  artworkUrl?: string;
  layers?: ThreeArtworkLayer[];
  text?: string;
  textColor?: string;
  font?: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  textSize: number;
}

interface Product3DViewerProps {
  product: Custom3DModel;
  design: ThreeDesign;
  color?: string;
  onCapture?: (image: string) => void;
  captureRequest?: number;
  resetRequest?: number;
  onDesignChange?: (patch: Partial<ThreeDesign>) => void;
}

export const MODEL_PATHS: Record<Custom3DModel, string> = {
  mug: '/models/plain_mug.glb',
  tshirt: '/models/t_shirt.glb',
  bottle: '/models/thermos_-_hydration_bottle_24oz.glb',
  'phone-case': '/models/phone_case.glb',
  mousepad: '/models/mouse_pad.glb',
};

const textColors: Record<string, string> = { 'Azul-marinho': '#071743', Vermelho: '#ff2448', Preto: '#17233b' };

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Imagem invalida'));
    image.src = source;
  });
}

function useArtworkTexture(design: ThreeDesign) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.flipY = false;
    return result;
  }, []);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;
    let cancelled = false;
    const layers = design.layers?.length
      ? design.layers
      : design.artworkUrl
        ? [{ preview: design.artworkUrl, positionX: design.positionX, positionY: design.positionY, scale: design.scale, rotation: design.rotation }]
        : [];

    async function draw() {
      const images = await Promise.all(layers.map(async (layer) => {
        try { return await loadImage(layer.preview); } catch { return null; }
      }));
      if (cancelled) return;
      ctx.clearRect(0, 0, 1024, 1024);
      layers.forEach((layer, index) => {
        const image = images[index];
        if (!image) return;
        const x = layer.positionX * 10.24;
        const y = (100 - layer.positionY) * 10.24;
        const ratio = Math.min(450 / image.width, 450 / image.height) * (layer.scale / 100);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((-layer.rotation * Math.PI) / 180);
        ctx.drawImage(image, (-image.width * ratio) / 2, (-image.height * ratio) / 2, image.width * ratio, image.height * ratio);
        ctx.restore();
      });
      if (design.text) {
        ctx.save();
        ctx.fillStyle = textColors[design.textColor ?? ''] ?? '#071743';
        ctx.font = `800 ${design.textSize * 3}px ${design.font === 'Classica' ? 'Georgia' : design.font === 'Manuscrita' ? 'cursive' : 'Manrope, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(design.text.slice(0, 48), 512, layers.length ? 740 : 512, 760);
        ctx.restore();
      }
      texture.needsUpdate = true; // eslint-disable-line react-hooks/immutability
    }

    void draw();
    return () => { cancelled = true; };
  }, [design, texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function isPrintableMesh(product: Custom3DModel, mesh: THREE.Mesh) {
  const materialName = Array.isArray(mesh.material) ? mesh.material.map((entry) => entry.name).join(' ') : mesh.material.name;
  const name = `${mesh.name} ${materialName}`.toLowerCase();
  if (product === 'tshirt') return name.includes('body_front');
  if (product === 'bottle') return name.includes('cylinder_thermos');
  if (product === 'mousepad') return name.includes('mouse_pad');
  return true;
}

function usePrintablePointer(overlay: THREE.Object3D | null, enabled: boolean, onDesignChange?: (patch: Partial<ThreeDesign>) => void) {
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const dragging = useRef(false);

  function update(event: { clientX: number; clientY: number }) {
    if (!overlay) return;
    const rect = gl.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // eslint-disable-line react-hooks/immutability
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(overlay, true);
    if (!hits.length || !hits[0].uv) return;
    onDesignChange?.({ positionX: hits[0].uv.x * 100, positionY: (1 - hits[0].uv.y) * 100 });
  }

  return {
    onPointerDown: (event: { clientX: number; clientY: number }) => { if (!enabled) return; dragging.current = true; update(event); },
    onPointerMove: (event: { clientX: number; clientY: number }) => { if (dragging.current) update(event); },
    onPointerUp: () => { dragging.current = false; },
    onPointerLeave: () => { dragging.current = false; },
  };
}

function GLBProduct({ product, texture, editMode, onDesignChange }: { product: Custom3DModel; texture: THREE.Texture; editMode: boolean; onDesignChange?: (patch: Partial<ThreeDesign>) => void }) {
  const { scene } = useGLTF(MODEL_PATHS[product]);
  const original = useMemo(() => scene.clone(true), [scene]);
  const printOverlay = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      if (!isPrintableMesh(product, object)) { object.visible = false; return; }
      object.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      object.renderOrder = 2;
    });
    return clone;
  }, [product, scene, texture]);
  useEffect(() => () => {
    printOverlay.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
  }, [printOverlay]);
  const pointer = usePrintablePointer(printOverlay, editMode, onDesignChange);
  return <Center><primitive object={original} /><primitive object={printOverlay} {...pointer} /></Center>;
}

function MugViewer({ design, color, editMode, onDesignChange }: { design: ThreeDesign; color?: string; editMode: boolean; onDesignChange?: (patch: Partial<ThreeDesign>) => void }) {
  const texture = useArtworkTexture(design);
  const { scene } = useGLTF(MODEL_PATHS.mug);
  const materialColor = color === 'Preta' ? '#1f2937' : '#f4f4f5';
  const original = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      object.material = materials.map((material) => {
        const next = material.clone();
        if ('color' in next) next.color = new THREE.Color(materialColor);
        return next;
      }) as THREE.Material | THREE.Material[];
    });
    return clone;
  }, [scene, materialColor]);
  const printOverlay = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      if (!isPrintableMesh('mug', object)) { object.visible = false; return; }
      object.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      object.renderOrder = 2;
    });
    return clone;
  }, [scene, texture]);
  useEffect(() => () => {
    printOverlay.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
  }, [printOverlay]);
  const pointer = usePrintablePointer(printOverlay, editMode, onDesignChange);
  return <Center><primitive object={original} /><primitive object={printOverlay} {...pointer} /></Center>;
}

function Scene({ product, design, color, captureRequest, onCapture, resetRequest, onDesignChange, editMode }: Product3DViewerProps & { editMode: boolean }) {
  const texture = useArtworkTexture(design);
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const { gl, camera, scene } = useThree();
  useEffect(() => { controls.current?.saveState(); }, []);
  useEffect(() => { if (resetRequest) controls.current?.reset(); }, [resetRequest]);
  useEffect(() => { if (!captureRequest || !onCapture) return; gl.render(scene, camera); onCapture(gl.domElement.toDataURL('image/png')); }, [captureRequest, onCapture, gl, camera, scene]);
  useEffect(() => { if (controls.current) controls.current.enabled = !editMode; }, [editMode]);
  return <>
    <ambientLight intensity={1.35} />
    <directionalLight position={[4, 5, 4]} intensity={2.1} castShadow />
    <directionalLight position={[-3, 2, 3]} intensity={1} />
    <Suspense fallback={null}>
      {product === 'mug'
        ? <Bounds fit clip observe margin={1.15}><MugViewer design={design} color={color} editMode={editMode} onDesignChange={onDesignChange} /></Bounds>
        : <Bounds fit clip observe margin={1.35}><GLBProduct product={product} texture={texture} editMode={editMode} onDesignChange={onDesignChange} /></Bounds>}
    </Suspense>
    <ContactShadows position={[0, -1.25, 0]} opacity={0.22} scale={8} blur={2.5} far={4} />
    <OrbitControls ref={controls} enablePan={false} minDistance={1.2} maxDistance={10} />
  </>;
}

export default function Product3DViewer(props: Product3DViewerProps) {
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const frame = window.requestAnimationFrame(() => {
      setWebglAvailable(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (webglAvailable === false) return <div className="viewer-3d-fallback">A previa 3D nao esta disponivel neste dispositivo. Sua personalizacao sera revisada pela equipe antes da producao.</div>;
  return <div className="viewer-3d-canvas" style={{ position: 'relative', background: '#f3f4f6' }}>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 34 }} gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: 'high-performance' }} fallback={<div className="viewer-3d-fallback">Seu navegador nao oferece suporte a WebGL.</div>}>
      <Scene {...props} editMode={editMode} />
    </Canvas>
    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
      <button type="button" onClick={() => setEditMode(false)} style={{ padding: '6px 10px', background: !editMode ? '#ff2448' : '#e2e8f0', color: !editMode ? '#fff' : '#0f172a', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Girar produto</button>
      <button type="button" onClick={() => setEditMode(true)} style={{ padding: '6px 10px', background: editMode ? '#ff2448' : '#e2e8f0', color: editMode ? '#fff' : '#0f172a', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Arrastar arte</button>
    </div>
    <span className="viewer-3d-hint">Arraste para girar, use a roda para aproximar.</span>
  </div>;
}
