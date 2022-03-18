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

const useStyles = makeStyles((theme) => {
    return {
        root: {
            minWidth: "200px",
            width: '100%',
            height: "64px",
            display: "flex",
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            marginTop: '8px',
            padding: '6px 6px 6px 10px',
            width: '100%',
            height: "56px",
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
            display: 'flex',
            marginTop: '8px',
            height: '16px',
            lineHeight: '16px',
            width: '100%',
        },
        threadAva: {
            flex: '0 0 18px',
            textAlign: 'center',
            lineHeight: '16px',
        },
        threadAvaIcon: {
            display: 'inline-block',
            height: '14px',
            width: '14px',
            borderRadius: '50%',
        },
        threadMsg: {
            flex: '1 1 auto',
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        time: {
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
    const dispatch = useDispatch();
    const classes = useStyles();
    const { thread } = props.message;
    const renderMessage = (lastMessage) => {
        switch (lastMessage.contenttype) {
            case 'TEXT':
                return renderTxt(lastMessage.text)
            case 'file':
                return '[文件]'
            case 'img':
                return '[图片]'
            case 'audio':
                return '[音频]'
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
            return item.id === props.message.thread.threadId
        })
        if (!hasJoined) {
            //test-start
            setTimeout(() => {
                //加入到thread列表中
                let threadInfo = {
                    id: props.message.thread.threadId,
                    name: props.message.thread.threadName,
                    owner: props.message.thread.owner,
                    msgId: props.message.id,
                    groupId: props.message.to,
                    created: '1647502554746',//通知中有create_timestamp
                    lastMessage: props.message.thread.lastMessage,
                }
                let newList = threadList.concat([threadInfo])
                dispatch(ThreadActions.setThreadList(newList))
            })
            //test-end
            // WebIM.conn.joinThread(props.message.thread.threadId).then(() => {
            //     //加入到thread列表中
            //     let threadInfo = {
            //         id: props.message.thread.threadId,
            //         name: props.message.thread.threadName,
            //         owner: props.message.thread.owner,
            //         msgId: props.message.id,
            //         groupId: props.message.to,
            //         created: '1647502554746',//通知中有create_timestamp
            //         lastMessage: props.message.thread.lastMessage,
            //     }
            //     let newList = threadList.concat([threadInfo])
            //     dispatch(ThreadActions.setThreadList(newList))
            //     dispatch(ThreadActions.setIsCreatingThread(false));
            //     dispatch(MessageActions.fetchThreadMessage(props.message.thread.threadId))
            //     dispatch(ThreadActions.setCurrentThreadInfo(props.message));
            //     dispatch(ThreadActions.updateThreadStates(true));
            // })
            return 
        }
        dispatch(ThreadActions.setIsCreatingThread(false));
        dispatch(MessageActions.fetchThreadMessage(props.message.thread.threadId))
        dispatch(ThreadActions.setCurrentThreadInfo(props.message));
        dispatch(ThreadActions.updateThreadStates(true));

    }
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <span className={classes.triangle}></span>
                <div className={classes.threadTop}>
                    <div className={classes.threadIcon}></div>
                    <div className={classes.threadName}>{thread.threadName}</div>
                    <span className={classes.messageCount} onClick={changeMessage}>{thread.count}&nbsp;&gt;</span>
                </div>
                {thread.lastMessage && <div className={classes.threadBottom}>
                    <div className={classes.threadAva}>
                        <img className={classes.threadAvaIcon} src="https://aip.bdstatic.com/portal-pc-node/dist/1645513367427/images/technology/imageprocess/dehaze/5.jpg"></img>
                    </div>
                    <div className={classes.threadMsg}>
                        <span className={classes.threadOwner}>{thread.lastMessage.from}</span>&nbsp;
                        <span className={classes.lastMessage}>{renderMessage(thread.lastMessage)}</span>
                    </div>
                    <span className={classes.time}>{getTimeDiff(thread.lastMessage.timestamp)}</span>
                </div>
                }
                {
                    !thread.lastMessage && <div className={classes.defaultMessage}>No Messages</div>
                }

            </div>
        </Box>
    );
}
export default MsgThreadInfo