import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "../../../EaseApp/index";
import { Box, Popover } from "@material-ui/core";
import ThreadActions from "../../../redux/thread";
import { getTimeDiff } from "../../../utils/index";
import close from '../../../common/images/threadClose.png'
import "./index.css"
import avatar from "../../../common/icons/avatar1.png";
import "../../../i18n";
import i18next from "i18next";
import { emoji } from "../../../common/emoji";
import _ from "lodash";
import AppDB from "../../../utils/AppDB";
import { message as Alert } from '../../../EaseChat/common/alert'

const ThreadListPanel = ({ anchorEl, onClose }) => {
    const dispatch = useDispatch();
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    const curGroupRole = useSelector((state) => state.thread?.curGroupRole) || '';
    const { chatType, to } = useSelector((state) => state.global.globalProps);

    const threadListDom = useRef(null);
    useEffect(() => {
        if (chatType === "groupChat" && anchorEl) {
            const dom = threadListDom.current;
            if (ReactDOM.findDOMNode(dom)) {
                dom.scrollTop = 0;
            }
            dispatch(ThreadActions.setThreadListEnd(false));
            let options = {
                groupId: to,
                limit: 20,
            }
            dispatch(ThreadActions.getThreadsListOfGroup(options))
        }
    }, [anchorEl])

    const renderMessage = (message) => {
        switch (message.type) {
            case 'txt':
                return renderTxt(message.msg)
            case 'file':
                return `[${i18next.t('File')}]`
            case 'img':
                return `[${i18next.t('Image')}]`
            case 'audio':
                return `[${i18next.t('Audio')}]`
            case 'video':
                return `[${i18next.t('Video')}]`
            default:
                return ''
        }
    }
    const renderTxt = (txt) => {
        if (txt === undefined) {
            return [];
        }
        let rnTxt = [];
        let match = null;
        const regex = /(\[.*?\])/g;
        let start = 0;
        let index = 0;
        while ((match = regex.exec(txt))) {
            index = match.index;
            if (index > start) {
                rnTxt.push(txt.substring(start, index));
            }
            if (match[1] in emoji.map) {
                const v = emoji.map[match[1]];
                rnTxt.push(
                    <img
                        key={v + Math.floor(Math.random() * 99 + 1)}
                        alt={v}
                        src={require(`../../../common/faces/${v}`).default}
                        width={20}
                        height={20}
                    />
                );
            } else {
                rnTxt.push(match[1]);
            }
            start = index + match[1].length;
        }
        rnTxt.push(txt.substring(start, txt.length));

        return rnTxt;
    };

    const [isPullingDown, setIsPullingDown] = useState(false);
    const handleScroll = (e) => {
        if (e.target.scrollHeight === (e.target.scrollTop + e.target.clientHeight)) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    setIsPullingDown(false);
                    if (chatType === "groupChat") {
                        let options = {
                            groupId: to,
                            limit: 20,
                            isScroll: true
                        }
                        dispatch(ThreadActions.getThreadsListOfGroup(options))
                    }
                }, 500);
            }
        }
    };
    const openThreadPanel = (option) => {
        if (curGroupRole === 'member') {
            changeCurrentThreadInfo(option)
        } else {
            WebIM.conn.joinChatThread({ chatThreadId: option.id }).then((res) => {
                changeCurrentThreadInfo(option)
            }).catch(e=>{
                if(e.type === 1301){
                    changeCurrentThreadInfo(option)
                }else if( e.type === 1300){
                    Alert.warn(i18next.t('The thread has been disbanded'));
                }
            })
        }
    }
    const changeCurrentThreadInfo = (option) => {
        dispatch(ThreadActions.setCurrentThreadInfo(option));
        //updatea setThreadOriginalMsg
        if(option.messageId){
            AppDB.findLocalMessage('groupChat', option.messageId).then((res) => {
                let msg = res.length === 1 ? res[0] : {};
                dispatch(ThreadActions.setThreadOriginalMsg(msg));
            })
        }
        //update the status of creatingThread
        dispatch(ThreadActions.setIsCreatingThread(false));
        //open threadPanel
        dispatch(ThreadActions.updateThreadStates(true));
        //close threadListPanel
        onClose();
    }
    //The list is empty
    const renderDefaultList = () => {
        if (threadList.length === 0) return (
            <Box className='tlp-default-tips'>
                <div className='tlp-tips1'><span className='tlp-tips1-img'></span>{i18next.t('There are no Threads')}</div>
                <div className='tlp-tips2'>{i18next.t('Create a Thread from a Group Chat Message')}</div>
            </Box>
        )
    }
    return (
        <Popover
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Box className='threadListPanel'>
                <div className='tlp-header'>
                    <span className='tlp-header-title'>{i18next.t('Threads List')}</span>
                    <div className="tlp-header-icon" onClick={onClose}>
                        <img className="tlp-header-icon-close" alt="closeIcon" src={close} />
                    </div>
                </div>
                <ul className='tlp-list' ref={threadListDom} onScroll={handleScroll}>
                    {renderDefaultList()}
                    {threadList.length > 0 && threadList.map((option, index) => {
                        return (
                            <li className='tlp-item' key={index} onClick={(e) => openThreadPanel(option)}>
                                <Box className="tpl-item-con">
                                    <div className="tpl-item-name">{option.name}</div>
                                    <Box className="tpl-item-bottom">
                                        <img
                                            className='tlp-avatar'
                                            alt="Remy Sharp"
                                            src={avatar}
                                        />
                                        <span className="tpl-item-owner">{option.owner}</span>
                                        <span className="tpl-item-msg">{renderMessage(option.lastMessage)}</span>
                                        <span className="tpl-item-time">{getTimeDiff(option.lastMessage?.time)}</span>
                                    </Box>
                                </Box>
                            </li>
                        );
                    })}
                </ul>
            </Box>
        </Popover>
    );
};

export default ThreadListPanel;
