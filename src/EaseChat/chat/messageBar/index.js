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
import CallKit from 'zd-callkit'
import WebIM from '../../../utils/WebIM'

import InviteModal from './inviteModal'
import threadIcon from '../../../common/images/thread.png'

import offlineImg from '../../../common/images/Offline.png'
import onlineIcon from '../../../common/images/Online.png'
import busyIcon from '../../../common/images/Busy.png'
import donotdisturbIcon from '../../../common/images/Do_not_Disturb.png'
import customIcon from '../../../common/images/custom.png'
import leaveIcon from '../../../common/images/leave.png'
import muteImg from '../../../common/images/gray@2x.png'

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
    muteImgStyle: {
      width: '12px',
      marginLeft: '2px',
      height: '12px',
    },
    threadIcon: {
      width: '21px',
      height: '20px',
    }
  };
});
const MessageBar = ({ showinvite, onInviteClose, confrData }) => {
  let easeChatProps = useContext(EaseChatContext);
  const { onChatAvatarClick, isShowRTC, getRTCToken, agoraUid, getIdMap, appId } = easeChatProps
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
      dispatch(GlobalPropsActions.setGlobalProps({ to: null }))
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
  const [inviteOpen, setInviteOpen] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [callType, setCallType] = useState('')
  useEffect(() => {
    let newInfoData = usersInfoData && usersInfoData.length > 0 ? usersInfoData : localStorage.getItem("usersInfo_1.0")
    setUsersInfoData(newInfoData)
    setUserAvatarIndex(_.find(newInfoData, { username: to })?.userAvatar || 1)
  }, [to])

  const callAudio = async () => {
    console.log('to', to, chatType)
    setCallType('audio')
    const channel = Math.uuid(8)
    if (chatType === 'groupChat') {
      let members = await getGroupMembers(to) || []
      setGroupMembers(members)
      setInviteOpen(true)
    } else {
      const { agoraUid, accessToken } = await getRTCToken({
        channel: channel,
        username: WebIM.conn.context.userId
      })
      let options = {
        callType: 0,
        chatType: 'singleChat',
        to: to,
        agoraUid,
        message: 'invite you to audio call',
        accessToken,
        channel
      }
      CallKit.startCall(options)
    }
    let idMap = await getIdMap({ userId: WebIM.conn.context.userId, channel })
    CallKit.setUserIdMap(idMap)
  }
  console.log('easeChatProps @@@@', easeChatProps)
  const callVideo = async () => {
    const channel = Math.uuid(8)
    const { agoraUid, accessToken } = await getRTCToken({
      channel: channel,
      // agoraId: WebIM.conn.agoraUid,
      username: WebIM.conn.context.userId
    })
    console.log('token', agoraUid, accessToken)
    setCallType('video')
    if (chatType === 'groupChat') {
      let members = await getGroupMembers(to) || []
      setGroupMembers(members)
      setInviteOpen(true)
    } else {
      let options = {
        callType: 1,
        chatType: 'singleChat',
        to: to,
        agoraUid,
        message: 'invite you to video call',
        accessToken,
        channel
      }
      CallKit.startCall(options)
    }
    let idMap = await getIdMap({ userId: WebIM.conn.context.userId, channel })
    CallKit.setUserIdMap(idMap)
  }

  const startCall = async (members) => {
    setInviteOpen(false)
    const channel = confrData.channel || Math.uuid(8)
    const type = confrData.type || callType == 'audio' ? 3 : 2
    const { agoraUid, accessToken } = await getRTCToken({
      channel: channel,
      username: WebIM.conn.context.userId
    })

    let options = {
      callType: type,
      chatType: 'groupChat',
      to: members,
      agoraUid: agoraUid,
      message: `invite you to ${callType} call`,
      groupId: to,
      groupName: confrData.groupName || name,
      accessToken,
      channel
    }
    // 多人通话过程中发邀请的文档
    CallKit.startCall(options)

    let idMap = await getIdMap({ userId: WebIM.conn.context.userId, channel })
    CallKit.setUserIdMap(idMap)
  }

  const handleInviteClose = () => {
    setInviteOpen(false)
    onInviteClose && onInviteClose()
  }

  useEffect(async () => {
    console.log('监听 invite 变化', chatType, showinvite, confrData)

    if (chatType === 'groupChat' || !chatType) {
      let gid = to
      if (!to) {
        gid = confrData.groupId
      }
      console.log('gid', gid)
      if (!gid) return
      let members = await getGroupMembers(gid) || []
      setGroupMembers(members)
      setInviteOpen(showinvite)
    }

  }, [showinvite])

  const getGroupMembers = async (gid) => {
    let data = await WebIM.conn.listGroupMembers({ pageNum: 1, pageSize: 500, groupId: gid })
    return data.data
  }
  
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
          {name || to}
        </Box>

        <Box position="static">
          {
            window.location.protocol === 'https:' && isShowRTC && <>
              <IconButton
                onClick={callAudio}
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
      <InviteModal open={inviteOpen} onClose={handleInviteClose} onCall={startCall} members={groupMembers} joinedMembers={confrData.joinedMembers} />
    </>
  );
};

export default MessageBar;
