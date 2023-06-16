import React, { ReactNode } from 'react';
import { MessageStatusProps } from '../messageStatus';
export interface BaseMessageProps {
    bubbleType?: 'primary' | 'secondly' | 'none';
    bubbleStyle?: React.CSSProperties;
    status?: MessageStatusProps['status'];
    avatar?: ReactNode;
    direction?: 'ltr' | 'rtl';
    prefix?: string;
    shape?: 'ground' | 'square';
    arrow?: boolean;
    nickName?: string;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    time?: number;
}
declare const BaseMessage: (props: BaseMessageProps) => import("react/jsx-runtime").JSX.Element;
export { BaseMessage };
