import React from 'react';
export interface GroupProps {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    prefixCls?: string;
    size: 'large' | 'small' | 'default' | number;
    shape: 'circle' | 'square';
}
declare const Group: React.FC<GroupProps>;
export default Group;
