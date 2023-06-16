import React, { ReactNode } from 'react';
import { emoji } from './emojiConfig';
export interface EmojiProps {
    icon?: ReactNode;
    onSelected?: (emojiString: keyof typeof emoji.map) => void;
    trigger?: 'click' | 'hover';
    config?: {
        map: any;
        path: string;
    };
    onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
declare const Emoji: (props: EmojiProps) => import("react/jsx-runtime").JSX.Element;
export { Emoji };
