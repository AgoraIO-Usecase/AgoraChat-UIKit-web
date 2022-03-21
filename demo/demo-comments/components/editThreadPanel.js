import React, { useEffect, useState, } from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import MembersIcon from '../images/members.png'
import NotificationsIcon from '../images/Notifications.png'
import FullViewIcon from '../images/FullView.png'
import SplitViewIcon from '../images/SplitView.png'
import EditThreadIcon from '../images/EditThread.png'
import LeaveThreadIcon from '../images/LeaveThread.png'
import DisbandThreadIcon from '../images/DisbandThread.png'

const useStyles = makeStyles((theme) => {
    return {
        editPanel: {
            position: 'relative',
            height: '38px',
            width: '38px',
        },
        container: {
            position: 'absolute',
            right: '0',
            padding: '0 8px 8px',
            minHeight: "116px",
            width: '240px',
            borderRadius: '12px',
            background: '#fff',
            color: '#000',
            fontSize: '14px',
            boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
            boxSizing: 'border-box',
        },
        itemType: {
            display: 'flex',
            marginTop: '8px',
            width: '100%',
            height: '38px',
            lineHeight: '38px',
            '&:hover': {
                backgroundColor: '#F4F5F7'
            },
            cursor: 'pointer',
        },
        typeIcon: {
            display: 'block',
            marginTop: '4px',
            height: '30px',
            width: '30px',
        },
        typeText: {
            marginLeft: '8px',
            fontWeight: '500'
        }

    };
});

const editThreadPanel = (props) => {
    const classes = useStyles();
    const EDIT_THREAD_TYPES = {
        Members: {
            icon: MembersIcon,
            type: 'Members'
        },
        Notifications: {
            icon: NotificationsIcon,
            type: 'Notifications',
        },
        FullView: {
            icon: FullViewIcon,
            type: 'Full View',
        },
        SplitView: {
            icon: SplitViewIcon,
            type: 'SplitView',
        },
        EditThread: {
            icon: EditThreadIcon,
            type: 'Edit Thread',
        },
        LeaveThread: {
            icon: LeaveThreadIcon,
            type: 'Leave Thread',
        },
        DisbandThread: {
            icon: DisbandThreadIcon,
            type: 'Disband Thread',
        },
    }
    useEffect(() => {
        //获取用户角色-计算权限
    })
    //群管理员
    let editTypes = ['Members', 'Notifications', 'FullView', 'EditThread', 'LeaveThread', 'DisbandThread']

    const [showEditPanle, setShowEditPanel] = useState(false);
    const changeEditPanel = (states) => {
        setShowEditPanel(states)
    }
    const changepanelstates = (type) => {
        console.log("=====", type)
        changeEditPanel(false)
        switch (type) {
            case 'Members': {
                break;
            }
            case 'Notifications': {
                console.log('1')
                break;
            }
            case 'FullView': {
                console.log('1')
                break;
            }
            case 'EditThread': {
                console.log('1')
                break;
            }
            case 'LeaveThread': {
                console.log('1')
                break;
            }
            case 'DisbandThread': {
                console.log('1')
                break;
            }
            default:
                console.log("wrong type")
                break;
        }
    }
    return (
        <div className={classes.editPanel}>
            <IconButton
                className="iconfont icon-hanbaobao icon"
                style={{ height: '38px', width: '38px' }}
                onClick={(e) => changeEditPanel(true)}
            ></IconButton>
            <div className={classes.container} style={{ display: showEditPanle ? 'block' : 'none' }}>
                {editTypes.length && editTypes.map((itemType, index) => {
                    return (
                        <div className={classes.itemType} onClick={(e) => { changepanelstates(itemType) }} key={index}>
                            <img src={EDIT_THREAD_TYPES[itemType].icon} className={classes.typeIcon}></img>
                            <span className={classes.typeText} style={{ color: itemType === "DisbandThread" ? "#FF14CC" : '#000' }}>{EDIT_THREAD_TYPES[itemType].type}</span>
                        </div>
                    );
                })}
            </div>
        </div>


    );
}
export default editThreadPanel