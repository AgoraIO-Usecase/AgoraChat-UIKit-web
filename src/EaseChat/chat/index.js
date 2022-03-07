import React, { useEffect, memo, createContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import MessageList from "./messageList";
import MessageBar from "./messageBar/index";
import { useSelector } from "../../EaseApp/index";
import { Provider } from "react-redux";
import SendBox from "./sendBox";
import WebIM, { initIMSDK } from "../../utils/WebIM";
import store from "../../redux/index";
import createlistener from "../../utils/WebIMListen";
import _ from "lodash";
import "../../i18n";
import "../../common/iconfont.css";
import noMessage from "../../common/images/nomessage.png";
import i18next from "i18next";

export const EaseChatContext = createContext();
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "calc(100% - 20px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
}));

const Chat = (props) => {
  useEffect(() => {
    if (props.appkey && props.username) { //  && props.agoraToken
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
        // agoraToken: props.agoraToken,
        pwd: props.password,
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
      <EaseChatContext.Provider value={props}>
        <MessageBar />
        <MessageList
          messageList={messageList}
          showByselfAvatar={props.showByselfAvatar}
        />
        <SendBox />
      </EaseChatContext.Provider>
    </div>
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={noMessage} alt="" style={{ height: "200px", width: "200px" }} />
    </div>
  );
};

const EaseChatProvider = (props) => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <Chat {...props} />
      </React.StrictMode>
    </Provider>
  );
};
EaseChatProvider.getSdk = (props) => {
  if (!WebIM.conn) {
    initIMSDK(props.appkey);
    createlistener(props);
  }
  return WebIM
};
export default EaseChatProvider;

EaseChatProvider.propTypes = {
  appkey: PropTypes.string,
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  chatType: PropTypes.string,
  to: PropTypes.string,

  showByselfAvatar: PropTypes.bool,
  easeInputMenu:PropTypes.string,
  menuList:PropTypes.array,
  handleMenuItem:PropTypes.func,

  successLoginCallback:PropTypes.func,
  failCallback:PropTypes.func,
  onChatAvatarClick:PropTypes.func,
};

EaseChatProvider.defaultProps = {
  showByselfAvatar:false,
  easeInputMenu:'all',
  menuList: [
    { name: i18next.t('send-image'), value: "img", key: "1" },
    { name: i18next.t('send-file'), value: "file", key: "2" },
  ],
};