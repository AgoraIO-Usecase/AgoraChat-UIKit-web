import React, { useState, useRef, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import ReactDOM from "react-dom";
import ThreadBar from "./threadBar"
import SendBox from "../chat/sendBox";
import ThreadMessageList from "./threadMessageList";
import { renderTime } from "../../utils/index";
import { useSelector, useDispatch } from "../../EaseApp/index";
import deleteIcon from '../../common/images/delete.png'
import MessageActions from "../../redux/message"
import { Box, IconButton } from "@material-ui/core";
import { EaseChatContext } from "../chat/index";
import _ from "lodash";
import avatar from "../../common/icons/avatar1.png";
import "../../i18n";
import i18next from "i18next";
import { emoji } from "../../common/emoji";
import AudioPlayer from "../chat/messages/audioPlayer/audioPlayer";

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
            textAlign:'left',
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
            lineHeight: '30px',
            fontWeight: '700',
            fontSize: '18px',
            textAlign: 'left',
            maxWidth: '350px',
        },
        threadDesc: {
            lineHeight: '20px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#4d4d4d',
            textAlign: 'left',
            width: '340px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
        },
        fileCard: {
            width: "252px",
            height: "72px",
            backgroundColor: "rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
            marginBottom: "6px",
        },
        fileIcon: {
            width: "59px",
            height: "59px",
            background: "rgba(35, 195, 129, 0.06)",
            borderRadius: "4px",
            border: "1px solid rgba(35, 195, 129, 0.06)",
            textAlign: "center",
            lineHeight: "59px",
            margin: "0 7px 0 7px",
            flexShrink: 0,
        },
        fileInfo: {
            "& p": {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "126px",
                margin: "0",
            },
            "& span": {
                fontSize: "12px",
                color: "#010101",
                lineHeight: "16px",
            },
        },
        download: {
            fontSize: "16px",
            color: "rgba(0,0,0,.6)",
            fontWeight: "bold",
            cursor: "pointer",
        },
        duration: {
            margin: "0 4px",
            position: "relative",
            left: '15px',
          },
    };
});

const ThreadPanel = () => {
    const classes = useStyles();
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
    const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);
    const currentMessage = useSelector((state) => state.thread?.currentThreadInfo);
    const threadOriginalMsg = useSelector((state) => state.thread?.threadOriginalMsg);
    const renderMessage = (body) => {
        switch (body?.type) {
            case 'txt':
                return renderTxt(body.msg)
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
    const createThread = () => {
        return (<Box>
            <div className={classes.createThreadCon}>
                <input className={classes.threadNameInput} style={{ color: threadName.length === 0 ? '#ccc' : '#000' }} placeholder={i18next.t('Thread Name')} maxLength={64} value={threadName} onChange={(e) => changeThreadName(e)}></input>
                <span className={classes.threadNameClear} style={{ opacity: threadName.length === 0 ? '15%' : '100%' }} onClick={clearThreadName}></span>
            </div>
            <div className={classes.startTips} style={{ color: threadName.length === 0 ? '#ccc' : '#4d4d4d' }}>
                {i18next.t('Start a Thread')}
            </div>
        </Box>)
    }
    const showThreadMessage = () => {
        return (<Box>
            <div className={classes.threadName}>{currentMessage?.name || ''}</div>
            <div className={classes.threadDesc}>{i18next.t('Started by')} <span className={classes.threadStartMember}>{currentMessage?.owner || ''}</span></div>
        </Box>)
    }
    const timeSyle = 'MMM D, YYYY, HH:mm';
    const renderOriginalMsg = () => {
        return (
            <Box>
                <div className={classes.threadOwnerInfo}>
                    <div className={classes.threadOwnerAvatarCon}>
                        <img className={classes.threadOwnerAvatar} src={avatar} ></img>
                    </div>
                    <div className={classes.threadOwnerMsg}>
                        <div className={classes.info}>
                            <span>{threadOriginalMsg.from}</span>
                            <span>{renderTime(threadOriginalMsg.time, timeSyle)}</span>
                        </div>
                        {JSON.stringify(threadOriginalMsg) !== '{}' && renderMsgDom(threadOriginalMsg)}
                        {/* <div className={classes.threadReplayMessage}>{renderMessage(threadOriginalMsg.body)}</div> */}
                        <div className={classes.threadOriginalMessage}>{i18next.t('Original message from Group Chat')}</div>
                    </div>
                </div>
                {isCreatingThread ? null : <hr className={classes.split} />}
            </Box>
        )
    }
    const threadAudioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const play = (e,message) => {
        setIsPlaying(true);
        threadAudioRef.current.play();
        const time = message.body.length * 1000;
        setTimeout(() => {
            setIsPlaying(false);
        }, time + 500);
    };
    const [audioUrl, setUrl] = useState('');
    useEffect(()=>{
        if(threadOriginalMsg.body && threadOriginalMsg?.body?.type === "audio"){
            let options = {
                url: threadOriginalMsg.bySelf? threadOriginalMsg.url: (threadOriginalMsg.audioSrcUrl || threadOriginalMsg.url),
                headers: {
                  Accept: 'audio/mp3'
                },
                onFileDownloadComplete: function (response) {
                  let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response)
                  setUrl(objectUrl);
                },
                onFileDownloadError: function () {
                }
              };
              WebIM.utils.download.call(WebIM.conn, options)
        }
      },[threadOriginalMsg])
    const renderMsgDom = (message) => {
        if (message.body.type === "txt") {
            return (
                <div className={classes.threadReplayMessage}>{renderMessage(threadOriginalMsg.body)}</div>
            );
        } else if (message.body.type === "file") {
            return (
                <div className={classes.fileCard}>
                    <div className={classes.fileIcon}>
                        {i18next.t("file")}
                    </div>
                    <div className={classes.fileInfo}>
                        <p>{message.filename}</p>
                        <span>
                            {Math.floor(message.body.size / 1024) + "kb"}
                        </span>
                    </div>
                    <div className={classes.download}>
						<a href={message.body.url} download={message.filename}>
							<IconButton className="iconfont icon-xiazai"></IconButton>
						</a>
					</div>
                </div>
            );
        } else if (message.body.type === "img") {
            return (
                <img src={message.url} alt="img message" style={{ display: 'inline-block', maxWidth: '80%' }}></img>
            );
        } else if (message.body.type === "audio") {
            return (
                <div style={{ display: "flex",position:'relative', width: '80px', backgroundColor:"rgba(0,0,0,0.05)",lineHeight: '38px',borderRadius:'4px'}} onClick={(e)=>play(e,message)}>
                    <span className={classes.duration}>
                        {Math.floor(message.body.length) + "''"}
                    </span>
                    <AudioPlayer play={isPlaying} />
                    <audio src={audioUrl} ref={threadAudioRef} />
                </div>
            )
        } else if (message.body.type === "video") {
            return (
                <div style={{ position: "relative", maxWidth: '80%' }}>
                    <video
                        style={{
                            width: "100%",
                            borderRadius: "20px",
                        }}
                        controls
                        src={message.url}
                    />
                </div>
            )
        } else {
            return null;
        }
    }
    const renderEmptyMsg = () => {
        return (
            <Box>
                <div className={classes.emptyMsg}>{i18next.t('Sorry,unable to load original message')}</div>
                {isCreatingThread ? null : <hr className={classes.split} />}
            </Box>
        )
    }
    const [isPullingDown, setIsPullingDown] = useState(false);
    const threadHasHistory = useSelector(state => state.message.threadHasHistory);
    const messageList =
        useSelector((state) => {
            const to = state.thread.currentThreadInfo?.id;
            return _.get(state, ["message", 'threadMessage', to], []);
        }) || [];
    const scrollThreadEl = useRef(null);
    useEffect(() => {
        if (currentMessage?.id) {
            setThreadName('');
            setIsPullingDown(false)
            const dom = scrollThreadEl.current;
            if (!ReactDOM.findDOMNode(dom)) return;
            dom.scrollTop = 0;
        }
        if (currentMessage.source !== 'notify') {
            currentMessage.id && dispatch(MessageActions.setThreadHasHistory(true));
            currentMessage.id && dispatch(MessageActions.fetchThreadMessage(currentMessage.id))
        }
    }, [currentMessage.id])
    useEffect(() => {
        const dom = scrollThreadEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        // if (!threadHasHistory && dom.scrollTop !==0 && messageList.length !== 0 && dom.scrollHeight >= (dom.scrollTop + dom.clientHeight)) {//receive new message
        if (!threadHasHistory && messageList.length !== 0 && dom.scrollHeight >= (dom.scrollTop + dom.clientHeight)) {//receive new message
            dom.scrollTop = dom.scrollHeight;
        }
    }, [messageList.length])

    const handleScroll = (e) => {
        if (threadHasHistory && e.target.scrollTop !== 0 && e.target.scrollHeight - 1 >= (e.target.scrollTop + e.target.clientHeight)) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    const to = currentMessage.id;
                    dispatch(MessageActions.fetchThreadMessage(to, cb, 'scroll'));
                }, 500);
            }
        }
    };
    const cb = () => {
        setIsPullingDown(false)
    }
    const isChatThread = true;
    return (
        <Box className={classes.root}>
            <ThreadBar />
            <Box ref={scrollThreadEl} className={classes.chat} onScroll={handleScroll}>
                {isCreatingThread ? createThread() : showThreadMessage()}
                {(threadOriginalMsg.id === currentMessage.messageId) || JSON.stringify(currentMessage) == '{}' ? renderOriginalMsg() : renderEmptyMsg()}
                <ThreadMessageList
                    messageList={messageList}
                    showByselfAvatar={showByselfAvatar}
                />
                <div style={{ display: isPullingDown ? "block" : "none" }}>
                    <span>Loading...</span>
                </div>
            </Box>
            <SendBox isChatThread={isChatThread} threadName={threadName} />
        </Box>
    );
}
export default ThreadPanel



