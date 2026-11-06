export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Personalize em 3D', href: '/#personalizados-3d' },
  { label: 'Produção', href: '/#producao' },
  { label: 'Outros Personalizados', href: '/personalizados/outros' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Corporativo', href: '/#corporativo' },
  { label: 'Contato', href: '/contato' },
];
