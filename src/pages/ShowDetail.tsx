import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useState, type ReactNode} from 'react';
import {ArrowLeft} from 'lucide-react';
import {LoadingState, Snackbar} from '../components/common';
import {useArticles, useShow, useSymposia} from '../api/hooks';
import {ReservationModal} from '../features/reservations/ReservationModal';
import {compareWithToday, getLongFormattedDate, translateTime} from '../utils/dateUtils';
import {
    ShowHero,
    ShowTabsNavigation,
    ShowInfoTab,
    ShowArticlesTab,
    ShowSymposiaTab,
    ShowCommentsTab,
    type ShowTab,
    type ShowTabKey,
} from './show-detail';

export const ShowDetail = () => {
    const {year, slug} = useParams<{ year: string; slug: string }>();
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [isReservationOpen, setReservationOpen] = useState(false);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ShowTabKey>('info');

    const rawSlug = slug ?? '';
    const showIdParam = rawSlug.startsWith('show-') ? rawSlug.slice(5) : rawSlug;
    const {
        data: show,
        isLoading: isShowLoading,
        isError: isShowError,
    } = useShow(showIdParam, {enabled: Boolean(showIdParam)});
    const articlesQuery = useArticles();
    const symposiaQuery = useSymposia();

    const relatedArticles = (articlesQuery.data ?? []).filter(a => a.showId === show?.id);
    const relatedSymposia = (symposiaQuery.data ?? []).filter(s =>
        show?.id ? s.relatedShowIds?.includes(show.id) : false,
    );
    const isLoading = isShowLoading || articlesQuery.isLoading || symposiaQuery.isLoading;
    const hasError = isShowError || articlesQuery.isError || symposiaQuery.isError;

    if (isLoading) {
        return <LoadingState/>;
    }

    if (hasError) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-white">
                    {t('common.error')}
                </h2>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-white">
                    {t('common.noResults')}
                </h2>
            </div>
        );
    }

    const showDate = show.date ? new Date(show.date) : null;
    const reservationStatuses = ['OPEN_FOR_RESERVATION', 'OPEN_FOR_WAITING_LIST', 'COMPLETE'];
    const isReservationStatus = reservationStatuses.includes(show.isOpenForReservation);
    const isReservationComplete = show.isOpenForReservation === 'COMPLETE';
    const getReservationStatusClass = (status: string) => {
        switch (status) {
            case 'OPEN_FOR_RESERVATION':
                return 'reservation';
            case 'OPEN_FOR_WAITING_LIST':
                return 'primary';
            case 'COMPLETE':
                return 'disabled';
            default:
                return 'secondary';
        }
    };
    const tabs: ShowTab[] = [
        {key: 'info', label: t('show.tabs.info')},
        {key: 'articles', label: t('show.tabs.articles')},
        {key: 'symposia', label: t('show.tabs.symposia')},
        {key: 'comments', label: t('show.tabs.comments')},
    ];
    const reservationComparison = showDate ? compareWithToday(showDate) : 'AFTER';
    const statusTranslationKey =
        reservationComparison === 'AFTER'
            ? 'show.available'
            : reservationComparison === 'BEFORE'
                ? 'show.finished'
                : 'show.today';
    const showStatusLabel = t(statusTranslationKey);
    const formattedDate = showDate ? getLongFormattedDate(i18n.language, showDate) : t('show.notAvailable');
    const formattedTime = show.time ? translateTime(show.time, i18n.language) : t('show.timeTBD');
    const festivalDisplayName = show.festivalName ?? (show.editionYear ? t('show.festivalFallback', {year: show.editionYear}) : undefined);
    const festivalRouteParam = show.festivalSlug ?? show.editionYear ?? (year ? Number(year) : undefined);
    const festivalLinkValue = festivalDisplayName && festivalRouteParam ? (
        <Link
            to={`/festival/${festivalRouteParam}`}
            className="text-secondary-500 underline"
        >
            {festivalDisplayName}
        </Link>
    ) : (
        <span className="text-primary-500">{t('show.unknownFestival')}</span>
    );
    const eventLinkValue = show.bookingUrl && (
        <a
            href={show.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-secondary-500 underline"
        >
            {t('show.openEventLink')}
        </a>
    );
    const venueValue = (
        <span className="inline-flex items-center gap-2 flex-wrap">
      {show.venueName}
            {show.venueLocation && (
                <a
                    href={show.venueLocation}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-500 text-sm underline"
                >
                    {t('show.viewMap')}
                </a>
            )}
    </span>
    );

    const infoItems: {label: string; value: ReactNode}[] = [
        {label: t('show.eventLink'), value: eventLinkValue},
        {label: t('show.festivalName'), value: festivalLinkValue},
        {label: t('show.authorLabel'), value: show.author ?? t('show.notAvailable')},
        {label: t('show.director'), value: show.director ?? t('show.notAvailable')},
        ...(show.cast && show.cast.length > 0
            ? [{label: t('show.cast'), value: show.cast.join(', ')}]
            : []),
        {label: t('show.venue'), value: venueValue},
        {label: t('show.dateLabel'), value: formattedDate},
        {label: t('show.timeLabel'), value: formattedTime},
    ];

    const reservationButtonVariant = getReservationStatusClass(show.isOpenForReservation);
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'articles':
                return (
                    <ShowArticlesTab
                        title={t('show.criticalArticles')}
                        emptyLabel={t('show.noArticles')}
                        authorLabel={t('articles.author')}
                        isRTL={isRTL}
                        articles={relatedArticles}
                        getTypeLabel={type => t(`articles.types.${type}`)}
                    />
                );
            case 'symposia':
                return (
                    <ShowSymposiaTab
                        title={t('show.symposium')}
                        emptyLabel={t('show.noSymposia')}
                        symposia={relatedSymposia}
                        isRTL={isRTL}
                    />
                );
            case 'comments':
                return <ShowCommentsTab message={t('show.commentsComingSoon')}/>;
            case 'info':
            default:
                return <ShowInfoTab title={t('show.synopsis')} description={show.showDescription}/>;
        }
    };

    return (
        <div className="space-y-8">
            <Link
                to={`/festival/${year}`}
                className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
            >
                <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''}/>
                {t('common.backToList')}
            </Link>

            <ShowHero
                show={show}
                infoItems={infoItems}
                showStatusLabel={showStatusLabel}
                isRTL={isRTL}
                isReservationStatus={isReservationStatus}
                isReservationComplete={isReservationComplete}
                reservationButtonVariant={reservationButtonVariant}
                reserveLabel={t('show.reserve')}
                bookTicketLabel={t('show.bookTicket')}
                onReservationClick={() => setReservationOpen(true)}
            />

            <ShowTabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={tab => setActiveTab(tab)}/>

            {renderActiveTab()}

            {isReservationStatus && (
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

        </div>
    );
};
