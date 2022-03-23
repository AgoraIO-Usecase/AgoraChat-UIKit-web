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
import ThreadActions from "../../redux/thread"
import i18next from "i18next";

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
  const { to, chatType } = globalProps;
  console.log("** Render MessageList **", messageList);
  const scrollEl = useRef(null);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  let _not_scroll_bottom = false;

  useEffect(() => {
    if (!_not_scroll_bottom) {
      setTimeout(() => {
        const dom = scrollEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    }
  }, [messageList.length]);

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
    if(!message.thread){
      //如果消息未创建thread-跳转到创建thread页面
      dispatch(ThreadActions.setCurrentThreadInfo(message));
      dispatch(ThreadActions.updateThreadStates(true));
      dispatch(ThreadActions.setIsCreatingThread(true));//修改thread面板状态 正在编辑
    }
  }
  return (
    <div className={classes.root}>
      <div ref={scrollEl} className="pulldown-wrapper" onScroll={handleScroll}>
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
        <ul className="pulldown-list">
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
                    />
                  );
                } else if (msg.body.type === "img") {
                  return (
                    <ImgMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallMsg}
                      onCreateThread={createThread}
                      showByselfAvatar={showByselfAvatar}
                    />
                  );
                } else if (msg.body.type === "audio" || msg.body.type === "video") {
                  return <AudioOrVideoMessage message={msg} key={msg.id + index} showByselfAvatar={showByselfAvatar}/>;
                } else if (msg.body.type === "recall") {
                  return (
                    <RetractedMessage message={msg} key={msg.id + index}/>
                  );
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
