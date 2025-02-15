export interface UnitNumberProps {
    prefixCls: string;
    value: string | number;
    offset?: number;
    current?: boolean;
}
export interface SingleNumberProps {
    prefixCls: string;
    value: string;
    count: number;
}
export default function SingleNumber(props: SingleNumberProps): import("react/jsx-runtime").JSX.Element;
