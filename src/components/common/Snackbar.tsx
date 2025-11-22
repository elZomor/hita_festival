import { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'success' | 'error';
}

export const Snackbar = ({ message, isOpen, onClose, variant = 'success' }: SnackbarProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles: Record<typeof variant, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-accent-600 text-white',
  };

  return (
    <div className="fixed inset-x-0 bottom-4 flex justify-center z-50 px-4">
      <div className={`w-full max-w-md rounded-full px-6 py-3 shadow-2xl ${variantStyles[variant]}`}>
        <p className="text-center text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};
