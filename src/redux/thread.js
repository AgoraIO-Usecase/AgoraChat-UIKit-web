import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import AppDB from '../utils/AppDB';
import MessageActions from "./message";
import WebIM from "../utils/WebIM";

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    threadPanelStates: false,//是否展示thread部分面板
    threadList: [],
    threadListCursor: '',//thread列表下次请求标记
    threadListEnd: false,//是否请求全部数据
    showThreadList: false,//是否展示群组内的thread列表
    isCreatingThread: false,//是否正在创建thread
    currentThreadInfo: {},//点击消息查看thread信息、创建thread
    curGroupAdminAndOwner: {},//当前群组的adminList(list) 和owner(only one)
});

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    updateThreadStates: ["options"],
    setThreadList: ["threadList", "isScroll"],
    setShowThreadList: ['status'],
    setIsCreatingThread: ['status'],
    setCurrentThreadInfo: ['message'],
    setThreadListCursor: ['cursor'],
    setThreadListEnd: ['status'],
    getThreadsListOfGroup: (options) => {
        return (dispatch) => {
            // var promise = new Promise(function (resolve, reject) {
            //     resolve([
            //         { id: '2', name: 'thread-first', owner: 'echo', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
            //         { id: '222', name: 'thread222-测试名字超级长阿斯顿福建的时刻拉飞机奥斯卡地sfdsafsadfsadfd方', owner: 'lucy', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
            //         { id: '333', name: 'third thread', owner: 'zhang','msgId': '123456765',groupId: '1234',created: '1647502554746' },
            //         { id: '444', name: 'fourth thread', owner: 'zhang', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
            //     ])
            //   });
            const rootState = uikit_store.getState()
            const { username } = _.get(rootState, ['global', 'globalProps'])
            const cursor = _.get(rootState, ['thread', 'threadListCursor'])
            const threadListEnd = _.get(rootState, ['thread', 'threadListEnd'])
            let groupOwner = '';
            if (threadListEnd) return
            WebIM.conn.getGroupInfo({ groupId: options.groupId }).then(res => {
                const data = res.data ? res.data[0] : {};
                if (data.id === options.groupId) {
                    groupOwner = data.owner
                }
                WebIM.conn.getGroupAdmin({ groupId: options.groupId }).then((res) => {
                    const isAdmin = (res.data.indexOf(username) > -1 || username === groupOwner) ? true : false;
                    let paramsData = {
                        groupId: options.groupId,
                        limit: options.limit,
                    }
                    if (options.isScroll) {
                        paramsData.cursor = cursor
                    } else {
                        dispatch(Creators.setThreadListEnd(false))
                    }
                    if (isAdmin) {
                        WebIM.conn.getThreadsOfGroup(options).then((res) => {
                            const threadList = res.entities;
                            if (threadList.length === 0) {
                                dispatch(Creators.setThreadListEnd(true));
                                return
                            }
                            dispatch(Creators.setThreadListCursor(res.properties.cursor))
                            threadList.forEach((item) => {
                                item.lastMessage = {}
                                AppDB.findLastMessage(item.id).then((msg) => {
                                    item.lastMessage = msg
                                }).then(() => {
                                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                                })
                            })
                        })
                    } else {
                        WebIM.conn.getJoinedThreadsOfGroup(paramsData).then((res) => {
                            const threadList = res.entities;
                            if (threadList.length === 0) {
                                dispatch(Creators.setThreadListEnd(true));
                                return
                            }
                            dispatch(Creators.setThreadListCursor(res.properties.cursor))
                            threadList.forEach((item) => {
                                item.lastMessage = {}
                                AppDB.findLastMessage(item.id).then((msg) => {
                                    item.lastMessage = msg
                                }).then(() => {
                                    dispatch(Creators.setThreadList(threadList, options.isScroll))
                                })
                            })
                        })
                    }
                })
            })

        }
    },
    updateThreadInfo: (options) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            const { currentThreadInfo } = rootState.thread;
            let messageList = _.get(rootState, ['message', 'groupChat', options.muc_parent_id]).asMutable({ deep: true });
            messageList.forEach((msg) => {
                if (msg.id === options.msg_parent_id && !msg.bySelf || msg.mid === options.msg_parent_id && msg.bySelf) {
                    if (options.operation === 'delete') {//delete thread
                        msg.thread = undefined;
                        if (options.msg_parent_id === currentThreadInfo.thread.id) {
                            dispatch(Creators.updateThreadStates(false))
                        }
                    } else {//other operation
                        if (!msg.thread || JSON.stringify(msg.thread) === "{}") {//create
                            msg.thread = options;
                        } else {//update_msg or recall_msg or update threadName
                            msg.thread = Object.assign(msg.thread, options)
                        }
                    }
                    //update Local database
                    AppDB.updateMessageThread(msg.id, msg.thread)
                    //update currentThreadInfo
                    dispatch(Creators.setCurrentThreadInfo(msg))
                }
            })
            dispatch(MessageActions.updateThreadDetails('groupChat', options.muc_parent_id, messageList))
        }
    },
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
export const setShowThreadList = (state, { status }) => {
    return state.merge({ showThreadList: status })
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


/* ------------- Hookup Reducers To Types ------------- */
export const threadReducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_THREAD_STATES]: updateThreadStates,
    [Types.SET_THREAD_LIST]: setThreadList,
    [Types.SET_SHOW_THREAD_LIST]: setShowThreadList,
    [Types.SET_IS_CREATING_THREAD]: setIsCreatingThread,
    [Types.SET_CURRENT_THREAD_INFO]: setCurrentThreadInfo,
    [Types.SET_THREAD_LIST_CURSOR]: setThreadListCursor,
    [Types.SET_THREAD_LIST_END]: setThreadListEnd
});

export default Creators;
