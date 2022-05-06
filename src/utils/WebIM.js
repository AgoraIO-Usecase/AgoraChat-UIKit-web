// import websdk from 'easemob-websdk';
// import websdk from 'websdk';
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
    isHttpDNS: false, //WebIM.config.isHttpDNS,
    url: 'https://msync-api-a1-test.easemob.com/ws',
    apiUrl: 'https://a1-test.easemob.com'
  };

  WebIM.conn = new websdk.connection(options);
};
export default WebIM