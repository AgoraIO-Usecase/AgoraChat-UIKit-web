import React, { useRef, memo, useState } from "react";
import AudioAnalyser from "react-audio-analyser"
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';
import StopIcon from '@material-ui/icons/Stop';
import { IconButton, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MessageActions from '../../../redux/message'
import { useDispatch,useSelector } from 'react-redux';
import WebIM from '../../../utils/WebIM';
const audioType = 'audio/wav'
const useStyles = makeStyles((theme) => ({
    container: {
        width: '300px',
        overflowX: 'hidden',
        padding: '10px',
        '& canvas': {
            width: '300px !important',
        }
    },
    start: {
        color: '#23C381',
        border: '1px solid'
    },
    stop: {
        color: 'red',
        border: '1px solid'
    }
}))
const to =""
const chatType=""
function Recorder({ open, onClose }) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')
    const globalProps = useSelector(( state )=> state.global.globalProps )
    const { to, chatType } = globalProps
    let startTime = useRef(null)
    const audioProps = {
        audioType,
        status,
        timeslice: 1000, //（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
        startCallback: (e) => {
            startTime.current = new Date().getTime()
        },
        pauseCallback: (e) => {
        },
        stopCallback: (e) => {
            let endTime = new Date().getTime()
            const duration = (endTime - startTime.current) / 1000
            const uri = {
                url: WebIM.utils.parseDownloadResponse.call(WebIM.conn, e),
                filename: 'audio-message.wav',
                filetype: 'audio',
                data: e,
                length: duration,
                duration: duration
            }
            dispatch(MessageActions.sendRecorder(to, chatType, uri))
            onClose()
        },
        onRecordCallback: (e) => {
        },
        errorCallback: (err) => {
            console.log("error", err)
        },

        backgroundColor: "#fff",
        strokeColor: 'green'
    }
    const handleClose = () => {
        if (status === "recording") {
            setStatus("inactive")
        }
        onClose()
    }
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <div className={classes.container}>
                <AudioAnalyser {...audioProps}>
                    <div className="btn-box" style={{
                        textAlign: 'center',
                        padding: '8px'
                    }}>
                        {status !== "recording" &&
                            <IconButton className={classes.start} onClick={() => setStatus("recording")}>
                                <SettingsVoiceIcon />
                            </IconButton>}
                        {status === "recording" &&
                            <IconButton className={classes.stop} onClick={() => setStatus("inactive")}>
                                <StopIcon />
                            </IconButton>}
                    </div>
                </AudioAnalyser>
            </div>
        </Dialog>
    )
}

export default memo(Recorder)

