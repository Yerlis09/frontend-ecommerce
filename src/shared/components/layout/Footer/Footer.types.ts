export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

export interface FooterProps {
  badges?: TrustBadge[];
  year?: number;
}