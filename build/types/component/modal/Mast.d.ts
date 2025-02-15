import * as React from 'react';
export type MaskProps = {
    prefixCls: string;
    visible: boolean;
    motionName?: string;
    style?: React.CSSProperties;
    maskProps?: React.HTMLAttributes<HTMLDivElement>;
};
export default function Mask(props: MaskProps): import("react/jsx-runtime").JSX.Element;
