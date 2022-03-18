import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "../../../EaseApp/index";
import {
    Box,
    IconButton,
} from "@material-ui/core";
import ThreadActions from "../../../redux/thread";
import { getTimeDiff } from "../../../utils/index";
import threadSearch from '../../../common/images/search.png'
import close from '../../../common/images/threadClose.png'
import "./index.css"
import SearchBox from '../components/searchBox'

const ThreadListPanel = () => {
    const dispatch = useDispatch();
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    let [displayThreadList, changeDisplayThreadList] = useState([]);
    useEffect(() => {
        changeDisplayThreadList(threadList.concat());
    }, [threadList])
    const showThreadList = useSelector((state) => state.thread?.showThreadList) || false;
    const { chatType, to } = useSelector((state) => state.global.globalProps);
    const closeThreadList = () => {
        dispatch(ThreadActions.setShowThreadList(false));
    }
    useEffect(() => {
        if (chatType === "groupChat") {
            dispatch(ThreadActions.getThreadsListOfGroup(to))
        }
    }, [to])
    const [showSearchBar, setSearchBarState] = useState(false);

    const changeSearchBarState = (state) => {
        setSearchBarState(state);
    }
    const searchThread = (searchValue) => {
        let list = threadList.concat();
        list = list.filter((item) => {
            return item.name.indexOf(searchValue) > -1
        })
        changeDisplayThreadList(list.concat());
    }
    const clearInput = (e) => {
        setSearchValue('');
    }
    //The list is empty
    const renderDefaultList = () => {
        if (threadList.length === 0) return (
            <Box className='tlp-default-tips'>
                <div className='tlp-tips1'>There are no Threads</div>
                <div className='tlp-tips2'>Create a Thread from a Group Chat Message</div>
            </Box>
        )
        if (displayThreadList.length === 0) {
            return (<Box className='tlp-default-tips'>No Result</Box>)
        }
    }
    const renderMessage = (body) => {
        if(!body) return ''
        switch (body.type) {
            case 'txt':
                return renderTxt(body.msg)
            case 'file':
                return '[文件]'
            case 'img':
                return '[图片]'
            case 'audio':
                return '[音频]'
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
                        key={v}
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

    return (
        <Box className='threadListPanel' style={{ display: showThreadList == 1 ? 'block' : 'none' }}>
            <div className='tlp-header'>
                <span className='tlp-header-title'>Threads List ({threadList.length})</span>
                <Box style={{ lineHeight: '60px', display: showSearchBar == 1 ? 'none' : 'flex' }}>
                    <div className="tlp-header-icon">
                        <img className="tlp-header-icon-search" alt="" src={threadSearch} onClick={(e) => changeSearchBarState(true)} />
                    </div>
                    <div className="tlp-header-icon" onClick={closeThreadList}>
                        <img className="tlp-header-icon-close" alt="" src={close} />
                    </div>
                </Box>
                <Box style={{ marginTop: '12px', display: showSearchBar == 1 ? 'flex' : 'none' }}>
                    <SearchBox changeSearchBarState={changeSearchBarState} searchThread={searchThread}/>
                </Box>
            </div>
            <ul className='tlp-list'>
                {renderDefaultList()}
                {displayThreadList.length > 0 && displayThreadList.map((option, index) => {
                    return (
                        <li className='tlp-item' key={option.id}>
                            <Box sx={{ padding: '8px 16px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                                <div className="tpl-item-name">{option.name}</div>
                                <Box style={{ display: 'flex', }}>
                                    <img
                                        className='tlp-avatar'
                                        alt="Remy Sharp"
                                        src="https://aip.bdstatic.com/portal-pc-node/dist/1645513367427/images/technology/imageprocess/dehaze/5.jpg"
                                    />
                                    <span className="tpl-item-owner">{option.owner}</span>
                                    <span className="tpl-item-msg">{renderMessage(option.lastMessage?.body)}</span>
                                    <span className="tpl-item-time">{getTimeDiff(option.lastMessage?.time)}</span>
                                </Box>
                            </Box>
                        </li>
                    );
                })}
            </ul>
        </Box>
    );
};

export default ThreadListPanel;
