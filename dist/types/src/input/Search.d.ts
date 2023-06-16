import React, { ReactNode, ChangeEvent } from 'react';
export interface SearchProps {
    className?: string;
    prefix?: string;
    icon?: ReactNode;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
    shape?: 'ground' | 'square';
}
export default function Search(props: SearchProps): import("react/jsx-runtime").JSX.Element;
export { Search };
