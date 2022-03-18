import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import AppDB from '../utils/AppDB';
import MessageActions from "./message";

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    threadPanelStates: false,//是否展示thread部分面板
    threadList: [],
    showThreadList: false,//是否展示群组内的thread列表
    isCreatingThread: false,//是否正在创建thread
    currentThreadInfo: {},//点击消息查看thread信息、创建thread
});

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    updateThreadStates: ["options"],
    setThreadList: ["threadList"],
    setShowThreadList: ['status'],
    setIsCreatingThread: ['status'],
    setCurrentThreadInfo: ['message'],
    setCurrentThreadName: ['options'],
    getThreadsListOfGroup: () => {
        return (dispatch) => { 
            var promise = new Promise(function (resolve, reject) {
                resolve([
                    { id: '2', name: 'thread-first', owner: 'echo', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
                    { id: '222', name: 'thread222-测试名字超级长阿斯顿福建的时刻拉飞机奥斯卡地sfdsafsadfsadfd方', owner: 'lucy', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
                    { id: '333', name: 'third thread', owner: 'zhang','msgId': '123456765',groupId: '1234',created: '1647502554746' },
                    { id: '444', name: 'fourth thread', owner: 'zhang', 'msgId': '123456765',groupId: '1234',created: '1647502554746' },
                ])
              });
            promise.then((threadList)=>{
                //更新最新的消息
                threadList.forEach((item)=>{
                    item.lastMessage = {}
                    AppDB.findLastMessage(item.id).then((msg)=>{
                        item.lastMessage = msg
                    }).then(()=>{
                        dispatch(Creators.setThreadList(threadList))
                    })
                })
            })
            //调取sdk接口获取用户角色 管理员-获取群组下的所有thread  群成员-获取已加入的thread
            // WebIM.conn.getThreadsOfGroup().then((threadList) => {
            //     threadList.forEach((item)=>{
            //         item.lastMessage = {}
            //         AppDB.findLastMessage(item.id).then((msg)=>{
            //             item.lastMessage = msg
            //         }).then(()=>{
            //             dispatch(Creators.setThreadList(threadList))
            //         })
            //     })
            // })
        }
    },
    updateThreadInfo: (options) => {
        return (dispatch) => {
            const rootState = uikit_store.getState();
            let messageList = _.get(rootState, ['message', options.chatType, options.groupId]).asMutable({ deep: true });
            messageList.forEach((msg) => {
                if (msg.id === options.messageId) {
                    if(options.operation === 'delete'){//删除thread
                        msg.thread = undefined;
                        dispatch(Creators.updateThreadStates(false))
                    }else{//更新thread
                        if (!msg.thread || JSON.stringify(msg.thread) === "{}") {
                            msg.thread = options.thread;
                        } else {
                            //更新msg thread 的相关字段
                            msg.thread = Object.assign(msg.thread, options.thread)
                        }
                    }
                    //更新本地数据库
                    AppDB.updateMessageThread(msg.id, msg.thread)
                    //更新currentThreadInfo
                    dispatch(Creators.setCurrentThreadInfo(msg))
                }
            })
            dispatch(MessageActions.updateThreadDetails(options.chatType, options.groupId,messageList))
        }
    },
});



/* ------------- Reducers ------------- */
export const setThreadMessage = (state, {theadId,message}) => {
    let data = state[threadMessage][theadId] ? state[threadMessage][theadId].asMutable():[];
    data = data.concat(message);
    return state.setIn([threadMessage, theadId], data);
}
export const updateThreadStates = (state, { options }) => {
    state = state.setIn(["threadPanelStates"], options);
    return state
};
export const setThreadList = (state, { threadList }) => {
    state = state.merge({threadList} )
    return  state
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
export const setCurrentThreadName = (state, { options }) => {
    state = state.setIn(['currentThreadInfo', 'name'], options.name)
    return state
}

/* ------------- Hookup Reducers To Types ------------- */
export const threadReducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_THREAD_STATES]: updateThreadStates,
    [Types.SET_THREAD_LIST]: setThreadList,
    [Types.SET_SHOW_THREAD_LIST]: setShowThreadList,
    [Types.SET_IS_CREATING_THREAD]: setIsCreatingThread,
    [Types.SET_CURRENT_THREAD_INFO]: setCurrentThreadInfo,
    [Types.SET_CURRENT_THREAD_NAME]: setCurrentThreadName,
});

export default Creators;
