import React, { FC, useState, ReactNode, useContext, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../../component/config/index';
import './style/style.scss';
import Icon from '../../component/icon';
import Avatar from '../../component/avatar';
import Badge from '../../component/badge';
import { getConversationTime } from '../utils/index';
import type { ConversationData } from './ConversationList';
import { RenderFunction, Tooltip } from '../../component/tooltip/Tooltip';
import { RootContext } from '../store/rootContext';
import { useTranslation } from 'react-i18next';
import { renderTxt } from '../textMessage/TextMessage';
import { observer } from 'mobx-react-lite';
import { AT_TYPE } from '../store/ConversationStore';
import { eventHandler } from '../../eventHandler';
import {
  getGroupMemberIndexByUserId,
  getGroupItemFromGroupsById,
  getGroupMemberNickName,
  getMsgSenderNickname,
} from '../utils/index';
import type { BaseMessageType } from '../baseMessage/BaseMessage';
import Ripple from '../../component/ripple/Ripple';
export interface ConversationItemProps {
  className?: string;
  prefix?: string;
  nickname?: string;
  avatarShape?: 'circle' | 'square';
  avatarSize?: number;
  avatar?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  badgeColor?: string; // 未读数气泡颜色
  isActive?: boolean; // 是否被选中
  data: ConversationData[0];
  renderMessageContent?: (msg: BaseMessageType) => ReactNode | undefined;
  ripple?: boolean;
  // 右侧更多按钮配置
  moreAction?: {
    visible?: boolean;
    icon?: ReactNode;
    actions: Array<{
      content: ReactNode;
      onClick?: (cvs: ConversationData[0]) => void | Promise<boolean>;
    }>;
  };
  formatDateTime?: (time: number) => string;
}

let ConversationItem: FC<ConversationItemProps> = props => {
  let {
    prefix: customizePrefixCls,
    className,
    nickname,
    avatarShape = 'circle',
    avatarSize = 50,
    avatar,
    onClick,
    isActive = false,
    data,
    badgeColor,
    moreAction = {
      visible: true,
      actions: [
        {
          content: 'DELETE',
        },
        {
          content: 'PIN',
        },
        {
          content: 'SILENT',
        },
      ],
    },
    formatDateTime,
    renderMessageContent,
    ripple,
    ...others
  } = props;

  const { t } = useTranslation();
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('conversationItem', customizePrefixCls);
  const [showMore, setShowMore] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [active, setActive] = useState(isActive);
  const context = useContext(RootContext);
  const { rootStore, theme } = context;
  const themeMode = theme?.mode || 'light';
  if (theme?.avatarShape) {
    avatarShape = theme?.avatarShape;
  }
  const themeRipple = theme?.ripple;
  const cvsStore = rootStore.conversationStore;

  const classString = classNames(
    prefixCls,
    {
      [`${prefixCls}-selected`]: !!isActive,
      [`${prefixCls}-${themeMode}`]: !!themeMode,
      [`${prefixCls}-sticky`]: data.isPinned,
    },
    className,
  );

  const AtTag = (props: { type?: AT_TYPE }) => {
    const { type = 'NONE' } = props;
    if (type === 'NONE') return <></>;
    return (
      <div className={`${prefixCls}-at-tag`}>{type === 'ALL' ? t('atAllTag') : t('atTag')}</div>
    );
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    rootStore?.conversationStore.setAtType(data.chatType, data.conversationId, 'NONE');
    onClick && onClick(e);
  };

  const handleMouseOver = () => {
    moreAction.visible && setShowMore(true);
  };
  const handleMouseLeave = () => {
    if (!isPopoverOpen) {
      setShowMore(false);
    }
  };

  const deleteCvs: MouseEventHandler<HTMLLIElement> = async e => {
    e.stopPropagation();
    // 如果moreAction里传了onClick则用onClick，否则执行下面的逻辑
    const deleteAction = moreAction.actions.find(item => item.content === 'DELETE');
    if (deleteAction && deleteAction.onClick) {
      const value = await deleteAction.onClick(data);
      if (!value) {
        return;
      }
    }
    cvsStore.deleteConversation(data);

    rootStore.client
      .deleteConversation({
        channel: data.conversationId,
        chatType: data.chatType as 'singleChat' | 'groupChat',
        deleteRoam: true,
      })
      .then(() => {
        eventHandler.dispatchSuccess('deleteConversation');
      })
      .catch(err => {
        eventHandler.dispatchError('deleteConversation', err);
      });
    setIsPopoverOpen(false);
  };

  const pinCvs = () => {
    rootStore?.conversationStore.pinConversation(
      data.chatType,
      data.conversationId,
      !data.isPinned,
    );
    setIsPopoverOpen(false);
  };

  const setSilent = () => {
    if (data.silent) {
      rootStore?.conversationStore.clearRemindTypeForConversation({
        chatType: data.chatType,
        conversationId: data.conversationId,
      });
    } else {
      rootStore?.conversationStore.setSilentModeForConversation({
        chatType: data.chatType,
        conversationId: data.conversationId,
      });
    }
    setIsPopoverOpen(false);
  };

  const morePrefixCls = getPrefixCls('moreAction', customizePrefixCls);

  let menuNode: ReactNode | undefined;

  if (moreAction?.visible) {
    menuNode = (
      <ul className={morePrefixCls}>
        {moreAction.actions.map((item, index) => {
          if (item.content === 'DELETE') {
            return (
              <li
                key={index}
                onClick={deleteCvs}
                className={themeMode == 'dark' ? 'cui-li-dark' : ''}
              >
                <Icon type="DELETE"></Icon>
                {t('deleteCvs')}
              </li>
            );
          } else if (item.content === 'PIN') {
            return (
              <li key={index} onClick={pinCvs} className={themeMode == 'dark' ? 'cui-li-dark' : ''}>
                <Icon type={data.isPinned ? 'ARROW_LINE' : 'LINE_ARROW'}></Icon>
                {data.isPinned ? t('unSticky') : t('sticky')}
              </li>
            );
          } else if (item.content === 'SILENT') {
            return (
              <li
                key={index}
                onClick={setSilent}
                className={themeMode == 'dark' ? 'cui-li-dark' : ''}
              >
                <Icon type={data.silent ? 'BELL_SLASH' : 'BELL'}></Icon>
                {data.silent ? t('unmuteNotification') : t('muteNotification')}
              </li>
            );
          }
          return (
            <li
              className={themeMode == 'dark' ? 'cui-li-dark' : ''}
              key={index}
              onClick={() => {
                item.onClick?.(data);
              }}
            >
              {item.content}
            </li>
          );
        })}
      </ul>
    );
  }

  let lastMsg: ReactNode | ReactNode[] = '';

  switch (data.lastMessage?.type) {
    case 'txt':
      if (data.lastMessage?.msg == 'the combine message') {
        lastMsg = `/${t('chatHistory')}/`;
      } else {
        lastMsg = renderTxt(data.lastMessage?.msg, false);
      }
      break;
    case 'img':
      lastMsg = `[${t('image')}]`;
      break;
    case 'audio':
      lastMsg = `[${t('audio')}]`;
      break;
    case 'file':
      lastMsg = `[${t('file')}]`;
      break;
    case 'video':
      lastMsg = `[${t('video')}]`;
      break;
    case 'custom':
      if (data.lastMessage.customEvent == 'userCard') {
        lastMsg = `[${t('contact')}]`;
      } else {
        lastMsg = `[${t('custom')}]`;
      }
      break;
    // @ts-ignore
    case 'combine':
      lastMsg = `[${t('chatHistory')}]`;
      break;
    // @ts-ignore
    case 'recall':
      lastMsg = t('unsentAMessage') as string;
      break;
    default:
      console.warn('unexpected message type:', data.lastMessage?.type);
      break;
  }
  lastMsg = renderMessageContent?.(data.lastMessage as BaseMessageType) ?? lastMsg;
  if (data.chatType == 'groupChat') {
    const msgFrom = data.lastMessage?.from || '';
    let from = msgFrom && msgFrom !== rootStore.client.context.userId ? `${msgFrom}: ` : '';
    const groupItem = getGroupItemFromGroupsById(data.conversationId);
    if (groupItem) {
      const memberIdx = getGroupMemberIndexByUserId(groupItem, msgFrom) ?? -1;
      // @ts-ignore
      const ease_chat_uikit_user_info = data.lastMessage?.ext?.ease_chat_uikit_user_info;
      if (ease_chat_uikit_user_info && ease_chat_uikit_user_info.nickname) {
        from = `${ease_chat_uikit_user_info.nickname}: `;
      } else if (memberIdx > -1) {
        const memberItem = groupItem?.members?.[memberIdx] || ({} as any);
        from = `${getGroupMemberNickName(memberItem)}: `;
      }
    }
    if (Array.isArray(lastMsg)) {
      lastMsg = [from, ...Array.from(lastMsg)];
    } else {
      lastMsg = [from, lastMsg];
    }
  }
  const rippleProp = ripple === undefined ? themeRipple : ripple;
  return (
    <div
      className={classString}
      onClick={handleClick}
      style={others.style}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {avatar ? (
        avatar
      ) : (
        // 在会话列表不显示在线状态 isOnline={data.isOnline}
        <Avatar src={data.avatarUrl} size={avatarSize} shape={avatarShape}>
          {data.name || data.conversationId}
        </Avatar>
      )}

      <div className={`${prefixCls}-content`}>
        <span className={`${prefixCls}-nickname ${data.silent ? 'has-silent' : ''}`}>
          {data.name || data.conversationId}
          {data.silent && (
            <Icon type="BELL_SLASH" className={`${prefixCls}-nickname-silent`}></Icon>
          )}
        </span>
        <span className={`${prefixCls}-message`}>
          {<AtTag type={data?.atType} />}
          {lastMsg}
        </span>
      </div>
      <div className={`${prefixCls}-info`}>
        <span className={`${prefixCls}-time`}>
          {formatDateTime?.(data.lastMessage?.time) || getConversationTime(data.lastMessage?.time)}
        </span>
        {showMore ? (
          <Tooltip
            title={menuNode}
            trigger="click"
            placement="bottomRight"
            open={isPopoverOpen}
            onOpenChange={value => {
              setIsPopoverOpen(value);
              setShowMore(value);
            }}
          >
            {moreAction.icon || (
              <Icon
                type="ELLIPSIS"
                color={
                  themeMode === 'dark' ? 'var(--cui-primary-color6)' : 'var(--cui-primary-color5)'
                }
                height={20}
                width={20}
                style={{ cursor: 'pointer', zIndex: 10 }}
              ></Icon>
            )}
          </Tooltip>
        ) : (
          <div
            style={{
              height: '20px',
              position: 'relative',
            }}
          >
            <Badge
              dot={data.silent}
              count={data.unreadCount || 0}
              color={
                badgeColor || themeMode === 'dark'
                  ? 'var(--cui-primary-color6)'
                  : 'var(--cui-primary-color5)'
              }
            ></Badge>
          </div>
        )}
      </div>
      {rippleProp && <Ripple></Ripple>}
    </div>
  );
};

ConversationItem = observer(ConversationItem);
export { ConversationItem };
