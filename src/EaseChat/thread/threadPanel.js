import React, { useState, useRef, createContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import ReactDOM from "react-dom";
import ThreadBar from "./threadBar"
import SendBox from "../chat/sendBox";
import ThreadMessageList from "./threadMessageList";
import { renderTimeWithDate } from "../../utils/index";
import { useSelector, useDispatch } from "../../EaseApp/index";
import deleteIcon from '../../common/images/delete.png'
import ThreadActions from "../../redux/thread"
import MessageActions from "../../redux/message"
import { Box } from "@material-ui/core";
import { EaseChatContext } from "../chat/index";
import _ from "lodash";


const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: "100%",
            flex: 1,
            display: "flex",
            position: "relative",
            bottom: "0",
            top: "0",
            overflow: "hidden",
            flexDirection: 'column',
            padding: '0 20px 0 12px',
            height: 'calc(100% - 20px)',
            overflow: 'hidden',
        },
        chat: {
            height: 'calc(100% - 130px)',
            overflow: "hidden",
            overflowY: 'scroll',
        },
        createThreadCon: {
            position: 'relative',
            marginTop: '12px',
            borderBottom: '1px solid #e6e6e6',
            width: '100%',
            paddingRight: '36px',
            boxSizing: 'border-box',
        },
        threadNameInput: {
            lineHeight: '38px',
            border: 'none',
            outline: 'none',
            fontSize: '18px',
            fontWeight: '700',
            width: '100%',
        },
        threadNameClear: {
            position: 'absolute',
            display: 'block',
            right: '10px',
            bottom: '10px',
            height: '16px',
            width: '16px',
            background: `url(${deleteIcon}) center center no-repeat`,
            cursor: 'pointer',
        },
        startTips: {
            marginTop: '8px',
            lineHeight: '20px',
            fontSize: '14px',
            color: '#4d4d4d',
        },
        threadOwnerInfo: {
            marginTop: '15px',
            display: 'flex',
            width: '100%',
        },
        threadOwnerAvatarCon: {
            height: '28px',
            flex: '0 0 28px',
        },
        threadOwnerAvatar: {
            display: 'block',
            height: '100%',
            width: '100%',
            borderRadius: '50%',
        },
        threadOwnerMsg: {
            width: '100%',
            paddingLeft: '8px',
            flex: '1 1 calc(100% - 36px)',
            overflow: 'hidden',
        },
        info: {
            display: 'flex',
            justifyContent: 'space-between',
            lineHeight: '15px',
            fontSize: '12px',
            color: '#999',
        },
        threadReplayMessage: {
            lineHeight: '20px',
            fontSize: '16px',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        threadOriginalMessage: {
            marginTop: '2px',
            lineHeight: '14px',
            fontSize: '12px',
            color: '#4d4d4d',
            width: 'calc(100%)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        threadName: {
            marginTop: '4px',
            lineHeight: '44px',
            fontWeight: '700',
            fontSize: '18px',
        },
        threadDesc: {
            lineHeight: '20px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#4d4d4d',
        },
        threadStartMember: {
            color: '#000'
        },
        split: {
            marginTop: '11px',
            height: '0',
            width: '100%',
            border: 'none',
            borderBottom: '1px solid #e6e6e6',
        }


    };
});

const ThreadPanel = (props) => {
    const dispatch = useDispatch();
    const [threadName, setThreadName] = useState('');
    const changeThreadName = (e) => {
        setThreadName(e.target.value)
        dispatch(ThreadActions.setCurrentThreadName({ "name": e.target.value.replace(/(^\s*)|(\s*$)/g, "") }));
    }
    const clearThreadName = () => {
        setThreadName('');
    }
    const classes = useStyles();
    const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);
    const currentMessage = useSelector((state) => state.thread?.currentThreadInfo);
    const createThread = () => {
        return (<Box>
            <div className={classes.createThreadCon}>
                <input className={classes.threadNameInput} style={{ color: threadName.length === 0 ? '#ccc' : '#000' }} placeholder="Thread Name" maxLength={100} value={threadName} onChange={(e) => changeThreadName(e)}></input>
                <span className={classes.threadNameClear} style={{ opacity: threadName.length === 0 ? '15%' : '100%' }} onClick={clearThreadName}></span>
            </div>
            <div className={classes.startTips} style={{ color: threadName.length === 0 ? '#ccc' : '#4d4d4d' }}>
                Send a message to start a thread in this Group Chat.
            </div>
        </Box>)
    }
    const showThreadMessage = () => {
        return (<Box>
            <div className={classes.threadName}>{currentMessage?.thread?.threadName}</div>
            <div className={classes.threadDesc}>Straded by <span className={classes.threadStartMember}>{currentMessage?.thread?.owner}</span></div>
        </Box>)
    }
    const renderMessage = () => {
        switch (currentMessage.type) {
            case 'txt':
                return renderTxt(currentMessage.body.msg)
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
                        src={require(`../../common/faces/${v}`).default}
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
    //test--start 手动触发更新thread消息
    //first  群成员
    //创建thread
    // let data = {
    //     operation: 'create',
    //     chatType: 'groupChat',
    //     messageId: '986390930909039160',
    //     groupId: '167772754608129',
    //     thread: {
    //       threadId: '33',
    //       threadName: 'test create thread',
    //       count: 0,
    //       owner:'lucy',
    //     }
    // }

    //修改threadName
    // let data = {
    //     operation: 'update',
    //     chatType: 'groupChat',
    //     messageId: '986390930909039160',
    //     groupId: '167772754608129',
    //     thread: {
    //         threadId: '33',
    //         threadName: 'hahaThreadName',
    //         count: 3,
    //         owner: 'lucy',
    //     }
    // }
    let test = 0;
    //删除thread
    // let data = {
    //     operation: 'delete',
    //     chatType: 'groupChat',
    //     messageId: '986390930909039160',
    //     groupId: '167772754608129',
    //     thread: {
    //         threadId: '33',
    //         threadName: 'hahaThreadName',
    //         count: 3,
    //         owner: 'lucy',
    //     }
    // }
    //需要出提示"current thread is deleted"
    //关闭thread面板
    //thread消息变化，新消息，撤回消息等
    let data = {
        operation: 'update_msg',
        chatType: 'groupChat',
        messageId: '986390930909039160',
        groupId: '167772754608129',
        thread: {
            threadId: '33',
            threadName: 'hahaThreadName',
            count: 3,
            owner: 'lucy',
            lastMessage:{
                contenttype:'TEXT',
                text:'updated~~',
                from:'wy',
                timestamp: 1647421680000,
            }
        },
    }

    useEffect(() => {
        setTimeout(() => {
            console.log("=====计时器")
            // dispatch(ThreadActions.updateThreadInfo(data));
        }, 5000)
    }, [test])
    //test--end
    const renderOriginalMsg = () => {
        return (
            <Box>
                <div className={classes.threadOwnerInfo}>
                    <div className={classes.threadOwnerAvatarCon}>
                        <img className={classes.threadOwnerAvatar} src="https://aip.bdstatic.com/portal-pc-node/dist/1645513367427/images/technology/imageprocess/dehaze/5.jpg"></img>
                    </div>
                    <div className={classes.threadOwnerMsg}>
                        <div className={classes.info}>
                            <span>{currentMessage.from}</span>
                            <span>{renderTimeWithDate(currentMessage.time)}</span>
                        </div>
                        <div className={classes.threadReplayMessage}>{renderMessage()}</div>
                        <div className={classes.threadOriginalMessage}>Original message from Group Chat.</div>
                    </div>
                </div>
                {isCreatingThread ? null : <hr className={classes.split} />}
            </Box>
        )
    }
    const messageList =
        useSelector((state) => {
            const to = state.thread.currentThreadInfo?.thread?.threadId;
            return _.get(state, ["message", 'threadMessage', to], []);
        }) || [];

    let isThread = true;
    const PAGE_NUM = 20;
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPullingDown, setIsPullingDown] = useState(false);

    const scrollEl = useRef(null);
    // let _not_scroll_bottom = false;
    // useEffect(() => {
    //     if (!_not_scroll_bottom) {
    //         setTimeout(() => {
    //             const dom = scrollEl.current;
    //             if (!ReactDOM.findDOMNode(dom)) return;
    //             dom.scrollTop = dom.scrollHeight;
    //         }, 0);
    //     }
    // });
    useEffect(() => {
        // console.log("=======aaaa")
        setIsLoaded(false)
        setIsPullingDown(false)
        //每次进入thread面板，滚动条置顶
        const dom = scrollEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        dom.scrollTop = 0;
    }, [currentMessage])

    //收到新消息后，判断已经加载完旧消息则滚动条置底
    useEffect(() => {
        const dom = scrollEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        // console.log("========",isLoaded,dom.scrollTop,dom.scrollHeight === (dom.scrollTop + dom.clientHeight))
        if(isLoaded && dom.scrollTop!==0 && dom.scrollHeight !== (dom.scrollTop + dom.clientHeight)){
            dom.scrollTop = dom.scrollHeight;
        }
    },[messageList])

    const handleScroll = (e) => {
        if (e.target.scrollHeight === (e.target.scrollTop + e.target.clientHeight) && !isLoaded && e.target.scrollTop!==0) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    const offset = messageList.length;
                    const to = currentMessage.thread?.threadId;
                    dispatch(
                        MessageActions.fetchThreadMessage(to, offset, (res) => {
                            setIsPullingDown(false);
                            if (res < PAGE_NUM) {
                                setIsLoaded(true);
                            }
                        }, 'scroll')
                    );
                }, 500);
            }
        }
    };

    return (
        <EaseChatContext.Provider value={props}>
            <Box className={classes.root}>
                <ThreadBar />
                <Box ref={scrollEl} className={classes.chat} onScroll={handleScroll}>
                    {isCreatingThread ? createThread() : showThreadMessage()}
                    {renderOriginalMsg()}
                    <ThreadMessageList
                        messageList={messageList}
                        showByselfAvatar={props.showByselfAvatar}
                    />
                    <div style={{ display: isPullingDown ? "block" : "none" }}>
                        <span>Loading...</span>
                    </div>
                </Box>
                <SendBox isThread={isThread} />
            </Box>
        </EaseChatContext.Provider>
    );
}
export default ThreadPanel



