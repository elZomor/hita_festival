import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLoginButton } from '../../components/auth/GoogleLoginButton';
import { Button, Card } from '../../components/common';
import { ReserveShowResponse, useReserveShow, useShowSeats } from '../../api/hooks';
import { useAuth } from '../../contexts/AuthContext';
import { SeatMapPicker } from './SeatMapPicker';

interface ReservationModalProps {
    showId: string;
    showName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (response: ReserveShowResponse) => void;
}

const knownReservationErrorCodes = [
    'NO_SHOW', 'NO_SEATS', 'DUPLICATE_MAIL', 'UNKNOWN_ERROR',
    'INVALID_SEAT', 'SEAT_TAKEN',
] as const;
type ReservationErrorCode = (typeof knownReservationErrorCodes)[number];
const isKnownReservationErrorCode = (value?: string): value is ReservationErrorCode => {
    if (!value) return false;
    return (knownReservationErrorCodes as readonly string[]).includes(value);
};

type Step = 'seat-selection' | 'confirm';

export const ReservationModal = ({ showId, showName, isOpen, onClose, onSuccess }: ReservationModalProps) => {
    const { t } = useTranslation();
    const { user, isAuthenticated, loginWithGoogleCredential } = useAuth();
    const reserveMutation = useReserveShow();
    const [step, setStep] = useState<Step>('seat-selection');
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

    const seatsQuery = useShowSeats(isOpen ? showId : undefined);
    const takenSeats = seatsQuery.data?.taken ?? [];

    const handleClose = () => {
        reserveMutation.reset();
        setStep('seat-selection');
        setSelectedSeat(null);
        onClose();
    };

    const handleReserve = async () => {
        if (!selectedSeat) return;
        try {
            const response = await reserveMutation.mutateAsync({ showId, seatNumber: selectedSeat });
            handleClose();
            onSuccess?.({
                ...response.data,
                name: response.data.name,
                reservationNumber: response.data.reservationNumber,
            });
        } catch {
            // If SEAT_TAKEN, go back to seat selection and refetch
            const rawMessage = (reserveMutation.error as Error | null)?.message?.toString().toUpperCase();
            if (rawMessage === 'SEAT_TAKEN') {
                setStep('seat-selection');
                setSelectedSeat(null);
                seatsQuery.refetch();
            }
        }
    };

    const getErrorMessage = () => {
        if (!reserveMutation.error) return null;
        const rawMessage = reserveMutation.error.message?.toString().toUpperCase();
        if (isKnownReservationErrorCode(rawMessage)) {
            return t(`reservation.errors.codes.${rawMessage}`);
        }
        return reserveMutation.error.message ?? t('reservation.errors.generic');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-primary-950/80 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <Card className="space-y-6" hover={false}>
                    <div className="space-y-1 text-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-secondary-500">{t('reservation.label')}</p>
                        <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">{showName}</h2>
                    </div>

                    {!isAuthenticated ? (
                        <div className="space-y-4">
                            <p className="text-sm text-center text-primary-600 dark:text-primary-300">
                                {t('auth.signInToReserve')}
                            </p>
                            <div className="flex justify-center">
                                <GoogleLoginButton
                                    onSuccess={async (credential) => {
                                        try { await loginWithGoogleCredential(credential); } catch { /* auth error */ }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" variant="primary" onClick={handleClose}>
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </div>
                    ) : step === 'seat-selection' ? (
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-center text-primary-700 dark:text-primary-200">
                                {t('reservation.selectSeat')}
                            </p>

                            {seatsQuery.isLoading ? (
                                <div className="flex justify-center py-8 text-primary-500">
                                    {t('common.loading')}
                                </div>
                            ) : (
                                <SeatMapPicker
                                    takenSeats={takenSeats}
                                    selectedSeat={selectedSeat}
                                    onSeatSelect={setSelectedSeat}
                                />
                            )}

                            {selectedSeat && (
                                <p className="text-sm text-center font-medium text-amber-600 dark:text-amber-400">
                                    💺 {t('reservation.selectedSeat', { seat: selectedSeat })}
                                </p>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button type="button" variant="primary" className="w-full sm:w-auto" onClick={handleClose}>
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="reservation"
                                    className="w-full sm:w-auto"
                                    onClick={() => setStep('confirm')}
                                    disabled={!selectedSeat}
                                >
                                    {t('reservation.next')} →
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-100 dark:bg-primary-800">
                                {user?.picture ? (
                                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-primary-900 dark:text-primary-50 truncate">{user?.name}</p>
                                    <p className="text-xs text-primary-500 dark:text-primary-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            {selectedSeat && (
                                <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                                    <span className="text-lg">💺</span>
                                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                                        {t('reservation.selectedSeat', { seat: selectedSeat })}
                                    </span>
                                </div>
                            )}

                            <p className="text-sm text-center text-primary-600 dark:text-primary-300">
                                {t('reservation.emailNote')}
                            </p>

                            {reserveMutation.isError && getErrorMessage() && (
                                <p className="text-sm text-accent-600 text-center">{getErrorMessage()}</p>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="w-full sm:w-auto"
                                    onClick={() => { reserveMutation.reset(); setStep('seat-selection'); }}
                                    disabled={reserveMutation.isPending}
                                >
                                    ← {t('reservation.back')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="reservation"
                                    className="w-full sm:w-auto"
                                    onClick={handleReserve}
                                    disabled={reserveMutation.isPending}
                                >
                                    {reserveMutation.isPending ? t('reservation.submitting') : t('reservation.submit')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
