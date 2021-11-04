import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom'
import { makeStyles } from "@material-ui/styles";
import './index.css'
import { useDispatch } from 'react-redux';
import MessageActions from '../../redux/message'
import RetractedMessage from './messages/retractedMessage';
import FileMessage from './messages/fileMessage';
import ImgMessage from './messages/imageMessage';
import AudioMessage from './messages/audioMessage';
import TextMessage from './messages/textMessage';
// import { useParams } from "react-router-dom";
const to = ''
const chatType =''
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        position: 'relative',
        bottom: '0',
        top: '0',
        overflow: 'hidden',
        // flexDirection:'column-reverse'
    },
}))

const PAGE_NUM = 20
function MessageList({ messageList }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    // const { to, chatType } = useParams()
    console.log('** Render MessageList **')
    const scrollEl = useRef(null)
    const [isPullingDown, setIsPullingDown] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    let _not_scroll_bottom = false

    useEffect(() => {
        if (!_not_scroll_bottom) {
            setTimeout(() => {
                const dom = scrollEl.current
                if (!ReactDOM.findDOMNode(dom)) return
                dom.scrollTop = dom.scrollHeight
            }, 0)
        }
    })

    const handleRecallMsg = useCallback((message) => {
        console.log('handleRecallMsg', message)
        const { to, chatType } = message
        dispatch(MessageActions.recallMessage(to, chatType, message))
    }, [dispatch])

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && !isLoaded) {
            setTimeout(() => {
                const offset = messageList.length
                dispatch(MessageActions.fetchMessage(to, chatType, offset, (res) => {
                    setIsPullingDown(false)
                    if (res < PAGE_NUM) {
                        setIsLoaded(true)
                    }
                }))
            }, 500)
            setIsPullingDown(true)
        }
    }
    return (
        <div className={classes.root}>
            <div ref={scrollEl} className="pulldown-wrapper" onScroll={handleScroll}>
                <div className="pulldown-tips">
                    <div style={{ display: isLoaded ? 'block' : 'none' }}>
                        <span>loaded</span>
                    </div>
                    <div style={{ display: isPullingDown ? 'block' : 'none' }}>
                        <span>Loading...</span>
                    </div>
                </div>
                <ul className="pulldown-list">
                    {messageList.map((msg) => {
                        if (msg.body.type === 'txt') {
                            return <TextMessage message={msg} key={msg.id}  onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'file') {
                            return <FileMessage message={msg} key={msg.id} onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'img') {
                            return <ImgMessage message={msg} key={msg.id} onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'audio') {
                            <AudioMessage message={msg} key={msg.id} />
                        }
                        else if (msg.body.type === 'recall') {
                            return <RetractedMessage message={msg} key={msg.id} />
                        } else {
                            return null
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}

export default memo(MessageList)

