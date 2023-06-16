import { FC, ReactNode } from 'react';
export interface EmptyProps {
    className?: string;
    prefix?: string;
    text?: ReactNode;
    icon?: ReactNode;
}
declare const Empty: FC<EmptyProps>;
export { Empty };
