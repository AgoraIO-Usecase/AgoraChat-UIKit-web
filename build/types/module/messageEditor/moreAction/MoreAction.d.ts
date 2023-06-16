import { ReactNode } from 'react';
export interface MoreActionProps {
    prefix?: string;
    icon?: ReactNode;
    customActions?: Array<{
        title: string;
        onClick: () => void;
        icon: ReactNode;
    }>;
    defaultActions?: [{}];
}
declare let MoreAction: (props: MoreActionProps) => import("react/jsx-runtime").JSX.Element;
export { MoreAction };
