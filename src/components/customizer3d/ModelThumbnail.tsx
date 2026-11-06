'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, ContactShadows, useGLTF } from '@react-three/drei';
import type { Custom3DModel } from '@/data/personalizedProducts';
import { MODEL_PATHS } from './Product3DViewer';

function ThumbnailModel({ model }: { model: Custom3DModel }) {
  const { scene } = useGLTF(MODEL_PATHS[model]);
  return <Center><primitive object={scene.clone(true)} /></Center>;
}

function LoadedThumbnail({ model }: { model: Custom3DModel }) {
  return <Canvas dpr={1} camera={{ position: [0, 0, 3], fov: 34 }} gl={{ antialias: true, powerPreference: 'low-power' }}><ambientLight intensity={1.4} /><directionalLight position={[4, 5, 4]} intensity={2} /><Suspense fallback={null}><Bounds fit clip observe margin={1.45}><ThumbnailModel model={model} /></Bounds></Suspense><ContactShadows position={[0, -1.25, 0]} opacity={0.18} scale={7} blur={2.5} far={4} /></Canvas>;
}

export default function ModelThumbnail({ model }: { model: Custom3DModel }) {
  const ref = useRef<HTMLDivElement>(null); const [active, setActive] = useState(false);
  useEffect(() => { const target = ref.current; if (!target || !('IntersectionObserver' in window)) { setActive(true); return; } const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } }, { rootMargin: '160px' }); observer.observe(target); return () => observer.disconnect(); }, []);
  return <div ref={ref} className="model-thumbnail" aria-label="Prévia 3D do produto">{active ? <LoadedThumbnail model={model} /> : <span>Prévia 3D</span>}</div>;
}
