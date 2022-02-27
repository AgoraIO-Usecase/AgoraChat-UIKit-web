import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import ReactionIcon from "./renderReactionIcon";
import ReactionInfo from "./reactionInfo";
import addReactionIcon from "../../../common/icons/add_reaction@2x.png";
import moreReactionIcon from '../../../common/icons/more@2x.png'
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
}));

const Reaction = ({ message }) => {
	const classes = useStyles();
	const [reactionVisible, setReactionVisible] = useState(null);
	const [reactionInfoVisible,setReactionInfoVisible] = useState(null);
	const handleClickEmoji = (e) => {
		setReactionVisible(e.currentTarget);
	};
	const handleEmojiClose = () => {
		setReactionVisible(null);
	};
	const handleEmojiSelected = (emoji) => {
		if (!emoji) return;
		store.dispatch(MessageActions.addReactions(message,emoji));
	};

	const handleClickReactionInfo = (e) => {
		message.meta.length > 0 && setReactionInfoVisible(e.currentTarget);
	}

	const handleReactionInfoClose = () => {
		setReactionInfoVisible(null);
	};


	return (
		<div>
			{message.bySelf && (
				<img
					src={moreReactionIcon}
					alt="more reaction"
					className={classes.iconStyley}
					onClick={handleClickReactionInfo}
				/>
			)}
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
			
			{message?.meta?.length > 0 ? (
				<ReactionInfo
					anchorEl={reactionInfoVisible}
					onSelected={handleEmojiSelected}
					onClose={handleReactionInfoClose}
					message={message}
				/>
			) : null}
			{!message.bySelf && (
				<img
					src={moreReactionIcon}
					alt="more reaction"
					className={classes.iconStyley}
					onClick={handleClickReactionInfo}
				/>
			)}
		</div>
	);
};

export default memo(Reaction);
