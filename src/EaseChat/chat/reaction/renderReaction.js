import React, { memo } from "react";
import rnReactionEmoji from "../../../utils/rnReactionEmoji";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";

const useStyles = makeStyles((theme) => ({
	reaction: {
		display: "flex",
	},
	reactionItem: {
		height: "20px",
		width: "20px",
		marginLeft: "3px",
        cursor:"pointer"
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
		height:"20px"
	},
}));

const RenderReactions = ({ message }) => {
	const classes = useStyles();
	const reactionMsg = message.reactions || [];
	const deleteReaction = (reaction) => {
		store.dispatch(MessageActions.deleteReaction(message,reaction));
	};
	return (
		<div className={classes.reaction}>
			{reactionMsg.length > 0 &&
				reactionMsg.map((item, i) => {
					if (i > 3) return;
					return (
						<div
							key={i}
							className={classes.reactionItem}
							onClick={() => deleteReaction(item.reaction)}
						>
							{rnReactionEmoji(item.reaction)}
						</div>
					);
				})}
			{reactionMsg.length > 4 && (
				<span className={classes.reactionLingth}>...</span>
			)}
			<span className={classes.reactionLingth}>{reactionMsg.length}</span>
		</div>
	);
};

export default memo(RenderReactions);
