import { ReactNode } from 'react';
export interface MessageEditorProps {
    actions?: {
        name: string;
        visible: boolean;
        icon: ReactNode;
        onClick: (name: string) => void;
    }[];
    onSend?: (message: any) => void;
    className?: string;
    showSendButton?: boolean;
    sendButtonIcon?: ReactNode;
    row?: number;
    placeHolder?: string;
}
declare const MessageEditor: (props: MessageEditorProps) => import("react/jsx-runtime").JSX.Element;
export { MessageEditor };
