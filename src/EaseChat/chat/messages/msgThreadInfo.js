import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import threadIcon from '../../../common/images/thread.png'
import { useSelector, useDispatch } from "../../../EaseApp/index";
import ThreadActions from "../../../redux/thread"
import MessageActions from "../../../redux/message"
import { getTimeDiff } from "../../../utils/index";
import WebIM from "../../../utils/WebIM";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { emoji } from "../../../common/emoji";
import AppDB from "../../../utils/AppDB"
import { message as Alert } from '../../../EaseChat/common/alert'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        minWidth: "134px",
        marginTop: "5px",
        width: '100%',
        height: "85px",
        display: "flex",
    },
    container: {
        position: 'absolute',
        bottom: '0',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '8px',
        padding: '0px 10px',
        width: '100%',
        height: "80px",
        display: "flex",
        background: '#fff',
        borderRadius: '5px',
        boxSizing: 'border-box',
    },
    triangle: {
        display: 'block',
        position: 'absolute',
        left: '13px',
        top: '-8px',
        height: '0',
        width: '0',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '8px solid #fff',
    },
    threadTop: {
        display: 'flex',
        marginTop: '4px',
        height: '20px',
        lineHeight: '20px',
        width: '100%',
    },
    threadIcon: {
        flex: '0 0 20px',
        marginTop: '3px',
        height: '13px',
        background: `url(${threadIcon}) 2px center no-repeat`,
        backgroundSize: 'contain',
    },
    threadName: {
        flex: '1 1 auto',
        fontWeight: '700',
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: '#000',
        textAlign: 'left'
    },
    messageCount: {
        flex: '0 0 36px',
        textAlign: 'right',
        fontWeight: '500',
        color: '#154DFE',
        cursor: 'pointer',
    },
    threadBottom: {
        marginTop: '9px',
        width: '100%',
        height: '35px',
        overflow: 'hidden',
        textAlign: 'left',
    },
    threadInfo: {
        display: 'flex',
        height: '16px',
        lineHeight: '16px',
        width: '100%',
    },
    messageInfo: {
        display: 'inline-block',
        height: '20px',
        lineHeight: '20px',
        color: '#4d4d4d',
        fontSize: '12px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
    },
    threadAva: {
        flex: '0 0 16px',
        textAlign: 'center',
        lineHeight: '16px',
    },
    threadAvaIcon: {
        display: 'inline-block',
        marginTop: '2px',
        height: '14px',
        width: '14px',
        borderRadius: '50%',
    },
    threadMsg: {
        marginLeft: '4px',
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: '#000',
        width: 'calc(100% - 70px)',
    },
    time: {
        color: '#999',
        fontSize: '12px',
        flex: '0 0 50px',
        textAlign: 'right',
    },
    threadOwner: {
        color: '#000',
    },
    lastMessage: {
        color: '#666',
    },
    defaultMessage: {
        fontSize: '12px',
        lineHeight: '16px',
        marginTop: '8px',
        color: '#4d4d4d',
        textAlign: 'left',
    },
}));

const MsgThreadInfo = (props) => {
    const { chatThreadOverview } = props.message;
    const dispatch = useDispatch();
    const classes = useStyles();
    const renderMessage = (message) => {
        switch (message.type) {
            case 'txt':
                return renderTxt(message.msg)
            case 'file':
                return `[${i18next.t('File')}]`
            case 'img':
                return `[${i18next.t('Image')}]`
            case 'audio':
                return `[${i18next.t('Audio')}]`
            case 'video':
                return `[${i18next.t('Video')}]`
            default:
                return ''
        }
    }
    const renderTxt = (txt) => {
        if (txt === undefined) {
            return [];
        }
        let rnTxt = [];
        let match = null;
        const regex = /(\[.*?\])/g;
        let start = 0;
        let index = 0;
        while ((match = regex.exec(txt))) {
            index = match.index;
            if (index > start) {
                rnTxt.push(txt.substring(start, index));
            }
            if (match[1] in emoji.map) {
                const v = emoji.map[match[1]];
                rnTxt.push(
                    <img
                        key={v + Math.floor(Math.random() * 99 + 1)}
                        alt={v}
                        src={require(`../../../common/faces/${v}`).default}
                        width={20}
                        height={20}
                        style={{verticalAlign:'middle'}}
                    />
                );
            } else {
                rnTxt.push(match[1]);
            }
            start = index + match[1].length;
        }
        rnTxt.push(txt.substring(start, txt.length));

        return rnTxt;
    };
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    const changeMessage = () => {
        //Whether you are in the thread. If not, call the interface added by SDK
        let hasJoined = threadList.find((item) => {
            return item.id === props.message.chatThreadOverview.id
        })
        if (!hasJoined) {
            WebIM.conn.joinChatThread({ chatThreadId: props.message.chatThreadOverview.id }).then((res) => {
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
        WebIM.conn.getChatThreadDetail({ chatThreadId: props.message.chatThreadOverview.id }).then((res) => {
            dispatch(ThreadActions.setCurrentThreadInfo(res.data));
            //updatea setThreadOriginalMsg
            if(res.data?.messageId){
                AppDB.findLocalMessage('groupChat', res.data.messageId).then((res) => {
                    let msg = res.length === 1 ? res[0] : {};
                    dispatch(ThreadActions.setThreadOriginalMsg(msg));
                })
            }
        })
       //open threadPanel
        dispatch(ThreadActions.updateThreadStates(true));
    }
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <span className={classes.triangle}></span>
                <div className={classes.threadTop}>
                    <div className={classes.threadIcon}></div>
                    <div className={classes.threadName}>{chatThreadOverview.name}</div>
                    <span className={classes.messageCount} onClick={changeMessage}>{chatThreadOverview.messageCount}&nbsp;&gt;</span>
                </div>
                {chatThreadOverview.lastMessage && JSON.stringify(chatThreadOverview.lastMessage) !== '{}' && <div className={classes.threadBottom}>
                    <div className={classes.threadInfo}>
                        <div className={classes.threadAva}>
                            <img className={classes.threadAvaIcon} src={avatar} ></img>
                        </div>
                        <span className={classes.threadMsg}>{chatThreadOverview.lastMessage.from || ''}</span>
                        <span className={classes.time}>{getTimeDiff(chatThreadOverview.lastMessage.time)}</span>
                    </div>
                    <span className={classes.messageInfo}>{renderMessage(chatThreadOverview.lastMessage)}</span>
                </div>
                }
                {
                    (!chatThreadOverview.lastMessage || JSON.stringify(chatThreadOverview.lastMessage) === '{}') && <div className={classes.defaultMessage}>No Messages</div>
                }

            </div>
        </Box>
    );
}
export default MsgThreadInfo