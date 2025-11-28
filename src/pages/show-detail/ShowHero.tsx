import {ReactNode} from 'react';
import {ExternalLink} from 'lucide-react';
import {Button} from '../../components/common';
import type {Show} from '../../types';

type InfoItem = {
    label: string;
    value: ReactNode;
};

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'reservation' | 'disabled';

type ShowHeroProps = {
    show: Show;
    infoItems: InfoItem[];
    showStatusLabel: string;
    isRTL: boolean;
    isReservationStatus: boolean;
    isReservationComplete: boolean;
    reservationButtonVariant: ButtonVariant;
    reserveLabel: string;
    bookTicketLabel: string;
    onReservationClick: () => void;
};

export const ShowHero = ({
    show,
    infoItems,
    showStatusLabel,
    isRTL,
    isReservationStatus,
    isReservationComplete,
    reservationButtonVariant,
    reserveLabel,
    bookTicketLabel,
    onReservationClick,
}: ShowHeroProps) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            {show.poster && (
                <img
                    src={show.poster}
                    alt={show.name}
                    className="w-full h-auto max-h-[500px] object-contain"
                />
            )}
        </div>

        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-accent-600 dark:text-secondary-500 mb-2">
                    {show.name}
                </h1>
                { show.castWord && (<h3 className="mb-2 text-primary-500 flex items-center gap-2 italic">
                    "{show.castWord}"
                </h3>)}
                <h3 className="text-xl font-bold mb-6 text-accent-500 flex items-center gap-2">
                    {showStatusLabel}
                </h3>
            </div>

            <div className="space-y-3 text-lg text-white">
                {infoItems.map(
                    item =>
                        item.value && (
                            <div key={item.label} className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center">
                                <span className="font-semibold text-primary-400 sm:col-span-2">{item.label}:</span>
                                <span className="inline-flex flex-wrap items-center gap-2 text-white sm:col-span-7">
                                    {item.value}
                                </span>
                            </div>
                        ),
                )}
            </div>

            <div className="space-y-3 flex flex-col items-center">
                {show.bookingUrl && (
                    <a
                        href={show.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                    >
                        <Button variant="primary" className="w-full group">
                            {bookTicketLabel}
                            <ExternalLink
                                className={`${isRTL ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`}
                                size={20}
                            />
                        </Button>
                    </a>
                )}

                {isReservationStatus && (
                    <Button
                        type="button"
                        variant={reservationButtonVariant}
                        className="w-[70%]"
                        onClick={onReservationClick}
                        disabled={isReservationComplete}
                    >
                        {reserveLabel}
                    </Button>
                )}
            </div>
        </div>
    </div>
);
