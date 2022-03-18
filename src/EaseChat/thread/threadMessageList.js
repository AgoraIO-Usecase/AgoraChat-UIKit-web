import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/styles";
import "../chat/index.css";
import { useDispatch, useSelector } from "react-redux";

import RetractedMessage from "../chat/messages/retractedMessage";
import FileMessage from "../chat/messages/fileMessage";
import ImgMessage from "../chat/messages/imageMessage";
import AudioMessage from "../chat/messages/audioMessage";
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

// const PAGE_NUM = 20;
function ThreadMessageList({ messageList, showByselfAvatar }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentThreadInfo = useSelector((state) => state.thread.currentThreadInfo);
  const {thread} = currentThreadInfo;
//   const scrollEl = useRef(null);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
//   let _not_scroll_bottom = false;

//   useEffect(() => {
//     if (!_not_scroll_bottom) {
//       setTimeout(() => {
//         const dom = scrollEl.current;
//         if (!ReactDOM.findDOMNode(dom)) return;
//         dom.scrollTop = dom.scrollHeight;
//       }, 0);
//     }
//   });

  const handleRecallMsg = useCallback(
    (message) => {
      console.log("handleRecallMsg", message);
      const { to, chatType } = message;
      dispatch(MessageActions.recallMessage(to, chatType, message));
    },
    [dispatch]
  );

//   const handleScroll = (e) => {debugger
//     if (e.target.scrollTop === 0 && !isLoaded) {
//       setTimeout(() => {
//         const offset = messageList.length;
//         dispatch(
//           MessageActions.fetchMessage(to, chatType, offset, (res) => {
//             setIsPullingDown(false);
//             if (res < PAGE_NUM) {
//               setIsLoaded(true);
//             }
//           })
//         );
//       }, 500);
//       setIsPullingDown(true);
//     }
//   };

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
                } else if (msg.body.type === "audio") {
                  return <AudioMessage message={msg} key={msg.id + index} showByselfAvatar={showByselfAvatar}/>;
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
