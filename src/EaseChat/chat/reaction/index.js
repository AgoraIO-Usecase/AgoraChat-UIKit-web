import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import ReactionIcon from "./renderReactionIcon";
import ReactionInfo from "./reactionInfo";
import addReactionIcon from "../../../common/icons/add_reaction@2x.png";
import moreReactionIcon from "../../../common/icons/more@2x.png";
const useStyles = makeStyles((theme) => ({
	hoverMySelfReaction: {
		position: "absolute",
		bottom: "5px",
		left: "115px",
	},
	iconStyley: {
		height: "24px",
		width: "24px",
		cursor: "pointer",
	},
	infoStyle: {
		position: "absolute",
		left: (props) => (props.bySelf ? "" : "20px"),
		right: (props) => (props.bySelf ? "20px" : ""),
		height: "24px",
		width: "24px",
		cursor: "pointer",
	},
}));

const Reaction = ({ message }) => {
	const classes = useStyles({
		bySelf: message.bySelf,
	});
	const [reactionVisible, setReactionVisible] = useState(null);
	const [reactionInfoVisible, setReactionInfoVisible] = useState(null);
	const reactionMsg = message.reactions || [];
	const handleClickEmoji = (e) => {
		setReactionVisible(e.currentTarget);
	};
	const handleEmojiClose = () => {
		setReactionVisible(null);
	};
	const handleEmojiSelected = (emoji) => {
		if (!emoji) return;
		store.dispatch(MessageActions.addReactions(message, emoji));
	};

	return (
		<div>
			<img
				src={moreReactionIcon}
				alt="more reaction"
				className={classes.infoStyle}
			/>
			<img
				src={addReactionIcon}
				alt="reaction"
				className={classes.iconStyley}
				onClick={handleClickEmoji}
			/>
			<ReactionIcon
				anchorEl={reactionVisible}
				onSelected={handleEmojiSelected}
				onClose={handleEmojiClose}
			/>
		</div>
	);
};

export default memo(Reaction);
