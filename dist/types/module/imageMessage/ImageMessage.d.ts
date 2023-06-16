import React from 'react';
import { BaseMessageProps } from '../baseMessage';
import type { ImageMessageType } from '../types/messageType';
export interface ImageMessageProps extends BaseMessageProps {
    imageMessage: ImageMessageType;
    prefix?: string;
    style?: React.CSSProperties;
    onClickImage?: (url: string) => void;
}
export interface ImagePreviewProps {
    visible: boolean;
    previewImageUrl: string;
    alt?: string;
    onCancel?: () => void;
}
export declare const ImagePreview: (props: ImagePreviewProps) => import("react/jsx-runtime").JSX.Element;
declare const _default: React.MemoExoticComponent<(props: ImageMessageProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
