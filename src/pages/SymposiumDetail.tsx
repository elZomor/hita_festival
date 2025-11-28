import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Users, User } from 'lucide-react';
import { Card, SectionHeader, LoadingState } from '../components/common';
import { useShows, useSymposia } from '../api/hooks';

export const SymposiumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const symposiaQuery = useSymposia();
  const showsQuery = useShows();

  const isLoading = symposiaQuery.isLoading || showsQuery.isLoading;
  const hasError = symposiaQuery.isError || showsQuery.isError;

  const symposium = symposiaQuery.data?.find(s => s.id === id);
  const relatedShows =
    symposium?.relatedShowIds && showsQuery.data
      ? showsQuery.data.filter(show => symposium.relatedShowIds?.includes(show.id))
      : [];

  if (isLoading) {
    return <LoadingState />;
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

  if (!symposium) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          {t('common.noResults')}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/symposia"
        className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        {t('common.backToList')}
      </Link>

      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-accent-600 dark:text-secondary-400 leading-tight">
          {isRTL ? symposium.titleAr : symposium.titleEn}
        </h1>

        <div className="flex flex-wrap gap-6 text-primary-700 dark:text-primary-300">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-secondary-500" />
            <span>
              {new Date(symposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-secondary-500" />
            <span>{symposium.hall}</span>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-secondary-500/10 to-accent-600/10 dark:from-secondary-500/5 dark:to-accent-600/5" hover={false}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users size={24} className="text-secondary-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-accent-600 dark:text-secondary-500 mb-2">
                {t('symposia.panelists')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {symposium.panelists.map((panelist, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium"
                  >
                    {panelist}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {symposium.moderator && (
            <div className="flex items-start gap-3 pt-4 border-t border-primary-300 dark:border-primary-700">
              <User size={24} className="text-secondary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-accent-600 dark:text-secondary-500 mb-1">
                  {t('symposia.moderator')}
                </h3>
                <p className="text-primary-800 dark:text-primary-200 font-medium">
                  {symposium.moderator}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-400">
          {t('symposia.summary')}
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-primary-800 dark:text-primary-200 leading-relaxed text-lg">
            {symposium.summaryAr}
          </p>
        </div>
      </div>

      {relatedShows.length > 0 && (
        <div>
          <SectionHeader>{t('symposia.relatedShows')}</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedShows.map(show => (
              <Link key={show.id} to={`/festival/${show.editionYear}/shows/${show.slug}`}>
                <Card>
                  {show.poster && (
                    <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden rounded-t-lg">
                      <img
                        src={show.poster}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">
                      {show.name}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
