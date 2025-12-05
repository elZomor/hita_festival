import {Link} from 'react-router-dom';
import {Badge, Card, SectionHeader} from '../../components/common';
import type {Article} from '../../types';
import {buildMediaUrl} from '../../utils/mediaUtils';

type ShowArticlesTabProps = {
    title: string;
    emptyLabel: string;
    authorLabel: string;
    isRTL: boolean;
    articles: Article[];
    getTypeLabel: (type: Article['type']) => string;
    detailPath?: string;
};

export const ShowArticlesTab = ({
    title,
    emptyLabel,
    authorLabel,
    isRTL,
    articles,
    getTypeLabel,
    detailPath = 'articles',
}: ShowArticlesTabProps) => (
    <div className="space-y-6 w-full md:w-[85%] mx-auto">
        <SectionHeader>{title}</SectionHeader>
        {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(article => {
                    const attachmentUrl =
                        article.attachments?.map(path => buildMediaUrl(path)).find(url => url && url.trim() !== '') ?? '';
                    const preview = isRTL ? article.contentAr : article.contentEn ?? article.contentAr;

                    return (
                        <Link key={article.id} to={`/${detailPath}/${article.slug}`}>
                            <Card>
                                <div className="flex flex-col md:flex-row gap-4">
                                    {attachmentUrl && (
                                        <div className="w-full md:w-2/5 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={attachmentUrl}
                                                alt={isRTL ? article.titleAr : article.titleEn}
                                                className="w-full h-40 object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-3">
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
                                            {preview?.substring(0, 120)}...
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-primary-600 dark:text-primary-400">{emptyLabel}</p>
            </div>
        )}
    </div>
);
