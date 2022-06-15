import React, { memo, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import avatar from "../../../common/icons/avatar1.png";
// import clsx from 'clsx';
import i18next from "i18next";
import { IconButton, Icon, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { renderTime, sessionItemTime } from "../../../utils";
import { EaseChatContext } from "../index";

import Reaction from "../reaction";
import RenderReactions from "../reaction/renderReaction";
import threadIcon from "../../../common/images/thread.png"
import MsgThreadInfo from "./msgThreadInfo"

import MessageStatus from "./messageStatus";
import ico_file from "../../../common/images/ico_file.svg";
import { userAvatar } from '../../../utils'

const useStyles = makeStyles((theme) => ({
	pulldownListItem: {
		padding: "10px 0",
		listStyle: "none",
		marginBottom: "26px",
		position: "relative",
		display: "flex",
		flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
		alignItems: "flex-end",
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
		// flexDirection: (props) => (props.bySelf ? "inherit" : "column"),
		flexDirection: 'column',
		maxWidth: "80%",
		minWidth: "40%",
		alignItems: (props) => (props.bySelf ? "flex-start" : "unset"),
		position: "relative",
		background: '#f2f2f2',
		padding:  (props) => props.showThreadEntry? '0':'12px',
		marginLeft:'12px',
		padding: '0',
		borderRadius: (props) =>
			props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
	},
	fileCard: {
		width: (props) => props.bySelf ? "252px" : '',
		height: (props) => props.bySelf ? "72px" : '',
		marginTop: (props) => (!props.bySelf && props.rnReactions ? "15px" : "0"),
		// backgroundColor: "#fff",
		display: "flex",
		alignItems: "center",
		justifyContent: (props) => props.bySelf ? '' : 'space-between',
		flexDirection: (props) => props.bySelf ? '' : 'row-reverse',
		// marginBottom: "6px",
		padding: props => props.bySelf ? '' : '8px',
	},
	fileIcon: {
		width: "50px",
		height: "50px",
		background: "#fff",
		borderRadius: "12px",
		border: "1px solid rgba(35, 195, 129, 0.06)",
		textAlign: "center",
		lineHeight: "47px",
		margin: "0 7px 0 7px",
		marginRight: (props) => props.bySelf ? '7px' : '0px',
		flexShrink: 0,
		'& img': {
			transform: 'rotateX(180deg)',
			width: '40px',
			verticalAlign: 'middle',
		}
	},
	fileInfo: {
		"& p": {
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			width: "126px",
			margin: "0",
		},
		"& span": {
			fontSize: "12px",
			color: "#010101",
			lineHeight: "16px",
		},
	},
	icon: {
		color: "rgba(35, 195, 129, 1)",
		fontWeight: "bold",
		fontSize: "38px",
	},
	download: {
		fontSize: "16px",
		color: "rgba(0,0,0,.6)",
		fontWeight: "bold",
		cursor: "pointer",
	},
	time: {
		position: "absolute",
		fontSize: "11px",
		height: "16px",
		color: "rgba(1, 1, 1, .2)",
		lineHeight: "20px",
		textAlign: "center",
		top: "-18px",
		width: "100%",
	},
	avatarStyle: {
		height: "28px",
		width: "28px",
		borderRadius: "50%",
	},
	textReaction: {
		position: "absolute",
		right: (props) => (props.bySelf ? "" : "0"),
		left: (props) => (props.bySelf ? "0" : ""),
		bottom: "6px",
		transform: (props) => (props.bySelf ? "translateX(-100%)" : "translateX(100%)"),
		height: '24px',
		left: '0px',
	},
	textReactionCon: {
		width: (props) => (props.showThreadEntry ? "48px" : "24px"),
		height: '100%',
		float: (props) => (props.bySelf ? 'right' : 'left'),
	},
	reactionBox: {
		position: "absolute",
		top: (props) => (props.bySelf ? "-15px" : "33px"),
		right: (props) => (props.bySelf ? "0px" : ""),
		left: (props) => (props.bySelf ? "" : "5px"),
		background: "#F2F2F2",
		borderRadius: "17.5px",
		padding: "3px",
		border: "solid 3px #FFFFFF",
		boxShadow: "0 10px 10px 0 rgb(0 0 0 / 30%)",
	},
	threadCon: {
		float: (props) => (props.bySelf ? 'left' : 'right'),
		height: '24px',
		width: '24px',
		borderRadius: '50%',
		'&:hover': {
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
	tooltipthread: {
		background: '#fff',
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -2px 0px 8px rgba(0, 0, 0, 0.08)',
	}
}));
const initialState = {
	mouseX: null,
	mouseY: null,
};
function FileMessage({ message, onRecallMessage, showByselfAvatar, onCreateThread, isThreadPanel, showThread }) {
	let easeChatProps = useContext(EaseChatContext);
	const { onAvatarChange,
		isShowReaction,
		customMessageClick,
		customMessageList, } = easeChatProps;
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

	const createThread = () => {
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

	const showThreadEntry = showThread && !message.chatThreadOverview && !isThreadPanel && message.chatType === 'groupChat';
	const showThreaddInfo = showThread && (!isThreadPanel) && message.chatType === "groupChat" && message.chatThreadOverview && (JSON.stringify(message.chatThreadOverview) !== '{}')
	const classes = useStyles({ bySelf: message.bySelf ,showThreadEntry,rnReactions: reactionMsg.length > 0,});


	return (
		<li
			className={classes.pulldownListItem}
			onMouseOver={() => setHoverDeviceModule(true)}
			onMouseLeave={() => setHoverDeviceModule(false)}
		>
			{!message.bySelf && (
				<img
					className={classes.avatarStyle}
					src={userAvatar(message.from)}
					onClick={(e) =>
						onAvatarChange && onAvatarChange(e, message)
					}
				></img>
			)}
			{showByselfAvatar && message.bySelf && (
				<img className={classes.avatarStyle} src={userAvatar(message.from)}></img>
			)}
			<div className={classes.textBodyBox}>
				<span className={classes.userName}>{message.from}</span>
				<div className={classes.fileCard} onContextMenu={handleClick}>
					<div className={classes.fileIcon}>
						<img src={ico_file} alt="file" />
					</div>
					<div className={classes.fileInfo}>
						<p>{message.filename}</p>
						<span>
							{Math.floor(message.body.size / 1024) + "kb"}
						</span>
					</div>
					{/* <div className={classes.download}>
						<a href={message.body.url} download={message.filename}>
							<IconButton className="iconfont icon-xiazai"></IconButton>
						</a>
					</div> */}
				</div>
				<div className={classes.textReaction}>
					{hoverDeviceModule ? (
						<div className={classes.textReactionCon}>
							{isShowReaction && (
								<Reaction message={message} />
							)}
							{
								showThreadEntry &&
								<div className={classes.threadCon} onClick={createThread}>
									<Tooltip title='Create Thread' placement="top" classes={{ tooltip: classes.tooltipthread }}>
										<div className={classes.thread}></div>
									</Tooltip>
								</div>
							}
						</div>
					) : (
						sentStatus()
					)}
				</div>
				{showThreaddInfo ? <MsgThreadInfo message={message} /> : null}
				{reactionMsg.length > 0 && (
					<div className={classes.reactionBox}>
						<RenderReactions message={message} />
					</div>
				)}
			</div>

			<div className={classes.time}>{sessionItemTime(message.time)}</div>
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
					<MenuItem onClick={recallMessage}>{i18next.t("Withdraw")}</MenuItem>
				)}
				{customMessageList &&
					customMessageList.map((val, key) => {
						const bySelf = message.bySelf;
						let show = false
						if (val.position === 'others') { }
						switch (val.position) {
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
						return show ? (
							<MenuItem key={key} onClick={_customMessageClick(val, message)}>
								{val.name}
							</MenuItem>
						) : null;
					})}
			</Menu>
		</li>
	);
}

export default memo(FileMessage);
