import { formatLocalMessage, formatServerMessage } from "../utils/index";
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
// import store from '../redux/index'
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";
import i18next from "i18next";
import { message } from '../EaseChat/common/alert'

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
    addMessage: ['message', 'messageType'],
    deleteMessage: ['msgId', 'to', 'chatType'],
    updateMessageStatus: ['message', 'status'],
    clearUnread: ["chatType", "sessionId"],
    updateMessages: ["chatType", "sessionId", "messages"],
    updateMessageMid: ['id', 'mid', 'to'],
    updateThreadDetails: ['chatType','groupId','messageList'],
    updateThreadMessage: ['to','messageList','isScroll'],
	addReactions: ["message", "reaction"],
	deleteReaction: ["message", "reaction"],
    setThreadHistoryStart:['start'],
    setThreadHasHistory: ['status'],
    

    // -async-
    sendTxtMessage: (to, chatType, message = {}, isThread=false) => {
        if (!to || !chatType) return
        return (dispatch, getState) => {
            const formatMsg = formatLocalMessage(to, chatType, message, 'txt', isThread)
            const { body, id } = formatMsg
            const { msg } = body
            const msgObj = new WebIM.message('txt', id)
            msgObj.set({
                to,
                msg,
                chatType,
                ext: message.ext,
                isThread,
                success: () => {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                },
                fail: (e) => {
                    console.error("Send private text error", e);
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                }
            })
            WebIM.conn.send(msgObj.body)
            dispatch(Creators.addMessage(formatMsg))
        }
    },

    sendFileMessage: (to, chatType, file,fileEl, isThread=false) => {
        return (dispatch, getState) => {
            if (file.data.size > (1024 * 1024 * 10)) {
                message.error(i18next.t('The file exceeds the upper limit'))
                return
            }
            const formatMsg = formatLocalMessage(to, chatType, file, 'file', isThread)
            const { id } = formatMsg
            const msgObj = new WebIM.message('file', id)
            msgObj.set({
                ext: {
                    file_length: file.data.size,
                    file_type: file.data.type
                },
                file: file,
                to,
                chatType,
                isThread,
                onFileUploadError: function (error) {
                    formatMsg.status = 'fail'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    fileEl.current.value =''
                },
                onFileUploadComplete: function (data) {
                    let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = url
                    formatMsg.body.url = url
                    formatMsg.status = 'sent'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                    // dispatch(Creators.updateMessages(chatType, to, formatMsg))
                    if(isThread){
                        dispatch(Creators.updateMessages('threadMessage', to, formatMsg ))
                    }else{
                        dispatch(Creators.updateMessages(chatType, to, formatMsg ))
                    }
                    fileEl.current.value =''
                },
                fail: function () {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    fileEl.current.value =''
                },
            })
            WebIM.conn.send(msgObj.body)
            dispatch(Creators.addMessage(formatMsg, 'file'))
        }
    },

    sendImgMessage: (to, chatType, file,imageEl, isThread=false) => {
        return (dispatch, getState) => {
            if (file.data.size > (1024 * 1024 * 10)) {
                message.error(i18next.t('The file exceeds the upper limit'))
                return
            }
            const formatMsg = formatLocalMessage(to, chatType, file, 'img', isThread)
            const { id } = formatMsg
            const msgObj = new WebIM.message('img', id)
            msgObj.set({
                ext: {
                    file_length: file.data.size,
                    file_type: file.data.type
                },
                file: file,
                to,
                chatType,
                isThread,
                onFileUploadError: function (error) {
                    formatMsg.status = 'fail'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    imageEl.current.value = ''
                },
                onFileUploadComplete: function (data) {
                    let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = url
                    formatMsg.body.url = url
                    formatMsg.status = 'sent'
                    // dispatch(Creators.updateMessages(chatType, to, formatMsg ))
                    if(isThread){
                        dispatch(Creators.updateMessages('threadMessage', to, formatMsg ))
                    }else{
                        dispatch(Creators.updateMessages(chatType, to, formatMsg ))
                    }
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                    imageEl.current.value = ''
                },
                fail: function () {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    imageEl.current.value = ''
                },
            })
            WebIM.conn.send(msgObj.body)
            dispatch(Creators.addMessage(formatMsg, 'img'))
        }
    },

    sendRecorder: (to, chatType, file) => {
        return (dispatch, getState) => {
            if (file.data.size > (1024 * 1024 * 10)) {
                message.error(i18next.t('The file exceeds the upper limit'))
                return
            }
            const formatMsg = formatLocalMessage(to, chatType, file, 'audio')
            const { id } = formatMsg
            const msgObj = new WebIM.message('audio', id)
            msgObj.set({
                ext: {
                    file_length: file.data.size,
                    file_type: file.data.type,
                    length: file.length,
                    duration: file.duration
                },
                file: file,
                length:file.length,
                file_length:file.data.size,
                to,
                chatType,
                onFileUploadError: function (error) {
                    console.log(error)
                    // dispatch(Creators.updateMessageStatus(pMessage, "fail"))
                    formatMsg.status = 'fail'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                },
                onFileUploadComplete: function (data) {
                    let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = url
                    formatMsg.body.url = url
                    formatMsg.status = 'sent'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                    dispatch(Creators.updateMessages(chatType, to, formatMsg))
                },
                fail: function () {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                },
            })

            WebIM.conn.send(msgObj.body)
            dispatch(Creators.addMessage(formatMsg, 'audio'))
        }
    },

    sendVideoMessage: (to, chatType, file,videoEl) => {
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
                const formatMsg = formatLocalMessage(to, chatType, file, 'video')
                const { id } = formatMsg
                const msgObj = new WebIM.message('video', id)
                msgObj.set({
                    ext: {
                        file_length: file.data.size,
                        file_type: file.data.type,
                    },
                    file: file,
                    length:file.length,
                    file_length:file.data.size,
                    to,
                    chatType,
                    onFileUploadError: function (error) {
                        formatMsg.status = 'fail'
                        dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                        videoEl.current.value =''
                    },
                    onFileUploadComplete: function (data) {
                        let url = data.uri + '/' + data.entities[0].uuid
                        formatMsg.url = url
                        formatMsg.body.url = url
                        formatMsg.status = 'sent'
                        dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                        dispatch(Creators.updateMessages(chatType, to, formatMsg))
                        videoEl.current.value =''
                    },
                    fail: function () {
                        dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                        videoEl.current.value =''
                    },
                })
                WebIM.conn.send(msgObj.body)
                dispatch(Creators.addMessage(formatMsg, 'video'))
            }
        }
    },

    recallMessage: (to, chatType, msg, isThread = false) => {
        return (dispatch, getState) => {
            const { id, toJid, mid } = msg
            WebIM.conn.recallMessage({
                to: to,
                mid: toJid || mid, // message id
                type: chatType,
                isThread,
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
                queue: to,
                start: isScroll ? rootState.message.threadHistoryStart : -1,
                pull_number: 20,
                isGroup: true,
                format: true,
                is_positive: true,
            }
            WebIM.conn.getHistoryMessages(options).then((res)=>{
                let msgList = res.msgs;
                const newMsgList  = [];
                if(msgList.length>0) {
                    msgList.forEach((item)=>{
                        let msg = formatServerMessage(item, item.type);
                        msg.bySelf = msg.from === username;
                        newMsgList.push(msg)
                    })
                    dispatch(Creators.setThreadHistoryStart(res.next_key));
                    dispatch(Creators.updateThreadMessage(to,newMsgList,isScroll));
                    if(newMsgList.length < options.pull_number || newMsgList.length === 0){
                        dispatch(Creators.setThreadHasHistory(false));
                    }
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
                    Accept: 'audio/mp3'
                },
                onFileDownloadComplete: function (response) {
                    let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response)
                    message.audioSrcUrl = message.url
                    message.url = objectUrl
                    dispatch(Creators.addMessage(message, bodyType))
                },
                onFileDownloadError: function () {
                }
            }
            WebIM.utils.download.call(WebIM.conn, options)
        }
    },
})

/* ------------- Reducers ------------- */
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

export const addMessage = (state, { message, messageType = 'txt' }) => {
    const rootState = uikit_store.getState()
    !message.status && (message = formatServerMessage(message, messageType))
    const username = WebIM.conn.context.userId
    const { id, to, status, isThread, thread } = message
    let { chatType } = message
    // where the message comes from, when from current user, it is null
    const from = message.from || username
    // bySelf is true when sent by current user, otherwise is false
    const bySelf = from === username
    // root id: when sent by current user or in group chat, is id of receiver. Otherwise is id of sender
    let chatId = bySelf || chatType !== 'singleChat' ? to : from
    if(isThread || (thread && JSON.stringify(thread)!=='{}')){
        if(state.threadHasHistory) return state
        //The message is sent byself when isThread is true or the thread is not null when receiving a thread message
        //save the thread message  indexDB & threadMessageList
        const chatData = state.getIn(['threadMessage', chatId], Immutable([])).asMutable()
        const _message = {
            ...message,
            bySelf,
            isThread:true,//is thread message
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
        !isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0,isThread)
        return state
    }
    const chatData = state.getIn([chatType, chatId], Immutable([])).asMutable()
    const _message = {
        ...message,
        bySelf,
        time: +new Date(),
        status: status
    }
    if (_message.chatType === 'chatRoom' && bySelf) {
        const oid = state.getIn(['byMid', _message.id, 'id'])
        if (oid) {
            _message.id = oid
        }
    }
    let isPushed = false
    chatData.forEach(m => {
        if (m.id === _message.id) {
            isPushed = true
        }
    })

    !isPushed && chatData.push(_message)
    // add a message to db, if by myselt, isUnread equals 0
    !isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0)

    const maxCacheSize = _.includes(['groupChat', 'chatRoom'], chatType) ? WebIM.config.groupMessageCacheSize : WebIM.config.p2pMessageCacheSize
    if (chatData.length > maxCacheSize) {
        const deletedChats = chatData.splice(maxCacheSize, chatData.length - maxCacheSize)
        let byId = state.getIn(['byId'])
        byId = _.omit(byId, _.map(deletedChats, 'id'))
        state = state.setIn(['byId'], byId)
    }

    state = state.setIn([chatType, chatId], chatData)

    // unread
    const currentSession = _.get(rootState, ['session', 'currentSession'])
    const addSingleChatUnread = !bySelf && !isPushed && message.from !== currentSession && (chatType === 'singleChat' || chatType === 'strager')
    const addGroupUnread = !bySelf && !isPushed && message.to !== currentSession && (chatType === 'groupChat' || chatType === 'chatRoom')
    if (addSingleChatUnread || addGroupUnread) {
        let count = state.getIn(['unread', chatType, chatId], 0)
        state = state.setIn(['unread', chatType, chatId], ++count)
    }

    state = state.setIn(['byId', id], { chatType, chatId })
    return state
}

export const updateMessageStatus = (state, { message, status = '' }) => {
    let { id } = message
    if (!id) id = state.getIn(['byMid', message.mid, 'id'])
    let mids = state.getIn(['byMid']) || {}
    let mid
    for (var i in mids) {
        if (mids[i].id === id) {
            mid = i
        }
    }
    const byId = state.getIn(['byId', id])
    if (!_.isEmpty(byId)) {
        const { chatType, chatId } = byId
        let messages = state.getIn([chatType, chatId]).asMutable()
        let found = _.find(messages, { id: id })
        found.setIn(['status'], status)
        found.setIn(['toJid'], mid)
        let msg = {
            ...found,
            status: status,
            toJid: mid
        }
        messages.splice(messages.indexOf(found), 1, msg)
        setTimeout(() => {
            AppDB.updateMessageStatus(id, status).then(res => { })
        }, 1000)

        return state.setIn([chatType, chatId], messages)
    }
    return state
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
    //update currentThreadInfo after recalling group message
    if(msgId === rootState.thread.currentThreadInfo?.id){
        const newMsg = {
            thread_overview :rootState.thread.currentThreadInfo.thread_overview
        }
        rootState.thread = rootState.thread.setIn(['currentThreadInfo'],newMsg)
    }
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
	messagesArr.forEach((msg) => {
		if (msg.id === messages.id) {
			msg = messages;
			AppDB.updateMessageUrl(msg.id, messages.url);
		}
	});
	return state.setIn([chatType, sessionId], messagesArr);
};

export const updateMessageMid = (state, { id, mid,to }) => {
    const byId = state.getIn(['byId', id])
    if (!_.isEmpty(byId)) {
        const { chatType, chatId } = byId
        let messages = state.getIn([chatType, chatId]).asMutable({ deep: true })
        let found = _.find(messages, { id: id })
        found.toJid = mid
        found.mid = mid
        // let msg = found.setIn(['toJid'], mid)
        messages.splice(messages.indexOf(found), 1, found)
        state = state.setIn([chatType, chatId], messages)
    }
    setTimeout(() => { AppDB.updateMessageMid(mid, id) }, 500)
    //update the mid of thread message 
    if(state.threadMessage[to]){
        let threadMsg = {}
        const threadMsgList = state.getIn(['threadMessage', to]).asMutable({ deep: true })
        threadMsg = _.find(threadMsgList, { id: id })
        if(threadMsg && threadMsg.id){
            threadMsg.toJid = mid;
            threadMsg.mid = mid;
            state = state.setIn(['threadMessage',to],threadMsgList)
            return state
        }
    }
    return state.setIn(['byMid', mid], { id })
}
export const updateThreadDetails = (state, {chatType,groupId,messageList}) => {
    return state.setIn([chatType, groupId], messageList)
}
export const addReactions = (state, { message, reaction }) => {
	let { id, to, from } = message;
	// TODO 回调会提供一个添加 reaction 的 from
	let addReactionUser = "999222";
	let currentLoginUser = WebIM.conn.context.userId;
	let sessionId = currentLoginUser === to ? from : to;
	if (!id) id = state.getIn(["byMid", message.mid, "id"]);
	let mids = state.getIn(["byMid"]) || {};
	let mid;
	for (var i in mids) {
		if (mids[i].id === id) {
			mid = i;
		}
	}
	const byId = state.getIn(["byId", id]);
	if (!_.isEmpty(byId)) {
		const { chatType } = byId;
		let messages = state.getIn([chatType, sessionId]).asMutable();
		let found = _.find(messages, { id: id });
		let reactionMsgs = found?.reactions || [];
		
		let existReaction = _.find(reactionMsgs, { reaction: reaction });
		let reactionList = [];
		found.setIn(["reactions"], reactionList);
		if (reactionMsgs.length > 0) {
			let newFount = reactionMsgs.filter((item) => item.reaction !== reaction);
			let { userList } = existReaction || '';
			let myReaction = userList && userList.includes(currentLoginUser);
			if (existReaction && myReaction) {
				reactionList = [...reactionMsgs];
			} else if (existReaction && !myReaction) {
				let newUserList = existReaction.userList.concat(currentLoginUser);
				let newCount = existReaction.count + 1;
				reactionList = _.concat(newFount, [
					{
						reaction: reaction,
						userList: newUserList,
						status: true,
						count: newCount,
					},
				]);
			} else {
				reactionList = _.concat(newFount, [
					{
						reaction: reaction,
						userList: [currentLoginUser],
						status: true,
						count: 1,
					},
				]);
			}
		} else {
			reactionList = [
				{
					reaction: reaction,
					userList: [currentLoginUser],
					status: true,
					count: 1,
				},
			];
		}
		let msg = {
			...found,
			reactions: reactionList,
		};
		messages.splice(messages.indexOf(found), 1, msg);
		AppDB.updateMessageReaction(id, msg.reactions).then((res) => {});

		return state.setIn([chatType, sessionId], messages);
	}
	return state;
};

export const deleteReaction = (state, { message, reaction }) => {
	let { id, from, to } = message;
	let currentLoginUser = WebIM.conn.context.userId;
	let sessionId = currentLoginUser === to ? from : to;
	const byId = state.getIn(["byId", id]);
	const { chatType } = byId;
	let messages = state.getIn([chatType, sessionId]).asMutable({ deep: true });
	let found = _.find(messages, { id: id });
	let reactionMsgs = found.reactions || [];
	let newFount = reactionMsgs.filter((item) => item.reaction !== reaction);
	let existReaction = _.find(reactionMsgs, {reaction: reaction,});
	let reactionList = [];
	if (reactionMsgs.length > 0) {
		let { reaction, userList, count } = existReaction;
		let myReaction = userList.includes(currentLoginUser);
		if (existReaction && myReaction) {
			if (count > 1) {
				reactionList = _.concat(newFount, [
					{
						reaction: reaction,
						userList: userList.filter(
							(item) => item !== currentLoginUser
						),
						status: false,
						count: count - 1,
					},
				]);
			} else {
				reactionList = [...newFount];
			}
		} else {
			reactionList = [...newFount];
		}
	}
	const index = messages.indexOf(found);
	messages.splice(index, 1, {
		...found,
		reactions: reactionList,
	});
	state = state.setIn([chatType, sessionId], messages);
	AppDB.deleteReactions(id, reactionList);
	return state;
};
export const setThreadHistoryStart = (state, {start}) => {
    return state.setIn(['threadHistoryStart'], start);
}
export const setThreadHasHistory = (state, {status}) => {
    return state.setIn(['threadHasHistory'], status)
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
    [Types.ADD_REACTIONS]: addReactions,
	[Types.DELETE_REACTION]: deleteReaction,
    [Types.SET_THREAD_HISTORY_START]: setThreadHistoryStart,
    [Types.SET_THREAD_HAS_HISTORY]: setThreadHasHistory,
})

export default Creators;
