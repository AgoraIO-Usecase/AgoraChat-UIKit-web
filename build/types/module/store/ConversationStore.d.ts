import { ChatType } from '../types/messageType';
import { AgoraChat } from 'agora-chat';
export interface Conversation {
    chatType: ChatType;
    conversationId: string;
    lastMessage: AgoraChat.MessageBody;
    unreadCount: number;
    name?: string;
}
export interface CurrentConversation {
    conversationId: string;
    chatType: ChatType;
    name?: string;
    unreadCount?: number;
}
export interface ById {
    [key: string]: Conversation;
}
declare class ConversationStore {
    rootStore: any;
    currentCvs: CurrentConversation;
    conversationList: Conversation[];
    searchList: Conversation[];
    byId: ById;
    constructor(rootStore: any);
    setCurrentCvs(currentCvs: CurrentConversation): void;
    setConversation(conversations: Conversation[]): void;
    addConversation(conversation: Conversation): void;
    setSearchList(conversations: Conversation[]): void;
    deleteConversation(conversation: CurrentConversation): void;
    modifyConversation(conversation: Conversation): void;
    topConversation(conversation: Conversation): void;
    getConversation(chatType: ChatType, cvsId: string): undefined;
}
export default ConversationStore;
