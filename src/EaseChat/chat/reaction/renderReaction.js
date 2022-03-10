import React, { memo } from "react";
import rnReactionEmoji from "../../../utils/rnReactionEmoji";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
	reaction: {
		display: "flex",
		cursor: "pointer",
	},
	reactionItem: {
		height: "20px",
		width: "20px",
		marginLeft: "3px",
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
	const classes = useStyles();
	const reactionMsg = message.reactions || [];

	return (
		<div className={classes.reaction}>
			{reactionMsg.length > 0 &&
				reactionMsg.map((item, i) => {
					if (i > 3) return;
					return (
						<div key={i} className={classes.reactionItem}>
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
