import { FC, ReactNode } from 'react';
export interface ContactGroupProps {
    prefix?: string;
    children?: ReactNode;
    title?: string;
    itemCount?: number;
    itemHeight?: number;
    open?: boolean;
    onclickTitle?: (data: any) => void;
}
declare const ContactGroup: FC<ContactGroupProps>;
export { ContactGroup };
