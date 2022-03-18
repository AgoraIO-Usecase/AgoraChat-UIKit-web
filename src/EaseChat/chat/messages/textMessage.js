import React, { memo, useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/icons/avatar1.png";
import { emoji } from "../../../common/emoji";
import { renderTime } from "../../../utils";

import MessageStatus from "./messageStatus";
import {CopyToClipboard} from 'react-copy-to-clipboard'

import { EaseChatContext } from "../index";
const useStyles = makeStyles((theme) => ({
  pulldownListItem: {
    display: "flex",
    padding: "10px 0",
    listStyle: "none",
    marginBottom: "26px",
    position: "relative",
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
  textBody: {
    // display: "flex",
    margin: (props) => (props.bySelf ? "0 10px 10px 0" : "0 0 10px 10px"),
    lineHeight: "20px",
    fontSize: "14px",
    background: (props) =>
      props.bySelf
        ? "linear-gradient(124deg, #c913df 20%,#154DFE 90%)"
        : "#F2F2F2",
    color: (props) => (props.bySelf ? "#fff" : "#000"),
    border: "1px solid #fff",
    borderRadius: (props) =>
      props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    padding: "15px",
    maxWidth: "65%",
    wordBreak: "break-all",
    textAlign: "initial",
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
  read: {
    fontSize: "10px",
    color: "rgba(0,0,0,.15)",
    margin: "3px",
  },
  avatarStyle: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
  },
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function TextMessage({ message, onRecallMessage, showByselfAvatar }) {
  let easeChatProps = useContext(EaseChatContext);
  const { onAvatarChange } = easeChatProps;
  const classes = useStyles({
    bySelf: message.bySelf,
    chatType: message.chatType,
  });
  const [menuState, setMenuState] = useState(initialState);
  const [copyMsgVal,setCopyMsgVal] = useState('');

  useEffect(()=>{
    setCopyMsgVal(message.msg)
  },[copyMsgVal])
  
  const handleClick = (event) => {
    event.preventDefault();
    setMenuState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  const handleClose = () => {
    setMenuState(initialState);
  };
  const recallMessage = () => {
    onRecallMessage(message);
    handleClose();
  };
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
            key={v}
            alt={v}
            src={require(`../../../common/faces/${v}`).default}
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

    const changeCopyVal = () => {
    setCopyMsgVal(message.msg);  
    handleClose() 
  }

  return (
    <li className={classes.pulldownListItem}>
      <div>
        {!message.bySelf && (
          <img
            className={classes.avatarStyle}
            src={avatar}
            onClick={(e) => onAvatarChange && onAvatarChange(e,message)}
          ></img>
        )}
        {showByselfAvatar && message.bySelf && (
          <img className={classes.avatarStyle} src={avatar}></img>
        )}
      </div>
      <div className={classes.textBodyBox}>
        <span className={classes.userName}>{message.from}</span>
        <div className={classes.textBody} onContextMenu={handleClick}>
          {renderTxt(message.body.msg)}
        </div>
        {message.bySelf && (
          <MessageStatus
            status={message.status}
            style={{
              marginTop: message.chatType === "singleChat" ? "0" : "22px",
            }}
          />
        )}
      </div>
      <div className={classes.time}>{renderTime(message.time)}</div>
      {message.status === "read" ? (
        <div className={classes.read}>{i18next.t("Read")}</div>
      ) : null}

        <Menu
          keepMounted
          open={menuState.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            menuState.mouseY !== null && menuState.mouseX !== null
              ? { top: menuState.mouseY, left: menuState.mouseX }
              : undefined
          }
        >
         {message.bySelf && <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>} 
          {<MenuItem onClick={changeCopyVal}>
          <CopyToClipboard text={copyMsgVal}>
            <span>{i18next.t("Copy")}</span>
        </CopyToClipboard>
          </MenuItem> }
        </Menu>
    </li>
  );
}

export default memo(TextMessage);
