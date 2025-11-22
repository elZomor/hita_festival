import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Calendar, Clock, MapPin, UserCog} from 'lucide-react';
import {Badge, Button, Card, Snackbar} from '../../components/common';
import {Show} from '../../types';
import {compareWithToday, getLongFormattedDate, translateTime} from "../../utils/dateUtils.ts";
import {Link} from "react-router-dom";
import {ReservationModal} from "../reservations/ReservationModal";

interface ShowCardProps {
    show: Show;
}

export const ShowCard = ({show}: ShowCardProps) => {
    const {t, i18n} = useTranslation();
    const [isReservationOpen, setReservationOpen] = useState(false);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);

    const isOpenForReservation = !['OPEN_FOR_RESERVATION', 'OPEN_FOR_WAITING_LIST', 'COMPLETE'].includes(show.isOpenForReservation)
    const getShowStatusName = (showDate: string) => {
        const comparisonResult = compareWithToday(new Date(showDate))
        switch (comparisonResult) {
            case "AFTER":
                return t('show.available')
            case "BEFORE":
                return t('show.finished')
            case "EQUALS":
                return t('show.today')
        }

    }
    const getShowStatusClass = (showDate: string): 'gold' | 'red' | 'green' => {
        const comparisonResult = compareWithToday(new Date(showDate))
        switch (comparisonResult) {
            case "AFTER":
                return 'green'
            case "BEFORE":
                return 'red'
            case "EQUALS":
                return 'gold'
        }
    }

    return (
        <>
        <Card className="h-full flex flex-col relative">
            <div className="absolute top-3 right-3">
                <Badge variant={getShowStatusClass(show.date)}>
                    {t(getShowStatusName(show.date))}
                </Badge>
            </div>

            <div className="relative">
                <img
                    src={
                        show.poster
                            ? show.poster
                            : 'https://img.freepik.com/free-photo/theater-stage-spotlight_23-2151949833.jpg?t=st=1746836255~exp=1746839855~hmac=ce8c2cd8984e50f332ee8e1512509d6d2b0382cfd0d43dbb44a8a434339d14ce&w=900'
                    }
                    alt={show.name}
                    className="w-full h-80 object-contain"
                />
            </div>

            {/* make this a flex column that can stretch */}
            <div className="space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-primary-900 dark:text-white">
                    {show.name}
                </h3>

                {/* info block grows, pushes buttons down when needed */}
                <div className="space-y-2 text-sm flex-1">
                    <div className="flex items-center text-primary-300 mb-2">
                        <UserCog size={16} className="text-secondary-500 mx-2" />
                        <span className="text-sm">
          {t('show.for_director')}: {show.director}
        </span>
                    </div>
                    <div className="flex items-center text-primary-300 mb-2">
                        <MapPin size={16} className="text-secondary-500 mx-2" />
                        <span className="text-sm">{show.venueName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                        <Calendar size={16} className="text-secondary-500 mx-2" />
                        <span className="text-sm">
          {getLongFormattedDate(i18n.language, new Date(show.date))}
        </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                        <Clock size={16} className="text-secondary-500 mx-2" />
                        <span className="text-sm">
          {translateTime(show.time, i18n.language)}
        </span>
                    </div>
                </div>

                {/* buttons */}
                <div
                    className={`px-4 mb-5 flex flex-col ${
                        isOpenForReservation
                            ? 'mt-auto'                // two buttons, keep them at the bottom
                            : 'flex-1 justify-center'  // single button, center in remaining space
                    }`}
                >
                    <Link to={`/festival/${show.editionYear}/shows/${show.slug}`}>
                        <Button variant="secondary" className="w-full">
                            {t('show.viewDetails')}
                        </Button>
                    </Link>

                    {isOpenForReservation && (
                        <Button
                            variant="reservation"
                            className="w-full mt-5"
                            onClick={() => setReservationOpen(true)}
                        >
                            {t('show.reserve')}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
            {isOpenForReservation && (
                <ReservationModal
                    showId={show.id}
                    showName={show.name}
                    isOpen={isReservationOpen}
                    onClose={() => setReservationOpen(false)}
                    onSuccess={() => setSnackbarOpen(true)}
                />
            )}
            <Snackbar
                message={t('reservation.success')}
                isOpen={isSnackbarOpen}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};
