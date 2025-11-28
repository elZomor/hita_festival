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
        {key: 'actors', section: actorsSection},
        {key: 'crew', section: crewSection},
        {key: 'description', section: descriptionSection},
        {key: 'additional', section: additionalSection},
    ].filter(({section}) => section && section.items.length > 0) as {key: string; section: ShowDetailSection}[];
    const textSections = ['description', 'additional'];

    if (sections.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map(({key, section}) => (
                <div key={key} className="h-full">
                    <DetailSection section={section} fullText={textSections.includes(key)}/>
                </div>
            ))}
        </div>
    );
};

const DetailSection = ({section, fullText}: { section?: ShowDetailSection, fullText?: boolean }) => {
    if (!section || !section.items.length) {
        return null;
    }

    return (
        <Card hover={false} className="h-full">
            <h3 className="text-xl font-semibold text-accent-600 dark:text-secondary-500 mb-4">
                {section.title}
            </h3>
            <div className="space-y-4">
                {section.items.map((item, index) => (
                    fullText ? <DetailText key={buildItemKey(item, index)} item={item}/> : <DetailItem key={buildItemKey(item, index)} item={item}/>
                ))}
            </div>
        </Card>
    );
};

const DetailItem = ({item}: {item: ShowDetailEntry}) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start">
        <span className="font-semibold text-primary-500 dark:text-primary-200 sm:col-span-1">
            {item.text}
        </span>
        <div className="text-primary-800 dark:text-primary-200 sm:col-span-3 space-y-2">
            {item.value && <p>{item.value}</p>}
            {item.children && item.children.length > 0 && (
                <DetailSubList items={item.children}/>
            )}
        </div>
    </div>
);

const DetailText = ({item}: {item: ShowDetailEntry}) => (
    <div className="grid grid-cols-1 gap-3 items-start">
        <span className="font-semibold text-primary-500 dark:text-primary-200 sm:col-span-1">
            {item.text}
        </span>
        <div className="text-primary-800 dark:text-primary-200 sm:col-span-3 space-y-2">
            {item.value && <p>{item.value}</p>}
            {item.children && item.children.length > 0 && (
                <DetailSubList items={item.children}/>
            )}
        </div>
    </div>
);



const DetailSubList = ({items}: {items: ShowDetailEntry[]}) => (
    <ul className="list-disc ms-5 space-y-2 text-primary-800 dark:text-primary-100">
        {items.map((child, index) => (
            <li key={buildItemKey(child, index)}>
                <span className="font-semibold">{child.text}</span>
                {child.value && <span className="ms-2">{child.value}</span>}
                {child.children && child.children.length > 0 && (
                    <DetailSubList items={child.children}/>
                )}
            </li>
        ))}
    </ul>
);

const buildItemKey = (item: ShowDetailEntry, index: number) => `${item.text}-${item.value ?? 'value'}-${index}`;
