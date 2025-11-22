import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, SectionHeader } from '../components/common';

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="text-7xl mb-4">🎭</div>
        <SectionHeader>{t('about.title')}</SectionHeader>
      </div>

      <Card className="bg-gradient-to-br from-accent-600/10 to-secondary-500/10" hover={false}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-4">
              {t('about.whatIsTitle')}
            </h2>
            <p className="text-primary-800 dark:text-primary-200 leading-relaxed text-lg">
              {t('about.whatIsText')}
            </p>
          </div>

          <div className="border-t border-primary-300 dark:border-primary-700 pt-6">
            <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-4">
              {t('about.whyArchiveTitle')}
            </h2>
            <p className="text-primary-800 dark:text-primary-200 leading-relaxed text-lg">
              {t('about.whyArchiveText')}
            </p>
          </div>
        </div>
      </Card>

      <Card hover={false}>
        <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-6">
          {t('about.contactTitle')}
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Mail size={24} className="text-secondary-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                البريد الإلكتروني / Email
              </p>
              <a
                href="mailto:info@arabfestival.edu.eg"
                className="text-secondary-500 hover:text-secondary-400 font-medium"
              >
                info@arabfestival.edu.eg
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone size={24} className="text-secondary-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                الهاتف / Phone
              </p>
              <p className="text-primary-800 dark:text-primary-200 font-medium">
                +20 2 1234 5678
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin size={24} className="text-secondary-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                العنوان / Address
              </p>
              <p className="text-primary-800 dark:text-primary-200 font-medium leading-relaxed">
                المعهد العالي للفنون المسرحية<br />
                أكاديمية الفنون - الهرم<br />
                القاهرة، مصر
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-gradient-to-r from-primary-950 to-accent-700 rounded-2xl p-8 text-center shadow-2xl">
        <h3 className="text-2xl font-bold text-secondary-500 mb-4">
          انضم إلينا في الاحتفال بالمسرح العربي
        </h3>
        <p className="text-primary-300 text-lg">
          Join us in celebrating Arab theatre
        </p>
      </div>
    </div>
  );
};
