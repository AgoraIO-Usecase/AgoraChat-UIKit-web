import React from 'react';
import { BaseMessageProps } from '../baseMessage';
import type { TextMessageType } from '../types/messageType';
export interface TextMessageProps extends BaseMessageProps {
    textMessage: TextMessageType;
    type?: 'primary' | 'secondly';
    prefix?: string;
    nickName?: string;
    className?: string;
    children?: string;
    style?: React.CSSProperties;
}
export declare const TextMessage: (props: TextMessageProps) => import("react/jsx-runtime").JSX.Element;
