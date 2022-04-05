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

const ThreadBar = () => {
    let easeChatProps = useContext(EaseChatContext);
    const { onEditThreadPanel } = easeChatProps
    const classes = useStyles();
    const dispatch = useDispatch();
    const closeThreadPanel = () => {
        dispatch(ThreadActions.updateThreadStates(false));
    }
    const threadName = useSelector((state) => state.thread?.currentThreadInfo?.thread_overview?.name) || i18next.t('New thread');
    const threadId = useSelector((state) => state.thread?.currentThreadInfo?.thread_overview?.id) || '';
    const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread) || false;
    const to = useSelector((state) => state.global.globalProps?.to);
    const hasThreadEditPanel = useSelector((state) => state.thread?.hasThreadEditPanel) || false;
    const openEditPanel = (e) => {
        onEditThreadPanel(e, {
            groupId: to,
            threadId,
            threadName
        });
    }
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}>
                <IconButton className="iconfont icon">
                    <img alt="" className={classes.threadIcon} src={threadIcon} />
                </IconButton>{threadName}</Box>
            <Box position="static" className={classes.rightBar}>
                {!isCreatingThread && hasThreadEditPanel && <IconButton
                    className="iconfont icon-hanbaobao icon editPanel"
                    onClick={(e) => openEditPanel(e)}
                ></IconButton>}
                <IconButton className="iconfont icon" onClick={closeThreadPanel}>
                    <img alt="" className={classes.close} src={close} />
                </IconButton>
            </Box>
        </div>
    );
};

export default ThreadBar;
