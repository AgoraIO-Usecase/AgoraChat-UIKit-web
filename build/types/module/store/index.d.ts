import MessageStore from './MessageStore';
import ConversationStore from './ConversationStore';
import AddressStore from './AddressStore';
import { AgoraChat } from 'agora-chat';
export interface InitConfig {
    appKey: string;
}
export declare class RootStore {
    messageStore: MessageStore;
    conversationStore: ConversationStore;
    addressStore: AddressStore;
    client: AgoraChat.Connection;
    loginState: boolean;
    initConfig: {
        appKey: string;
    };
    constructor();
    setClient(client: AgoraChat.Connection): void;
    setLoginState(state: boolean): void;
    setInitConfig(initConfig: InitConfig): void;
}
export declare function getStore(): RootStore;
declare const store2: RootStore;
export default store2;
