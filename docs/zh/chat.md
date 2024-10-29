# Chat

Chat 组件提供了以下功能:

- 发送和接收消息, 包括文本，表情，图片，语音，视频，文件，名片，合并类型的消息。
- 对消息进行表情回复，引用，撤回，删除，翻译，编辑的操作。
- 清除本地消息。
- 删除会话。
- 拉历史消息。

## 使用示例

```jsx
import React from 'react';
import { Chat } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const ChatContainer = () => {
  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat />
    </div>
  );
};
```

<div align=center> <img src="../image/buble1.png" width = "400" height = "450" /></div>

## 怎样自定义组件

### 修改消息气泡样式

以文本消息为例，你可以按如下方式修改消息气泡样式：

- 使用 `renderMessageList` 方法来自定义渲染消息列表。
- 使用 `renderMessage` 方法来自定义渲染消息。
- 通过使用 `TextMessage` 的 props 来自定义文本消息。

```jsx
import React from 'react';
import { Chat, MessageList, TextMessage } from 'agora-chat-uikit';
import 'agora-chat-uikit/style.css';

const ChatContainer = () => {
  const renderTxtMsg = msg => {
    return (
      <TextMessage
        bubbleStyle={{ background: 'hsl(135.79deg 88.79% 36.46%)' }}
        shape="square"
        status={msg.status}
        avatar={<Avatar style={{ background: 'pink' }}>A</Avatar>}
        textMessage={msg}
      ></TextMessage>
    );
  };

  const renderMessage = msg => {
    if (msg.type === 'txt') {
      return renderTxtMsg(msg);
    }
  };

  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat renderMessageList={() => <MessageList renderMessage={renderMessage} />} />
    </div>
  );
};
```

<div align=center> <img src="../image/buble2.png" width = "400" height = "450" /></div>

### 修改消息日期时间格式

通过消息组件的 formatDateTime 方法来设置显示的格式

```jsx
<Chat
  messageListProps={{
    messageProps: {
      formatDateTime: (time: number) => {
        // 自定义显示日期和时间
        return new Date(time).toLocaleString();
      },
    },
  }}
/>
```

### 设置显示哪些消息的更多操作

通过设置 messageProps 的 customAction 属性设置显示哪些操作按钮

```jsx
<Chat
  messageListProps={{
    messageProps: {
      visible: true,
      icon: null,
      actions: [
        {
          // 展示单条转发
          content: 'FORWARD',
        },
        {
          // 展示消息引用
          content: 'REPLY',
        },
        {
          // 展示消息撤回
          content: 'UNSEND',
        },
        {
          // 展示消息编辑
          content: 'Modify',
        },
        {
          // 展示消息多选
          content: 'SELECT',
        },
        {
          // 展示消息固定
          content: 'PIN',
        },
        {
          // 展示消息翻译
          content: 'TRANSLATE',
        },
        {
          // 展示消息举报
          content: 'REPORT',
        },
        {
          // 展示消息删除
          content: 'DELETE',
        },
        {
          content: '自定义按钮',
          // 自定义icon
          icon: <Icon type="STAR"/>
          onClick: () => {},
        },
      ],
    },
  }}
/>
```

### 在消息输入框中添加一个自定义图标

给消息编辑器添加一个自定义图标来实现指定的功能:

1. 使用 `renderMessageInput` 方法来自定义渲染消息编辑器。
2. 使用 `actions` 来自定义 `MessageInput` 组件。

```jsx
import React from 'react';
import { Chat, Icon, MessageInput } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const ChatContainer = () => {
  // Add an icon to the message input
  const CustomIcon = {
    visible: true,
    name: 'CUSTOM',
    icon: (
      <Icon
        type="DOC"
        onClick={() => {
          console.log('click custom icon');
        }}
      ></Icon>
    ),
  };

  const actions = [...MessageInput.defaultActions];
  // Insert a custom icon after textarea
  actions.splice(2, 0, CustomIcon);
  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat renderMessageInput={() => <MessageInput actions={actions} />} />
    </div>
  );
};
```

<div align=center> <img src="../image/editor2.png" width = "400" height = "450" /></div>

### 怎样实现发送自定义消息

1. 使用 `messageStore` 中提供的 `sendMessage` 方法来发送自定义消息。
2. 使用 `renderMessage` 来渲染自定义消息。

**提示：**

为了保证消息展示在当前会话中，消息中的 `to` 字段必须是对方的 userID，或者群组的 ID。

```jsx
import React from 'react';
import { Chat, MessageList, TextMessage, rootStore, MessageInput, Icon } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const ChatContainer = () => {
  // Display custom messages
  const renderCustomMsg = msg => {
    return (
      <div>
        <h1>Business Card </h1>
        <div>{msg.customExts.id}</div>
      </div>
    );
  };
  const renderMessage = msg => {
    if (msg.type === 'custom') {
      return renderCustomMsg(msg);
    }
  };

  // Add an icon to the message editor
  const CustomIcon = {
    visible: true,
    name: 'CUSTOM',
    icon: (
      <Icon
        type="DOC"
        onClick={() => {
          sendCustomMessage();
        }}
      ></Icon>
    ),
  };
  const actions = [...MessageInput.defaultActions];
  actions.splice(2, 0, CustomIcon);

  // Implement the sending of a custom message
  const sendCustomMessage = () => {
    const customMsg = ChatSDK.message.create({
      type: 'custom',
      to: 'targetId', // The user ID of the peer user for one-to-one chat or the current group ID for group chat.
      chatType: 'singleChat',
      customEvent: 'CARD',
      customExts: {
        id: 'userId3',
      },
    });
    rootStore.messageStore.sendMessage(customMsg).then(() => {
      console.log('send success');
    });
  };
  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat
        renderMessageList={() => <MessageList renderMessage={renderMessage} />}
        renderMessageInput={() => <MessageInput actions={actions} />}
      />
    </div>
  );
};
```

<div align=center> <img src="../image/custom-msg.png" width = "400" height = "450" /></div>

### 配置输入框功能

```jsx
import React from 'react';
import { Chat, Icon, MessageInput } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const ChatContainer = () => {
  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat
        renderMessageInput={() => (
          <MessageInput
            actions={[
              {
                // 发送语音功能
                name: 'RECORDER',
                visible: true,
              },
              {
                // 消息输入框
                name: 'TEXTAREA',
                visible: true,
              },
              {
                // 表情
                name: 'EMOJI',
                visible: true,
              },
              {
                // 更多操作
                name: 'MORE',
                visible: true,
              },
            ]}
            enabledTyping={true} // 是否启用正在输入功能
            showSendButton={true} // 是否展示发送按钮
            sendButtonIcon={<Icon type="AIR_PLANE" />} // 发送按钮 Icon
            row={1} // Input 行数
            placeHolder="请输入内容" // 默认占位符
            enabledMention={true} // 是否开启@功能
            onSendMessage={message => {}} //发送消息的回调
            onBeforeSendMessage={message => {}} // 消息发送前回调，这个回调返回promise，如果返回的promise resolve了，就发送消息，如果reject了，就不发送消息
          />
        )}
      />
    </div>
  );
};
```

### 修改主题

`Chat` 组件提供了以下与聊天页面主题相关的变量，关于怎样修改主题请查看 [Github URL](https://github.com/easemob/Easemob-UIKit-web/blob/dev/docs/theme.md)。

```scss
$chat-bg: $component-background;
$msg-base-font-size: $font-size-lg;
$msg-base-color: $font-color;
$msg-base-margin: $margin-xs 0;
$msg-base-padding: 0 $padding-lg;
$msg-bubble-border-radius-left: 12px 16px 16px 4px;
$msg-bubble-border-radius-right: 16px 12px 4px 16px;
$msg-bubble-arrow-border-size: 6px;
$msg-bubble-arrow-bottom: 8px;
$msg-bubble-arrow-left: -11px;
$msg-bubble-arrow-right: -11px;
$msg-bubble-color-secondly: $blue-95;
$msg-bubble-color-primary: $blue-5;
$msg-bubble-font-color-secondly: $font-color;
$msg-bubble-font-color-primary: $gray-98;
$msg-base-content-margin: 0 $margin-xs 0 $margin-sm;
$msg-base-content-padding: $padding-xs $padding-sm;
$msg-base-content-minheight: 24px;
$msg-bubble-none-bg: transparent;
$msg-bubble-none-color: $font-color;
$msg-bubble-square-border-radius: 4px;
$msg-info-margin-left: $margin-sm;
$msg-nickname-font-size: $font-size-sm;
$msg-nickname-font-weight: 500;
$msg-nickname-font-color: #5270ad;
$msg-nickname-height: 16px;
$msg-time-font-size: $font-size-sm;
$msg-time-font-weight: 400;
$msg-time-font-color: $gray-7;
$msg-time-height: 16px;
$msg-time-margin: 0 $margin-xss;
$msg-time-width: 106px;
```

## Chat props 总览

<table>
<tr>
        <td>参数</td>
        <td>类型</td>
        <td>描述</td>
    </tr>
 <tr>
      <td style=font-size:10px>
	className
	  </td>
      <td style=font-size:10px>
	String
	  </td>
	  <td style=font-size:10px>
	  组件的类名
	  </td>
	  <tr>
	    <td style=font-size:10px>prefix</td>
        <td style=font-size:10px>String</td>
		<td style=font-size:10px>CSS 类名前缀</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>headerProps</td>
        <td style=font-size:10px>HeaderProps</td>
		<td style=font-size:10px>Header 组件的参数</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>messageListProps</td>
        <td style=font-size:10px>MsgListProps</td>
		<td style=font-size:10px>MessageList 组件的参数</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>messageInputProps</td>
        <td style=font-size:10px> MessageInputProps</td>
		<td style=font-size:10px>MessageInput 组件的参数</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderHeader</td>
        <td style=font-size:10px>(cvs: CurrentCvs) => React.ReactNode</td>
		<td style=font-size:10px>自定义渲染 Header 组件的方法</td>  
	  </tr>
	   <tr>
	    <td style=font-size:10px>renderMessageList</td>
        <td style=font-size:10px>() => ReactNode; </td>
		<td style=font-size:10px>自定义渲染 MessageList 组件的方法</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderMessageInput </td>
         <td style=font-size:10px>() => ReactNode; </td>
		<td style=font-size:10px>自定义渲染 MessageInput 组件的方法</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderEmpty</td>
        <td style=font-size:10px>() => ReactNode; </td>
		<td style=font-size:10px>自定义渲染空内容组件的方法</td>  
	  </tr>
   </tr>
</table>
