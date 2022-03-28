import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
    Box,
    IconButton,
    MenuItem,
    TextareaAutosize,
    Menu,
} from "@material-ui/core";
import threadIcon from '../../../common/images/thread.png'
import { useSelector, useDispatch } from "../../../EaseApp/index";
import ThreadActions from "../../../redux/thread"
import MessageActions from "../../../redux/message"
import { getTimeDiff } from "../../../utils/index";
import WebIM from "../../../utils/WebIM";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { emoji } from "../../../common/emoji";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            minWidth: "200px",
            maxWidth: '100%',
            height: "80px",
            display: "flex",
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            marginTop: '8px',
            padding: '8px 12px',
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
        },
        messageCount: {
            flex: '0 0 36px',
            textAlign: 'right',
            fontWeight: '500',
            color: '#154DFE',
            cursor: 'pointer',
        },
        threadBottom: {
            width: '100%',
            overflow: 'hidden',
        },
        threadInfo: {
            display: 'flex',
            marginTop: '8px',
            height: '16px',
            lineHeight: '16px',
            width: '100%',
        },
        messageInfo: {
            display:'inline-block',
            lineHeight: '16px',
            marginTop: '4px',
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
        }
    };
});

const MsgThreadInfo = (props) => {
    const { thread } = props.message;
    const dispatch = useDispatch();
    const classes = useStyles();
    const renderMessage = (payload) => {
        if (payload.bodies && payload.bodies.length > 0) {
            let message = payload.bodies[0]
            switch (message.type) {
                case 'txt':
                    return renderTxt(message.msg)
                case 'file':
                    return `[${i18next.t('File Message')}]`
                case 'img':
                    return `[${i18next.t('Image Message')}]`
                case 'audio':
                    return `[${i18next.t('Audio Message')}]`
                case 'video':
                    return `[${i18next.t('Video Message')}]`
                default:
                    return ''
            }
        }
        return ''
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
                        key={v}
                        alt={v}
                        src={require(`../../../common/faces/${v}`).default}
                        width={20}
                        height={20}
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
        //自己是否在该thread中，若不在-调用sdk加入的接口
        let hasJoined = threadList.find((item) => {
            return item.id === props.message.thread.id
        })
        if (!hasJoined) {
            WebIM.conn.joinThread({ threadId: props.message.thread.id }).then((res) => {
                //加入到thread列表中
                // let threadInfo = {
                //     id: props.message.thread.threadId,
                //     name: props.message.thread.threadName,
                //     owner: props.message.thread.owner,
                //     msgId: props.message.id,
                //     groupId: props.message.to,
                //     created: '1647502554746',//通知中有create_timestamp
                //     lastMessage: props.message.thread.lastMessage,
                // }
                // let newList = threadList.concat([threadInfo])
                //更新threadList
                // dispatch(ThreadActions.setThreadList(newList))
                //如果正在创建thread，修改状态
                dispatch(ThreadActions.setIsCreatingThread(false));
                //修改当前的消息
                dispatch(ThreadActions.setCurrentThreadInfo(props.message));
                //打开thread面板
                dispatch(ThreadActions.updateThreadStates(true));
            })
            return
        }
        //如果正在创建thread，修改状态
        dispatch(ThreadActions.setIsCreatingThread(false));
        //修改当前的消息
        dispatch(ThreadActions.setCurrentThreadInfo(props.message));
        //打开thread面板
        dispatch(ThreadActions.updateThreadStates(true));

    }
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <span className={classes.triangle}></span>
                <div className={classes.threadTop}>
                    <div className={classes.threadIcon}></div>
                    <div className={classes.threadName}>{thread.name}</div>
                    <span className={classes.messageCount} onClick={changeMessage}>{thread.message_count}&nbsp;&gt;</span>
                </div>
                {thread.last_message && <div className={classes.threadBottom}>
                    <div className={classes.threadInfo}>
                        <div className={classes.threadAva}>
                            <img className={classes.threadAvaIcon} src={avatar} ></img>
                        </div>
                        <span className={classes.threadMsg}>{thread.last_message.from || ''}</span>
                        <span className={classes.time}>{getTimeDiff(thread.last_message.timestamp)}</span>
                    </div>
                    <span className={ classes.messageInfo}>{renderMessage(thread.last_message.payload)}</span>
                </div>
                }
                {
                    (!thread.last_message || JSON.stringify(thread.last_message) == '{}') && <div className={classes.defaultMessage}>No Messages</div>
                }

            </div>
        </Box>
    );
}
export default MsgThreadInfo