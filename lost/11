import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import {
    Box,
    IconButton
} from "@material-ui/core";
import threadIcon from '../../common/images/thread.png'
import close from '../../common/images/threadClose.png'
import { useSelector, useDispatch } from "../../EaseApp/index";
import ThreadActions from "../../redux/thread";



const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: "flex",
            zIndex: "999",
            width: "100%",
            height: "6.67vh",
            maxHeight: "60px",
            minHeight: "40px",
            justifyContent: "space-between",
            alignItems: "center",
        },
        threadIcon: {
            width: '24px',
            height: '21px',
        },
        close: {
            width: '14px',
            height: '14px',
        },
        leftBar: {
            fontWeight: '600',
        }
    };
});

const ThreadBar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const closeThreadPanel = () => {
        dispatch(ThreadActions.updateThreadStates(false));
    }
    const threadName = useSelector((state) => state.thread?.currentThreadInfo?.thread?.threadName)||'New thread';
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}>
                <IconButton className="iconfont icon">
                    <img alt="" className={classes.threadIcon} src={threadIcon} />
                </IconButton>{threadName}</Box>
            <Box position="static">
                <IconButton className="iconfont icon" onClick={closeThreadPanel}>
                    <img alt="" className={classes.close} src={close} />
                </IconButton>
            </Box>
        </div>
    );
};

export default ThreadBar;
