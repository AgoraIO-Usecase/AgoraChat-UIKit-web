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
    hasThreadEditPanel: false,
    threadPanelStates: false,//show thread panel
    threadList: [],
    threadListCursor: '',//Tag for request thread list
    threadListEnd: false,//Are all data requested
    isCreatingThread: false,//Whether it is creating thread
    currentThreadInfo: {},
    curGroupRole: {},//currentGrouprole 'admin' 'member' 'owner'
    threadListPanelDisplay: false,//show thread panel
});

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    updateThreadStates: ["options"],
    setThreadList: ["threadList", "isScroll"],
    setIsCreatingThread: ['status'],
    setCurrentThreadInfo: ['message'],
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
            const getThreadFun = curGroupRole === 'member' ? 'getJoinedThreadsOfGroup' : 'getThreadsOfGroup';
            let paramsData = {
                groupId: options.groupId,
                limit: options.limit,
            }
            if (options.isScroll) {
                paramsData.cursor = threadListCursor
            }
            WebIM.conn[getThreadFun](paramsData).then((res) => {
                const threadList = res.entities;
                if (threadList.length === 0) {
                    dispatch(Creators.setThreadListEnd(true));
                    return
                }
                dispatch(Creators.setThreadListCursor(res.properties.cursor))
                let threadIdList = [];
                threadList.forEach((item) => {
                    threadIdList.push(item.id)
                })
                WebIM.conn.getThreadLastMsg({ threadIds: threadIdList }).then((res) => {
                    const msgList = res.entities;
                    threadList.forEach((item) => {
                        let found = msgList.find(msgInfo => item.id === msgInfo.thread_id);
                        item.last_message = found && found.last_message ? found.last_message : {}
                    })
                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                }).catch(()=>{
                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                })
            })
        }
    },
    updateThreadInfo: (options) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { currentThreadInfo } = rootState.thread;
            let messageList = _.get(rootState, ['message', 'groupChat', options.muc_parent_id]).asMutable({ deep: true });
            const { operation, msg_parent_id } = options
            messageList.forEach((msg) => {
                if (msg.id === msg_parent_id || msg.mid === msg_parent_id) {
                    if (msg.thread_overview && msg.thread_overview.operation === operation && msg.thread_overview.timestamp > options.timestamp) return
                    if (operation === 'delete') {//delete thread
                        msg.thread_overview = undefined;
                        if (currentThreadInfo.thread_overview?.id === options.id) {
                            dispatch(Creators.updateThreadStates(false))
                            message.warn(i18next.t('The thread has been disbanded'))
                        }
                    } else {//other operation
                        if (!msg.thread_overview || JSON.stringify(msg.thread_overview) === "{}") {//create
                            msg.thread_overview = options;
                        } else {//update_msg or recall_msg or update threadName
                            msg.thread_overview = Object.assign(msg.thread_overview, options)
                        }
                    }
                    //update Local database
                    AppDB.updateMessageThread(msg.id, msg.thread_overview)
                    //update currentThreadInfo when thread created(update) by self or others
                    if ((operation === 'create' || operation === 'update') && currentThreadInfo.mid === options.msg_parent_id || currentThreadInfo.id === options.msg_parent_id) {
                        dispatch(Creators.setCurrentThreadInfo(msg))
                        //change edit status of thread
                        dispatch(Creators.setIsCreatingThread(false));
                    }
                }
            })
            dispatch(MessageActions.updateThreadDetails('groupChat', options, messageList));

            //update threadList
            //options.operation: 'create'，'update'，'delete'，'update_msg'，'recall_msg'
            const threadList = _.get(rootState, ['thread', 'threadList'], Immutable([])).asMutable()
            let found = _.find(threadList, { id: options.id });
            if (!found) return;
            let newThread = {};
            switch (operation) {
                case 'create': {
                    break;
                }
                case 'update': {
                    newThread = {
                        ...found,
                        name: options.name
                    }
                    break;
                }
                case 'delete': {
                    newThread = {}
                    break;
                }
                case 'update_msg': {
                    newThread = {
                        ...found,
                        last_message: options.last_message
                    }
                    break;
                }
                case 'recall_msg': {
                    if (JSON.stringify(options.last_message) === "{}") {
                        newThread = {
                            ...found,
                            last_message: options.last_message
                        }
                    } else {
                        newThread = found
                    }
                    break;
                }
                default:
                    break;
            }
            if (JSON.stringify(newThread) === '{}') {
                threadList.splice(threadList.indexOf(found), 1)
                dispatch(Creators.setThreadList(threadList))
            } else if (JSON.stringify(newThread) !== '{}') {
                threadList.splice(threadList.indexOf(found), 1, newThread)
                dispatch(Creators.setThreadList(threadList))
            }
        }
    },
    //thread member received changed
    updateaThreadMember: (msg) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { currentThreadInfo } = rootState.thread;
            if (msg.type === 'threadKick' && currentThreadInfo.thread_overview?.id === msg.threadId) {
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
export const updateThreadStates = (state, { options }) => {
    state = state.setIn(["threadPanelStates"], options);
    return state
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
    return state.merge({ currentThreadInfo: message })
}
export const setThreadListCursor = (state, { cursor }) => {
    return state = state.setIn(['threadListCursor'], cursor)
}
export const setThreadListEnd = (state, { status }) => {
    return state = state.setIn(['threadListEnd'], status)
}
export const setCurGroupRole = (state, { options }) => {
    return state = state.setIn(['curGroupRole'], options)
}
export const setHasThreadEditPanel = (state, { status }) => {
    return state = state.setIn(['hasThreadEditPanel'], status)
}
export const setThreadListPanelDisplay = (state, { status }) => {
    return state = state.setIn(['threadListPanelDisplay'], status)
}


/* ------------- Hookup Reducers To Types ------------- */
export const threadReducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_THREAD_STATES]: updateThreadStates,
    [Types.SET_THREAD_LIST]: setThreadList,
    [Types.SET_IS_CREATING_THREAD]: setIsCreatingThread,
    [Types.SET_CURRENT_THREAD_INFO]: setCurrentThreadInfo,
    [Types.SET_THREAD_LIST_CURSOR]: setThreadListCursor,
    [Types.SET_THREAD_LIST_END]: setThreadListEnd,
    [Types.SET_CUR_GROUP_ROLE]: setCurGroupRole,
    [Types.SET_HAS_THREAD_EDIT_PANEL]: setHasThreadEditPanel,
    [Types.SET_THREAD_LIST_PANEL_DISPLAY]: setThreadListPanelDisplay
});

export default Creators;
