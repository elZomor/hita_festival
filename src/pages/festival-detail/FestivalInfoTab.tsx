import {useTranslation} from 'react-i18next';
import {Card} from '../../components/common';
import type {FestivalEdition, ShowDetailEntry} from '../../types';
import {buildMediaUrl} from '../../utils/mediaUtils';

type DetailVariant = 'text' | 'default' | 'role';

type FestivalInfoTabProps = {
    edition: FestivalEdition;
};

export const FestivalInfoTab = ({edition}: FestivalInfoTabProps) => {
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';

    const formattedStartDate = new Date(edition.startDate).toLocaleDateString(
        isRTL ? 'ar-EG' : 'en-US',
        {year: 'numeric', month: 'long', day: 'numeric'}
    );

    const formattedEndDate = new Date(edition.endDate).toLocaleDateString(
        isRTL ? 'ar-EG' : 'en-US',
        {year: 'numeric', month: 'long', day: 'numeric'}
    );

    const posterUrl = edition.logo ? buildMediaUrl(edition.logo) : null;

    const organizingTeamSection = edition.organizingTeam && edition.organizingTeam.length > 0
        ? {title: t('festival.organizingTeam'), items: edition.organizingTeam}
        : undefined;

    const jurySection = edition.juryList && edition.juryList.length > 0
        ? {
            title: t('festival.juryList'),
            items: edition.juryList.map(name => ({text: name}))
        }
        : undefined;

    const awardsSection = edition.awards && edition.awards.length > 0
        ? {title: t('festival.awards'), items: edition.awards}
        : undefined;

    const extraDetailsSection = edition.extraDetails && edition.extraDetails.length > 0
        ? {
            title: t('festival.additionalInfo'),
            items: edition.extraDetails.map(item =>
                typeof item === 'string' ? {text: item} : item
            )
        }
        : undefined;

    const sections = [
        {key: 'organizingTeam', section: organizingTeamSection, variant: 'role' as const},
        {key: 'jury', section: jurySection, variant: 'default' as const},
        {key: 'awards', section: awardsSection, variant: 'default' as const},
        {key: 'extraDetails', section: extraDetailsSection, variant: 'text' as const},
    ].filter(({section}) => section && section.items.length > 0) as {
        key: string;
        section: {title: string; items: ShowDetailEntry[]};
        variant: DetailVariant;
    }[];

    return (
        <div className="space-y-6">
            <Card hover={false}>
                <h3 className="text-2xl font-semibold text-accent-600 dark:text-secondary-500 mb-6">
                    {t('festival.basicInfo')}
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        {edition.organizer && (
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                    {t('festival.organizer')}
                                </span>
                                <span className="text-lg text-primary-900 dark:text-primary-50">
                                    {edition.organizer}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {t('festival.startDate')}
                            </span>
                            <span className="text-lg text-primary-900 dark:text-primary-50">
                                {formattedStartDate}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {t('festival.endDate')}
                            </span>
                            <span className="text-lg text-primary-900 dark:text-primary-50">
                                {formattedEndDate}
                            </span>
                        </div>
                    </div>
                    {posterUrl && (
                        <div className="w-full md:w-64 lg:w-80">
                            <img
                                src={posterUrl}
                                alt={isRTL ? edition.titleAr : edition.titleEn}
                                className="w-full h-auto rounded-lg object-contain"
                            />
                        </div>
                    )}
                </div>
            </Card>

            {sections.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map(({key, section, variant}) => (
                        <div key={key} className="h-full">
                            <DetailSection section={section} variant={variant}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

type DetailSectionProps = {
    section: {
        title: string;
        items: ShowDetailEntry[];
    };
    variant: DetailVariant;
};

const DetailSection = ({section, variant}: DetailSectionProps) => {
    return (
        <Card hover={false} className="h-full">
            <h3 className="text-xl font-semibold text-accent-600 dark:text-secondary-500 mb-4">
                {section.title}
            </h3>
            <DetailList items={section.items} variant={variant}/>
        </Card>
    );
};

type DetailListProps = {
    items: ShowDetailEntry[];
    variant: DetailVariant;
    depth?: number;
};

const DetailList = ({items, variant, depth = 0}: DetailListProps) => {
    const hasSingleUnlabeledItem = items.length === 1 && !items[0].value && !items[0].children;
    const listStyle = depth === 0 ? 'list-disc' : 'list-[circle]';
    const margin = depth === 0 ? 'ms-5' : 'ms-6';
    const isRoleRoot = variant === 'role' && depth === 0;

    if (hasSingleUnlabeledItem && variant !== 'role') {
        return (
            <div className="text-primary-800 dark:text-primary-100">
                {items[0].text}
            </div>
        );
    }

    return (
        <ul
            className={`${listStyle} ${margin} space-y-3 ${
                isRoleRoot ? 'text-theatre-gold-500' : 'text-primary-800 dark:text-primary-100'
            }`}
        >
            {items.map((item, index) => (
                <DetailListItem
                    key={buildItemKey(item, index)}
                    item={item}
                    variant={variant}
                    depth={depth}
                />
            ))}
        </ul>
    );
};

type DetailListItemProps = {
    item: ShowDetailEntry;
    variant: DetailVariant;
    depth: number;
};

const DetailListItem = ({item, variant, depth}: DetailListItemProps) => {
    if (variant === 'role' && depth === 0) {
        const roleValue = getRoleValue(item);
        return (
            <li>
                <div className="flex gap-2 text-sm md:text-base">
                    <span className="text-theatre-gold-500 font-semibold">{item.text}</span>
                    {roleValue && <span className="text-primary-700 dark:text-primary-200">{roleValue}</span>}
                </div>
                {item.children && item.children.length > 0 && (
                    <div className="mt-2 ms-4">
                        <DetailList items={item.children} variant="default" depth={depth + 1}/>
                    </div>
                )}
            </li>
        );
    }

    const isTextVariant = variant === 'text';
    const hasValue = item.value && (
        (typeof item.value === 'string' && item.value.trim()) ||
        (Array.isArray(item.value) && item.value.length > 0)
    );

    return (
        <li>
            <div className="flex flex-wrap items-baseline gap-2">
                <span
                    className={isTextVariant ? 'text-primary-800 dark:text-primary-100' : 'text-primary-500 dark:text-primary-200'}
                >
                    {item.text}
                </span>
                {hasValue && renderValue(item.value, {inline: true})}
            </div>

            {item.children && item.children.length > 0 && (
                <div className="mt-2">
                    <DetailList items={item.children} variant="default" depth={depth + 1}/>
                </div>
            )}
        </li>
    );
};

const renderValue = (value?: string | string[], options: {inline?: boolean} = {}) => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        const filtered = value.filter(Boolean);
        if (filtered.length === 0) {
            return null;
        }

        if (!options.inline) {
            return (
                <ul className="list-disc ms-5 space-y-1 mt-2">
                    {filtered.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                    ))}
                </ul>
            );
        }

        return <span className="text-primary-800 dark:text-primary-100">{filtered.join(', ')}</span>;
    }

    if (options.inline) {
        return <span className="text-primary-800 dark:text-primary-100">{value}</span>;
    }

    return <p className="mt-1 text-primary-800 dark:text-primary-100">{value}</p>;
};

const getRoleValue = (item: ShowDetailEntry): string | undefined => {
    if (Array.isArray(item.value)) {
        const values = item.value.filter(Boolean);
        if (values.length > 0) {
            return values.join(', ');
        }
    }

    if (typeof item.value === 'string' && item.value.trim()) {
        return item.value;
    }

    return undefined;
};

const buildItemKey = (item: ShowDetailEntry, index: number) =>
    `${item.text}-${Array.isArray(item.value) ? item.value.join('-') : item.value ?? 'value'}-${index}`;
