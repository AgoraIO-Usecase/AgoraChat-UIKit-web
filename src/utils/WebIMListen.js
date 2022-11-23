import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import GlobalPropsActions from "../redux/globalProps";
import ThreadActions from "../redux/thread"
import uikit_store from "../redux/index";
import EaseApp from '../EaseApp/index'
import { formatLocalMessage } from './index'

let conversationName = ''
let TimerId = null
export function addLocalMessage(obj) {
	console.log(obj, 'addLocalMessage')
	const { to, from, chatType, groupName, createGroup, groupText, firstCrate, msgType, addType } = obj

	const session = store.getState().session
	const sessionList = session.sessionList
	const sessionId = chatType === 'singleChat' ? from : to
	const found = sessionList.find((item) => {
		return item.sessionId === sessionId
	})
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
	if (!createGroup) {
		!found && store.dispatch(
			SessionActions._pushSession({
				sessionType: chatType,
				sessionId: chatType === 'singleChat' ? from : to,
				sessionName: groupName || ''
			})
		)
	}
	if (firstCrate && !found) {
		if (addType === 'contactAdded') {
			let who = chatType === 'singleChat' ? from : to
			let message = {
				msg: groupText,
				type: "groupNote",
			}
			const formatMsg = formatLocalMessage(who, chatType, message, msgType || 'txt', false)
			const { msg } = formatMsg.body;
			let option = {
				chatType,
				type: msgType || 'txt',
				to: who,
				msg,
				isChatThread: false,
			};
			let msgObj = WebIM.message.create(option);
			formatMsg.id = msgObj.id;
			store.dispatch(MessageActions.addMessage(formatMsg, msgType || "txt"))
		} else {
			store.dispatch(MessageActions.addMessage(message, msgType || "txt"))
		}
	}
}
export default function createlistener(props) {
	WebIM.conn.addEventHandler("EaseChat", {
		onConnected: (msg) => {
			// init DB
			AppDB.init(WebIM.conn.context.userId);
			// get session list
			store.dispatch(SessionActions.getSessionList(WebIM.conn.context.userId));
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
			const { chatType, from, to, ext } = message;
			const sessionId = chatType === "singleChat" ? from : to;
			if (ext.action === 'invite') {
				var id = WebIM.conn.getUniqueId();
				let message = {
					id: id,
					status: 'sent',
					body: {
						type: 'custom',
						info: {
							type: ext.type,
							action: 'invite',
							duration: `${new Date().toString().slice(16, 21)} ${new Date().toString().slice(4, 10)}`
						}
					},
					from: from,
					to: to,
					chatType: chatType
				}
				store.dispatch(MessageActions.addMessage(message))
			} else {
				store.dispatch(MessageActions.addMessage(message, "txt"));
			}

			store.dispatch(SessionActions.topSession(sessionId, chatType, message))
		},
		onFileMessage: (message) => {
			console.log("onFileMessage", message);
			const { chatType, from, to } = message;
			const sessionId = chatType === "singleChat" ? from : to;
			store.dispatch(MessageActions.addMessage(message, "file"));
			store.dispatch(SessionActions.topSession(sessionId, chatType, message))
		},
		onVideoMessage: (message) => {
			console.log("onVideoMessage", message);
			const { chatType, from, to } = message;
			const sessionId = chatType === "singleChat" ? from : to;
			store.dispatch(MessageActions.addMessage(message, "video"));
			store.dispatch(SessionActions.topSession(sessionId, chatType, message))
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
			store.dispatch(SessionActions.topSession(sessionId, chatType, message))
		},

		onRecallMessage: (message) => {
			// When log in, have received the Recall message before get Message from db. so retract after 2 seconds
			if (!uikit_store.getState().message.byId[message.mid]) {
				setTimeout(() => {
					store.dispatch(MessageActions.deleteMessage(message.mid, message.to, message.chatType));
				}, 2000);
				return;
			}
			store.dispatch(MessageActions.deleteMessage(message.mid, message.to, message.chatType));
		},
		// The other has read the message
		onReadMessage: (message) => {
			console.log("onReadMessage", message);
			const { mid, id } = message
			store.dispatch(MessageActions.updateMessageStatus(message, "read", id, mid));
		},

		onReceivedMessage: function (message) {
			console.log("updateMessageMid", message)
			const { id, mid, to } = message;
			store.dispatch(MessageActions.updateMessageMid(id, mid, to));
		},
		onDeliveredMessage: function (message) {
			console.log("onDeliveredMessage", message)
			const { mid, id } = message
			store.dispatch(
				MessageActions.updateMessageStatus(message, "received", id, mid)
			);
		},

		onPresence: (msg) => { },
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
			console.log("onGroupChange", event);
			const { to, from, groupName, gid } = event
			if (from === WebIM.conn.context.userId) {
				event.whoName = 'you'
			} else {
				event.whoName = ''
			}
			if (event.type === 'direct_joined') {
				store.dispatch(SessionActions.getJoinedGroupList())
				const storeSessionList = store.getState().session;
				const { sessionList } = storeSessionList;
				const isNewSession = _.findIndex(sessionList, (v) => {
					return v.sessionId === gid
				})
				if (isNewSession === -1) {
					addLocalMessage({
						to: gid,
						from: WebIM.conn.context.userId,
						chatType: 'groupChat',
						groupName,
						groupText: `You joined the group`,
						firstCrate: true,
						msgType: 'notify',
					})
				}
			} else if (event.type === 'joinPublicGroupSuccess') {
				const joinedGroup = store.getState().session.joinedGroups;
				const result = joinedGroup.find((item) => {
					item.groupid === event.gid
				})
				if (!result) {
					store.dispatch(SessionActions.getJoinedGroupList())
				}
			} else if (event.type === 'invite') {
				conversationName = groupName
			} else if (event.type === 'invite_accept') {
				const storeSessionList = store.getState().session;
				const { sessionList } = storeSessionList;
				const isNewSession = _.findIndex(sessionList, (v) => {
					return v.sessionId === gid
				})
				if (isNewSession === -1) {
					addLocalMessage({
						to: gid,
						from: WebIM.conn.context.userId,
						chatType: 'groupChat',
						groupName: conversationName,
						groupText: `You joined the group`,
						firstCrate: true,
						msgType: 'notify',
					})
				}
			} else if (event.type === "memberJoinPublicGroupSuccess") {
				event.actionContent = 'joined the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'deleteGroupChat') {
				//群组解散
				event.actionContent = 'dissolution the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'join') {
				// 进群
				event.actionContent = 'join the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'leave') {
				// 退群
				event.actionContent = 'leave the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'removedFromGroup') {
				//被移出群 或者被加入黑名单
				event.actionContent = 'ware removed the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'allow') {
				//被移除黑名单 当事人收到
				event.whoName = 'you'
				event.actionContent = 'ware removed the Block List'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'update') {
				// modifyGroup 修改群信息 触发
				event.actionContent = 'modify the Group Info'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'leaveGroup') {
				// ABSENCE （被移出群）
				event.actionContent = 'ware removed the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'changeOwner') {
				//转让群组 当事的两个人收到
				event.actionContent = 'becomes the new Group Owner'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'addAdmin') {
				//成为管理员，当事人收到
				event.actionContent = 'becomes the new Group Admin'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'removeAdmin') {
				//去除管理员 当事人收到
				event.actionContent = 'ware removed the new Group Admin'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'addMute') {
				//用户被管理员禁言 当事人收到
				event.actionContent = 'ware muted'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'removeMute') {
				//用户被解除禁言 当事人收到
				event.actionContent = 'ware removed muted'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'updateAnnouncement') {
				// 更新群公告
				event.actionContent = 'update Group Announcement'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'addUserToGroupWhiteList') {
				//增加群/聊天室组白名单成员
				event.actionContent = 'were added to Group Allow List'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'rmUserFromGroupWhiteList') {
				//删除群/聊天室白名单成员
				event.actionContent = 'were removed the Group Allow List'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'muteGroup') {
				//群组/聊天室一键禁言
				event.actionContent = 'muted the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			} else if (event.type === 'rmGroupMute') {
				//解除群组/聊天室一键禁言
				event.actionContent = 'removed muted the Group'
				store.dispatch(MessageActions.addNotify(event, "groupChat"));
			}
			if (event.type === 'addAdmin' || event.type === 'removeAdmin' || event.type === 'changeOwner') {
				const { chatType, to } = uikit_store.getState().global.globalProps;
				if (chatType === 'groupChat' && to === event.gid) {
					store.dispatch(ThreadActions.getCurrentGroupRole({ chatType, to }));
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
		onChatThreadChange: (msg) => {
			console.log("====thread change:", msg)
			store.dispatch(ThreadActions.updateThreadInfo(msg));
		},
		onMultiDeviceEvent: (msg) => {
			console.log("====thread mutiDeviceEvent：", msg)
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
			addLocalMessage({ to, from, chatType: 'singleChat', groupText: 'You agreed the friend request', firstCrate: true, addType: 'contactAdded' })
		},
		onCmdMessage: msg => {
			const { action } = msg
			switch (action) {
				case 'TypingBegin':
					store.dispatch(GlobalPropsActions.setShowTyping({ showTyping: true }))
					break;
				case 'TypingEnd':
					store.dispatch(GlobalPropsActions.setShowTyping({ showTyping: false }))
					break;
				default:
					break;
			}
			if (TimerId) {
				clearTimeout(TimerId)
			}
			TimerId = setTimeout(() => {
				store.dispatch(GlobalPropsActions.setShowTyping({ showTyping: false }))
			}, 5000)
		}
	});
}
