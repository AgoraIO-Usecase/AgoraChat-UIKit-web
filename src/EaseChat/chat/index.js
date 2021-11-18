import React, { useEffect, memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import MessageList from "./messageList";
import MessageBar from "./messageBar/index";
import { useSelector, useDispatch } from "../../EaseApp/index";
import { Provider } from "react-redux";
import SendBox from "./sendBox";
import WebIM, { initIMSDK } from "../../utils/WebIM";
import store from "../../redux/index";
import GlobalPropsActions from "../../redux/globalProps";
import SessionActions from "../../redux/session";
import createListen from "../../utils/WebIMListen";
import _ from "lodash";
import AppDB from "../../utils/AppDB";
import "../../i18n";
import "../../common/iconfont.css";
import noMessage from "../../common/images/nomessage.png";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
}));

const Chat = (props) => {
  // const dispatch = useDispatch();
  useEffect(() => {
    if (props.appkey && props.username && props.agoraToken) {
      initIMSDK(props.appkey);
      createListen();
      if (WebIM.conn.logOut) {
        login();
      }
    }
  }, []);

  const login = () => {
    const noLogin = WebIM.conn.logOut;
    noLogin &&
      WebIM.conn.open({
        user: props.username,
        agoraToken: props.agoraToken,
        appKey: WebIM.config.appkey,
      });
  };
  const classes = useStyles();

  const messageList =
    useSelector((state) => {
      const to = state.global.globalProps.to;
      const chatType = state.global.globalProps.chatType;
      return _.get(state, ["message", chatType, to], []);
    }) || [];

  const to = useSelector((state) => state.global.globalProps.to);

  return to ? (
    <div className={classes.root}>
      <MessageBar />
      <MessageList
        messageList={messageList}
        showByselfAvatar={props.showByselfAvatar}
      />
      <SendBox />
    </div>
  ) : (
    <div style={{ width: "100%", height: "100%",display:'flex',alignItems:'center',justifyContent:'center' }}>
      <img src={noMessage} alt="" style={{ height: "200px", width: "200px" }} />
    </div>
  );
};

const ChatWrapper = (props) => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <Chat {...props} />
      </React.StrictMode>
    </Provider>
  );
};
ChatWrapper.getSdk = (props) => {
  initIMSDK(props.appkey);
  createListen();
  return WebIM;
};
export default ChatWrapper;

ChatWrapper.propTypes = {
  appkey: PropTypes.string,
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  chatType: PropTypes.string,

  // TODO 接收人
  to: PropTypes.string,
  sdkConnection: PropTypes.object,
  showByselfAvatar: PropTypes.bool, //是否展示自己聊天头像
};
