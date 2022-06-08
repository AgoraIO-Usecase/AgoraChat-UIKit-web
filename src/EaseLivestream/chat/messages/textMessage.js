import React, { memo, useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/images/defaultAvatar.png";
import { emoji } from "../../../common/emoji";
import { renderTime } from "../../../utils";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { EaseLivestreamContext } from "../index";

import streamerIcon from '../../../common/images/streamer.png'
import moderatorIcon from '../../../common/images/moderator.png'
import muteIcon from '../../../common/images/mute.png'


const useStyles = makeStyles((theme) => ({
  pulldownListItem: {
    display: "flex",
    listStyle: "none",
    marginBottom: "26px",
    position: "relative",
    alignItems: "center",
  },
  userName: {
    padding: "0 10px 4px",
    color: "#a5a5a5",
    fontSize: "14px",
    display: "inline-block",
    textAlign: "left",
  },
  textBodyBox: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "65%",
    alignItems: "unset",
    wordBreak: "break-all"
  },
  textBody: {
    padding: "0 15px",
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
  userInfoBox:{
    display: "flex",
    alignItems: "center"
  },
  iconStyle:{
    width:"38px"
  },
  muteIconStyle:{
    width: "12px",
    marginLeft: "4px",
  }
}));
function TextMessage({ message }) {
  let easeLivestreamProps = useContext(EaseLivestreamContext);
  const { roomUserInfo } = easeLivestreamProps;
  console.log('roomUserInfo>>>', roomUserInfo);
  console.log('roomUserInfo[message.from]>>>', roomUserInfo[message.from])
  const classes = useStyles({
    bySelf: message.bySelf,
    chatType: message.chatType,
  });

  const [copyMsgVal, setCopyMsgVal] = useState("");

  useEffect(() => {
    setCopyMsgVal(message.msg);
  }, [copyMsgVal]);

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
            src={require(`../../../common/faces/${v}`)}
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
  return (
    <li className={classes.pulldownListItem}>
      <div>
        <img className={classes.avatarStyle} src={roomUserInfo && roomUserInfo[message.from]?.avatarurl || avatar}></img>
      </div>
      <div className={classes.textBodyBox}>
        <div className={classes.userInfoBox}>
            <span className={classes.userName}>{roomUserInfo && roomUserInfo[message.from]?.nickname || message.from}</span>
            {roomUserInfo[message.from]?.isStreamer && <img src={streamerIcon} alt="" className={classes.iconStyle}/>}
            {roomUserInfo[message.from]?.isAdmin && <img src={moderatorIcon} alt="" className={classes.iconStyle}/>}
            {roomUserInfo[message.from]?.isMuted && <img src={muteIcon} alt="" className={classes.muteIconStyle}/>}
        </div>
        <div className={classes.textBody}>{renderTxt(message.body.msg)}</div>
      </div>
    </li>
  );
}

export default memo(TextMessage);
