import React, { memo, useState } from "react";
import rnReactionEmoji from "../../../utils/rnReactionEmoji";
import { makeStyles } from "@material-ui/styles";
import store from "../../../redux/index";
import MessageActions from "../../../redux/message";
import Popover from "@material-ui/core/Popover";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import deleteReactionIcon from "../../../common/icons/reaction_delete@2x.png";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "248px",
		width: "480px",
		flexGrow: 1,
	},
	infoTitle: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "0px 15px",
	},
	text: {
		Font: "SF Compact Text",
		fontWeight: "600",
		fontStyle: "normal",
		fontSize: "18px",
		LineHeight: "28px",
		blend: "Pass through",
		padding: "8px",
	},
	close: {
		width: "14px",
		height: "14px",
		blend: "Pass through",
		cursor: "pointer",
	},
	deleteIcon: {
		position: "absolute",
		width: "20px",
		height: "20px",
		right: "50px",
		top: "25px",
		cursor: "pointer",
	},
	tabPanelItem: {
		position: "relative",
	},
	reactionNumLabel: {
		display: 'flex', 
		justifyContent: 'center',
		'& span': {
			margin: '0 10px'
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
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleDeleteReaction = (reaction) => {
		store.dispatch(MessageActions.deleteReaction(message, reaction));
	};
	return (
		<Popover
			keepMounted
			open={Boolean(anchorEl)}
			onClose={onClose}
			anchorEl={anchorEl}
			className={classes.infoBox}
			style={{ width: 540, height: 340 }}
			anchorOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
		>
			<div className={classes.infoTitle}>
				<span className={classes.text}>Reactions</span>
				<span className={classes.close} onClick={onClose}>
					X
				</span>
			</div>
			<hr />
			<div className={classes.root}>
				<AppBar position="static" color="default">
					<Tabs
						value={value}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="on"
						indicatorColor="primary"
						textColor="primary"
						aria-label="scrollable force tabs example"
					>

						{message.meta.map((item, i) => {
						let label = <div className={classes.reactionNumLabel}>{rnReactionEmoji(item.reaction)} <span>{item.userList.length}</span></div>
							return (
								<Tab
									label={label}
									{...a11yProps(i)}
								/>
							);
						})}
					</Tabs>
				</AppBar>
				{message.reactions.map((item, i) => {
					return (
						<div>
							<TabPanel
								value={value}
								index={i}
								className={classes.tabPanelItem}
							>
								{item.userList}
								<img
									src={deleteReactionIcon}
									alt=""
									className={classes.deleteIcon}
									onClick={() =>
										handleDeleteReaction(item.reaction)
									}
								/>
							</TabPanel>
						</div>
					);
				})}
			</div>
		</Popover>
	);
};

export default memo(ReactionInfo);
