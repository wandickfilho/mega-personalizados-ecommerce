export type CategoryIconKey =
  | 'smartphone'
  | 'tablet'
  | 'coffee'
  | 'key'
  | 'cap'
  | 'briefcase'
  | 'gift'
  | 'building'
  | 'printer'
  | 'laser'
  | 'layers';

export type CategoryId =
  | 'capinhas-celular'
  | 'capas-tablet'
  | 'canecas'
  | 'chaveiros'
  | 'bones'
  | 'necessaires'
  | 'presentes'
  | 'brindes-corporativos';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: CategoryIconKey;
}

export type ServiceId = 'gravacao-laser' | 'impressao-dtf' | 'impressao-flatbed';

export interface Service {
  id: ServiceId;
  name: string;
  shortName: string;
  description: string;
  icon: CategoryIconKey;
}

export const CATEGORIES: Category[] = [
  {
    id: 'capinhas-celular',
    name: 'Capinhas personalizadas',
    shortName: 'Capinhas',
    description: 'Proteção com a sua identidade, para diferentes modelos.',
    icon: 'smartphone',
  },
  {
    id: 'capas-tablet',
    name: 'Capas de tablet',
    shortName: 'Capas de tablet',
    description: 'Capas sob medida para estudo, trabalho e criação.',
    icon: 'tablet',
  },
  {
    id: 'canecas',
    name: 'Canecas personalizadas',
    shortName: 'Canecas',
    description: 'Presentes que começam o dia com a sua mensagem.',
    icon: 'coffee',
  },
  {
    id: 'chaveiros',
    name: 'Chaveiros personalizados',
    shortName: 'Chaveiros',
    description: 'Pequenos detalhes com grande significado.',
    icon: 'key',
  },
  {
    id: 'bones',
    name: 'Bonés personalizados',
    shortName: 'Bonés',
    description: 'Marcas, times e projetos com acabamento profissional.',
    icon: 'cap',
  },
  {
    id: 'necessaires',
    name: 'Nécessaires personalizadas',
    shortName: 'Nécessaires',
    description: 'Organização e estilo para o dia a dia e viagens.',
    icon: 'briefcase',
  },
  {
    id: 'presentes',
    name: 'Presentes personalizados',
    shortName: 'Presentes',
    description: 'Lembranças e composições criadas para marcar momentos.',
    icon: 'gift',
  },
  {
    id: 'brindes-corporativos',
    name: 'Brindes corporativos',
    shortName: 'Brindes',
    description: 'Kits e itens de marca para empresas, eventos e equipes.',
    icon: 'building',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'gravacao-laser',
    name: 'Gravação a laser',
    shortName: 'Laser',
    description: 'Precisão e acabamento em madeira, acrílico, metal e mais.',
    icon: 'laser',
  },
  {
    id: 'impressao-dtf',
    name: 'Impressão DTF',
    shortName: 'DTF',
    description: 'Estampas vibrantes em tecidos, com alta definição.',
    icon: 'printer',
  },
  {
    id: 'impressao-flatbed',
    name: 'Impressão Flatbed',
    shortName: 'Flatbed',
    description: 'Impressão direta em superfícies rígidas e objetos.',
    icon: 'layers',
  },
];

export function getCategory(id: string | null | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
