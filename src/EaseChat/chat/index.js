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
import '../../i18n'
import "../../assets/iconfont.css";

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
    if (!props.sdkConnection) {
      initIMSDK(props.appkey);
    }
    createListen();
    dispatch(GlobalPropsActions.saveGlobalProps(props));
    props.agoraToken && props.username && login();
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
    useSelector((state) =>
      _.get(state, ["message", "singleChat", "tom"], [])
    ) || [];
  return (
    <div className={classes.root}>
      <MessageBar />
      <MessageList messageList={messageList} />
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
  username:PropTypes.string.isRequired,
  agoraToken:PropTypes.string.isRequired,
  chatType:PropTypes.string.isRequired,
  // TODO 接收人
  to:PropTypes.string.isRequired,
};
ChatWrapper.defaultProps = {
  appkey:'41351358#427351',
  username:'jack',
  agoraToken:"007eJxTYKgpYly0fILfMkkDI8u0H6mhmaUBCYEmE9P6pb/mefk9mafAYGFukWJqYJpiZmRkYWJkaZKYmJKWmphimWhhaZFqmJI2d1dzYkMgI4OMH28sIwMrAyMQgvgqDCmJqYaGqakGusZGqcm6QGayblKigZGucZpJspmJmXmSsbkRAJxrJZs=",
  chatType:'singleChat',
  to:'tom'
};