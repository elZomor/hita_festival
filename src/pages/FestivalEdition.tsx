import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Badge, Card, LoadingState } from '../components/common';
import { ShowCard } from '../features/festival/ShowCard';
import {
  useArticles,
  useCreativityEntries,
  useFestivalEditions,
  useShows,
  useSymposia,
} from '../api/hooks';

type Tab = 'shows' | 'articles' | 'symposia' | 'creativity';

export const FestivalEdition = () => {
  const { year } = useParams<{ year: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState<Tab>('shows');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const editionYear = Number(year);
  const editionsQuery = useFestivalEditions();
  const edition = editionsQuery.data?.find(e => e.year === editionYear);
  const showsQuery = useShows(edition?.slug, { enabled: Boolean(edition?.slug) });
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
    return <LoadingState />;
  }

  if (hasError) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.error')}</p>
      </div>
    );
  }

  if (!edition) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('common.noResults')}
        </h2>
      </div>
    );
  }

  const uniqueDates = ['all', ...new Set(shows.map(s => new Date(s.dateTime).toLocaleDateString()))];
  const uniqueVenues = ['all', ...new Set(shows.map(s => s.venue))];
  const uniqueCountries = ['all', ...new Set(shows.map(s => s.country))];

  const filteredShows = shows.filter(show => {
    const showDate = new Date(show.dateTime).toLocaleDateString();
    if (dateFilter !== 'all' && showDate !== dateFilter) return false;
    if (venueFilter !== 'all' && show.venue !== venueFilter) return false;
    if (countryFilter !== 'all' && show.country !== countryFilter) return false;
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'shows', label: t('festival.shows') },
    { key: 'articles', label: t('festival.articles') },
    { key: 'symposia', label: t('festival.symposia') },
    { key: 'creativity', label: t('festival.creativity') },
  ];

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-theatre-gold hover:text-theatre-gold-light transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        {t('common.backToList')}
      </Link>

      <div className="bg-gradient-to-r from-theatre-red to-theatre-red-dark rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={32} className="text-theatre-gold" />
          <h1 className="text-3xl md:text-4xl font-bold">
            {isRTL ? edition.titleAr : edition.titleEn}
          </h1>
        </div>

        <p className="text-lg text-gray-200 mb-4">
          {isRTL ? edition.descriptionAr : edition.descriptionEn}
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
            {edition.numberOfShows} {t('festival.numberOfShows')}
          </Badge>
          <Badge variant="default">
            {edition.numberOfArticles} {t('festival.numberOfArticles')}
          </Badge>
        </div>
      </div>

      <div className="border-b border-gray-300 dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-6 py-3 font-medium transition-all duration-300
                border-b-2 whitespace-nowrap
                ${activeTab === tab.key
                  ? 'border-theatre-gold text-theatre-red dark:text-theatre-gold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-theatre-red dark:hover:text-theatre-gold'
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
          <div className="flex flex-wrap gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{t('festival.allDates')}</option>
              {uniqueDates.slice(1).map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>

            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{t('festival.allVenues')}</option>
              {uniqueVenues.slice(1).map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{t('festival.allCountries')}</option>
              {uniqueCountries.slice(1).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>

          {filteredShows.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400">{t('common.noResults')}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(article => (
            <Link key={article.id} to={`/articles/${article.slug}`}>
              <Card>
                <div className="space-y-3">
                  <Badge variant="gold">
                    {t(`articles.types.${article.type}`)}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? article.titleAr : article.titleEn}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('articles.author')}: {article.author}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'symposia' && (
        <div className="space-y-6">
          {symposia.map(symposium => (
            <Link key={symposium.id} to={`/symposia/${symposium.id}`}>
              <Card>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold">
                    {isRTL ? symposium.titleAr : symposium.titleEn}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{new Date(symposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                    <span>•</span>
                    <span>{symposium.hall}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {symposium.summaryAr}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('creativity.by')} {item.author}
                </p>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
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
