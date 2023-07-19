import React, { useState, useEffect, useContext, useRef } from "react";
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
import avatarIcon1 from '../../../common/images/avatar1.jpg'
import avatarIcon2 from '../../../common/images/avatar2.jpg'
import avatarIcon3 from '../../../common/images/avatar3.jpg'
import avatarIcon4 from '../../../common/images/avatar4.jpg'
import avatarIcon5 from '../../../common/images/avatar5.jpg'
import avatarIcon6 from '../../../common/images/avatar6.jpg'
import avatarIcon7 from '../../../common/images/avatar7.jpg'
import avatarIcon11 from '../../../common/images/avatar11.jpg'
import groupAvatarIcon from '../../../common/images/groupAvatar.png'
import CallKit from 'chat-callkit'
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
import deleteChat from '../../../common/icons/reaction_delete@2x.png'
import moreIcon from '../../../common/icons/menu@2x.png'

import deleteIcon from '../../../common/icons/delete@2x.png'
import clearIcon from '../../../common/icons/clear@2x.png'

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
      width: '20px',
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
      marginRight: '12px',
      verticalAlign: 'middle',
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.04)',
      }
    },
    userStatusOnline: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: ' 500',
      fontSize: '12px',
      lineHeight: '14px',
      color: '#999999',
    },
    nameStatusMuteBox: {
      textAlign: 'left'
    },
    threadBtnBox: {
      padding: '6px',
    }
  };
});
let intervalTime = null
let timeoutTime = null
const MessageBar = ({ showinvite, onInviteClose, confrData }) => {
  let easeChatProps = useContext(EaseChatContext);
  const { onChatAvatarClick, isShowRTC, getRTCToken, agoraUid, getIdMap, appId } = easeChatProps
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);
  const showThread = useSelector((state) => state.thread.showThread);
  const [sessionEl, setSessionEl] = useState(null);
  const [showEnter, setShowEnter] = useState(false);
  const showTyping = useSelector((state) => state.global.showTyping);
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
          <img src={clearIcon} alt="" style={{ width: '30px' }} />
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
  const onClose = () => {
    setAnchorEl(null);
    dispatch(ThreadActions.setThreadListPanelDisplay(false));
  }
  const openThreadList = (e) => {
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
    3: avatarIcon3,
    4: avatarIcon4,
    5: avatarIcon5,
    6: avatarIcon6,
    7: avatarIcon7,
    8: avatarIcon11,
  }
  const [userAvatarIndex, setUserAvatarIndex] = useState([])
  const [usersInfoData, setUsersInfoData] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [callType, setCallType] = useState('')
  useEffect(() => {
    if (to) {
      let newwInfoData = localStorage.getItem("usersInfo_1.0")
      if (newwInfoData) {
        newwInfoData = JSON.parse(newwInfoData)
      }
      setUserAvatarIndex(_.find(newwInfoData, { username: to })?.userAvatar || 8)
      if (intervalTime) {
        clearInterval(intervalTime)
      }
      intervalTime = setInterval(() => {
        let newwInfoData = localStorage.getItem("usersInfo_1.0")
        if (newwInfoData) {
          newwInfoData = JSON.parse(newwInfoData)
        }
        setUserAvatarIndex(_.find(newwInfoData, { username: to })?.userAvatar || 8)
      }, 500)
      timeoutTime = setTimeout(() => {
        clearInterval(intervalTime)
        clearTimeout(timeoutTime)
      }, 2000)
    }
  }, [to])

  const callAudio = async () => {
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
        message: 'Start a voice call',
        accessToken,
        channel
      }
      CallKit.startCall(options)
    }
    let idMap = await getIdMap({ userId: WebIM.conn.context.userId, channel })
    CallKit.setUserIdMap(idMap)
  }
  const callVideo = async () => {
    const channel = Math.uuid(8)
    const { agoraUid, accessToken } = await getRTCToken({
      channel: channel,
      // agoraId: WebIM.conn.agoraUid,
      username: WebIM.conn.context.userId
    })
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
        message: 'Start a video call',
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
    onInviteClose && onInviteClose()
    const channel = confrData.channel || Math.uuid(8)
    const type = confrData.type || callType == 'audio' ? 3 : 2
    const { agoraUid, accessToken } = await getRTCToken({
      channel: channel,
      username: WebIM.conn.context.userId
    })
    // confrData.token = accessToken
    // confrData.agoraUid = agoraUid

    let options = {
      callType: type,
      chatType: 'groupChat',
      to: members,
      agoraUid: agoraUid,
      message: `Start a ${callType == 'audio' ? 'voice' : 'video'} call`,
      groupId: confrData.groupId || to,
      groupName: confrData.groupName || name[to],
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

  useEffect(() => {
    async function updateGroupMember() {
      let gid = confrData.groupId
      if (!gid) {
        console.warn('groupId is null')
        return
      }
      setInviteOpen(showinvite)
      if (!showinvite) {
        onInviteClose && onInviteClose()
      }
      let members = await getGroupMembers(gid) || []
      setGroupMembers(members)
    }
    updateGroupMember()
  }, [showinvite])

  const getGroupMembers = async (gid) => {
    let data = await WebIM.conn.listGroupMembers({ pageNum: 1, pageSize: 500, groupId: gid })
    return data.data
  }

  const threadListPanelDisplay = useSelector((state) => state.thread?.threadListPanelDisplay) || false;
  useEffect(() => {
    if (threadListPanelDisplay) {
      setAnchorEl(threadListAnchorEl.current)
    } else {
      onClose()
    }
  }, [threadListPanelDisplay])

  return (
    <>
      <div className={classes.root}>
        <Box position="static" className={classes.leftBar}>
          <Avatar className={classes.avatar} onClick={(e) => onChatAvatarClick && onChatAvatarClick(e, { chatType, to })}
            src={chatType === "singleChat" ? userAvatars[userAvatarIndex] : groupAvatarIcon}
            style={{ borderRadius: chatType === "singleChat" ? "50%" : 'inherit' }}
          ></Avatar>
          {
            chatType === "singleChat" ?
              <div className={classes.imgBox}>
                <img alt="" src={(presenceExt && getUserOnlineStatus[presenceExt[to]?.ext]) ? getUserOnlineStatus[presenceExt[to]?.ext] : customIcon} className={classes.imgStyle} />
              </div>
              : null
          }
          <div className={classes.nameStatusMuteBox}>
            {name && name[to] || to}
            {
              presenceExt && presenceExt[to]?.muteFlag ? <img className={classes.muteImgStyle} alt="" src={muteImg} /> : null
            }
            <div className={classes.userStatusOnline}>
              {
                chatType === "singleChat" && presenceExt && presenceExt[to]?.device && <span>{presenceExt[to]?.device} {presenceExt[to]?.ext === '' ? 'Online' : presenceExt[to]?.ext}</span>
              }
              {
                showTyping && <span className={classes.userStatusOnline} style={{ marginLeft: '5px' }}>Entering ...</span>
              }
            </div>
          </div>
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
          <IconButton className={`${classes.threadBtnBox} iconfont icon`} style={{ display: chatType === "groupChat" && showThread ? "inline-flex" : "none" }} onClick={openThreadList} ref={threadListAnchorEl}>
            <img alt="" className={classes.threadIcon} src={threadIcon} />
          </IconButton>
          <img src={moreIcon} className={classes.imgActive} style={{ background: sessionEl ? '#ccc' : '' }} onClick={handleSessionInfoClick} alt="" />
        </Box>
        {renderSessionInfoMenu()}
        <ThreadListPanel anchorEl={anchorEl} onClose={onClose} />
      </div>
      <InviteModal open={inviteOpen} onClose={handleInviteClose} onCall={startCall} members={groupMembers} joinedMembers={confrData.joinedMembers} />
    </>
  );
};

export default MessageBar;
