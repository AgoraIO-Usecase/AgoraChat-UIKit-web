import React, { useState, memo } from "react";
import { makeStyles } from "@material-ui/styles";
import { reactionEmoji, defaultReactions } from "../../../common/reactionEmoji";
import { Box, Button } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import WebIM from "../../../utils/WebIM";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "390px",
		height: "288px",
		maxHeight: "500px",
		borderRadius: "12px",
	},
	text: {
		fontFamily: "SF Compact Text",
		fontSize: "12px",
		fontStyle: "normal",
		fontWeight: "400",
		lineHeight: "20px",
		letterSpacing: "0px",
		textAlign: "left",
		color: "#999999",
		padding: "3px 8px",
	},
	emojiStyle: {
		height: "26px",
		width: "26px",
	},
	emojiItem: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "0 3px",
	},
	btnStyle: {
		width: "34px",
		height: "34px",
		minHeight: "0",
		minWidth: "0",
		borderRadius: "16px",
		// background:
	},

	clickStyle: {
		width: "34px",
		height: "34px",
		minHeight: "0",
		minWidth: "0",
		borderRadius: "16px",
		background: "#E6E6E6",
	},
	emojiBox: {
		width: (props) => props.width + "px",
		height: (props) => props.height + "px",
		display: "flex",
		flexWrap: "wrap",
		padding: "8px",
	},
	defaultEmojiBox: {
		width: (props) => props.width + "px",
		display: "flex",
		flexWrap: "wrap",
		padding: "8px",
	},
}));

const ReactionIcon = ({ anchorEl, onClose, onSelected, message }) => {
	const classes = useStyles();
	const reactionMsg = message.reactions || [];
	let currentLoginId = WebIM.conn.context.userId || "";
	let newStatus = {};
	const isStatus = (v) => {
		reactionMsg.length > 0 &&
			reactionMsg.forEach((val) => {
				let { reaction, userList, isAddedBySelf } = val;
				if (
					reactionEmoji.map[reaction]?.includes(v) &&
					userList.includes(currentLoginId)
				) {
					newStatus[v] = isAddedBySelf;
				}
			});
		return newStatus[v];
	};
	const renderReactions = (type) => {
		let renderType = type === "default";
		return Object.keys(
			(renderType ? defaultReactions : reactionEmoji).map
		).map((k, i) => {
			const v = reactionEmoji.map[k];
			let emojiSrc = require(`../../../common/reactions/${v}`).default;
			return (
				<div
					className={classes.emojiItem}
					key={k}
					onClick={isStatus(v) ? handleDelete : handleEmojiClick}
				>
					<Button
						key={k}
						className={
							isStatus(v) ? classes.clickStyle : classes.btnStyle
						}
					>
						<img
							src={emojiSrc}
							alt={k}
							className={classes.emojiStyle}
						/>
					</Button>
				</div>
			);
		});
	};

	const handleEmojiClick = (e) => {
		const emoji = e.target.alt || e.target.children[0].alt;
		onSelected(emoji);
		onClose();
	};

	const handleDelete = (e) => {
		const emoji = e.target.alt || e.target.children[0].alt;
		store.dispatch(MessageActions.deleteReaction(message, emoji));
		onClose();
	};

	return (
		<Popover
			keepMounted
			open={Boolean(anchorEl)}
			onClose={onClose}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
		>
			<Box className={classes.root}>
				<div className={classes.text}>Frequently</div>
				<div
					className={classes.defaultEmojiBox}
				// onClick={handleEmojiClick}
				>
					{renderReactions("default")}
				</div>
				<hr />
				<div className={classes.text}>All Emojis</div>
				<div className={classes.emojiBox}>{renderReactions("all")}</div>
			</Box>
		</Popover>
	);
};
export default memo(ReactionIcon);
