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
import ThreadPanel from "../thread/threadPanel";

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
    if (props.appkey && props.username && (props.agoraToken || props.password)) {
      initIMSDK(props.appkey);
      createlistener(props);
      if (WebIM.conn.logOut) {
        login();
      }
    }
  }, []);

  const login = () => {
    const noLogin = WebIM.conn.logOut;
    if(props.agoraToken){
      noLogin &&
      WebIM.conn.open({
        user: props.username,
        agoraToken: props.agoraToken,
        // pwd: props.password,
        appKey: WebIM.config.appkey,
      });
    }else if(props.password){
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
const Thread = (props) =>{
  return (
    <EaseChatContext.Provider value={props}>
      <ThreadPanel/>
    </EaseChatContext.Provider>
    
  )
}
const EaseChatProvider = (props) => {
  const threadPanelStates = useSelector((state) => state.thread?.threadPanelStates);
  return (
    <Provider store={store}>
      <React.StrictMode>
        <div style={{display: 'flex',height: '100%'}}>
          <div style={{flex: '1 1 auto',height: '100%'}}>
             <Chat {...props} />
          </div>
          <div style={{flex: '0 0 392px',overflow:'hidden',display: threadPanelStates?'flex':'none',height: '100%'}}>
            <hr style={{width:0,height:'100%',border:'none',borderRight:'8px solid #edeff2'}}/>
            <Thread {...props}/>
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

  successLoginCallback:PropTypes.func,
  failCallback:PropTypes.func,
  onChatAvatarClick:PropTypes.func,
  isShowReaction: PropTypes.bool,
  customMessageList:PropTypes.array,
  customMessageClick:PropTypes.func,
  onOpenThreadPanel:PropTypes.func,
  thridPartyStickets: PropTypes.node,
  thridPartyGifs: PropTypes.node,
};

EaseChatProvider.defaultProps = {
  showByselfAvatar:false,
  easeInputMenu:'all',
  isChatThread: false,
  menuList: [
    { name: i18next.t('send-image'), value: "img", key: "1" },
    { name: i18next.t('send-file'), value: "file", key: "2" },
    { name: i18next.t('send-video'), value: "video", key: "3"}
  ],
};
