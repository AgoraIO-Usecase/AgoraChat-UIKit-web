import { useContext } from 'react';
import { RootContext } from '../store/rootContext';
import { getUsersInfo } from '../utils';
import { runInAction } from 'mobx';
const pageSize = 20;
let pageNum = 1;
const useChatroomMember = (chatroomId: string) => {
  const rootStore = useContext(RootContext).rootStore;
  const { client } = rootStore;
  let next = true;
  const getChatroomMembers = () => {
    client
      .listChatRoomMembers({
        chatRoomId: chatroomId,
        pageSize,
        pageNum: pageNum,
      })
      .then(res => {
        if ((res.data?.length || 0) < pageSize) {
          next = false;
        } else {
          next = true;
          pageNum++;
        }
        const members =
          res.data?.map(item => {
            // @ts-ignore
            return item.member || item.owner;
          }) || [];
        const appUserInfo = rootStore.addressStore.appUsersInfo;
        const getInfoMembers = members.filter(user => {
          return !(user in appUserInfo);
        });
        rootStore.addressStore.setChatroomMemberIds(chatroomId, members);
        rootStore.addressStore.updateChatroomMemberCount(chatroomId, res.count);

        if (getInfoMembers.length > 0) {
          getUsersInfo({ userIdList: getInfoMembers, withPresence: false }).catch(err => {
            console.warn('get getUsersInfo failed', err);
          });
        }
      })
      .catch(err => {
        console.warn('get member list failed', err);
      });
  };

  return { getChatroomMembers, next };
};

const clearPageNum = () => {
  pageNum = 1;
};
export { useChatroomMember, clearPageNum };
