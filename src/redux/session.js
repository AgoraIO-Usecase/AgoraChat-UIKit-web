import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import AppDB from '../utils/AppDB';
import WebIM from '../utils/WebIM';
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setSessionList: ['sessionList'],
    setCurrentSession: ['userId'],
    topSession: ['sessionId', 'sessionType'],
    deleteSession: ['sessionId'],
    pushSession:['session'],
    setJoinedGroups: ["joinedGroups"],
    // setNewSessionList: ['sessionList'],
    getSessionList: () => {
        return (dispatch, getState) => {
            AppDB.getSessionList().then((res) => {
                console.log('获取会话列表', res)
                dispatch(Creators.setSessionList(res))
                // const payload = []
                // res.forEach(val => {
                //     if (val.sessionType === 'singleChat' && val.sessionId !== WebIM.conn.context.userId) {
                //         payload.push(val.sessionId)
                //     }
                // })
                // if (payload.length) {
                //     WebIM.conn.subscribePresence({usernames: payload, expiry: 10000000}).then(value => {
                //         console.log(value, 'value.result')
                //         value.result.forEach(val => {
                //             res.forEach(item => {
                //                 item.presence = val
                //                 if (item.sessionId === val.uid) {
                //                     item.presence = val
                //                 }
                //             })
                //         })
                //         dispatch(Creators.setSessionList(res))
                //     });
                // } else {
                //     dispatch(Creators.setSessionList(res))
                // }
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
            // const payload = session.sessionType === 'singleChat' ? [session.sessionId] : []
            // console.log(payload, 'payload')
            // if (payload.length) {
            //     WebIM.conn.subscribePresence({usernames: payload, expiry: 10000000}).then(res => {
            //         console.log(res, 'res.result')
            //         res.result.forEach(val => {
            //             if (session.sessionId === val.uid) {
            //                 session.presence = val
            //             }
            //             session.presence = val
            //         })
            //         dispatch(Creators.pushSession(session))
            //     });
            // } else {
            //     dispatch(Creators.pushSession(session))
            // }
        }
    },
    // topSession: (sessionId, sessionType) => {
    //     return (dispatch) =>{
    //         const payload = sessionType === 'singleChat' ? [sessionId] : []
    //         if (payload.length) {
    //             WebIM.conn.subscribePresence({usernames: payload, expiry: 10000000}).then(res => {
    //                 dispatch(Creators.topSessionA(sessionId, sessionType))
    //             });
    //         } else {
    //             dispatch(Creators.topSessionA(sessionId, sessionType))
    //         }
    //     }
    // },
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
    // if (stateSession.length && stateSession.findIndex(item => item.sessionId === sessionList[0].sessionId) !== -1) {
    //     let newListStaate = JSON.parse(JSON.stringify(stateSession))
    //     let newList = newListStaate.map(val => {
    //         if (val.sessionId === sessionList[0].sessionId) {
    //             val.presence = sessionList[0].presence
    //         }
    //         return val
    //     })
    //     return state.merge({ sessionList:newList })
    // } else {
    //     let concatSession = _.concat(stateSession,sessionList)
    //     let newConcatSession=  _.uniqBy(concatSession,'sessionId')
    //     return state.merge({ sessionList:newConcatSession })
    // }
}

export const setCurrentSession = (state, { userId }) => {
    return state.merge({ currentSession: userId })
}

export const setJoinedGroups = (state, {joinedGroups}) => {
    return state.merge({ joinedGroups })
}

export const topSession = (state, { sessionId, sessionType, presence }) => {
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
    return state.setIn(['sessionList'], sessionList)
}

export const pushSession = (state, {session}) =>{
    let ary = state.sessionList.asMutable()
    let newSessionList = _.concat(ary,session)
    return state.setIn(['sessionList'],newSessionList)
}
// export const setNewSessionList = (state, { sessionList }) => {
//     let stateSession = state.sessionList?state.sessionList:[]
//     let concatSession = _.concat(stateSession,sessionList)
//     let newConcatSession=  _.uniqBy(concatSession,'sessionId')
//     return state.merge({ sessionList:newConcatSession })
// }
/* ------------- Hookup Reducers To Types ------------- */
export const sessionReducer = createReducer(INITIAL_STATE, {
    [Types.SET_SESSION_LIST]: setSessionList,
    [Types.SET_CURRENT_SESSION]: setCurrentSession,
    [Types.TOP_SESSION]: topSession,
    [Types.DELETE_SESSION]: deleteSession,
    [Types.PUSH_SESSION]:pushSession,
    [Types.SET_JOINED_GROUPS]: setJoinedGroups,
    // [Types.SET_NEW_SESSION_LIST]: setNewSessionList
})
