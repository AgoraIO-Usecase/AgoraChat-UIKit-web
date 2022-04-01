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
import { EaseLivestreamContext } from "./index";

import icon_emoji from "../../common/icons/sendEmoji.png";
import icon_yuyin from "../../common/icons/voice@2x.png";
import attachment from "../../common/icons/sendIcon.png";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: "#292929",
    borderRadius: "2px",
    position: "absolute",
    bottom: 0,
    padding: "10px 0",
  },
  emitter: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  },
  input: {
    outline: "none",
    flex: 1,
    lineHeight: "17px",
    fontSize: "14px",
    border: "none",
    color: "#f1f1f1",
    resize: "none",
    backgroundColor: "#393939",
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
  let easeLivestreamProps = useContext(EaseLivestreamContext);
  const { easeInputMenu,menuList,handleMenuItem } = easeLivestreamProps;
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalProps = useSelector((state) => state.global.globalProps);
  const { chatType, to } = globalProps;
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
  const sendMessage = useCallback(() => {
    if (!inputValue) return;
    dispatch(
      MessageActions.sendTxtMessage(to, chatType, {
        msg: inputValue,
      })
    );
    setInputValue("");
    inputRef.current.focus();
  }, [inputValue, to, chatType, dispatch]);

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

  const handleSendMsg = () => {
    sendMessage();
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
        placeholder={'Say Hi...'}
      ></TextareaAutosize>
    );
  };

  const renderEmoji = () => {
    return (
      <>
        <IconButton ref={emojiRef} onClick={handleClickEmoji}>
          <img alt="" style={{width:'20px',height:'20px'}} src={icon_emoji} />
        </IconButton>
        <Emoji
          anchorEl={emojiVisible}
          onSelected={handleEmojiSelected}
          onClose={handleEmojiClose}
        ></Emoji>
      </>
    );
  };

  const renderSend = () => {
    return (
      <>
        <IconButton onClick={handleSendMsg}>
          <img alt="" className={classes.iconStyle} src={attachment} />
        </IconButton>
      </>
    );
  };

  const renderConditionModule = () => {
    switch (easeInputMenu) {
      case "all":
        return (
          <>
            {renderTextarea()}
            {renderEmoji()}
            {renderSend()}
          </>
        );
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
