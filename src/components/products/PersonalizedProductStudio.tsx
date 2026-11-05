'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ImagePlus, ShoppingBag } from 'lucide-react';
import type { PersonalizedProduct } from '@/data/personalizedProducts';
import ProductMockup from './ProductMockup';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';

export default function PersonalizedProductStudio({ product }: { product: PersonalizedProduct }) {
  const { addPersonalizedItem } = useCart();
  const [text, setText] = useState(''); const [notes, setNotes] = useState(''); const [artworkName, setArtworkName] = useState(''); const [quantity, setQuantity] = useState(1); const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);
  const options = product.options ?? {};
  function addToCart() {
    addPersonalizedItem(product, { text: text.trim() || undefined, notes: notes.trim() || undefined, artworkName: artworkName || undefined }, quantity);
    setAdded(true); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setAdded(false), 1800);
  }
  return <main className="studio-page"><div className="section-shell py-8 sm:py-12"><Link href="/#vitrine" className="studio-back"><ChevronLeft className="h-4 w-4" /> Voltar à vitrine</Link><div className="studio-layout mt-6">
    <section className="studio-visual"><div className="studio-visual-head"><span>{product.media ? 'Produto real em vídeo' : 'Prévia ilustrativa'}</span><span>{product.technique}</span></div><div className="studio-mockup">{product.media ? <video className="studio-product-video" autoPlay muted loop playsInline preload="metadata" aria-label={product.media.alt}><source src={product.media.src} type="video/mp4" /></video> : <ProductMockup variant={product.mockup} tone={product.tone} label={text || product.name} className="h-64 w-64 sm:h-80 sm:w-80" />}</div><p>A prévia é uma referência visual e não substitui a aprovação da arte, material ou acabamento.</p></section>
    <section className="studio-form"><p className="section-kicker">Personalization Studio</p><h1>{product.name}</h1><p className="studio-description">{product.description}</p><p className="studio-price">{product.demonstrativePrice ? formatCurrency(product.demonstrativePrice) : 'Valor sob consulta'}</p><p className="studio-price-note">{product.demonstrativePrice ? 'Valor demonstrativo. A equipe confirma a composição e o preço oficial antes de qualquer pagamento.' : 'Este item não possui preço cadastrado. A equipe confirma a composição antes do pagamento.'}</p>
      <div className="studio-fields">
        {options.text && <label>Nome ou frase<input value={text} onChange={(event) => setText(event.target.value)} maxLength={48} placeholder="Ex.: Nome, frase ou marca" /></label>}
        {options.artwork && <label>Arte ou imagem<input type="file" accept="image/*" onChange={(event) => setArtworkName(event.target.files?.[0]?.name ?? '')} /><span className="studio-upload-note"><ImagePlus className="h-3.5 w-3.5" /> {artworkName || 'O arquivo não é enviado ainda; o nome acompanha sua solicitação.'}</span></label>}
        {options.notes && <label>Observações<textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={300} placeholder="Conte detalhes importantes para sua solicitação." rows={3} /></label>}
        <label>Quantidade<select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{[1, 2, 3, 4, 5, 10].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      <button type="button" onClick={addToCart} className="studio-add"><span>{added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}</span>{added ? 'Adicionado ao carrinho' : 'Adicionar solicitação ao carrinho'}</button>
      <p className="studio-disclaimer">A arte não é armazenada pelo site nesta etapa. Após uma integração segura de uploads, o arquivo poderá ser enviado junto ao pedido.</p>
    </section>
  </div></div></main>;
}
