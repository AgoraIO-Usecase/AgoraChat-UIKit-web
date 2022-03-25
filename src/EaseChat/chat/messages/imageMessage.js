import React, { memo, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { renderTime } from "../../../utils";
import { EaseChatContext } from "../index";
const useStyles = makeStyles((theme) => ({
  pulldownListItem: {
    padding: "10px 0",
    listStyle: "none",
    marginBottom: "26px",
    position: "relative",
    display: "flex",
    flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
    alignItems: "center",
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
  imgBox: {
    marginLeft: "10px",
    maxWidth: "50%",
    "& img": {
      maxWidth: "100%",
      borderRadius: "10px"
    },
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
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function ImgMessage({ message, onRecallMessage, showByselfAvatar }) {
  let easeChatProps = useContext(EaseChatContext);
  const { onAvatarChange, customMessageClick, customMessageList} = easeChatProps;
  const classes = useStyles({ bySelf: message.bySelf });
  const [state, setState] = useState(initialState);
  const handleClose = () => {
    setState(initialState);
  };
  const recallMessage = () => {
    onRecallMessage(message);
    handleClose();
  };
  const handleClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
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
          onClick={(e) => onAvatarChange && onAvatarChange(e,message)}
        ></Avatar>
      )}
      {showByselfAvatar && message.bySelf && <Avatar src={avatar}></Avatar>}
      <div className={classes.textBodyBox}>
        <span className={classes.userName}>{message.from}</span>
        <div className={classes.imgBox} onContextMenu={handleClick}>
          <img src={message.url} alt="img message"></img>
        </div>
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
         {message.bySelf && <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>} 
          {customMessageList && customMessageList.map((val,key)=>{
            return <MenuItem key={key} onClick={_customMessageClick(val,message)}>{val.name}</MenuItem>
          })}
        </Menu>
    </li>
  );
}

export default memo(ImgMessage);
