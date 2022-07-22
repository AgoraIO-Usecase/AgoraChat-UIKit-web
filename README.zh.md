# Agora Chat UIKit Web 使用指南

_English | [中文](README.zh.md)_

## 简介

agora-chat-uikit 是基于声网 IM SDK 的一款 UI 组件库，提供通用的 UI 组件，如“会话列表”和“聊天界面”，开发者可根据实际业务需求利用该库快速搭建自定义 IM 应用。agora-chat-uikit 中的组件在实现 UI 功能的同时，调用 IM SDK 相应的接口实现 IM 相关逻辑和数据的处理，因而开发者使用该库时只需关注自身业务或个性化扩展。

`agora-chat-uikit` 目前有 2 个模块组件：

`EaseApp` 可快速集成聊天使用场景的一种组件方案、包含列表。

`EaseChat` 仅有一个对话框的功能组件。它适用于绝大多数场景，例如收发消息、消息上屏、消息已读未读等，这些通用的场景已全部封装为一个通用组件。

默认情况下，agora-chat-uikit 库提供以下功能：

- 自动布局会话框高度及宽度；
- 传入必选参数内部实现自动登录；
- 实现收发消息、消息上屏、消息未读数、消息类型（文本、图片、文件、表情、音频、视频消息）；
- 会话搜索；
- 通过属性参数进行可视化定制。

Agora 在 GitHub 上提供一个开源的 AgoraChat-UIKit-web 项目，你可以克隆和运行该项目或参考其中的逻辑创建项目集成 agora-chat-uikit。

- [Agora Chat UIKit Web 源代码 URL](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web)
- [利用 agora-chat-uikit 的声网 IM 应用的 URL](https://github.com/AgoraIO-Usecase/AgoraChat-web)

## 前提条件

开启 Agora Chat 服务前，请确保已经具备以下要素：

- React 16.8.0 或以上版本；
- React DOM 16.8.0 或以上版本；
- 有效的 Agora Chat 开发者账号；
- Agora Chat 项目和 App Key(//to do：加链接)。

## 支持的浏览器

| 浏览器    | 支持的版本 |
| --------- | ---------- |
| IE 浏览器 | 11 或以上  |
| Edge      | 43 或以上  |
| Firefox   | 10 或以上  |
| Chrome    | 54 或以上  |
| Safari    | 11 或以上  |

## 操作步骤

### 1.创建 chat-uikit 项目

```bash
# 安装 CLI 工具。
npm install create-react-app
# 构建一个 my-app 的项目。
npx create-react-app my-app
cd my-app
```

```
项目目录：
├── package.json
├── public                  # Webpack 的静态目录。
│   ├── favicon.ico
│   ├── index.html          # 默认的单页面应用。
│   └── manifest.json
├── src
│   ├── App.css             # App 根组件的 CSS。
│   ├── App.js              # App 组件代码。
│   ├── App.test.js
│   ├── index.css           # 启动文件样式。
│   ├── index.js            # 启动文件。
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```

### 2.集成 agora-chat-uikit

#### 安装 agora-chat-uikit

- 通过 npm 安装，运行以下命令：

```bash
npm install agora-chat-uikit --save
```

- 通过 yarn 安装，运行以下命令：

```bash
yarn add agora-chat-uikit
```

#### 添加 EaseApp 组件

将 agora-chat-uikit 库导入你的代码中：

```javascript
// App.js
import React, {Component} from 'react';
import { EaseApp } from "agora-chat-uikit"
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
         <EaseApp
              appkey="xxx",     // 你注册的 App Key。
              username="xxx",  // 当前登录的用户 ID。
              agoraToken="xxx"  // 声网 token。关于如何获取声网 token 下文有介绍。
            />
      </div>
    );
  }
}

export default App;
```

#### 设定聊天界面的尺寸

```css
/** App.css */
.container {
  height: 100%;
  width: 100%;
}
```

#### 运行项目并发送你的第一条消息

在默认 App Key 情况下，我们默认支持几种类型的消息下发，方便快速体验。点击选中一个成员后，输入你的第一条消息并发送。

**注意**
使用自定义 App Key 时，由于没有联系人，需先[添加好友](https://docs-preprod.agora.io/cn/agora-chat/agora_chat_relationship_web?platform=Web#申请添加好友)或[加入群组](https://docs-preprod.agora.io/cn/agora-chat/agora_chat_group_web?platform=Web#用户申请入群与退出群组)。

```bash
npm run start
```

在浏览器可看到你的应用。

## 使用 EaseApp 属性自定义功能

EaseApp 提供一些属性用于支持自定义 UIKit 的工作方式。你可以自主选择功能和布局，为保证 EaseApp 的组件正常使用，请务必填写必选的属性参数。

```javascript
import { EaseApp } from "agora-chat-uikit";
const header = () => {
  return <div>My custom header</div>;
};
const app = () => {
  return (
    <EaseApp
      appkey={"xxxx"}
      username={"xx"}
      agoraToken={"xxxxxx"}
      header={header} // 自定义 header。
    />
  );
};
```

### EaseApp 属性列表

| 属性                    | 类型                    | 是否必需 | 描述                                                                                                                                                                                             |
| :---------------------- | :---------------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| appkey                  | String                  | 必需     | 你在控制台注册的 APP 唯一标识，规则是 ${org_name}#${app_name}。                                                                                                                                  |
| username                | String                  | 必需     | 用户 ID。                                                                                                                                                                                        |
| agoraToken              | String                  | 必需     | 声网 token。                                                                                                                                                                                     |
| header                  | ReactNode               | 非必需   | 头部标题栏。                                                                                                                                                                                     |
| isShowUnread            | Boolean                 | 非必需   | 未读消息是否展示。<br/> - （默认）`true`：是；<br/> - `false`：否。                                                                                                                              |
| unreadType              | Boolean                 | 非必需   | 未读消息展示类型: <br/> - （默认）`true`：展示未读消息数量；<br/> - `false`：展示未读消息红点。                                                                                                  |
| onConversationClick     | function({ item, key }) | 非必需   | 当前点击的联系人。                                                                                                                                                                               |
| showByselfAvatar        | Boolean                 | 非必需   | 是否展示自己聊天头像。<br/> - `true`：是；<br/> - （默认）`false`：否。                                                                                                                          |
| easeInputMenu           | String                  | 非必需   | 输入区模式：<br/> - （默认）all：完整模式；<br/> - noAudio：不可用语音模式；<br/> - noEmoji：不可用表情模式；<br/> - noAudioAndEmoji：不可用语音和表情模式；<br/> - onlyText：只有文本输入模式。 |
| menuList                | Array                   | 非必需   | menuList:[ {name:'发送图片'，value:'img},{name:'发送文件'，value:'file}]                                                                                                                         | 输入框右侧功能扩展。 |
| handleMenuItem          | function({ item, key }) | 非必需   | 输入框右侧功能扩展点击回调事件。                                                                                                                                                                 |
| successLoginCallback    | function(res)           | 非必需   | 登录成功回调。                                                                                                                                                                                   |
| failLoginCallback       | function(err)           | 非必需   | 失败回调（包含登录以及 sdk 所有失败事件）。                                                                                                                                                      |
| onChatAvatarClick       | Function                | 非必需   | 点击回话顶部头像的回调。                                                                                                                                                                         |
| isShowReaction          | Boolean                 | 非必需   | 是否展示 reaction 功能。                                                                                                                                                                         |
| customMessageList       | Array                   | 非必需   | 操作消息菜单选项。                                                                                                                                                                               |
| deleteSessionAndMessage | Function                | 非必需   | 删除会话和会话里的消息的方法。                                                                                                                                                                   |
| customMessageClick      | Function                | 非必需   | 点击自定义消息菜单选项的回调。                                                                                                                                                                   |
| onEditThreadPanel       | Function                | 非必需   | 点击编辑子区的回调。                                                                                                                                                                             |
| onOpenThreadPanel       | Function                | 非必需   | 点击打开子区的回调。                                                                                                                                                                             |
| isShowRTC               | Boolean                 | 非必需   | 是否使用 RTC 功能。                                                                                                                                                                              |
| agoraUid                | String                  | 非必需   | 使用 RTC 时，需要用到的 agora uid。                                                                                                                                                              |
| appId                   | String                  | 非必需   | 使用 RTC 时，需要的 appId。                                                                                                                                                                      |
| getRTCToken             | Function                | 非必需   | 使用 RTC 时，需要的获取声网 token 的函数。                                                                                                                                                       |
| getIdMap                | Function                | 非必需   | 使用 RTC 时，需要的获取 userId 和 用户名映射的函数。                                                                                                                                             |

### 高级定制功能

某些场景下你可能需要在各种消息回调中嵌入自身的业务逻辑，`agora-chat-uikit` 对此提供如下解决方案：

#### 获取声网 IM SDK 实例

```javascript
const WebIM = EaseApp.getSdk({ appkey: "xxxx" });
// 注意：登录成功时无需填写 App Key。
```

#### 注册监听 SDK 事件回调

```javascript
  WebIM.conn.addEventHandler('nameSpace'),{
      onOpend:()=>{},
      onTextMessage:()=>{},
      .... })
```

[详细的 SDK 回调](https://docs-preprod.agora.io/cn/agora-chat/agora_chat_message_web?platform=Web#接收文本消息)

#### 新增会话

```javascript
const conversationItem = {
  conversationType: "singleChat", // 会话类型：'singleChat' 为单聊， :'groupChat' 为群聊。
  conversationId: "TOM", //会话 ID：单聊时为用户 ID，群聊时为群组 ID。
};
EaseApp.addConversationItem(conversationItem);
```

#### 注意事项

使用 EaseApp 组件时，理论上不需要用户自主实现登录功能，只需传入以上 3 个必填参数内部即可自动登录。但在某些场景下，如果不需要在 UIKit 内部自动登录，可调用 EaseApp.getSdk() 获取声网 IM SDK 对象，自主调用 SDK 实现登录功能。

```javascript
// 手动登录。
WebIM.conn.open({
  user: "xxxx",
  agoraToken: "xxxx",
  appKey: "xxxx",
});
```

## 使用 EaseChat 属性自定义功能

同样，为保证 EaseChat 的组件正常使用，请务必填写必选的属性参数。
EaseChat 作为一个单独的会话框组件，实用性较为广泛，可快速实现绝大数场景。

例如，通过一个点击事件弹出指定会话框，并在登录成功后自定义监听：

```javascript
import React, { useState } from "react";
import { EaseChat } from "agora-chat-uikit";
  const addListen = (res) => {
    if(res.isLogin){
        const WebIM = EaseChat.getSdk()
        WebIM.conn.addEventHandler('testListen',{
          onTextMessage:()=>{},
          onError:()=>{},
          ...
        })
     }
  }
  const chat = () => {
    return (
    <div>
      <EaseChat
        appkey={'xxx'}
        username={'xxx'}
        agoraToken={'xxx'}
        to={'xxx'}

        successLoginCallback={addListener}
      />
     <div/>
    )
  }
  const app = () =>{
  const [showSession, setShowSession] = useState(false);
  return(
  <div>
    { showSession && chat()}
    <button onClick={()=>setShowSession(true)}>打开会话</button>
    <button onClick={()=>setShowSession(false)}>关闭会话</button>
  <div/>
  )
  }
```

#### EaseChat 属性列表

| 属性描述               | 类型                  | 是否必需 | 描述                                                                                                                                                                                        |
| ---------------------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appkey`               | String                | 必需     | 你在控制台的 APP 的唯一标识。                                                                                                                                                               |
| `username`             | String                | 必需     | 用户 ID。                                                                                                                                                                                   |
| `agoraToken`           | String                | 必需     | 声网 token。                                                                                                                                                                                |
| `chatType`             | String                | 必需     | 会话类型。<br/> - `singleChat` ：单聊；<br/> - `groupChat` ：群聊。                                                                                                                         |
| `to`                   | String                | 必需     | 接收消息的人或者群组。单聊：接收方用户 ID；群聊：接收方群组 ID。                                                                                                                            |
| `showByselfAvatar`     | Bool                  | 非必需   | 是否展示自己聊天头像。<br/> - `true` ：是；<br/> - （默认）`false` ：否。                                                                                                                   |
| `easeInputMenu`        | String                | 非必需   | 输入区模式：<br/> - （默认）all：完整模式；<br/>- noAudio：禁用语音模式；<br/> - noEmoji：禁用表情模式；<br/> - noAudioAndEmoji：禁用语音和表情模式；<br/> - onlyText：只开启文本输入模式。 |
| `menuList`             | Array                 | 非必需   | 输入框右侧功能扩展：<br/> （默认） menuList:[ {name:'发送图片'，value:'img},{name:'发送文件'，value:'file}]                                                                                 |
| `handleMenuItem`       | function({item, key}) | 非必需   | 输入框右侧功能扩展点击回调事件。                                                                                                                                                            |
| `successLoginCallback` | function(res)         | 非必需   | 登录成功回调。                                                                                                                                                                              |
| `failCallback          | function(err)`        | 非必需   | 失败回调（包含登录以及 SDK 所有失败事件）。                                                                                                                                                 |

### 高级定制

`EaseChat` 和 `EaseApp` 均支持高级定制的使用，使用方法相似。

#### 获取声网 IM SDK 实例

```javascript
const WebIM = EaseChat.getSdk({ appkey: "xxxx" });
// 注意：登录成功时可不传。
```

#### 注册监听 SDK 事件回调

```javascript
WebIM.conn.addEventHandler("handlerName", {
  onConnected: () => {},
  onTextMessage: () => {},
  //....
});
```

#### 注意事项

- EaseChat 在填入必选参数后内部会自动登录，无需用户实现登录。如需要在外部实现主动登录请参考上文主动登录的用法。
- `handlerName` 为自定义监听器名称。结合自身业务需求可同时存在多个事件监听器。

#### 关于样式

关于样式，我们提供 UIKit 源码确保最大限度定制你的风格。源码地址：https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web

## 社区贡献者

如果你认为可将一些功能添加到 EaseChat 中让更多用户受益，请随时 Fork 存储库并添加拉取请求。如果你在使用上有任何问题，也请在存储库上提交。感谢你的贡献！

## 参考文档

- [Agora Chat SDK 产品概述](https://docs-preprod.agora.io/en/agora-chat/agora_chat_overview?platform=Web)
- [Agora Chat SDK API 参考](https://docs-preprod.agora.io/en/agora-chat/API%20Reference/im_ts/index.html?transId=4dbea540-f2cd-11ec-bafe-3fe630a7aac4)

## 相关资源

- 你可以先参阅 [常见问题](https://docs.agora.io/cn/faq)
- 如果你想了解更多官方示例，可以参考 [官方 SDK 示例](https://github.com/AgoraIO)
- 如果你想了解声网 SDK 在复杂场景下的应用，可以参考 [官方场景案例](https://github.com/AgoraIO-usecase)
- 如果你想了解声网的一些社区开发者维护的项目，可以查看 [社区](https://github.com/AgoraIO-Community)
- 若遇到问题需要开发者帮助，你可以到 [开发者社区](https://rtcdeveloper.com/) 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单

## 代码许可

示例项目遵守 MIT 许可证。
