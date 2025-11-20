import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

type LoadingStateProps = {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
};

export const LoadingState = ({ message, subMessage, fullscreen = true }: LoadingStateProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const finalMessage = message ?? t('common.loading');
  const finalSubMessage = subMessage ?? t('common.loadingMessage');
  const containerClasses = useMemo(
    () =>
      [
        'flex flex-col items-center justify-center text-center space-y-6 px-6',
        fullscreen ? 'min-h-[60vh]' : 'py-16',
      ].join(' '),
    [fullscreen],
  );

  return (
    <div className={containerClasses} aria-live="polite" aria-busy>
      <div className="relative">
        <div className="w-28 h-28 rounded-full border-4 border-theatre-gold/30 border-t-theatre-gold animate-spin shadow-inner shadow-black/10 bg-gradient-to-br from-theatre-red/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {theme === 'dark' ? '🌙' : '🎭'}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-theatre-red dark:text-theatre-gold">
          {finalMessage}
        </p>
        {finalSubMessage && (
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {finalSubMessage}
          </p>
        )}
      </div>

      <div className="flex items-end gap-2 text-theatre-gold dark:text-theatre-gold-light">
        <span className="w-3 h-3 rounded-full bg-current animate-bounce" />
        <span className="w-3 h-3 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
        <span className="w-3 h-3 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
      </div>
    </div>
  );
};
