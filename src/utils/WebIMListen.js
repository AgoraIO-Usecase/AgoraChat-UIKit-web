import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import GlobalPropsActions from "../redux/globalProps";
export default function createlistener(props) {
	WebIM.conn.addEventHandler("EaseChat", {
		onConnected: (msg) => {
			// init DB
			AppDB.init(WebIM.conn.context.userId);
			// get session list
			store.dispatch(SessionActions.getSessionList());
			const options = {
				appKey: WebIM.conn.context.appKey,
				username: WebIM.conn.context.userId,
			};
			store.dispatch(SessionActions.getJoinedGroupList());
			store.dispatch(GlobalPropsActions.saveGlobalProps(options));
			props.successLoginCallback &&
				props.successLoginCallback({ isLogin: true });
		},

		onTextMessage: (message) => {
			console.log("onTextMessage", message);
			const { chatType, from, to } = message;
			const sessionId = chatType === "singleChat" ? from : to;
			store.dispatch(MessageActions.addMessage(message, "txt"));
			store.dispatch(SessionActions.topSession(sessionId, chatType));
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
			store.dispatch(SessionActions.topSession(sessionId, chatType));
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
			store.dispatch(
				MessageActions.updateMessageStatus(message, "received")
			);
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
    onContactDeleted:(msg)=>{
      store.dispatch(MessageActions.clearMessage('singleChat', msg.from));
      store.dispatch(SessionActions.deleteSession(msg.from));
      store.dispatch(GlobalPropsActions.setGlobalProps({to:null}))
    },
    //群成员收到therad更新的通知--抛出到demo层处理
    onThreadUpdate:(msg) =>{
      switch(msg.type){
        case 'create':
          console.log("create")
        case 'update':
          console.log("update")
        case 'delete':
          console.log("delete")
        case 'update_msg':
          console.log("update_msg")
        default:
          console.log('error')
      }
    },
    //thread成员收到thread更新的通知
    onThreadChange:(msg) =>{
      switch(msg.type){
        case 'threadCreate':
          console.log("threadCreate")
        case 'threadDestroy':
          console.log("threadDestroy")
        case 'threadJoin':
          console.log("threadJoin")
        case 'threadLeave':
          console.log("threadLeave")
        case 'threadKick':
          console.log("threadKick")
        case 'threadNameUpdate':
          console.log("threadNameUpdate")
        case 'threadPresence':
          console.log("threadPresence")
        case 'threadAbsence':
          console.log("threadAbsence")
      default:
          console.log('error')
      }
    },
	onReactionMessage: (message) => {
		console.log("onReactionMessage", message);
	},

  });
}
