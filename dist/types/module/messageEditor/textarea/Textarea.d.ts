import React from 'react';
export interface TextareaProps {
    prefix?: string;
    className?: string;
    placeholder?: string;
    hasSendButton?: boolean;
}
declare let Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<any>>;
export { Textarea };
