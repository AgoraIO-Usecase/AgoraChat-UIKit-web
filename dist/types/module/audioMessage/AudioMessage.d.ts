import React from 'react';
import { BaseMessageProps } from '../baseMessage';
import type { AudioMessageType } from '../types/messageType';
export interface AudioMessageProps extends Omit<BaseMessageProps, 'bubbleType'> {
    audioMessage: AudioMessageType;
    prefix?: string;
    style?: React.CSSProperties;
    className?: string;
    type?: 'primary' | 'secondly';
}
declare const AudioMessage: (props: AudioMessageProps) => import("react/jsx-runtime").JSX.Element;
export { AudioMessage };
