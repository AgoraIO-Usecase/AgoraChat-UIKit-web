import React from 'react';
export interface ScrollListProps<T> {
    className?: string;
    style?: React.CSSProperties;
    renderItem: (item: T, index: number) => JSX.Element;
    paddingHeight?: number;
    loadMoreItems?: () => void | Promise<void>;
    scrollTo?: () => 'top' | 'bottom' | string;
    hasMore?: boolean;
    prefix?: string;
    data: Array<T>;
    loading: boolean;
}
declare const ScrollList: React.ForwardRefExoticComponent<ScrollListProps<unknown> & React.RefAttributes<unknown>>;
export { ScrollList };
