import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import {
    Box,
    IconButton
} from "@material-ui/core";
import threadIcon from '../../common/images/thread.png'
import close from '../../common/images/threadClose.png'
import { useSelector, useDispatch } from "../../EaseApp/index";
import ThreadActions from "../../redux/thread";
import { EaseChatContext } from "../chat/index";
import "../../i18n";
import i18next from "i18next";



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
        },
        rightBar: {
            display: 'flex',
        },
        editPanel: {
            height: '38px',
            width: '38px',

        }
    };
});

const ThreadBar = (props) => {
    let easeChatProps = useContext(EaseChatContext);
    const { editThreadPanel } = easeChatProps
    const classes = useStyles();
    const dispatch = useDispatch();
    const closeThreadPanel = () => {
        dispatch(ThreadActions.updateThreadStates(false));
    }
    const threadName = useSelector((state) => state.thread?.currentThreadInfo?.thread_overview?.name) || i18next.t('New thread');
    const { isCreatingThread } = useSelector((state) => state.thread);
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}>
                <IconButton className="iconfont icon">
                    <img alt="" className={classes.threadIcon} src={threadIcon} />
                </IconButton>{threadName}</Box>
            <Box position="static" className={classes.rightBar}>
                {/* {!isCreatingThread && <div className={classes.editPanel}> */}
                {isCreatingThread && <div className={classes.editPanel}>
                    {editThreadPanel}
                </div>}
                <IconButton className="iconfont icon" onClick={closeThreadPanel}>
                    <img alt="" className={classes.close} src={close} />
                </IconButton>
            </Box>
        </div>
    );
};

export default ThreadBar;
