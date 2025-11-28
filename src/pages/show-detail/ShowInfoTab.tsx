import {Card} from '../../components/common';
import type {ShowDetailEntry} from '../../types';

export type ShowDetailSection = {
    title: string;
    items: ShowDetailEntry[];
};

type ShowInfoTabProps = {
    descriptionSection?: ShowDetailSection;
    actorsSection?: ShowDetailSection;
    crewSection?: ShowDetailSection;
    additionalSection?: ShowDetailSection;
};

type DetailVariant = 'text' | 'default' | 'role';

export const ShowInfoTab = ({descriptionSection, actorsSection, crewSection, additionalSection}: ShowInfoTabProps) => {
    const sections = [
        {key: 'actors', section: actorsSection, variant: 'role' as DetailVariant},
        {key: 'crew', section: crewSection, variant: 'role' as DetailVariant},
        {key: 'description', section: descriptionSection, variant: 'text' as DetailVariant},
        {key: 'additional', section: additionalSection, variant: 'text' as DetailVariant},
    ].filter(({section}) => section && section.items.length > 0) as {
        key: string;
        section: ShowDetailSection;
        variant: DetailVariant;
    }[];

    if (sections.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map(({key, section, variant}) => (
                <div key={key} className="h-full">
                    <DetailSection section={section} variant={variant}/>
                </div>
            ))}
        </div>
    );
};

const DetailSection = ({section, variant}: {section?: ShowDetailSection; variant: DetailVariant}) => {
    if (!section || !section.items.length) {
        return null;
    }

    return (
        <Card hover={false} className="h-full">
            <h3 className="text-xl font-semibold text-accent-600 dark:text-secondary-500 mb-4">
                {section.title}
            </h3>
            <DetailList items={section.items} variant={variant}/>
        </Card>
    );
};

const DetailList = ({
    items,
    variant,
    depth = 0,
}: {
    items: ShowDetailEntry[];
    variant: DetailVariant;
    depth?: number;
}) => {
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

const DetailListItem = ({
    item,
    variant,
    depth,
}: {
    item: ShowDetailEntry;
    variant: DetailVariant;
    depth: number;
}) => {
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

    return (
        <li>
            <div className="flex flex-wrap items-baseline gap-2">
                <span
                    className={isTextVariant ? 'text-primary-800 dark:text-primary-100' : ' text-primary-500 dark:text-primary-200'}
                >
                    {item.text}
                </span>
                {renderValue(item.value, {inline: true})}
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
        return (
            <ul className="list-disc ms-5 space-y-1 mt-2">
                {value.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                ))}
            </ul>
        );
    }

    if (options.inline) {
        return <span className="text-primary-800 dark:text-primary-100">{value}</span>;
    }

    return <p className="mt-1">{value}</p>;
};

const buildItemKey = (item: ShowDetailEntry, index: number) =>
    `${item.text}-${Array.isArray(item.value) ? item.value.join('-') : item.value ?? 'value'}-${index}`;

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
