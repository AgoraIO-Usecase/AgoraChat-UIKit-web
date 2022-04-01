import React from 'react'
import {reactionEmoji} from "../common/reactionEmoji";
import WebIM from './WebIM'
const rnReactionEmoji = (reaction) => {
	if (reaction === undefined) {
		return [];
	}
	let rnReaction = [];
	let match = null;
	const regex = /(.*?)/g;
	let start = 0;
	let index = 0;
	while ((match = regex.exec(reaction))) {
		index = match.index;
		if (index > start) {
			rnReaction.push(reaction.substring(start, index));
		}
		if (match[1] in reactionEmoji.map) {
			const v = reactionEmoji.map[match[1]];
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
		} else {
			rnReaction.push(match[1]);
		}
		start = index + match[1].length;
	}
	rnReaction.push(reaction.substring(start, reaction.length));
	return rnReaction;
};
export default rnReactionEmoji;