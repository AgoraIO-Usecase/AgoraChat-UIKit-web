import React, { ReactNode } from 'react';
export interface ProviderProps {
    initConfig: {
        appKey: string;
        userId?: string;
        password?: string;
    };
    local?: {
        fallbackLng?: string;
        lng: 'zh' | 'en';
        resources?: {
            [key: string]: {
                translation: {
                    [key: string]: string;
                };
            };
        };
    };
    children?: ReactNode;
}
declare const _default: React.NamedExoticComponent<ProviderProps>;
export default _default;
