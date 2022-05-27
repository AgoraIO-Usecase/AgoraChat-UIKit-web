import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import AppDB from '../utils/AppDB';
import WebIM from '../utils/WebIM';
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setSessionList: ['sessionList'],
    setCurrentSession: ['userId'],
    topSession: ['sessionId', 'sessionType', 'message'],
    deleteSession: ['sessionId'],
    pushSession:['session'],
    setJoinedGroups: ["joinedGroups"],
    getSessionList: (userId) => {
        return (dispatch, getState) => {
            AppDB.getSessionList(null, userId).then((res) => {
                console.log('获取会话列表', res)
                dispatch(Creators.setSessionList(res))
            })
        }
    },
    getJoinedGroupList: () => {
        return (dispatch, getState) => {
            WebIM.conn.getGroup().then((res) => {
                console.log('res', res)
                let joinedGroups = res.data
                dispatch(Creators.setJoinedGroups(joinedGroups))
            })
        }
    },
    _pushSession: (session) =>{
        return (dispatch) =>{
            dispatch(Creators.pushSession(session))
        }
    },
    onGetChatroomUserList: () => {
        return (dispatch, getState) => {
            var option = {
                pagenum: 1,                                 // 页数
                pagesize: 20,                               // 每页个数
                success: function(list){
                    const tempArr = []
                    if (list?.data.length) {
                        list.data.forEach(item => {
                            tempArr.push({
                                sessionType: 'chatRoom',
                                sessionId: item.id,
                            })
                        })
                    }
                    dispatch(Creators.setSessionList(tempArr))
                },
                error: function(){
                    console.log('List chat room error')
                }
            };
            WebIM.conn.getChatRooms(option);
        }
    },
})
export default Creators
export const INITIAL_STATE = Immutable({
    sessionList: [],
    currentSession: '',
    joinedGroups: []
})
/* ------------- Reducers ------------- */
export const setSessionList = (state, { sessionList }) => {
    let stateSession = state.sessionList?state.sessionList:[]
    let concatSession = _.concat(stateSession,sessionList)
    let newConcatSession=  _.uniqBy(concatSession,'sessionId')
    return state.merge({ sessionList:newConcatSession })
}

export const setCurrentSession = (state, { userId }) => {
    return state.merge({ currentSession: userId })
}

export const setJoinedGroups = (state, {joinedGroups}) => {
    return state.merge({ joinedGroups })
}

export const topSession = (state, { sessionId, sessionType, message }) => {
    if(message?.chatThread && (JSON.stringify(message.chatThread)!=='{}')){
        return state;
    }
    const sessionList = state.getIn(['sessionList'], Immutable([])).asMutable()
    let topSession = { sessionId, sessionType }
    sessionList.forEach((element, index) => {
        if (sessionId === element.sessionId) {
            topSession = element;
            sessionList.splice(index, 1)
        }
    });
    sessionList.unshift(topSession)
    return state.merge({ sessionList })
}

export const deleteSession = (state, { sessionId }) => {
    let sessionList = state.sessionList.asMutable()
    sessionList = sessionList.filter((item) => {
        return item.sessionId !== sessionId
    })
    state = state.setIn(['sessionList'], sessionList);
    state = state.setIn(['currentSession', ''])
    return state
}

export const pushSession = (state, {session}) =>{
    let ary = state.sessionList.asMutable()
    let newSessionList = _.concat(ary,session)
    return state.setIn(['sessionList'],newSessionList)
}

/* ------------- Hookup Reducers To Types ------------- */
export const sessionReducer = createReducer(INITIAL_STATE, {
    [Types.SET_SESSION_LIST]: setSessionList,
    [Types.SET_CURRENT_SESSION]: setCurrentSession,
    [Types.TOP_SESSION]: topSession,
    [Types.DELETE_SESSION]: deleteSession,
    [Types.PUSH_SESSION]:pushSession,
    [Types.SET_JOINED_GROUPS]: setJoinedGroups,
})
