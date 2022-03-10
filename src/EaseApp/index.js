import React, { useCallback, createContext } from "react";
import PropTypes from "prop-types";
import { makeStyles, styled } from "@material-ui/styles";
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
import createlistener from "../utils/WebIMListen";
import MessageActions from "../redux/message";
import SessionActions from "../redux/session";
import _ from "lodash";
import "../i18n";
import "../common/iconfont.css";

import SessionList from "../EaseChat/session/sessionList";
import EaseChat from "../EaseChat/chat/index";
const uikit_store = React.createContext();
export const useDispatch = createDispatchHook(uikit_store);
export const useSelector = createSelectorHook(uikit_store);
export const EaseAppContext = createContext();
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
  const dispatch = useDispatch(null);
  const classes = useStyles();
  const handleClickItem = useCallback(
    (session) => {
      props.onConversationClick && props.onConversationClick(session);
      const { sessionType, sessionId } = session;
      if (!session.lastMessage) {
        dispatch(MessageActions.fetchMessage(sessionId, sessionType));
      }
      WebIM.conn.getPresenceStatus({usernames: [sessionId]}).then(res => {
        dispatch(
          GlobalPropsActions.setGlobalProps({
            to: sessionId,
            chatType: sessionType,
            presenceExt: res.result[0].ext
          })
        );
      });
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
          height: "calc(100%)",
        }}
      >
        <Grid
          item
          xs={6}
          md={3}
          className={classes.grid}
        >
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{props.header}</div>
            <EaseAppContext.Provider value={props}>
              <SessionList onClickItem={handleClickItem} />
            </EaseAppContext.Provider>
          </div>
        </Grid>
        <Grid item xs={6} md={9}>
          <EaseChat {...props} />
        </Grid>
      </div>
    </Box>
  );
};

const EaseAppProvider = (props) => {
  return (
    <Provider context={uikit_store} store={store}>
      <React.StrictMode>
        <EaseApp {...props} />
      </React.StrictMode>
    </Provider>
  );
};
export default EaseAppProvider;

EaseAppProvider.addConversationItem = (session) => {
  if (session && Object.keys(session).length > 0) {
    const { conversationType, conversationId, ext } = session;
    console.log(session, 'session')
    const { dispatch } = store;
    const storeSessionList = store.getState().session;
    const { sessionList } = storeSessionList;
    const isNewSession = _.findIndex(sessionList, (v) => {
      return v.sessionId === session.conversationId;
    });
    if (isNewSession === -1) {
      dispatch(
        SessionActions._pushSession({
          sessionType: session.conversationType,
          sessionId: session.conversationId,
        })
      );
    }
    dispatch(SessionActions.setCurrentSession(conversationId));
    dispatch(SessionActions.topSession(conversationId, conversationType));
    dispatch(
      GlobalPropsActions.setGlobalProps({
        to: conversationId,
        chatType: conversationType,
        presenceExt: ext
      })
    );
    dispatch(MessageActions.clearUnreadAsync(conversationType, conversationId));
  }
};
EaseAppProvider.changePresenceStatus = (ext) => {
  console.log(ext, 'changePresenceStatus')
  dispatch(
    GlobalPropsActions.setGlobalProps({
      presenceExt: ext
    })
  )
};
EaseAppProvider.getSdk = (props) => {
  if (!WebIM.conn) {
    initIMSDK(props.appkey);
    createlistener(props);
  }
  return WebIM
};
EaseAppProvider.propTypes = {
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  password: PropTypes.string,
  appkey: PropTypes.string,

  header: PropTypes.node,
  addConversationItem: PropTypes.func,
  isShowUnread: PropTypes.bool,
  unreadType: PropTypes.bool,
  onConversationClick: PropTypes.func,
  showByselfAvatar: PropTypes.bool,
  easeInputMenu: PropTypes.string,
  menuList: PropTypes.array,
  handleMenuItem: PropTypes.func,
  onChatAvatarClick:PropTypes.func,
};
EaseAppProvider.defaultProps = {
  isShowUnread: true,
  unreadType: true,
};
