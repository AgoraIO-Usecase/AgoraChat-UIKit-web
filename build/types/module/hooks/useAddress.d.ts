import { AgoraChat } from 'agora-chat';
declare const useContacts: () => {
    userId: string;
    nickname: string;
}[];
export interface GroupData {
    groupid: string;
    groupname: string;
}
declare const useUserInfo: (userIds?: string[]) => {
    [key: string]: AgoraChat.UpdateOwnUserInfoParams;
} | undefined;
declare const useGroups: () => GroupData[];
export { useContacts, useGroups, useUserInfo };
