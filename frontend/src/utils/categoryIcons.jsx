import {
  Tag,
  Money,
  Briefcase,
  ForkKnife,
  Car,
  House,
  GameController,
  Bank,
  CreditCard,
  ShoppingCart,
  Heartbeat,
  GraduationCap,
  Airplane,
  Gift,
  PawPrint,
  Wrench,
  PiggyBank,
  Coins,
  Lightning,
  Phone,
} from '@phosphor-icons/react';

export const CATEGORY_ICON_MAP = {
  Tag,
  Money,
  Briefcase,
  ForkKnife,
  Car,
  House,
  GameController,
  Bank,
  CreditCard,
  ShoppingCart,
  Heartbeat,
  GraduationCap,
  Airplane,
  Gift,
  PawPrint,
  Wrench,
  PiggyBank,
  Coins,
  Lightning,
  Phone,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICON_MAP);

export function CategoryIcon({ name, ...props }) {
  const IconComponent = CATEGORY_ICON_MAP[name] || Tag;
  return <IconComponent {...props} />;
}
