import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge, Card, LoadingState } from '../components/common';
import { useArticles, useFestivalEditions, useShows } from '../api/hooks';

export const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const articlesQuery = useArticles();
  const showsQuery = useShows();
  const festivalsQuery = useFestivalEditions();

  const isLoading = articlesQuery.isLoading || showsQuery.isLoading || festivalsQuery.isLoading;
  const hasError = articlesQuery.isError || showsQuery.isError || festivalsQuery.isError;

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
  const relatedFestival = article?.festivalId
    ? festivalsQuery.data?.find(
        festival => festival.slug === article.festivalId || String(festival.year) === article.festivalId
      )
    : null;

  const buildMediaUrl = (path: string) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const envBaseUrl = import.meta.env?.VITE_API_BASE_URL;
    const fallbackBase =
      typeof window !== 'undefined' ? window.location.origin : '';
    const baseUrl = envBaseUrl && envBaseUrl.trim() !== '' ? envBaseUrl : fallbackBase;
    if (!baseUrl) {
      return path.startsWith('/') ? path : `/${path}`;
    }
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${normalizedBase}/${normalizedPath}`;
  };

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

  if (!article) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          {t('common.noResults')}
        </h2>
      </div>
    );
  }

  const attachmentUrls = (article.attachments ?? []).map(buildMediaUrl).filter(Boolean);
  const [primaryAttachment, ...extraAttachments] = attachmentUrls;
  const localizedTitle = isRTL ? article.titleAr : article.titleEn;

  const rawContent = (isRTL ? article.contentAr : article.contentEn || article.contentAr) ?? '';
  const contentSections = rawContent
    .split(/\r?\n\s*\r?\n/)
    .map(section => section.trim())
    .filter(Boolean);
  const sectionsToRender = contentSections.length > 0 ? contentSections : [rawContent];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 transition-colors"
      >
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        {t('common.backToList')}
      </Link>

      <article className="space-y-6">
        {(relatedShow || relatedFestival) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedShow && (
              <Card className="border border-secondary-300 h-full">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">
                    {t('articles.relatedShow')}
                  </p>
                  <Link to={`/festival/${relatedShow.editionYear}/shows/${relatedShow.slug}`}>
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50 hover:underline">
                      {relatedShow.name}
                    </h3>
                  </Link>
                </div>
              </Card>
            )}

            {relatedFestival && (
              <Card className="border border-primary-300 h-full">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">
                    {t('articles.relatedFestival')}
                  </p>
                  <Link to={`/festival/${relatedFestival.year}`}>
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50 hover:underline">
                      {isRTL ? relatedFestival.titleAr : relatedFestival.titleEn}
                    </h3>
                  </Link>
                  <p className="text-sm text-primary-700 dark:text-primary-200">
                    {new Date(relatedFestival.startDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                      month: 'long',
                      day: 'numeric'
                    })}{' '}
                    -{' '}
                    {new Date(relatedFestival.endDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">
              {t(`articles.types.${article.type}`)}
            </Badge>
            <Badge variant="default">
              {article.editionYear}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-accent-600 dark:text-secondary-500 leading-tight">
            {localizedTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-primary-600 dark:text-primary-400">
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



        {primaryAttachment && (
          <div className="w-full flex justify-center">
            <img
              src={primaryAttachment}
              alt={localizedTitle}
              className="max-h-[360px] w-full max-w-3xl object-contain rounded-2xl bg-primary-50 dark:bg-primary-900"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div
            className="text-primary-800 dark:text-primary-200 leading-relaxed space-y-6"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
            }}
          >
            {sectionsToRender.map((paragraph, index) => (
              <p key={index} className="mb-6 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {extraAttachments.length > 0 && (
          <div
            className={`grid gap-6 ${
              extraAttachments.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {extraAttachments.map((attachment, idx) => (
              <div key={attachment + idx} className="w-full flex justify-center">
                <img
                  src={attachment}
                  alt={`${localizedTitle} attachment ${idx + 2}`}
                  className="max-h-[360px] w-full max-w-xl object-contain rounded-2xl bg-primary-50 dark:bg-primary-900"
                />
              </div>
            ))}
          </div>
        )}
      </article>

      {relatedArticles.length > 0 && (
        <div className="border-t border-primary-300 dark:border-primary-700 pt-8">
          <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-6">
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
                    <h3 className="text-lg font-bold text-primary-900 dark:text-primary-50 line-clamp-2">
                      {isRTL ? relatedArticle.titleAr : relatedArticle.titleEn}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
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
