import React, { useEffect, memo, createContext, useState, useContext } from "react";
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
import contactAvatar from "../../common/images/avatar1.png";
import groupAvatar from "../../common/images/groupAvatar.png";
import i18next from "i18next";

import CallKit from 'zd-callkit'
import MessageActions from "../../redux/message";

import ThreadPanel from "../thread/threadPanel";

export const EaseChatContext = createContext();
import { message } from '../common/alert'
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
  const { agoraUid, appId, getIdMap } = props
  const [confrData, setConfr] = useState({})
  useEffect(() => {
    if (props.appkey && props.username && (props.agoraToken || props.password)) {
      initIMSDK(props.appkey);
      createlistener(props);
      if (WebIM.conn.logOut) {
        login();
      }
    }
  }, []);

  useEffect(() => {
    // let appId = '15cb0d28b87b425ea613fc46f7c9f974';
    console.log('初始化 callkit', agoraUid)
    CallKit.init(appId, agoraUid || '', WebIM.conn)
  }, [agoraUid])


  const login = () => {
    const noLogin = WebIM.conn.logOut;
    if (props.agoraToken) {
      noLogin &&
        WebIM.conn.open({
          user: props.username,
          agoraToken: props.agoraToken,
          pwd: props.password,
          appKey: WebIM.config.appkey,
        });
    } else if (props.password) {
      noLogin &&
        WebIM.conn.open({
          user: props.username,
          pwd: props.password,
          appKey: WebIM.config.appkey,
        });
    }
  };
  const classes = useStyles();

  const messageList =
    useSelector((state) => {
      const to = state.global.globalProps.to;
      const chatType = state.global.globalProps.chatType;
      return _.get(state, ["message", chatType, to], []);
    }) || [];

  const [showInviteModal, setShowInvite] = useState(false)
  const showInvite = (confr) => {
    console.log('点击添加人', confr)
    setConfr(confr)
    setShowInvite(!showInviteModal)
  }

  const closeInviteModal = () => {
    setShowInvite(false)
  }

  const handleCallStateChange = async (info) => {
    console.log('info ----', info)
    switch (info.type) {
      case 'hangup':
      case 'refuse':
        setConfr({})
        let chatType = 'singleChat'
        let targetId = ''
        if (info.callInfo.groupId) {
          targetId = info.callInfo.groupId
          chatType = 'groupChat';
        } else if (info.callInfo.callerIMName == WebIM.conn.context.userId) {
          targetId = info.callInfo.calleeIMName
        } else {
          targetId = info.callInfo.callerIMName
        }
        var id = WebIM.conn.getUniqueId();
        let cusMessage = {
          id: id,
          status: 'sent',
          body: {
            type: 'custom',
            info: info.callInfo
          },
          from: WebIM.conn.context.userId,
          to: targetId,
          chatType: chatType
        }
        store.dispatch(MessageActions.addMessage(cusMessage))

        if (info.type == 'hangup') {
          if (info.reson == 'timeout') {
            message.error('No response.')
          } else if (info.reson == 'refuse') {
            message.error('Request declined.')
          } else if (info.reson == 'cancel') {
            message.error('The call has been canceled.')
          } else if (info.reson == 'accepted on other devices') {
            message.error('Other devices connected.')
          } else if (info.reson == 'refused on other devices') {
            message.error('Other devices declined.')
          } else if (info.reson == 'busy') {
            message.error('The line is busy.')
          } else {
            message.error(info.reson || 'normal hangup')
          }
        }
        break;
      case 'user-published':
        // getIdMap
        if (!info.confr) return;
        let idMap = await getIdMap({ userId: WebIM.conn.context.userId, channel: info.confr.channel })
        console.log('idMap', idMap)
        if (Object.keys(idMap).length > 0) {
          CallKit.setUserIdMap(idMap)
        }
        break;
      default:
        break;
    }
  }

  const handleInvite = async (data) => {
    // props.onRTCInvite && props.onRTCInvite(data)
    console.log('收到邀请', data)
    const { agoraUid, accessToken } = await props.getRTCToken({
      channel: data.channel,
      username: WebIM.conn.context.userId
    })

    CallKit.answerCall(true, accessToken)
  }

  const to = useSelector((state) => state.global.globalProps.to);
  const { showRTCCall } = props
  return to ? (
    <div className={classes.root}>
      <EaseChatContext.Provider value={props}>
        <MessageBar showinvite={showInviteModal} onInviteClose={closeInviteModal} confrData={confrData} />
        <MessageList
          messageList={messageList}
          showByselfAvatar={props.showByselfAvatar}
        />
        <SendBox />
        {!showRTCCall ? <CallKit 
            onAddPerson={showInvite} 
            onStateChange={handleCallStateChange} 
            onInvite={handleInvite} 
            contactAvatar={contactAvatar} 
            groupAvatar={groupAvatar}
            ringingSource={props.ringingSource}></CallKit> : null}
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
      {<>
        <CallKit onAddPerson={showInvite} onStateChange={handleCallStateChange} onInvite={handleInvite} contactAvatar={contactAvatar} groupAvatar={groupAvatar} ringingSource={props.ringingSource}></CallKit>
        <EaseChatContext.Provider value={props}>
          <div style={{ display: 'none' }}>
            <MessageBar showinvite={showInviteModal} onInviteClose={closeInviteModal} confrData={confrData} />
          </div>
        </EaseChatContext.Provider>
      </>
      }
    </div >
  );
};
const Thread = (props) => {
  return (
    <EaseChatContext.Provider value={props}>
      <ThreadPanel />
    </EaseChatContext.Provider>

  )
}
const EaseChatProvider = (props) => {
  const threadPanelStates = useSelector((state) => state.thread?.threadPanelStates);
  return (
    <Provider store={store}>
      <React.StrictMode>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flex: '1 1 auto', height: '100%' }}>
            <Chat {...props} />
          </div>
          <div style={{ flex: '0 0 392px', overflow: 'hidden', display: threadPanelStates ? 'flex' : 'none', height: '100%' }}>
            <hr style={{ width: 0, height: '100%', border: 'none', borderRight: '8px solid #edeff2' }} />
            <Thread {...props} />
          </div>
        </div>
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
  password: PropTypes.string,
  chatType: PropTypes.string,
  to: PropTypes.string,

  showByselfAvatar: PropTypes.bool,
  easeInputMenu: PropTypes.string,
  menuList: PropTypes.array,
  handleMenuItem: PropTypes.func,

  successLoginCallback: PropTypes.func,
  failCallback: PropTypes.func,
  onChatAvatarClick: PropTypes.func,
  isShowReaction: PropTypes.bool,
  customMessageList: PropTypes.array,
  customMessageClick: PropTypes.func,
  onOpenThreadPanel: PropTypes.func,

  agoraUid: PropTypes.string,
  isShowRTC: PropTypes.bool,
  getRTCToken: PropTypes.func,
  getIdMap: PropTypes.func,
  appId: PropTypes.string,
};

EaseChatProvider.defaultProps = {
  showByselfAvatar: false,
  easeInputMenu: 'all',
  isChatThread: false,
  isShowRTC: true,
  menuList: [
    { name: i18next.t('send-image'), value: "img", key: "1" },
    { name: i18next.t('send-file'), value: "file", key: "2" },
    { name: i18next.t('send-video'), value: "video", key: "3" }
  ],
};
