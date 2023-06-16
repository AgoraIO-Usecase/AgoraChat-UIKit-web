import React, { FC, ReactNode } from 'react';
export interface ContactItemProps {
    contactId: string;
    className?: string;
    prefix?: string;
    avatarShape?: 'circle' | 'square';
    avatarSize?: number;
    focus?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, contactId: string) => void;
    children?: ReactNode;
    style?: React.CSSProperties;
    isActive?: boolean;
}
declare const ContactItem: FC<ContactItemProps>;
export { ContactItem };
