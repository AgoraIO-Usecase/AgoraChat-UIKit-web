import React from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "../../EaseApp/index";
import { renderTime } from "../../utils/index";
import groupIcon from "../../common/images/group@2x.png";
import chatRoomIcon from "../../common/images/chatroom@2x.png";
import noticeIcon from "../../common/images/notice@2x.png";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: '0 !important',
    padding: '0 !important',
    overflowY:'scroll',
  },
  listItem: {
    // height: theme.spacing(18),
    padding: "0 14px",
  },
  itemBox: {
    display: "flex",
    flex: 1,
    height: "100%",
    alignItems: "center",
    boxSizing: "border-box",
  },
  avatar: {
    height: "50px",
    width: "50px",
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
  const classes = useStyles();
  const sessionList = useSelector((state) => state.session?.sessionList) || [];
  const message = useSelector((state) => state.message);
  const { unread } = message;
  const currentSession = useSelector((state) => state.session?.currentSession);
  let currentSessionIndex = '';

  // dealwith notice unread num
  const notices = useSelector((state) => state.notice?.notices) || [];
  let noticeUnreadNum = 0;
  notices.forEach((item) => {
    if (!item.disabled) {
      noticeUnreadNum++;
    }
  });
  const renderSessionList = sessionList
    .asMutable({ deep: true })
    .map((session) => {
      const chatMsgs =
        message?.[session.sessionType]?.[session.sessionId] || [];
      if (chatMsgs.length > 0) {
        session.lastMessage = chatMsgs[chatMsgs.length - 1];
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
    console.log('renderSessionList>>',renderSessionList);
  renderSessionList.forEach((element, index) => {
    if (element.sessionId === currentSession) {
      currentSessionIndex = index;
    }
  });

  const handleListItemClick = (event, index, session) => {
    if (currentSessionIndex !== index) {
      props.onClickItem(session);
    }
  };

  return (
    <List dense className={classes.root}>
      {renderSessionList.map((session, index) => {
        let avatarSrc = "";
        if (session.sessionType === "groupChat") {
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
          >
            <Box className={classes.itemBox}>
              <ListItemAvatar>
                <Avatar
                  className={classes.avatar}
                  alt={`session.sessionId`}
                  src={avatarSrc}
                />
              </ListItemAvatar>
              <Box className={classes.itemRightBox}>
                <Typography className={classes.itemName}>
                  <span>{session.sessionId}</span>

                  <span className={classes.time}>
                    {renderTime(session?.lastMessage?.time)}
                  </span>
                </Typography>

                <Typography className={classes.itemMsgBox}>
                  <span className={classes.itemMsg}>
                    {session?.lastMessage?.body?.msg}
                  </span>

                  <span
                    className={classes.unreadNum}
                    style={{
                      display: session.unreadNum ? "inline-block" : "none",
                    }}
                  >
                    {session.unreadNum}
                  </span>
                </Typography>
              </Box>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}

SessionList.defaultProps = {};
