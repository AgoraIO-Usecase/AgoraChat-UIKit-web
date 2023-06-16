import { AgoraChat } from 'agora-chat';
import { CurrentConversation } from './ConversationStore';
declare class MessageStore {
    rootStore: any;
    message: {
        singleChat: {
            [key: string]: AgoraChat.MessageBody[];
        };
        groupChat: {
            [key: string]: AgoraChat.MessageBody[];
        };
        byId: {
            [key: string]: AgoraChat.MessageBody;
        };
    };
    currentCVS: CurrentConversation;
    constructor(rootStore: any);
    get currentCvsMsgs(): AgoraChat.MessageBody[];
    setCurrentCVS(currentCVS: CurrentConversation): void;
    sendMessage(message: AgoraChat.MessageBody): void;
    receiveMessage(message: AgoraChat.MessageBody): void;
    modifyMessage(id: string, message: AgoraChat.MessageBody): void;
    sendChannelAck(cvs: CurrentConversation): any;
    updateMessageStatus(msgId: string, status: string): void;
    addHistoryMsgs(cvs: CurrentConversation, msgs: any): void;
    clearMessage(cvs: CurrentConversation): void;
}
export default MessageStore;
