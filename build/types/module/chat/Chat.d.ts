import React, { ReactNode } from 'react';
import { HeaderProps } from '../header';
import { MessageEditorProps } from '../messageEditor';
import { MsgListProps } from './MessageList';
export interface ChatProps {
    prefix?: string;
    className?: string;
    renderHeader?: (cvs: {
        chatType: 'singleChat' | 'groupChat';
        conversationId: string;
        name?: string;
        unreadCount?: number;
    }) => ReactNode;
    renderMessageList?: () => ReactNode;
    renderMessageEditor?: () => ReactNode;
    renderEmpty?: () => ReactNode;
    headerProps?: {
        onAvatarClick?: () => void;
        moreAction?: HeaderProps['moreAction'];
    };
    messageListProps?: MsgListProps;
    messageEditorProps?: MessageEditorProps;
}
declare const _default: React.FunctionComponent<ChatProps>;
export default _default;
