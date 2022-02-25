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
	reactionLingtg: {
		Font: "SF Compact Text",
		Weight: "400",
		Style: "normal",
		Size: "14px",
		LineHeight: "20px",
		Align: "Center",
		color: "#000000",
		marginLeft: "5px",
        width: "20px"
	},
}));

const RenderReactions = ({ message }) => {
	const classes = useStyles();

	const deleteReaction = (reaction) => {
		store.dispatch(MessageActions.deleteReaction(message,reaction));
	};
	return (
		<div className={classes.reaction}>
			{message.meta.map((item, i) => {
				console.log("item", item);
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
			<span className={classes.reactionLingtg}>{message.meta.length}</span>
		</div>
	);
};

export default memo(RenderReactions);
