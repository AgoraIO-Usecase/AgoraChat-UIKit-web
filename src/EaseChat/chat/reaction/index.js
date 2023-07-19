import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import ReactionIcon from "./renderReactionIcon";
import addReactionIcon from "../../../common/icons/add_reaction@2x.png";
import { Tooltip } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
	iconStyley: {
		height: "24px",
		width: "24px",
		cursor: "pointer",
	},
	conatiner: {
		height: "24px",
		width: "24px",
		float: (props) => (props.bySelf ? 'right' : 'left'),
		borderRadius: '50%',
		'&:hover': {
			background: '#E6E6E6',
		}
	},
	reactionTooltip: {
		background: '#fff',
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -2px 0px 8px rgba(0, 0, 0, 0.08)',
	}
}));

const Reaction = ({ message }) => {
	const classes = useStyles({});
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
		<div className={classes.conatiner}>
			<Tooltip title='Add Reactions' placement="top" classes={{ tooltip: classes.reactionTooltip }}>
				<img
					src={addReactionIcon}
					alt="reaction"
					className={classes.iconStyley}
					onClick={handleClickEmoji}
				/>
			</Tooltip>
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