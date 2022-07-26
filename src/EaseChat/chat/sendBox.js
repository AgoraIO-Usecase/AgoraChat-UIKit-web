import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  IconButton,
  MenuItem,
  TextareaAutosize,
  Menu,
} from "@material-ui/core";
import EmojiCom from "./toolbars/emoji";
import { useDispatch, useSelector } from "react-redux";
import MessageActions from "../../redux/message";
import PropTypes from "prop-types";
import i18next from "i18next";
import WebIM from "../../utils/WebIM";
import { EaseChatContext } from "./index";

import Recorder from "./messages/recorder";
import icon_emoji from "../../common/icons/emoji@2x.png";
import icon_yuyin from "../../common/icons/voice@2x.png";
import attachment from "../../common/icons/attachment@2x.png";
import { message } from '../common/alert'
import { getLocalStorageData } from '../../utils/index'
import { emoji } from "../../common/emoji";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: "#fff",
    borderRadius: "2px",
    position: "absolute",
    bottom: '-25px',
    padding: "10px 0",
  },
  emitter: {
    display: "flex",
    alignItems: "flex-end",
    padding: "0 16px",
  },
  input: {
    outline: "none",
    flex: 1,
    lineHeight: "17px",
    fontSize: "14px",
    border: "none",
    color: "#010101",
    resize: "none",
    backgroundColor: "#efefef",
    borderRadius: "18px",
    padding: "5px",
    fontFamily: 'Roboto',
    width: '96%',
  },
  senderBar: {
    height: "12px",
    width: "12px",
    cursor: "pointer",
  },
  hide: {
    display: "none",
  },
  iconStyle: {
    width: "30px",
    height: "30px",
  },
  menuItemIconBox: {
    marginRight: "5px",
    display: "flex",
  },
  textareaBox: {
    backgroundColor: "#efefef",
    width: '100%',
    borderRadius: "18px",
    minHeight: '36px',
    padding: '10px 0 0 8px',
    outline: '0 none',
    textAlign: 'left',
    maxHeight: '70px',
    overflow: 'auto',
    position: 'relative',
    '&::before': {
      content: '"Say Something"',
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: '#999'
    }
  },
  iconbtnStyle: {
    padding: '2px',
    margin: '6px 0',
  },
  emojiInsert: {
    marginLeft: '5px',
    verticalAlign: 'middle',
  },
  textareaSubBox: {
    backgroundColor: "#efefef",
    width: '100%',
    borderRadius: "18px",
    minHeight: '36px',
    padding: '10px 0 0 8px',
    outline: '0 none',
    textAlign: 'left',
    maxHeight: '70px',
    overflow: 'auto',
  }
}));

function SendBox(props) {
  let easeChatProps = useContext(EaseChatContext);
  const { easeInputMenu, menuList, handleMenuItem, onOpenThreadPanel } = easeChatProps;
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalProps = useSelector((state) => state.global.globalProps);
  let { chatType, to } = globalProps;
  const emojiRef = useRef(null);
  const fileEl = useRef(null);
  const videoEl = useRef(null)
  const [emojiVisible, setEmojiVisible] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const inputValueRef = useRef(null);
  const imageEl = useRef(null);
  const [sessionEl, setSessionEl] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [typingTime, setTypingTime] = useState(true);
  const [inputHaveValue, setInputHaveValue] = useState(true);
  inputValueRef.current = inputValue;
  const handleClickEmoji = (e) => {
    setEmojiVisible(e.currentTarget);
  };
  const handleEmojiClose = () => {
    setEmojiVisible(null);
  };
  const insertCustomHtml = (t, e) => {
    var i = inputRef.current
    i.innerText.length;
    if ("getSelection" in window) {
      var s = window.getSelection();
      if (s && 1 === s.rangeCount) {
        i.focus();
        var n = s.getRangeAt(0),
          a = new Image;
        a.src = t,
          a.setAttribute("data-key", e),
          a.setAttribute("width", 20),
          a.setAttribute("height", 20),
          a.draggable = !1,
          a.className = classes.emojiInsert,
          a.setAttribute("title", e.replace("[", "").replace("]", "")),
          n.deleteContents(),
          n.insertNode(a),
          n.collapse(!1),
          s.removeAllRanges(),
          s.addRange(n)
      }
    } else if ("selection" in document) {
      i.focus(), (n = document.selection.createRange()).pasteHTML('<img class="emoj-insert" draggable="false" data-key="' + e + '" title="' + e.replace("[", "").replace("]", "") + '" src="' + t + '">'), i.focus()
    }
    const str = converToMessage(i.innerHTML).trim()
    setInputValue(str)
  }
  const handleEmojiSelected = (res) => {
    if (!res) return;
    setEmojiVisible(null);
    setInputValue((value) => value + res);
    const src = require(`../../common/reactions/${emoji.map[res]}`).default
    insertCustomHtml(src, res)
    setInputHaveValue(false)
    setTimeout(() => {
      let el = inputRef.current;
      el.focus();
      el.selectionStart = inputValueRef.current.length;
      el.selectionEnd = inputValueRef.current.length;
    }, 0);
  };
  const openTyping = () => {
    dispatch(MessageActions.sendCmdMessage(to, chatType, 'TypingBegin', props.isChatThread))
  }
  function converToMessage(e) {
    var t = function () {
      var t = [],
        r = document.createElement("div");
      r.innerHTML = e.replace(/\\/g, "###h###");
      for (var n = r.querySelectorAll("img"), a = r.querySelectorAll("div"), i = n.length, o = a.length; i--;) {
        var s = document.createTextNode(n[i].getAttribute("data-key"));
        n[i].parentNode.insertBefore(s, n[i])
        n[i].parentNode.removeChild(n[i])
      }
      for (; o--;) t.push(a[o].innerHTML), a[o].parentNode.removeChild(a[o]);
      var c = (t = t.reverse()).length ? "\n" + t.join("\n") : t.join("\n");
      return (r.innerText + c).replace(/###h###/g, "&#92;").replace(/<br>/g, "\n").replace(/&amp;/g, "&")
    }();
    new RegExp("(^[\\s\\n\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\n\\s\\t]+$)", "g");
    return t.replace(/&nbsp;/g, " ").trim()
  }
  const handleInputChange = (e) => {
    const html = e.target.innerHTML
    if (html.length) {
      setInputHaveValue(false)
    } else {
      setInputHaveValue(true)
    }
    const str = converToMessage(html).trim()
    setInputValue(str)
    if (getLocalStorageData().typingSwitch && typingTime) {
      setTypingTime(false)
      openTyping()
      setTimeout(() => {
        setTypingTime(true)
      }, 10000)
    }
  };

  const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);
  const currentThreadInfo = useSelector((state) => state.thread?.currentThreadInfo);
  const threadOriginalMsg = useSelector((state) => state.thread?.threadOriginalMsg);
  const threadPanelStates = useSelector((state) => state.thread?.threadPanelStates);
  useEffect(() => {
    if (threadPanelStates) {
      setInputValue('')
    }
  }, [isCreatingThread, currentThreadInfo?.id, threadOriginalMsg?.id, threadPanelStates])
  const createChatThread = () => {
    return new Promise((resolve, reject) => {
      if (isCreatingThread && props.isChatThread) {
        if (!props.threadName) {
          message.warn(i18next.t('ThreadName can not empty'));
          imageEl.current.value = null;
          fileEl.current.value = null;
          videoEl.current.value = null;
          return;
        }
        const options = {
          name: props.threadName.replace(/(^\s*)|(\s*$)/g, ""),
          messageId: threadOriginalMsg.id,
          parentId: threadOriginalMsg.to,
        }
        WebIM.conn.createChatThread(options).then(res => {
          const threadId = res.data?.chatThreadId;
          onOpenThreadPanel && onOpenThreadPanel({ id: threadId })
          resolve(threadId)
        })
      } else if (props.isChatThread) {
        resolve(currentThreadInfo.id)
      } else {
        resolve(to)
      }
    })
  }
  const sendMessage = useCallback(() => {
    if (!inputValue) return;
    createChatThread().then(to => {
      dispatch(
        MessageActions.sendTxtMessage(to, chatType, {
          msg: inputValue,
        }, props.isChatThread)
      );
      inputRef.current.innerHTML = ''
      setInputHaveValue(true)
      setInputValue("");
      inputRef.current.focus();
    })
  }, [inputValue, to, chatType, dispatch, currentThreadInfo, props]);

  const onKeyDownEvent = useCallback(
    (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        inputRef.current.value += "\n";
      } else if (e.keyCode === 13) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    inputRef.current.addEventListener("keydown", onKeyDownEvent);
    return function cleanup() {
      let _inputRef = inputRef;
      _inputRef &&
        _inputRef?.current?.removeEventListener("keydown", onKeyDownEvent);
    };
  }, [onKeyDownEvent]);

  const handlefocus = (v) => {
    const { value } = v
    switch (value) {
      case 'img':
        imageEl.current.focus();
        imageEl.current.click();
        break;
      case 'file':
        fileEl.current.focus();
        fileEl.current.click();
        break;
      case 'video':
        videoEl.current.focus();
        videoEl.current.click();
      default:
        break;
    }
  }
  const handleFileChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to => {
      dispatch(MessageActions.sendFileMessage(to, chatType, file, fileEl, props.isChatThread));
    })
  }
  const handleVideoChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to => {
      dispatch(MessageActions.sendVideoMessage(to, chatType, file, videoEl, props.isChatThread));
    })
  }
  const handleImageChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to => {
      dispatch(MessageActions.sendImgMessage(to, chatType, file, imageEl, props.isChatThread));
    })

  };
  const handleClickMenu = (e) => {
    setSessionEl(e.currentTarget);
  };

  const onClickMenuItem = (v) => (e) => {
    handleMenuItem && handleMenuItem(v, e)
    handlefocus(v)
    setSessionEl(null);
  };

  /*------------ ui-menu ----------*/
  const renderMenu = () => {
    return (
      <Menu
        id="simple-menu"
        anchorEl={sessionEl}
        keepMounted
        open={Boolean(sessionEl)}
        onClose={() => setSessionEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {menuList && menuList.map((option, index) => {
          return (
            <MenuItem onClick={onClickMenuItem(option)} key={index}>
              <Box className={classes.menuItemIconBox}></Box>
              <Typography variant="inherit" noWrap>
                {i18next.t(option.name)}
              </Typography>
              {option.value === "img" && (
                <input
                  type="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  ref={imageEl}
                  onChange={handleImageChange}
                  className={classes.hide}
                />
              )}
              {option.value === "file" && (
                <input
                  ref={fileEl}
                  onChange={handleFileChange}
                  type="file"
                  className={classes.hide}
                />
              )}
              {option.value === "video" && (
                <input
                  ref={videoEl}
                  onChange={handleVideoChange}
                  type="file"
                  className={classes.hide}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    );
  };

  const renderRecorder = () => {
    return (
      <>
        {window.location.protocol === "https:" && (
          <IconButton
            className={classes.iconbtnStyle}
            onClick={() => {
              setShowRecorder(true);
            }}
          >
            <img alt="" className={classes.iconStyle} src={icon_yuyin} />
          </IconButton>
        )}
        <Recorder
          open={showRecorder}
          onClose={() => {
            setShowRecorder(false);
          }}
          isChatThread={props.isChatThread}
          threadName={props.threadName}
        />
      </>
    );
  };

  const renderTextarea = () => {
    return (
      // <div className={classes.textareaBox}>
      //   <TextareaAutosize
      //     placeholder="Say Something"
      //     className={classes.input}
      //     minRows={1}
      //     maxRows={3}
      //     value={inputValue}
      //     onChange={handleInputChange}
      //     ref={inputRef}
      //   ></TextareaAutosize>
      // </div>
      <div contentEditable="true" className={`${inputHaveValue ? classes.textareaBox : classes.textareaSubBox}`} ref={inputRef} onInput={handleInputChange}></div>
    );
  };

  const renderEmoji = () => {
    return (
      <>
        <IconButton ref={emojiRef} className={classes.iconbtnStyle} onClick={handleClickEmoji}>
          <img alt="" className={classes.iconStyle} src={icon_emoji} />
        </IconButton>
        <EmojiCom
          anchorEl={emojiVisible}
          onSelected={handleEmojiSelected}
          onClose={handleEmojiClose}
        ></EmojiCom>
      </>
    );
  };

  const renderMoreFeatures = () => {
    return (
      <>
        <IconButton className={classes.iconbtnStyle} onClick={handleClickMenu}>
          <img alt="" className={classes.iconStyle} src={attachment} />
        </IconButton>
        {renderMenu()}
      </>
    );
  };

  const renderConditionModule = () => {
    switch (easeInputMenu) {
      case "all":
        return (
          <>
            {renderRecorder()}
            {renderTextarea()}
            {renderEmoji()}
            {renderMoreFeatures()}
          </>
        );
      case "noAudio":
        return (
          <>
            {renderTextarea()}
            {renderEmoji()}
            {renderMoreFeatures()}
          </>
        );
      case "noEmoji":
        return (
          <>
            {renderRecorder()}
            {renderTextarea()}
            {renderMoreFeatures()}
          </>
        );
      case "noAudioAndEmoji":
        return (
          <>
            {renderTextarea()}
            {renderMoreFeatures()}
          </>
        );
      case "onlyText":
        return <>{renderTextarea()}</>;
      default:
        break;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.emitter}>{renderConditionModule()}</Box>
    </Box>
  );
}
export default memo(SendBox);
