

import React, {memo, useContext ,useState} from "react";
import { Menu ,MenuItem } from '@mui/material';
import { makeStyles } from "@material-ui/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Box from "@material-ui/core/Box";
import {IconButton} from "@material-ui/core"
import Typography from "@material-ui/core/Typography";
import { renderTime } from "../../utils/index";
import {EaseAppContext} from '../../EaseApp/index'
import { useSelector, useDispatch } from "../../EaseApp/index";

import MessageActions from "../../redux/message";
import SessionActions from "../../redux/session";
import GlobalPropsActions from "../../redux/globalProps"

import i18next from "i18next";
const useStyles = makeStyles((theme) => ({
      paper:{
        margin:'5px',
        paddingRight:'20px',
        borderRadius:'20px',
        display:'flex'
      },
      moreVertStyle:{
        width:'15px',
        height:'15px',
        backgroundColor:'#f0f2f4',
        boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
        '&:hover':{
          backgroundColor:'#ffffff'
        }
      },
      listItem: {
        padding: "0 14px",
        borderRadius:'20px',
        '& .Mui-selected':{
          backgroundColor: 'rgba(255, 255, 255, 1) !important'
        }
      },
      itemBox: {
        display: "flex",
        flex: 1,
        height: "100%",
        alignItems: "center",
        boxSizing: "border-box",
        padding:'5px 0'
      },
      itemRightBox: {
        flex: 1,
      },
      itemName: {
        fontSize: "16px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      itemMsgBox: {
        position: "relative",
        height: "20px",
        display: "flex",
        alignItems: "center",
      },
      time: {
        display: "inline-block",
        height: "17px",
        fontSize: "12px",
        color: "rgba(1, 1, 1, .6)",
        marginRight: "2px",
      },
      itemMsg: {
        display: "inline-block",
        height: "20px",
        overflow: "hidden",
        color: "rgba(1, 1, 1, .6)",
        width: "calc(100% - 18px)",
        fontSize: "14px",
        wordBreak: 'break-all'
      },
      unreadNum: {
        color: "#fff",
        background: "rgba(245, 12, 205, 1)",
        display: "inline-block",
        height: "16px",
        borderRadius: "8px",
        fontSize: "10px",
        minWidth: "16px",
        textAlign: "center",
        position: "absolute",
        right: "0",
      },
}));

function SessionItem(props) {
    let easeAppProps = useContext(EaseAppContext)
    const {isShowUnread,unreadType} = easeAppProps
    const {currentVal,handleListItemClick,deleteSessionClick} = props
    const {session,index,currentSessionIndex,avatarSrc} = currentVal
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isShowMoreVertStyle,setIsShowMoreVertStyle] = useState(false)
    const [sessionEl, setSessionEl] = useState(null);
    const menuList = [{name: i18next.t('Delete Session'),key:'0',value:'deleteSession'}]
    const onClickMenuItem = (option,_session) => (e) =>{
      const {value} = option
        e.preventDefault()
        e.stopPropagation()
        switch (value) {
          case 'deleteSession':
            deleteSessionClick(_session)
            dispatch(MessageActions.clearMessage(_session.sessionType, _session.sessionId));
            dispatch(SessionActions.deleteSession(_session.sessionId));

            index === currentSessionIndex && dispatch(GlobalPropsActions.setGlobalProps({to:null}))
            setSessionEl(null)
            break;

          default:
            break;
        }
        
   
    }
    const showMoreVert = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        setSessionEl(e.currentTarget)
    }
    const closeSession = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        setSessionEl(null)
    }
    const renderMenu = (_session) => {
        return (
          <Menu
            id="simple-menu"
            anchorEl={sessionEl}
            keepMounted
            open={Boolean(sessionEl)}
            onClose={(e) => closeSession(e)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {menuList && menuList.map((option, index) => {
              return (
                <MenuItem onClick={onClickMenuItem(option,_session)} key={index}>
                  <Typography variant="inherit" noWrap>
                    {i18next.t(option.name)}
                  </Typography>
                </MenuItem>
              );
            })}
          </Menu>
        );
      };

    return (
        <ListItem
        key={session.sessionId}
        selected={currentSessionIndex === index}
        onClick={(event) => handleListItemClick(event, index, session)}
        className={classes.listItem}
        button
        onMouseOver={()=>setIsShowMoreVertStyle(true)} 
        onMouseLeave={()=>{setIsShowMoreVertStyle(false);setSessionEl(null)}}
      >
        <Box className={classes.itemBox}>
          <ListItemAvatar>
            <Avatar
              style={{ borderRadius: `${session.sessionType}` === "singleChat" ? "50%" : 'inherit'}}
              alt={`${session.name || session.sessionId}`}
              src={avatarSrc}
            />
          </ListItemAvatar>
          <Box className={classes.itemRightBox}>
            <Typography className={classes.itemName}>
              <span>{session.name || session.sessionId}</span>
              <span className={classes.time}>
                {renderTime(session?.lastMessage?.time)}
              </span>
            </Typography>

            <Typography className={classes.itemMsgBox}>
              <span className={classes.itemMsg}>
                {session?.lastMessage?.body?.msg}
              </span>

              {isShowUnread &&
                <span
                className={classes.unreadNum}
                style={{
                  display: session.unreadNum ? "inline-block" : "none",
                }}
              >
                {unreadType ?session.unreadNum:null}
              </span>
              }
              {isShowMoreVertStyle && <IconButton className={classes.moreVertStyle} onClick={(e) => showMoreVert(e)}>
                <MoreVertIcon fontSize="small"/>
              </IconButton>}
              {renderMenu(session)}
            </Typography>
          </Box>
        </Box>
      </ListItem>
    )
}

export default memo(SessionItem);