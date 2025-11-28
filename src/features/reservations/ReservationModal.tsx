import { FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../../components/common';
import { useReserveShow } from '../../api/hooks';

interface ReservationModalProps {
  showId: string;
  showName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReservationModal = ({ showId, showName, isOpen, onClose, onSuccess }: ReservationModalProps) => {
  const { t } = useTranslation();
  const reserveMutation = useReserveShow();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const handleClose = () => {
    setName('');
    setEmail('');
    setTouched(false);
    reserveMutation.reset();
    onClose();
  };

  const validation = useMemo(() => {
    const validation: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      validation.fullName = t('reservation.errors.fullNameRequired');
    } else if (trimmedName.length > 100) {
      validation.fullName = t('reservation.errors.fullNameMaxLength');
    } else if (!/^[\u0600-\u06FF\s]+$/.test(trimmedName)) {
      validation.fullName = t('reservation.errors.fullNameArabic');
    }

    if (!trimmedEmail) {
      validation.email = t('reservation.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      validation.email = t('reservation.errors.email');
    }

    return validation;
  }, [email, name, t]);

  const errors = touched ? validation : {};
  const hasErrors = Object.keys(validation).length > 0;

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (hasErrors) return;

    try {
      await reserveMutation.mutateAsync({
        showId,
        name: name.trim(),
        email: email.trim(),
      });
      handleClose();
      onSuccess?.();
    } catch {
      // handled via mutation error state
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-primary-950/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="space-y-6" hover={false}>
          <div className="space-y-1 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary-500">{t('reservation.label')}</p>
            <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">{showName}</h2>
            <p className="text-sm text-primary-600 dark:text-primary-300">{t('reservation.subtitle')}</p>
            <p className="text-xs text-primary-500 dark:text-primary-400">{t('reservation.emailNote')}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
                {t('reservation.fields.fullName')}
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-900 px-4 py-3 text-primary-900 dark:text-white focus:ring-2 focus:ring-secondary-500"
                value={name}
                onChange={event => setName(event.target.value)}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
                {t('reservation.fields.email')}
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-900 px-4 py-3 text-primary-900 dark:text-white focus:ring-2 focus:ring-secondary-500"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            {reserveMutation.isError && (
              <p className="text-sm text-accent-600">
                {reserveMutation.error?.message ?? t('reservation.errors.generic')}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="primary"
                className="w-full sm:w-auto"
                onClick={handleClose}
                disabled={reserveMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant={touched && hasErrors ? 'disabled' : 'reservation'}
                className={`w-full sm:w-auto ${touched && hasErrors ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={reserveMutation.isPending || (touched && hasErrors)}
              >
                {reserveMutation.isPending ? t('reservation.submitting') : t('reservation.submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
