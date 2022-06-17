import React, { memo } from 'react'
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { renderTime } from '../../../utils';
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginTop: '26px',
        position: 'relative',
        alignItems:'center'
    },
    text: {
        textAlign: 'center',
        color: 'rgba(1, 1, 0, 0.3)',
        fontSize: '12px',
        marginBottom: '26px'
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

function NoticeMessage({ message }) {
    console.log('message', message)
    const classes = useStyles({ bySelf: message.bySelf });
    return (
        <li className={classes.pulldownListItem}>
            <div className={classes.text}>
                {message.body.msg || 'hello world'}
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
        </li>
    )
}

export default memo(NoticeMessage)

