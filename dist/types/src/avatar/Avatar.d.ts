import React from 'react';
export interface AvatarProps {
    size?: 'large' | 'small' | 'default' | number;
    shape?: 'circle' | 'square';
    src?: React.ReactNode;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
    children?: React.ReactNode;
    alt?: string;
    draggable?: boolean;
    crossOrigin?: '' | 'anonymous' | 'use-credentials';
    srcSet?: string;
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
    onError?: () => boolean;
}
export declare const InternalAvatar: (props: any, ref: any) => import("react/jsx-runtime").JSX.Element;
declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>>;
export default Avatar;
