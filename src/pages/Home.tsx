import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from '../components/common';
import { mockEditions, mockArticles } from '../data/mockData';

export const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentEdition = mockEditions[0];
  const latestArticles = mockArticles.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-theatre-black via-theatre-red-dark to-theatre-black rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative px-8 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-block mb-4">
              <div className="text-7xl animate-pulse">🎭</div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t('home.title')}
            </h1>

            <p className="text-xl md:text-2xl text-theatre-gold font-medium">
              {t('home.subtitle')}
            </p>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('home.tagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to={`/festival/${currentEdition.year}`}>
                <Button variant="primary" className="group">
                  {t('home.currentEdition')}
                  <ArrowRight className={`inline ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} size={20} />
                </Button>
              </Link>
              <Link to="/articles">
                <Button variant="secondary">
                  {t('home.browseArticles')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <SectionHeader>
            <Calendar className={`inline ${isRTL ? 'ml-3' : 'mr-3'}`} size={32} />
            {t('home.editionsTitle')}
          </SectionHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEditions.map((edition) => (
            <Link key={edition.year} to={`/festival/${edition.year}`}>
              <Card className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold">
                      {isRTL ? edition.titleAr : edition.titleEn}
                    </h3>
                    {edition.year === currentEdition.year && (
                      <Badge variant="red">{t('festival.todayShow')}</Badge>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL ? edition.descriptionAr : edition.descriptionEn}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(edition.startDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span>{edition.numberOfShows} {t('festival.numberOfShows')}</span>
                    <span>•</span>
                    <span>{edition.numberOfArticles} {t('festival.numberOfArticles')}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <SectionHeader>
            <FileText className={`inline ${isRTL ? 'ml-3' : 'mr-3'}`} size={32} />
            {t('home.latestArticles')}
          </SectionHeader>
          <Link to="/articles">
            <Button variant="ghost" className="hidden sm:block">
              {t('common.viewDetails')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <Link key={article.id} to={`/articles/${article.slug}`}>
              <Card className="h-full">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="gold">
                      {t(`articles.types.${article.type}`)}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {article.editionYear}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                    {isRTL ? article.titleAr : article.titleEn}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('articles.author')}: {article.author}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {isRTL ? article.contentAr.substring(0, 150) : article.contentEn?.substring(0, 150)}...
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/articles">
            <Button variant="ghost">
              {t('common.viewDetails')}
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-r from-theatre-gold to-theatre-gold-light rounded-2xl p-8 md:p-12 text-center shadow-2xl">
        <Sparkles className="inline-block mb-4 text-theatre-black" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-theatre-black mb-4">
          {t('home.creativityTitle')}
        </h2>
        <p className="text-lg text-theatre-black/80 max-w-2xl mx-auto mb-8">
          {t('home.creativityText')}
        </p>
        <Link to="/creativity">
          <Button variant="primary">
            {t('home.exploreCreativity')}
          </Button>
        </Link>
      </section>
    </div>
  );
};
