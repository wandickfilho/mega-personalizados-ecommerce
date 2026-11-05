'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/config/categories';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function CategoryShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} id="categorias" className={`category-circle-section scroll-mt-36 ${entered ? 'is-entered' : ''}`}><div className="section-shell"><header><h2>Navegue por <span>Categorias</span></h2><p>Encontre o produto perfeito para personalizar do seu jeito.</p></header><div className="category-circle-row">{CATEGORIES.map((category, index) => <Link key={category.id} href={`/?categoria=${category.id}#vitrine`} className="category-circle-link" style={{ '--category-delay': `${index * 60}ms` } as React.CSSProperties}><span className="category-circle-icon"><CategoryIcon icon={category.icon} className="h-8 w-8" /></span><strong>{category.shortName}</strong></Link>)}</div></div></section>;
}
