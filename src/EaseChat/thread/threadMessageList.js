import React, { memo, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";
import "../chat/index.css";
import { useDispatch } from "react-redux";

import RetractedMessage from "../chat/messages/retractedMessage";
import FileMessage from "../chat/messages/fileMessage";
import ImgMessage from "../chat/messages/imageMessage";
import AudioOrVideoMessage from "../chat/messages/audioOrVideoMessage";
import TextMessage from "../chat/messages/textMessage";
import i18next from "i18next";
import MessageActions from "../../redux/message"
import ThirdEmoji from "../chat/messages/thirdEmoji";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
    display: "flex",
    position: "relative",
    bottom: "0",
    top: "0",
  },
  pulldownWrapper: {
    width: '100%',
    padding: ' 0 16px',
  }
}));

function ThreadMessageList({ messageList, showByselfAvatar }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleRecallThreadMsg = useCallback(
    (message) => {
      const { to, chatType } = message;
      dispatch(MessageActions.recallMessage(to, chatType, message, true));
    },
    [dispatch]
  );
  return (
    <div className={classes.root}>
      <div className="pulldown-wrapper">
        <div className="pulldown-tips">
          <div>
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
                    onRecallMessage={handleRecallThreadMsg}
                    showByselfAvatar={showByselfAvatar}
                    isThreadPanel='true'
                  />
                );
              } else if (msg.body.type === "file") {
                return (
                  <FileMessage
                    message={msg}
                    key={msg.id + index}
                    onRecallMessage={handleRecallThreadMsg}
                    showByselfAvatar={showByselfAvatar}
                    isThreadPanel='true'
                  />
                );
              } else if (msg.body.type === "img") {
                if (msg.ext.emoji_type) {
                  return (
                    <ThirdEmoji
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallThreadMsg}
                      showByselfAvatar={showByselfAvatar}
                      isThreadPanel='true'
                    />
                  )
                } else {
                  return (
                    <ImgMessage
                      message={msg}
                      key={msg.id + index}
                      onRecallMessage={handleRecallThreadMsg}
                      showByselfAvatar={showByselfAvatar}
                      isThreadPanel='true'
                    />
                  );
                }
              } else if (msg.body.type === "audio" || msg.body.type === "video") {
                return <AudioOrVideoMessage message={msg} key={msg.id + index} showByselfAvatar={showByselfAvatar} isThreadPanel='true'/>;
              } else if (msg.body.type === "recall") {
                return (
                  <RetractedMessage message={msg} key={msg.id + index} />
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
