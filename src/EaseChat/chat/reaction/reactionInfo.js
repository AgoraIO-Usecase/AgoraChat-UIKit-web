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
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "300px",
		width: "540px",
	},
	text: {
		Font: "SF Compact Text",
		fontWeight: "600",
		fontStyle: "normal",
		fontSize: "18px",
		LineHeight: "28px",
		padding: "8px",
	},
	deleteIcon: {
		position: "absolute",
		right: "50px",
		top: "20px",
        cursor:'pointer'
	},
    tabPanelItem:{
         position: "relative"
    }
}));
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
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
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
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
			<div className={classes.text}>Reactions</div>
			<hr />
			<div className={classes.root}>
				<AppBar position="static">
					<Tabs
						value={value}
						onChange={handleChange}
						fullWidth={true}
						aria-label="simple tabs example"
					>
						{message.meta.map((item, i) => {
							return (
								<Tab
									label={rnReactionEmoji(item.reaction)}
									{...a11yProps(i)}
								/>
							);
						})}
					</Tabs>
				</AppBar>
				{message.meta.map((item, i) => {
					return (
						<div>
							<TabPanel
								value={value}
								index={i}
								className={classes.tabPanelItem}
							>
								{item.userList}
								<span className={classes.deleteIcon} onClick={()=> handleDeleteReaction(item.reaction)}>
									<Icon className="iconfont icon-qingkongxiaoxi"></Icon>
								</span>
							</TabPanel>
						</div>
					);
				})}
			</div>
		</Popover>
	);
};

export default memo(ReactionInfo);
