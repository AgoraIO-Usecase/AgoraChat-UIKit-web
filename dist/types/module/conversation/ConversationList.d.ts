import React from 'react';
import { ConversationItemProps } from './ConversationItem';
import { HeaderProps } from '../header';
export type ConversationData = Array<{
    chatType: 'singleChat' | 'groupChat';
    conversationId: string;
    name?: string;
    unreadCount: number;
    lastMessage: {
        type: 'txt' | 'img' | 'audio' | 'video' | 'file' | 'custom';
        msg?: string;
        time: number;
        chatType: 'singleChat' | 'groupChat';
        from: string;
    };
}>;
export type ServerCvs = Array<{
    channel_id: string;
    lastMessage: any;
    unread_num: number;
}>;
export interface ConversationListProps {
    prefix?: string;
    className?: string;
    style?: React.CSSProperties;
    onItemClick?: (data: ConversationData[0]) => void;
    onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => boolean;
    renderHeader?: () => React.ReactNode;
    renderSearch?: () => React.ReactNode;
    renderItem?: (cvs: ConversationData[0], index: number) => React.ReactNode;
    headerProps?: HeaderProps;
    itemProps?: ConversationItemProps;
}
declare const ConversationList: React.FunctionComponent<ConversationListProps>;
export { ConversationList };
