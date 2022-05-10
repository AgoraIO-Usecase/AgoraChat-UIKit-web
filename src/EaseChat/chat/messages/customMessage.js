import React, { memo } from 'react'
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { renderTime } from '../../../utils';
import videoDark from '../../../common/images/video_dark@2x.png';
import videoWhite from '../../../common/images/video_white@2x.png';
import audioDark from '../../../common/images/audio_dark@2x.png';
import audioWhite from '../../../common/images/audio_white@2x.png';
const useStyles = makeStyles((theme) => ({
    messageBox: {
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        alignItems:'center',
        display: 'flex',
        width: '100%',
		height: '90px',
		flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
    },
    text: {
        textAlign: 'center',
        color: 'rgba(1, 1, 0, 0.3)',
        fontSize: '12px',
        marginBottom: '26px',
        width: '229px',
        color: 'rgba(1, 1, 0, 0.3)',
	    fontSize: '12px',
	    textAlign: 'center',
	    background: '#F2F2F2',
	    flexDirection: 'row',
	    height: '70px',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    padding: '10px',
	    boxSizing: 'border-box',
	    borderRadius: (props) =>
			props.bySelf ? "15px 15px 5px 15px" : "15px 15px 15px 5px",
    },
    textBox: {
    	display: 'flex',
	    flexDirection: 'column',
	    height: '100%',
	    justifyContent: 'space-between',
	    '& span:nth-child(1)': {
	    	fontSize: '16px',
    		color: '#000'
	    },
	    '& span:nth-child(2)': {
	    	fontSize: '14px',
    		color: '#666666'
	    }
    },
    iconBox: {
    	width: '50px',
    	height: '50px',
    	background: (props) => (props.ended ? '#fff' : '#00CE76'),
		borderRadius: '8px',
		'& img':{
			width: '100%'
		}
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

function CustomMessage({ message }) {
    console.log('message', message)
    const info = message.body.info || {}
    const classes = useStyles({ bySelf: message.bySelf, ended: [0,1].includes(info.type)});
    let icon = ''
    switch(info.type){
        case 0:
            icon = audioDark;
            break;
        case 1:
            icon = videoDark;
            break;
        case 2:
            icon = videoWhite;
            break;
        case 3:
            icon = audioWhite;
            break;
        default:
            break;
    }

    return (
        <li className={classes.messageBox}>
            <div className={classes.text}>
                <div className={classes.textBox}>
                	<span>Call ended</span>
                	<span>{info.duration}</span>
                </div>
                <div className={classes.iconBox}>
                	<img src={videoDark} alt=""/>
                </div>
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
        </li>
    )
}

export default memo(CustomMessage)

