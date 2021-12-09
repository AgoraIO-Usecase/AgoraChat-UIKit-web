import React, { memo, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Avatar, Icon } from '@material-ui/core';
import { renderTime } from '../../../utils/index';
import AudioPlayer from './audioPlayer/audioPlayer'
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex',
        flexDirection: props => props.bySelf ? 'row-reverse' : 'row'
    },

    audioBox: {
        margin: props => props.bySelf ? '0 10px 26px 0' : '0 0 26px 10px',
        maxWidth: '50%',
        minWidth: '50px',
        width: props => `calc(208px * ${props.duration / 15})`,
        height: '34px',
        background: props => props.bySelf ? 'linear-gradient(124deg, rgb(201, 19, 223) 20%, rgb(21, 77, 254) 90%)' : 'rgb(242, 242, 242)',
        borderRadius: props => props.bySelf ? '16px 16px 4px' : '16px 16px 16px 4px',
        color: props => props.bySelf ? '#fff' : 'rgb(0, 0, 0)',
        textAlign: props => props.bySelf ? 'left' : 'right',
        flexDirection: props => props.bySelf ? 'row' : 'row-reverse',
        alignItems:'center',
        minHeight: '40px',
        lineHeight: '34px',
        padding: '0 5px',
        display: 'flex',
        cursor: 'pointer',
        fontSize:'14px'
    },
    time: {
        position: 'absolute',
        fontSize: '11px',
        height: '16px',
        color: 'rgba(1, 1, 1, .2)',
        lineHeight: '16px',
        textAlign: 'center',
        top: '-18px',
        width: '100%'
    },
    duration: {
        margin: '0 4px',
        position: 'relative',
        left: props => props.bySelf ? '-15px' : '15px'
    },
    icon: {
        transform: props => props.bySelf ? 'rotate(0deg)' : 'rotate(180deg)',
        display: 'block',
        height: '34px'
    }
}))

function AudioMessage({ message ,showByselfAvatar}) {
    console.log('message>>>',message);
    const classes = useStyles({ bySelf: message.bySelf, duration: Math.round(message.body.length) });
    const url = message.body.url
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const play = () => {
        setIsPlaying(true)
        audioRef.current.play()
        const time = message.body.length * 1000
        setTimeout(() => {
            setIsPlaying(false)
        }, time + 500)
    }

    return (
        <li className={classes.pulldownListItem}>
            {!message.bySelf && <Avatar></Avatar>} 
               {showByselfAvatar && message.bySelf && <Avatar></Avatar>} 
            <div className={classes.audioBox} onClick={play}>
                <AudioPlayer play={isPlaying} reverse={message.bySelf} />
                <span className={classes.duration}>
                    {Math.round(message.body.duration) + "''"}
                </span>
                <audio src={url} ref={audioRef} />
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
        </li>
    )
}

export default memo(AudioMessage)