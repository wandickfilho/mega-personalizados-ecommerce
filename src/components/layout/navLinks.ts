export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Celulares', href: '/celulares' },
  { label: 'Marcas', href: '/marcas' },
  { label: 'Sobre nós', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];
