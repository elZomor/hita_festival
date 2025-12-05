import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useState, type ReactNode} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import {LoadingState} from '../components/common';
import {useArticles, useShow, useSymposia, type ReserveShowResponse} from '../api/hooks';
import {ReservationModal} from '../features/reservations/ReservationModal';
import {ReservationSuccessModal} from '../features/reservations/ReservationSuccessModal';
import {compareWithToday, getLongFormattedDate, translateTime} from '../utils/dateUtils';
import {
    ShowHero,
    ShowTabsNavigation,
    ShowInfoTab,
    ShowArticlesTab,
    ShowCommentsTab,
    type ShowTab,
    type ShowTabKey,
    type ShowDetailSection,
} from './show-detail';

export const ShowDetail = () => {
    const {year, slug} = useParams<{ year: string; slug: string }>();
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [isReservationOpen, setReservationOpen] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState<ReserveShowResponse | null>(null);
    const [activeTab, setActiveTab] = useState<ShowTabKey>('info');
    const queryClient = useQueryClient();

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
    const relatedSymposia = (symposiaQuery.data ?? []).filter(symposium => symposium.showId === show?.id);
    const isLoading = isShowLoading || articlesQuery.isLoading || symposiaQuery.isLoading;
    const hasError = isShowError || articlesQuery.isError || symposiaQuery.isError;

    if (isLoading) {
        return <LoadingState/>;
    }

    if (hasError) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                    {t('common.error')}
                </h2>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
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
                return 'waiting';
            case 'COMPLETE':
                return 'complete';
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
    const showStatusClassName = (() => {
        if (!show.date) return 'text-accent-500';
        const comparison = compareWithToday(new Date(show.date));
        switch (comparison) {
            case 'AFTER':
                return 'text-secondary-600 dark:text-secondary-400';
            case 'EQUALS':
                return 'text-theatre-gold-500 dark:text-theatre-gold-400';
            case 'BEFORE':
            default:
                return 'text-accent-600 dark:text-accent-400';
        }
    })();
    const festivalDisplayName = show.festivalName ?? (show.editionYear ? t('show.festivalFallback', {year: show.editionYear}) : undefined);
    const festivalRouteParam = show.festivalSlug ?? show.editionYear ?? (year ? Number(year) : undefined);
    const festivalLinkValue = festivalDisplayName && festivalRouteParam ? (
        <Link
            to={`/festival/${festivalRouteParam}`}
            className="text-secondary-600 dark:text-secondary-400 underline"
        >
            {festivalDisplayName}
        </Link>
    ) : (
        <span className="text-primary-600 dark:text-primary-300">{t('show.unknownFestival')}</span>
    );
    const eventLinkValue = show.bookingUrl && (
        <a
            href={show.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-secondary-600 dark:text-secondary-400 underline"
        >
            {t('show.openEventLink')}
        </a>
    );
    const venueValue = (
        <span className="inline-flex items-center gap-2 flex-wrap text-primary-800 dark:text-primary-100">
      {show.venueName}
            {show.venueLocation && (
                <a
                    href={show.venueLocation}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-600 dark:text-secondary-400 text-sm underline"
                >
                    {t('show.viewMap')}
                </a>
            )}
    </span>
    );

    const infoItems: { label: string; value: ReactNode }[] = [
        {label: t('show.eventLink'), value: eventLinkValue},
        {label: t('show.festivalName'), value: festivalLinkValue},
        {label: t('show.authorLabel'), value: show.author ?? t('show.notAvailable')},
        {label: t('show.director'), value: show.director ?? t('show.notAvailable')},
        {label: t('show.venue'), value: venueValue},
        {label: t('show.dateLabel'), value: formattedDate},
        {label: t('show.timeLabel'), value: formattedTime},
    ];

    type DetailSectionSource = ShowDetailSection['items'] | string | string[] | undefined;
    const buildDetailSection = (title: string, source?: DetailSectionSource): ShowDetailSection | undefined => {
        if (!source) {
            return undefined;
        }

        if (Array.isArray(source)) {
            if (source.length === 0) {
                return undefined;
            }

            if (isShowDetailEntryArray(source)) {
                return {title, items: source};
            }

            const normalized = source
                .map(value => (typeof value === 'string' ? value.trim() : ''))
                .filter(Boolean);

            if (normalized.length === 0) {
                return undefined;
            }

            return {
                title,
                items: normalized.map(text => ({text})),
            };
        }

        if (typeof source === 'string') {
            const trimmed = source.trim();
            if (!trimmed) {
                return undefined;
            }

            return {
                title,
                items: [{text: trimmed}],
            };
        }

        return {
            title,
            items: source,
        };
    };

    const isShowDetailEntryArray = (items: unknown[]): items is ShowDetailSection['items'] =>
        items.every(item => typeof item === 'object' && item !== null && 'text' in item);

    const descriptionSection = buildDetailSection(t('show.sections.synopsis'), show.showDescription);
    const actorsSection = buildDetailSection(t('show.sections.actors'), show.cast);
    const crewSection = buildDetailSection(t('show.sections.crew'), show.crew);
    const additionalSection = buildDetailSection(t('show.sections.additional'), show.notes);

    const reservationButtonVariant = getReservationStatusClass(show.isOpenForReservation);
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'articles':
                return (
                    <ShowArticlesTab
                        title={t('show.criticalArticles')}
                        emptyLabel={t('show.noArticles')}
                        authorLabel={t('articles.author')}
                        readMoreLabel={t('articles.readMore')}
                        isRTL={isRTL}
                        articles={relatedArticles}
                        getTypeLabel={type => t(`articles.types.${type}`)}
                        detailPath="articles"
                    />
                );
            case 'symposia':
                return (
                    <ShowArticlesTab
                        title={t('show.symposium')}
                        emptyLabel={t('show.noSymposia')}
                        authorLabel={t('symposia.author')}
                        readMoreLabel={t('symposia.readMore')}
                        isRTL={isRTL}
                        articles={relatedSymposia}
                        getTypeLabel={type => t(`symposia.types.${type}`)}
                        detailPath="symposia"
                    />
                );
            case 'comments':
                return <ShowCommentsTab showId={show.id}/>;
            case 'info':
            default:
                return (
                    <ShowInfoTab
                        descriptionSection={descriptionSection}
                        actorsSection={actorsSection}
                        crewSection={crewSection}
                        additionalSection={additionalSection}
                    />
                );
        }
    };

    const handleSuccessModalClose = () => {
        setReservationSuccess(null);
        queryClient.invalidateQueries({queryKey: ['show']});
        queryClient.invalidateQueries({queryKey: ['shows']});
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
                showStatusClassName={showStatusClassName}
                isRTL={isRTL}
                isReservationStatus={isReservationStatus}
                isReservationComplete={isReservationComplete}
                reservationButtonVariant={reservationButtonVariant}
                reserveLabel={t('show.reserve')}
                waitingListLabel={t('show.reserve_waiting_list')}
                completeLabel={t('show.complete')}
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
                    onSuccess={response => setReservationSuccess(response)}
                />
            )}
            <ReservationSuccessModal
                isOpen={Boolean(reservationSuccess)}
                reservation={reservationSuccess}
                onClose={handleSuccessModalClose}
            />

        </div>
    );
};
