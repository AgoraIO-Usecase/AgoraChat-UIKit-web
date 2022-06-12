import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import GlobalPropsActions from "../redux/globalProps";
import ThreadActions from "../redux/thread"
import uikit_store from "../redux/index";
import EaseApp from '../EaseApp/index'

let conversationName = ''
export function addLocalMessage (obj) {
	console.log(obj, 'addLocalMessage')
	const { to, from, chatType, groupName, createGroup, groupText, firstCrate } = obj
	const message = {
		chatType: chatType,
		ext: {},
		from: chatType === 'singleChat' ? to : from,
		id: WebIM.conn.getUniqueId(),
		msg: groupText,
		onlineState: 3,
		time: new Date().getTime(),
		to: chatType === 'singleChat' ? from : to,
		type: "groupNote",
	}
	if (firstCrate) {
		store.dispatch(MessageActions.addMessage(message, "txt"))
	}
	if (!createGroup) {
		store.dispatch(
			SessionActions._pushSession({
				sessionType: chatType,
				sessionId: chatType === 'singleChat' ? from : to,
				sessionName: groupName || ''
			})
		)
	}
}
export default function createlistener(props) {
  WebIM.conn.addEventHandler('EaseChat',{
    onConnected: (msg) => {
        // init DB
        AppDB.init(WebIM.conn.context.userId);
      // get session list
      store.dispatch(SessionActions.getSessionList(WebIM.conn.context.userId));
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
      store.dispatch(SessionActions.topSession(sessionId, chatType, message))
    },
    onFileMessage: (message) => {
      console.log("onFileMessage", message);
      store.dispatch(MessageActions.addMessage(message, "file"));
    },
    onVideoMessage: (message) => {
      console.log("onVideoMessage", message);
      store.dispatch(MessageActions.addMessage(message, "video"));
    },
    onImageMessage: (message) => {
      console.log("onImageMessage", message);
      const { chatType, from, to } = message;
      const sessionId = chatType === "singleChat" ? from : to;
      store.dispatch(MessageActions.addMessage(message, "img"));
      store.dispatch(SessionActions.topSession(sessionId, chatType, message))
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
					store.dispatch(MessageActions.deleteMessage(message.mid,message.to,message.chatType));
				}, 2000);
				return;
			}
			store.dispatch(MessageActions.deleteMessage(message.mid,message.to,message.chatType));
		},
		// The other has read the message
		onReadMessage: (message) => {
			console.log("onReadMessage", message);
			const { mid, id } = message
			store.dispatch(MessageActions.updateMessageStatus(message, "read", id, mid));
		},

		onReceivedMessage: function (message) {
      		console.log("updateMessageMid",message)
			const { id, mid, to } = message;
			store.dispatch(MessageActions.updateMessageMid(id, mid, to));
		},
		onDeliveredMessage: function (message) {
			console.log("onDeliveredMessage",message)
			const { mid, id } = message
			store.dispatch(
				MessageActions.updateMessageStatus(message, "received", id, mid)
			);
		},
		onPresence: (msg) => {},
		onError: (err) => {
			console.log("error");
			console.error(err);
			props.failCallback && props.failCallback(err);
		},
		onClosed: (msg) => {
			console.warn("onClosed", msg);
		},
		onDisconnected: () => {
			AppDB.db = undefined;
			store.dispatch(GlobalPropsActions.logout());
		},
		onGroupChange: (event) => {
			console.log("onGroupChange",event);
			const { to, from, groupName, gid } = event
			if(event.type === 'direct_joined'){
			  store.dispatch(SessionActions.getJoinedGroupList())
				addLocalMessage({
					to: gid,
					from: WebIM.conn.context.userId,
					chatType:'groupChat',
					groupName,
					groupText: `You joined the group`,
					firstCrate: true
				})
			}else if(event.type === 'joinPublicGroupSuccess'){
			  const joinedGroup = store.getState().session.joinedGroups;
			  const result = joinedGroup.find((item) => {
				item.groupid === event.gid
			  })
			  if(!result){
				store.dispatch(SessionActions.getJoinedGroupList())
			  }
			} else if (event.type === 'invite') {
				conversationName = groupName
			} else if (event.type === 'invite_accept') {
				addLocalMessage({
					to: gid,
					from: WebIM.conn.context.userId,
					chatType: 'groupChat',
					groupName: conversationName,
					groupText: `You joined the group`,
					firstCrate: true
				})
			}
			if(event.type === 'addAdmin' || event.type === 'removeAdmin' || event.type === 'changeOwner'){
			  const { chatType, to } = uikit_store.getState().global.globalProps;
			  if( chatType === 'groupChat' && to === event.gid){
				dispatch(ThreadActions.getCurrentGroupRole({chatType, to}));
			  }
			}
		  },
		onContactDeleted: (msg) => {
			store.dispatch(MessageActions.clearMessage("singleChat", msg.from));
			store.dispatch(SessionActions.deleteSession(msg.from));
			store.dispatch(GlobalPropsActions.setGlobalProps({ to: null }));
		},
		onReactionChange: (message) => {
			console.log("onReactionChange", message);
			store.dispatch(MessageActions.updateReaction(message));
		},
		//thread notify
		onChatThreadChange:(msg) =>{
			console.log("====thread change:",msg)
			store.dispatch(ThreadActions.updateThreadInfo(msg));
		},
		onMultiDeviceEvent: (msg) => {
		console.log("====thread mutiDeviceEvent：",msg)
		store.dispatch(ThreadActions.updateMultiDeviceEvent(msg));
		},
		onReactionMessage: (message) => {
			console.log("onReactionMessage", message);
		},
		onContactAgreed: (msg) => {
			console.log("onContactAgreed", msg);
			const { to, from } = msg
			EaseApp.addConversationItem({
				conversationType: 'singleChat',
				conversationId: from,
				ext: {
					from: {
						ext: 'Online'
					}
				},
				firstCrate: true,
				groupText: 'Your friend request has been approved',
				createGroup: false
			})
		},
		onContactAdded: (msg) => {
			console.log("onContactAdded", msg);
			const { to, from } = msg
			addLocalMessage({to, from, chatType: 'singleChat', groupText: 'You agreed the friend request', firstCrate: true})
		}
	});
}
