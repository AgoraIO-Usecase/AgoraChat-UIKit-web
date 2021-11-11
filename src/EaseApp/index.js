import React, { useEffect, useCallback, memo , useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import WebIM, { initIMSDK } from "../utils/WebIM";
import store from "../redux/index";
import GlobalPropsActions from "../redux/globalProps";
import createListen from "../utils/WebIMListen";
import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import _ from "lodash";
import "../i18n";
import "../common/iconfont.css";

import SessionList from "../EaseChat/session/sessionList";
import EaseChat from "../EaseChat/chat/index";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
}));

const EaseApp = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const classes = useStyles();

  const handleClickItem = useCallback(
    (session) => {
      console.log("handleClickItem", session);
      const { sessionType, sessionId } = session;
      if (!session.lastMessage) {
        dispatch(MessageActions.fetchMessage(sessionId, sessionType));
      }
      dispatch(GlobalPropsActions.setGlobalProps({to: sessionId,chatType: sessionType,}));
      dispatch(SessionActions.setCurrentSession(sessionId));
      dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId));
    },
    [props.width]
  );

  return (
    <div className={classes.root}>
      <div style={{ width: "400px" }}>
        <div>{props.header}</div>
        <SessionList onClickItem={handleClickItem} />
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <EaseChat {...props}/>
      </div>
    </div>
  );
};

const EaseAppWrapper = (props) => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <EaseApp {...props}/>
      </React.StrictMode>
    </Provider>
  );
};
export default EaseAppWrapper;

EaseAppWrapper.getSessionList = () => {};
EaseAppWrapper.onClickSession = (session) => {
  if (session && Object.keys(session).length > 0) {
    const { sessionType, sessionId } = session;
    const {dispatch} = store
    if (!session.lastMessage) {
      dispatch(MessageActions.fetchMessage(sessionId, sessionType));
    }
    dispatch(SessionActions._pushSession(session))
    dispatch(SessionActions.setCurrentSession(sessionId));
    dispatch(SessionActions.topSession(sessionId, sessionType))
    dispatch(GlobalPropsActions.setGlobalProps({to: sessionId,chatType: sessionType,}));
    dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId));
  }
};

EaseAppWrapper.propTypes = {
  appkey: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  agoraToken: PropTypes.string.isRequired,
  chatType: PropTypes.string.isRequired,
  header: PropTypes.node,
  // TODO 接收人
  to: PropTypes.string,
  onClickSession: PropTypes.func,
};
EaseAppWrapper.defaultProps = {

};
