import React, { useState, ReactNode, useRef, useContext, MouseEventHandler } from 'react';
import classNames from 'classnames';
import './style/style.scss';
import { ConfigContext } from '../../../component/config/index';
import { Tooltip } from '../../../component/tooltip/Tooltip';
import Icon from '../../../component/icon';
import { chatSDK, ChatSDK } from '../../SDK';
import { RootContext } from '../../store/rootContext';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CurrentConversation } from '../../store/ConversationStore';
export interface MoreActionProps {
  style?: React.CSSProperties;
  itemContainerStyle?: React.CSSProperties;
  prefix?: string;
  icon?: ReactNode;
  customActions?: Array<{
    content: string;
    onClick?: () => void;
    icon?: ReactNode;
  }>;
  conversation?: CurrentConversation;
  isChatThread?: boolean;
  onBeforeSendMessage?: (message: ChatSDK.MessageBody) => Promise<CurrentConversation | void>;
}
let MoreAction = (props: MoreActionProps) => {
  const {
    icon,
    customActions,
    prefix: customizePrefixCls,
    conversation,
    isChatThread,
    onBeforeSendMessage,
    style = {},
    itemContainerStyle = {},
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('moreAction', customizePrefixCls);
  const classString = classNames(prefixCls);
  const imageEl = useRef<HTMLInputElement>(null);
  const fileEl = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const context = useContext(RootContext);
  const { rootStore, theme } = context;
  const themeMode = theme?.mode || 'light';
  const { client, messageStore } = rootStore;
  const iconNode = icon ? (
    icon
  ) : (
    <span className="icon-container" style={{ ...style }} title={t('more') as string}>
      <Icon
        type="PLUS_CIRCLE"
        width={20}
        height={20}
        // onClick={handleClickIcon}
      ></Icon>
    </span>
  );

  const sendImage = () => {
    imageEl.current?.focus();
    imageEl.current?.click();
  };

  const sendFile = () => {
    fileEl.current?.focus();
    fileEl.current?.click();
  };

  const defaultActions = [
    {
      content: 'image',
      title: t('image'),
      onClick: sendImage,
      icon: null,
    },
    { content: 'file', title: t('file'), onClick: sendFile, icon: null },
  ];
  let actions = [];
  if (customActions) {
    actions = customActions;
  } else {
    actions = defaultActions;
  }

  const menu = (
    <ul className={classString} style={{ ...itemContainerStyle }}>
      {actions.map((item, index) => {
        if (item.content == 'IMAGE') {
          return (
            <li
              className={themeMode == 'dark' ? 'cui-li-dark' : ''}
              onClick={() => {
                setMenuOpen(false);
                sendImage();
              }}
              key={item.content || index}
            >
              {t('image')}
            </li>
          );
        } else if (item.content == 'FILE') {
          return (
            <li
              className={themeMode == 'dark' ? 'cui-li-dark' : ''}
              onClick={() => {
                setMenuOpen(false);
                sendFile();
              }}
              key={item.content || index}
            >
              {t('file')}
            </li>
          );
        }
        return (
          <li
            className={themeMode == 'dark' ? 'cui-li-dark' : ''}
            onClick={() => {
              setMenuOpen(false);
              item.onClick && item?.onClick();
            }}
            key={item.content || index}
          >
            {item.content}
          </li>
        );
      })}
    </ul>
  );
  const currentCVS = conversation ? conversation : messageStore.currentCVS;
  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    let file = chatSDK.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    if (!currentCVS.conversationId) {
      console.warn('No specified conversation');
      return;
    }

    const option = {
      type: 'img',
      to: currentCVS.conversationId,
      chatType: currentCVS.chatType,
      file: file,
      isChatThread,
      onFileUploadComplete: data => {
        let sendMsg = messageStore.message.byId[imageMessage.id];
        (sendMsg as any).thumb = data.thumb;
        (sendMsg as any).url = data.url;
        messageStore.modifyMessage(imageMessage.id, sendMsg);
      },
    } as ChatSDK.CreateImgMsgParameters;
    const imageMessage = chatSDK.message.create(option);

    if (onBeforeSendMessage) {
      onBeforeSendMessage(imageMessage).then(cvs => {
        if (cvs) {
          imageMessage.to = cvs.conversationId;
          imageMessage.chatType = cvs.chatType;
        }

        messageStore.sendMessage(imageMessage);
      });
    } else {
      messageStore.sendMessage(imageMessage);
    }
    imageEl!.current!.value = '';
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    let file = chatSDK.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    if (!currentCVS.conversationId) {
      console.warn('No specified conversation');
      return;
    }

    const option = {
      type: 'file',
      to: currentCVS.conversationId,
      chatType: currentCVS.chatType,
      file: file,
      filename: file.filename,
      file_length: file.data.size,
      url: file.url,
      isChatThread,
    } as ChatSDK.CreateFileMsgParameters;
    const fileMessage = chatSDK.message.create(option);

    if (onBeforeSendMessage) {
      onBeforeSendMessage(fileMessage).then(cvs => {
        if (cvs) {
          fileMessage.to = cvs.conversationId;
          fileMessage.chatType = cvs.chatType;
        }

        messageStore.sendMessage(fileMessage);
      });
    } else {
      messageStore.sendMessage(fileMessage);
    }
    fileEl!.current!.value = '';
  };

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Tooltip
        title={menu}
        trigger="click"
        arrowPointAtCenter={false}
        arrow={false}
        open={menuOpen}
        onOpenChange={c => {
          setMenuOpen(c);
        }}
      >
        {iconNode}
      </Tooltip>
      {
        <input
          type="file"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          ref={imageEl}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      }
      {<input ref={fileEl} onChange={handleFileChange} type="file" style={{ display: 'none' }} />}
    </>
  );
};

MoreAction = observer(MoreAction);
export { MoreAction };
