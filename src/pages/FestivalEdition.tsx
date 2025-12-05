import {useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Calendar, ArrowLeft} from 'lucide-react';
import {Badge, Card, LoadingState} from '../components/common';
import {ShowCard} from '../features/festival/ShowCard';
import {
    useArticles,
    useCreativityEntries,
    useFestivalEditions,
    useShows,
    useSymposia,
} from '../api/hooks';
import {formatLocalizedNumber, localizeDigitsInString} from '../utils/numberUtils';

type Tab = 'shows' | 'articles' | 'symposia' | 'creativity';

export const FestivalEdition = () => {
    const {year} = useParams<{ year: string }>();
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [activeTab, setActiveTab] = useState<Tab>('shows');

    const editionYear = Number(year);
    const editionsQuery = useFestivalEditions();
    const edition = editionsQuery.data?.find(e => e.year === editionYear);
    const showsQuery = useShows(edition?.slug, {enabled: Boolean(edition?.slug)});
    const articlesQuery = useArticles();
    const symposiaQuery = useSymposia();
    const creativityQuery = useCreativityEntries();

    const isLoading =
        editionsQuery.isLoading ||
        showsQuery.isLoading ||
        articlesQuery.isLoading ||
        symposiaQuery.isLoading ||
        creativityQuery.isLoading;

    const hasError =
        editionsQuery.isError ||
        showsQuery.isError ||
        articlesQuery.isError ||
        symposiaQuery.isError ||
        creativityQuery.isError;

    const shows = (showsQuery.data ?? []).filter(s => s.editionYear === editionYear);
    const articles = (articlesQuery.data ?? []).filter(a => a.editionYear === editionYear);
    const symposia = (symposiaQuery.data ?? []).filter(s => s.editionYear === editionYear);
    const creativity = (creativityQuery.data ?? []).filter(c => c.editionYear === editionYear);

    if (isLoading) {
        return <LoadingState/>;
    }

    if (hasError) {
        return (
            <div className="text-center py-16">
                <p className="text-lg text-primary-600 dark:text-primary-300">{t('common.error')}</p>
            </div>
        );
    }

    if (!edition) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                    {t('common.noResults')}
                </h2>
            </div>
        );
    }

    const tabs: { key: Tab; label: string }[] = [
        {key: 'shows', label: t('festival.shows')},
        {key: 'articles', label: t('festival.articles')},
        {key: 'symposia', label: t('festival.symposia')},
        {key: 'creativity', label: t('festival.creativity')},
    ];

    const localizedTitle = localizeDigitsInString(
        isRTL ? edition.titleAr : edition.titleEn,
        i18n.language
    );
    const localizedDescription = localizeDigitsInString(
        isRTL ? edition.descriptionAr : edition.descriptionEn,
        i18n.language
    );

    return (
        <div className="space-y-8">
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
            >
                <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''}/>
                {t('common.backToList')}
            </Link>

            <div
                className="bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-700 dark:to-accent-800 rounded-2xl p-8 text-primary-50 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar size={32} className="text-secondary-500"/>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        {localizedTitle}
                    </h1>
                </div>

                <p className="text-lg text-primary-100 dark:text-primary-200 mb-4">
                    {localizedDescription}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                    <Badge variant="gold">
                        {new Date(edition.startDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                            month: 'long',
                            day: 'numeric'
                        })} - {new Date(edition.endDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                    </Badge>
                    <Badge variant="default">
                        {formatLocalizedNumber(edition.totalShows, i18n.language)} {t('festival.numberOfShows')}
                    </Badge>
                    <Badge variant="default">
                        {edition.numberOfArticles} {t('festival.numberOfArticles')}
                    </Badge>
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

            {activeTab === 'shows' && (
                <div className="space-y-6">


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shows.map(show => (
                            <ShowCard key={show.id} show={show}/>
                        ))}
                    </div>

                    {shows.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-primary-600 dark:text-primary-400">{t('common.noResults')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'articles' && (
                <div className="space-y-6 w-full md:w-[85%] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map(article => (
                            <Link key={article.id} to={`/articles/${article.slug}`}>
                                <Card>
                                    <div className="space-y-3">
                                        <Badge variant="gold">
                                            {t(`articles.types.${article.type}`)}
                                        </Badge>
                                        <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">
                                            {isRTL ? article.titleAr : article.titleEn}
                                        </h3>
                                        <p className="text-sm text-primary-600 dark:text-primary-400">
                                            {t('articles.author')}: {article.author}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'symposia' && (
                <div className="space-y-6 w-full md:w-[85%] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {symposia.map(symposium => (
                            <Link key={symposium.id} to={`/symposia/${symposium.slug}`}>
                                <Card>
                                    <div className="space-y-3">
                                        <Badge variant="gold">
                                            {t(`symposia.types.${symposium.type}`)}
                                        </Badge>
                                        <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">
                                            {isRTL ? symposium.titleAr : symposium.titleEn}
                                        </h3>
                                        <p className="text-sm text-primary-600 dark:text-primary-400">
                                            {t('symposia.author')}: {symposium.author}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {symposia.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-primary-600 dark:text-primary-400">{t('common.noResults')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'creativity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creativity.map(item => (
                        <Card key={item.id}>
                            <div className="space-y-3">
                                <Badge variant="gold">
                                    {t(`creativity.submitForm.types.${item.type}`)}
                                </Badge>
                                <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-primary-600 dark:text-primary-400">
                                    {t('creativity.by')} {item.author}
                                </p>
                                <p className="text-primary-700 dark:text-primary-300 line-clamp-3">
                                    {item.content}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
