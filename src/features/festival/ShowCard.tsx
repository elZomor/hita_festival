import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Globe } from 'lucide-react';
import { Card, Badge } from '../../components/common';
import { Show } from '../../types';

interface ShowCardProps {
  show: Show;
}

export const ShowCard = ({ show }: ShowCardProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const showDate = new Date(show.dateTime);
  const isToday = showDate.toDateString() === new Date().toDateString();

  return (
    <Link to={`/festival/${show.editionYear}/shows/${show.slug}`}>
      <Card className="h-full flex flex-col">
        {show.posterUrl && (
          <div className="relative -mx-6 -mt-6 mb-4 h-48 overflow-hidden rounded-t-lg">
            <img
              src={show.posterUrl}
              alt={isRTL ? show.titleAr : show.titleEn}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
            {isToday && (
              <div className="absolute top-3 right-3">
                <Badge variant="red">{t('festival.todayShow')}</Badge>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isRTL ? show.titleAr : show.titleEn}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {show.groupName}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Globe size={16} className="text-theatre-gold" />
              <span>{show.country}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-theatre-gold" />
              <span>
                {showDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin size={16} className="text-theatre-gold" />
              <span>{show.venue}</span>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed mt-auto">
            {isRTL ? show.synopsisAr : show.synopsisEn}
          </p>
        </div>
      </Card>
    </Link>
  );
};
