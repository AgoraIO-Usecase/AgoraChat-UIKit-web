import React, { useCallback, createContext, useEffect } from "react";
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

  useEffect(() => {
    // document.addEventListener('click', e => {
    //     console.log(e, 'notification.addEventListener')
    // })
    // alert('2423234234')
    const options = {
        requireInteraction: true, // 是否自动消失
        body: 'qwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuioqwertyuio', // 展示的具体内容
        tag: '1eee4', // 唯一值供记录用
        // body: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ20QJS6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=c26344538c227e42c92ac1b26d4f9c65',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ20QJS6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=c26344538c227e42c92ac1b26d4f9c65',
        // icon: '/logo192.png',
        image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ20QJS6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=c26344538c227e42c92ac1b26d4f9c65',
        data: '你猜猜', // 附带的数据，可以在展示时获取，然后用做具体的情况使用
        lang: 'en-US', // 语言
        dir: 'rtl', // 文字方向
        renotify: true, // 允许覆盖
        silent: false, // 静音属性为true时不能和vibrate一起使用
        badge: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=2c1f9cf6b828120b81f18776a6c42c3d',
        vibrate: [200, 100, 200], // 设备震动频率
        // actions: [
        //     {
        //         action: '',
        //         title: '',
        //         icon: ''
        //     }
        // ]
    }
    console.log(Notification.permission)
    // 先检查浏览器是否支持
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // 检查用户是否同意接受通知
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("Hi there!", options);
        notification.onclick = (res) => {
            // alert('2423234234')
            document.write('sssssss')
            console.log(res, 'notification.onclick')
        }
        notification.addEventListener('click', e => {
            document.write('222222222')
            console.log(e, 'notification.addEventListener')
        })
        console.log(notification, 'notification')
        notification.addEventListener('display', e => {
            console.log(e, 'notification.ondisplay')
        })
        notification.addEventListener('close', e => {
            console.log(e)
        })
        notification.addEventListener('show', e => {
            console.log(e)
        })
        notification.addEventListener('error', e => {
            console.log(e)
        })
        notification.ondisplay = (res) => {
            console.log(res, 'notification.ondisplay')
        }
        changeIcon()
    }

    // 否则我们需要向用户获取权限
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // 如果用户接受权限，我们就可以发起一条消息
            if (permission === "granted") {
                var notification = new Notification("Hi there!", options);
                notification.onclick = (res) => {
                    console.log(res)
                }
            }
        });
    }
  }, [])
  const changeIcon = () => {
    const changeFavicon = link => {
        let $favicon = document.querySelector('link[rel="icon"]');
        console.log($favicon)
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
        if ($favicon !== null) {
            $favicon.href = link;
            // Otherwise, create a new element and append it to <head>.
        } else {
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = link;
            document.head.appendChild($favicon);
        }
    };
    let icon = '../common/icons/failed@3x.png'; // 图片地址
    changeFavicon(icon); // 动态修改网站图标
    let title = '(12)new messaage'; // 网站标题
    document.title = title; // 动态修改网站标题
  }
  var notify = function () {
    // Check for notification compatibility.
    if (!'Notification' in window) {
        // If the browser version is unsupported, remain silent.
        return;
    }
    // Log current permission level
    console.log(Notification.permission);
    // If the user has not been asked to grant or deny notifications
    // from this domain...
    if (Notification.permission === 'default') {
        Notification.requestPermission(function () {
            // ...callback this function once a permission level has been set.
            notify();
        });
    }
    // If the user has granted permission for this domain to send notifications...
    else if (Notification.permission === 'granted') {
        var n = new Notification(
                    'New message from Liz',
                    {
                      'body': 'Liz: "Hi there!"',
                      // ...prevent duplicate notifications
                      'tag' : 'unique string'
                    }
                );
        // Remove the notification from Notification Center when clicked.
        n.onclick = function () {
            console.log('2222')
            // this.close();
        };
        // Callback function when the notification is closed.
        n.onclose = function () {
            console.log('Notification closed');
        };
    }
    // If the user does not want notifications to come from this domain...
    else if (Notification.permission === 'denied') {
        // ...remain silent.
        return;
    }
  };

  notify()


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
