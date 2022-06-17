import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/styles";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";

import MessageActions from "../../redux/message";
import RetractedMessage from "./messages/retractedMessage";
import FileMessage from "./messages/fileMessage";
import ImgMessage from "./messages/imageMessage";
import AudioOrVideoMessage from "./messages/audioOrVideoMessage";
import TextMessage from "./messages/textMessage";
import NoticeMessage from './messages/noticeMessage'
import CustomMessage from './messages/customMessage'
import ThreadActions from "../../redux/thread"
import ThirdEmoji from "./messages/thirdEmoji";
import i18next from "i18next";
import ThreadNotify from "./messages/threadNotify";
import Notify from './messages/notify';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
    display: "flex",
    position: "relative",
    bottom: "0",
    top: "0",
    overflow: "hidden",
  },
}));

const PAGE_NUM = 20;
function MessageList({ messageList, showByselfAvatar }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const globalProps = useSelector((state) => state.global.globalProps);
  const showThread = useSelector((state) => state.thread.showThread);
  const { to, chatType } = globalProps;
  console.log("** Render MessageList **", messageList);
  const scrollEl = useRef(null);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  let _not_scroll_bottom = false;
  const [boxScrollHeight, setBoxScrollHeight] = useState(0)

  useEffect(() => {
    // if (!_not_scroll_bottom) {
    //   setTimeout(() => {
    //     const dom = scrollEl.current;
    //     if (!ReactDOM.findDOMNode(dom)) return;
    //     dom.scrollTop = dom.scrollHeight;
    //   }, 0);
    // }
    const tempArr = []
    messageList.forEach(item => {
      if (item.body.type === 'img' || item.body.type === 'video') {
        tempArr.push(item.body)
      }
    })
    let time = tempArr.length ?  tempArr.length * 1000 : 510
    const TimerId = setInterval(() => {
      if (document.getElementById('pulldownList')) {
        setBoxScrollHeight(document.getElementById('pulldownList').scrollHeight)
      }
    }, 500)
    const TimeId = setTimeout(() => {
      clearTimeout(TimeId)
      clearInterval(TimerId)
    }, time)
  }, [messageList.length]);

  useEffect(() => {
    document.getElementById('pulldownList').scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [boxScrollHeight])

  const handleRecallMsg = useCallback(
    (message) => {
      console.log("handleRecallMsg", message);
      const { to, chatType } = message;
      dispatch(MessageActions.recallMessage(to, chatType, message));
    },
    [dispatch]
  );

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && !isLoaded) {
      setTimeout(() => {
        const offset = messageList.length;
        dispatch(
          MessageActions.fetchMessage(to, chatType, offset, (res) => {
            setIsPullingDown(false);
            if (res < PAGE_NUM) {
              setIsLoaded(true);
            }
          })
        );
      }, 500);
      setIsPullingDown(true);
    }
  };

  const createThread = (message)=>{
    //update currentThreadInfo
    dispatch(ThreadActions.setThreadOriginalMsg(message));
    dispatch(ThreadActions.setCurrentThreadInfo({}));
    //updated the historyStatus of Newly created chatThread
    dispatch(MessageActions.setThreadHasHistory(false));
    //change the status of threadPanel
    dispatch(ThreadActions.updateThreadStates(true));
    //change the status of creatingThread
    dispatch(ThreadActions.setIsCreatingThread(true));
  }
  return (
    <div className={classes.root}>
      <div className="pulldown-wrapper" onScroll={handleScroll}>
        <div className="pulldown-tips">
          <div style={{ display: isLoaded ? "block" : "none" }}>
            <span style={{ fontSize: "12px" }}>
              {i18next.t("no more messages")}
            </span>
          </div>
          <div style={{ display: isPullingDown ? "block" : "none" }}>
            <span>Loading...</span>
          </div>
        </div>
        <ul ref={scrollEl} className="pulldown-list" id="pulldownList">
          {messageList.length
            ? messageList.map((msg, index) => {
                if (msg.body.type === "txt") {
                  return (
                    <TextMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallMsg}
                      onCreateThread={createThread}
                      showByselfAvatar={showByselfAvatar}
                      showThread={showThread}
                    />
                  );
                } else if (msg.body.type === "file") {
                  return (
                    <FileMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallMsg}
                      onCreateThread={createThread}
                      showByselfAvatar={showByselfAvatar}
                      showThread={showThread}
                    />
                  );
                } else if (msg.body.type === "img") {
                  if (msg.ext.emoji_type) {
                    return (
                      <ThirdEmoji
                        message={msg}
                        key={msg.id + index}
                        onRecallMessage={handleRecallMsg}
                        showByselfAvatar={showByselfAvatar}
                      />
                    )
                  } else {
                    return (
                      <ImgMessage
                        message={msg}
                        key={msg.id + index}
                        onRecallMessage={handleRecallMsg}
                        showByselfAvatar={showByselfAvatar}
                        onCreateThread={createThread}
                        showThread={showThread}
                      />
                    );
                  }
                } else if (msg.body.type === "audio" || msg.body.type === "video") {
                  return <AudioOrVideoMessage message={msg} key={msg.id + index} showByselfAvatar={showByselfAvatar}/>;
                } else if (msg.body.type === "recall") {
                  return (
                    <RetractedMessage message={msg} key={msg.id + index}/>
                  );
                } else if(msg.body.type === "notice"){
                    return (
                      <NoticeMessage message={msg} key={msg.id + index}/>
                    )
                } else if(msg.body.type === 'custom'){
                  return (
                      <CustomMessage message={msg} key={msg.id + index}/>
                    )
                } else if (msg.body.type === "threadNotify") {
                  return (
                    <ThreadNotify message={msg} key={msg.id + index}/>
                  );
                } else if (msg.body.type === "notify") {
                  return (
                    <Notify message={msg} key={msg.id + index}></Notify>
                  )
                } else {
                  return null;
                }
              })
            : null}
        </ul>
      </div>
    </div>
  );
}

export default memo(MessageList);
