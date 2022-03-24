import React, { memo, useEffect, useRef, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Icon } from "@material-ui/core";
import { renderTime } from "../../../utils/index";
import avatar from "../../../common/icons/avatar1.png";
import AudioPlayer from "./audioPlayer/audioPlayer";
import { Menu ,MenuItem } from '@mui/material';
import { EaseChatContext } from "../index";
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
    display: "flex",
    flexDirection: (props) => (props.bySelf ? "inherit" : "column"),
    maxWidth: "65%",
    alignItems: (props) => (props.bySelf ? "inherit" : "unset"),
  },

  audioBox: {
    margin: (props) => (props.bySelf ? "0 10px 26px 0" : "0 0 26px 10px"),
    maxWidth: "50%",
    minWidth: "50px",
    width: (props) => `calc(208px * ${props.duration / 15})`,
    height: "34px",
    background: (props) =>
      props.bySelf
        ? "linear-gradient(124deg, rgb(201, 19, 223) 20%, rgb(21, 77, 254) 90%)"
        : "rgb(242, 242, 242)",
    borderRadius: (props) =>
      props.bySelf ? "16px 16px 4px" : "16px 16px 16px 4px",
    color: (props) => (props.bySelf ? "#fff" : "rgb(0, 0, 0)"),
    textAlign: (props) => (props.bySelf ? "left" : "right"),
    flexDirection: (props) => (props.bySelf ? "row" : "row-reverse"),
    alignItems: "center",
    minHeight: "40px",
    lineHeight: "34px",
    padding: "0 5px",
    display: "flex",
    cursor: "pointer",
    fontSize: "14px",
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
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function AudioOrVideoMessage({ message, showByselfAvatar }) {
  let easeChatProps = useContext(EaseChatContext);
  const { onAvatarChange, customMessageClick, customMessageList} = easeChatProps;
  const classes = useStyles({
    bySelf: message.bySelf,
    duration: Math.round(message.body.length),
  });
  const url = message.body.url;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [state, setState] = useState(initialState);
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

  const _customMessageClick = (val,option) =>(e) =>{
    customMessageClick && customMessageClick(e,val,option)
    handleClose()
  }
  return (
    <li className={classes.pulldownListItem}>
      {!message.bySelf && (
        <Avatar
          src={avatar}
          onClick={() => onAvatarChange && onAvatarChange(message)}
        ></Avatar>
      )}
      {showByselfAvatar && message.bySelf && <Avatar src={avatar}></Avatar>}
      <div className={classes.textBodyBox}>
        <span className={classes.userName}>{message.from}</span>
        {message.type === "audio" ? (
          <div className={classes.audioBox} onClick={play} onContextMenu={handleClick}>
            <AudioPlayer play={isPlaying} reverse={message.bySelf} />
            <span className={classes.duration}>
              {Math.floor(message.body.length) + "''"}
            </span>
            <audio src={url} ref={audioRef} />
          </div>
        ) : (
          <div>
            <video
              style={{width:'320px',borderRadius:'20px'}}
              controls
              src={message.url}
              onContextMenu={handleClick}
            />
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
          {customMessageList.map((val,key)=>{
            return <MenuItem key={key} onClick={_customMessageClick(val,message)}>{val.name}</MenuItem>
          })}
        </Menu>
    </li>
  );
}

export default memo(AudioOrVideoMessage);
