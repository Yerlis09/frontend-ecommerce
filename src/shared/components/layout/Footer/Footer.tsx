import React from 'react';
import  type { FooterProps, TrustBadge } from './Footer.types';
import { cn } from '../../../utils/cn';
import styles from './Footer.module.css';

const defaultBadges: TrustBadge[] = [
  {
    icon: 'verified_user',
    title: 'Pago Seguro',
    description: 'Procesado por Wompi',
    color: 'primary',
  },
  {
    icon: 'local_shipping',
    title: 'Envío Gratis',
    description: 'En pedidos superiores a $100.000',
    color: 'secondary',
  },
  {
    icon: 'autorenew',
    title: 'Devoluciones Fáciles',
    description: '30 días de garantía',
    color: 'accent',
  },
];

export const Footer: React.FC<FooterProps> = ({
  badges = defaultBadges,
  year = new Date().getFullYear(),
}) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.badgesGrid}>
          {badges.map((badge, index) => (
            <div key={index} className={styles.badge}>
              <div className={cn(styles.badgeIcon, styles[badge.color])}>
                <span className="material-symbols-outlined text-3xl">
                  {badge.icon}
                </span>
              </div>
              <div className={styles.badgeContent}>
                <h4 className={styles.badgeTitle}>{badge.title}</h4>
                <p className={styles.badgeDescription}>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.copyright}>
          <p>© {year} ShopWave. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};