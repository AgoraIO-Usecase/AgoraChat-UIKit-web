import { formatLocalMessage, formatServerMessage } from "../utils";
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
// import store from "../redux/index";
import WebIM from "../utils/WebIM";
import AppDB from "../utils/AppDB";

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  byId: {},
  singleChat: {},
  groupChat: {},
  chatRoom: {},
  stranger: {},
  extra: {},
  unread: {
    singleChat: {},
    groupChat: {},
    chatRoom: {},
    stranger: {},
  },
});
/* -------- Types and Action Creators -------- */
const { Types, Creators } = createActions({
  addMessage: ["message", "messageType"],
  deleteMessage: ["msgId"],
  updateMessageStatus: ["message", "status"],
  sendText: (to, chatType, message = {}) => {
    return (dispatch, getState) => {
      const formatMsg = formatLocalMessage(to, chatType, message, "txt");
      const { body, id } = formatMsg;
      const { msg } = body;
      const msgObj = new WebIM.message("txt", id);
      msgObj.set({
        to,
        msg,
        chatType,
        ext: message.ext,
        success: () => {
          dispatch(Creators.updateMessageStatus(formatMsg, "sent"));
        },
        fail: () => {
          dispatch(Creators.updateMessageStatus(formatMsg, "fail"));
        },
      });
      WebIM.conn.send(msgObj.body);
      dispatch(Creators.addMessage(formatMsg));
    };
  },

  sendFileMessage: (to, chatType, file) => {
    return (dispatch, getState) => {
      const formatMsg = formatLocalMessage(to, chatType, file, "file");
      const { id } = formatMsg;
      const msgObj = new WebIM.message("file", id);
      msgObj.set({
        ext: {
          file_length: file.data.size,
          file_type: file.data.type,
        },
        file: file,
        to,
        chatType,
        onFileUploadError: function (error) {
          formatMsg.status = "fail";
          dispatch(Creators.updateMessageStatus(formatMsg, "fail"));
        },
        onFileUploadComplete: function (data) {
          let url = data.uri + "/" + data.entities[0].uuid;
          formatMsg.url = url;
          formatMsg.status = "sent";
          dispatch(Creators.updateMessageStatus(formatMsg, "sent"));
        },
        fail: function () {
          dispatch(Creators.updateMessageStatus(formatMsg, "fail"));
        },
      });

      WebIM.conn.send(msgObj.body);
      dispatch(Creators.addMessage(formatMsg, "file"));
    };
  },

  sendImgMessage: (to, chatType, file) => {
    return (dispatch, getState) => {
      const formatMsg = formatLocalMessage(to, chatType, file, "img");
      const { id } = formatMsg;
      const msgObj = new WebIM.message("img", id);
      msgObj.set({
        ext: {
          file_length: file.data.size,
          file_type: file.data.type,
        },
        file: file,
        to,
        chatType,
        onFileUploadError: function (error) {
          formatMsg.status = "fail";
          dispatch(Creators.updateMessageStatus(formatMsg, "fail"));
        },
        onFileUploadComplete: function (data) {
          let url = data.uri + "/" + data.entities[0].uuid;
          formatMsg.url = url;
          formatMsg.status = "sent";
          dispatch(Creators.addMessage(formatMsg, "img"));
          dispatch(Creators.updateMessageStatus(formatMsg, "sent"));
        },
        fail: function () {
          dispatch(Creators.updateMessageStatus(formatMsg, "fail"));
        },
      });
      WebIM.conn.send(msgObj.body);
      dispatch(Creators.addMessage(formatMsg, "img"));
    };
  },

  recallMessage: (to, chatType, message) => {
    return (dispatch, getState) => {
      const { id } = message;
      WebIM.conn.recallMessage({
        to: to,
        mid: id, // message id
        type: chatType,
        success: () => {
          dispatch(Creators.deleteMessage(id));
        },
        fail: (err) => {
          message.error("撤回失败");
        },
      });
    };
  },

  clearMessage: (chatType, id) => {
    return (dispatch) => {
      dispatch({ type: "CLEAR_MESSAGE", chatType: chatType, id: id });
      AppDB.clearMessage(chatType, id).then((res) => {});
    };
  },
  fetchMessage: (to, chatType, offset, cb) => {
    return (dispatch) => {
      AppDB.fetchMessage(to, chatType, offset).then((res) => {
        if (res.length) {
          dispatch({
            type: "FETCH_MESSAGE",
            chatType: chatType,
            to: to,
            messages: res,
          });
        }
        cb && cb(res.length);
      });
    };
  },
});

/* ------------- Reducers ------------- */
export const addMessage = (state, { message, messageType = "txt" }) => {
  const rootState = store.getState()
  !message.status && (message = formatServerMessage(message, messageType));
  console.log("格式化的消息", message);
  const username = WebIM.conn.context.userId;
  const { id, to, status } = message;
  let { chatType } = message;
  const from = message.from || username;
  const bySelf = from === username;
  let chatId = bySelf || chatType !== "singleChat" ? to : from;
  const chatData = state.getIn([chatType, chatId], Immutable([])).asMutable();
  const _message = {
    ...message,
    bySelf,
    time: +new Date(),
    status: status,
  };
  if (_message.chatType === "chatRoom" && bySelf) {
    const oid = state.getIn(["byMid", _message.id, "id"]);
    if (oid) {
      _message.id = oid;
    }
  }
  let isPushed = false;
  chatData.forEach((m) => {
    if (m.id === _message.id) {
      isPushed = true;
    }
  });

  !isPushed && chatData.push(_message);

  // add a message to db, if by myselt, isUnread equals 0
  !isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0);

  const maxCacheSize = _.includes(["groupChat", "chatRoom"], chatType)
    ? WebIM.config.groupMessageCacheSize
    : WebIM.config.p2pMessageCacheSize;
  if (chatData.length > maxCacheSize) {
    const deletedChats = chatData.splice(
      maxCacheSize,
      chatData.length - maxCacheSize
    );
    let byId = state.getIn(["byId"]);
    byId = _.omit(byId, _.map(deletedChats, "id"));
    state = state.setIn(["byId"], byId);
  }

  state = state.setIn([chatType, chatId], chatData);

  // unread
  const currentSession = _.get(rootState, ["session", "currentSession"]);
  const addSingleChatUnread =
    !bySelf &&
    !isPushed &&
    message.from !== currentSession &&
    (chatType === "singleChat" || chatType === "strager");
  const addGroupUnread =
    !bySelf &&
    !isPushed &&
    message.to !== currentSession &&
    (chatType === "groupChat" || chatType === "chatRoom");
  if (addSingleChatUnread || addGroupUnread) {
    let count = state.getIn(["unread", chatType, chatId], 0);
    state = state.setIn(["unread", chatType, chatId], ++count);
  }

  state = state.setIn(["byId", id], { chatType, chatId });

  return state;
};

export const updateMessageStatus = (state, { message, status = "" }) => {
  let { id } = message;
  if (!id) id = state.getIn(["byMid", message.mid, "id"]);
  let mids = state.getIn(["byMid"]) || {};
  let mid;
  for (var i in mids) {
    if (mids[i].id === id) {
      mid = i;
    }
  }
  const byId = state.getIn(["byId", id]);
  if (!_.isEmpty(byId)) {
    const { type, chatId } = byId;
    let messages = state.getIn([type, chatId]).asMutable();
    let found = _.find(messages, { id: parseInt(id) });
    let msg = found.setIn(["status"], status);
    msg = found.setIn(["toJid"], mid);
    messages.splice(messages.indexOf(found), 1, msg);
    AppDB.updateMessageStatus(id, status).then((res) => {});
    state = state.setIn([type, chatId], messages);
  }
  return state;
};
export const deleteMessage = (state, { msgId }) => {
  msgId = msgId.mid || msgId;
  const byId = state.getIn(["byId", msgId]);
  if (!byId) {
    return console.error(`not found message: ${msgId}`);
  }
  const { chatType, chatId } = byId;
  let messages = state.getIn([chatType, chatId]).asMutable();
  let targetMsg = _.find(messages, { id: msgId });
  const index = messages.indexOf(targetMsg);
  messages.splice(index, 1, {
    ...targetMsg,
    body: {
      ...targetMsg.body,
      type: "recall",
    },
  });
  state = state.setIn([chatType, chatId], messages);
  AppDB.deleteMessage(msgId);

  return state;
};

export const fetchMessage = (state, { to, chatType, messages, offset }) => {
  let data =
    state[chatType] && state[chatType][to]
      ? state[chatType][to].asMutable()
      : [];
  data = messages.concat(data);
  //-----------------------
  return state.setIn([chatType, to], data);
};

export const clearMessage = (state, { chatType, id }) => {
  return chatType ? state.setIn([chatType, id], []) : state;
};

/* ------------- Hookup Reducers To Types ------------- */
export const messageReducer = createReducer(INITIAL_STATE, {
  [Types.ADD_MESSAGE]: addMessage,
  [Types.DELETE_MESSAGE]: deleteMessage,
  [Types.CLEAR_MESSAGE]: clearMessage,
  [Types.FETCH_MESSAGE]: fetchMessage,
});

export default Creators;
