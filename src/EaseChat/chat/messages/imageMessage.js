import React, { memo, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { renderTime } from "../../../utils";
import { EaseChatContext } from "../index";
import Reaction from "../reaction";
import RenderReactions from "../reaction/renderReaction";
import threadIcon from "../../../common/images/thread.png"
import MsgThreadInfo from "./msgThreadInfo"

import MessageStatus from "./messageStatus";
import offlineImg from '../../../common/images/Offline.png'
import onlineIcon from '../../../common/images/Online.png'
const useStyles = makeStyles((theme) => ({
	pulldownListItem: {
		padding: "10px 0",
		listStyle: "none",
		marginBottom: "26px",
		position: "relative",
		display: "flex",
		flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
		alignItems: "center",
	},
	userName: {
		padding: "0 10px 4px",
		color: "#8797A4",
		fontSize: "14px",
		display: (props) =>
			props.chatType !== "singleChat" && !props.bySelf
				? "inline-block"
				: "none",
		textAlign: (props) => (props.bySelf ? "right" : "left"),
	},
	textBodyBox: {
		display: "flex",
		flexDirection: (props) => (props.bySelf ? "inherit" : "column"),
		maxWidth: "80%",
		maxWidth: "40%",
		marginLeft: "10px",
		alignItems: (props) => (props.bySelf ? "inherit" : "unset"),
		background: (props) => (props.showThreaddInfo ? "#f2f2f2": ''),
		padding: (props) => (props.showThreaddInfo ? "12px": '0'),
		borderRadius: (props) =>
				props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
		position: 'relative',
	},
	imgBox: {
		"& img": {
			maxWidth: "100%",
			borderRadius: (props) => props.showThreaddInfo&&props.bySelf ? "8px 8px 4px 8px" : props.showThreaddInfo&& !props.bySelf ? "8px 8px 8px 4px" : props.bySelf?"16px 16px 4px 16px" : "16px 16px 16px 4px",
		},
		position: "relative",
		
	},
	time: {
		position: "absolute",
		fontSize: "11px",
		height: "16px",
		color: "rgba(1, 1, 1, .2)",
		lineHeight: "16px",
		textAlign: "center",
		top: "-18px",
		width: "100%",
	},
	textReaction: {
		position: "absolute",
		right: (props) => (!props.bySelf&&props.showThreaddInfo? "-12px": !props.showThreaddInfo&&!props.bySelf ? "0":""),
		bottom: "-10px",
		transform: (props) => (props.bySelf ? "translateX(-100%)":"translateX(100%)"),
		marginLeft: (props) => (props.bySelf ? "-15px" : ""),
		height: '24px',
	},
	textReactionCon: {
		width: '100%',
		height: '100%',
		float: (props) => (props.bySelf? 'right':'left'),
	},
	reactionBox: {
		position: "absolute",
		top: (props) => (props.bySelf ? "-15px" : "-10px"),
		right: (props) => (props.bySelf ? "0px" : ""),
		left: (props) => (props.bySelf ? "" : "0px"),
		background: "#F2F2F2",
		borderRadius: "17.5px",
		padding: "3px",
		border: "solid 2px #FFFFFF",
		boxShadow: "0 10px 10px 0 rgb(0 0 0 / 30%)",
	},
	threadCon: {
		float: (props) => (props.bySelf? 'left':'right'),
		height: '24px',
		width: '24px',
		borderRadius: '50%',
		'&:hover':{
		  background: '#E6E6E6',
		}
	  },
	thread: {
		marginTop: '5px',
		marginLeft: '4px',
		width: '16px',
		height: '15px',
		background: `url(${threadIcon}) center center no-repeat`,
		backgroundSize: 'contain',
		cursor: 'pointer',
	},
	onLineImg: {
    width: '15px',
    height: '15px',
		position: 'absolute',
    zIndex: 1,
		top: '16px',
    left: '5px',
  }
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function ImgMessage({ message, onRecallMessage, showByselfAvatar, onCreateThread, isThreadPanel,showThread  }) {
	let easeChatProps = useContext(EaseChatContext);
	const {
    onAvatarChange,
    isShowReaction,
    customMessageClick,
    customMessageList,
  } = easeChatProps;

	const showThreadEntry = showThread && !message.chatThreadOverview && !isThreadPanel && message.chatType === 'groupChat';
	const showThreaddInfo = showThread && (!isThreadPanel) && message.chatType ==="groupChat" && message.chatThreadOverview&& (JSON.stringify(message.chatThreadOverview)!=='{}')
	const classes = useStyles({ bySelf: message.bySelf,showThreaddInfo:showThreaddInfo});
	const [state, setState] = useState(initialState);
	const [hoverDeviceModule, setHoverDeviceModule] = useState(false);
	const reactionMsg = message?.reactions || [];
	
	const handleClose = () => {
		setState(initialState);
	};
	const recallMessage = () => {
		onRecallMessage(message);
		handleClose();
	};
	const handleClick = (event) => {
		event.preventDefault();
		setState({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	};
  	const _customMessageClick = (val, option) => (e) => {
    customMessageClick && customMessageClick(e, val, option);
    handleClose();
  	};

  	const createThread = ()=>{
	onCreateThread(message)
 	}

	 const sentStatus = () => {
		return (
		  <div>
			{message.bySelf && !isThreadPanel && (
			  <MessageStatus
				status={message.status}
				style={{
				  marginRight: "-30px",
				  marginTop: message.chatType === "singleChat" ? "0" : "22px",
				}}
			  />
			)}
		  </div>
		);
	  };
		let onLineImg = ''
		if (message.body.onlineState === 1) {
			onLineImg = onlineIcon
		} else if (message.body.onlineState === 0) {
			onLineImg = offlineImg
		}
	return (
		<li
			className={classes.pulldownListItem}
			onMouseOver={() => setHoverDeviceModule(true)}
			onMouseLeave={() => setHoverDeviceModule(false)}
		>
			{!message.bySelf && (
				<Avatar
					src={avatar}
					onClick={(e) =>
						onAvatarChange && onAvatarChange(e, message)
					}
				></Avatar>
			)}
			{showByselfAvatar && message.bySelf && (
				<Avatar src={avatar}></Avatar>
			)}
			<div className={classes.textBodyBox}>
				{
          !message.bySelf && (
            onLineImg && <img className={classes.onLineImg} alt="" src={onLineImg} />
          )
        }
				<span className={classes.userName}>{message.from}</span>
				<div className={classes.imgBox} onContextMenu={handleClick}>
					<img src={message.url} alt="img message"></img>
					<div className={classes.textReaction}>
						{hoverDeviceModule ? (
							<div className={classes.textReactionCon}>
								{!isThreadPanel && isShowReaction && (
									<Reaction message={message}/>
								)}
							{showThreadEntry && <div className={classes.threadCon} onClick={createThread} title="Reply">
							  <div className={classes.thread}></div></div>}
               				</div>
						) : (
							sentStatus()
						)}
					</div>
					{showThreaddInfo ? <MsgThreadInfo message={message} />: null}
					{reactionMsg.length > 0 && (
						<div className={classes.reactionBox}>
							<RenderReactions message={message} />
						</div>
					)}
				</div>
			</div>

      <div className={classes.time}>{renderTime(message.time)}</div>
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
        {message.bySelf && (
          <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>
        )}
        {customMessageList &&
          customMessageList.map((val, key) => {
            const bySelf = message.bySelf;
            let show = false
            if(val.position === 'others'){}
            switch(val.position){
              case 'others':
                show = bySelf ? false : true
                break;
              case 'self':
                show = bySelf ? true : false
                break;
              default:
                show = true
                break;
            }
            return show ?(
              <MenuItem key={key} onClick={_customMessageClick(val, message)}>
                {val.name}
              </MenuItem>
            ): null;
          })}
      </Menu>
    </li>
  );
}

export default memo(ImgMessage);
