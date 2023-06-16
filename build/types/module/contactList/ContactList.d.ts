import React, { FC } from 'react';
export interface ContactListProps {
    className?: string;
    prefix?: string;
    data?: {
        group?: Array<{
            groupId: string;
            groupName: string;
        }>;
        chatroom?: Array<{
            chatroomId: string;
            chatroomName: string;
        }>;
        contact?: Array<{
            userId: string;
            nickname: string;
        }>;
    };
    onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => boolean;
}
declare let ContactList: FC<ContactListProps>;
export { ContactList };
