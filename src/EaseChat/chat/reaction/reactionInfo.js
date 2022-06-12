import React, { memo, useState,useEffect } from "react";
import rnReactionEmoji from "../../../utils/rnReactionEmoji";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import WebIM from "../../../utils/WebIM";
import Popover from "@material-ui/core/Popover";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import deleteReactionIcon from "../../../common/icons/reaction_delete@2x.png";

import avatarIcon1 from "../../../common/images/avatar1.png";
import avatarIcon2 from "../../../common/images/avatar2.png";
import avatarIcon3 from "../../../common/images/avatar3.png";
import threadClose from "../../../common/images/threadClose.png"

const useStyles = makeStyles((theme) => ({
	infoBox: {
		height: "360px",
		width: "480px",
		flexGrow: 1,
	},
	infoTitle: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "0px 15px",
		height: "58px",
		borderBottom: "2px solid #C4C4C4",
	},
	infoReaction: {
		height: `calc(100% - 60px)`,
	},
	textStyleTitle: {
		fontFamily: "Roboto",
		fontWeight: "600",
		fontStyle: "normal",
		fontSize: "18px",
		LineHeight: "28px",
		blend: "Pass through",
		padding: "8px",
	},
	closeStyle: {
		width: "14px",
		height: "14px",
		blend: "Pass through",
		cursor: "pointer",
	},
	root: {
		background: "#FFFFFF",
	},
	iconStyle: {
		width: "24px",
		height: "24px",
		cursor: "pointer",
	},
	reactionItem: {
		width: "80px !important",
		minWidth: "0 !important",
	},
	tabPanelItem: {
		position: "relative",
	},
	reactionNumLabel: {
		display: "flex",
		justifyContent: "center",
		"& span": {
			margin: "0 10px",
		},
	},
	reactionUsreItem: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	reactionUserStyle: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		fontFamily: "SF Compact Text",
		fontWeight: "600",
		fontStyle: "normal",
		fontSize: "16px",
		lineHeight: "20px",
		marginTop:"10px"
	},
	userBox: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	textStyle: {
		marginLeft: '8px !important',
	},
	myselfPopover: {
		'& .MuiPopover-paper': {
				borderRadius: '12px',
				backdropFilter: 'blur(12px)',
				background: 'rgba(255,255,255,.8)',
		}
	}
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		"aria-controls": `scrollable-force-tabpanel-${index}`,
	};
}

const ReactionInfo = ({ anchorEl, onClose, message }) => {
	const classes = useStyles();
	const [value, setValue] = useState(0);
	const reactionMsg = message.reactions || [];
	const loginUserId = WebIM.conn.context.userId || "";
	let userAvatars = {
		1: avatarIcon1,
		2: avatarIcon2,
		3: avatarIcon3,
	};
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleDeleteReaction = (reaction) => {
		if (reactionMsg.length === 0) {
			onClose();
		}
		store.dispatch(MessageActions.deleteReaction(message, reaction));
	};

	const reactionUserList = (item) => {
		let {userList,reaction} = item
		let userName = "";
		return (
			<>
				{userList.map((val, i) => {
					let isCurrentLoginUser = val === loginUserId;
					if (isCurrentLoginUser) {
						userName = "You";
					} else {
						userName = val;
					}
					return (
						<div key={i} className={classes.reactionUserStyle}>
							<div className={classes.userBox}>
								<Avatar src={userAvatars[1]} />
								<Typography className={classes.textStyle}>{userName}</Typography>
							</div>
							{isCurrentLoginUser && (
								<img
									src={deleteReactionIcon}
									alt=""
									className={classes.iconStyle}
									onClick={() =>
										handleDeleteReaction(reaction)
									}
								/>
							)}
						</div>
					);
				})}
			</>
		);
	};

	return (
		<Popover
			keepMounted
			open={Boolean(anchorEl)}
			onClose={onClose}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			className={classes.myselfPopover}
		>
			<Box className={classes.infoBox}>
				<Box className={classes.infoTitle}>
					<span className={classes.textStyleTitle}>Reactions</span>
					<span className={classes.closeStyle} onClick={onClose}>
						<img slt="" src={threadClose} />
					</span>
				</Box>
				<Box className={classes.infoReaction}>
					<AppBar
						position="static"
						color="default"
						style={{ boxShadow: "none" }}
					>
						<Tabs
							value={value}
							onChange={handleChange}
							variant="scrollable"
							scrollButtons="on"
							indicatorColor="primary"
							textColor="primary"
							aria-label="scrollable force tabs example"
							className={classes.root}
						>
							{reactionMsg.map((item, i) => {
								if (item.count === 0) return
								let label = (
									<div className={classes.reactionNumLabel}>
										{rnReactionEmoji(item.reaction)}{" "}
										<span>{item.userList.length}</span>
									</div>
								);
								return (
									<Tab
										label={label}
										{...a11yProps(i)}
										className={classes.reactionItem}
										key={i}
									/>
								);
							})}
						</Tabs>
					</AppBar>
					{reactionMsg.map((item, i) => {
						if (item.count === 0 ) return
						return (
							<div key={item.reaction}>
								<TabPanel
									value={value}
									index={i}
									className={classes.tabPanelItem}
								>
									<div>{reactionUserList(item)}</div>
								</TabPanel>
							</div>
						);
					})}
				</Box>
			</Box>
		</Popover>
	);
};

export default memo(ReactionInfo);