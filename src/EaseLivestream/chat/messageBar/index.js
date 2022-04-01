import React, { useState, useEffect,useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuItem, IconButton, Icon, InputBase } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles, fade } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

import i18next from "i18next";

import MessageActions from "../../../redux/message";
import SessionActions from "../../../redux/session";
import GlobalPropsActions from "../../../redux/globalProps"
import { EaseLivestreamContext } from "../index";

import _ from 'lodash'
import avatarIcon1 from '../../../common/images/avatar1.png'
import avatarIcon2 from '../../../common/images/avatar2.png'
import avatarIcon3 from '../../../common/images/avatar3.png'
import groupAvatarIcon from '../../../common/images/groupAvatar.png'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      zIndex: "999",
      width: "100%",
      height: "6.67vh",
      maxHeight: "60px",
      minHeight: "40px",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#393939",
      color: "#ffffff"
    },
    leftBar: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      margin: "0 20px 0 16px",
    },
  };
});
const MessageBar = () => {
  let easeLivestreamProps = useContext(EaseLivestreamContext);
  const { onChatAvatarClick ,closeChat} = easeLivestreamProps
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);

  const { chatType, to, username } = globalProps;
  const handleClick = (e) => {
      closeChat && closeChat(e)
  };

  let userAvatars = {
    1: avatarIcon1,
    2: avatarIcon2,
    3: avatarIcon3
  }
  const [userAvatarIndex, setUserAvatarIndex] = useState([])
  const [usersInfoData, setUsersInfoData] = useState([])
  useEffect(() => {
    let newwInfoData =usersInfoData && usersInfoData.length > 0 ? usersInfoData : localStorage.getItem("usersInfo_1.0")
    setUsersInfoData(newwInfoData)
    setUserAvatarIndex(_.find(newwInfoData, { username: to })?.userAvatar || 1)
  }, [to])

  return (
    <div className={classes.root}>
      <Box position="static" className={classes.leftBar}>
        <Avatar className={classes.avatar} onClick={(e) => onChatAvatarClick && onChatAvatarClick(e,{chatType, to})}
        src={chatType === "singleChat" ? userAvatars[userAvatarIndex] : groupAvatarIcon}
          style={{ borderRadius: chatType === "singleChat" ? "50%" : 'inherit'}}
        ></Avatar>
        {to}
      </Box>
      <Box position="static">
        <IconButton
          onClick={handleClick}
          className="iconfont icon-guanbi icon"
          style={{color:'#fff',fontSize:'16px',marginRight:'10px'}}
        ></IconButton>
      </Box>
    </div>
  );
};

export default MessageBar;
