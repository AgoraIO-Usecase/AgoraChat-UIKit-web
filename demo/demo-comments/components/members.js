import React, { useState, } from "react";
import { makeStyles } from "@material-ui/styles";
import "./member.css"
import SearchBox from './searchBox'
import { Box } from "@material-ui/core";
import threadSearch from '../images/search.png'
import close from '../images/close.png'

const useStyles = makeStyles((theme) => {
    return {
        container: {
            position: 'fixed',
            top: '0',
            right: '20px',
            width: '540px',
            background: '#EDEFF2',
            borderRadius: '0 12px 12px 0',
            boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
            zIndex: '100',
            minHeight: '416px',
            maxHeight: '770px'
        },
        membersCon: {},

    };
});

const members = (props) => {
    const classes = useStyles();
    const [showSearchBar, setSearchBarState] = useState(false);
    const changeSearchBarState = (state) => {
        setSearchBarState(state);
    }
    const searchMember = (value) => {
        console.log('====', value)
    }
    const closeThreadList = () => {
        // dispatch(ThreadActions.setShowThreadList(false));
        console.log("888")
    }
    const [list, setList] = useState([
        { nikeName: 'test000', role: 'GroupOwner' },
        { nikeName: 'test111', role: 'Admin' },
        { nikeName: 'test222', role: 'Admin' },
        { nikeName: 'test333', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
        { nikeName: 'test444', role: 'member' },
    ])
    return (
        <div className={classes.container}>
            <div className='tlp-header'>
                <span className='tlp-header-title'>members List ({88})</span>
                <Box style={{ lineHeight: '60px', display: showSearchBar == 1 ? 'none' : 'flex' }}>
                    <div className="tlp-header-icon">
                        <img className="tlp-header-icon-search" alt="" src={threadSearch} onClick={(e) => changeSearchBarState(true)} />
                    </div>
                    <div className="tlp-header-icon" onClick={closeThreadList}>
                        <img className="tlp-header-icon-close" alt="" src={close} />
                    </div>
                </Box>
                <Box style={{ marginTop: '12px', display: showSearchBar == 1 ? 'flex' : 'none' }}>
                    <SearchBox changeSearchBarState={changeSearchBarState} searchMember={searchMember} />
                </Box>
            </div>
            <div className="list-con">
                {list.length > 0 && list.map((item, index) => {
                    return (
                        <div className="list-item">
                            <div className="user-info">
                                <img className="avatar" src="https://aip.bdstatic.com/portal-pc-node/dist/1645513367427/images/technology/imageprocess/dehaze/5.jpg"></img>
                                <span className="username">{item.nikeName}</span>
                            </div>
                            <div className="user-role">
                                {item.role !== 'member' && <span className="role">{item.role}</span>}
                                {item.role !== 'GroupOwner' &&
                                    <div className="edit-con">
                                        <span className="edit"></span>
                                        <div className="remove-con">
                                            <div className="remove">
                                                <span className="remove-icon"></span>
                                                <span className="remove-text">Remove</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                        </div>
                    )
                })}

            </div>
        </div>


    );
}
export default members