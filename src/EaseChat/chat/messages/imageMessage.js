import React, { memo, useState } from 'react'
import { makeStyles } from "@material-ui/styles";
import { Avatar, Menu, MenuItem } from '@material-ui/core';
import i18next from "i18next";
import { renderTime } from '../../../utils';
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex',
        flexDirection: props => props.bySelf ? 'row-reverse' : 'row',
        alignItems:'center'
    },
    imgBox: {
        marginLeft: '10px',
        maxWidth: '50%',
        '& img': {
            maxWidth: '100%'
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
const initialState = {
    mouseX: null,
    mouseY: null,
};
function ImgMessage({ message, onRecallMessage ,showByselfAvatar}) {
    const classes = useStyles({ bySelf: message.bySelf });
    const [state, setState] = useState(initialState);
    const handleClose = () => {
        setState(initialState);
    };
    const recallMessage = () => {
        onRecallMessage(message)
        handleClose()
    }
    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    return (
        <li className={classes.pulldownListItem}>
            {!message.bySelf && <Avatar></Avatar>} 
               {showByselfAvatar && message.bySelf && <Avatar></Avatar>} 
            <div className={classes.imgBox} onContextMenu={handleClick}>
                <img src={message.url} alt='img message'></img>
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
            {message.bySelf ?
                <Menu
                    keepMounted
                    open={state.mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        state.mouseY !== null && state.mouseX !== null
                            ? { top: state.mouseY, left: state.mouseX }
                            : undefined
                    }
                >
                    <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>
                </Menu> : null
            }
        </li>
    )
}

export default memo(ImgMessage)