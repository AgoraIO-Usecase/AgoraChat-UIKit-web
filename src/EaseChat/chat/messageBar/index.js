import React, { useState, useEffect,useContext } from "react";
import { useSelector, useDispatch } from "../../../EaseApp/index";
import { Menu, MenuItem, IconButton, Icon, InputBase, Tooltip } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, fade } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

import i18next from "i18next";

import MessageActions from "../../../redux/message";
import SessionActions from "../../../redux/session";
import GlobalPropsActions from "../../../redux/globalProps"
import { EaseChatContext } from "../index";

import _ from 'lodash'
import avatarIcon1 from '../../../common/images/avatar1.png'
import avatarIcon2 from '../../../common/images/avatar2.png'
import avatarIcon3 from '../../../common/images/avatar3.png'
import groupAvatarIcon from '../../../common/images/groupAvatar.png'

import offlineImg from '../../../common/images/Offline.png'
import onlineIcon from '../../../common/images/Online.png'
import busyIcon from '../../../common/images/Busy.png'
import donotdisturbIcon from '../../../common/images/Do_not_Disturb.png'
import customIcon from '../../../common/images/custom.png'
import leaveIcon from '../../../common/images/leave.png'

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
      padding: "0 10px",
    },
    leftBar: {
      display: "flex",
      alignItems: "center",
      position: 'relative'
    },
    avatar: {
      margin: "0 20px 0 16px",
    },
    imgStyle: {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      cursor: 'pointer',
      verticalAlign: 'middle',
      position: 'absolute',
      bottom: '0px',
      left: '45px',
      zIndex: 1
    },
  };
});
const MessageBar = () => {
  let easeChatProps = useContext(EaseChatContext);
  const { onChatAvatarClick } = easeChatProps
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);
  const sessionList = useSelector((state) => state.session?.sessionList) || [];
  const [sessionEl, setSessionEl] = useState(null);

  const { chatType, to, username, presenceExt } = globalProps;
  const renderSessionInfoMenu = () => {
    const handleClickClearMessage = () => {
      dispatch(MessageActions.clearMessage(chatType, to));
    };

    const handleClickDeleteSession = () => {
      dispatch(MessageActions.clearMessage(chatType, to));
      dispatch(SessionActions.deleteSession(to));
      dispatch(GlobalPropsActions.setGlobalProps({to:null}))
    };

    return (
      <Menu
        id="simple-menu"
        anchorEl={sessionEl}
        keepMounted
        open={Boolean(sessionEl)}
        onClose={() => setSessionEl(null)}
      >
        <MenuItem onClick={handleClickClearMessage}>
          <Box className={classes.menuItemIconBox}>
            <Icon className="iconfont icon-qingkongxiaoxi"></Icon>
          </Box>
          <Typography variant="inherit" noWrap>
            {i18next.t("Clear Message")}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClickDeleteSession}>
          <Box className={classes.menuItemIconBox}>
            <Icon className="iconfont icon-shanchuhuihua"></Icon>
          </Box>
          <Typography variant="inherit" noWrap>
            {i18next.t("Delete Session")}
          </Typography>
        </MenuItem>
      </Menu>
    );
  };

  const handleSessionInfoClick = (e) => {
    setSessionEl(e.currentTarget);
  };
  let ext = ''
  sessionList.forEach(val => {
    if (val.presence) {
      if (val.sessionId === to) {
        ext = val.presence.ext
      }
    }
  })
  console.log(sessionList, 'sessionList', ext)
  console.log('%c sessionList', 'color:red;font-size:20px;', ext)
  const getUserOnlineStatus = {
    'Offline': offlineImg,
    'Online': onlineIcon,
    'Busy': busyIcon,
    'Do not Disturb': donotdisturbIcon,
    'Leave': leaveIcon,
    '': onlineIcon
  }
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
          {
            chatType === "singleChat" ?
            <Tooltip title={presenceExt || ext} placement="bottom-end">
              <img alt="" src={getUserOnlineStatus[presenceExt] || getUserOnlineStatus[ext] || customIcon} className={classes.imgStyle} />
            </Tooltip> : null
          }
        {to}
      </Box>
      <Box position="static">
        <IconButton
          onClick={handleSessionInfoClick}
          className="iconfont icon-hanbaobao icon"
        ></IconButton>
      </Box>
      {renderSessionInfoMenu()}
    </div>
  );
};

export default MessageBar;
