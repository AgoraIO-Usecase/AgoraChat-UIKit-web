import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import {
  Header,
  Provider,
  Chat,
  ConversationList,
  ConversationItem,
  useClient,
  rootStore,
  Button,
  Avatar,
  Icon,
  MessageList,
  MessageEditor,
  TextMessage,
  CurrentConversation,
} from "chatuim2";
// import "chatuim2/style.css";
import "./index.scss";
import AgoraChat from "agora-chat";
import { appKey, userId, token } from "../config";
/**
 * 1. use theme.primaryColor to change the primary color
 * 2. use style props to change components style
 * 3. use className to change Header style
 * 4. use scss variables to button style
 */

const ChatApp = () => {
  // create a conversation
  const setCurrentCvs = () => {
    rootStore.conversationStore.setCurrentCvs({
      chatType: "singleChat",
      conversationId: "jim",
      name: "Jim",
    });
  };

  // render custom text message
  const renderTxtMsg = (msg) => {
    return (
      <TextMessage
        bubbleStyle={{
          //   background: "hsl(135.79deg 88.79% 36.46%)",
          borderRadius: "2px",
        }}
        style={{ color: "red", fontSize: "20px" }}
        shape="square"
        status={msg.status}
        avatar={<Avatar style={{ background: "pink" }}>{msg.from}</Avatar>}
        textMessage={msg}
      ></TextMessage>
    );
  };
  const renderMessage = (msg) => {
    if (msg.type === "txt") {
      return renderTxtMsg(msg);
    } else if (msg.type === "custom") {
      return renderCustomMsg(msg);
    }
  };

  // add an icon to the message editor
  const CustomIcon = {
    visible: true,
    name: "CUSTOM",
    icon: (
      <Icon
        type="DOC"
        onClick={() => {
          sendCustomMessage();
          console.log("click custom icon");
        }}
      ></Icon>
    ),
  };

  // Implement Sending Custom Messages

  const sendCustomMessage = () => {
    const customMsg = AgoraChat.message.create({
      type: "custom",
      to: "jim", // Need to be the user ID of the current conversation
      chatType: "singleChat",
      customEvent: "CARD",
      customExts: {
        id: "userId3",
      },
    });
    rootStore.messageStore.sendMessage(customMsg).then(() => {
      console.log("send success");
    });
  };

  const renderCustomMsg = (msg) => {
    return (
      <div className="custom-message">
        <h1>Business Card </h1>
        <div>{msg.customExts.id}</div>
      </div>
    );
  };
  const actions = [...MessageEditor.defaultActions];
  actions.splice(2, 0, CustomIcon);
  return (
    <>
      <div style={{ width: "35%", maxWidth: "350px" }}>
        <ConversationList
          style={{ background: "#00BCD4" }}
          renderHeader={() => <Header className="conversation-header"></Header>}
        ></ConversationList>
      </div>
      <div style={{ width: "65%", borderLeft: "1px solid transparent" }}>
        <Chat
          style={{ background: "#009688" }}
          renderHeader={() => (
            <Header
              style={{
                background: "#0b7a88",
                marginTop: "10px",
                height: "50px",
              }}
            />
          )}
          renderMessageList={() => (
            <MessageList
              renderMessage={renderMessage}
              style={{ background: "#00BCD4" }}
            />
          )}
          renderMessageEditor={() => (
            <MessageEditor
              actions={actions}
              style={{
                background: "#9E9E9E",
                height: "60px",
                display: "flex",
                alignItems: "center",
                margin: "0 20px",
              }}
            />
          )}
        ></Chat>
      </div>
      <Button type="primary" onClick={setCurrentCvs}>
        setCurrentCvs
      </Button>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("themeRoot") as Element).render(
  <div className="container">
    <Provider
      initConfig={{
        appKey,
        userId,
        token,
      }}
      theme={{
        primaryColor: "#06af68", // Hexadecimal color value
      }}
    >
      <ChatApp></ChatApp>
    </Provider>
  </div>
);
