import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  Provider,
  Chat,
  ConversationList,
  useClient,
  rootStore,
  Button,
  Conversation,
} from "chatuim2";
import "chatuim2/style.css";
import "./index.css";
import { appKey, userId, token } from "../config";
// const appKey = ""; // your appKey
// const userId = ""; // your chat user ID
// const token = ""; // agora chat token (007)

const ChatApp = () => {
  const createConversation = () => {
    const conversation: Conversation = {
      chatType: "singleChat", // 'singleChat' || 'groupChat'
      conversationId: "agora", // target user id or group id
      name: "Agora", // target user nickname or group name
      lastMessage: {
        id: "1",
        chatType: "singleChat",
        to: "agora2",
        type: "txt",
        msg: "hello",
        time: Date.now(),
      },
      unreadCount: 0,
    };
    rootStore.conversationStore.addConversation(conversation);
  };
  return (
    <div className="container">
      <div className="conversation">
        <ConversationList />
      </div>
      <div className="chat">
        <Chat />
      </div>
      <Button onClick={createConversation}>create conversation</Button>
    </div>
  );
};

ReactDOM.createRoot(
  document.getElementById("quickStartRoot") as Element
).render(
  <Provider
    initConfig={{
      appKey,
      userId,
      token,
    }}
  >
    <ChatApp />
  </Provider>
);

// 1. npm run dev
// 2. open http://localhost:5173/demo/quickStart/index.html
