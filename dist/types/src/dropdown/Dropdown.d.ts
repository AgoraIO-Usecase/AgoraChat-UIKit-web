import { ReactElement } from 'react';
export interface DropdownProps {
    className?: string;
    children: ReactElement;
    menu: ReactElement[];
    isOpen?: boolean;
}
declare const Dropdown: ({ children, className, menu, isOpen }: DropdownProps) => import("react/jsx-runtime").JSX.Element;
export { Dropdown };
