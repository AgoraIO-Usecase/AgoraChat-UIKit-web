import React, { memo, useEffect, useRef, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Icon } from "@material-ui/core";
import { renderTime } from "../../../utils/index";
import avatar from "../../../common/icons/avatar1.png";
import AudioPlayer from "./audioPlayer/audioPlayer";
import { Menu, MenuItem } from "@mui/material";
import { EaseChatContext } from "../index";

import Reaction from "../reaction";
import RenderReactions from "../reaction/renderReaction";
import threadIcon from "../../../common/images/thread.png"
import MsgThreadInfo from "./msgThreadInfo"
const useStyles = makeStyles((theme) => ({
  pulldownListItem: {
    padding: "10px 0",
    listStyle: "none",
    marginBottom: "26px",
    position: "relative",
    display: "flex",
    flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
  },
  userName: {
    padding: "0 10px 4px",
    color: "#8797A4",
    fontSize: "14px",
    display: (props) =>
      props.chatType !== "singleChat" && !props.bySelf
        ? "inline-block"
        : "none",
    textAlign: (props) => (props.bySelf ? "right" : "left"),
  },
  textBodyBox: {
    position: 'relative',
    display: "flex",
    marginLeft: (props) => props.showThreaddInfo? '12px':'0',
    flexDirection:'column',
    background: (props) => props.showThreaddInfo? '#f2f2f2':'#fff',
    maxWidth: "80%",
    alignItems: (props) => (props.bySelf ? "inherit" : "unset"),
    padding:  (props) => props.showThreaddInfo? '12px':'0',
    borderRadius: (props) =>
			props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
  },

  audioBox: {
    margin: (props) => (props.bySelf ? "0 10px 6px 0" : "0 0 6px 10px"),
    width: (props) => `calc(208px * ${props.duration / 15})`,
    minWidth: '70px',
    maxWidth: '100%',
    height: "34px",
    background: (props) =>
      props.bySelf
        ? "linear-gradient(124deg, rgb(201, 19, 223) 20%, rgb(21, 77, 254) 90%)"
        : "rgb(242, 242, 242)",
    borderRadius: (props) =>
      props.bySelf ? "16px 16px 4px" : "16px 16px 16px 4px",
    color: (props) => (props.bySelf ? "#fff" : "rgb(0, 0, 0)"),
    textAlign: (props) => (props.bySelf ? "left" : "right"),
    // flexDirection: (props) => (props.bySelf ? "row" : "row-reverse"),
    flexDirection:"row",
    alignItems: "center",
    minHeight: "40px",
    lineHeight: "34px",
    padding: "0 5px",
    display: "flex",
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
  },
  time: {
    position: "absolute",
    fontSize: "11px",
    height: "16px",
    color: "rgba(1, 1, 1, .2)",
    lineHeight: "16px",
    textAlign: "center",
    top: "-18px",
    width: "100%",
  },
  duration: {
    margin: "0 4px",
    position: "relative",
    left: (props) => (props.bySelf ? "-15px" : "15px"),
  },
  icon: {
    transform: (props) => (props.bySelf ? "rotate(0deg)" : "rotate(180deg)"),
    display: "block",
    height: "34px",
  },
  textReaction: {
    position: "absolute",
    right: (props) => (props.bySelf ? "" : "0"),
		left: (props) => (props.bySelf ? "0" : ""),
		bottom: '0',
		transform: (props) => (props.bySelf ? "translateX(-100%)":"translateX(100%)"),
  },
  reactionBox: {
    position: "absolute",
    top: "-15px",
    right: (props) => (props.bySelf ? "0" : ""),
    left: (props) => (props.bySelf ? "" : "0"),
    background: "#F2F2F2",
    borderRadius: "17.5px",
    padding: "3px",
    border: "solid 2px #FFFFFF",
    boxShadow: "0 10px 10px 0 rgb(0 0 0 / 30%)",
  },
  textReactionCon: {
		width: '100%',
		height: '100%',
		float: (props) => (props.bySelf? 'right':'left'),
	},
  threadCon: {
		float: (props) => (props.bySelf? 'left':'right'),
		height: '24px',
		width: '24px',
		borderRadius: '50%',
		'&:hover':{
		background: '#E6E6E6',
		}
	},
	thread: {
		marginTop: '5px',
		marginLeft: '4px',
		width: '16px',
		height: '15px',
		background: `url(${threadIcon}) center center no-repeat`,
		backgroundSize: 'contain',
		cursor: 'pointer',
	}
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function AudioOrVideoMessage({ message, showByselfAvatar, onCreateThread, isThreadPanel,showThread }) {
  let audioType = message.body.type === "audio";
  let easeChatProps = useContext(EaseChatContext);
  const {
    onAvatarChange,
    isShowReaction,
    customMessageClick,
    customMessageList,
  } = easeChatProps;
  // const url = message.body.url;
  const url = message.bySelf? message.url: message.audioSrcUrl;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [state, setState] = useState(initialState);
  const [hoverDeviceModule, setHoverDeviceModule] = useState(false);
  const reactionMsg = message?.reactions || [];
  const handleClose = () => {
    setState(initialState);
  };
  const handleClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const play = () => {
    setIsPlaying(true);
    audioRef.current.play();
    const time = message.body.length * 1000;
    setTimeout(() => {
      setIsPlaying(false);
    }, time + 500);
  };

  const _customMessageClick = (val, option) => (e) => {
    customMessageClick && customMessageClick(e, val, option);
    handleClose();
  };
  const createThread = ()=>{
    onCreateThread(message)
  }
	const showThreadEntry = showThread && !message.chatThreadOverview && !isThreadPanel && message.chatType === 'groupChat';
	const showThreaddInfo = showThread && (!isThreadPanel) && message.chatType ==="groupChat" && message.chatThreadOverview&& (JSON.stringify(message.chatThreadOverview)!=='{}')
  const classes = useStyles({
    bySelf: message.bySelf,
    duration: Math.round(message.body.length),
    msgType: audioType,
    showThreaddInfo,
  });
  
  return (
    <li
      className={classes.pulldownListItem}
      onMouseOver={() => setHoverDeviceModule(true)}
      onMouseLeave={() => setHoverDeviceModule(false)}
    >
      {!message.bySelf && (
        <Avatar
          src={avatar}
          onClick={(e) => onAvatarChange && onAvatarChange(e, message)}
        ></Avatar>
      )}
      {showByselfAvatar && message.bySelf && <Avatar src={avatar}></Avatar>}
      <div className={classes.textBodyBox}>
          <div className={classes.messageBox}>
            <span className={classes.userName}>{message.from}</span>
            {audioType ? (
              <div
                className={classes.audioBox}
                onClick={play}
                onContextMenu={handleClick}
              >
                <AudioPlayer play={isPlaying} reverse={message.bySelf} />
                <span className={classes.duration}>
                  {Math.floor(message.body.length) + "''"}
                </span>
                <audio src={url} ref={audioRef} />
              </div>
            ) : (
              <div style={{ position: "relative",width:'100%', maxWidth: '320px'}}>
                <video
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                  }}
                  controls
                  src={message.url}
                  onContextMenu={handleClick}
                />
              </div>
            )}
          </div>
          
          {showThreaddInfo ? <MsgThreadInfo message={message} />: null}
          <div className={classes.textReaction}>
                  {hoverDeviceModule ? (
                    <div className={classes.textReactionCon}>
                    {isShowReaction && (
                      <Reaction message={message}/>
                    )}
                    { showThreadEntry && <div className={classes.threadCon} onClick={createThread} title="Reply">
                    <div className={classes.thread}></div>
                  </div>}
                  
                  </div>
                  ) : (
                    <></>
                  )}
                  
                </div>
                {reactionMsg.length > 0 && (
                  <div className={classes.reactionBox}>
                    <RenderReactions message={message} />
                  </div>
                )}
      </div>
      <div className={classes.time}>{renderTime(message.time)}</div>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        {customMessageList &&
          customMessageList.map((val, key) => {
            return (
              <MenuItem key={key} onClick={_customMessageClick(val, message)}>
                {val.name}
              </MenuItem>
            );
          })}
      </Menu>
    </li>
  );
}

export default memo(AudioOrVideoMessage);
