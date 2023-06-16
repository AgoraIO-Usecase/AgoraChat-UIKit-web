import React from 'react';
import type { VideoMessageType } from '../types/messageType';
export interface VideoMessageProps {
    videoMessage: VideoMessageType;
    prefix?: string;
    style?: React.CSSProperties;
    status?: 'received' | 'read' | 'sent' | 'sending';
}
declare const VideoMessage: (props: VideoMessageProps) => import("react/jsx-runtime").JSX.Element;
export { VideoMessage };
