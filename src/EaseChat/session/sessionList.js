import React, { useContext ,useState} from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import SearchIcon from '@material-ui/icons/Search';
import Box from "@material-ui/core/Box";
import {IconButton,InputBase} from "@material-ui/core"
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "../../EaseApp/index";
import { renderTime } from "../../utils/index";
import {EaseAppContext} from '../../EaseApp/index'
import _ from 'lodash'
// import { FixedSizeList } from 'react-window';
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
  listItem: {
    padding: "0 14px",
    borderRadius:'20px',
    '& .Mui-selected':{
      backgroundColor: 'rgba(255, 255, 255, 1) !important'
    }
  },
  itemBox: {
    display: "flex",
    flex: 1,
    height: "100%",
    alignItems: "center",
    boxSizing: "border-box",
    padding:'5px 0'
  },
  avatar: {
    height: "40px !important",
    width: "40px !important",
    overflow: "inherit !important",
  },
  MuiListItemTextSecondary: {
    color: "red",
  },
  itemRightBox: {
    flex: 1,
  },
  itemName: {
    fontSize: "16px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemMsgBox: {
    position: "relative",
    height: "20px",
    display: "flex",
    alignItems: "center",
  },
  time: {
    display: "inline-block",
    height: "17px",
    fontSize: "12px",
    color: "rgba(1, 1, 1, .6)",
    marginRight: "2px",
  },
  itemMsg: {
    display: "inline-block",
    height: "20px",
    overflow: "hidden",
    color: "rgba(1, 1, 1, .6)",
    width: "calc(100% - 18px)",
    fontSize: "14px",
    wordBreak: 'break-all'
  },
  unreadNum: {
    color: "#fff",
    background: "rgba(245, 12, 205, 1)",
    display: "inline-block",
    height: "16px",
    borderRadius: "8px",
    fontSize: "10px",
    minWidth: "16px",
    textAlign: "center",
    position: "absolute",
    right: "0",
  },
}));

export default function SessionList(props) {
  let easeAppProps = useContext(EaseAppContext)
  const {isShowUnread,unreadType} = easeAppProps
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
  renderSessionList.forEach((element, index) => {
    if (element.sessionId === currentSession) {
      currentSessionIndex = index;
    }
  });

  const handleListItemClick = (event, index, session) => {
    if (currentSessionIndex !== index || !to) {
      props.onClickItem(session);
    }
  };

  const searchSession = (e) =>{
    let ary = []
    if (e.target.value) {
      renderSessionList.map((val,key)=>{
        console.log('val>>',val);
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
  
  const test1 = () =>{
    console.log('1');
  }

  const test2 = () =>{
    console.log('2');
  }

  let userAvatars = {
    1: avatarIcon1,
    2: avatarIcon2,
    3: avatarIcon3
  }
 let renderSession = searchAry.length>0?searchAry:renderSessionList
  return (
    <>
    <Paper component="form" className={classes.paper}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.inputBase}
        sx={{ ml: 1, flex: 2 }}
        placeholder="Search"
        onChange={searchSession}
      />
    </Paper>
    {/* <FixedSizeList className={classes.root}   itemSize={46}
        itemCount={200}
        overscanCount={5}> */}
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
            <ListItem
              key={session.sessionId}
              selected={currentSessionIndex === index}
              onClick={(event) => handleListItemClick(event, index, session)}
              button
              className={classes.listItem}

              onMouseOver={test1} onMouseLeave={test2}
            >
              <Box className={classes.itemBox}>
                <ListItemAvatar>
                  <Avatar
                    // className={classes.avatar}
                    style={{ borderRadius: `${session.sessionType}` === "singleChat" ? "50%" : 'inherit'}}
                    alt={`${session.name || session.sessionId}`}
                    src={avatarSrc}
                  />
                </ListItemAvatar>
                <Box className={classes.itemRightBox}>
                  <Typography className={classes.itemName}>
                    <span>{session.name || session.sessionId}</span>
                    <span className={classes.time}>
                      {renderTime(session?.lastMessage?.time)}
                    </span>
                  </Typography>

                  <Typography className={classes.itemMsgBox}>
                    <span className={classes.itemMsg}>
                      {session?.lastMessage?.body?.msg}
                    </span>

                    {isShowUnread &&
                      <span
                      className={classes.unreadNum}
                      style={{
                        display: session.unreadNum ? "inline-block" : "none",
                      }}
                    >
                      {unreadType ?session.unreadNum:null}
                    </span>
                    }
                    <IconButton
                      className="iconfont icon-hanbaobao icon"
                      sx={{
                        bgcolor:'red',
                        height:'10px',
                        width:'10px'
                      }}
                    ></IconButton>
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          );
        })}
      </List>
      {/* </FixedSizeList> */}
      </>
  );
}

SessionList.defaultProps = {};
