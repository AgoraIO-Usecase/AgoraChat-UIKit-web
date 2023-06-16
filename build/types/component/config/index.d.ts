import React from 'react';
export interface ConfigConsumerProps {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    iconPrefixCls?: any;
    getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
}
export declare const ConfigContext: React.Context<ConfigConsumerProps>;
export declare const ConfigConsumer: React.Consumer<ConfigConsumerProps>;
export declare const ConfigProvider: React.Provider<ConfigConsumerProps>;
