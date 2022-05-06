import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import AppDB from '../utils/AppDB';
import MessageActions from "./message";
import WebIM from "../utils/WebIM";
import { message } from '../EaseChat/common/alert'
import i18next from "i18next";

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    showThread: true,//thread entry
    hasThreadEditPanel: false,
    threadPanelStates: false,//show thread panel
    threadList: [],
    threadListCursor: '',//Tag for request thread list
    threadListEnd: false,//Are all data requested
    isCreatingThread: false,//Whether it is creating thread
    currentThreadInfo: {},
    threadOriginalMsg: {},
    curGroupRole: {},//currentGrouprole 'admin' 'member' 'owner'
    threadListPanelDisplay: false,//show thread panel
});

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setShowThread: ["status"],
    updateThreadStates: ["options"],
    setThreadList: ["threadList", "isScroll"],
    setIsCreatingThread: ['status'],
    setCurrentThreadInfo: ['message'],
    setThreadOriginalMsg: ['message'],
    setThreadListCursor: ['cursor'],
    setThreadListEnd: ['status'],
    setCurGroupRole: ['options'],
    setHasThreadEditPanel: ['status'],
    setThreadListPanelDisplay: ['status'],

    getCurrentGroupRole: (options) => {
        return (dispatch) => {
            const { sessionType, sessionId } = options;
            if (sessionType !== "groupChat") return
            const groupId = sessionId;
            const rootState = uikit_store.getState();
            const { username } = _.get(rootState, ['global', 'globalProps']);
            WebIM.conn.getGroupInfo({ groupId }).then(res => {
                let role = 'member'
                const data = res.data ? res.data[0] : {};
                if (data.id === groupId && data.owner === username) {
                    if (data.owner === username) {
                        role = 'owner';
                        dispatch(Creators.setCurGroupRole(role))
                    }
                } else {
                    WebIM.conn.getGroupAdmin({ groupId }).then((res) => {
                        if (res.data.indexOf(username) > -1) {
                            role = 'admin';
                        }
                        dispatch(Creators.setCurGroupRole(role))
                    })
                }
            })
        }
    },
    getThreadsListOfGroup: (options) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { threadListEnd, curGroupRole, threadListCursor } = _.get(rootState, ['thread']);
            if (threadListEnd) return
            const getThreadFun = curGroupRole === 'member' ? 'getJoinedChatThreads' : 'getChatThreads';
            let paramsData = {
                parentId: options.groupId,
                pageSize: options.limit,
            }
            options.isScroll ? paramsData.cursor = threadListCursor : null;
            WebIM.conn[getThreadFun](paramsData).then((res) => {
                const threadList = res.entities;
                if (threadList.length === 0) {
                    dispatch(Creators.setThreadListEnd(true));
                    if(!options.isScroll){
                        dispatch(Creators.setThreadList(threadList, options.isScroll))
                    }
                    return
                }
                dispatch(Creators.setThreadListCursor(res.properties.cursor));
                const chatThreadIds = threadList.map((item) => item.id);
                WebIM.conn.getChatThreadLastMessage({ chatThreadIds }).then((res) => {
                    const msgList = res.entities;
                    threadList.forEach((item) => {
                        let found = msgList.find(msgInfo => item.id === msgInfo.chatThreadId);
                        item.lastMessage = found && found.lastMessage ? found.lastMessage : {}
                    })
                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                }).catch(() => {
                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                })
            })
        }
    },
    updateThreadInfo: (options) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { currentThreadInfo, threadOriginalMsg } = rootState.thread;
            const { operation, messageId } = options;
            const groupChat = rootState['message']['groupChat'];
            let chatThreadOverview = {};
            if(operation === 'userRemove' || operation === 'destroy'){
                chatThreadOverview = undefined;
            }else if(operation === 'create' || operation === 'update'){
                chatThreadOverview = Object.assign({},options,{source:'notify'})
            }
            //handle the threadPanel and warn
            if ((operation === 'userRemove' || operation === 'destroy') && currentThreadInfo?.id === options.id) {
                dispatch(Creators.updateThreadStates(false));
                dispatch(Creators.setCurrentThreadInfo({}));
                const warnText = operation === 'userRemove' ? i18next.t('You have been removed from the thread') : i18next.t('The thread has been disbanded')
                message.warn(warnText);
            }else if(currentThreadInfo.id === options.id || threadOriginalMsg.id === options.messageId || threadOriginalMsg.mid === options.messageId) {
                const info = currentThreadInfo.asMutable({ deep: true});
                //othrer create the chatThread of the message
                if(operation === 'create'){
                    if(WebIM.conn.context.userId!== options.operator){
                        dispatch(Creators.updateThreadStates(false));
                        dispatch(Creators.setCurrentThreadInfo({}));
                        dispatch(Creators.setThreadOriginalMsg({}));
                        message.warn(i18next.t('Someone else created a thread for this message'));
                    }else{
                        //update the owner
                        dispatch(Creators.setCurrentThreadInfo(Object.assign({}, info,{owner: chatThreadOverview.operator})));
                    }
                }
                //create 事件下发时间大部分晚于update，收到create不处理，防止覆盖 messageCount 字段
                if(operation === 'update' || operation === 'create' && info.timestamp < options.timestamp){
                    dispatch(Creators.setCurrentThreadInfo(Object.assign({}, info,chatThreadOverview)));
                }
                dispatch(Creators.setIsCreatingThread(false));
            }
            //update Local database
            AppDB.findLocalMessage('groupChat', messageId).then((res) => {
                let msg = res.length === 1 ? res[0] : {};
                const info = msg.chatThreadOverview && chatThreadOverview ? msg.chatThreadOverview: {}
                //create 事件下发时间大部分晚于update，收到create不处理，防止覆盖 messageCount 字段
                if(operation === 'destroy'){
                    AppDB.updateMessageThread(messageId, undefined)
                }else if(operation !== 'create' || operation === 'create' && info.timestamp < options.timestamp){
                    AppDB.updateMessageThread(messageId, Object.assign({}, info, chatThreadOverview))
                }
            })
            //handler messageList
            if (groupChat && groupChat[options.parentId]) {
                let messageList = _.get(groupChat, [options.parentId]).asMutable({ deep: true });
                messageList.forEach((msg) => {
                    if (msg.id === messageId || msg.mid === messageId) {
                        const info = msg.chatThreadOverview && chatThreadOverview? msg.chatThreadOverview: {}
                        if(operation === 'destroy'){
                            msg.chatThreadOverview = undefined;
                        }else if(operation !== 'create' || operation === 'create' && info.timestamp < options.timestamp){
                            msg.chatThreadOverview = Object.assign({}, info, chatThreadOverview)
                        }
                    }
                })
                dispatch(MessageActions.updateThreadDetails('groupChat', options, messageList));
            }

            //update threadList
            const threadList = _.get(rootState, ['thread', 'threadList'], Immutable([])).asMutable()
            let found = _.find(threadList, { id: options.id });
            if (!found) return;
            if (operation === 'update') {
                let newThread = {
                    ...found,
                    name: options.name
                }
                options.last_message ? newThread.last_message = options.last_message : null;
                threadList.splice(threadList.indexOf(found), 1, newThread)
            } else {// 'threadUpdated' 'threadDestroyed'  'threadUserRemoved';
                threadList.splice(threadList.indexOf(found), 1)
            }
            dispatch(Creators.setThreadList(threadList))
        }
    },
    //thread member received changed
    updateMultiDeviceEvent: (msg) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { currentThreadInfo } = rootState.thread;
            if ((msg.operation === 'chatThreadLeave') && currentThreadInfo?.id === msg.chatThreadId) {
                dispatch(Creators.updateThreadStates(false))
            }
        }
    }
});



/* ------------- Reducers ------------- */
export const setThreadMessage = (state, { theadId, message }) => {
    let data = state[threadMessage][theadId] ? state[threadMessage][theadId].asMutable() : [];
    data = data.concat(message);
    return state.setIn([threadMessage, theadId], data);
}
export const setShowThread = (state, { status }) => {
    return state.setIn(["showThread"], status);
}
export const updateThreadStates = (state, { options }) => {
    return state.setIn(["threadPanelStates"], options);
};
export const setThreadList = (state, { threadList, isScroll }) => {
    let data = state['threadList'].asMutable()
    data = data.concat(threadList)
    if (isScroll) {
        state = state.setIn(['threadList'], data)
    } else {
        state = state.setIn(['threadList'], threadList)
    }
    return state
}
export const setIsCreatingThread = (state, { status }) => {
    return state.merge({ isCreatingThread: status })
}
export const setCurrentThreadInfo = (state, { message }) => {
    return state.merge({ currentThreadInfo: message });
}
export const setThreadOriginalMsg = (state, { message }) => {
    return state.merge({ threadOriginalMsg: message });

}
export const setThreadListCursor = (state, { cursor }) => {
    return state.setIn(['threadListCursor'], cursor)
}
export const setThreadListEnd = (state, { status }) => {
    return state.setIn(['threadListEnd'], status)
}
export const setCurGroupRole = (state, { options }) => {
    return state.setIn(['curGroupRole'], options)
}
export const setHasThreadEditPanel = (state, { status }) => {
    return state.setIn(['hasThreadEditPanel'], status)
}
export const setThreadListPanelDisplay = (state, { status }) => {
    return state.setIn(['threadListPanelDisplay'], status)
}


/* ------------- Hookup Reducers To Types ------------- */
export const threadReducer = createReducer(INITIAL_STATE, {
    [Types.SET_SHOW_THREAD]: setShowThread,
    [Types.UPDATE_THREAD_STATES]: updateThreadStates,
    [Types.SET_THREAD_LIST]: setThreadList,
    [Types.SET_IS_CREATING_THREAD]: setIsCreatingThread,
    [Types.SET_CURRENT_THREAD_INFO]: setCurrentThreadInfo,
    [Types.SET_THREAD_ORIGINAL_MSG]: setThreadOriginalMsg,
    [Types.SET_THREAD_LIST_CURSOR]: setThreadListCursor,
    [Types.SET_THREAD_LIST_END]: setThreadListEnd,
    [Types.SET_CUR_GROUP_ROLE]: setCurGroupRole,
    [Types.SET_HAS_THREAD_EDIT_PANEL]: setHasThreadEditPanel,
    [Types.SET_THREAD_LIST_PANEL_DISPLAY]: setThreadListPanelDisplay
});

export default Creators;
