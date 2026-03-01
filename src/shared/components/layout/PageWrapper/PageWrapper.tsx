import React from 'react';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => (
  <main
    className={['flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className ?? ''].join(' ')}
  >
    {children}
  </main>
);
