import { ChatType } from '../types/messageType';
export declare function getConversationTime(time: number): string | undefined;
export declare function parseChannel(channelId: string): {
    chatType: ChatType;
    conversationId: string;
};
