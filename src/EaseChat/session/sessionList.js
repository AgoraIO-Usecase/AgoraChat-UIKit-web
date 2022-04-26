import React, { useContext ,useState} from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import SearchIcon from '@material-ui/icons/Search';
import {IconButton,InputBase} from "@material-ui/core"
import Paper from "@material-ui/core/Paper";
import { useSelector } from "../../EaseApp/index";
import {EaseAppContext} from '../../EaseApp/index'
import _ from 'lodash'
import SessionItem from './sessionItem';

import groupIcon from "../../common/images/groupAvatar.png";
import chatRoomIcon from "../../common/images/chatroom@2x.png";
import noticeIcon from "../../common/images/notice@2x.png";
import avatarIcon1 from '../../common/images/avatar1.png'
import avatarIcon2 from '../../common/images/avatar2.png'
import avatarIcon3 from '../../common/images/avatar3.png'

import i18next from "i18next";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: '0 !important',
    padding: '0 5px !important',
    overflowY: 'auto',
    boxSizing:'border-box'
  },
  paper:{
    margin:'5px',
    paddingRight:'20px',
    borderRadius:'20px',
    display:'flex'
  },
  inputBase:{
    width:'100%'
  },
}));

export default function SessionList(props) {
  let easeAppProps = useContext(EaseAppContext)
  const classes = useStyles();
  const sessionList = useSelector((state) => state.session?.sessionList) || [];
  const to = useSelector((state) => state.global.globalProps.to);
  const message = useSelector((state) => state.message);
  const { unread } = message;
  const currentSession = useSelector((state) => state.session?.currentSession);
  let currentSessionIndex = null;
  const joinedGroups = useSelector((state) => state.session?.joinedGroups);
  // dealwith notice unread num
  const notices = useSelector((state) => state.notice?.notices) || [];
  const [searchAry,setSearchAry] = useState([])
  let noticeUnreadNum = 0;

  /******** -session- ********/
  notices.forEach((item) => {
    if (!item.disabled) {
      noticeUnreadNum++;
    }
  });
  const renderSessionList = sessionList
    .asMutable({ deep: true })
    .map((session) => {
      /******* --sessionId replaces the group name-- *******/
      joinedGroups.length>0 && joinedGroups.forEach((item) => {
        if(item.groupid === session.sessionId){
          session.name = item.groupname
        }
      })

      const chatMsgs =
        message?.[session.sessionType]?.[session.sessionId] || [];
      if (chatMsgs.length > 0) {
        let lastMessage = chatMsgs[chatMsgs.length - 1];
        let val = lastMessage.body || ''
        if (val && val.type === 'recall') {
          session.lastMessage = {
            time: lastMessage.time,
            body: {
              msg: lastMessage.chatType === 'singleChat' && lastMessage.bySelf? i18next.t("you retracted a message"):`${lastMessage.from}${i18next.t("retracted a message")}`,
            },
          }
        }else{
          session.lastMessage = lastMessage
        }
        session.unreadNum = unread[session.sessionType][session.sessionId];
      }
      if (session.sessionType === "notice") {
        if (notices.length) {
          let msg;
          session.unreadNum = noticeUnreadNum;
          if (notices[notices.length - 1].type === "joinGroupNotifications") {
            msg =
              "Request to join the group:" + notices[notices.length - 1].gid;
          } else {
            msg = notices[notices.length - 1]?.status;
          }
          session.lastMessage = {
            time: notices[notices.length - 1].id,
            body: {
              msg: msg,
            },
          };
        }
      }
      return session;
    })
    .sort((a, b) => {
      if (!a?.lastMessage?.time) return 1;
      if (!b?.lastMessage?.time) return -1;
      return b?.lastMessage?.time - a?.lastMessage?.time;
    });

  /******** -- ********/
  renderSessionList.forEach((element, index) => {
    if (element.sessionId === currentSession) {
      currentSessionIndex = index;
    }
  });

  const handleListItemClick = (e, index, session) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentSessionIndex !== index || !to) {
      props.onClickItem(session);
    }
  };

  const searchSession = (e) =>{
    let ary = []
    if (e.target.value) {
      renderSessionList.map((val,key)=>{
        let isIncludeAry = val.sessionType === 'groupChat'? val.name : val.sessionId
        let isIncludeVal = _.includes(_.toLower(isIncludeAry),_.toLower(e.target.value))
        if (isIncludeVal) {
          ary.push(val)
        }
        setSearchAry(_.uniq(ary))
      })
    }else{
      setSearchAry([])
    }
  }


  let userAvatars = {
    1: avatarIcon1,
    2: avatarIcon2,
    3: avatarIcon3
  }
 let renderSession = searchAry && searchAry.length>0?searchAry:renderSessionList


const deleteSessionClick = (v) =>{
  let newAry = _.filter(searchAry,(o)=>{
    return v.sessionId !== o.sessionId
  })
  setSearchAry(newAry)
}
  return (
    <>
    <Paper component="form" className={classes.paper}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.inputBase}
        sx={{ ml: 1, flex: 2 }}
        placeholder="Search"
        onChange={searchSession}
      />
    </Paper>
      <List dense className={classes.root}>
        {renderSession.map((session, index) => {
          let usersInfoData = localStorage.getItem("usersInfo_1.0")
          let avatarSrc = "";
          if (session.sessionType === "singleChat") {
            let findIndex =  _.find(usersInfoData, { username: session.sessionId }) || ''
            avatarSrc = userAvatars[findIndex.userAvatar] || avatarIcon1
          }else if (session.sessionType === "groupChat") {
            avatarSrc = groupIcon;
          } else if (session.sessionType === "chatRoom") {
            avatarSrc = chatRoomIcon;
          } else if (session.sessionType === "notice") {
            avatarSrc = noticeIcon;
          }
          return (
            <SessionItem 
            key={index} 
            currentVal={{session,index,currentSessionIndex,avatarSrc}} 
            handleListItemClick={handleListItemClick}
            deleteSessionClick={deleteSessionClick}
            />
          );
        })}
      </List>
      </>
  );
}
