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
import ThreadActions from "../redux/thread"
import _ from "lodash";
import "../i18n";
import "../common/iconfont.css";

import SessionList from "../EaseChat/session/sessionList";
import EaseChat from "../EaseChat/chat/index";
import { addLocalMessage } from '../utils/WebIMListen'

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
    backgroundColor: "rgb(237, 239, 242)",
    width: '360px'
  },
}));
const Item = styled(Grid)(({ theme }) => ({}));

const EaseApp = (props) => {
  const dispatch = useDispatch(null);
  const classes = useStyles();
  const handleClickItem = useCallback(
    (session) => {
      props.onConversationClick && props.onConversationClick(session);
      const { sessionType, sessionId, name } = session;
      if (!session.lastMessage) {
        dispatch(MessageActions.fetchMessage(sessionId, sessionType));
      }
      WebIM.conn.getPresenceStatus({ usernames: [sessionId] }).then(res => {
        let extFlag = false
        let device = ''
        const data = res.result[0].status
        const dataExt = res.result[0]
        for (const item in data) {
          if (Number(data[item]) === 1) {
            extFlag = true
            device = item.includes('webim') ? 'Web' : 'Mobile'
          }
        }
        if (!extFlag) {
          dataExt.ext = 'Offline'
        }
        if (!device) {
          device = Object.keys(data).length ? (Object.keys(data)[0].includes('webim') ? 'Web' : 'Mobile') : ''
        }
        dispatch(
          GlobalPropsActions.setGlobalProps({
            to: sessionId,
            chatType: sessionType,
            name: name,
            presenceExt: {
              [sessionId]: {
                ext: dataExt.ext,
                device
              }
            }
          })
        );
      }).catch(e => {
        console.log(e);
        dispatch(
          GlobalPropsActions.setGlobalProps({
            to: sessionId,
            chatType: sessionType,
            name: name,
          })
        );
      });
      dispatch(SessionActions.setCurrentSession(sessionId));
      dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId));
      dispatch(ThreadActions.updateThreadStates(false));
      dispatch(ThreadActions.getCurrentGroupRole({ sessionType, sessionId }));
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
          className={classes.grid}
        >
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              width: '360px'
            }}
          >
            <div>{props.header}</div>
            <EaseAppContext.Provider value={props}>
              <SessionList onClickItem={handleClickItem} />
            </EaseAppContext.Provider>
          </div>
        </Grid>
        <Grid
          style={{ width: '100%', minWidth: '788px' }}
        >
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
    const { conversationType, conversationId, conversationName, ext, firstCrate, groupText, createGroup } = session;
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
          sessionName: session.conversationName
        })
      );
      addLocalMessage({
        to: conversationId,
        from: WebIM.conn.context.userId,
        chatType: conversationType,
        groupName: conversationName,
        createGroup: createGroup || true,
        groupText: groupText || `You have created a group`,
        firstCrate: firstCrate,
        msgType: (conversationType === 'groupChat') ? 'notify' : '',
      })
    }
    dispatch(SessionActions.setCurrentSession(conversationId));
    dispatch(SessionActions.topSession(conversationId, conversationType));
    dispatch(
      GlobalPropsActions.setGlobalProps({
        to: conversationId,
        chatType: conversationType,
        name: conversationName,
        presenceExt: { [conversationId]: ext }
      })
    );
    dispatch(MessageActions.clearUnreadAsync(conversationType, conversationId));
    dispatch(ThreadActions.updateThreadStates(false));
    dispatch(ThreadActions.getCurrentGroupRole({ sessionType: conversationType, sessionId: conversationId }));
  }
};
EaseAppProvider.changePresenceStatus = (ext) => {
  const { dispatch, getState } = store;
  dispatch(
    GlobalPropsActions.setGlobalProps({
      ...getState().global.globalProps,
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
EaseAppProvider.thread = {
  //????????????thread?????? ????????????
  /**
   * 
   * @param {boolean} status: thread??????????????????
   */
  setShowThread: function (status) {
    store.dispatch(ThreadActions.setShowThread(status))
  },
  //?????????thread???????????????????????????
  /**
   * 
   * @param {boolean} status 
   */
  setHasThreadEditPanel: function (status) {
    store.dispatch(ThreadActions.setHasThreadEditPanel(status))
  },
  //??????thread??????
  /**
   * @param {boolean} status 
   */
  closeThreadPanel: function () {
    store.dispatch(ThreadActions.updateThreadStates(false))
  }
}

EaseAppProvider.deleteSessionAndMessage = (session) => {
  const { dispatch } = store;
  dispatch(MessageActions.clearMessage(session.sessionType, session.sessionId));
  dispatch(SessionActions.deleteSession(session.sessionId));
  dispatch(GlobalPropsActions.setGlobalProps({ to: null }))
}
EaseAppProvider.propTypes = {
  username: PropTypes.string,
  agoraToken: PropTypes.string,
  password: PropTypes.string,
  appkey: PropTypes.string,

  // custom header component
  header: PropTypes.node,
  // addConversationItem: PropTypes.func,

  // show unread message count in conversation list
  isShowUnread: PropTypes.bool,
  // true: unread count; false: red dot
  unreadType: PropTypes.bool,
  // callback of click conversation item
  onConversationClick: PropTypes.func,
  // Whether to show my own avatar in message item
  showByselfAvatar: PropTypes.bool,
  // sendBox support all??? noAudio??? noEmoji??? noAudioAndEmoji??? onlyText
  easeInputMenu: PropTypes.string,
  // sendBox more menu options: image file video
  menuList: PropTypes.array,
  // callback of click sendBox more menu item
  handleMenuItem: PropTypes.func,
  // callback of click chat component message bar avatar
  onChatAvatarClick: PropTypes.func,
  // Whether to show reaction
  isShowReaction: PropTypes.bool,
  // message operation menu options
  customMessageList: PropTypes.array,
  // callback of click message operation menu options item
  customMessageClick: PropTypes.func,

  //thread-click edit panel,get thread info
  onEditThreadPanel: PropTypes.func,
  onOpenThreadPanel: PropTypes.func,

  agoraUid: PropTypes.string,
  getRTCToken: PropTypes.func,
  isShowRTC: PropTypes.bool,
  getIdMap: PropTypes.func,
  appId: PropTypes.string,

  deleteSessionAndMessage: PropTypes.func
};
EaseAppProvider.defaultProps = {
  isShowUnread: true,
  unreadType: true,
};
