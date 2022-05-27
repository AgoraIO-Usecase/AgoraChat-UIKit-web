import moment from 'moment'
import WebIM from '../utils/WebIM'
import Cookie from 'js-cookie';
import qs from 'qs'
export function renderTime(time,timeStyle) {
    if (!time) return ''
    const localStr = new Date(time)
    const localMoment = moment(localStr)
    const localFormat = timeStyle? localMoment.format(timeStyle):localMoment.format('MM-DD HH:mm')
    return localFormat
}

// 小于一分钟：1m ago
// 60分钟以内：XXm ago，忽略下一级单位，下同；
// 24小时以内：XXh ago；
// 本周之内：Xd ago；
// 本月之内：Xwk ago;
// 超过本月不满一年：Xmo ago
// 超过一年：Xyr ago
//Get time difference 
export function getTimeDiff(time){
    if(!time) return ''
    const localTime = new Date()
    const MsgTime = new Date(time);
    const spanYear = localTime.getFullYear() - MsgTime.getFullYear()
    const spanMonth = localTime.getMonth() - MsgTime.getMonth()
    const spanDate= localTime.getDate() - MsgTime.getDate()
    const spanDay= localTime.getDay() - MsgTime.getDay()
    let spanWeek = 0;
    if (spanDate >= localTime.getDay()){
        spanWeek = Math.ceil((spanDate+1 - localTime.getDay())/7)
    }
    const spanHour = localTime.getHours() - MsgTime.getHours()
    const spanMinute = localTime.getMinutes() - MsgTime.getMinutes()
    if(spanYear !== 0){
        return `${spanYear}yr ago`
    }else if(spanMonth !== 0){
        return `${spanMonth}mo ago`
    }else if(spanWeek !== 0){
        return `${spanWeek}wk ago`
    }else if(spanDay !== 0){
        return `${spanDay}d ago`
    }else if(spanHour !== 0){
        return `${spanHour}h ago`
    }else if(spanMinute !== 0){
        return `${spanMinute}m ago`
    }else {
        return '1m ago'
    }
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
    },
    threadNotify: {
        type: 'threadNotify'
    }
}

export function formatLocalMessage(to, chatType, message = {}, messageType, isChatThread) {
    const ext = message.ext || {}
    const formatMsg = Object.assign({}, msgTpl.base, message)
    const body = Object.assign({}, msgTpl[messageType], message)
    if (messageType === 'file' || messageType === 'img' || messageType === 'video') {
        if (!message?.ext?.emoji_url) {
            body.size = message?.data.size
        }
    }
    if(messageType === 'threadNotify'){
        formatMsg.id = WebIM.conn.getUniqueId();
    }
    return {
        ...formatMsg,
        // id: WebIM.conn.getUniqueId(),
        to,
        from: WebIM.conn.context.userId,
        chatType,
        session: to,
        isChatThread,
        body: {
            ...body,
            ...ext
        }
    }
}

export function formatServerMessage(message = {}, messageType) {
    const ext = message.ext || {}
    const formatMsg = Object.assign({},msgTpl.base, message)
    const body = Object.assign({}, msgTpl[messageType], message)
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
