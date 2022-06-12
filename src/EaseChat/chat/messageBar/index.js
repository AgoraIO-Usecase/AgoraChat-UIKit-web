import React, { useState, useEffect,useContext,useRef } from "react";
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
import ThreadActions from "../../../redux/thread";
import GlobalPropsActions from "../../../redux/globalProps";
import ThreadListPanel from "../../thread/threadList/index.js";
import { EaseChatContext } from "../index";

import _ from 'lodash'
import avatarIcon1 from '../../../common/images/avatar1.png'
import avatarIcon2 from '../../../common/images/avatar2.png'
import avatarIcon3 from '../../../common/images/avatar3.png'
import groupAvatarIcon from '../../../common/images/groupAvatar.png'
import threadIcon from '../../../common/images/thread.png'

import offlineImg from '../../../common/images/Offline.png'
import onlineIcon from '../../../common/images/Online.png'
import busyIcon from '../../../common/images/Busy.png'
import donotdisturbIcon from '../../../common/images/Do_not_Disturb.png'
import customIcon from '../../../common/images/custom.png'
import leaveIcon from '../../../common/images/leave.png'
import muteImg from '../../../common/images/gray@2x.png'
import deleteChat from '../../../common/icons/reaction_delete@2x.png'
import moreIcon from '../../../common/icons/menu@2x.png'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      zIndex: "999",
      width: "100%",
      height: "60px",
      maxHeight: "60px",
      minHeight: "40px",
      justifyContent: "space-between",
      alignItems: "center",
      // padding: "0 10px",
      backdropFilter: 'blur(32px)',
      background: 'rgba(255,255,255,.8)',
    },
    leftBar: {
      display: "flex",
      alignItems: "center",
      position: 'relative'
    },
    avatar: {
      margin: "0 12px 0 16px",
    },
    imgBox: {
      position: 'absolute',
      bottom: '0px',
      left: '45px',
      zIndex: 1,
      borderRadius: '50%',
      width: '17px',
      height: '17px',
      lineHeight: '21px',
      textAlign: 'center',
      background: '#fff',
    },
    imgStyle: {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
    },
    muteImgStyle: {
      width: '12px',
      marginLeft: '2px',
      height: '12px',
    },
    threadIcon: {
      width: '21px',
      height: '20px',
    },
    deleteChatImg: {
      width: '30px',
      height: '30px',
      verticalAlign: 'middle',
    },
    imgActive: {
      borderRadius: '50%',
      width: '32px',
      cursor: 'pointer',
      marginRight: '10px',
      verticalAlign: 'middle',
    },
    userStatusOnline: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight:' 500',
      fontSize: '12px',
      lineHeight: '14px',
      color: '#999999',
    },
    nameStatusMuteBox: {
      textAlign: 'left'
    }
  };
});
const MessageBar = () => {
  let easeChatProps = useContext(EaseChatContext);
  const { onChatAvatarClick } = easeChatProps
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);
  const showThread = useSelector((state) => state.thread.showThread);

  const [sessionEl, setSessionEl] = useState(null);

  const { chatType, to, name, presenceExt } = globalProps;
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
            {i18next.t("Clear Messages")}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClickDeleteSession}>
          <Box className={classes.menuItemIconBox}>
            {/* <Icon className="iconfont icon-shanchuhuihua"></Icon> */}
            <img className={classes.deleteChatImg} src={deleteChat} alt="" />
          </Box>
          <Typography variant="inherit" noWrap>
            {i18next.t("Delete Chat")}
          </Typography>
        </MenuItem>
      </Menu>
    );
  };

  const handleSessionInfoClick = (e) => {
    setSessionEl(e.currentTarget);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const onClose = ()=>{
    setAnchorEl(null);
    dispatch(ThreadActions.setThreadListPanelDisplay(false));
  }
  const openThreadList = (e)=>{
    setAnchorEl(e.currentTarget)
  }
  const threadListAnchorEl = useRef(null);

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
  const threadListPanelDisplay = useSelector((state) => state.thread?.threadListPanelDisplay) || false;
  useEffect(()=>{
    if(threadListPanelDisplay){
      setAnchorEl(threadListAnchorEl.current)
    }else{
      onClose()
    }
  },[threadListPanelDisplay])

  return (
    <div className={classes.root}>
      <Box position="static" className={classes.leftBar}>
        <Avatar className={classes.avatar} onClick={(e) => onChatAvatarClick && onChatAvatarClick(e,{chatType, to})} 
        src={chatType === "singleChat" ? userAvatars[userAvatarIndex] : groupAvatarIcon}
          style={{ borderRadius: chatType === "singleChat" ? "50%" : 'inherit'}}
        ></Avatar>
          {
            chatType === "singleChat" ?
            <div className={classes.imgBox}>
              <img alt="" src={(presenceExt && getUserOnlineStatus[presenceExt[to]?.ext]) ? getUserOnlineStatus[presenceExt[to]?.ext] : customIcon} className={classes.imgStyle} />
            </div>
            : null
          }
        <div className={classes.nameStatusMuteBox}>
          {name[to] || to}
          {
            presenceExt && presenceExt[to]?.muteFlag ? <img className={classes.muteImgStyle} alt="" src={muteImg} /> : null
          }
          {
            presenceExt && presenceExt[to]?.device && <div className={classes.userStatusOnline}>{presenceExt[to]?.device} {presenceExt[to]?.ext === '' ? 'Online' : presenceExt[to]?.ext}</div>
          }
        </div>
      </Box>
      <Box position="static">
        <IconButton className="iconfont icon" style={{display: chatType === "groupChat" && showThread ? "inline-flex" : "none"}} onClick={openThreadList} ref={threadListAnchorEl}>
          <img alt="" className={classes.threadIcon} src={threadIcon} />
        </IconButton>
        {/* <IconButton
          onClick={handleSessionInfoClick}
          className="iconfont icon-hanbaobao icon"
        ></IconButton> */}
        <img src={moreIcon} className={classes.imgActive} style={{background: sessionEl ? '#ccc' : '' }} onClick={handleSessionInfoClick} alt="" />
      </Box>
      {renderSessionInfoMenu()}
      <ThreadListPanel anchorEl={anchorEl} onClose={onClose}/>
    </div>
  );
};

export default MessageBar;
