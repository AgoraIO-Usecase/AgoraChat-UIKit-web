import React from 'react';
export interface ConfigConsumerProps {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    iconPrefixCls?: any;
}
export declare const ConfigContext: React.Context<ConfigConsumerProps>;
export declare const ConfigConsumer: React.Consumer<ConfigConsumerProps>;
export declare const ConfigProvider: React.Provider<ConfigConsumerProps>;
