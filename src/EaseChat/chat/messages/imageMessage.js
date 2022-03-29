import React, { memo, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { renderTime } from "../../../utils";
import { EaseChatContext } from "../index";
import Reaction from "../reaction";
import RenderReactions from "../reaction/renderReaction";
import ReactionInfo from "../reaction/reactionInfo";
import threadIcon from "../../../common/images/thread.png"

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
		maxWidth: "65%",
		alignItems: (props) => (props.bySelf ? "inherit" : "unset"),
	},
	imgBox: {
		marginLeft: "10px",
		maxWidth: "50%",
		"& img": {
			maxWidth: "100%",
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
		right: (props) => (props.bySelf ? "" : "-55px"),
		bottom: "-5px",
		left: (props) => (props.bySelf ? "-52px" : ""),
		marginRight: "5px",
		width: '52px',
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
	}
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function ImgMessage({ message, onRecallMessage, showByselfAvatar, onCreateThread, isThreadPanel  }) {
	let easeChatProps = useContext(EaseChatContext);
	const {
    onAvatarChange,
    isShowReaction,
    customMessageClick,
    customMessageList,
  } = easeChatProps;
	const classes = useStyles({ bySelf: message.bySelf });
	const [state, setState] = useState(initialState);
	const [hoverDeviceModule, setHoverDeviceModule] = useState(false);
	const [reactionInfoVisible, setReactionInfoVisible] = useState(null);
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

  const handleReaction = (e) => {
    setReactionInfoVisible(e.currentTarget);
  };

	const createThread = ()=>{
		onCreateThread(message)
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
				<span className={classes.userName}>{message.from}</span>
				<div className={classes.imgBox} onContextMenu={handleClick}>
					<img src={message.url} alt="img message"></img>
					<div className={classes.textReaction}>
						{hoverDeviceModule ? (
							// <div>
							// 	{isShowReaction && (
							// 		<Reaction message={message} />
							// 	)}
							// </div>
							<div className={classes.textReactionCon}>
								{isShowReaction && (
									<Reaction message={message}/>
								)}
							{!message.thread && !isThreadPanel && message.chatType === 'groupChat'&& <div className={classes.threadCon} onClick={createThread}>
							  <div className={classes.thread}></div></div>}
               				</div>
						) : (
							<></>
						)}
					</div>
					{reactionMsg.length > 0 && (
						<div
							className={classes.reactionBox}
							onClick={handleReaction}
						>
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
            return (
              <MenuItem key={key} onClick={_customMessageClick(val, message)}>
                {val.name}
              </MenuItem>
            );
          })}
      </Menu>

      <ReactionInfo
        anchorEl={reactionInfoVisible}
        onClose={() => setReactionInfoVisible(null)}
        message={message}
      />
    </li>
  );
}

export default memo(ImgMessage);
