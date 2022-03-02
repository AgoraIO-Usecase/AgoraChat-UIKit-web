import React, { memo } from "react";
import { makeStyles } from "@material-ui/styles";
import { reactionEmoji, defaultReactions } from "../../../common/reactionEmoji";
import { Button } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";

const useStyles = makeStyles((theme) => ({
	text: {
		fontFamily: "SF Compact Text",
		fontSize: "12px",
		fontStyle: "normal",
		fontWeight: "400",
		lineHeight: "20px",
		letterSpacing: "0px",
		textAlign: "left",
		color: "#999999",
		padding: "8px",
	},
	emojiBox: {
		width: (props) => props.width + "px",
		height: (props) => props.height + "px",
		display: "flex",
		flexWrap: "wrap",
	},
	defaultEmojiBox: {
		width: (props) => props.width + "px",
		display: "flex",
		flexWrap: "wrap",
	},
}));
const lineNum = 9;
const emojiWidth = 25;
const emojiPadding = 5;
const ReactionIcon = ({ anchorEl, onClose, onSelected }) => {
	const emojisNum = Object.values(reactionEmoji.map).length;
	const rows = Math.ceil(emojisNum / lineNum);
	const width = (emojiWidth + 2 * emojiPadding) * lineNum;
	const height = (emojiWidth + 2 * emojiPadding) * rows;
	const classes = useStyles({ width, height });
	function renderReaction() {
		return Object.keys(reactionEmoji.map).map((k) => {
			const v = reactionEmoji.map[k];
			return (
				<div>
					<Button
						style={{
							width: "35px",
							height: "35px",
							minHeight: "0",
							minWidth: "0",
						}}
						key={k}
					>
						<div
							style={{
								width: emojiWidth,
								height: emojiWidth,
								padding: emojiPadding,
							}}
						>
							<img
								src={
									require(`../../../common/reactions/${v}`)
										.default
								}
								alt={k}
								width={emojiWidth}
								height={emojiWidth}
							/>
						</div>
					</Button>
				</div>
			);
		});
	}

	function defaultReaction() {
		return Object.keys(defaultReactions.map).map((k) => {
			const v = defaultReactions.map[k];
			return (
				<div>
					<Button
						style={{
							width: "35px",
							height: "35px",
							minHeight: "0",
							minWidth: "0",
						}}
						key={k}
					>
						<div
							style={{
								width: emojiWidth,
								height: emojiWidth,
								padding: emojiPadding,
							}}
						>
							<img
								src={
									require(`../../../common/reactions/${v}`)
										.default
								}
								alt={k}
								width={emojiWidth}
								height={emojiWidth}
							/>
						</div>
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
			style={{ maxHeight: "500px" }}
			anchorOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
		>
			<div className={classes.text}>Frequently</div>
			<div className={classes.defaultEmojiBox} onClick={handleEmojiClick}>
				{defaultReaction()}
			</div>
			<hr />
			<div className={classes.text}>All Emojis</div>
			<div className={classes.emojiBox} onClick={handleEmojiClick}>
				{renderReaction()}
			</div>
		</Popover>
	);
};
export default memo(ReactionIcon);
