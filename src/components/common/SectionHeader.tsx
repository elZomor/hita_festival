import { ReactNode } from 'react';

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export const SectionHeader = ({ children, className = '' }: SectionHeaderProps) => {
  return (
    <h2
      className={`
        text-3xl md:text-4xl font-bold
        text-theatre-red dark:text-theatre-gold
        mb-8
        ${className}
      `}
    >
      {children}
    </h2>
  );
};
