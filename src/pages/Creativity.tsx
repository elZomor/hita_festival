import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Plus } from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from '../components/common';
import { useCreativityEntries } from '../api/hooks';

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
      <div className="bg-gradient-to-r from-theatre-gold to-theatre-gold-light rounded-2xl p-8 text-center shadow-2xl">
        <Sparkles className="inline-block mb-4 text-theatre-black" size={48} />
        <SectionHeader className="mb-4 text-theatre-black">
          {t('creativity.title')}
        </SectionHeader>
        <p className="text-lg text-theatre-black/80 max-w-3xl mx-auto mb-6 leading-relaxed">
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
        <Card className="bg-white dark:bg-gray-800 border-2 border-theatre-gold" hover={false}>
          <h3 className="text-2xl font-bold text-theatre-red dark:text-theatre-gold mb-6">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('creativity.submitForm.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('creativity.submitForm.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('creativity.submitForm.workTitle')} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('creativity.submitForm.type')} *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
                >
                  <option value="story">{t('creativity.submitForm.types.story')}</option>
                  <option value="essay">{t('creativity.submitForm.types.essay')}</option>
                  <option value="poem">{t('creativity.submitForm.types.poem')}</option>
                  <option value="other">{t('creativity.submitForm.types.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('creativity.submitForm.editionYear')}
                </label>
                <input
                  type="number"
                  value={formData.editionYear}
                  onChange={(e) => setFormData({ ...formData, editionYear: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
                  placeholder="2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('creativity.submitForm.content')} *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-theatre-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('creativity.submitForm.file')}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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

      {isLoading && (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.error')}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creativityEntries.map((item) => (
            <Card key={item.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                <Badge variant="gold">
                  {t(`creativity.submitForm.types.${item.type}`)}
                </Badge>
                {item.editionYear && (
                  <Badge variant="default">
                    {item.editionYear}
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-bold text-grey-900 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('creativity.by')} {item.author}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-500">
                {new Date(item.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              <p className="text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
                {item.content}
              </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
