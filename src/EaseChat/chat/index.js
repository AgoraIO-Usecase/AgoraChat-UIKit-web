import React, { useEffect, memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import MessageList from "./messageList";
import MessageBar from "./messageBar/index";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import SendBox from "./sendBox";
import WebIM, { initIMSDK } from "../../utils/WebIM";
import store from "../../redux/index";
import GlobalPropsActions from "../../redux/globalProps";
import createListen from "../../utils/WebIMListen";
import _ from "lodash";
import "../../i18n";
import "../../common/iconfont.css";

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
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.appkey && props.username) {
      if (props.sdkConnection === undefined) {
        initIMSDK(props.appkey);
        login()
      }
      createListen();
    }
    dispatch(GlobalPropsActions.saveGlobalProps(props));
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

  return (
    <div className={classes.root}>
      <MessageBar />
      <MessageList messageList={messageList} showByselfAvatar={props.showByselfAvatar}/>
      <SendBox />
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
ChatWrapper.getSdk = () => WebIM;
export default ChatWrapper;

ChatWrapper.propTypes = {
  appkey: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  agoraToken: PropTypes.string.isRequired,
  chatType: PropTypes.string.isRequired,

  // TODO 接收人
  to: PropTypes.string,
  sdkConnection:PropTypes.object,

  showByselfAvatar:PropTypes.bool,  //是否展示自己聊天头像
};
ChatWrapper.defaultProps = {

};
