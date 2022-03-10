import React, { memo } from "react";
import { makeStyles } from "@material-ui/styles";
import { reactionEmoji, defaultReactions } from "../../../common/reactionEmoji";
import { Box,Button } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";

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

const ReactionIcon = ({ anchorEl, onClose, onSelected }) => {
	const classes = useStyles();
	function renderReaction() {
		return Object.keys(reactionEmoji.map).map((k) => {
			const v = reactionEmoji.map[k];
			return (
				<div className={classes.emojiItem}>
					<Button key={k} className={classes.btnStyle}>
						<img
							src={
								require(`../../../common/reactions/${v}`)
									.default
							}
							alt={k}
							className={classes.emojiStyle}
						/>
					</Button>
				</div>
			);
		});
	}

	function defaultReaction() {
		return Object.keys(defaultReactions.map).map((k) => {
			const v = defaultReactions.map[k];
			return (
				<div className={classes.emojiItem}>
					<Button className={classes.btnStyle} key={k}>
						<img
							src={
								require(`../../../common/reactions/${v}`)
									.default
							}
							alt={k}
							className={classes.emojiStyle}
						/>
					</Button>
				</div>
			);
		});
	}

	const handleEmojiClick = (e) => {
		const emoji = e.target.alt || e.target.children[0].alt;
		onSelected(emoji);
	};

	return (
		<Popover
			keepMounted
			open={Boolean(anchorEl)}
			onClose={onClose}
			anchorEl={anchorEl}
			// style={{ width: 540, height: 340 }}

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
					onClick={handleEmojiClick}
				>
					{defaultReaction()}
				</div>
				<hr />
				<div className={classes.text}>All Emojis</div>
				<div className={classes.emojiBox} onClick={handleEmojiClick}>
					{renderReaction()}
				</div>
			</Box>
		</Popover>
	);
};
export default memo(ReactionIcon);
