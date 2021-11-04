import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session"
const sessionType = {
  chat: "singleChat",
  groupchat: "groupChat",
  chatroom: "chatRoom",
};
// TODO createListen 语义化
export default function createListen() {
  WebIM.conn.listen({
    onOpened: (msg) => {
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
      // store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
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
      // store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },

    onRecallMessage: (message) => {
      console.log("onRecallMessage", message);
      store.dispatch(MessageActions.deleteMessage(message));
    },

    onContactInvited: function (msg) {
      // store.dispatch(NoticeActions.addFriendRequest(msg))
    },
    onContactDeleted: function () {},
    onContactAdded: function () {},
    onContactRefuse: function () {},
    onContactAgreed: function () {},

    onPresence: (msg) => {
      // switch (msg.type) {
      //     case 'joinGroupNotifications':
      //         store.dispatch(NoticeActions.addGroupRequest(msg))
      //         break;
      //     default:
      //         break
      // }
    },
    onError: (err) => {
      console.log("error");
      console.error(err);
    },
    onClosed: (msg) => {
      console.warn("onClosed", msg);
    },
  });
}
