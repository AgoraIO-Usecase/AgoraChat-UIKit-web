import React, {
  FC,
  useEffect,
  useState,
  useRef,
  useContext,
  memo,
  useMemo,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useSize } from 'ahooks';
import { ConfigContext } from '../../component/config/index';
import './style/style.scss';
import List from '../../component/list';
import ScrollList from '../../component/scrollList';
import { useGroupMembers, useGroupAdmins } from '../hooks/useAddress';
import TextMessage from '../textMessage';
import AudioMessage from '../audioMessage';
import FileMessage from '../fileMessage';
import ImageMessage, { ImagePreview } from '../imageMessage';
import VideoMessage from '../videoMessage';
import { RootContext } from '../store/rootContext';
import AC, { AgoraChat } from 'agora-chat';
import { cloneElement } from '../../component/_utils/reactNode';
import { useHistoryMessages } from '../hooks/useHistoryMsg';
import type { RecallMessage } from '../store/MessageStore';
import RecalledMessage from '../recalledMessage';
import CombinedMessage from '../combinedMessage';
import { renderUserProfileProps } from '../baseMessage';
import { CurrentConversation } from '../store/ConversationStore';
import NoticeMessage from '../noticeMessage';
import { BaseMessageProps } from '../baseMessage';
import { useTranslation } from 'react-i18next';
import Icon from '../../component/icon';
export interface MsgListProps {
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  isThread?: boolean;
  renderMessage?: (message: AgoraChat.MessageBody | RecallMessage) => ReactNode;
  renderUserProfile?: (props: renderUserProfileProps) => React.ReactNode;
  conversation?: CurrentConversation;
  messageProps?: BaseMessageProps;
}

const MessageScrollList = ScrollList<AgoraChat.MessageBody | RecallMessage>();

let MessageList: FC<MsgListProps> = props => {
  const rootStore = useContext(RootContext).rootStore;
  const { messageStore } = rootStore;

  const {
    prefix: customizePrefixCls,
    className,
    renderMessage,
    renderUserProfile,
    conversation,
    isThread,
    messageProps,
    style = {},
  } = props;
  const { t } = useTranslation();
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('messageList', customizePrefixCls);
  const classString = classNames(prefixCls, className);

  const msgContainerRef = useRef<HTMLDivElement>(null);

  const currentCVS = conversation ? conversation : messageStore.currentCVS || {};

  const { loadMore, isLoading } = useHistoryMessages(currentCVS);

  let messageData = messageStore.message[currentCVS.chatType]?.[currentCVS.conversationId] || [];

  const renderMsg = (data: { index: number; style: React.CSSProperties }) => {
    if (renderMessage) {
      const element = renderMessage(messageData[data.index]);
      cloneElement(element, oriProps => ({
        style: {
          ...data.style,
          ...oriProps.style,
        },
      }));
      return element;
    }
    if (messageData[data.index].type == 'audio') {
      return (
        <AudioMessage
          key={messageData[data.index].id}
          //@ts-ignore
          audioMessage={messageData[data.index] as AgoraChat.AudioMsgBody}
          style={data.style}
          renderUserProfile={renderUserProfile}
          thread={isThread}
          {...messageProps}
        ></AudioMessage>
      );
    } else if (messageData[data.index].type == 'img') {
      return (
        <ImageMessage
          key={messageData[data.index].id}
          //@ts-ignore
          imageMessage={messageData[data.index]}
          style={data.style}
          renderUserProfile={renderUserProfile}
          thread={isThread}
          {...messageProps}
        ></ImageMessage>
      );
    } else if (messageData[data.index].type == 'file') {
      return (
        <FileMessage
          key={messageData[data.index].id}
          //@ts-ignore
          fileMessage={messageData[data.index]}
          style={data.style}
          renderUserProfile={renderUserProfile}
          thread={isThread}
          {...messageProps}
        ></FileMessage>
      );
    } else if (messageData[data.index].type == 'recall') {
      return (
        <NoticeMessage noticeMessage={messageData[data.index] as RecallMessage}></NoticeMessage>
      );
    } else if (messageData[data.index].type == 'txt') {
      return (
        <TextMessage
          key={messageData[data.index].id}
          style={data.style}
          //@ts-ignore
          status={messageData[data.index].status}
          //@ts-ignore
          textMessage={messageData[data.index]}
          renderUserProfile={renderUserProfile}
          thread={isThread}
          {...messageProps}
        >
          {(messageData[data.index] as AgoraChat.TextMsgBody).msg}
        </TextMessage>
      );
    } else if (messageData[data.index].type == 'combine') {
      return (
        <CombinedMessage
          key={messageData[data.index].id}
          style={data.style}
          //@ts-ignore
          status={messageData[data.index].status}
          //@ts-ignore
          combinedMessage={messageData[data.index]}
          renderUserProfile={renderUserProfile}
          thread={isThread}
          {...messageProps}
        ></CombinedMessage>
      );
    } else if (messageData[data.index].type == 'video' || messageData[data.index].type == 'loc') {
      return (
        <RecalledMessage
          key={messageData[data.index].id}
          style={data.style}
          //@ts-ignore
          status={messageData[data.index].status}
          //@ts-ignore
          message={messageData[data.index]}
        >
          {(messageData[data.index] as AgoraChat.TextMsgBody).msg}
        </RecalledMessage>
      );
    }
  };

  let lastMsgId = messageData[messageData.length - 1]?.id || '';
  // 每次发消息滚动到最新的一条
  const listRef = React.useRef<List>(null);
  useEffect(() => {
    if (messageStore.holding) return;
    setTimeout(() => {
      (listRef?.current as any)?.scrollTo('bottom');
    }, 10);
  }, [lastMsgId]);

  useEffect(() => {
    if (!isThread) {
      (listRef?.current as any)?.scrollTo('bottom');
      if (currentCVS && currentCVS.chatType === 'groupChat') {
        if (!currentCVS.conversationId) return;
        const { getGroupMemberList } = useGroupMembers(currentCVS.conversationId);
        const { getGroupAdmins } = useGroupAdmins(currentCVS.conversationId);
        getGroupAdmins();
        getGroupMemberList?.();
      }
    }
  }, [currentCVS]);

  // const showUnreadCount = messageStore.unreadMessageCount[currentCVS.chatType]?.[
  //   currentCVS.conversationId
  // ]?.unreadCount;
  const handleScroll = (event: Event) => {
    let scrollHeight = (event.target as HTMLElement)?.scrollHeight;
    //滚动高度
    let scrollTop = (event.target as HTMLElement).scrollTop;
    //列表内容实际高度
    let offsetHeight = (event.target as HTMLElement).offsetHeight;
    // 滚动到顶加载更多
    let offsetBottom = scrollHeight - (scrollTop + offsetHeight);
    // scroll to bottom load data
    console.log(scrollTop, offsetHeight, offsetBottom);
    if (offsetBottom > 10) {
      !messageStore.holding && messageStore.setHoldingStatus(true);
    } else {
      messageStore.holding && messageStore.setHoldingStatus(false);
      messageStore.setUnreadMessageCount(0);
    }
  };

  const scrollToBottom = () => {
    (listRef?.current as any)?.scrollTo('bottom');
  };
  return (
    <div className={classString} style={{ ...style }} ref={msgContainerRef} id="listContainer">
      <MessageScrollList
        ref={listRef}
        hasMore={true}
        data={messageData}
        loading={isLoading}
        loadMoreItems={loadMore}
        onScroll={handleScroll}
        renderItem={(itemData, index) => {
          return (
            <div key={itemData.id} className={`${classString}-msgItem`}>
              {renderMsg({ index, style: {} })}
            </div>
          );
        }}
      ></MessageScrollList>
      {messageStore.unreadMessageCount > 0 && (
        <div className={`cui-unread-message-count`} onClick={scrollToBottom}>
          <Icon type="ARROW_DOWN_THICK" width={20} height={20}></Icon>
          {messageStore.unreadMessageCount > 99 ? '99+' : messageStore.unreadMessageCount}{' '}
          {t('newMessage')}
        </div>
      )}
    </div>
  );
};

MessageList = observer(MessageList);
export { MessageList };
