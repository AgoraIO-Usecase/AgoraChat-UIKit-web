import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import {
    Box,
    IconButton
} from "@material-ui/core";
import threadIcon from '../../common/images/thread.png'
import close from '../../common/images/threadClose.png'
import edit from '../../common/images/edit.png'
import { useSelector, useDispatch } from "../../EaseApp/index";
import ThreadActions from "../../redux/thread";
import { EaseChatContext } from "../chat/index";
import "../../i18n";
import i18next from "i18next";
import muteImg from '../../common/images/gray@2x.png'


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
        threadIconContainer: {
            position: 'absolute',
            top: '4px',
            left: '16px',
            display: 'inline-block',
            width: '32px',
            height: '32px',
            textAlign: 'center',
        },
        threadIcon: {
            marginTop: '5px',
            display: 'inline-block',
            width: '24px',
            height: '22px',
            objectFit: 'contain',
        },
        close: {
            width: '14px',
            height: '14px',
        },
        leftBar: {
            position: 'realtive',
            paddingLeft: '36px',
            fontWeight: '600',
            textAlign: 'left',
            width: '315px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        rightBar: {
            display: 'flex',
        },
        editPanel: {
            marginTop: '4px',
            height: '32px',
            width: '32px',
            textAlign: 'center',
            lineHeight: '32px',
            cursor: 'pointer',
            borderRadius: '100%',
            background: '#fff',
            '&:hover':{
                background: '#F2F2F2',
            },
            '&:active':{
                background: '#E6E6E6',
            }
        },
        editIcon: {
            display: 'inline-block',
            width: '4px',
            height: '16px',
            objectFit: 'contain',
        },
        closeCon: {
            marginTop: '4px',
            marginLeft: '4px',
            height: '32px',
            width: '32px',
            textAlign: 'center',
            lineHeight: '32px',
            cursor: 'pointer',
            borderRadius: '100%',
            background: '#fff',
            '&:hover':{
                background: '#F2F2F2',
            },
            '&:active':{
                background: '#E6E6E6',
            }
        },
        muteImgStyle: {
            width: '12px',
            marginLeft: '2px',
            height: '12px',
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
        dispatch(ThreadActions.setCurrentThreadInfo({}));
    }
    const threadName = useSelector((state) => state.thread?.currentThreadInfo?.name) || i18next.t('New thread');
    const threadId = useSelector((state) => state.thread?.currentThreadInfo?.id) || '';
    const threadOwner = useSelector(state => {
        return state.thread?.currentThreadInfo?.from || state.thread?.currentThreadInfo?.owner
    })
    const isCreatingThread = useSelector((state) => state.thread?.isCreatingThread) || false;
    const to = useSelector((state) => state.global.globalProps?.to);
    const hasThreadEditPanel = useSelector((state) => state.thread?.hasThreadEditPanel) || false;
    //打开thread编辑窗口
    const openEditPanel = (e) => {
        onEditThreadPanel(e, {
            groupId: to,//群组id
            threadId,//thread id
            threadName,//thread name
            threadOwner,//thread owner
        });
    }
    const globalProps = useSelector((state) => state.global?.globalProps)
    const { presenceExt } = globalProps
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}>
                <div className={classes.threadIconContainer}>
                    <img alt="" className={classes.threadIcon} src={threadIcon} />
                </div>
                {threadName}
                {
                    presenceExt && presenceExt[threadId]?.muteFlag ? <img className={classes.muteImgStyle} alt="" src={muteImg} /> : null
                }
            </Box>
            <Box position="static" className={classes.rightBar}>
                {!isCreatingThread && hasThreadEditPanel && <div
                    className={classes.editPanel}
                    onClick={(e) => openEditPanel(e)}
                ><img alt="" className={classes.editIcon} src={edit} /></div>}
                <div className={classes.closeCon} onClick={closeThreadPanel}>
                    <img alt="" className={classes.close} src={close} />
                </div>
            </Box>
        </div>
    );
};

export default ThreadBar;
