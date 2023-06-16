import React from 'react';
import { AgoraChat } from 'agora-chat';
import { RootStore } from './index';
export interface RootConsumerProps {
    rootStore: RootStore;
    client: AgoraChat.Connection;
}
export interface ContextProps {
    rootStore: RootStore;
    initConfig: any;
    client: any;
}
export declare const RootContext: React.Context<ContextProps>;
export declare const RootConsumer: React.Consumer<ContextProps>;
export declare const RootProvider: React.Provider<ContextProps>;
