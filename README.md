# Get Started with Agora Chat UIKit for Web

## Overview

`agora-chat-uikit` is a UI component library based on the Chat SDK. It provides pure UI components, module components containing chat business logic, and container components, which allow users to customize using renderX method. `agora-chat-uikit` provides a provider to manage data. The provider automatically listens for chat SDK events to update data and drive UI updates. Developers can use the library to quickly build custom IM applications based on actual business requirements.

## Technical principles

UIKIt consists of three parts: UI component, mobx store for managing data, and chat SDK. UI components include container components, composite components module, and pure UI components. These components at different levels are currently available to you. You can reference any of these components to build your own applications. UIkit uses mobx to manage global data, and you can reference the rootStore to get all the data and the action method which can be used to modify the data. UIKit integrates the chat SDK internally and interacts with the server through the chat SDK.

<div align=center> <img src="https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web/blob/dev/docs/uikit.png" width = "400" height = "450" /></div>

## Function

The `agora-chat-uikit` library provides the following functions:

- Automatic layout to match the width and height of the container.
- Send and receive messages, display messages, show the message unread count, clear messages, and support message types (including text, image, file, emoji, voice, video, combined message, and contact card message).
- Search for and delete a conversation and pin a conversation.
- Contacts list.
- Customize the UI.

<table>
    <tr>
        <td>Module</td>
        <td>Function</td>
        <td>Description</td>
    </tr>
   <tr>
      <td rowspan="5" style=font-weight:bold>Conversation List</td>
   </tr>
   <tr>
      <td>Display conversation information</td>
      <td style=font-size:10px>Displays information such as avatars, nicknames, last message, and unread message count of the conversation</td>
   </tr>
   <tr>
      <td>Delete conversation</td>
      <td style=font-size:10px>Deletes the conversation from the conversation list</td>
   </tr>
   <tr>
      <td>Pin conversation</td>
      <td style=font-size:10px>Pins the conversation</td>
   </tr>
   <tr>
      <td>Mute conversation</td>
      <td style=font-size:10px>Mutes the conversation from the conversation list</td>
   </tr>
    <tr>
      <td rowspan="4" style=font-weight:bold>Chat</td>
   </tr>
   <tr>
      <td>Message input</td>
      <td style=font-size:10px>Support for sending text, emoji, image, file, voice, and video messages</td>
   </tr>
   <tr>
      <td>Display message </td>
      <td style=font-size:10px>Displaying one-to-one or group chat messages, including the profile avatar, nickname, message content, time, message sending status, and message read status. Supported message types include text, image, video, file, voice, and combined messages, as well as contact card messages</td>
   </tr>
   <tr>
      <td>Operate on messages </td>
      <td style=font-size:10px>
      Including forwarding, editing, deleting, replying to, recalling, translating, and selecting messages, as well as operations on message Reactions and threads
      </td>
   </tr>
   <tr>
      <td rowspan="3" style=font-weight:bold>Contacts</td>
   </tr>
   <tr>
      <td>Display groups and contacts </td>
      <td style=font-size:10px>Display groups contacts and new requests </td>
   </tr>
   <tr>
      <td>Display groups and contacts details </td>
      <td style=font-size:10px>Display detailed information about groups or contacts, including avatars, nicknames, IDs, presence, and the ability to initiate messaging and audio/video calls</td>
   </tr>
</table>

## Prerequisites

In order to follow the procedure in this page, you must have:

- React 16.8.0 or later
- React DOM 16.8.0 or later
- A valid [Agora account](https://docs.agora.io/cn/AgoraPlatform/sign_in_and_sign_up)
- A valid [Agora project](https://docs.agora.io/cn/AgoraPlatform/sign_in_and_sign_up) with an App Key

## Compatible browsers

| Browser | Supported Version |
| ------- | ----------------- |
| IE      | 11 or later       |
| Edge    | 43 or later       |
| Firefox | 10 or later       |
| Chrome  | 54 or later       |
| Safari  | 11 or later       |

## Limitations

URL Preview Limitations：If a website does not have cross-origin resource sharing (CORS) configured, it may lead to issues with URL resolution. CORS is a security mechanism that restricts cross-origin requests initiated from a web browser. When a cross-origin request is made from a web page using JavaScript or other client-side technologies, the browser sends a preflight request (OPTIONS request) to confirm whether the target server allows the cross-origin request. If the target server is not properly configured for CORS, the browser rejects the cross-origin request, resulting in the inability to access and resolve the URL. It's important to note that CORS restrictions are enforced by the browser as a security policy, and they only apply to cross-origin requests initiated from the client-side. If URL resolution is performed on the server-side, it usually won't be subject to CORS limitations. In such cases, URL resolution can be directly performed on the server-side without the need for client-side scripting to initiate the request.

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

The project directory:

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

- To Install the Web Chat UIKit with Yarn, run the following command:

```bash
yarn add agora-chat-uikit
```

#### Build the application using the agora-chat-uikit component

Import agora-chat-uikit into your code.

```javascript
// App.js
import React, { Component, useEffect } from 'react';
import { UIKitProvider, Chat, ConversationList, useClient, rootStore } from 'agora-chat-uikit';
import 'agora-chat-uikit/style.css';

const appKey = 'you app key'; // your appKey
const user = ''; // your user ID
const accessToken = ''; // agora chat token

const conversation = {
  chatType: 'singleChat', // 'singleChat' || 'groupChat'
  conversationId: 'agora', // target user ID or group ID
  name: 'Agora', // target user nickname or group name
  lastMessage: {},
};
const ChatApp = () => {
  const client = useClient();
  useEffect(() => {
    client &&
      client
        .open({
          user,
          accessToken,
        })
        .then(res => {
          console.log('get token success', res);
          // create a conversation
          rootStore.conversationStore.addConversation(conversation);
        });
  }, [client]);

  return (
    <div>
      <div>
        <ConversationList />
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <UIKitProvider
        initConfig={{
          appKey,
        }}
      >
        <ChatApp />
      </UIKitProvider>
    );
  }
}

export default App;
```

#### Run the project and send your first message

```bash
npm run start
```

Now, you can see your app in the browser.

<div align=center style="background: #ddd; padding-top: 8px"> <img src="https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web/blob/dev/docs/image/chat.png" width = "480" height = "350" /></div>

For quick experience, you can use the default App Key and send several types of messages. Specifically, you can select a contact, enter your first message, and send it.

**Note**

If a custom App Key is used, no contact is available by default and you need to first [add contacts](https://docs.agora.io/en/agora-chat/client-api/contacts) or [join a group](https://docs.agora.io/en/agora-chat/client-api/chat-group/manage-chat-groups).

Agora provides an open-source web Agora Chat UIKit project on GitHub, where you can clone and run the project or reference the logic to create a project that integrates agora-chat-uikit.

- [How to get an Agora Chat token](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web/blob/UIKit-1.2/docs/en/agora_chat_uikit_web.md)
- [URL for source code of the Web Agora Chat UIKit](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web/tree/UIKit-1.2)
- [URL for Agora Chat application using agora-chat-uikit](https://github.com/AgoraIO-Usecase/AgoraChat-web/tree/dev-1.2)

## Component

Currently, `agora-chat-uikit` provides the following components:

- Container components: `UIKitProvider`， `Chat`，`ConversationList`, `ContactList`, `Thread`;
- Module components: `BaseMessage`，`AudioMessage`，`FileMessage`， `VideoMessage`，`ImageMessage`，`TextMessage`,`CombinedMessage`, `UserCardMessage`, `ContactDetail`, `GroupDetail`, `Header`，`Empty`，`MessageList`， `ConversationItem`，`MessageInput`，`MessageStatus`;
- Pure UI components: `Avatar`，`Badge`，`Button`，`Checkbox`，`Icon`，`Modal`，`Tooltip`, `Input`, `UserItem`;

Container components are as follows:

<table>
    <tr>
        <td>Component</td>
        <td>Description</td>
        <td>Props</td>
		<td>Props Description</td>
    </tr> 
   <tr>
      <td rowspan="6" style=font-weight:bold>UIKitProvider</td>
      <td rowspan="6"  style=font-size:10px>The UIKitProvider does not render any UI but only provides global context for components. It automatically listens to SDK events, transmits data downward, and drives component rendering</td>
      <td style=font-size:10px>
      initConfig: {<br/>
        appKey: string;<br/>
        userId?: string;<br/>
        token?: string;<br/>
        translationTargetLanguage?: string;<br/>
        useUserInfo?: boolean;<br/>
        useReplacedMessageContents?: boolean;<br/>
        deviceId?: string;<br/>
        maxMessages?: number;<br/>
      }
      </td>
	  <td style=font-size:10px>
      <b>appKey</b>: Your app key. <br/>
      <b>userId</b>: Your user ID. If you want UIKIt to automatically log in internally, you need to pass in this parameter and Agora Chat token. <br/>
      <b>token</b>: Agora Chat token. <br/>
      <b>translationTargetLanguage</b>: Translating text messages by setting the target language for translation. <br/>
      <b>useUserInfo</b>: Whether to use the user attribute function. If yes, the UIKit will automatically query the user's user attributes internally to display avatars and nicknames. <br/>
      <b>useReplacedMessageContents</b>: Whether the server returns the sender the text message with the content replaced during text moderation: - `true`: Return the adjusted message to the sender. - (Default) `false`: Return the original message to the sender. <br/>
      <b>deviceId</b>: The unique web device ID. <br/>
      <b>maxMessages</b>: The maximum number of messages that can be displayed in a single conversation. The default value is 200. If the maximum value is exceeded, the messages will be automatically cleared and those messages can be retrieved by pulling more messages. <br/> 
    </td>
	   <tr>
	   <td style=font-size:10px>
	   </pre>
       local?: {
        fallbackLng?: string;
        lng?: string;
        resources?: {
          [key: string]: {
            translation: {
              [key: string]: string;
            };
          };
        };
      }
		<pre>
      </td>
	   <td style=font-size:10px>To configure the localized copy, see the parameters of the i18next init method</td>
	   </tr>
     <tr>
     <td style=font-size:10px>
     features?: {
      chat?:{
        header?:{
          deleteConversation?: boolean;
          //...
        }
        //...
      },
      conversationList?:{
        //...
      }
     }
     </td>
     <td style=font-size:10px>Configure the features you need globally. If the required features are also configured in the component, the configuration in the component shall prevail</td>
     </tr>
     <tr>
      <td style=font-size:10px>
        theme?:{
    primaryColor?: string | number;
    mode?: 'light' | 'dark';
    avatarShape?: 'circle' | 'square';
    bubbleShape?: 'ground' | 'square';
    componentsShape?: 'ground' | 'square';
  }
      </td>
      <td style=font-size:10px>
        <b>primaryColor</b>: Theme color, which can be set with hexadecimal color value or Hue value. <br/>
        <b>mode</b>: Light or dark themes. <br/>
        <b>avatarShape</b>: The shape of the avatar. <br/>
        <b>bubbleShape</b>: The shape of the message bubble. <br/>
        <b>componentsShape</b>: The shape of other components. <br/>
      </td>
     </tr>
     <tr>
      <td style=font-size:10px>presenceMap?: {
    [key: string]: string | HTMLImageElement;
  }</td>
      <td style=font-size:10px>Customize the online status of configured users</td>
     </tr>
     <tr>
      <td style=font-size:10px>reactionConfig?: {
    map: {
      [key: string]: HTMLImageElement;
    };
  }</td>
      <td style=font-size:10px></td>
     </tr>
   </tr>
   <tr>
      <td rowspan="11" style=font-weight:bold>ConversationList</td>
      <td rowspan="11"  style=font-size:10px>Conversation list component</td>
      <td style=font-size:10px>
      className
	  </td>
	  <td style=font-size:10px>
	  Component class name
	  </td>
    <tr>
		<td style=font-size:10px>style</td>
		<td style=font-size:10px>css properties</td>
	  </tr>
    <tr>
		<td style=font-size:10px>showSearchList: boolean</td>
		<td style=font-size:10px>Whether to display the search result list. When using renderHeader, this parameter can be used to control whether to display the search result list.</td> 
	  </tr>
	  <tr>
		<td style=font-size:10px>prefix</td>
		<td style=font-size:10px>css class name prefix</td>
	  </tr>
	  <tr>
		<td style=font-size:10px>headerProps</td>
		<td style=font-size:10px>Props for the Header component</td>
	  </tr>
	  <tr>
		<td style=font-size:10px>itemProps</td>
		<td style=font-size:10px>Props for the ConversationItem component</td>
	  </tr>
	   <tr>
		<td style=font-size:10px>renderHeader?: () => React.ReactNode</td>
		<td style=font-size:10px>Custom rendering header, which receives a function that returns a react node</td>
	  </tr>
	  <tr>
		<td style=font-size:10px>renderSearch?: () => React.ReactNode</td>
		<td style=font-size:10px>Custom rendering search component, which receives a function that returns a react node</td> 
	  </tr> 
     <tr>
		<td style=font-size:10px>renderItem?:(cvs: Conversation, index: number) => React.ReactNode</td>
		<td style=font-size:10px>Custom rendering item component, which receives a function that returns a react node</td>
	  </tr>
	  <tr>
		<td style=font-size:10px>onItemClick?: (data: ConversationData[0]) => void</td>
		<td style=font-size:10px>Click on the conversation event to return the data of the current conversation</td>
	  </tr>
	  <tr>
		<td style=font-size:10px>onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => boolean</td>
		<td style=font-size:10px>Search input change event. If the function returns false, it will prevent the default search behavior. Users can search according to their own conditions</td>
	  </tr>
   </tr>
   <tr>
      <td rowspan="15" style=font-weight:bold>Chat</td>
      <td rowspan="15" style=font-size:10px>Chat component</td>
      <td style=font-size:10px>
	  className: string
	  </td>
	  <td style=font-size:10px>
	  Component CSS class name
	  </td>
    <tr>
	    <td style=font-size:10px>style: React.CSSProperties</td>
		<td style=font-size:10px>CSS properties</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>prefix: string</td>
		<td style=font-size:10px>CSS class name prefix</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>headerProps: HeaderProps</td>
		<td style=font-size:10px>props for Header</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>messageListProps: MsgListProps</td>
		<td style=font-size:10px>Props for the MessageList component</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>messageInputProps: MessageInputProps</td>
		<td style=font-size:10px>Props for the MessageInput component</td>
	  </tr>
    <tr>
	    <td style=font-size:10px>rtcConfig: ChatProps['rtcConfig']</td>
		<td style=font-size:10px>Parameters required when using audio and video calls</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderHeader: (cvs: CurrentCvs) => React.ReactNode</td>
		<td style=font-size:10px>Custom render Header component that takes a function that returns a react node，CurrentCvs is the current conversation</td>
	  </tr>
	   <tr>
	    <td style=font-size:10px>renderMessageList?: () => ReactNode; </td>
		<td style=font-size:10px>Custom render message list component</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderMessageInput?: () => ReactNode; </td>
		<td style=font-size:10px>Custom render message input component</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>renderEmpty?: () => ReactNode; </td>
		<td style=font-size:10px>Custom render empty pages without a conversation</td>
	  </tr>
    <tr>
	    <td style=font-size:10px>renderRepliedMessage?: (repliedMessage: ChatSDK.MessageBody | null) => ReactNode; </td>
		<td style=font-size:10px>Custom rendering of replied messages on Input</td>
	  </tr>
    <tr>
	    <td style=font-size:10px>onOpenThread?:(data: { id: string }) => void; </td>
		<td style=font-size:10px>The callback of clicking on the thread message</td>
	  </tr>
    <tr>
	    <td style=font-size:10px>onVideoCall?:(data: { channel: string }) => void;; </td>
		<td style=font-size:10px>The callback function for initiating a video call</td>
	  </tr>
    <tr>
	    <td style=font-size:10px>onAudioCall?:(data: { channel: string }) => void;; </td>
		<td style=font-size:10px>The callback function for initiating a voice call</td>
	  </tr>
    <tr>
      <td rowspan="2" style=font-weight:bold>ContactList</td>
      <td rowspan="2" style=font-size:10px>ContactList component</td>
      <tr>
        <td style=font-size:10px>className:string</td>
        <td style=font-size:10px>Component CSS class name</td>
      </tr>
    <tr>
   </tr>
</table>

## store

UIKit provides a rootStore that contains all the data. rootStore contains:

- initConfig: UIKit initializes data
- client: Chat SDK instance
- conversationStore: indicates the data related to the conversation list
- messageStore: indicates message-related data
- addressStore: indicates the address book data

<table>
    <tr>
        <td>Store</td>
        <td>Attribute/Method</td>
        <td>Description</td>
    </tr> 
    <tr>
      <td rowspan="10" >conversationStore</td>
    </<tr>
    <tr>
        <td>currentCvs</td>
        <td style=font-size:10px>Current conversation</td>
    </tr> 
    <tr>
        <td>conversationList</td>
        <td style=font-size:10px>All conversations</td>
    </tr> 
    <tr>
        <td>searchList</td>
        <td style=font-size:10px>The searched conversations</td>
    </tr> 
   <tr>
        <td style=color:blue>setCurrentCvs</td>
        <td style=font-size:10px>Set the current conversation</td>
    </tr> 
    <tr>
        <td style=color:blue>setConversation</td>
        <td style=font-size:10px>Set all conversations</td>
    </tr> 
    <tr>
        <td style=color:blue>deleteConversation</td>
        <td style=font-size:10px>Delete a conversation</td>
    </tr> 
   <tr>
        <td style=color:blue>addConversation</td>
        <td style=font-size:10px>Add a conversation</td>
    </tr> 
    <tr>
        <td style=color:blue>topConversation</td>
        <td style=font-size:10px>Top a conversation</td>
    </tr> 
    <tr>
        <td style=color:blue>modifyConversation</td>
        <td style=font-size:10px>Modifying a conversation</td>
    </tr>
     <tr>
      <td rowspan="10" >messageStore</td>
    </tr>
   <tr>
        <td>message</td>
        <td style=font-size:10px>Messages in all conversations, including one-to-one chat(`singleChat`), group chat (`groupChat`), and chat room (`chatRoom`)</td style=font-size:10px>
    </tr>
   <tr>
        <td style=color:blue>currentCvsMsgs</td>
        <td style=font-size:10px>Set messages for the current conversation</td>
    </tr>
    <tr>
        <td style=color:blue>sendMessage</td>
        <td style=font-size:10px>Send a message</td>
    </tr>
    <tr>
        <td style=color:blue>receiveMessage</td>
        <td style=font-size:10px>Receive a message</td>
    </tr>
    <tr>
        <td style=color:blue>modifyMessage</td>
        <td style=font-size:10px>Edit a message</td>
    </tr>
    <tr>
        <td style=color:blue>sendChannelAck</td>
        <td style=font-size:10px>Reply with a channel ack to clear unread data from the conversation</td>
    </tr>
   <tr>
        <td style=color:blue>updateMessageStatus</td>
        <td style=font-size:10px>Update message status</td>
    </tr>
     <tr>
        <td style=color:blue>clearMessage</td>
        <td style=font-size:10px>Clear messages of a conversation</td>
    </tr>
    
</table>

## How to customize

Here is an [example of how to customize the chat component](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-web/blob/UIKit-1.2/docs/en/chat.md).

### Modify component style

You can modify the style by passing in className, style, and prefix through the component props:

```javascript
import { Chat, Button } from 'chatuim2';

const ChatApp = () => {
  return (
    <div>
      <Chat className="customClass" prefix="custom" />
      <Button style={{ width: '100px' }}>Button</Button>
    </div>
  );
};
```

### Using custom components

Custom components can be rendered through the renderX method of container components:

```javascript
import {Chat, Header} from 'agora-chat-uikit'

const ChatApp = () => {
  const CustomHeader = <Header back content="Custom Header">
  return(
    <div>
      <Chat renderHeader={(cvs) => CustomHeader}>
    </div>
  )
}

```

### Modify Theme

The UIKit style is developed using the scss framework and defines a series of global style variables, including but not limited to global styles (main color, background color, rounded corners, borders, font size).

```scss
// need to use hsla
$blue-base: hsla(203, 100%, 60%, 1);
$green-base: hsla(155, 100%, 60%, 1);
$red-base: hsla(350, 100%, 60%, 1);
$gray-base: hsla(203, 8%, 60%, 1);
$special-base: hsla(220, 36%, 60%, 1);

$font-color: $gray-3;
$title-color: $gray-1;
$component-background: #fff;

$height-base: 36px;
$height-lg: 48px;
$height-sm: 28px;

// vertical margins
$margin-lg: 24px;
$margin-md: 16px;
$margin-sm: 12px;
$margin-xs: 8px;
$margin-xss: 4px;

// vertical paddings
$padding-lg: 24px;
$padding-md: 20px;
$padding-sm: 16px;
$padding-s: 12px;
$padding-xs: 8px;
$padding-xss: 4px;
// font
$font-size-base: 14px;
$font-size-lg: $font-size-base + 2px;
$font-size-sm: 12px;
$text-color: fade($black, 85%);
```

1. Use webpack for variable coverage:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "@/styles/index.scss";`,
            },
          },
        ],
      },
    ],
  },
};
```

2. Customize in create-react-app

Create an SCSS file with variables to override style.scss. Make sure that you import the files in the following order:

```scss
@import 'agora-chat-uikit/style.scss'; // agora-chat-uikit theme
@import 'your-theme.scss'; // your theme
@import 'agora-chat-uikit/components.scss'; // components style
```

If these cannot meet the customization requirements, you can also find the elements to cover the style of UIKit.

## Community Contribution

If you want to add extra functions to agora-chat-uikit to share with others, you can fork our repository on GitHub and create a pull request. For any issues, please submit it on the repository. Thank you for your contribution!

## Feedback

If you have any problems or suggestions regarding the sample projects, feel free to file an issue.

## Reference

- [Agora Chat SDK Product Overview](https://docs.agora.io/en/agora-chat/overview/product-overview)
- [Agora Chat SDK API Reference](https://api-ref.agora.io/en/chat-sdk/web/1.x/index.html)

## Related resources

- Check our [FAQ](https://docs.agora.io/en/faq) to see if your issue has been recorded.
- Dive into [Agora SDK Samples](https://github.com/AgoraIO) to see more tutorials.
- Take a look at [Agora Use Case](https://github.com/AgoraIO-usecase) for more complicated real use case.
- Repositories managed by developer communities can be found at [Agora Community](https://github.com/AgoraIO-Community).
- For any integration issues, feel free to ask for help in [Stack Overflow](https://stackoverflow.com/questions/tagged/agora.io).

## License

The sample projects are under the MIT license.
