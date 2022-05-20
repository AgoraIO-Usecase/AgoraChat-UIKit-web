import React, { memo, useContext } from 'react'
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { useSelector, useDispatch } from "react-redux";
import ThreadActions from "../../../redux/thread"
import AppDB from "../../../utils/AppDB"
import { message as Alert } from '../../../EaseChat/common/alert'
import { EaseChatContext } from "../index"

const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        alignItems: 'center'
    },
    root: {
        width: '100%',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999',
        fontWeight: '600',
        lineHeight: '20px',
    },
    name: {
        color: '#154DFE',
        cursor: 'pointer',
    }
}))

function ThreadNotify({ message }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    let easeChatProps = useContext(EaseChatContext);
    const { onOpenThreadPanel } = easeChatProps
    const joinThread = () => {
        //Whether you are in the thread. If not, call the interface added by SDK
        let hasJoined = threadList.find((item) => {
            return item.id === message.threadId
        })
        if (!hasJoined) {
            WebIM.conn.joinChatThread({ chatThreadId: message.threadId }).then((res) => {
                changeThreadStatus()
            }).catch(e=>{
                if(e.type === 1301){
                    changeThreadStatus()
                }else if( e.type === 1300){
                    Alert.warn(i18next.t('The thread has been disbanded'));
                }
            })
            return
        }
        changeThreadStatus()
    }
     //changes thread status after joing the thread
     const changeThreadStatus = () => {
        //change the status of creatingThread
        dispatch(ThreadActions.setIsCreatingThread(false));
        //updtate currentThreadInfo
        WebIM.conn.getChatThreadDetail({ chatThreadId: message.threadId }).then((res) => {
            dispatch(ThreadActions.setCurrentThreadInfo(res.data));
            //updatea setThreadOriginalMsg
            if(res.data?.messageId){
                AppDB.findLocalMessage('groupChat', res.data.messageId).then((res) => {
                    let msg = res.length === 1 ? res[0] : {};
                    dispatch(ThreadActions.setThreadOriginalMsg(msg));
                })
            }
            onOpenThreadPanel && onOpenThreadPanel(res.data)
        })
       //open threadPanel
        dispatch(ThreadActions.updateThreadStates(true));
    }

    return (
        <li className={classes.pulldownListItem}><div className={classes.root}>{message.from} {i18next.t(`Started a Thread`)}: {message.name}, <span className={classes.name} onClick={joinThread}>{i18next.t(`Join the thread`)}</span></div></li>
    )
}

export default memo(ThreadNotify)

