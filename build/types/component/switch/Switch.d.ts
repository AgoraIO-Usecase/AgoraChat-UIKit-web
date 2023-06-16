import { ChangeEvent, ReactElement } from 'react';
export interface SwitchProps {
    className?: string;
    checked: boolean;
    disabled?: boolean;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
}
declare const Switch: ({ checked, onChange, disabled, className, }: SwitchProps) => ReactElement;
export { Switch };
