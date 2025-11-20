import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-theatre-red hover:bg-theatre-red-light text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-theatre-gold hover:bg-theatre-gold-light text-theatre-black shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent border-2 border-theatre-gold text-theatre-gold hover:bg-theatre-gold hover:text-theatre-black',
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
