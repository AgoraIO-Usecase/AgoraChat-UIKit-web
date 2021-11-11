import React, { memo } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Icon } from '@material-ui/core';
import send from '../../../common/icons/sent@3x.png'
import fail from '../../../common/icons/failed@3x.png'
import read from '../../../common/icons/read@3x.png'
import received from '../../../common/icons/received@3x.png'
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    'MuiCircularProgressSvg': {
        width: '15px',
        height: '15px',
        color: '#e0e0e0',
        margin: '0 4px'
    },
    failIcon: {
        color: 'red'
    },
    imgStyle:{
        height:'20px',
        marginRight:'5px'
    }
}))
function SedndingStatus({ status, style = {} }) {
    const classes = useStyles();
    let statusIcon = ''
    console.log('status>>',status);
    switch (status) {
        case 'sent':
            statusIcon = <img src={send} alt="" className={classes.imgStyle}></img>
            break;
        case 'sending':
            statusIcon = <svg className={classes.MuiCircularProgressSvg} viewBox="22 22 44 44" style={style}><circle className="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle></svg>
            break;
        case 'received':
            statusIcon = <img src={received} alt="" className={classes.imgStyle}></img>
            break;
        case 'read':
            statusIcon = <img src={read} alt="" className={classes.imgStyle}></img>
            break;
        case 'fail':
            statusIcon = <img src={fail} alt="" className={classes.imgStyle}></img>
            break;
        default:
            statusIcon = ''
            break
    }
    return statusIcon
}

export default memo(SedndingStatus)