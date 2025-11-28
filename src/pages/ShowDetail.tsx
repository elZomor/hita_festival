import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useState, type ReactNode} from 'react';
import {ArrowLeft, ExternalLink} from 'lucide-react';
import {Button, Card, Badge, SectionHeader, LoadingState, Snackbar} from '../components/common';
import {useArticles, useShow, useSymposia} from '../api/hooks';
import {ReservationModal} from '../features/reservations/ReservationModal';
import {compareWithToday, getLongFormattedDate, translateTime} from '../utils/dateUtils';

type Tab = 'info' | 'articles' | 'symposia' | 'comments';

export const ShowDetail = () => {
    const {year, slug} = useParams<{ year: string; slug: string }>();
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [isReservationOpen, setReservationOpen] = useState(false);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('info');

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
    const tabs: { key: Tab; label: string }[] = [
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
    )
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

    return (
        <div className="space-y-8">
            <Link
                to={`/festival/${year}`}
                className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
            >
                <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''}/>
                {t('common.backToList')}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    {show.poster && (
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={show.poster}
                                alt={show.name}
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold text-accent-600 dark:text-secondary-500 mb-2">
                            {show.name}
                        </h1>
                        <h3
                            className={`text-xl font-bold mb-6 text-accent-500 flex items-center gap-2`}
                        >
                            {showStatusLabel}
                        </h3>
                    </div>

                    <div className="space-y-3 text-lg text-white">
                        {infoItems.map(item => (
                            item.value && (
                                <div key={item.label} className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center">
                                    <span className="font-semibold text-primary-400 sm:col-span-2">{item.label}:</span>
                                    <span
                                        className="inline-flex flex-wrap items-center gap-2 text-white sm:col-span-7">{item.value}</span>
                                </div>)
                        ))}
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
                                    {t('show.bookTicket')}
                                    <ExternalLink
                                        className={`${isRTL ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`}
                                        size={20}/>
                                </Button>
                            </a>
                        )}

                        {isReservationStatus && (
                            <Button
                                type="button"
                                variant={getReservationStatusClass(show.isOpenForReservation)}
                                className="w-[70%]"
                                onClick={() => setReservationOpen(true)}
                                disabled={isReservationComplete}
                            >
                                {t('show.reserve')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-b border-primary-300 dark:border-primary-700">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                px-6 py-3 font-medium transition-all duration-300
                border-b-2 whitespace-nowrap
                ${activeTab === tab.key
                                ? 'border-secondary-500 text-accent-600 dark:text-secondary-500'
                                : 'border-transparent text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-secondary-500'
                            }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'info' && (
                <Card className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-800 dark:to-primary-900"
                      hover={false}>
                    <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-4">
                        {t('show.synopsis')}
                    </h2>
                    <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
                        {show.showDescription}
                    </p>
                </Card>
            )}

            {activeTab === 'articles' && (
                <div className="space-y-6">
                    <SectionHeader>{t('show.criticalArticles')}</SectionHeader>
                    {relatedArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedArticles.map(article => (
                                <Link key={article.id} to={`/articles/${article.slug}`}>
                                    <Card>
                                        <div className="space-y-3">
                                            <Badge variant="gold">
                                                {t(`articles.types.${article.type}`)}
                                            </Badge>
                                            <h3 className="text-xl font-bold text-primary-900 dark:text-white">
                                                {isRTL ? article.titleAr : article.titleEn}
                                            </h3>
                                            <p className="text-sm text-primary-600 dark:text-primary-400">
                                                {t('articles.author')}: {article.author}
                                            </p>
                                            <p className="text-primary-700 dark:text-primary-300 line-clamp-2">
                                                {isRTL ? article.contentAr.substring(0, 120) : article.contentEn?.substring(0, 120)}...
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-primary-600 dark:text-primary-400">{t('show.noArticles')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'symposia' && (
                <div className="space-y-6">
                    <SectionHeader>{t('show.symposium')}</SectionHeader>
                    {relatedSymposia.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {relatedSymposia.map(symposium => (
                                <Link key={symposium.id} to={`/symposia/${symposium.id}`}>
                                    <Card>
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">
                                                {isRTL ? symposium.titleAr : symposium.titleEn}
                                            </h3>
                                            <div
                                                className="flex flex-wrap gap-2 text-sm text-primary-600 dark:text-primary-400">
                                                <span>{new Date(symposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                                                <span>•</span>
                                                <span>{symposium.hall}</span>
                                            </div>
                                            <p className="text-primary-700 dark:text-primary-300">
                                                {symposium.summaryAr.substring(0, 200)}...
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-primary-600 dark:text-primary-400">{t('show.noSymposia')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'comments' && (
                <Card>
                    <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                        {t('show.commentsComingSoon')}
                    </p>
                </Card>
            )}

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
