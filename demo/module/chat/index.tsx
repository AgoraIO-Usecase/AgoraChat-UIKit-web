import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import TextMessage from '../../../module/textMessage';

import List from '../../../component/list';
import Header from '../../../module/header';
import { ContactItem, ContactList } from '../../../module/contactList';
import { Search } from '../../../component/input/Search';
import Chat from '../../../module/chat';
import Icon from '../../../component/icon';
import AC from 'agora-chat';
import { RootProvider } from '../../../module/store/rootContext';
import rootStore from '../../../module/store/index';
import { ConversationList, ConversationItem } from '../../../module/conversation';
import Provider from '../../../module/store/Provider';
import { useClient } from '../../../module/hooks/useClient';
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';
import Button from '../../../component/button';
import Avatar from '../../../component/avatar';
import { MessageList } from '../../../module/chat/MessageList';
import Thread from '../../../module/thread';
import './index.css';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useConversationContext, useChatContext } from '../../../module';
import { hexToHsla, generateColors } from '../../../module/utils/color';

console.log('hexToHsla', hexToHsla('#FF0000'));
console.log('hexToHsla', hexToHsla('#000000'));
console.log('hexToHsla', hexToHsla('#ffffff'));
console.log('hexToHsla 1', generateColors(hexToHsla('#FF0000')));
// import {
// 	Chat,
// 	rootStore,
// 	ConversationList,
// 	Provider,
// 	useClient,
// } from 'chatuim2';
// import 'chatuim2/style.css';
window.rootStore = rootStore;
const ChatApp = () => {
  const client = useClient();
  // useEffect(() => {
  //   client &&
  //     client
  //       .open({
  //         user: 'zd3',
  //         // pwd: '272808',
  //         accessToken:
  //           'YWMtgwTHNZPxQviWaqMIJTHfFyhYwv00w0hrtpGKy_Jc3V2J3LcwYk0R7J9BM4gepb6yAwMAAAGLCXYIsQABTnFcluGlL4BdlKN4Qdf0EQThNgjgWh4vB9JhWxj-X18Ucg==',
  //       })
  //       .then(res => {
  //         console.log('获取token成功', res, rootStore.client);
  //       });
  // }, [client]);

  const getUrlPreviewInfo = () => {
    getLinkPreview(
      'https://api-ref.agora.io/en/chat-sdk/ios/1.x/interface_agora_chat_client.html#a3e0c211f850af4dfe61c0581f3b7aea7',
    )
      .then(data => console.log(123, data))
      .catch(e => {
        console.log(22, e);
      });
  };
  // console.log('rootStore', rootStore.conversationStore.currentCvs);

  let {
    topConversation: topConversationInner,
    currentConversation,
    conversationList,
    setCurrentConversation,
  } = useConversationContext();

  let { messages } = useChatContext();
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

  let TxtMsg = msg => (
    <TextMessage
      bubbleType="secondly"
      bubbleStyle={{ background: 'hsl(135.79deg 88.79% 36.46%)' }}
      shape="square"
      arrow={false}
      avatar={<Avatar style={{ background: 'pink' }}>zhangdong</Avatar>}
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

  let MsgList = <MessageList renderMessage={msg => TxtMsg(msg)}></MessageList>;

  const [tab, setTab] = useState('chat');
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  useEffect(() => {
    console.log('变化了 showThreadPanel');
  }, [thread.showThreadPanel]);

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
          width: '35%',
          background: '#fff',
        }}
      >
        {tab == 'chat' && (
          <ConversationList
            itemProps={{
              moreAction: {
                visible: true,
                actions: [{ content: 'DELETE' }],
              },
            }}
            // className="conversation"
            renderItem={csv => (
              <ConversationItem
                onClick={handleClickCvs(csv)}
                key={csv.conversationId}
                data={csv}
                // isActive
              />
            )}
          ></ConversationList>
        )}

        {tab == 'contact' && <ContactList className="conversation"></ContactList>}
      </div>
      <div
        style={{
          width: '65%',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <div style={{ flex: 1, borderLeft: '1px solid transparent', overflow: 'hidden' }}>
          <Chat
            messageListProps={{
              renderUserProfile: () => {
                return null;
              },
            }}
            messageEditorProps={{
              enabledTyping: true,
            }}
            rtcConfig={{
              getRTCToken: getRTCToken,
              getIdMap: () => {},
            }}
          ></Chat>
        </div>
        {thread.showThreadPanel ||&& (
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
      </div>
      <div>
        <Button onClick={getUrlPreviewInfo}>getUrlPreviewInfo</Button>
        <Button onClick={topConversation}>top 2808</Button>
        <br />
      </div>
    </>
  );
};

const App = ChatApp;

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
      onError={err => {
        console.log('回调出的err', err);
      }}
      initConfig={{
        appKey: '41117440#383391',
        userId: 'zd2',
        token:
          '007eJxTYKhK5DrUfCJsxuXbqrIZcaEfP+WbnpW58YHRbbL8FSkNvxkKDGmGKcnm5hZJKSnJZiZmiSkWaUZmBpbmZsmJRikGhqbJ+yWCUxsCGRn2tZobMzKwMjACIYivwpBkYGaSmGJmoGtmZJKka2iYmqxrkWpopGuaZGRikWRgapGWZAkAVa4mwg==',
        // appKey: 'easemob#easeim',
      }}
      theme={{
        // primaryColor: '#33ffaa',
        mode: 'dark',
      }}
      local={{
        fallbackLng: 'en',
        lng: 'en',
        // resources: {
        //   en: {
        //     translation: {
        //       'module.conversationTitle': 'Conversation List 22',
        //       'module.deleteCvs': 'Delete Conversation 22',
        //     },
        //   },
        // },
      }}
      // features={{
      //   conversationList: {
      //     search: true,
      //     item: {
      //       moreAction: false,
      //       deleteConversation: false,
      //     },
      //   },
      //   chat: {
      //     header: {
      //       threadList: true,
      //       moreAction: true,
      //       clearMessage: true,
      //       deleteConversation: false,
      //       audioCall: false,
      //     },
      //     message: {
      //       status: false,
      //       reaction: false,
      //       thread: true,
      //       recall: true,
      //       translate: false,
      //       edit: false,
      //     },
      //     messageEditor: {
      //       mention: false,
      //       typing: false,
      //       record: true,
      //       emoji: true,
      //       moreAction: true,
      //       picture: true,
      //     },
      //   },
      // }}
    >
      <App></App>
    </Provider>
  </div>,
);
