export interface NoticeMessageProps {
    noticeMessage: {
        from: string;
        to: string;
        id: string;
        chatType: 'singleChat' | 'groupChat' | 'chatRoom';
        time: number;
        message: string;
    };
}
declare const NoticeMessage: (props: NoticeMessageProps) => import("react/jsx-runtime").JSX.Element;
export { NoticeMessage };
