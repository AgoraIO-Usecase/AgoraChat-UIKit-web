import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import ReactionIcon from "./renderReactionIcon";
import addReactionIcon from "../../../common/icons/add_reaction@2x.png";
const useStyles = makeStyles((theme) => ({
	iconStyley: {
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
				src={addReactionIcon}
				alt="reaction"
				className={classes.iconStyley}
				onClick={handleClickEmoji}
			/>
			<ReactionIcon
				anchorEl={reactionVisible}
				onSelected={handleEmojiSelected}
				onClose={handleEmojiClose}
				message={message}
			/>
		</div>
	);
};

export default memo(Reaction);

