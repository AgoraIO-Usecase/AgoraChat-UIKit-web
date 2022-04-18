import React, { useState, memo } from "react";
import rnReactionEmoji from "../../../utils/rnReactionEmoji";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import ReactionInfo from './reactionInfo'

const useStyles = makeStyles((theme) => ({
	reaction: {
		display: "flex",
		cursor: "pointer",
	},
	reactionItem: {
		height: "20px",
		width: "20px",
		marginLeft: (props) => props.rnReaction ? "4px" : ""
	},
	reactionLingth: {
		font: "SF Compact Text",
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: "14px",
		lineHeight: "20px",
		textAlign: "Center",
		color: "#000000",
		marginLeft: "5px",
		width: "20px",
		height: "20px",
	},
}));

const RenderReactions = ({ message }) => {
	const reactionMsg = message.reactions || [];
	const classes = useStyles({
		rnReaction: reactionMsg.length > 1
	});
	const [reactionInfoVisible, setReactionInfoVisible] = useState(null);

	const handleDeleteReaction = (reaction) => {
		store.dispatch(MessageActions.deleteReaction(message, reaction))
	}

	const handleReactionInfo = (e) => {
		setReactionInfoVisible(e.currentTarget);
	}

	let opStatus = false;
	return (
		<div className={classes.reaction}>
			{reactionMsg.length > 0 &&
				reactionMsg.map((item, i) => {
					if (item.count === 0) {
						return opStatus = true;
					}
					if (i > 3 && reactionMsg.length != 5) return;
					return (
						<div key={i} className={classes.reactionItem} onClick={() => handleDeleteReaction(item.reaction)}>
							{rnReactionEmoji(item.reaction)}
						</div>
					);
				})}
			{reactionMsg.length > 4 && reactionMsg.length != 5 && (
				<span className={classes.reactionLingth}>...</span>
			)}
			{reactionMsg.length > 1 && <span className={classes.reactionLingth} onClick={handleReactionInfo}>
				{opStatus ? reactionMsg.length - 1 : reactionMsg.length}
			</span>}
			<ReactionInfo
				anchorEl={reactionInfoVisible}
				onClose={() => setReactionInfoVisible(null)}
				message={message}
			/>
		</div>
	);
};

export default memo(RenderReactions);
