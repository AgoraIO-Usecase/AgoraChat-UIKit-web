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
  Popover
} from "@material-ui/core";
import Emoji from "./toolbars/emoji";
import { useDispatch, useSelector } from "react-redux";
import MessageActions from "../../redux/message";
import PropTypes from "prop-types";
import i18next from "i18next";
import WebIM from "../../utils/WebIM";
import EaseChatProvider, { EaseChatContext } from "./index";
import EaseAppProvider from '../../EaseApp/index'

import Recorder from "./messages/recorder";
import icon_emoji from "../../common/icons/emoji@2x.png";
import icon_yuyin from "../../common/icons/voice@2x.png";
import attachment from "../../common/icons/attachment@2x.png";
import { message } from '../common/alert' 
import gifsImg from "../../common/images/GIFs@2x.png"
import stickersImg from "../../common/images/stickers@2x.png";
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
  emojiBox: {
    position: 'relative',
  },
  thirdEmojiBox: {
    width: '390px',
    minHeight: '332px',
    background: 'rgba(255, 255, 255, 1)',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12), 0px 4px 24px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    maxHeight: '850px',
  },
  tabaBox: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '44px',
    background: 'rgba(0, 0, 0, 0.02)',
  },
  tabItem: {
    borderRadius: '16px',
    height: '32px',
    width: '104px',
    textAlign: 'center',
    paddingTop: '3px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  tabItemBgc: {
    backdropFilter: 'blur(27.1828px)',
    background: 'rgba(216, 216, 216, 0.4)',
  },
  sendBoxPopover: {
    '& .MuiPopover-paper': {
      borderRadius: '16px',
      overflowX: 'visible',
      overflowY: 'visible',
    }
  }
}));

function SendBox(props) {
  let easeChatProps = useContext(EaseChatContext);
  const { easeInputMenu, menuList, handleMenuItem, onOpenThreadPanel, thridPartyStickets, thridPartyGifs } = easeChatProps;
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalProps = useSelector((state) => state.global.globalProps);
  let { chatType, to } = globalProps;
  const emojiRef = useRef(null);
  const fileEl = useRef(null);
  const videoEl = useRef(null)
  const [emojiVisible, setEmojiVisible] = useState(null);
  const thirdEmojiRef = useRef(null)
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const inputValueRef = useRef(null);
  const imageEl = useRef(null);
  const [sessionEl, setSessionEl] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showStickets, setShowStickets] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [showThirdEmoji, setshowThirdEmoji] = useState(null);
  const [whoClick, setWhoClick] = useState('click');
  inputValueRef.current = inputValue;
  const handleClickEmoji = (e, num) => {
    e.preventDefault()
    e.stopPropagation()
    if (num === 0) {
      setEmojiVisible(e.currentTarget)
      setShowStickets(false)
      setShowGifs(false)
    } else if (num === 1) {
      setShowStickets(true)
      setShowGifs(false)
      setEmojiVisible(false)
    } else if (num === 2) {
      setShowGifs(true)
      setShowStickets(false)
      setEmojiVisible(false)
    } else if (num === 3) {
      if (showThirdEmoji) {
        setshowThirdEmoji(null)
      } else {
        setshowThirdEmoji(e.currentTarget)
      }
      setEmojiVisible(true)
      setShowStickets(false)
      setShowGifs(false)
    }
  };
  const handleThirdEmojiClose = () => {
    setshowThirdEmoji(null)
    setTimeout(() => {
      let el = inputRef.current;
      el.focus();
      el.selectionStart = inputValueRef.current.length;
      el.selectionEnd = inputValueRef.current.length;
    }, 0);
  }
  const handleEmojiClose = () => {
    setEmojiVisible(null);
  };
  const handleEmojiSelected = (emoji, num) => {
    if (!emoji) return;
    if (!num) {
      setEmojiVisible(null);
    }
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
  const threadOriginalMsg = useSelector((state) => state.thread?.threadOriginalMsg);
  const threadPanelStates = useSelector((state) => state.thread?.threadPanelStates);
  useEffect(()=>{
    if(threadPanelStates){
      setInputValue('')
    }
  },[isCreatingThread,currentThreadInfo?.id,threadOriginalMsg?.id,threadPanelStates])
  const createChatThread = ()=>{
    return new Promise((resolve,reject) => {
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
        WebIM.conn.createChatThread(options).then(res=>{
          const threadId = res.data?.chatThreadId;
          onOpenThreadPanel && onOpenThreadPanel({id: threadId})
          resolve(threadId)
        })
      }else if(props.isChatThread){
        resolve(currentThreadInfo.id)
      }else {
        resolve(to)
      }
    })
  }
  const sendMessage = useCallback(() => {
    if (!inputValue) return;
    createChatThread().then(to=>{
      dispatch(
        MessageActions.sendTxtMessage(to, chatType, {
          msg: inputValue,
        }, props.isChatThread)
      );
      setInputValue("");
      inputRef.current.focus();
    })
  }, [inputValue, to, chatType, dispatch,currentThreadInfo,props ]);

  const onKeyDownEvent = useCallback(
    (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        inputRef.current.value += "\n";
      } else if (e.keyCode === 13) {
        e.preventDefault();
        sendMessage();
        handleThirdEmoji()
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
    createChatThread().then(to=>{
      dispatch(MessageActions.sendFileMessage(to, chatType, file, fileEl, props.isChatThread));
    })
  }
  const handleVideoChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to=>{
      dispatch(MessageActions.sendVideoMessage(to, chatType, file,videoEl, props.isChatThread));
    })
  }
  const handleImageChange = (e) => {
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      return false;
    }
    createChatThread().then(to=>{
      dispatch(MessageActions.sendImgMessage(to, chatType, file, imageEl, props.isChatThread));
    })
    
  };
  const handleClickMenu = (e) => {
    setSessionEl(e.currentTarget);
  };

  const onClickMenuItem = (v) => (e) => {
    handleMenuItem && handleMenuItem(v,e)
    handlefocus(v)
    setSessionEl(null);
  };
  const handleThirdEmoji = (e) => {
    if (!e) return;
    const param = {
      ext: {
        ...e
      }
    }
    // dispatch(MessageActions.setCustomMessage(to, chatType, e)) // 自定义消息
    createChatThread().then(to=>{
      dispatch(MessageActions.sendImgMessage(to, chatType, param, null, props.isChatThread))
    })
  }
  EaseAppProvider.handleThirdEmoji = handleThirdEmoji
  EaseChatProvider.handleThirdEmoji = handleThirdEmoji
  EaseAppProvider.closeThirdEmoji = handleThirdEmojiClose
  EaseChatProvider.closeThirdEmoji = handleThirdEmojiClose
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
          isChatThread = {props.isChatThread}
          threadName = {props.threadName}
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
        <IconButton ref={emojiRef} onClick={(e) => handleClickEmoji(e, 0)}>
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
  const renderThridPartyEmoji = () => {
    return(
      <div className={classes.emojiBox}>
        <IconButton ref={emojiRef} onClick={(e) => handleClickEmoji(e, 3)}>
          <img alt="" className={classes.iconStyle} src={icon_emoji} />
        </IconButton>
        {
          <Popover
            className={classes.sendBoxPopover}
            keepMounted
            open={Boolean(showThirdEmoji)}
            onClose={handleThirdEmojiClose}
            anchorEl={showThirdEmoji}
            style={{ maxHeight: '850px' }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
          >
            <div className={classes.thirdEmojiBox}>
              <div className={classes.tabaBox}>
                <div className={`${classes.tabItem} ${emojiVisible ? classes.tabItemBgc : ''}`} onClick={(e) => handleClickEmoji(e, 0)}>
                  <img alt="" className={classes.iconStyle} src={icon_emoji} />
                </div>
                {
                  thridPartyStickets ?
                  <div className={`${classes.tabItem} ${showStickets ?  classes.tabItemBgc : ''}`} onClick={(e) => handleClickEmoji(e, 1)}>
                    <img alt="" className={classes.iconStyle} src={stickersImg} />
                  </div>
                  : null
                }
                {
                  thridPartyGifs ?
                  <div className={`${classes.tabItem} ${showGifs ? classes.tabItemBgc : ''}`} onClick={(e) => handleClickEmoji(e, 2)}>
                    <img alt="" className={classes.iconStyle} src={gifsImg} />
                  </div>
                  : null
                }
              </div>
              <div>
                {
                  emojiVisible ?
                  <Emoji
                    anchorEl={emojiVisible}
                    onSelected={(e) => handleEmojiSelected(e, 1)}
                    onClose={handleEmojiClose}
                    thirdEmoji={true}
                  ></Emoji>
                  : null
                }
                { showStickets ? thridPartyStickets : null }
                { showGifs ? thridPartyGifs : null }
              </div>
            </div>
          </Popover>
        }
      </div>
    )
  }

  const renderConditionModule = () => {
    switch (easeInputMenu) {
      case "all":
        return (
          <>
            {renderRecorder()}
            {renderTextarea()}
            {thridPartyStickets || thridPartyGifs ? renderThridPartyEmoji() : renderEmoji()}
            {renderMoreFeatures()}
          </>
        );
      case "noAudio":
        return (
          <>
            {renderTextarea()}
            {thridPartyStickets || thridPartyGifs ? renderThridPartyEmoji() : renderEmoji()}
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
