import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Card, Badge, SectionHeader, LoadingState } from '../components/common';
import { useArticles, useShows } from '../api/hooks';
import { ArticleType } from '../types';

export const Articles = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ArticleType | 'all'>('all');

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useArticles();
  const {
    data: shows = [],
    isLoading: isLoadingShows,
    isError: hasShowsError,
  } = useShows();

  const uniqueYears = ['all', ...new Set(articles.map(a => a.editionYear))];
  const articleTypes: (ArticleType | 'all')[] = ['all', 'review', 'symposium_coverage', 'analysis', 'general'];

  const filteredArticles = articles.filter(article => {
    if (yearFilter !== 'all' && article.editionYear !== Number(yearFilter)) return false;
    if (typeFilter !== 'all' && article.type !== typeFilter) return false;
    return true;
  });

  const getShowTitle = (showId?: string) => {
    if (!showId) return null;
    const show = shows.find(s => s.id === showId);
    return show ? (isRTL ? show.titleAr : show.titleEn) : null;
  };

  if (isLoading || isLoadingShows) {
    return <LoadingState />;
  }

  if (isError || hasShowsError) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-primary-600 dark:text-primary-300">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FileText size={40} className="text-accent-600 dark:text-secondary-500" />
        <SectionHeader className="mb-0">{t('articles.title')}</SectionHeader>
      </div>

      <div className="flex flex-wrap gap-4 bg-white dark:bg-primary-800 p-4 rounded-lg shadow-lg">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white"
        >
          <option value="all">{t('articles.allYears')}</option>
          {uniqueYears.slice(1).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ArticleType | 'all')}
          className="px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-900 text-primary-900 dark:text-white"
        >
          <option value="all">{t('articles.allTypes')}</option>
          {articleTypes.slice(1).map(type => (
            <option key={type} value={type}>
              {t(`articles.types.${type}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredArticles.map(article => (
          <Link key={article.id} to={`/articles/${article.slug}`}>
            <Card className="transition-all hover:shadow-2xl">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">
                    {t(`articles.types.${article.type}`)}
                  </Badge>
                  <Badge variant="default">
                    {article.editionYear}
                  </Badge>
                  {article.showId && (
                    <Badge variant="red">
                      {getShowTitle(article.showId)}
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-accent-600 dark:text-secondary-500">
                  {isRTL ? article.titleAr : article.titleEn}
                </h2>

                <p className="text-primary-600 dark:text-primary-400">
                  {t('articles.author')}: <span className="font-medium">{article.author}</span>
                  <span className="mx-2">•</span>
                  {new Date(article.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                <p className="text-primary-700 dark:text-primary-300 leading-relaxed line-clamp-3">
                  {isRTL ? article.contentAr.substring(0, 250) : article.contentEn?.substring(0, 250)}...
                </p>

                <p className="text-secondary-500 hover:text-secondary-400 font-medium">
                  {t('articles.readMore')} →
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-primary-600 dark:text-primary-400 text-lg">
            {t('common.noResults')}
          </p>
        </div>
      )}
    </div>
  );
};
