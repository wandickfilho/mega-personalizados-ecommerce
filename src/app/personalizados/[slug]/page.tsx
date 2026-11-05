import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PERSONALIZED_PRODUCTS, getPersonalizedProductBySlug } from '@/data/personalizedProducts';
import PersonalizedProductStudio from '@/components/products/PersonalizedProductStudio';

interface PageProps { params: Promise<{ slug: string }>; }
export function generateStaticParams() { return PERSONALIZED_PRODUCTS.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const { slug } = await params; const product = getPersonalizedProductBySlug(slug); return product ? { title: `${product.name} | Personalização`, description: product.description } : { title: 'Produto não encontrado' }; }
export default async function PersonalizedProductPage({ params }: PageProps) { const { slug } = await params; const product = getPersonalizedProductBySlug(slug); if (!product) notFound(); return <PersonalizedProductStudio product={product} />; }
