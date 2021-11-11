import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
const sessionType = {
  chat: "singleChat",
  groupchat: "groupChat",
  chatroom: "chatRoom",
};
// TODO createListen 语义化
export default function createListen() {
  WebIM.conn.addEventHandler('EaseChat',{
    onConnected: (msg) => {
      const username = store.getState().global.globalProps.username;
      console.log("登录成功");

      // init DB
      AppDB.init(username);

      // get session list
      store.dispatch(SessionActions.getSessionList());
    },

    onTextMessage: (message) => {
      console.log("onTextMessage", message);
      console.log("store>>", store);
      const { type, from, to } = message;
      const sessionId = type === "chat" ? from : to;
      store.dispatch(MessageActions.addMessage(message, "txt"));
      store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },
    onFileMessage: (message) => {
      console.log("onFileMessage", message);
      store.dispatch(MessageActions.addMessage(message, "file"));
    },
    onPictureMessage: (message) => {
      console.log("onPictureMessage", message);
      const { type, from, to } = message;
      const sessionId = type === "chat" ? from : to;
      store.dispatch(MessageActions.addMessage(message, "img"));
      store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },

    onAudioMessage: (message) => {
      console.log("onAudioMessage", message);
      const { type, from, to } = message;
      const sessionId = type === "chat" ? from : to;
      store.dispatch(MessageActions.addAudioMessage(message, "audio"));
    },

    onRecallMessage: (message) => {
      // When log in, have received the Recall message before get Message from db. so retract after 2 seconds
      if (!store.getState().message.byId[message.mid]) {
        setTimeout(() => {
          store.dispatch(MessageActions.deleteMessage(message));
        }, 2000);
        return;
      }
      store.dispatch(MessageActions.deleteMessage(message));
    },
    // The other has read the message
    onReadMessage: (message) => {
      console.log("onReadMessage", message);
      store.dispatch(MessageActions.updateMessageStatus(message, "read"));
    },

    onReceivedMessage: function (message) {
      const { id, mid } = message;
      store.dispatch(MessageActions.updateMessageMid(id, mid));
    },
    onDeliveredMessage: function (message) {
      store.dispatch(MessageActions.updateMessageStatus(message, "received"));
    },

    onContactInvited: function (msg) {
      // store.dispatch(NoticeActions.addFriendRequest(msg))
    },
    onContactDeleted: function () {},
    onContactAdded: function () {},
    onContactRefuse: function () {},
    onContactAgreed: function () {},

    onPresence: (msg) => {},
    onError: (err) => {
      console.log("error");
      console.error(err);
    },
    onClosed: (msg) => {
      console.warn("onClosed", msg);
    },
  });
}
