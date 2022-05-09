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
import CallKit from 'zd-callkit'
import WebIM from '../../../utils/WebIM'

import InviteModal from './inviteModal'

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
    imgBox: {
      position: 'absolute',
      bottom: '0px',
      left: '45px',
      zIndex: 1,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      lineHeight: '26px',
      textAlign: 'center',
      background: '#fff',
    },
    imgStyle: {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
    },
  };
});
const MessageBar = ({showinvite}) => {
  let easeChatProps = useContext(EaseChatContext);
  const { onChatAvatarClick } = easeChatProps
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);

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
  const [inviteOpen, setInviteOpen] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [callType, setCallType] = useState('')
  useEffect(() => {
    let newwInfoData =usersInfoData && usersInfoData.length > 0 ? usersInfoData : localStorage.getItem("usersInfo_1.0")
    setUsersInfoData(newwInfoData)
    setUserAvatarIndex(_.find(newwInfoData, { username: to })?.userAvatar || 1)
  }, [to])

  useEffect(() => {
    let appId = '15cb0d28b87b425ea613fc46f7c9f974';
    CallKit.init(appId, WebIM.conn.agoraUid, WebIM.conn)
  }, [])

  const callVoice = async () => {
    console.log('to', to, chatType)
    setCallType('audio')
    if(chatType === 'groupChat'){
        let members = await getGroupMembers(to) || []
        setGroupMembers(members)
        console.log(111111, members)
        setInviteOpen(true)
    }else{

        let options = {
            callType: 0,
            chatType: 'singleChat',
            to: to,
            agoraUid: WebIM.conn.agoraUid,
            message: 'invite you to audio call'
        }
        CallKit.callVoice(options)
    }
  }

  const callVideo = async () => {
    setCallType('video')
    if(chatType === 'groupChat'){
        let members = await getGroupMembers(to) || []
        setGroupMembers(members)
        console.log(111111, members)
        setInviteOpen(true)
    }else{
        let options = {
            callType: 1,
            chatType: 'singleChat',
            to: to,
            agoraUid: WebIM.conn.agoraUid,
            message: 'invite you to video call'
        }
        CallKit.callVoice(options)
    }
  }

  const startCall = (members) => {
    setInviteOpen(false)
    let options = {
        callType: callType == 'audio' ? 3 : 2,
        chatType: 'groupChat',
        to: members,
        agoraUid: WebIM.conn.agoraUid,
        message: `invite you to ${callType} call`
    }
    CallKit.callVoice(options)
  }

  const handleInviteClose = () => {
    setInviteOpen(false)
  }

  useEffect( async () => {
    if(chatType === 'groupChat'){
        let members = await getGroupMembers(to) || []
        setGroupMembers(members)
        setInviteOpen(showinvite)
    }
    
  }, [showinvite])

  const getGroupMembers = async (gid) => {
      let data = await WebIM.conn.listGroupMembers({pageNum: 1, pageSize: 500, groupId: gid})
      return data.data
  }

  return (
  <>
    <div className={classes.root}>
      <Box position="static" className={classes.leftBar}>
        <Avatar className={classes.avatar} onClick={(e) => onChatAvatarClick && onChatAvatarClick(e,{chatType, to})} 
        src={chatType === "singleChat" ? userAvatars[userAvatarIndex] : groupAvatarIcon}
          style={{ borderRadius: chatType === "singleChat" ? "50%" : 'inherit'}}
        ></Avatar>
          {
            chatType === "singleChat" ?
            <div className={classes.imgBox}>
              <img alt="" src={getUserOnlineStatus[presenceExt[to]] || customIcon} className={classes.imgStyle} />
            </div>
            : null
          }
        {name || to}
      </Box>

      <Box position="static">
        {
          window.location.protocol === 'https:' && <>
            <IconButton
              onClick={callVoice}
              className="iconfont icon-yuyin icon"
            ></IconButton>
            <IconButton
              onClick={callVideo}
              className="iconfont icon-shipin icon"
            ></IconButton>
          </>
        }

        <IconButton
          onClick={handleSessionInfoClick}
          className="iconfont icon-hanbaobao icon"
        ></IconButton>
      </Box>
      {renderSessionInfoMenu()}
    </div>
    <InviteModal open={inviteOpen} onClose={handleInviteClose} onCall={startCall} members={groupMembers}/>
    </>
  );
};

export default MessageBar;
