import {Card} from '../../components/common';

type ShowInfoTabProps = {
    title: string;
    description: string;
};

export const ShowInfoTab = ({title, description}: ShowInfoTabProps) => (
    <Card className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-800 dark:to-primary-900" hover={false}>
        <h2 className="text-2xl font-bold text-accent-600 dark:text-secondary-500 mb-4">
            {title}
        </h2>
        <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
            {description}
        </p>
    </Card>
);
