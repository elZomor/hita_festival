import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, SectionHeader } from '../components/common';
import { useSymposia } from '../api/hooks';
import type { Symposium } from '../types';

export const Symposia = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    data: symposia = [],
    isLoading,
    isError,
  } = useSymposia();

  const symposiaByYear = symposia.reduce<Record<number, Symposium[]>>((acc, symposium) => {
    if (!acc[symposium.editionYear]) {
      acc[symposium.editionYear] = [];
    }
    acc[symposium.editionYear].push(symposium);
    return acc;
  }, {});

  const years = Object.keys(symposiaByYear).sort((a, b) => Number(b) - Number(a));

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.error')}</p>
      </div>
    );
  }

  if (!symposia.length) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader>{t('symposia.title')}</SectionHeader>

      {years.map(year => (
        <div key={year} className="space-y-4">
          <h2 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold">
            {year}
          </h2>

          <div className="space-y-6">
            {symposiaByYear[Number(year)].map(symposium => (
              <Link key={symposium.id} to={`/symposia/${symposium.id}`}>
                <Card>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isRTL ? symposium.titleAr : symposium.titleEn}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-theatre-gold" />
                        <span>
                          {new Date(symposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-theatre-gold" />
                        <span>{symposium.hall}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users size={18} className="text-theatre-gold mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('symposia.panelists')}:
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {symposium.panelists.join(' • ')}
                        </p>
                      </div>
                    </div>

                    {symposium.moderator && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('symposia.moderator')}: <span className="font-medium">{symposium.moderator}</span>
                      </p>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {symposium.summaryAr}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
