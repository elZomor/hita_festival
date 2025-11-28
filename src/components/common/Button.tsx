import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'reservation' | 'disabled';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-accent-600 hover:bg-accent-500 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-500 hover:bg-secondary-400 text-primary-950 shadow-lg hover:shadow-xl',
    reservation: 'bg-green-600 hover:bg-green-600 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-primary-950',
    disabled: 'bg-gray-400 text-white cursor-not-allowed opacity-50 disable-shadow enabled:shadow-none',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
