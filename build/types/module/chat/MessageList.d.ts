import React, { FC, ReactNode } from 'react';
import { AgoraChat } from 'agora-chat';
export interface MsgListProps {
    prefix?: string;
    className?: string;
    style?: React.CSSProperties;
    renderMessage?: (message: AgoraChat.MessageBody) => ReactNode;
}
declare let MessageList: FC<MsgListProps>;
export { MessageList };
