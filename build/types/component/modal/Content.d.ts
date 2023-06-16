import React from 'react';
export interface ContentProps {
    title?: React.ReactNode;
    holderRef?: React.Ref<HTMLDivElement>;
    style?: React.CSSProperties;
    prefixCls: string;
    className?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    sentinelStyle?: React.CSSProperties;
    visible: boolean;
    forceRender: boolean;
    closable?: boolean;
    onClose?: (e: React.SyntheticEvent) => void;
    closeIcon?: React.ReactNode;
    bodyStyle?: React.CSSProperties;
    bodyProps?: any;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    width?: number | string;
    height?: number | string;
    modalRender?: (node: React.ReactNode) => React.ReactNode;
    onVisibleChanged: (visible: boolean) => void;
    motionName?: string;
    mousePosition?: {
        x: number;
        y: number;
    } | null;
    destroyOnClose?: boolean;
}
export type ContentRef = {
    focus: () => void;
    changeActive: (next: boolean) => void;
};
declare const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
export default Content;
