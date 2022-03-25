import moment from 'moment'
import WebIM from '../utils/WebIM'
import Cookie from 'js-cookie';
import qs from 'qs'
export function renderTime(time) {
    if (!time) return ''
    const localStr = new Date(time)
    const localMoment = moment(localStr)
    const localFormat = localMoment.format('MM-DD hh:mm')
    return localFormat
}

const { username } = qs.parse(window.location.hash.split('?')[1]);

(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
            // if (docEl.clientWidth > 750) {
            //     docEl.style.fontSize = "100px";
            // } else {
            //     var width = docEl.clientWidth / 7.5;
            //     docEl.style.fontSize = width + "px";
            // }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

export function getToken() {
    return Cookie.get('web_im_' + username);
}

export function getUserName() {
    return username
}

const msgTpl = {
    base: {
        error: false,
        errorCode: '',
        errorText: '',
        // if status is blank, it's treated as "sent" from server side
        status: 'sending', // [sending, sent ,fail, read]
        id: '',
        // from - room id need it,should not be deleted
        from: '',
        to: '',
        toJid: '',
        time: '',
        chatType: '', // chat / groupchat
        body: {},
        ext: {},
        bySelf: false
    },
    txt: {
        type: 'txt',
        msg: ''
    },
    img: {
        type: 'img',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    file: {
        type: 'file',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: '',
        size: ''
    },
    video: {
        type: 'video',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    audio: {
        type: 'audio',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    custom: {
        type: 'custom',
        customEvent: '',
        customExts: {}
    }
}

export function formatLocalMessage(to, chatType, message = {}, messageType) {
    const ext = message.ext || {}
    const formatMsg = Object.assign(msgTpl.base, message)
    const body = Object.assign(msgTpl[messageType], message)
    if (messageType === 'file' || messageType === 'img' || messageType === 'video') {
        body.size = message?.data.size
    }
    return {
        ...formatMsg,
        id: WebIM.conn.getUniqueId(),
        to,
        from: WebIM.conn.context.userId,
        chatType,
        session: to,
        body: {
            ...body,
            ...ext
        }
    }
}

export function formatServerMessage(message = {}, messageType) {
    const ext = message.ext || {}
    const formatMsg = Object.assign(msgTpl.base, message)
    const body = Object.assign(msgTpl[messageType], message)
    let chatType = message.chatType
    if (messageType === 'txt') {
        body.msg = message.msg;
        body.type = 'txt'
    } else if (messageType === 'file') {
        body.type = 'file'
        body.size = body.file_length
    } else if (messageType === 'img') {
        body.type = 'img'
    } else if (messageType === 'video') {
        body.type = 'video'
        body.size = body.file_length
    }
    return {
        ...formatMsg,
        status: 'sent',
        chatType,
        session: message.from,
        body: {
            ...body,
            ...ext,
            chatType
        }
    }
}

export function getGroupName(str) {
    const [name, id] = str.split("_#-#_")
    return name
}
export function getGroupId(str) {
    const [name, id] = str.split("_#-#_")
    return id
}

let options = {
    requireInteraction: false, // 是否自动消失 false 自动消失，true，不自动消失
    body: 'Liz: "Hi there!"', // 展示的具体内容
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
export const notify = (params) => {
    options = {...options, ...params}
    checkBrowerNotifyStatus().then(res => {
        // 检查用户是否同意接受通知
        if (Notification?.permission === "granted") {
            var notification = new Notification(options.title || 'New Message', options);
            notification.onclick = (res) => {
                console.log(res, 'notification.onclick')
            }
            notification.addEventListener('click', e => {
                console.log(e, 'notification.addEventListener')
            })

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
    })
}
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
    let icon = '../common/images/Online.png'; // 图片地址
    changeFavicon(icon); // 动态修改网站图标
    let title = '(12)new messaage'; // 网站标题
    document.title = title; // 动态修改网站标题
}

export const checkBrowerNotifyStatus = () => {
    return new Promise((resolve, reject) => {
        // 先检查浏览器是否支持
        if (!('Notification' in window)) {
            alert("This browser does not support desktop notification")
            resolve('denied')
        } else if (Notification.permission !== 'denied') {
            // 否则我们需要向用户获取权限
            Notification.requestPermission().then(function (permission) {
                console.log(permission)
                resolve(permission)
            })
        } else if (Notification.permission === 'denied') {
            alert("Please set browser support notification")
            resolve('denied')
        } else {
            resolve('denied')
        }
    })
}