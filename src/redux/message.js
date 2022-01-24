import { formatLocalMessage, formatServerMessage } from '../utils/index'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
// import store from '../redux/index'
import WebIM from '../utils/WebIM';
import AppDB from '../utils/AppDB';
import i18next from "i18next";
import { message } from '../EaseChat/common/alert'



/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    byId: {},
    singleChat: {},
    groupChat: {},
    chatRoom: {},
    stranger: {},
    extra: {},
    unread: {
        singleChat: {},
        groupChat: {},
        chatRoom: {},
        stranger: {},
    }
})

/* -------- Types and Action Creators -------- */
const { Types, Creators } = createActions({
    addMessage: ['message', 'messageType'],
    deleteMessage: ['msgId', 'to', 'chatType'],
    updateMessageStatus: ['message', 'status'],
    clearUnread: ["chatType", "sessionId"],
    updateMessages: ["chatType", "sessionId", "messages"],
    updateMessageMid: ['id', 'mid'],
    

    // -async-
    sendTxtMessage: (to, chatType, message = {}) => {
        if (!to || !chatType) return
        return (dispatch, getState) => {
            const formatMsg = formatLocalMessage(to, chatType, message, 'txt')
            const { body, id } = formatMsg
            const { msg } = body
            const msgObj = new WebIM.message('txt', id)
            msgObj.set({
                to,
                msg,
                chatType,
                ext: message.ext,
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

    sendFileMessage: (to, chatType, file,fileEl) => {
        return (dispatch, getState) => {
            if (file.data.size > (1024 * 1024 * 10)) {
                message.error(i18next.t('The file exceeds the upper limit'))
                return
            }
            const formatMsg = formatLocalMessage(to, chatType, file, 'file')
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
                onFileUploadError: function (error) {
                    formatMsg.status = 'fail'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    fileEl.current.value =''
                },
                onFileUploadComplete: function (data) {
                    let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = formatMsg.body.url = url
                    formatMsg.status = 'sent'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                    dispatch(Creators.updateMessages(chatType, to, formatMsg))
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

    sendImgMessage: (to, chatType, file,imageEl) => {
        return (dispatch, getState) => {
            if (file.data.size > (1024 * 1024 * 10)) {
                message.error(i18next.t('The file exceeds the upper limit'))
                return
            }
            const formatMsg = formatLocalMessage(to, chatType, file, 'img')
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
                onFileUploadError: function (error) {
                    formatMsg.status = 'fail'
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                    imageEl.current.value = ''
                },
                onFileUploadComplete: function (data) {
                    let url = data.uri + '/' + data.entities[0].uuid
                    formatMsg.url = formatMsg.body.url = url
                    formatMsg.status = 'sent'
                    dispatch(Creators.updateMessages(chatType, to, formatMsg ))
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

    recallMessage: (to, chatType, msg) => {
        return (dispatch, getState) => {
            const { id, toJid, mid } = msg
            WebIM.conn.recallMessage({
                to: to,
                mid: toJid || mid, // message id
                type: chatType,
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
export const addMessage = (state, { message, messageType = 'txt' }) => {
    const rootState = uikit_store.getState()
    !message.status && (message = formatServerMessage(message, messageType))
    const username = WebIM.conn.context.userId
    const { id, to, status } = message
    let { chatType } = message
    const from = message.from || username
    const bySelf = from === username
    let chatId = bySelf || chatType !== 'singleChat' ? to : from
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
    msgId = msgId.mid || msgId
    let byId = state.getIn(['byId', msgId])
    let sessionType, chatId
    if (!byId) {
        return state
    } else {
        sessionType = byId.chatType
        chatId = byId.chatId
    }

    let messages = state.getIn([sessionType, chatId]).asMutable() || []
    let targetMsg = _.find(messages, { id: msgId })
    const index = messages.indexOf(targetMsg)
    messages.splice(index, 1, {
        ...targetMsg,
        body: {
            ...targetMsg.body,
            type: 'recall'
        }
    })
    state = state.setIn([sessionType, chatId], messages)
    AppDB.deleteMessage(msgId)
    return state

}

export const clearUnread = (state, { chatType, sessionId }) => {
    let data = state['unread'][chatType].asMutable()
    delete data[sessionId]
    return state.setIn(['unread', chatType], data)
}

export const fetchMessage = (state, { to, chatType, messages, offset }) => {
    let data = state[chatType] && state[chatType][to] ? state[chatType][to].asMutable() : []
    data = messages.concat(data)
    let historyById = {}
    messages.forEach((item) => {
        historyById[item.id] = { chatId: chatType === 'singleChat' ? item.from : item.to, chatType: item.chatType }
    })
    state = state.merge({ byId: historyById })
    state = state.setIn([chatType, to], data)
    return state
}

export const clearMessage = (state, { chatType, id }) => {
    return chatType ? state.setIn([chatType, id], []) : state
}

export const updateMessages = (state, { chatType, sessionId, messages }) => {
    let messagesArr = state.getIn([chatType, sessionId]).asMutable({ deep: true })
    messagesArr.forEach((msg) => {
        if (msg.id === messages.id){
            msg = messages
            AppDB.updateMessageUrl(msg.id, messages.url)
        }

    })
    return state.setIn([chatType, sessionId], messagesArr)
}

export const updateMessageMid = (state, { id, mid }) => {
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

    setTimeout(() => { AppDB.updateMessageMid(mid, Number(id)) }, 500)
    return state.setIn(['byMid', mid], { id })
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
})

export default Creators