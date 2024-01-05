import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import {
  Provider,
  Header,
  Chat,
  useConversationContext,
  ConversationList,
  ConversationItem,
} from "chatuim2";
import "chatuim2/style.css";
import Button from "../../component/button";
import Avatar from "../../component/avatar";
import Icon from "../../component/icon";
import "./index.css";
import { appKey, userId, token } from "../config";

const ChatApp = () => {
  const context = useConversationContext();
  const topConversation = () => {
    context.topConversation({
      chatType: "singleChat",
      conversationId: "conversationId", // Enter a conversation ID from your conversation list.
      lastMessage: {},
    });
  };

  const createConversation = () => {
    context.addConversation({
      chatType: "singleChat",
      conversationId: "conversationId",
      lastMessage: {},
      unreadCount: 3,
    });
  };

  const idToName = {
    userId1: "name1",
    zd2: "Henry 2",
  };
  return (
    <>
      <div
        style={{
          width: "35%",
        }}
      >
        <ConversationList
          className="conversation"
          renderHeader={() => (
            <Header
              avatar={<Avatar>D</Avatar>}
              content="custom header"
              icon={<Icon type="PLUS_CIRCLE" height={34} width={34} />}
              moreAction={{
                visible: true,
                actions: [
                  {
                    content: "my info",
                    onClick: () => {
                      console.log("my info");
                    },
                  },
                ],
              }}
            ></Header>
          )}
          renderItem={(cvs) => {
            return (
              <ConversationItem
                avatar={
                  <Avatar
                    size="normal"
                    shape="square"
                    style={{ background: "yellow", color: "black" }}
                  >
                    {idToName[cvs.conversationId] || cvs.conversationId}
                  </Avatar>
                }
                data={{
                  ...cvs,
                  name: idToName[cvs.conversationId] || cvs.conversationId,
                }}
                moreAction={{
                  visible: true,
                  actions: [
                    {
                      // Uikit provides default deletion conversation event
                      content: "DELETE",
                    },
                    {
                      content: "Top Conversation",
                      onClick: topConversation,
                    },
                  ],
                }}
              />
            );
          }}
        ></ConversationList>
        <div>
          <Button onClick={createConversation}>create conversation</Button>
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("chatRoot") as Element).render(
  <div className="container">
    <Provider
      initConfig={{
        appKey,
        userId,
        token,
      }}
    >
      <ChatApp></ChatApp>
    </Provider>
  </div>
);
