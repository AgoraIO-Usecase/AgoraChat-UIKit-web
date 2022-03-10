import React, { memo, useState } from "react";
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
import deleteReactionIcon from "../../../common/icons/reaction_delete@2x.png";

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
	textStyle: {
		fontFamily: "SF Compact Text",
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
		fontFamily: "SF Compact Text",
		fontWeight: "600",
		fontStyle: "normal",
		fontSize: "16px",
		lineHeight: "20px",
	},
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
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleDeleteReaction = (reaction) => {
		if (reactionMsg.length === 0) {
			onClose();
		}
		store.dispatch(MessageActions.deleteReaction(message, reaction));
	};

	const reactionUserList = (userList) => {
		let userName = ''
		return (
			<>
				{userList.map((val, i) => {
					if (val === loginUserId) {
						userName = "You";
					}else {
						userName = val;
					}
					return <Typography key={i} className={classes.reactionUserStyle}>{userName}</Typography>;
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
		>
			<Box className={classes.infoBox}>
				<Box className={classes.infoTitle}>
					<span className={classes.textStyle}>Reactions</span>
					<span className={classes.closeStyle} onClick={onClose}>
						X
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
						return (
							<div>
								<TabPanel
									value={value}
									index={i}
									className={classes.tabPanelItem}
								>
									<div className={classes.reactionUsreItem}>
										{reactionUserList(item.userList)}
										<img
											src={deleteReactionIcon}
											alt=""
											className={classes.iconStyle}
											onClick={() =>
												handleDeleteReaction(
													item.reaction
												)
											}
										/>
									</div>
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
