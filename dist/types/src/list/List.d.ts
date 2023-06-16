import React from 'react';
interface ListProps {
    height: number;
    itemCount: number;
    itemSize: number | ((i: number) => number);
    width?: number | string;
    itemData?: any;
    children: ({ index, style }: {
        index: number;
        style: React.CSSProperties;
    }) => JSX.Element;
    isItemLoaded: (index: number) => boolean;
    onItemRendered?: (index: number) => boolean;
    loadMoreItems: (startIndex: number, stopIndex: number) => void | Promise<void>;
}
interface List extends React.ForwardRefExoticComponent<ListProps & React.RefAttributes<any>> {
    Row: ({ index, style }: {
        index: number;
        style: React.CSSProperties;
    }) => JSX.Element;
}
declare const List: List;
export { List };
