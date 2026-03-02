export interface NavbarProps {
  cartItemCount?: number;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
}
