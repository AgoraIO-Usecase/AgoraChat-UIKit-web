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
		width: "27px",
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

	let reactiontotalNum = reactionMsg.reduce((total, item) => total + item.count, 0)

	return (
		<div className={classes.reaction}>
			<span onClick={handleReactionInfo} style={{display: 'flex'}}>
			{reactionMsg.map((item, i) => {
					if (i > 3 && reactionMsg.length != 5) return;
					return (
						<div key={i} className={classes.reactionItem}>
							{rnReactionEmoji(item.reaction)}
						</div>
					);
				})
			}

			{reactionMsg.length > 5 && (
				<span className={classes.reactionLingth}>...</span>
			)}
			{reactiontotalNum > 1 && <span className={classes.reactionLingth} style={{width: reactiontotalNum > 99 ? '30px': '20px'}} >
				{reactiontotalNum > 99 ? '99+' : reactiontotalNum}
			</span>}
			</span>
			<ReactionInfo
				anchorEl={reactionInfoVisible}
				onClose={
					() => {
						setReactionInfoVisible(null)
					}
				}
				message={message}
			/>
		</div>
	);
};

export default memo(RenderReactions);
