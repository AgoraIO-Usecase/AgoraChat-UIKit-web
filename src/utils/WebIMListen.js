import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import GlobalPropsActions from "../redux/globalProps"
export default function createlistener(props) {
  WebIM.conn.addEventHandler('EaseChat',{
    onConnected: (msg) => {
      console.log("登录成功");
        // init DB
        AppDB.init(WebIM.conn.context.userId);
      // get session list
      store.dispatch(SessionActions.getSessionList());
      const options = {
        appKey:WebIM.conn.context.appKey,
        username:WebIM.conn.context.userId
      }
      store.dispatch(GlobalPropsActions.saveGlobalProps(options));
      props.successLoginCallback && props.successLoginCallback({isLogin:true})
    },

    onTextMessage: (message) => {
      console.log("onTextMessage", message);
      const { chatType, from, to} = message;
      const sessionId = chatType === "singleChat" ? from : to;
      store.dispatch(MessageActions.addMessage(message, "txt"));
      store.dispatch(SessionActions.topSession(sessionId, chatType))
    },
    onFileMessage: (message) => {
      console.log("onFileMessage", message);
      store.dispatch(MessageActions.addMessage(message, "file"));
    },
    onImageMessage: (message) => {
      console.log("onImageMessage", message);
      const { chatType, from, to } = message;
      const sessionId = chatType === "singleChat" ? from : to;
      store.dispatch(MessageActions.addMessage(message, "img"));
      store.dispatch(SessionActions.topSession(sessionId, chatType))
    },

    onAudioMessage: (message) => {
      console.log("onAudioMessage", message);
      const { chatType, from, to } = message;
      const sessionId = chatType === "singleChat" ? from : to;
      store.dispatch(MessageActions.addAudioMessage(message, "audio"));
    },

    onRecallMessage: (message) => {
      // When log in, have received the Recall message before get Message from db. so retract after 2 seconds
      if (!uikit_store.getState().message.byId[message.mid]) {
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
      props.failCallback && props.failCallback(err)
    },
    onClosed: (msg) => {
      console.warn("onClosed", msg);
    },
    onDisconnected: () => {
      console.log('退出成功');
      AppDB.db = undefined
      store.dispatch(GlobalPropsActions.logout())
    }
  });
}
