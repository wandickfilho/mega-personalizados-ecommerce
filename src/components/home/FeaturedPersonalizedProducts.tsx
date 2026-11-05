import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { PERSONALIZED_PRODUCTS, type PersonalizedProduct } from '@/data/personalizedProducts';
import { getCategory } from '@/config/categories';
import { formatCurrency } from '@/lib/utils';

interface FeaturedPersonalizedProductsProps {
  catalog?: boolean;
}

function ProductVideo({ product }: { product: PersonalizedProduct }) {
  if (!product.media) return null;

  return (
    <video
      className="featured-product-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={product.media.alt}
    >
      <source src={product.media.src} type="video/mp4" />
    </video>
  );
}

export default function FeaturedPersonalizedProducts({ catalog = false }: FeaturedPersonalizedProductsProps) {
  const products = PERSONALIZED_PRODUCTS.filter((product) => product.media);
  const title = catalog ? 'Todos os personalizados' : 'Personalizados em Destaque';

  return (
    <section id="personalizados-destaque" className="featured-products-section scroll-mt-32">
      <div className="section-shell">
        <header className="featured-products-heading">
          <div>
            <span className="section-kicker">Seleção Mega</span>
            <h1 className={catalog ? 'section-title mt-4' : 'section-title mt-4'}>{title}</h1>
            <p>Encontre o presente perfeito ou crie algo único com a sua personalidade.</p>
          </div>
          <div className="featured-price-notice">Preços demonstrativos, sujeitos à confirmação</div>
        </header>

        <div className="featured-products-grid">
          {products.map((product) => {
            const category = getCategory(product.category);
            return (
              <article key={product.id} className="featured-product-card group">
                <Link href={`/personalizados/${product.slug}`} className="featured-product-media" aria-label={`Ver ${product.name}`}>
                  <ProductVideo product={product} />
                  <span className="featured-product-badge"><Play className="h-3 w-3 fill-current" aria-hidden /> Produto real</span>
                </Link>
                <div className="featured-product-copy">
                  <p>{category?.shortName ?? 'Personalizados'}</p>
                  <h2>{product.name}</h2>
                  <div className="featured-product-footer">
                    <div>
                      <strong>{product.demonstrativePrice ? formatCurrency(product.demonstrativePrice) : 'Sob consulta'}</strong>
                      <span>Valor demonstrativo</span>
                    </div>
                    <Link href={`/personalizados/${product.slug}`} className="featured-product-action">Personalizar <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!catalog && <div className="mt-9 text-center"><Link href="/personalizados" className="featured-products-all">Ver todos os personalizados <ArrowRight className="h-4 w-4" aria-hidden /></Link></div>}
      </div>
    </section>
  );
}
