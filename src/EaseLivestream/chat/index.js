import React, { useEffect, memo, createContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import MessageList from "./messageList";
import MessageBar from "./messageBar/index";
import { Provider, useSelector } from "react-redux";
import SendBox from "./sendBox";
import WebIM, { initIMSDK } from "../../utils/WebIM";
import store from "../../redux/index";
import createlistener from "../../utils/WebIMListen";
import _ from "lodash";
import "../../i18n";
import "../../common/iconfont.css";
import noMessage from "../../common/images/nomessage.png";
import GlobalPropsActions from "../../redux/globalProps";
import i18next from "i18next";

export const EaseLivestreamContext = createContext();
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // height: "calc(100% - 20px)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
}));

const Chat = (props) => {
  useEffect(() => {
    if (props.appkey && props.username && props.agoraToken) {
      initIMSDK(props.appkey);
      createlistener(props);
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

  return (
    <div className={classes.root}>
      <EaseLivestreamContext.Provider value={props}>
        <MessageBar />
        <MessageList
          messageList={messageList}
          showByselfAvatar={props.showByselfAvatar}
        />
        <SendBox />
      </EaseLivestreamContext.Provider>
    </div>
  );
};

const EaseLivestreamProvider = (props) => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <Chat {...props} />
      </React.StrictMode>
    </Provider>
  );
};
EaseLivestreamProvider.getSdk = (props) => {
  if (!WebIM.conn) {
    initIMSDK(props.appkey);
    createlistener(props);
  }
  return WebIM;
};

EaseLivestreamProvider.addConversationItem = (session) => {
  if (session && Object.keys(session).length > 0) {
    const { conversationType, conversationId } = session;
    store.dispatch(
      GlobalPropsActions.setGlobalProps({
        to: conversationId,
        chatType: conversationType,
      })
    );
  }
};

export default EaseLivestreamProvider;

EaseLivestreamProvider.propTypes = {
  appkey: PropTypes.string,
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  chatType: PropTypes.string,
  to: PropTypes.string,

  showByselfAvatar: PropTypes.bool,
  easeInputMenu: PropTypes.string,
  menuList: PropTypes.array,
  handleMenuItem: PropTypes.func,

  successLoginCallback: PropTypes.func,
  failCallback: PropTypes.func,
  onChatAvatarClick: PropTypes.func,

  customMessageList: PropTypes.array,
  customMessageClick: PropTypes.func,

  closeChat: PropTypes.func,
  roomUserInfo: PropTypes.object,
};

EaseLivestreamProvider.defaultProps = {
  showByselfAvatar: false,
  easeInputMenu: "all",
  menuList: [
    { name: i18next.t("send-image"), value: "img", key: "1" },
    { name: i18next.t("send-file"), value: "file", key: "2" },
    { name: i18next.t("send-video"), value: "video", key: "3" },
  ],
};
