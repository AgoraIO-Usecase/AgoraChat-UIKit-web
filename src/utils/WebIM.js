// import websdk from 'easemob-websdk';
import websdk from './Easemob-chat';
import config from './WebIMConfig';
let WebIM = window.WebIM || {};
WebIM.config = config;
export const initIMSDK = (appkey) => {
  WebIM.config = config;
  WebIM.config.appkey = appkey;

  let options = {
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    isDebug: WebIM.config.isDebug,
    https: WebIM.config.https,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    delivery: WebIM.config.delivery,
    appKey: appkey,
    useOwnUploadFun: WebIM.config.useOwnUploadFun,
    deviceId: WebIM.config.deviceId,
    //公有云 isHttpDNS 默认配置为true
    // isHttpDNS: WebIM.config.isHttpDNS,
    isHttpDNS: false,
    url: (window.location.protocol === "https:" ? "https:" : "http:") + "//im-api-v2-hsb.easemob.com/ws",
    apiUrl: (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com",
    // url: 'http://im-api-test-hsb.easemob.com:8280/ws',
    // apiUrl: 'http://a1-hsb.easemob.com'
  };

  WebIM.conn = new websdk.connection(options);
};
export default WebIM