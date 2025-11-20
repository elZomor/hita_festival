import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge, Card, LoadingState } from '../components/common';
import { useArticles, useShows } from '../api/hooks';

export const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const articlesQuery = useArticles();
  const showsQuery = useShows();

  const isLoading = articlesQuery.isLoading || showsQuery.isLoading;
  const hasError = articlesQuery.isError || showsQuery.isError;

  const article = articlesQuery.data?.find(a => a.slug === slug);
  const relatedShow = article?.showId
    ? showsQuery.data?.find(s => s.id === article.showId)
    : null;
  const relatedArticles =
    articlesQuery.data
      ?.filter(
        a =>
          a.id !== article?.id &&
          (a.showId === article?.showId || a.editionYear === article?.editionYear),
      )
      .slice(0, 3) ?? [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('common.error')}
        </h2>
      </div>
    );
  }

  if (!article) {
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
        to="/articles"
        className="inline-flex items-center gap-2 text-theatre-gold hover:text-theatre-gold-light transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        {t('common.backToList')}
      </Link>

      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">
              {t(`articles.types.${article.type}`)}
            </Badge>
            <Badge variant="default">
              {article.editionYear}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-theatre-red dark:text-theatre-gold leading-tight">
            {isRTL ? article.titleAr : article.titleEn}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{article.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {new Date(article.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {relatedShow && (
          <Card className="bg-gradient-to-br from-theatre-red/10 to-theatre-gold/10 border-2 border-theatre-gold">
            <div className="flex flex-col md:flex-row gap-4">
              {relatedShow.posterUrl && (
                <img
                  src={relatedShow.posterUrl}
                  alt={isRTL ? relatedShow.titleAr : relatedShow.titleEn}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-theatre-gold font-semibold">
                  {t('articles.relatedShow')}
                </p>
                <Link to={`/festival/${relatedShow.editionYear}/shows/${relatedShow.slug}`}>
                  <h3 className="text-xl font-bold text-theatre-red dark:text-theatre-gold hover:underline">
                    {isRTL ? relatedShow.titleAr : relatedShow.titleEn}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {relatedShow.groupName} • {relatedShow.country}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div
            className="text-gray-800 dark:text-gray-200 leading-relaxed space-y-6"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
            }}
          >
            {(isRTL ? article.contentAr : article.contentEn || article.contentAr)
              .split('\n\n')
              .map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold mb-6">
            {t('articles.relatedArticles')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map(relatedArticle => (
              <Link key={relatedArticle.id} to={`/articles/${relatedArticle.slug}`}>
                <Card>
                  <div className="space-y-3">
                    <Badge variant="gold">
                      {t(`articles.types.${relatedArticle.type}`)}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {isRTL ? relatedArticle.titleAr : relatedArticle.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {relatedArticle.author}
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
