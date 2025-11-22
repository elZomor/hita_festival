import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, User, Users, ExternalLink } from 'lucide-react';
import { Button, Card, Badge, SectionHeader, LoadingState } from '../components/common';
import { useArticles, useFestivalEditions, useShows, useSymposia } from '../api/hooks';

export const ShowDetail = () => {
  const { year, slug } = useParams<{ year: string; slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const editionYear = Number(year);
  const editionsQuery = useFestivalEditions();
  const edition = editionsQuery.data?.find(e => e.year === editionYear);
  const showsQuery = useShows(edition?.slug, { enabled: Boolean(edition?.slug) });
  const articlesQuery = useArticles();
  const symposiaQuery = useSymposia();

  const isLoading =
    editionsQuery.isLoading || showsQuery.isLoading || articlesQuery.isLoading || symposiaQuery.isLoading;
  const hasError =
    editionsQuery.isError || showsQuery.isError || articlesQuery.isError || symposiaQuery.isError;

  const show = showsQuery.data?.find(
    s => s.slug === slug && s.editionYear === editionYear,
  );
  const relatedArticles = (articlesQuery.data ?? []).filter(a => a.showId === show?.id);
  const relatedSymposium = (symposiaQuery.data ?? []).find(s =>
    show?.id ? s.relatedShowIds?.includes(show.id) : false,
  );

  if (isLoading) {
    return <LoadingState />;
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

  const showDate = new Date(show.date);
  // const showTime = new Date(show.time);

  return (
    <div className="space-y-8">
      <Link
        to={`/festival/${year}`}
        className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
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
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-secondary-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400">{t('show.director')}</p>
                <p className="font-medium text-primary-900 dark:text-white">{show.director}</p>
              </div>
            </div>

            {show.author && (
              <div className="flex items-start gap-3">
                <User size={20} className="text-secondary-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-600 dark:text-primary-400">{t('show.dramaturg')}</p>
                  <p className="font-medium text-primary-900 dark:text-white">{show.author}</p>
                </div>
              </div>
            )}

            {show.cast && show.cast.length > 0 && (
              <div className="flex items-start gap-3">
                <Users size={20} className="text-secondary-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-600 dark:text-primary-400">{t('show.cast')}</p>
                  <p className="font-medium text-primary-900 dark:text-white">
                    {show.cast.join(', ')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-secondary-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400">{t('show.dateTime')}</p>
                <p className="font-medium text-primary-900 dark:text-white">
                  {showDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-secondary-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400">{t('show.venue')}</p>
                <p className="font-medium text-primary-900 dark:text-white">{show.venueName}</p>
              </div>
            </div>
          </div>

          {show.bookingUrl && (
            <a
              href={show.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button variant="primary" className="w-full group">
                {t('show.bookTicket')}
                <ExternalLink className={`${isRTL ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} size={20} />
              </Button>
            </a>
          )}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-800 dark:to-primary-900" hover={false}>
        <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-4">
          {t('show.synopsis')}
        </h2>
        <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
          {show.showDescription}
        </p>
      </Card>

      {relatedArticles.length > 0 && (
        <div>
          <SectionHeader>{t('show.criticalArticles')}</SectionHeader>
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
        </div>
      )}

      {relatedSymposium && (
          <div>
            <SectionHeader>{t('show.symposium')}</SectionHeader>
            <Link to={`/symposia/${relatedSymposium.id}`}>
              <Card>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">
                    {isRTL ? relatedSymposium.titleAr : relatedSymposium.titleEn}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-primary-600 dark:text-primary-400">
                    <span>{new Date(relatedSymposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                    <span>•</span>
                    <span>{relatedSymposium.hall}</span>
                  </div>
                  <p className="text-primary-700 dark:text-primary-300">
                    {relatedSymposium.summaryAr.substring(0, 200)}...
                  </p>
                </div>
              </Card>
            </Link>
          </div>
      )}
    </div>
  );
};
