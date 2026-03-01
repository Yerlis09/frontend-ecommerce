export interface User {
  name: string;
  avatar?: string;
}

export interface NavbarProps {
  user?: User;
  cartItemCount?: number;
  wishlistCount?: number;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onProfileClick?: () => void;
}