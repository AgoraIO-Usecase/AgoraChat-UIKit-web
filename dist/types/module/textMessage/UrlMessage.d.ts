import React from 'react';
export interface UrlMessageProps {
    mediaType: 'website' | 'image' | 'application';
    url: string;
    title?: string;
    description?: string;
    favicons?: string[];
    images?: string[];
    isLoading: boolean;
}
declare const UrlMessage: React.MemoExoticComponent<(props: UrlMessageProps) => import("react/jsx-runtime").JSX.Element | null>;
export { UrlMessage };
