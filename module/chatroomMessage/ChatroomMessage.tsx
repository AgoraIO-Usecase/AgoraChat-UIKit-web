import React, { useContext, useRef, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../../component/config/index';
import './style/style.scss';
import Avatar from '../../component/avatar';
import rootStore from '../store/index';
import { observer } from 'mobx-react-lite';
import { ChatSDK } from '../SDK';
import { RootContext } from '../store/rootContext';
import Icon from '../../component/icon';
import { Tooltip } from '../../component/tooltip/Tooltip';
import { useTranslation } from 'react-i18next';
import { renderTxt } from '../textMessage/TextMessage';
import { eventHandler } from '../../eventHandler';
import { usePinnedMessage } from '../hooks/usePinnedMessage';
export interface ChatroomMessageProps {
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  message: ChatSDK.MessageBody;
  targetLanguage?: string;
  onReport?: (message: ChatSDK.MessageBody) => void;
}
interface CustomAction {
  visible: boolean;
  icon?: ReactNode;
  actions?: {
    icon?: ReactNode;
    content?: string;
    onClick?: (message: ChatSDK.MessageBody) => void;
  }[];
}
const ChatroomMessage = (props: ChatroomMessageProps) => {
  const { prefix: customizePrefixCls, className, style, message, targetLanguage, onReport } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('message-chatroom', customizePrefixCls);
  const classString = classNames(prefixCls, className);
  const { t } = useTranslation();
  const [hoverStatus, setHoverStatus] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const context = useContext(RootContext);
  const { theme } = context;
  const themeMode = theme?.mode;
  let customAction;
  let menuNode: ReactNode | undefined;
  let moreAction: CustomAction = { visible: false };
  const { pinMessage, unpinMessage, clearPinnedMessages, getPinnedMessages, list } =
    usePinnedMessage({
      conversation: {
        conversationType: 'chatRoom',
        conversationId: message.to,
      },
    });

  const [textToShow, setTextToShow] = useState((message as ChatSDK.TextMsgBody).msg);

  const chatroomData =
    rootStore.addressStore.chatroom.filter(item => item.id === message.to)[0] || {};
  const muteList = chatroomData.muteList || [];
  const isMuted = muteList.includes(message.from as string);
  const owner = chatroomData.owner || '';

  if (customAction) {
    moreAction = customAction;
  } else {
    moreAction = {
      visible: true,
      icon: null,
      actions: [
        {
          content: 'TRANSLATE',
          onClick: () => {},
        },
        {
          content: 'REPORT',
          onClick: () => {},
        },
      ],
    };
  }
  if (owner === rootStore.client.user) {
    moreAction.actions?.unshift({
      content: 'PIN',
      onClick: () => {},
    });
    message.from != rootStore.client.user &&
      moreAction.actions?.unshift({
        content: 'MUTE',
        onClick: () => {},
      });
  }

  if (message.from == rootStore.client.user) {
    moreAction.actions?.unshift({
      content: 'RECALL',
      onClick: () => {},
    });
  }

  const translateMessage = () => {
    const { msg } = message as ChatSDK.TextMsgBody;
    if (msg !== textToShow) {
      // already translated, display original message
      return setTextToShow(msg);
    }
    // @ts-ignore
    if (message?.translations?.[0]?.text) {
      // already translated, just show
      // @ts-ignore
      return setTextToShow(message?.translations?.[0]?.text);
    }
    rootStore.messageStore
      .translateMessage(
        {
          chatType: 'chatRoom',
          conversationId: message.to,
        },
        // @ts-ignore
        message.mid || message.id,
        targetLanguage || navigator.language,
      )
      ?.then(() => {
        // @ts-ignore
        const translatedMsg = message?.translations?.[0]?.text;
        setTextToShow(translatedMsg);
        // setTransStatus('translated');
        eventHandler.dispatchSuccess('translateMessage');
      })
      .catch(error => {
        eventHandler.dispatchError('translateMessage', error);
        // setTransStatus('translationFailed');
        // setBtnText('retry');
      });
    setIsPopoverOpen(false);
  };
  const recallMessage = () => {
    rootStore.messageStore.recallMessage(
      {
        chatType: 'chatRoom',
        conversationId: message.to,
      },
      // @ts-ignore
      message.mid || message.id,
      false,
      true,
    );
    setIsPopoverOpen(false);
  };
  const muteMember = () => {
    if (isMuted) {
      rootStore.addressStore.unmuteChatRoomMember(message.to, message.from as string);
      return;
    }
    rootStore.addressStore.muteChatRoomMember(message.to, message.from as string);
    setIsPopoverOpen(false);
  };

  const reportMessage = () => {
    onReport?.(message);
    setIsPopoverOpen(false);
  };

  const handlePinMessage = () => {
    list.forEach(item => {
      // @ts-ignore
      unpinMessage(item.message.mid || item.message.id);
    });
    // @ts-ignore
    pinMessage(message.mid || message.id).then(() => {
      rootStore.pinnedMessagesStore.pushPinnedMessage('chatRoom', message.to, {
        operatorId: rootStore.client.user,
        pinTime: Date.now(),
        message,
      });
    });

    // const promiseList = list.map(item => {
    //   // @ts-ignore
    //   return unpinMessage(item.message.mid || item.message.id);
    // });
    // Promise.all(promiseList).then(() => {
    //   // @ts-ignore
    //   pinMessage(message.mid || message.id).then(() => {
    //     rootStore.pinnedMessagesStore.pushPinnedMessage('chatRoom', message.to, {
    //       operatorId: rootStore.client.user,
    //       pinTime: Date.now(),
    //       message,
    //     });
    //   });
    // });

    setIsPopoverOpen(false);
  };

  const morePrefixCls = getPrefixCls('moreAction', customizePrefixCls);
  const moreClassString = classNames(morePrefixCls, {
    [`${morePrefixCls}-${themeMode}`]: !!themeMode,
  });
  // render message menu
  if (moreAction?.visible) {
    menuNode = (
      <ul className={moreClassString}>
        {moreAction?.actions?.map((item, index) => {
          if (item.content === 'RECALL') {
            return (
              <li key={index} onClick={recallMessage}>
                <Icon type="ARROW_BACK" width={16} height={16}></Icon>
                {t('unsend')}
              </li>
            );
          } else if (item.content === 'TRANSLATE') {
            return (
              message?.type === 'txt' && (
                <li key={index} onClick={translateMessage}>
                  <Icon type="TRANSLATION" width={16} height={16}></Icon>
                  {t('translate')}
                </li>
              )
            );
          } else if (item.content === 'MUTE') {
            return (
              <li key={isMuted ? index : -index} onClick={muteMember}>
                <Icon type={isMuted ? 'BELL' : 'BELL_SLASH'} width={16} height={16}></Icon>
                {isMuted ? t('unmute') : t('mute')}
              </li>
            );
          } else if (item.content === 'REPORT') {
            if (message.from == rootStore.client.user) {
              return null;
            }
            return (
              <li key={index} onClick={reportMessage}>
                <Icon type="ENVELOPE" width={16} height={16}></Icon>
                {t('report')}
              </li>
            );
          } else if (item.content === 'PIN') {
            return (
              <li key={index} onClick={handlePinMessage}>
                <Icon type="PIN" width={16} height={16}></Icon>
                {t('Pin')}
              </li>
            );
          }
          return (
            <li
              key={index}
              onClick={() => {
                item.onClick?.(message);
              }}
            >
              {item.icon && item.icon}
              {item.content}
            </li>
          );
        })}
      </ul>
    );
  }

  const renderText = (text: string) => {
    return <div className={`${prefixCls}-text-box`}>{renderTxt(text)}</div>;
  };

  const renderGift = () => {
    if ((message as ChatSDK.CustomMsgBody).customEvent == 'CHATROOMUIKITUSERJOIN') {
      return <div className={`${prefixCls}-notice-box`}>{t('Joined')}</div>;
    }

    if ((message as ChatSDK.CustomMsgBody).customEvent != 'CHATROOMUIKITGIFT') {
      return;
    }
    let giftData = (message as ChatSDK.CustomMsgBody)?.customExts?.chatroom_uikit_gift || {};
    if (typeof giftData === 'string') {
      giftData = JSON.parse(giftData);
    }
    return (
      <div className={`${prefixCls}-gift`}>
        {t('sent')}
        <div>{t(giftData.giftName)}</div>
        <img src={giftData.giftIcon} alt="" className={`${prefixCls}-gift-img`} />
        <div className={`${prefixCls}-gift-number`}>x{giftData.giftCount || 1}</div>
      </div>
    );
  };

  const userInfo = (message as ChatSDK.TextMsgBody)?.ext?.chatroom_uikit_userInfo || {};
  const getTime = (time: number) => {
    const timeSting =
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10
        ? `0${new Date(time).getMinutes()}`
        : new Date(time).getMinutes());
    return timeSting;
  };
  return (
    <div
      className={classString}
      style={{ ...style }}
      onMouseOver={() => setHoverStatus(true)}
      onMouseLeave={() => {
        if (!isPopoverOpen) {
          setHoverStatus(false);
        }
      }}
    >
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-header-label`}>
            {getTime((message as ChatSDK.TextMsgBody).time)}
          </div>
          <Avatar size={20} src={userInfo.avatarURL}>
            {userInfo.nickname || message.from}
          </Avatar>
          <div className={`${prefixCls}-header-nick`}>{userInfo.nickname || message.from}</div>
        </div>
        {message.type == 'custom' && renderGift()}
        {message.type == 'txt' && renderText(textToShow)}
      </div>
      {hoverStatus && message.type == 'txt' && (
        <Tooltip
          title={menuNode}
          trigger="click"
          placement="bottom"
          align={{ offset: [5] }}
          open={isPopoverOpen}
          onOpenChange={open => {
            setIsPopoverOpen(open);
            setHoverStatus(open);
          }}
        >
          <Icon
            type="ELLIPSIS"
            color="var(--cui-primary-color5)"
            className={`${prefixCls}-body-action`}
            height={20}
          ></Icon>
        </Tooltip>
      )}
    </div>
  );
};

const ChatroomMessageOut = observer(ChatroomMessage);
ChatroomMessageOut.displayName = 'ChatroomMessage';
export default ChatroomMessageOut;
