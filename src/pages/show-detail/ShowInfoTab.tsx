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

export const ShowInfoTab = ({descriptionSection, actorsSection, crewSection, additionalSection}: ShowInfoTabProps) => {
    const sections = [
        {key: 'description', section: descriptionSection, fullText: true},
        {key: 'actors', section: actorsSection, fullText: false},
        {key: 'crew', section: crewSection, fullText: false},
        {key: 'additional', section: additionalSection, fullText: true},
    ].filter(({section}) => section && section.items.length > 0) as {
        key: string;
        section: ShowDetailSection;
        fullText: boolean;
    }[];

    if (sections.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map(({key, section, fullText}) => (
                <div key={key} className="h-full">
                    <DetailSection section={section} fullText={fullText}/>
                </div>
            ))}
        </div>
    );
};

const DetailSection = ({section, fullText}: {section?: ShowDetailSection; fullText: boolean}) => {
    if (!section || !section.items.length) {
        return null;
    }

    return (
        <Card hover={false} className="h-full">
            <h3 className="text-xl font-semibold text-accent-600 dark:text-secondary-500 mb-4">
                {section.title}
            </h3>
            <DetailList items={section.items} fullText={fullText}/>
        </Card>
    );
};

const DetailList = ({
    items,
    fullText,
    depth = 0,
}: {
    items: ShowDetailEntry[];
    fullText: boolean;
    depth?: number;
}) => {
    const listStyle = depth === 0 ? 'list-disc' : 'list-[circle]';
    return (
        <ul className={`${listStyle} ${depth === 0 ? 'ms-5' : 'ms-6'} space-y-3 text-primary-800 dark:text-primary-100`}>
            {items.map((item, index) => (
                <DetailListItem key={buildItemKey(item, index)} item={item} fullText={fullText} depth={depth}/>
            ))}
        </ul>
    );
};

const DetailListItem = ({
    item,
    fullText,
    depth,
}: {
    item: ShowDetailEntry;
    fullText: boolean;
    depth: number;
}) => (
    <li>
        <div className="flex flex-wrap items-baseline gap-2">
            <span
                className={fullText ? 'text-primary-800 dark:text-primary-100' : 'font-semibold text-primary-500 dark:text-primary-200'}
            >
                {item.text}
            </span>
            {renderValue(item.value, {inline: true})}
        </div>

        {item.children && item.children.length > 0 && (
            <div className="mt-2">
                <DetailList items={item.children} fullText={false} depth={depth + 1}/>
            </div>
        )}
    </li>
);

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
