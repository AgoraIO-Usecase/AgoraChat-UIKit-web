// 开发用demo
import React, { useEffect, useState, FC } from 'react';
import ReactDOM from 'react-dom/client';
import { TextMessage } from '../../../module/textMessage';
import List from '../../../component/list';
import Header from '../../../module/header';
import { ContactItem, ContactList, ContactDetail } from '../../../module/contactList';
import GroupDetail from '../../../module/groupDetail';
import { Search } from '../../../component/input/Search';
import Chat from '../../../module/chat';
import Icon from '../../../component/icon';
import AC from 'agora-chat';
import { RootProvider } from '../../../module/store/rootContext';
import rootStore from '../../../module/store/index';
import { ConversationList, ConversationItem } from '../../../module/conversation';
// import Provider from '../../../module/store/Provider';
import { Provider, UIKitProvider } from '../../../index';
import { useClient } from '../../../module/hooks/useClient';
import Button from '../../../component/button';
import Avatar from '../../../component/avatar';
import { MessageList } from '../../../module/chat/MessageList';
import Thread from '../../../module/thread';
import PinnedMessage from '../../../module/pinnedMessage';
import './index.css';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useConversationContext, useChatContext } from '../../../module';
import UserSelect from '../../../module/userSelect';
import { usePinnedMessage } from '../../../module/hooks/usePinnedMessage';

// 调试用
window.rootStore = rootStore;

// get url query params
const getQueryParams = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return {
    userId: params.get('userId'),
    password: params.get('password'),
    appKey: params.get('appKey'),
  };
};

const PinnedMessageComp = observer(() => {
  const { visible } = usePinnedMessage();
  return (
    visible && (
      <div
        style={{
          width: '350px',
          borderLeft: '1px solid #eee',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <PinnedMessage />
      </div>
    )
  );
});

const ChatApp: FC<any> = () => {
  const client = useClient();

  const {
    topConversation: topConversationInner,
    currentConversation,
    conversationList,
    setCurrentConversation,
  } = useConversationContext();
  const { messages } = useChatContext();
  console.log(11111, messages);
  const topConversation = () => {
    setCurrentConversation({
      chatType: 'groupChat',
      conversationId: '226377652568065',
      name: 'zd2',
      unreadCount: 0,
    });
    console.log(222, currentConversation);
    console.log('222', rootStore.conversationStore.currentCvs);
    topConversationInner({
      chatType: 'groupChat',
      conversationId: '226377652568065',
      lastMessage: {},
    });
  };

  const thread = rootStore.threadStore;

  const TxtMsg = msg => (
    <TextMessage
      bubbleType="secondly"
      bubbleStyle={{ background: 'hsl(135.79deg 88.79% 36.46%)' }}
      shape="square"
      arrow={false}
      avatar={<Avatar style={{ background: 'pink' }}>zd</Avatar>}
      textMessage={{
        msg: msg.msg || 'hello',
        type: 'txt',
        id: '1234',
        to: 'zd5',
        from: 'zd2',
        chatType: 'singleChat',
        time: Date.now(),
        status: 'read',
        bySelf: true,
      }}
    ></TextMessage>
  );

  const MsgList = <MessageList renderMessage={msg => TxtMsg(msg)}></MessageList>;

  const [tab, setTab] = useState('chat');
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  useEffect(() => {
    rootStore.addressStore.setAppUserInfo({
      ...rootStore.addressStore.appUsersInfo,
      lxm: {
        userId: 'lxm',
        nickname: '自定义名称',
        avatarurl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/cat-512.png',
      },
    });
  }, [rootStore.addressStore.contacts.length]);

  useEffect(() => {}, [thread.showThreadPanel]);

  const getRTCToken = data => {
    const { channel, chatUserId } = data;
    const agoraUId = '935243573';
    const url = `https://a41.chat.agora.io/token/rtc/channel/${channel}/agorauid/${agoraUId}?userAccount=${chatUserId}`;
    return axios
      .get(url)
      .then(function (response) {
        console.log('getRtctoken', response);
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClickCvs = (cvs: any) => {
    return () => {
      rootStore.conversationStore.setCurrentCvs({
        chatType: cvs.chatType,
        conversationId: cvs.conversationId,
        name: cvs.name,
        unreadCount: 0,
      });
    };
  };

  const [contactData, setContactData] = useState({ id: '', name: '', type: 'contact' });
  const currentCvs = rootStore.conversationStore.currentCvs;
  // create group
  const [userSelectVisible, setUserSelectVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [groupSettingVisible, setGroupSettingVisible] = useState(false);
  const [cvsItem, setCvsItem] = useState([]);
  const showGroupSetting = () => {
    setGroupSettingVisible(value => !value);
    console.log('showGroupSetting');
  };
  return (
    <>
      <div className="tab-box">
        <div
          className="tab-btn"
          onClick={() => {
            changeTab('chat');
          }}
        >
          chat
        </div>
        <div
          className="tab-btn"
          onClick={() => {
            changeTab('contact');
          }}
        >
          contact
        </div>
      </div>
      <div
        style={{
          width: '350px',
          background: '#fff',
        }}
      >
        {tab == 'chat' && (
          <ConversationList
            presence={true}
            showSearchList={false}
            onSearch={value => {
              rootStore.conversationStore.setSearchList([
                {
                  conversationId: 'zd1',
                  chatType: 'singleChat',
                },
              ]);
              return false;
            }}
            renderHeader={() => (
              <Header
                moreAction={{
                  visible: true,
                  icon: <Icon type="PLUS_IN_CIRCLE"></Icon>,
                  actions: [
                    {
                      content: 'Create Group',
                      icon: <Icon type="PLUS_IN_CIRCLE"></Icon>,
                      onClick: () => {
                        console.log('create group');
                        setUserSelectVisible(true);
                      },
                    },
                  ],
                }}
              ></Header>
            )}
            // onItemClick={item => {
            //   console.log('cvsItem', item);
            //   setCvsItem(item);
            // }}
            // itemProps={{
            //   moreAction: {
            //     visible: true,
            //     actions: [{ content: 'DELETE' }, { content: 'TOP' }],
            //   },
            //   formatDateTime: (time: number) => {
            //     return new Date(time).toLocaleString();
            //   },
            //   renderMessageContent: (msg: any) => {
            //     console.log('msg', msg);
            //     return null;
            //   },
            // }}
            // className="conversation"
            // renderItem={csv => (
            //   <ConversationItem
            //     onClick={handleClickCvs(csv)}
            //     key={csv.conversationId}
            //     data={csv}
            //     // isActive
            //   />
            // )}
          ></ConversationList>
        )}

        {tab == 'contact' && (
          <ContactList
            className="conversation"
            menu={[
              'contacts',
              'groups',
              'requests',
              {
                title: 'Block list',
                data: [
                  {
                    remark: '张4',
                    userId: 'zd1',
                  },
                  {
                    groupname: '群1',
                    groupid: '12',
                  },
                ],
              },
            ]}
            onItemClick={data => {
              console.log('data', data);
              setContactData(data);
            }}
          ></ContactList>
        )}
      </div>
      <div
        style={{
          width: '65%',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            borderLeft: '1px solid transparent',
            overflow: 'hidden',
          }}
        >
          {tab == 'chat' && (
            <>
              <Chat
                messageListProps={{
                  // renderUserProfile: a => {
                  //   return null;
                  // },
                  messageProps: {
                    formatDateTime: (time: number) => {
                      return new Date(time).toLocaleString();
                    },
                  },
                }}
                messageInputProps={{
                  enabledTyping: true,
                }}
                headerProps={{
                  moreAction: {
                    visible: false,
                    actions: [{ content: '' }],
                  },
                  suffixIcon: [
                    'THREAD',
                    'AUDIO',
                    <Button key="11" type="text" shape="circle">
                      {' '}
                      <Icon type="PIN" width={24} height={24}></Icon>
                    </Button>,
                  ],
                  // suffixIcon: (
                  //   <div>
                  //     {currentCvs.chatType !== 'singleChat' && (
                  //       <Icon type="PIN" onClick={show}></Icon>
                  //     )}
                  //     <Icon type="ELLIPSIS" onClick={showGroupSetting}></Icon>
                  //   </div>
                  // ),
                }}
                rtcConfig={{
                  getRTCToken: getRTCToken,
                  getIdMap: () => {},
                }}
                // renderRepliedMessage={message => {
                //   return <div>replied message {message.from}</div>;
                // }}
              ></Chat>
              {groupSettingVisible && (
                <div style={{ width: '350px', borderLeft: '1px solid green' }}>
                  <GroupDetail
                    conversation={{ chatType: 'groupChat', conversationId: cvsItem.conversationId }}
                  ></GroupDetail>
                </div>
              )}
            </>
          )}
          {tab == 'contact' && (
            <ContactDetail
              data={contactData}
              onMessageBtnClick={() => {
                setTab('chat');
              }}
            ></ContactDetail>
          )}
        </div>
        {thread.showThreadPanel && (
          <div
            style={{
              width: '50%',
              borderLeft: '1px solid #eee',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <Thread></Thread>
          </div>
        )}
        <PinnedMessageComp />

        {/* <div style={{ width: '350px', borderLeft: '1px solid green' }}>
          <ContactInfo
            conversation={{ chatType: 'groupChat', conversationId: contactData.id }}
          ></ContactInfo>
        </div> */}
      </div>
      {/* <div>
        <Button onClick={getUrlPreviewInfo}>getUrlPreviewInfo</Button>
        <Button onClick={topConversation}>top 2808</Button>
        <br />
      </div> */}
      <UserSelect
        onCancel={() => {
          setUserSelectVisible(false);
        }}
        onOk={() => {
          rootStore.addressStore.createGroup(selectedUsers.map(user => user.userId));
          setUserSelectVisible(false);
        }}
        enableMultipleSelection
        onUserSelect={(user, users) => {
          setSelectedUsers(users);
        }}
        open={userSelectVisible}
        okText="创建"
      ></UserSelect>
    </>
  );
};

const App = ChatApp;

const { appKey, userId, password } = getQueryParams();
console.log('query-params', appKey, userId, password);
ReactDOM.createRoot(document.getElementById('chatRoot') as Element).render(
  <div
    className="container"
    style={{
      display: 'flex',
      position: 'absolute',
      width: '90%',
      height: '90%',
      left: '5%',
      top: '3%',
    }}
  >
    <Provider
      initConfig={{
        appKey: appKey || 'easemob#easeim',
        userId: userId || 'sttest',
        password: password || '123',
        useUserInfo: true,
        maxMessages: 100,
      }}
      theme={{
        primaryColor: 50, //'#33ffaa',
        mode: 'light',
        bubbleShape: 'round',
        avatarShape: 'circle',
        componentsShape: 'round',
        ripple: true,
      }}
      local={{
        fallbackLng: 'en',
        lng: 'zh',
        // resources: {
        //   en: {
        //     translation: {
        //       'module.conversationTitle': 'Conversation List 22',
        //       'module.deleteCvs': 'Delete Conversation 22',
        //     },
        //   },
        // },
      }}
      features={{
        conversationList: {
          search: true,
          item: {
            moreAction: true,
            deleteConversation: true,
            presence: true,
          },
        },
        chat: {
          header: {
            threadList: true,
            moreAction: true,
            clearMessage: true,
            deleteConversation: true,
            audioCall: true,
            pinMessage: true,
          },
          message: {
            status: true,
            reaction: true,
            thread: true,
            recall: true,
            translate: true,
            edit: true,
            report: true,
            forward: false,
            pin: true,
          },
          messageInput: {
            mention: true,
            typing: true,
            record: true,
            emoji: true,
            moreAction: true,
            picture: true,
            video: true,
            contactCard: true,
          },
        },
      }}
    >
      <App></App>
    </Provider>
  </div>,
);
