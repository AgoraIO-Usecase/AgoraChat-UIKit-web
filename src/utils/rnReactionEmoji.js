import React from 'react'
import {reactionEmoji} from "../common/reactionEmoji";
import WebIM from './WebIM'
const rnReactionEmoji = (reaction) => {
	if (reaction === undefined) {
		return [];
	}
	let rnReaction = [];
		if (reaction in reactionEmoji.map) {
			const v = reactionEmoji.map[reaction];
			rnReaction.push(
				<img
					key={WebIM.conn.getUniqueId()}
					src={require(`../common/reactions/${v}`).default}
					style={{
						width: "20px",
						height: "20px",
						display: "inline-block",
					}}
					alt=""
				/>
			);
		}
	return rnReaction;
};
export default rnReactionEmoji;