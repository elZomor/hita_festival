import {Card} from '../../components/common';

type ShowCommentsTabProps = {
    message: string;
};

export const ShowCommentsTab = ({message}: ShowCommentsTabProps) => (
    <Card>
        <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
            {message}
        </p>
    </Card>
);
