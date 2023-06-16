import React from 'react';
declare const buttonShapes: ["circle", "round", "default"];
export type ButtonShape = typeof buttonShapes[number];
declare const buttonSizes: ["small", "medium", "large"];
export type buttonSize = typeof buttonSizes[number];
declare const buttonTypes: ["primary", "default", "ghost", "text"];
export type ButtonType = typeof buttonTypes[number];
export interface ButtonProps {
    className?: string;
    children?: React.ReactNode;
    type?: ButtonType;
    shape?: ButtonShape;
    size?: buttonSize;
    disabled?: boolean;
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}
export declare const Button: ({ className, type, size, shape, disabled, icon, children, onClick, }: ButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
