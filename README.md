# Get Started with Agora Chat UIKit for Web

_English | [中文](README.zh.md)_

## Overview

agora-chat-uikit is a React UI component library built on top of Agora Chat SDK. It provides a set of general UI components, a conversation module, and a chat module that enable developers to easily craft a chat app to suit actual business needs. Also, this library calls APIs in Agora Chat SDK to implement related chat logics and data processing, allowing developers to only focus on their own business and personalized extensions.

The Web Chat UIKit has two components:

- `EaseApp`, which contains the conversation list and applies to use cases where you want to quickly launch a real-time chat app.

- `EaseChat`, which contains a conversation box and applies to most chat use cases such as sending and receiving messages, displaying the message on the UI, and managing unread messages.

The Web Chat UIKit, by default, provides the following functions:

- Automatic layout of the conversation box with the adaptive width and height;
- Automatic login by passing required parameters;
- Sending and receiving messages, displaying messages on the screen, and displaying the number of unread messages. The text messages, image messages, file messages, emoji messages, voice messages, and video messages are supported;
- Conversation retrieval;
- Visual customization via attribute settings.

Agora provides an open-source Web Chat UIKit project for Agora Chat. You can clone or run the project or create a project to integrate the Web Chat UIKit by reference to the open-source project.

Source code URL of Agora Chat UIKit for Web:

- https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web

URL of Agora Chat app using Agora Chat UIKit for Web:

- https://github.com/AgoraIO-Usecase/AgoraChat-web

## Prerequisites

In order to follow the procedure in this page, you must have:

- React 16.8.0 or later
- React DOM 16.8.0 or later
- A valid [Agora account](https://docs.agora.io/cn/AgoraPlatform/sign_in_and_sign_up).
- A valid [Agora project](https://docs.agora.io/cn/AgoraPlatform/sign_in_and_sign_up) with an App Key.

## Compatible browsers

| Browser | Supported Version |
| ------- | ----------------- |
| IE      | 11 or later       |
| Edge    | 43 or later       |
| Firefox | 10 or later       |
| Chrome  | 54 or later       |
| Safari  | 11 or later       |

## Project setup

### 1. Create a Web Chat UIKit project

```bash
# Install a CLI tool.
npm install create-react-app
# Create an my-app project.
npx create-react-app my-app
cd my-app
```

```
The project directory.

├── package.json
├── public # The static directory of Webpack.
│ ├── favicon.ico
│ ├── index.html # The default single-page app.
│ └── manifest.json
├── src
│ ├── App.css # The CSS of the app's root component.
│ ├── App.js # The app component code.
│ ├── App.test.js
│ ├── index.css # The style of the startup file.
│ ├── index.js # The startup file.
│ ├── logo.svg
│ └── serviceWorker.js
└── yarn.lock
```

### 2. Integrate the Web Chat UIKit

#### Install the Web Chat UIKit

- To install the Web Chat UIKit with npm, run the following command:

```bash
npm install agora-chat-uikit --save
```

- To Install Agora chat UIKit for Web with Yarn, run the following command:

```bash
yarn add agora-chat-uikit
```

#### Add the EaseApp component

Import agora-chat-uikit into your code.

```jsx
// App.js
import React, {Component} from 'react';
import { EaseApp } from "agora-chat-uikit"
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
         <EaseApp
            appkey="xxx",     // Your registered App Key.
            username="xxx",  // The user ID of the current user.
            agoraToken="xxx"  // The Agora token. For how to obtain an Agora token, see descriptions in the Reference.
            />
      </div>
    );
  }
}

export default App;
```

#### Set the chat page size

```css
/** App.css */
.container {
  height: 100%;
  width: 100%;
}
```

#### Run the project and send your first message

Now, you can run your app to send messages. In this example, you can use the default App Key, but need to register your own App Key in the formal development environment. When the default App Key is used, a user will receive a one-to-one chat message and a group chat message upon the first login and can type the first message in a type of conversation and send it.

**Note**

If a custom App Key is used, no contact is available by default and you need to first [add contacts](https://docs-preprod.agora.io/en/agora-chat/agora_chat_contact_web?platform=Web#Send a contact invitation) or [join a group](https://docs-preprod.agora.io/en/agora-chat/agora_chat_group_web?platform=Web#Create and destroy a chat group).

```bash
npm run start
```

Now, you can see your app in the browser.

## EaseApp attributes

EaseApp provides a list of attributes for customization. You can customize the features and layout by setting these attributes. To ensure the functionality of EaseApp, ensure that you set all the required parameters.

```jsx
import { EaseApp } from "agora-chat-uikit";
const header = () => {
  return <div>Hello Word</div>;
};
const app = () => {
  return (
    <EaseApp
      appkey={"xxx"}
      username={"xxx"}
      agoraToken={"xxx"}
      header={header} // Custom header.
    />
  );
};
```

### Attribute list of EaseApp

| Attribute               | Type                    | Required | Description                                                                                                                                                                                               |
| :---------------------- | :---------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appkey`                | String                  | Yes      | The unique identifier that the Chat service assigns to each app. The rule is `You can't use 'macro parameter character #' in math mode `${org_name}#$`{app_name}`.                                        |
| `username`              | String                  | Yes      | The user ID.                                                                                                                                                                                              |
| `agoraToken`            | String                  | Yes      | The Agora token.                                                                                                                                                                                          |
| header                  | ReactNode               | No       | The title bar above the conversation list.                                                                                                                                                                |
| isShowUnread            | Boolean                 | No       | Whether to show the number of unread messages: <br/> - (Default)`true`: Yes. <br/> - `false`: No.                                                                                                         |
| unreadType              | Boolean                 | No       | The display style of unread messages: <br/> - (Default)`true`: Displays the number of unread messages; - `false`: Displays a red dot.                                                                     |
| onConversationClick     | function({ item, key }) | No       | The callback for clicking a contact on the conversation list.                                                                                                                                             |
| `showByselfAvatar`      | Bool                    | No       | Whether to display the avatar of the current user: <br/> - (Default)`true`: Yes.<br/> - `false`: No.                                                                                                      |
| `easeInputMenu`         | String                  | No       | The mode of the input menu.<br/> - (Default) `all`: The complete mode.<br/> - `noAudio`: No audio.<br/> - `noEmoji`: No emoji.<br/> - `noAudioAndEmoji`: No audio or emoji.<br/> - `onlyText`: Only text. |
| `menuList`              | Array                   | No       | menuList:[ {name:'Send a pic'，value:'img},{name:'Send a file'，value:'file}]                                                                                                                             |
| `handleMenuItem`        | function({item, key})   | No       | The callback event triggered by clicking on the right panel of the input box.                                                                                                                             |
| `successLoginCallback`  | function(res)           | No       | The callback event for a successful login.                                                                                                                                                                |
| `failCallback`          | function(err)           | No       | The callback event for a failed method call.                                                                                                                                                              |
| onChatAvatarClick       | Function                | No       | The callback for clicking the avatar on the top of the conversation.                                                                                                                                      |
| isShowReaction          | Boolean                 | No       | Whether to show the Reaction function.                                                                                                                                                                    |
| customMessageList       | Array                   | No       | Custom shortcut menu items for messages.                                                                                                                                                                  |
| deleteSessionAndMessage | Function                | No       | The method for deleting a conversation and its messages.                                                                                                                                                  |
| customMessageClick      | Function                | No       | The callback for clicking a custom shortcut menu item for messages.                                                                                                                                       |
| onEditThreadPanel       | Function                | No       | The callback for editing a thread.                                                                                                                                                                        |
| onOpenThreadPanel       | Function                | No       | The callback for opening a thread.                                                                                                                                                                        |
| isShowRTC               | Boolean                 | No       | Whether to use the RTC function.                                                                                                                                                                          |
| agoraUid                | String                  | No       | Agora UID required to use RTC.                                                                                                                                                                            |
| appId                   | String                  | No       | The App ID required to use RTC.                                                                                                                                                                           |
| getRTCToken             | Function                | No       | The method for getting the Agora token to use RTC.                                                                                                                                                        |
| getIdMap                | Function                | No       | The method for getting the mapping between the Agora Chat user ID and the user ID you expect to display on the Web UI, when RTC is used.                                                                  |

### Advanced customization features

You may need to embed your business logic in various message callbacks in certain scenarios. For this purpose, the Web Chat UIKit provides the following solution.

#### Get the Agora Chat SDK

```javascript
const WebIM = EaseApp.getSdk({ appkey: "xxx" });
// Note: The App Key is not required if you log in to the chat app successfully.
```

#### Add an event listener

```javascript
  WebIM.conn.addEventHandler('handlerName'),{
    onConnected:()=>{},
    onTextMessage:()=>{},
    // ....
  })
```

[SDK callbacks](https://docs-preprod.agora.io/en/agora-chat/agora_chat_send_receive_message_web?platform=Web#receive-a-message)

#### Create a conversation

```javascript
const conversationItem = {
  conversationType: "singleChat", // The conversation type. 'singleChat': one-to-one chat. 'groupChat': group chat.
  conversationId: "TOM", //The conversation ID. One-to-one chat: the user ID of the message recipient. group chat: The group ID.
};
EaseApp.addConversationItem(conversationItem);
```

#### Notes

With the EaseApp component, the user, in theory, only needs to pass the above three required parameters for automatic login, instead of implementing the login function. However, in some scenarios, if you do not need implement login inside UIKit, you can call EaseApp.getSdk() to get the Agora Chat SDK object and call the SDK to implement the login function.

```javascript
// Manual login.
WebIM.conn.open({
  user: "xxxx",
  agoraToken: "xxxx",
  appKey: "xxxx",
});
```

## EaseChat attributes

Likewise, to ensure the normal operation of EaseChat, you must fill in the required attribute parameters. As an independent conversation component, EaseChat is widely available and can easily implement most scenarios.

For example, pop up a specific dialog box upon a click event and customize the listener after a successful login:

```jsx
import React, { useState } from "react";
import { EaseChat } from "agora-chat-uikit";
  const addListener = (res) => {
    if(res.isLogin){
        const WebIM = EaseChat.getSdk()
        WebIM.conn.addEventHandler('testListen',{
          onTextMessage:()=>{},
          onError:()=>{},
          // ...
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

#### Attribute list of EaseChat

| Attribute              | Type                  | Required | Description                                                                                                                                                                                               |
| :--------------------- | :-------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appkey`               | String                | Yes      | The unique identifier that the Chat service assigns to each app.                                                                                                                                          |
| `username`             | String                | Yes      | The user ID.                                                                                                                                                                                              |
| `agoraToken`           | String                | Yes      | The Agora token.                                                                                                                                                                                          |
| `chatType`             | String                | Yes      | The chat type: <br/> - `singleChat`: one-to-one chat. <br/> - `groupChat`: group chat.                                                                                                                    |
| `to`                   | String                | Yes      | The message recipient or the group: <br/> - one-to-one chat: The user ID of the message recipient. <br/> - group chat: The group ID.                                                                      |
| `showByselfAvatar`     | Bool                  | No       | Whether to display the avatar of the current user.<br/> - (Default) `true`: Yes. <br/> - `false`: No.                                                                                                     |
| `easeInputMenu`        | String                | No       | The mode of the input menu.<br/> - (Default) `all`: The complete mode.<br/> - `noAudio`: No audio.<br/> - `noEmoji`: No emoji.<br/> - `noAudioAndEmoji`: No audio or emoji.<br/> - `onlyText`: Only text. |
| `menuList`             | Array                 | No       | The extensions of the input box on the right panel. <br/> - (Default) menuList:[ {name:'Send a pic'，value:'img},{name:'Send a file'，value:'file}]                                                       |
| `handleMenuItem`       | function({item, key}) | No       | The callback event triggered by clicking on the right panel of the input box.                                                                                                                             |
| `successLoginCallback` | function(res)         | No       | The callback event for a successful login.                                                                                                                                                                |
| `failCallback`         | function(err)         | No       | The callback event for a failed method call (including a failed login and all failure events of the SDK).                                                                                                 |

### Advanced Customizations

Both `EaseChat` and `EaseApp` support advanced customizations.

#### Get the Agora Chat SDK

```javascript
const WebIM = EaseChat.getSdk({ appkey: "xxx" });
// The App Key is not required when you successfully log in to the Chat app.
```

#### Add the event handler

```javascript
WebIM.conn.addEventHandler("handlerName", {
  onConnected: () => {},
  onTextMessage: () => {},
  // ...
});
```

#### Notes

- EaseChat implements automatic login after you fill in required parameters, saving you the trouble of login. If you need to implement manual login outside EaseChat, follow the steps above mentioned.

- `handlerName` indicates the custom event handler. You can add multiple event handlers to satisfy your business requirements.

#### About the UI Styles

For the UI styles, we provide the [source code of Web Chat UIKit] (https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web) to satisfy your customization requirements to the maximum extent possible.

## Community Contribution

If you want to add extra functions to EaseChat to share with others, you can fork our repository on GitHub and create a pull request. For any questions, you can also create a pull request. Thank you for your contributions.

## Feedback

If you have any problems or suggestions regarding the sample projects, feel free to file an issue.

## Reference

- [Agora Chat SDK Product Overview](https://docs-preprod.agora.io/en/agora-chat/agora_chat_overview?platform=Web)
- [Agora Chat SDK API Reference](https://docs-preprod.agora.io/en/agora-chat/API%20Reference/im_ts/index.html?transId=4dbea540-f2cd-11ec-bafe-3fe630a7aac4)

## Related resources

- Check our [FAQ](https://docs.agora.io/en/faq) to see if your issue has been recorded.
- Dive into [Agora SDK Samples](https://github.com/AgoraIO) to see more tutorials
- Take a look at [Agora Use Case](https://github.com/AgoraIO-usecase) for more complicated real use case
- Repositories managed by developer communities can be found at [Agora Community](https://github.com/AgoraIO-Community)
- If you encounter problems during integration, feel free to ask questions in [Stack Overflow](https://stackoverflow.com/questions/tagged/agora.io)

## License

The sample projects are under the MIT license.
