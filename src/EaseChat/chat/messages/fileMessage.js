import React, { memo, useState } from 'react'
import { makeStyles } from "@material-ui/styles";
import Avatar from '@material-ui/core/Avatar';
// import clsx from 'clsx';
import i18next from "i18next";
import { IconButton, Icon, Menu, MenuItem } from '@material-ui/core';
import { renderTime } from '../../../utils';

const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex',
        flexDirection: props => props.bySelf ? 'row-reverse' : 'row',
        alignItems: 'center'
    },
    fileCard: {
        width: '252px',
        height: '72px',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginBottom: '26px'
    },
    fileIcon: {
        width: '59px',
        height: '59px',
        background: 'rgba(35, 195, 129, 0.06)',
        borderRadius: '4px',
        border: '1px solid rgba(35, 195, 129, 0.06)',
        textAlign: 'center',
        lineHeight: '59px',
        margin: '0 7px 0 7px',
        flexShrink: 0,
    },
    fileInfo: {
        '& p': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '126px',
            margin: '0'
        },
        '& span': {
            fontSize: '12px',
            color: '#010101',
            lineHeight: '16px'
        }
    },
    icon: {
        color: 'rgba(35, 195, 129, 1)',
        fontWeight: 'bold',
        fontSize: '38px'
    },
    download: {
        fontSize: '16px',
        color: 'rgba(0,0,0,.6)',
        fontWeight: 'bold',
        cursor: 'pointer'
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
function FileMessage({ message, onRecallMessage, showByselfAvatar }) {
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
            <div className={classes.fileCard} onContextMenu={handleClick}>
                <div className={classes.fileIcon}>
                    {/* <Icon className={clsx(classes.icon, 'iconfont icon-fujian')}></Icon> */}
                    {i18next.t('file')}
                </div>
                <div className={classes.fileInfo}>
                    <p>{message.filename}</p>
                    <span>{Math.floor(message.body.size / 1024) + 'kb'}</span>
                </div>
                <div className={classes.download}>
                    <a href={message.body.url} download={message.filename}>
                        <IconButton className="iconfont icon-xiazai"></IconButton>
                    </a>
                </div>
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

export default memo(FileMessage)