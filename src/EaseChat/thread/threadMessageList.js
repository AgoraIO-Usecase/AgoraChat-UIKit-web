import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/styles";
import "../chat/index.css";
import { useDispatch, useSelector } from "react-redux";

import RetractedMessage from "../chat/messages/retractedMessage";
import FileMessage from "../chat/messages/fileMessage";
import ImgMessage from "../chat/messages/imageMessage";
import AudioOrVideoMessage from "../chat/messages/audioOrVideoMessage";
import TextMessage from "../chat/messages/textMessage";
import i18next from "i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
    display: "flex",
    position: "relative",
    bottom: "0",
    top: "0",
    // overflow: "hidden",
  },
  pulldownWrapper: {
    width: '100%',
    padding:' 0 16px',
  }
}));

function ThreadMessageList({ messageList, showByselfAvatar }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentThreadInfo = useSelector((state) => state.thread.currentThreadInfo);
  const {thread} = currentThreadInfo;
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleRecallMsg = useCallback(
    (message) => {
      console.log("handleRecallMsg", message);
      const { to, chatType } = message;
      dispatch(MessageActions.recallMessage(to, chatType, message));
    },
    [dispatch]
  );
  return (
    <div className={classes.root}>
      <div className="pulldown-wrapper">
        <div className="pulldown-tips">
          <div style={{ display: isLoaded ? "block" : "none" }}>
            <span style={{ fontSize: "12px" }}>
              {i18next.t("no more messages")}
            </span>
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
                      showByselfAvatar={showByselfAvatar}
                      isThreadPanel='true'
                    />
                  );
                } else if (msg.body.type === "file") {
                  return (
                    <FileMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallMsg}
                      showByselfAvatar={showByselfAvatar}
                    />
                  );
                } else if (msg.body.type === "img") {
                  return (
                    <ImgMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallMsg}
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

export default memo(ThreadMessageList);
