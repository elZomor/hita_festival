import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Users, User } from 'lucide-react';
import { Card, SectionHeader } from '../components/common';
import { mockSymposia, mockShows } from '../data/mockData';

export const SymposiumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const symposium = mockSymposia.find(s => s.id === id);
  const relatedShows = symposium?.relatedShowIds
    ? mockShows.filter(s => symposium.relatedShowIds?.includes(s.id))
    : [];

  if (!symposium) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('common.noResults')}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/symposia"
        className="inline-flex items-center gap-2 text-theatre-gold hover:text-theatre-gold-light transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        {t('common.backToList')}
      </Link>

      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-theatre-red dark:text-theatre-gold leading-tight">
          {isRTL ? symposium.titleAr : symposium.titleEn}
        </h1>

        <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-theatre-gold" />
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
            <MapPin size={20} className="text-theatre-gold" />
            <span>{symposium.hall}</span>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-theatre-gold/10 to-theatre-red/10" hover={false}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users size={24} className="text-theatre-gold mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-theatre-red dark:text-theatre-gold mb-2">
                {t('symposia.panelists')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {symposium.panelists.map((panelist, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium"
                  >
                    {panelist}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {symposium.moderator && (
            <div className="flex items-start gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <User size={24} className="text-theatre-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-theatre-red dark:text-theatre-gold mb-1">
                  {t('symposia.moderator')}
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {symposium.moderator}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold">
          {t('symposia.summary')}
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
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
                  {show.posterUrl && (
                    <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden rounded-t-lg">
                      <img
                        src={show.posterUrl}
                        alt={isRTL ? show.titleAr : show.titleEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {isRTL ? show.titleAr : show.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {show.groupName} • {show.country}
                    </p>
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
