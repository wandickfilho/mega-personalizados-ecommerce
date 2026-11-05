import {
  Briefcase,
  Building2,
  Coffee,
  Gift,
  GraduationCap,
  KeyRound,
  Layers,
  Printer,
  Smartphone,
  Tablet,
  Zap,
} from 'lucide-react';
import type { CategoryIconKey } from '@/config/categories';

const ICONS: Record<CategoryIconKey, typeof Smartphone> = {
  smartphone: Smartphone,
  tablet: Tablet,
  coffee: Coffee,
  key: KeyRound,
  cap: GraduationCap,
  briefcase: Briefcase,
  gift: Gift,
  building: Building2,
  printer: Printer,
  laser: Zap,
  layers: Layers,
};

interface CategoryIconProps {
  icon: CategoryIconKey;
  className?: string;
}

export default function CategoryIcon({ icon, className }: CategoryIconProps) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden />;
}
