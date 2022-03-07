import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import GlobalPropsActions from "../redux/globalProps"
import PresenceActions from '../redux/presence'

export default function createlistener(props) {
  WebIM.conn.addEventHandler('EaseChat',{
    onConnected: (msg) => {
        // init DB
        AppDB.init(WebIM.conn.context.userId);
      // get session list
      store.dispatch(SessionActions.getSessionList());
      const options = {
        appKey:WebIM.conn.context.appKey,
        username:WebIM.conn.context.userId
      }
      store.dispatch(SessionActions.getJoinedGroupList())
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
      AppDB.db = undefined
      store.dispatch(GlobalPropsActions.logout())
    },
    onGroupChange: (event) => {
      if(event.type === 'direct_joined'){
        store.dispatch(SessionActions.getJoinedGroupList())
      }else if(event.type === 'joinPublicGroupSuccess'){
        const joinedGroup = store.getState().session.joinedGroups;
        const result = joinedGroup.find((item) => {
          item.groupid === event.gid
        })
        if(!result){
          store.dispatch(SessionActions.getJoinedGroupList())
        }
      }
    },
    onPresenceStatusChange: function(message){
      console.log('onPresenceStatusChange', message, WebIM.conn.context.userId)
      if(WebIM.conn.context.userId != message[0].userId){
        console.log('SessionActions.setSessionList')
        let tempArr = [{
          sessionType: 'singleChat',
          sessionId: message[0].userId,
          presence: message[0]
        }]
        store.dispatch(SessionActions.setSessionList(tempArr))
      }
      else{
        store.dispatch(PresenceActions.changeImg(message[0].ext))
      }
    }, // 发布者发布新的状态时，订阅者触发该回调
    onContactDeleted:(msg)=>{
      store.dispatch(MessageActions.clearMessage('singleChat', msg.from));
      store.dispatch(SessionActions.deleteSession(msg.from));
      store.dispatch(GlobalPropsActions.setGlobalProps({to:null}))
    }
  });
}
