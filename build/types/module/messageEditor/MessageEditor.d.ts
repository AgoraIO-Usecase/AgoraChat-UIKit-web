import { ReactNode } from 'react';
export type Actions = {
    name: string;
    visible: boolean;
    icon?: ReactNode;
}[];
export interface MessageEditorProps {
    actions?: Actions;
    onSend?: (message: any) => void;
    className?: string;
    showSendButton?: boolean;
    sendButtonIcon?: ReactNode;
    row?: number;
    placeHolder?: string;
}
declare const MessageEditor: {
    (props: MessageEditorProps): import("react/jsx-runtime").JSX.Element;
    defaultActions: Actions;
};
export { MessageEditor };
