import React from 'react';
export interface TextareaProps {
    prefix?: string;
    className?: string;
    placeholder?: string;
    hasSendButton?: boolean;
    sendButtonActiveColor?: string;
}
declare let Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<any>>;
export { Textarea };
