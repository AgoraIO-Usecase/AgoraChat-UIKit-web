import React, { memo, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { Menu, MenuItem } from "@material-ui/core";
import avatar from "../../../common/icons/avatar1.png";
import { emoji } from "../../../common/emoji";
import { renderTime } from "../../../utils";

import MessageStatus from "./messageStatus";
import MsgThreadInfo from "./msgThreadInfo"
import { CopyToClipboard } from "react-copy-to-clipboard";

import Reaction from "../reaction";
import RenderReactions from "../reaction/renderReaction";
import { EaseChatContext } from "../index";
import threadIcon from "../../../common/images/thread.png"
import offlineImg from '../../../common/images/Offline.png'
import onlineIcon from '../../../common/images/Online.png'

const useStyles = makeStyles((theme) => ({
	pulldownListItem: {
		display: "flex",
		padding: "10px 0",
		listStyle: "none",
		marginBottom: "26px",
		position: "relative",
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
		minWidth: "40%",
		maxWidth: "75%",
		alignItems: (props) => (props.bySelf ? "inherit" : "unset"),
		position: 'relative',
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
	read: {
		fontSize: "10px",
		color: "rgba(0,0,0,.15)",
		margin: "3px",
	},
	avatarStyle: {
		height: "40px",
		width: "40px",
		borderRadius: "50%",
	},
	textBody: {
		margin: (props) => (props.bySelf ? "0 10px 10px 0" : props.rnReactions? "15px 0 10px 10px": "0 0 10px 10px"),
		lineHeight: "22px",
		fontSize: "14px",
		background: (props) =>
			props.bySelf
				? "linear-gradient(124deg, #c913df 20%,#154DFE 90%)"
				: "#F2F2F2",
		color: (props) => (props.bySelf ? "#fff" : "#000"),
		border: "1px solid #fff",
		borderRadius: (props) =>
			props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
		padding: "12px",
		width: "100%",
		maxWidth: "100%",
		// maxWidth: "80%",
		// minWidth: "40%",
		wordBreak: "break-all",
		textAlign: "initial",
		position: "relative",
		boxSizing: "border-box",
	},
	textReaction: {
		position: "absolute",
		right: (props) => (props.bySelf ? "" : "0"),
		bottom: "-10px",
		transform: (props) => (props.bySelf ? "translateX(-100%)" : "translateX(100%)"),
		marginLeft: (props) => (props.bySelf ? "-15px" : ""),
		height: '24px',
	},
	textReactionCon: {
		width: '100%',
		height: '100%',
		float: (props) => (props.bySelf ? 'right' : 'left'),
	},
	reactionBox: {
		position: "absolute",
		top: (props) => (props.bySelf ? "-15px" : "-18px"),
		right: (props) => (props.bySelf ? "0px" : ""),
		left: (props) => (props.bySelf ? "" : "0px"),
		background: "#F2F2F2",
		borderRadius: "17.5px",
		padding: (props) => (props.rnReactions ? "4px 8px" : "4px"),
		border: "solid 2px #FFFFFF",
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
	onLineImg: {
    width: '15px',
    height: '15px',
		position: 'absolute',
    zIndex: 1,
		top: (props) => (props.chatType === "singleChat" ? "0px" : "20px"),
    left: (props) => (props.chatType === "singleChat" ? "6px" : "7px"),
  }
}))
const initialState = {
	mouseX: null,
	mouseY: null,
};

function TextMessage({ message, onRecallMessage, showByselfAvatar, onCreateThread, isThreadPanel, showThread }) {
	let easeChatProps = useContext(EaseChatContext);
	const { onAvatarChange, isShowReaction, customMessageClick, customMessageList } = easeChatProps;
	const [hoverDeviceModule, setHoverDeviceModule] = useState(false);
	const reactionMsg = message?.reactions || [];
	const showThreadEntry = showThread && !message.chatThreadOverview && !isThreadPanel && message.chatType === 'groupChat';
	const showThreaddInfo = showThread && (!isThreadPanel) && message.chatType === "groupChat" && message.chatThreadOverview && (JSON.stringify(message.chatThreadOverview) !== '{}')
	const classes = useStyles({
		bySelf: message.bySelf,
		chatType: message.chatType,
		rnReactions: reactionMsg.length > 0,
	});
	const [menuState, setMenuState] = useState(initialState);
	const [copyMsgVal, setCopyMsgVal] = useState('')

	useEffect(() => {
		setCopyMsgVal(message.msg);
	}, [copyMsgVal]);

	const handleClick = (event) => {
		event.preventDefault();
		setMenuState({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	};
	const handleClose = () => {
		setMenuState(initialState);
	};
	const recallMessage = () => {
		onRecallMessage(message);
		handleClose();
	};
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
						style={{verticalAlign:'middle'}}
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

	const sentStatus = () => {
		return (
			<div>
				{message.bySelf && !isThreadPanel && (
					<MessageStatus
						status={message.status}
						style={{
							marginRight: '-30px',
							marginTop:
								message.chatType === "singleChat"
									? "0"
									: "22px",
						}}
					/>
				)}
			</div>
		);
	};

	const createThread = () => {
		onCreateThread(message)
	}
	const changeCopyVal = () => {
		setCopyMsgVal(message.msg);
		handleClose();
	};
	const _customMessageClick = (val, option) => (e) => {
		customMessageClick && customMessageClick(e, val, option);
		handleClose();
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
			<div>
				{!message.bySelf && (
					<img
						className={classes.avatarStyle}
						src={avatar}
						onClick={(e) =>
							onAvatarChange && onAvatarChange(e, message)
						}
					></img>
				)}
				{showByselfAvatar && message.bySelf && (
					<img className={classes.avatarStyle} src={avatar}></img>
				)}
			</div>
			<div className={classes.textBodyBox}>
				{
          !message.bySelf && (
            onLineImg && <img className={classes.onLineImg} alt="" src={onLineImg} />
          )
        }
				<span className={classes.userName}>{message.from}</span>
				<div
					className={classes.textBody}
					onContextMenu={handleClick}
					id={message.id}
				>
					{renderTxt(message.body.msg)}{message.isThread}
					{showThreaddInfo ? <MsgThreadInfo message={message} /> : null}

					{reactionMsg.length > 0 && (
						<div className={classes.reactionBox} >
							<RenderReactions message={message} />
						</div>
					)}

					<div className={classes.textReaction}>
						{hoverDeviceModule ? (
							<div className={classes.textReactionCon}>
								{!isThreadPanel && isShowReaction && (
									<Reaction message={message} />
								)}
								{showThreadEntry && <div className={classes.threadCon} onClick={createThread} title="Reply">
									<div className={classes.thread}></div>
								</div>}
							</div>
						) : (
							sentStatus()
						)}
					</div>
				</div>
			</div>
			<div className={classes.time}>{renderTime(message.time)}</div>
			{message.status === "read" ? (
				<div className={classes.read}>{i18next.t("Read")}</div>
			) : null}

			<Menu
				keepMounted
				open={menuState.mouseY !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					menuState.mouseY !== null && menuState.mouseX !== null
						? { top: menuState.mouseY, left: menuState.mouseX }
						: undefined
				}
			>
				{message.bySelf && (
					<MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>
				)}
				{
					<MenuItem onClick={changeCopyVal}>
						<CopyToClipboard text={copyMsgVal}>
							<span>{i18next.t("Copy")}</span>
						</CopyToClipboard>
					</MenuItem>
				}
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
		</li >
	);
}

export default memo(TextMessage);

