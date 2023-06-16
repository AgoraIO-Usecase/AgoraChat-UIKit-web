export interface MessageStatusProps {
    status: 'received' | 'read' | 'unread' | 'sent' | 'failed' | 'sending' | 'default';
    type?: 'icon' | 'text';
    prefixCls?: string;
    className?: string;
}
declare const MessageStatus: (props: MessageStatusProps) => import("react/jsx-runtime").JSX.Element;
export { MessageStatus };
