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
import Emoji from "./toolbars/emoji";
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
import ThreadActions from "../../redux/thread"
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: "#fff",
    borderRadius: "2px",
    position: "absolute",
    bottom: 0,
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
    borderRadius: "10px",
    padding: "5px",
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
    width: "26px",
    height: "26px",
  },
  menuItemIconBox: {
    marginRight: "5px",
    display: "flex",
  },
}));

function SendBox(props) {
  let easeChatProps = useContext(EaseChatContext);
  const { easeInputMenu, menuList, handleMenuItem } = easeChatProps;
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
  inputValueRef.current = inputValue;
  const handleClickEmoji = (e) => {
    setEmojiVisible(e.currentTarget);
  };
  const handleEmojiClose = () => {
    setEmojiVisible(null);
  };
  const handleEmojiSelected = (emoji) => {
    if (!emoji) return;
    setEmojiVisible(null);
    setInputValue((value) => value + emoji);
    setTimeout(() => {
      let el = inputRef.current;
      el.focus();
      el.selectionStart = inputValueRef.current.length;
      el.selectionEnd = inputValueRef.current.length;
    }, 0);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);
  const currentThreadInfo = useSelector((state) => state.thread?.currentThreadInfo);
  const sendMessage = useCallback(() => {
    if (!inputValue) return;
    if (isCreatingThread && props.isThread) {
      if (!props.threadName) {
        console.log('threadName can not empty')
        return;
      }
      const options = {
        name: props.threadName.replace(/(^\s*)|(\s*$)/g, ""),
        msgId: currentThreadInfo.bySelf ? currentThreadInfo.mid: currentThreadInfo.id,
        groupId: currentThreadInfo.to,
      }
      WebIM.conn.createThread(options).then(res=>{
        const threadId = res.data?.thread_id;
        //change edit status of thread
        dispatch(ThreadActions.setIsCreatingThread(false));
        //send message
        dispatch(
          MessageActions.sendTxtMessage(threadId, chatType, {
            msg: inputValue,
          },props.isThread )
        );
        setInputValue("");
        inputRef.current.focus();
      })
      return 
    }
    if(props.isThread) {
      to = currentThreadInfo.thread_overview.id
    }
    dispatch(
      MessageActions.sendTxtMessage(to, chatType, {
        msg: inputValue,
      }, props.isThread)
    );
    setInputValue("");
    inputRef.current.focus();
  }, [inputValue, to, chatType, dispatch,currentThreadInfo ]);

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

  const handlefocus = (v) =>{
    const {value} = v
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
    const receiveId = props.isThread ? currentThreadInfo.thread_overview.id: to
    dispatch(MessageActions.sendFileMessage(receiveId, chatType, file, fileEl, props.isThread));
  };

  const handleVideoChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    const receiveId = props.isThread ? currentThreadInfo.thread_overview.id: to
    dispatch(MessageActions.sendVideoMessage(receiveId, chatType, file,videoEl, props.isThread));
  }
  const handleImageChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    const receiveId = props.isThread ? currentThreadInfo.thread_overview.id: to
    dispatch(MessageActions.sendImgMessage(receiveId, chatType, file, imageEl, props.isThread));
  };

  const handleClickMenu = (e) => {
    setSessionEl(e.currentTarget);
  };

  const onClickMenuItem = (v) => (e) => {
    handleMenuItem && handleMenuItem(v,e)
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
          horizontal: "left",
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
        />
      </>
    );
  };

  const renderTextarea = () => {
    return (
      <TextareaAutosize
        className={classes.input}
        minRows={2}
        maxRows={3}
        value={inputValue}
        onChange={handleInputChange}
        ref={inputRef}
      ></TextareaAutosize>
    );
  };

  const renderEmoji = () => {
    return (
      <>
        <IconButton ref={emojiRef} onClick={handleClickEmoji}>
          <img alt="" className={classes.iconStyle} src={icon_emoji} />
        </IconButton>
        <Emoji
          anchorEl={emojiVisible}
          onSelected={handleEmojiSelected}
          onClose={handleEmojiClose}
        ></Emoji>
      </>
    );
  };

  const renderMoreFeatures = () => {
    return (
      <>
        <IconButton onClick={handleClickMenu}>
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
