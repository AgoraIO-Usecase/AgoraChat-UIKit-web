# 快速开始

chat-uikit 是基于声网 IM SDK 的一款 React UI 组件库，它提供了一些通用的 UI 组件，“会话模块”和“聊天模块”，开发者可根据实际业务需求通过该组件库快速地搭建自定义 IM 应用。chat-uikit 中的组件在实现 UI 功能的同时，调用 IM SDK 相应的接口实现 IM 相关逻辑和数据的处理，因而开发者在使用 chat-uikit 时只需关注自身业务或个性化扩展即可。

按照以下指南快速开始发送您的第一条消息。

## 前提条件

chat-uikit 的依赖项是：

* React 16.8.0 or higher
* React DOM 16.8.0 or higher

* 有效的 Agora Chat 开发者账号
* 创建 Agora Chat 项目并获取 AppKey   // TODO 增加跳转链接

## 支持的浏览器

| 浏览器   | 支持的版本 |
| -------- | ---------- |
| IE浏览器 | 11 或更高  |
| edge     | 43 或更高  |
| 火狐     | 10 或更高  |
| Chrome   | 54 或更高  |
| Safari   | 11 或更高  |


## 操作步骤

### 1.创建 chat-uikit 项目

```bash
# 安装 cli 工具
npm install create-react-app
# 构建一个my-app的项目
npx create-react-app my-app
cd my-app
```

```
项目目录：
├── package.json
├── public                  # 这个是webpack的配置的静态目录。
│   ├── favicon.ico
│   ├── index.html          # 默认是单页面应用，这个是最终的html的基础模板。
│   └── manifest.json
├── src
│   ├── App.css             # App根组件的 css。
│   ├── App.js              # App组件代码。
│   ├── App.test.js
│   ├── index.css           # 启动文件样式。
│   ├── index.js            # 启动的文件。
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```


### 2.集成 chat-uikit

##### 安装 chat-uikit：

通过npm安装

```bash
npm  install chat-uikit --save
```

使用时`yarn`，输入以下命令

```bash
yarn add chat-uikit
```

##### 添加EaseApp组件

将 chat-uikit 库导入您的代码中

```javascript
// App.js
import React, {Component} from 'react';
import { EaseApp } from "chat-uikit"
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
         <EaseApp
              appkey: "xxx", 		// 你注册的 App Key。
  						username: "xxx",  // 当前登录的用户 ID。
  						agoraToken:"xxx"  // 声网token，关于如何获取声网token下文有介绍。
            /> 
      </div>
    );
  }
}

export default App;
```

##### 指定聊天界面的尺寸

```css
/** App.css */ 
.container {
	height: 100%;
	width: 100%
}
```

##### 运行项目且发送您的第一条消息

您现在可以运行您的应用程序来发送消息。在默认的appkey情况下我们默认会有几种类型的消息进行下发，以便您能快速的体验。点击选中一个成员后，输入您的第一条消息并发送。

<font color='red'>注意：当您使用您自己的appkey时候，由于没有联系人，那么需要您先去添加好友或者加入群组。具体请参考如下文档</font>

TODO：插入添加好友的文档链接地址

```bash
npm run start
```

在浏览器就可以看到你的应用了。

## 参考信息

### 如何获取agoraToken

```javascript
// 发送请求
function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
}

// 从 app server获取token
postData('https://a41.easemob.com/app/chat/user/login', { "userAccount": username, "userPassword": password }).then((res) => {
            let agoraToken = res.accessToken
        })
```

TODO ：详细插入声网token的文档链接

