import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Plus } from 'lucide-react';
import { Button, Card, Badge, SectionHeader, LoadingState } from '../components/common';
import { useCreativityEntries } from '../api/hooks';
import { buildMediaUrl } from '../utils/mediaUtils';

export const Creativity = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    type: 'story' as 'story' | 'essay' | 'poem' | 'other',
    editionYear: '',
    content: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    data: creativityEntries = [],
    isLoading,
    isError,
  } = useCreativityEntries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submission:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowSubmitForm(false);
      setFormData({
        name: '',
        email: '',
        title: '',
        type: 'story',
        editionYear: '',
        content: '',
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-2xl p-8 text-center shadow-2xl">
        <Sparkles className="inline-block mb-4 text-primary-950" size={48} />
        <SectionHeader className="mb-4 text-primary-950">
          {t('creativity.title')}
        </SectionHeader>
        <p className="text-lg text-primary-950/80 max-w-3xl mx-auto mb-6 leading-relaxed">
          {t('creativity.description')}
        </p>
        <Button
          variant="primary"
          onClick={() => setShowSubmitForm(true)}
          className="group"
        >
          <Plus className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
          {t('creativity.submit')}
        </Button>
      </div>

      {showSubmitForm && (
        <Card className="bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 border-2 border-secondary-500" hover={false}>
          <h3 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-6">
            {t('creativity.submitForm.title')}
          </h3>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-800 dark:text-green-200">
                {t('creativity.submitForm.success')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                  {t('creativity.submitForm.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                  {t('creativity.submitForm.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                {t('creativity.submitForm.workTitle')} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                  {t('creativity.submitForm.type')} *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
                >
                  <option value="story">{t('creativity.submitForm.types.story')}</option>
                  <option value="essay">{t('creativity.submitForm.types.essay')}</option>
                  <option value="poem">{t('creativity.submitForm.types.poem')}</option>
                  <option value="other">{t('creativity.submitForm.types.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                  {t('creativity.submitForm.editionYear')}
                </label>
                <input
                  type="number"
                  value={formData.editionYear}
                  onChange={(e) => setFormData({ ...formData, editionYear: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
                  placeholder="2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                {t('creativity.submitForm.content')} *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-secondary-500 dark:focus:ring-secondary-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700 dark:text-primary-300">
                {t('creativity.submitForm.file')}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="w-full px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowSubmitForm(false)}
              >
                {t('creativity.submitForm.cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {t('creativity.submitForm.submitBtn')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <LoadingState fullscreen={false} />}

      {isError && (
        <div className="text-center py-16">
          <p className="text-lg text-primary-600 dark:text-primary-300">{t('common.error')}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creativityEntries.map(item => {
            const localizedTitle = isRTL ? item.titleAr ?? item.title : item.titleEn ?? item.title;
            const preview = isRTL ? item.contentAr ?? item.content : item.contentEn ?? item.content;
            const attachmentUrl = item.attachments?.map(path => buildMediaUrl(path)).find(url => url && url.trim() !== '') ?? '';

            return (
              <Link key={item.id} to={`/creativity/${item.slug}`} className="block h-full">
                <Card className="transition-all hover:shadow-2xl h-full">
                  <div className="flex flex-col md:flex-row gap-4 h-full">
                    {attachmentUrl && (
                      <div className="w-full md:w-1/3 lg:w-2/5 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={attachmentUrl}
                          alt={localizedTitle}
                          className="w-full h-48 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="gold">
                          {t(`creativity.types.${item.type}`)}
                        </Badge>
                        {item.editionYear && (
                          <Badge variant="default">
                            {item.editionYear}
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-accent-600 dark:text-secondary-500">
                        {localizedTitle}
                      </h2>

                      <p className="text-primary-600 dark:text-primary-400 flex flex-wrap items-center gap-2">
                        <span>
                          {t('creativity.by')} <span className="font-medium">{item.author}</span>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </p>

                      <p className="text-primary-700 dark:text-primary-300 leading-relaxed line-clamp-3">
                        {preview.substring(0, 250)}...
                      </p>

                      <p className="text-secondary-500 hover:text-secondary-400 font-medium">
                        {t('creativity.readMore')} →
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
