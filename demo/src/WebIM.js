

import websdk from 'easemob-websdk';
import config from './WebIMConfig';

let WebIM = window.WebIM || {};

WebIM.config = config;
let options = {
    appKey: WebIM.config.appkey,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    isDebug: WebIM.config.isDebug,
    https: WebIM.config.https,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    delivery: WebIM.config.delivery,
    useOwnUploadFun: WebIM.config.useOwnUploadFun,
    deviceId: WebIM.config.deviceId,
    //公有云 isHttpDNS 默认配置为true
    isHttpDNS: WebIM.config.isHttpDNS,
};
WebIM.conn = new websdk.connection(options);


export default WebIM;