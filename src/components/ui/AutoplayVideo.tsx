'use client';

import { useEffect, useRef, useState } from 'react';

interface AutoplayVideoProps {
  src: string;
  label: string;
  className?: string;
}

export default function AutoplayVideo({ src, label, className }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Muted inline videos may autoplay; rejected attempts leave the card usable.
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2, rootMargin: '80px 0px' }
    );
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [reducedMotion]);

  return <>
    <video ref={videoRef} className={className} autoPlay muted loop playsInline preload="metadata" aria-label={label}>
      <source src={src} type="video/mp4" />
    </video>
    {reducedMotion && <button type="button" onClick={() => void videoRef.current?.play().catch(() => undefined)} className="production-motion-control">Reproduzir vídeo</button>}
  </>;
}
