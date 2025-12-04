import {Link} from 'react-router-dom';
import {Badge, Card, SectionHeader} from '../../components/common';
import type {Article} from '../../types';

type ShowArticlesTabProps = {
    title: string;
    emptyLabel: string;
    authorLabel: string;
    isRTL: boolean;
    articles: Article[];
    getTypeLabel: (type: Article['type']) => string;
};

export const ShowArticlesTab = ({
    title,
    emptyLabel,
    authorLabel,
    isRTL,
    articles,
    getTypeLabel,
}: ShowArticlesTabProps) => (
    <div className="space-y-6 w-full md:w-[85%] mx-auto">
        <SectionHeader>{title}</SectionHeader>
        {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(article => (
                    <Link key={article.id} to={`/articles/${article.slug}`}>
                        <Card>
                            <div className="space-y-3">
                                <Badge variant="gold">
                                    {getTypeLabel(article.type)}
                                </Badge>
                                <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">
                                    {isRTL ? article.titleAr : article.titleEn}
                                </h3>
                                <p className="text-sm text-primary-600 dark:text-primary-400">
                                    {authorLabel}: {article.author}
                                </p>
                                <p className="text-primary-700 dark:text-primary-300 line-clamp-2">
                                    {isRTL ? article.contentAr.substring(0, 120) : article.contentEn?.substring(0, 120)}...
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
