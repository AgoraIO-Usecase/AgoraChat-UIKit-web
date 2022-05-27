import React, { memo, useState, useEffect } from "react";
import SettingsVoiceIcon from "@material-ui/icons/SettingsVoice";
import StopIcon from "@material-ui/icons/Stop";
import { IconButton, Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MessageActions from "../../../redux/message";
import { useDispatch, useSelector } from "react-redux";
import recording from "./recorder/recordAudio";
import WebIM from "../../../utils/WebIM";
import i18next from "i18next";
const useStyles = makeStyles((theme) => ({
  container: {
    width: "300px",
    overflowX: "hidden",
    padding: "10px",
    "& canvas": {
      width: "300px !important",
    },
  },
  start: {
    color: "#23C381",
    border: "1px solid",
  },
  stop: {
    color: "red",
    border: "1px solid",
  },
  tipText:{
    textAlign: 'center',
    color: '#727272',
    marginBottom: '20px'
  }
}));
let MediaStream
function Recorder({ open, onClose, isChatThread,threadName }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [num, setNum] = useState(60);
  const [recorderObj, setRecorderObj] = useState({});
  const [timeInterval, setTimeInterval] = useState("");
  const [startTime, setStartTime] = useState("");
  const currentThreadInfo = useSelector((state) => state.thread?.currentThreadInfo);
  const threadOriginalMsg = useSelector((state) => state.thread?.threadOriginalMsg);
  const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread);

  let mounted;
  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
      clearInterval(timeInterval);
    };
  }, []);
  const globalProps = useSelector((state) => state.global.globalProps);
  const { to, chatType } = globalProps;

  const handleClose = () => {
    if (status === "recording") {
      setStatus("inactive");
    }
    onClose();
  };

  const clearTimer = () => {
    if (timeInterval) {
      setNum(60);
      clearInterval(timeInterval);
    }
  };

  // start recorder
  const mouseStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("recording");

    let _startTime = new Date().getTime();
    setStartTime(_startTime);
    clearTimer();

    recording.get((rec,val) => {
      setRecorderObj(rec);
      console.log('recrecrecrecrec', rec)
      MediaStream = val
      if (rec) {
        let _interval = setInterval(() => {
          if (num <= 0 && mounted) {
            rec.stop();
            setNum(60);
            clearTimer();
          } else {
            let n = num - 1;
            setNum(n);
            rec.start();
          }
        }, 1000);
        setTimeInterval(_interval);
      }
    });
  };

  // end recorder
  const mouseEnd = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("inactive");

    clearTimer();
    let _endTime = new Date().getTime();
    let duration = (_endTime - startTime) / 1000;
    if (recorderObj) {
      console.log('recorderObj>>',recording);
      recorderObj.stop();
      // 重置说话时间
      setNum(60);
      // 获取语音二进制文件
      let blob = recorderObj.getBlob();
      // 发送语音功能
      if (type === "audio") {
        const uri = {
          url: WebIM.utils.parseDownloadResponse.call(WebIM.conn, blob),
          filename: "audio-message.wav",
          filetype: "audio",
          data: blob,
          length: duration,
          duration: duration,
        };
        createChatThread().then(to=>{
          dispatch(MessageActions.sendRecorder(to, chatType, uri, isChatThread));
        })
        onClose();
        MediaStream.getTracks()[0].stop()
      }
    }
  };
  const createChatThread = ()=>{
    return new Promise((resolve,reject) => {
      if (isCreatingThread && isChatThread) {
        if (!threadName) {
          console.log('threadName can not empty')
          return;
        }
        const options = {
          name: threadName.replace(/(^\s*)|(\s*$)/g, ""),
          messageId: threadOriginalMsg.id,
          parentId: threadOriginalMsg.to,
        }
        WebIM.conn.createChatThread(options).then(res=>{
          const threadId = res.data?.chatThreadId;
          resolve(threadId)
        })
      }else if(isChatThread){
        resolve(currentThreadInfo.id)
      }else {
        resolve(to)
      }
    })
  }
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className={classes.container}>
        <div className={classes.tipText}>{i18next.t("Click to start recording")}</div>

        <div style={{ textAlign: "center" }}>
          {status !== "recording" && (
            <IconButton className={classes.start} onClick={mouseStart}>
              <SettingsVoiceIcon />
            </IconButton>
          )}
          {status === "recording" && (
            <IconButton className={classes.stop} onClick={mouseEnd("audio")}>
              <StopIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default memo(Recorder);
