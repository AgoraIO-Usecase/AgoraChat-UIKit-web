import React, { ChangeEvent, ReactElement } from 'react';
export interface CheckboxProps {
    id?: string;
    className?: string;
    checked?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
}
declare const Checkbox: ({ id, checked, disabled, children, className, onChange, }: CheckboxProps) => ReactElement;
export { Checkbox };
