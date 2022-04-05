import React, { useState, useRef, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import ReactDOM from "react-dom";
import ThreadBar from "./threadBar"
import SendBox from "../chat/sendBox";
import ThreadMessageList from "./threadMessageList";
import { renderTimeWithDate } from "../../utils/index";
import { useSelector, useDispatch } from "../../EaseApp/index";
import deleteIcon from '../../common/images/delete.png'
import MessageActions from "../../redux/message"
import { Box } from "@material-ui/core";
import { EaseChatContext } from "../chat/index";
import _ from "lodash";
import avatar from "../../common/icons/avatar1.png";
import "../../i18n";
import i18next from "i18next";
import { emoji } from "../../common/emoji";


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
            textAlign: 'left',
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
            marginTop: '2px',
            lineHeight: '20px',
            fontWeight: '600',
            fontSize: '16px',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
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
            textAlign: 'left',
        },
        threadName: {
            marginTop: '4px',
            lineHeight: '44px',
            fontWeight: '700',
            fontSize: '18px',
            textAlign: 'left',
        },
        threadDesc: {
            lineHeight: '20px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#4d4d4d',
            textAlign: 'left',
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
        },
        emptyMsg: {
            width: '100%',
            marginTop: '15px',
            height: '28px',
            lineHeight: '28px',
            color: '#999',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'left',
        }

    };
});

const ThreadPanel = (props) => {
    const dispatch = useDispatch();
    const easeChatProps = useContext(EaseChatContext);
    const { showByselfAvatar } = easeChatProps;
    const [threadName, setThreadName] = useState('');
    const changeThreadName = (e) => {
        setThreadName(e.target.value)
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
                <input className={classes.threadNameInput} style={{ color: threadName.length === 0 ? '#ccc' : '#000' }} placeholder={i18next.t('Thread Name')} maxLength={100} value={threadName} onChange={(e) => changeThreadName(e)}></input>
                <span className={classes.threadNameClear} style={{ opacity: threadName.length === 0 ? '15%' : '100%' }} onClick={clearThreadName}></span>
            </div>
            <div className={classes.startTips} style={{ color: threadName.length === 0 ? '#ccc' : '#4d4d4d' }}>
                {i18next.t('Start a Thread')}
            </div>
        </Box>)
    }
    const showThreadMessage = () => {
        return (<Box>
            <div className={classes.threadName}>{currentMessage?.thread_overview?.name || ''}</div>
            <div className={classes.threadDesc}>{i18next.t('Started by')} <span className={classes.threadStartMember}>{currentMessage?.thread_overview?.from || currentMessage?.thread_overview?.owner || ''}</span></div>
        </Box>)
    }
    const renderMessage = (body) => {
        switch (body?.type) {
            case 'txt':
                return renderTxt(body.msg)
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
    const renderOriginalMsg = () => {
        return (
            <Box>
                <div className={classes.threadOwnerInfo}>
                    <div className={classes.threadOwnerAvatarCon}>
                        <img className={classes.threadOwnerAvatar} src={avatar} ></img>
                    </div>
                    <div className={classes.threadOwnerMsg}>
                        <div className={classes.info}>
                            <span>{currentMessage.from}</span>
                            <span>{renderTimeWithDate(currentMessage.time)}</span>
                        </div>
                        <div className={classes.threadReplayMessage}>{renderMessage(currentMessage.body)}</div>
                        <div className={classes.threadOriginalMessage}>{i18next.t('Original message from Group Chat')}</div>
                    </div>
                </div>
                {isCreatingThread ? null : <hr className={classes.split} />}
            </Box>
        )
    }
    const renderEmptyMsg = () => {
        return (
            <Box>
                <div className={classes.emptyMsg}>{i18next.t('Sorry,unable to load original message')}</div>
                {isCreatingThread ? null : <hr className={classes.split} />}
            </Box>
        )
    }

    let isThread = true;

    const [isPullingDown, setIsPullingDown] = useState(false);
    const threadHasHistory = useSelector(state => state.message.threadHasHistory);
    const messageList =
        useSelector((state) => {
            const to = state.thread.currentThreadInfo?.thread_overview?.id;
            return _.get(state, ["message", 'threadMessage', to], []);
        }) || [];
    const scrollThreadEl = useRef(null);
    useEffect(() => {
        if (currentMessage?.thread_overview?.id) {
            dispatch(MessageActions.setThreadHasHistory(true));
            setThreadName('');
            setIsPullingDown(false)
            const dom = scrollThreadEl.current;
            if (!ReactDOM.findDOMNode(dom)) return;
            dom.scrollTop = 0;
        }
        currentMessage?.thread_overview?.id && dispatch(MessageActions.fetchThreadMessage(currentMessage.thread_overview.id))
    }, [currentMessage?.thread_overview?.id])
    useEffect(() => {
        const dom = scrollThreadEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        if (!threadHasHistory && messageList.length !== 0 && dom.scrollHeight >= (dom.scrollTop + dom.clientHeight)) {//receive new message 
            dom.scrollTop = dom.scrollHeight;
        }
    }, [messageList.length])

    const handleScroll = (e) => {
        if (threadHasHistory && e.target.scrollTop !== 0 && e.target.scrollHeight === (e.target.scrollTop + e.target.clientHeight)) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    const to = currentMessage.thread_overview?.id;
                    dispatch(MessageActions.fetchThreadMessage(to, cb, 'scroll'));
                }, 500);
            }
        }
    };
    const cb = () => {
        setIsPullingDown(false)
    }
    return (
        <Box className={classes.root}>
            <ThreadBar />
            <Box ref={scrollThreadEl} className={classes.chat} onScroll={handleScroll}>
                {isCreatingThread ? createThread() : showThreadMessage()}
                {!currentMessage.id && !currentMessage.mid ? renderEmptyMsg() : renderOriginalMsg()}
                <ThreadMessageList
                    messageList={messageList}
                    showByselfAvatar={showByselfAvatar}
                />
                <div style={{ display: isPullingDown ? "block" : "none" }}>
                    <span>Loading...</span>
                </div>
            </Box>
            <SendBox isThread={isThread} threadName={threadName} />
        </Box>
    );
}
export default ThreadPanel



