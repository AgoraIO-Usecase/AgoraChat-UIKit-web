import React, { useEffect, useCallback, memo, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles, styled } from "@material-ui/styles";
// import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  Provider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook,
} from "react-redux";
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

const uikit_store = React.createContext(null);
export const useDispatch = createDispatchHook(uikit_store);
export const useSelector = createSelectorHook(uikit_store);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  grid: {
    backgroundColor: "rgba(206, 211, 217, 0.3)",
  },
}));
const Item = styled(Grid)(({ theme }) => ({}));

const EaseApp = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleClickItem = useCallback(
    (session) => {
      console.log("handleClickItem", session);
      const { sessionType, sessionId } = session;
      if (!session.lastMessage) {
        dispatch(MessageActions.fetchMessage(sessionId, sessionType));
      }
      dispatch(
        GlobalPropsActions.setGlobalProps({
          to: sessionId,
          chatType: sessionType,
        })
      );
      dispatch(SessionActions.setCurrentSession(sessionId));
      dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId));
    },
    [props.width]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "100%",
          height: "calc(100% - 100px)",
        }}
      >
        <Grid
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          item
          xs={6}
          md={3}
          className={classes.grid}
        >
          <div style={{height:'100%',overflowY:'scroll',display:'flex',flexDirection:'column'}}>
            <div>{props.header}</div>
            <SessionList onClickItem={handleClickItem} />
          </div>
        </Grid>
        <Grid item xs={6} md={9}>
          <EaseChat {...props} />
        </Grid>
      </div>
    </Box>
  );
};

const EaseAppWrapper = (props) => {
  return (
    <Provider context={uikit_store} store={store}>
      <React.StrictMode>
        <EaseApp {...props} />
      </React.StrictMode>
    </Provider>
  );
};
export default EaseAppWrapper;

EaseAppWrapper.onClickSession = (session) => {
  if (session && Object.keys(session).length > 0) {
    const { sessionType, sessionId } = session;
    const { dispatch } = store;
    if (!session.lastMessage) {
      dispatch(MessageActions.fetchMessage(sessionId, sessionType));
    }
    dispatch(SessionActions._pushSession(session));
    dispatch(SessionActions.setCurrentSession(sessionId));
    dispatch(SessionActions.topSession(sessionId, sessionType));
    dispatch(
      GlobalPropsActions.setGlobalProps({
        to: sessionId,
        chatType: sessionType,
      })
    );
    dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId));
  }
};
EaseAppWrapper.getSdk = (props) => {
  initIMSDK(props.appkey);
  createListen();
  return WebIM;
};
EaseAppWrapper.propTypes = {
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  sdkConnection: PropTypes.object,
  header: PropTypes.node,
  onClickSession: PropTypes.func,
};
EaseAppWrapper.defaultProps = {
  appkey: "61308276#489779",
  username: "qwk123",
  agoraToken:
    "007eJxTYGjxXqL817dBvIXL4tm61Af+FQbH3j6/lTNfOOhJ2mKZXf4KDEYWaQZmponGqUmJZiZGBhZJ5imJhomGhiYpFkaWZhZJGwwnJzYEMjKouJ1cysjAysAIhGA+g2WKkWlampmBromZpYmuoWFqsm6ShVmiLtDApEQDY/PUxLQ0AJGLKCI=",
};
