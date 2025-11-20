import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'red' | 'success';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    gold: 'bg-theatre-gold text-theatre-black',
    red: 'bg-theatre-red text-white',
    success: 'bg-green-500 text-white',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
