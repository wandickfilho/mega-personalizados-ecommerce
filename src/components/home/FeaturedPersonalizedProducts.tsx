
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Gift,
  ImagePlus,
  Pencil,
  Layers3,
} from 'lucide-react';

import {
  PERSONALIZED_PRODUCTS,
  type PersonalizedProduct,
} from '@/data/personalizedProducts';

const PRODUCT_ORDER = [
  'mug',
  'tshirt',
  'bottle',
  'phone-case',
  'mousepad',
] as const;

const CARD_ACCENTS: Record<string, string> = {
  mug: '#ff2448',
  tshirt: '#ffc21a',
  bottle: '#16b9ee',
  'phone-case': '#a855f7',
  mousepad: '#65d834',
};

const PRODUCT_IMAGES: Record<string, string> = {
  mug: '/produtos/imagens2D/caneca-2d.png',
  tshirt: '/produtos/imagens2D/camisa-2d.png',
  bottle: '/produtos/imagens2D/garrafa-2d.png',
  'phone-case': '/produtos/imagens2D/capinha-2d.png',
  mousepad: '/produtos/imagens2D/mousepad-2d.png',
};

function productKey(product: PersonalizedProduct): string {
  return product.editor2d ?? '';
}

function ProductCard({
  product,
}: {
  product: PersonalizedProduct;
}) {
  const key = productKey(product);
  const accent = CARD_ACCENTS[key] ?? '#ff2448';
  const image = PRODUCT_IMAGES[key];

  return (
    <article
      className="mega-product-banner group"
      style={
        { '--product-accent': accent } as React.CSSProperties
      }
    >
      <div className="mega-product-copy">
        <span className="mega-model-badge">
          <Layers3 className="h-4 w-4" />
          2D personalizável
        </span>

        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <Link
          href={`/personalizados/${product.slug}`}
          className="mega-product-button"
        >
          Personalizar em 2D
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Link
        href={`/personalizados/${product.slug}`}
        aria-label={`Personalizar ${product.name} em 2D`}
        className="mega-product-model"
      >
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 45vw, 42vw"
            className="mega-product-image object-contain"
          />
        )}

        <i className="mega-product-mark one" />
        <i className="mega-product-mark two" />
        <i className="mega-product-mark three" />
      </Link>
    </article>
  );
}

function OtherProductsCard() {
  return (
    <article className="mega-product-banner mega-other-banner">
      <div className="mega-product-copy">
        <span className="mega-model-badge">
          <Gift className="h-4 w-4" />
          Projetos especiais
        </span>

        <h2>Outros Personalizados</h2>

        <p>
          Chaveiros, bonés, almofadas, brindes e muito mais!
        </p>

        <Link
          href="/personalizados/outros"
          className="mega-other-button"
        >
          Falar com um vendedor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Link
        href="/personalizados/outros"
        aria-label="Falar com um vendedor sobre outros personalizados"
        className="mega-gift-visual"
      >
        <Gift className="h-28 w-28" />
        <span />
      </Link>
    </article>
  );
}

function StudioBenefits() {
  return (
    <div className="mega-studio-visual">
      <div className="mega-orbit-cube">
        <Layers3 className="h-16 w-16" />
        <i />
        <b />
      </div>

      <div className="mega-benefit-list">
        <span>
          <Layers3 className="h-5 w-5" />
          Prévia personalizada em 2D
        </span>

        <span>
          <Pencil className="h-5 w-5" />
          Imagens e textos por área
        </span>

        <span>
          <ImagePlus className="h-5 w-5" />
          Envie suas próprias artes
        </span>
      </div>
    </div>
  );
}

export default function FeaturedPersonalizedProducts({
  query = '',
}: {
  query?: string;
}) {
  const term = query.trim().toLocaleLowerCase('pt-BR');

  const products = PRODUCT_ORDER
    .map((key) =>
      PERSONALIZED_PRODUCTS.find(
        (product) => productKey(product) === key
      )
    )
    .filter(
      (product): product is PersonalizedProduct =>
        Boolean(product)
    )
    .filter(
      (product) =>
        !term ||
        `${product.name} ${product.description}`
          .toLocaleLowerCase('pt-BR')
          .includes(term)
    );

  return (
    <section
      id="personalizados-2d"
      className="mega-studio-section scroll-mt-32"
    >
      <div className="section-shell">
        <header className="mega-studio-intro">
          <div>
            <span className="mega-studio-kicker">
              MEGA CUSTOM STUDIO
            </span>

            <h1>
              Crie do seu jeito, <em>visualize antes</em>
            </h1>

            <p>
              Personalize capinhas, canecas, camisetas,
              garrafas e mousepads com suas próprias
              imagens, textos e ajustes individuais.
            </p>
          </div>

          <StudioBenefits />
        </header>

        {products.length ? (
          <div className="mega-product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

            {!term && <OtherProductsCard />}
          </div>
        ) : (
          <p className="mega-empty-search">
            Nenhum produto encontrado para “{query}”.
          </p>
        )}
      </div>
    </section>
  );
}
