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
  const [mobile, setMobile] = useState('');
  const [touched, setTouched] = useState(false);

  const handleClose = () => {
    setName('');
    setEmail('');
    setMobile('');
    setTouched(false);
    reserveMutation.reset();
    onClose();
  };

  const errors = useMemo(() => {
    if (!touched) return {} as Record<string, string>;
    const validation: Record<string, string> = {};
    if (!name.trim()) {
      validation.fullName = t('reservation.errors.fullName');
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validation.email = t('reservation.errors.email');
    }
    if (!mobile.trim()) {
      validation.mobile = t('reservation.errors.mobile');
    }
    return validation;
  }, [email, name, mobile, touched, t]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (Object.keys(errors).length > 0) return;

    try {
      await reserveMutation.mutateAsync({
        showId,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });
      handleClose();
      onSuccess?.();
    } catch {
      // handled via mutation error state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-primary-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg">
        <Card className="p-6 space-y-6" hover={false}>
          <div className="space-y-1 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary-500">{t('reservation.label')}</p>
            <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">{showName}</h2>
            <p className="text-sm text-primary-600 dark:text-primary-300">{t('reservation.subtitle')}</p>
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
              {errors.fullName && <p className="mt-1 text-sm text-accent-600">{errors.fullName}</p>}
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
              {errors.email && <p className="mt-1 text-sm text-accent-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
                {t('reservation.fields.mobile')}
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-900 px-4 py-3 text-primary-900 dark:text-white focus:ring-2 focus:ring-secondary-500"
                value={mobile}
                onChange={event => setMobile(event.target.value)}
              />
              {errors.mobile && <p className="mt-1 text-sm text-accent-600">{errors.mobile}</p>}
            </div>

            {reserveMutation.isError && (
              <p className="text-sm text-accent-600">
                {reserveMutation.error?.message ?? t('reservation.errors.generic')}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={handleClose} disabled={reserveMutation.isPending}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={reserveMutation.isPending}>
                {reserveMutation.isPending ? t('reservation.submitting') : t('reservation.submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
