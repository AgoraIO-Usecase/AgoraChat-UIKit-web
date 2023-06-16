import React, { FC, ReactNode } from 'react';
export interface HeaderProps {
    className?: string;
    prefix?: string;
    content?: ReactNode;
    avatar?: ReactNode;
    icon?: ReactNode;
    back?: boolean;
    renderContent?: () => React.ReactElement;
    onIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    moreAction?: {
        visible?: boolean;
        icon?: ReactNode;
        actions: Array<{
            content: ReactNode;
            onClick?: () => void;
        }>;
    };
    onAvatarClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
declare const Header: FC<HeaderProps>;
export { Header };
