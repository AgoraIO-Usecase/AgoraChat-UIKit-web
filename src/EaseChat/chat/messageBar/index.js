import React, { useState } from "react";
import { useSelector, useDispatch } from "../../../EaseApp/index";
import { Menu, MenuItem, IconButton, Icon, InputBase } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, fade } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

import i18next from "i18next";

import MessageActions from "../../../redux/message";
import SessionActions from "../../../redux/session";
import GlobalPropsActions from "../../../redux/globalProps"
import WebIM from "../../../utils/WebIM";

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
    },
    avatar: {
      margin: "0 20px 0 16px",
    },
  };
});
const MessageBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupById = useSelector((state) => state.group?.group.byId) || {};
  const globalProps = useSelector((state) => state.global.globalProps);

  const [sessionEl, setSessionEl] = useState(null);

  const { chatType, to, username } = globalProps;
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
  return (
    <div className={classes.root}>
      <Box position="static" className={classes.leftBar}>
        {/* // TODO nickname 可配置 */}
        <Avatar className={classes.avatar}></Avatar>
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
