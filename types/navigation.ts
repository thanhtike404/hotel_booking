export interface Route {
  label: string;
  icon: React.ElementType;
  href: string;
}

export interface NavbarProps {
  onMenuClick: () => void;
}