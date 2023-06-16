import React, { FC, ReactNode } from 'react';
import type { ConversationData } from './ConversationList';
export interface ConversationItemProps {
    className?: string;
    prefix?: string;
    nickname?: string;
    avatarShape?: 'circle' | 'square';
    avatarSize?: number;
    avatar?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    badgeColor?: string;
    isActive?: boolean;
    data: ConversationData[0];
}
declare const ConversationItem: FC<ConversationItemProps>;
export { ConversationItem };
