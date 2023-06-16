import React, { ReactElement, ReactNode } from 'react';
import { ICON_TYPES } from './const';
export interface IconProps {
    children?: ReactNode;
    className?: string;
    type: keyof typeof ICON_TYPES;
    width?: string | number;
    height?: string | number;
    color?: string;
    onClick?: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
}
declare const Icon: ({ className, type, children, width, height, color, onClick, }: IconProps) => ReactElement;
export { Icon };
