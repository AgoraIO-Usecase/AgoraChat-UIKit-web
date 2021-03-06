import React, { memo } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Icon } from '@material-ui/core';
import send from '../../../common/icons/sent@3x.png'
import fail from '../../../common/icons/failed@3x.png'
import read from '../../../common/icons/read@3x.png'
import received from '../../../common/icons/received@3x.png'
import sending from '../../../common/icons/sending@3x.png'
const useStyles = makeStyles((theme) => ({
    MuiCircularProgressSvg: {
        width: "15px",
        height: "15px",
        color: "#e0e0e0",
        margin: "0 4px",
    },
    failIcon: {
        color: "red",
    },
    imgStyle: {
        height: "20px",
        marginRight: "5px",
    },
    rotate: {
        animation: "rotate 800ms infinite"
    },
    "@keyframes rotate": {
        "0%": {
            transform: "rotate(0deg)"
        },
        "100%": {
            transform: "rotate(360deg)"
        }
    },
    hoverStyle: {
        marginRight: "25px",
    },
}));
function SedndingStatus({ status, style = {},hoverReaction }) {
    const classes = useStyles({
		hoverReaction: hoverReaction,
	});
    let statusIcon = ''
    // console.log('status>>',status);
    switch (status) {
        case 'sent':
            statusIcon = <img src={!hoverReaction ? send : null} alt="sent" className={classes.imgStyle}></img>
            break;
        case 'sending':
            statusIcon = <img src={!hoverReaction ? sending : null} alt="sent" className={classes.imgStyle + ' ' + classes.rotate}></img>
            break;
        case 'received':
            statusIcon = <img src={received} alt="received" className={classes.imgStyle}></img>
            break;
        case 'read':
            statusIcon = <img src={read} alt="read" className={classes.imgStyle}></img>
            break;
        case 'fail':
            statusIcon = <img src={fail} alt="fail" className={classes.imgStyle}></img>
            break;
        default:
            statusIcon = ''
            break
    }
    return statusIcon
}

export default memo(SedndingStatus)