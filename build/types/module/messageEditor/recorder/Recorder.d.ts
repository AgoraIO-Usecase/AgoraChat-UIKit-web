import React from 'react';
import { AgoraChat } from 'agora-chat';
export interface RecorderProps {
    prefix?: string;
    cancelBtnShape?: 'circle' | 'square';
    onShow?: () => void;
    onHide?: () => void;
    onSend?: (message: AgoraChat.MessageBody) => void;
}
declare const Recorder: React.FC<RecorderProps>;
export { Recorder };
