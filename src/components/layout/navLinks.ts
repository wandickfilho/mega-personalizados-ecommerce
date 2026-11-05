export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Categorias', href: '/#categorias' },
  { label: 'Produção', href: '/#producao' },
  { label: 'Studio', href: '/#personalizacao' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Corporativo', href: '/#corporativo' },
  { label: 'Contato', href: '/contato' },
];
