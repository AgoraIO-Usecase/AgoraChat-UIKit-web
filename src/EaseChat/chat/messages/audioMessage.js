import React, { memo, useRef } from 'react'
import { makeStyles } from "@material-ui/styles";
import Avatar from '@material-ui/core/Avatar';
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex',
        alignItems:'center'
    },
    audioBox: {
        marginLeft: '10px',
        maxWidth: '50%',
        width: '208px',
        height: '34px',
        background: 'rgb(35, 195, 129)',
        borderRadius: '4px 4px 4px 0px'
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
    }
}))

function AudioMessage({ url }) {
    const classes = useStyles({ bySelf: true });
    const audioRef = useRef(null)

    const play = () => {
        audioRef.current.play()
    }
    return (
        <li className={classes.pulldownListItem}>
            <Avatar>ss</Avatar>
            <div className={classes.audioBox} onClick={play}>
                <audio src={url} ref={audioRef} />
            </div>
            <div className={classes.time}>
                2020/12/21 12:54 Mon
            </div>
        </li>
    )
}

export default memo(AudioMessage)