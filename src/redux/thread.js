import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import AppDB from '../utils/AppDB';
import MessageActions from "./message";
import WebIM from "../utils/WebIM";

function getThreadList(options,state,dispatch){
    const cursor = state.threadListCursor;
    let paramsData = {
        groupId: options.groupId,
        limit: options.limit,
    }
    if (options.isScroll) {
        paramsData.cursor = cursor
    } else {
        dispatch(Creators.setThreadListEnd(false))
    }
    const getThreadFun = state.curGroupRole.role === 'member' ? 'getJoinedThreadsOfGroup' : 'getThreadsOfGroup';
    WebIM.conn[getThreadFun](paramsData).then((res) => {
        const threadList = res.entities;
        if (threadList.length === 0) {
            dispatch(Creators.setThreadListEnd(true));
            return
        }
        dispatch(Creators.setThreadListCursor(res.properties.cursor))
        let pArr = []
        for(let i = 0;i<threadList.length;i++){
            threadList[i].last_message = {}
            pArr.push(AppDB.findLastMessage(threadList[i].id).then((msg) => {
                threadList[i].last_message = msg
            }))
        }
        Promise.all(pArr).then(()=>{
            dispatch(Creators.setThreadList(threadList, options.isScroll))
        })
    })
}

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
    curGroupRole:{},//currentGrouprole{groupId:groupId,role: ''}
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
    setCurGroupRole: ['options'],
    getThreadsListOfGroup: (options) => {
        return  (dispatch) => {
            const rootState = uikit_store.getState()
            const { username } = _.get(rootState, ['global', 'globalProps'])
            const threadListEnd = _.get(rootState, ['thread', 'threadListEnd'])
            if (threadListEnd) return
            if(rootState.thread.curGroupRole.groupId === options.groupId){
                getThreadList(options,rootState.thread,dispatch);
                return
            }
            WebIM.conn.getGroupInfo({ groupId: options.groupId }).then(res => {
                const data = res.data ? res.data[0] : {};
                if (data.id === options.groupId && data.owner === username) {
                    if(data.owner === username){
                        dispatch(Creators.setCurGroupRole({groupId: options.groupId,role:'owner'}))
                    }
                }else {
                    WebIM.conn.getGroupAdmin({ groupId: options.groupId }).then((res) => {
                        if(res.data.indexOf(username) > -1 ){
                            dispatch(Creators.setCurGroupRole({groupId: options.groupId,role:'admin'}))
                        }else{
                            dispatch(Creators.setCurGroupRole({groupId: options.groupId,role:'member'}))
                        }
                    })
                }
                getThreadList(options,rootState.thread,dispatch)
                
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
                    if(msg.thread && msg.thread.operation === options.operation && msg.thread.timestamp>options.timestamp) return
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
export const setCurGroupRole = (state, { options }) => {
    return state = state.setIn(['curGroupRole'], options)
}


/* ------------- Hookup Reducers To Types ------------- */
export const threadReducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_THREAD_STATES]: updateThreadStates,
    [Types.SET_THREAD_LIST]: setThreadList,
    [Types.SET_SHOW_THREAD_LIST]: setShowThreadList,
    [Types.SET_IS_CREATING_THREAD]: setIsCreatingThread,
    [Types.SET_CURRENT_THREAD_INFO]: setCurrentThreadInfo,
    [Types.SET_THREAD_LIST_CURSOR]: setThreadListCursor,
    [Types.SET_THREAD_LIST_END]: setThreadListEnd,
    [Types.SET_CUR_GROUP_ROLE]: setCurGroupRole
});

export default Creators;
