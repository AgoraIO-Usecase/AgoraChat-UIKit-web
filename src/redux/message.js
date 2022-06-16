import { formatLocalMessage, formatServerMessage } from "../utils/index";
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
// import store from '../redux/index'
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";
import i18next from "i18next";
import { message } from '../EaseChat/common/alert'


function isAdded(reactionOp) {
	let added = null
	let currentLoginUser = WebIM.conn.context.userId;
	reactionOp.forEach((item) => {
		if (item.reactionType === "create") {
			if (item.operator === currentLoginUser) {
				added = true
			}
		} else {
			if (item.operator === currentLoginUser) {
				added = false
			}
		}
	})
	return added
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    byId: {},
    singleChat: {},
    groupChat: {},
    chatRoom: {},
    stranger: {},
    threadMessage:{},
    extra: {},
    unread: {
        singleChat: {},
        groupChat: {},
        chatRoom: {},
        stranger: {},
    },
    threadHistoryStart:-1,
    threadHasHistory:true,
})

/* -------- Types and Action Creators -------- */
const { Types, Creators } = createActions({
	addMessage: ["message", "messageType"],
	deleteMessage: ["msgId", "to", "chatType"],
	updateMessageStatus: ["message", "status", "localId", "serverMsgId"],
	clearUnread: ["chatType", "sessionId"],
	updateMessages: ["chatType", "sessionId", "messages"],
	updateReactionData: ["message", "reaction"],
    updateMessageMid: ['id', 'mid', 'to'],
    updateThreadDetails: ['chatType','options','messageList'],
    updateThreadMessage: ['to','messageList','isScroll'],
    setThreadHistoryStart:['start'],
    setThreadHasHistory: ['status'],
	updateNotifyDetails: ["formatMsg"],

	// -async-
	sendTxtMessage: (to, chatType, message = {}, isChatThread=false) => {
		if (!to || !chatType) return
		return (dispatch, getState) => {
			const formatMsg = formatLocalMessage(to, chatType, message, 'txt', isChatThread)
			const { msg } = formatMsg.body;
			let option = {
				chatType,
				type: 'txt',
				to,
				msg,
				isChatThread,
			};
			let msgObj = WebIM.message.create(option);
			formatMsg.id = msgObj.id;
			WebIM.conn.send(msgObj).then((res) => {
				console.log("send private text Success",res);
				let { localMsgId, serverMsgId } = res;
				dispatch(Creators.updateMessageStatus(formatMsg, "sent", localMsgId, serverMsgId));
			}).catch((e) => {
				console.log("Send private text error", e);
				dispatch(Creators.updateMessageStatus(formatMsg, "fail",msgObj.id));
			});
			dispatch(Creators.addMessage(formatMsg))
		}
	},

	sendFileMessage: (to, chatType, file, fileEl, isChatThread=false) => {
		return (dispatch, getState) => {
			if (file.data.size > (1024 * 1024 * 10)) {
				message.error(i18next.t('The file exceeds the upper limit'))
				return
			}
			const formatMsg = formatLocalMessage(to, chatType, file, 'file', isChatThread)
			let option = {
				chatType,
				type: "file",
				to,
				file: file,
				filename: file.filename,
				isChatThread,
				ext: {
					file_length: file.data.size,
					file_type: file.data.type,
				},
				onFileUploadError: function (e) {
					console.log("onFileUploadError",e);
					formatMsg.status = "fail";
					dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
					fileEl.current.value = "";
				},
				onFileUploadProgress: function (progress) {
					console.log(progress);
				},
				onFileUploadComplete: function (data) {
					console.log("onFileUploadComplete");
					let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = formatMsg.body.url = url;
					const type = isChatThread? 'threadMessage' : chatType;
					dispatch(Creators.updateMessages(type, to, formatMsg ));
                    fileEl.current.value ='';
				},
			};
			let msg = WebIM.message.create(option);
			formatMsg.id = msg.id;
			WebIM.conn.send(msg).then((res) => {
				let { localMsgId, serverMsgId } = res;
				console.log("success");
				formatMsg.status = "sent";
				dispatch(Creators.updateMessageStatus(formatMsg, "sent", localMsgId, serverMsgId));
				fileEl.current.value = "";
			}).catch((e) => {
				console.log("fail",e);
				dispatch(Creators.updateMessageStatus(formatMsg, "fail",msg.id));
				fileEl.current.value = "";
			});
			dispatch(Creators.addMessage(formatMsg, 'file'))
		}
	},

	sendImgMessage: (to, chatType, file, imageEl, isChatThread=false) => {
		return (dispatch, getState) => {
			if (file.data.size > (1024 * 1024 * 10)) {
				message.error(i18next.t('The file exceeds the upper limit'))
				return
			}
			const formatMsg = formatLocalMessage(to, chatType, file, 'img', isChatThread)
			let option = {
				chatType,
				type: "img",
				to,
				file: file,
				isChatThread,
				onFileUploadError: function () {
					console.log("onFileUploadError");
					formatMsg.status = "fail";
					dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
					imageEl.current.value = "";
				},
				onFileUploadProgress: function (progress) {
					console.log(progress);
				},
				onFileUploadComplete: function (data) {
					console.log("onFileUploadComplete", data);
					let url = data.uri + "/" + data.entities[0].uuid;
					formatMsg.url = url;
					formatMsg.body.url = url;
					formatMsg.thumb = data.thumb
					formatMsg.body.thumb = data.thumb
					const type = isChatThread? 'threadMessage' : chatType;
					dispatch(Creators.updateMessages(type, to, formatMsg ));
					imageEl.current.value = "";
				},
			};
			let msg = WebIM.message.create(option);
			formatMsg.id = msg.id;
			WebIM.conn.send(msg).then((res) => {
				console.log("Success");
				let { localMsgId, serverMsgId } = res;
				formatMsg.status = "sent";
				dispatch(Creators.updateMessageStatus(formatMsg, "sent", localMsgId, serverMsgId));
			}).catch((e) => {
				console.log("Fail");
				dispatch(Creators.updateMessageStatus(formatMsg, "fail",  msg.id));
				imageEl.current.value = "";
			});
			dispatch(Creators.addMessage(formatMsg, 'img'))
		}
	},

	sendVideoMessage: (to, chatType, file, videoEl, isChatThread=false) => {
		return (dispatch, getState) => {
			if (file.data.size > (1024 * 1024 * 10)) {
				message.error(i18next.t('The video exceeds the upper limit'))
				return
			}
			let allowType = {
				'mp4': true,
				'wmv': true,
				'avi': true,
				'rmvb': true,
				'mkv': true
			};
			if (file.filetype.toLowerCase() in allowType) {
				const formatMsg = formatLocalMessage(to, chatType, file, "video", isChatThread);
				let option = {
					chatType,
					type: "video",
					to,
					file: file,
					filename: file.filename,
					isChatThread,
					ext: {
						file_length: file.data.size,
						file_type: file.data.type,
					},
					onFileUploadError: function () {
						console.log("onFileUploadError");
						formatMsg.status = "fail";
						dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
						videoEl.current.value = "";
					},
					onFileUploadProgress: function (e) {
						console.log(e);
					},
					onFileUploadComplete: function (data) {
						console.log("onFileUploadComplete");
						let url = data.uri + "/" + data.entities[0].uuid;
						formatMsg.url = url;
						formatMsg.body.url = url;
						const type = isChatThread? 'threadMessage' : chatType;
						dispatch(Creators.updateMessages(type, to, formatMsg ));
						videoEl.current.value = "";
					},
				};
				let msg = WebIM.message.create(option);
				formatMsg.id = msg.id;
				WebIM.conn.send(msg).then((res) => {
					console.log("Success");
					let { localMsgId, serverMsgId } = res;
					formatMsg.status = "sent";
					dispatch(Creators.updateMessageStatus(formatMsg, "sent", localMsgId, serverMsgId));
				}).catch((e) => {
					console.log("Fail");
					dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
					videoEl.current.value = "";
				});
				dispatch(Creators.addMessage(formatMsg, "video"));
			}
		}
	},
    sendRecorder: (to, chatType, file, isChatThread = false ) => {
		return (dispatch, getState) => {
			if (file.data.size > 1024 * 1024 * 10) {
				message.error(i18next.t("The file exceeds the upper limit"));
				return;
			}
			const formatMsg = formatLocalMessage(to, chatType, file, "audio", isChatThread);
			let option = {
				chatType,
				type: "audio",
				to,
				file: file,
				filename: file.filename,
				length: file.length,
				isChatThread,
				ext: {
					file_length: file.data.size,
					file_type: file.data.type,
					length: file.length,
					duration: file.duration,
				},
				onFileUploadError: function (error) {
					console.log("onFileUploadError",error);
					formatMsg.status = "fail";
					dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
				},
				onFileUploadProgress: function (e) {
					console.log(e);
				},
				onFileUploadComplete: function (data) {
					console.log("onFileUploadComplete");
					let url = data.uri + "/" + data.entities[0].uuid;
					formatMsg.url = url;
					formatMsg.body.url = url;
                    const type = isChatThread? 'threadMessage' : chatType;
					dispatch(Creators.updateMessages(type, to, formatMsg ));
				},
			};
			let msg = WebIM.message.create(option);
			formatMsg.id = msg.id;
			WebIM.conn.send(msg).then((res) => {
				console.log("success");
				let { localMsgId, serverMsgId } = res;
				formatMsg.status = "sent";
				dispatch(Creators.updateMessageStatus(formatMsg, "sent", localMsgId, serverMsgId));
			}).catch((e) => {
				console.log("fail");
				dispatch(Creators.updateMessageStatus(formatMsg, "fail", msg.id));
			});
			dispatch(Creators.addMessage(formatMsg, "audio"));
		};
	},
    recallMessage: (to, chatType, msg, isChatThread = false) => {
        return (dispatch, getState) => {
            const { id, toJid, mid } = msg
            WebIM.conn.recallMessage({
                to: to,
                mid: toJid || mid || id, // message id
                type: chatType,
                isChatThread,
                success: () => {
                    dispatch(Creators.deleteMessage(id, to, chatType))
                },
                fail: (err) => {
                    console.log(err)
                }
            })
        }
    },

    clearUnreadAsync: (chatType, sessionId) => {
        return (dispatch) => {
            dispatch({ 'type': 'CLEAR_UNREAD', chatType, sessionId })
            AppDB.readMessage(chatType, sessionId)
        }
    },
    fetchMessage: (to, chatType, offset, cb) => {
        return (dispatch) => {
            AppDB.fetchMessage(to, chatType, offset).then(res => {
                if (res.length) {
                    dispatch({
                        'type': 'FETCH_MESSAGE',
                        'chatType': chatType,
                        'to': to,
                        'messages': res
                    })
                }
                cb && cb(res.length)
            })
        }
    },
    fetchThreadMessage: (to, cb, isScroll) => {
        const rootState = uikit_store.getState();
        const username = WebIM.conn.context.userId;
        if(!rootState.message.threadHasHistory && isScroll) return
        return (dispatch) => {
            let options = {
                targetId: to,
                cursor: isScroll ? rootState.message.threadHistoryStart : -1,
                pageSize: 20,
                chatType: 'groupChat',
                searchDirection: 'down',
            }
            WebIM.conn.getHistoryMessages(options).then((res)=>{
                let msgList = res.messages;
                if(msgList.length < options.pageSize || msgList.length === 0){
                    dispatch(Creators.setThreadHasHistory(false));
                }
                const newMsgList  = [];
                if(msgList.length>0) {
                    msgList.forEach((item)=>{
                        let msg = formatServerMessage(item, item.type);
                        msg.bySelf = msg.from === username;
                        newMsgList.push(msg)
                    })
                    dispatch(Creators.setThreadHistoryStart(res.cursor));
                    dispatch(Creators.updateThreadMessage(to,newMsgList,isScroll));
                }
                cb && cb(newMsgList.length);
            })
        }
    },
    clearMessage: (chatType, id) => {
        return (dispatch) => {
            dispatch({ 'type': 'CLEAR_MESSAGE', 'chatType': chatType, 'id': id })
            AppDB.clearMessage(chatType, id).then(res => { })
        }
    },

	addAudioMessage: (message, bodyType) => {
		return (dispatch, getState) => {
			let options = {
				url: message.url,
				headers: {
					Accept: "audio/mp3",
				},
				onFileDownloadComplete: function (response) {
					let objectUrl = WebIM.utils.parseDownloadResponse.call(
						WebIM.conn,
						response
					);
					message.audioSrcUrl = message.url;
					message.url = objectUrl;
					dispatch(Creators.addMessage(message, bodyType));
				},
				onFileDownloadError: function () {},
			};
			WebIM.utils.download.call(WebIM.conn, options);
		};
	},

	addReactions: (msg, reaction) => {
		return (dispatch, getState) => {
			WebIM.conn.addReaction({ messageId: msg.id, reaction}).then((res) => {
			}).catch((e) => {
				message.error('add reaction fail')
			})
		}
	},
	deleteReaction: (msg, reaction) => {
		return (dispatch, getState) => {
			WebIM.conn.deleteReaction({messageId: msg.id, reaction}).then(() => {
			}).catch((e) => {
				message.error('delete reaction fail')
			})
		}
	},
	updateReaction: (message) => {
		const {messageId, chatType, from ,to, reactions} = message

		return (dispatch, getState) => {
			const state = getState().message
			const byId = state.getIn(["byId", messageId]);
			if(!byId && messageId){
				AppDB.findMessageById(messageId).then((res) => {
					const dbMessage = res[0]
					let msgReactions = dbMessage?.reactions || []
					// if(!msgReactions) return;
					let newReactions = []
					reactions.map((item => {
						let reactionOp = item.op || [];
						let added = isAdded(reactionOp)

						msgReactions.forEach((msgReaction) => {
							if (msgReaction.reaction === item.reaction && msgReaction.isAddedBySelf) {
								item.isAddedBySelf = msgReaction.isAddedBySelf
							}
						})
						if (added) {
							item.isAddedBySelf = true
						} else if (added === false) {
							item.isAddedBySelf = false
						}

						if(item.count > 0){
							newReactions.push(item)
						}
					}))
					dispatch(Creators.updateReactionData(message, newReactions))

				})
			}else{
				dispatch(Creators.updateReactionData(message))
			}
		}
	},

	addNotify: (message, notifyType) => {
		const { from, gid } = message
		return (dispatch, getState) => {
			const formatMsg = formatLocalMessage(gid, notifyType, message, 'notify')
			formatMsg.from = from;
			formatMsg.type = 'notify',
			dispatch(Creators.updateNotifyDetails(formatMsg))
		}
	}
});

/* ------------- Reducers ------------- */
export const addMessage = (state, { message, messageType = "txt" }) => {
	const rootState = uikit_store.getState();
	!message.status && (message = formatServerMessage(message, messageType));
	const username = WebIM.conn.context.userId;
	const { id, to, status, isChatThread, chatThread } = message;
	let { chatType } = message;
	const from = message.from || username;
	const bySelf = from === username;
	let chatId = bySelf || chatType !== "singleChat" ? to : from;
	if(isChatThread || (chatThread && JSON.stringify(chatThread)!=='{}')){
        if(state.threadHasHistory) return state
        //The message is sent byself when isChatThread is true or the chatThread is not null when receiving a thread message
        //save the thread message  indexDB & threadMessageList
        const chatData = state.getIn(['threadMessage', chatId], Immutable([])).asMutable()
        const _message = {
            ...message,
            bySelf,
            isChatThread:true,//is thread message
            time: +new Date(),
            status: status
        }
        let isPushed = false
        chatData.forEach(m => {
            if (m.id === _message.id) {
                isPushed = true
            }
        })

        !isPushed && chatData.push(_message)
        state = state.setIn(['threadMessage', chatId], chatData)
        !isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0, isChatThread)
		state = state.setIn(["byId", id], { chatType, chatId });
        return state
    }
	const chatData = state.getIn([chatType, chatId], Immutable([])).asMutable();
	const _message = {
		...message,
		bySelf,
		time: +new Date(),
		status: status,
	};
	if (_message.chatType === "chatRoom" && bySelf) {
		const oid = state.getIn(["byMid", _message.id, "id"]);
		if (oid) {
			_message.id = oid;
		}
	}
	let isPushed = false;
	chatData.forEach((m) => {
		if (m.id === _message.id) {
			isPushed = true;
		}
	});
console.log(_message, '_message')
	!isPushed && chatData.push(_message);
	// add a message to db, if by myselt, isUnread equals 0
	!isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0);

	const maxCacheSize = _.includes(["groupChat", "chatRoom"], chatType)
		? WebIM.config.groupMessageCacheSize
		: WebIM.config.p2pMessageCacheSize;
	if (chatData.length > maxCacheSize) {
		const deletedChats = chatData.splice(
			maxCacheSize,
			chatData.length - maxCacheSize
		);
		let byId = state.getIn(["byId"]);
		byId = _.omit(byId, _.map(deletedChats, "id"));
		state = state.setIn(["byId"], byId);
	}
	state = state.setIn([chatType, chatId], chatData);

	// unread
	const currentSession = _.get(rootState, ["session", "currentSession"]);
	const addSingleChatUnread =
		!bySelf &&
		!isPushed &&
		message.from !== currentSession &&
		(chatType === "singleChat" || chatType === "strager");
	const addGroupUnread =
		!bySelf &&
		!isPushed &&
		message.to !== currentSession &&
		(chatType === "groupChat" || chatType === "chatRoom");
	if (addSingleChatUnread || addGroupUnread) {
		let count = state.getIn(["unread", chatType, chatId], 0);
		state = state.setIn(["unread", chatType, chatId], ++count);
	}

	state = state.setIn(["byId", id], { chatType, chatId });

	return state;
};

export const updateThreadMessage = (state,{to,messageList,isScroll}) =>{
    let data = state['threadMessage'][to] ? state['threadMessage'][to].asMutable() : []
    data = data.concat(messageList)
    if(isScroll === "scroll"){
        state = state.setIn(['threadMessage', to], data)
    }else{
        state = state.setIn(['threadMessage'], {})
        state = state.setIn(['threadMessage', to], messageList)
    }
    return state
}

export const updateMessageStatus = (state, { message, status = "", localId, serverMsgId }) => {
	console.log(message, status, localId, serverMsgId, 'messages', state)
	let id = localId;
	const byId = state.getIn(["byId", id]);
	if (!_.isEmpty(byId)) {
		const { chatType, chatId } = byId;
		let messages = []
		if(message.isChatThread){
			messages = state.getIn(['threadMessage', chatId]).asMutable();
		}else{
			messages = state.getIn([chatType, chatId]).asMutable();
		}
		let found = _.find(messages, { id: id }) || _.find(messages, { id: serverMsgId });
		console.log(found, 'found')
		found.setIn(["status"], status);
		let msg = {
			...found,
			status: status,
		};
		messages.splice(messages.indexOf(found), 1, msg);
		AppDB.updateMessageStatus(id, serverMsgId, status).then(res => {
			if (res === 0) {
				AppDB.updateMessageStatus(serverMsgId, id, status).then(val => {
					if (val === 0) {
						AppDB.updateMessageStatus(id, serverMsgId, status).then(value => {
							console.log(value)
						})
					}
				})
			}
		})
		
		if(message.isChatThread){
			state = state.setIn(['threadMessage', chatId], messages)
		}else{
			state = state.setIn([chatType, chatId], messages)
		}
		return state
	}
	return state;
}

export const deleteMessage = (state, { msgId, to, chatType }) => {
	msgId = msgId.mid || msgId;
	let byId = state.getIn(["byId", msgId]);
	let sessionType, chatId;
    //update the mid of  thread message 
    const rootState = uikit_store.getState()
    if(state.threadMessage[to]){
        let threadMsg = {}
        const threadMsgList = state.getIn(['threadMessage', to]).asMutable({ deep: true })
        threadMsg = _.find(threadMsgList, { id: msgId })
        const index = threadMsgList.indexOf(threadMsg);
        //update threadMessageList and indexDB
        if(threadMsg && threadMsg.id){
            threadMsgList.splice(index, 1, {
                ...threadMsg,
                body: {
                    ...threadMsg.body,
                    type: "recall",
                },
            });
            state = state.setIn(['threadMessage',to],threadMsgList);
            AppDB.deleteMessage(msgId);
            return state
        }
    }
	if (!byId) {
		return state;
	} else {
		sessionType = byId.chatType;
		chatId = byId.chatId;
	}

	let messages = state.getIn([sessionType, chatId]).asMutable() || [];
	let targetMsg = _.find(messages, { id: msgId });
	const index = messages.indexOf(targetMsg);
	messages.splice(index, 1, {
		...targetMsg,
		body: {
			...targetMsg.body,
			type: "recall",
		},
	});
	state = state.setIn([sessionType, chatId], messages);
	AppDB.deleteMessage(msgId);
	return state;
};

export const clearUnread = (state, { chatType, sessionId }) => {
	let data = state["unread"][chatType].asMutable();
	delete data[sessionId];
	return state.setIn(["unread", chatType], data);
};

export const fetchMessage = (state, { to, chatType, messages, offset }) => {
	let data =
		state[chatType] && state[chatType][to]
			? state[chatType][to].asMutable()
			: [];
	data = messages.concat(data);
	let historyById = {};
	messages.forEach((item) => {
		historyById[item.id] = {
			chatId: chatType === "singleChat" ? item.from : item.to,
			chatType: item.chatType,
		};
	});
	state = state.merge({ byId: historyById });
	state = state.setIn([chatType, to], data);
	return state;
};

export const clearMessage = (state, { chatType, id }) => {
	return chatType ? state.setIn([chatType, id], []) : state;
};

export const updateMessages = (state, { chatType, sessionId, messages }) => {
	let messagesArr = state
		.getIn([chatType, sessionId])
		.asMutable({ deep: true });
	messagesArr.forEach((msg,index) => {
		if (msg.id === messages.id) {
			messages.bySelf = true;
			messagesArr.splice(index, 1, messages);
			AppDB.updateMessageUrl(msg.id, messages.url);
		}
	});
	return state.setIn([chatType, sessionId], messagesArr);
};

export const updateMessageMid = (state, { id, mid,to }) => {
	if(state.threadMessage[to]){
        let threadMsg = {}
        const threadMsgList = state.getIn(['threadMessage', to]).asMutable({ deep: true })
        threadMsg = _.find(threadMsgList, { id: id })
        if(threadMsg && threadMsg.id){
            threadMsg.toJid = mid;
            threadMsg.id = mid;
            state = state.setIn(['threadMessage',to],threadMsgList)
        }
		AppDB.updateMessageMid(mid, id);
		return state
    }
	const byId = state.getIn(["byId", id]);
    if(!byId) return state // callkit 发的消息 uikit拿不到 id
	if (!_.isEmpty(byId)) {
		const { chatType, chatId } = byId;
		let messages = state
			.getIn([chatType, chatId])
			.asMutable({ deep: true });
		let found = _.find(messages, { id: id });
		found.id = mid;
		found.toJid = mid;
		found.mid = mid;
		// let msg = found.setIn(['toJid'], mid)
		messages.splice(messages.indexOf(found), 1, found);
		state = state.setIn([chatType, chatId], messages);
		state = state.setIn(["byMid", mid], { id });
		state = state.setIn(["byId", mid], { chatType, chatId })
	}
	AppDB.updateMessageMid(mid, id);
	return state;
}

export const updateReactionData = (state, { message, reaction }) => {
	console.log('updateReactionData>>>', message, reaction);
	let { messageId, from, to, reactions, chatType } = message;
	let newReactionsData = reactions

	let currentLoginUser = WebIM.conn.context.userId;

	let addReactionUser = currentLoginUser === from ? to : from;

	if(chatType === 'groupChat'){addReactionUser = to}

	if (!messageId) messageId = state.getIn(["byMid", message.mid, "messageId"])
	let mids = state.getIn(["byMid"]) || {};
	let mid;
	for (var i in mids) {
		if (mids[i].messageId === messageId) {
			mid = i;
		}
	}

	const byId = state.getIn(["byId", messageId]);

	function calculateUserList(reactions = []){
		reactions.forEach((item) => {
			if(item.op){
				item.op.forEach((operator) => {
					if(operator.reactionType === 'create' && (!item.userList.includes(operator.operator))){
						item.userList.push(operator.operator)
					}
					if(operator.reactionType === 'delete'){
						item.userList.forEach((user, index) => {
							if(user === operator.operator){
								item.userList.splice(index, 1)
							}
						})
					}
				})
			}
		})
	}

	function mergeArray (arr1, arr2){
      var _arr = new Array()
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i])
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i] === arr1[j]) {
            flag = false
            break
          }
        }
        if (flag) {
          _arr.push(arr2[i])
        }
      }
      return _arr
    }
	const isThreadMessage = state.threadMessage[to]? true: false;
	if (byId || isThreadMessage) {
		let messages = {};
		let chatType = '';
		if(isThreadMessage){
			chatType = message.chatType;
			messages = state.getIn(['threadMessage', to]).asMutable({ deep: true })
		}else{
			chatType = byId.chatType;
			messages = state.getIn([chatType, addReactionUser]).asMutable();
		}
		// const { chatType } = byId;
		// let messages = state.getIn([chatType, addReactionUser]).asMutable();
		let found = _.find(messages, { id: messageId })
		let { reactions } = found;
		let newReactions = [];
		newReactionsData.map((item => {
			let reactionOp = item?.op || [];
			let added = isAdded(reactionOp)
			reactions && reactions.forEach((msgReaction) => {
				if (msgReaction.reaction === item.reaction) {
					
					item.userList = mergeArray(item.userList, msgReaction.userList)
					if(msgReaction.isAddedBySelf){
						item.isAddedBySelf = msgReaction.isAddedBySelf
					}
				}
			})

			if (added) {
				item.isAddedBySelf = true
			} else if (added === false) {
				item.isAddedBySelf = false
			}

			if(item.count > 0){
				newReactions.push(item)
			}
		}))
		calculateUserList(newReactions)

		let msg = {
			...found,
			reactions: newReactions,
		};
		messages.splice(messages.indexOf(found), 1, msg);
		AppDB.updateMessageReaction(messageId, msg.reactions).then((res) => { });
		if(isThreadMessage){
			state = state.setIn(['threadMessage',to],messages);
		}else{
			state = state.setIn([chatType, addReactionUser], messages);
		}
		return state
		// return state.setIn([chatType, addReactionUser], messages);
	}else{
		calculateUserList(reaction)
		// state 里没有这条消息，更新数据库里消息的 reation
		AppDB.updateMessageReaction(messageId, reaction)
	}
	return state;
};
export const updateThreadDetails = (state, {chatType,options,messageList}) => {
    const {operation,parentId} = options;
    if(operation === 'create'){
        const formatMsg = formatLocalMessage(parentId, chatType,{}, 'threadNotify');
        const message = {
            ...formatMsg,
            from:options.operator,
            name:options.name,
            time:options.createTimestamp,
            threadId:options.id
        }
        messageList.push(message);
        AppDB.addMessage(message)
    }
    return state.setIn([chatType, parentId], messageList)
}

export const setThreadHistoryStart = (state, {start}) => {
    return state.setIn(['threadHistoryStart'], start);
}
export const setThreadHasHistory = (state, {status}) => {
    return state.setIn(['threadHasHistory'], status)
}

export const updateNotifyDetails = (state, { formatMsg }) => {
	let { chatType, to, id ,type} = formatMsg;
	let messageList = state[chatType][to].asMutable({ deep: true });
	const message = {
		...formatMsg,
		body: {
			type
		}
	}
	AppDB.addMessage(message)
	messageList.push(message);
	state = state.setIn([chatType, to], messageList);
	return state
}
/* ------------- Hookup Reducers To Types ------------- */

export const messageReducer = createReducer(INITIAL_STATE, {
    [Types.ADD_MESSAGE]: addMessage,
    [Types.DELETE_MESSAGE]: deleteMessage,
    [Types.CLEAR_UNREAD]: clearUnread,
    [Types.FETCH_MESSAGE]: fetchMessage,
    [Types.CLEAR_MESSAGE]: clearMessage,
    [Types.UPDATE_MESSAGES]: updateMessages,
    [Types.UPDATE_MESSAGE_MID]: updateMessageMid,
    [Types.UPDATE_MESSAGE_STATUS]: updateMessageStatus,
    [Types.UPDATE_THREAD_DETAILS]: updateThreadDetails,
    [Types.UPDATE_THREAD_MESSAGE]: updateThreadMessage,
    [Types.SET_THREAD_HISTORY_START]: setThreadHistoryStart,
    [Types.SET_THREAD_HAS_HISTORY]: setThreadHasHistory,
	[Types.UPDATE_REACTION_DATA]: updateReactionData,
	[Types.UPDATE_NOTIFY_DETAILS]: updateNotifyDetails,


})

export default Creators;

