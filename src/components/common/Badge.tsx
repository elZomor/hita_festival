import {ReactNode} from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'gold' | 'red' | 'green' | 'default';
    className?: string;
}

export const Badge = ({children, variant = 'default', className = ''}: BadgeProps) => {
    const variants = {
        default: 'bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-200',
        gold: 'bg-secondary-500 text-primary-950',
        red: 'bg-accent-600 text-white',
        green: 'bg-green-500 text-white',
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
