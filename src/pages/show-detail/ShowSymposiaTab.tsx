import {Link} from 'react-router-dom';
import {Card, SectionHeader} from '../../components/common';
import type {Symposium} from '../../types';

type ShowSymposiaTabProps = {
    title: string;
    emptyLabel: string;
    symposia: Symposium[];
    isRTL: boolean;
};

export const ShowSymposiaTab = ({title, emptyLabel, symposia, isRTL}: ShowSymposiaTabProps) => (
    <div className="space-y-6">
        <SectionHeader>{title}</SectionHeader>
        {symposia.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
                {symposia.map(symposium => (
                    <Link key={symposium.id} to={`/symposia/${symposium.id}`}>
                        <Card>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-accent-600 dark:text-secondary-500">
                                    {isRTL ? symposium.titleAr : symposium.titleEn}
                                </h3>
                                <div className="flex flex-wrap gap-2 text-sm text-primary-600 dark:text-primary-400">
                                    <span>
                                        {new Date(symposium.dateTime).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                    </span>
                                    <span>•</span>
                                    <span>{symposium.hall}</span>
                                </div>
                                <p className="text-primary-700 dark:text-primary-300">
                                    {symposium.summaryAr.substring(0, 200)}...
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-primary-600 dark:text-primary-400">{emptyLabel}</p>
            </div>
        )}
    </div>
);
