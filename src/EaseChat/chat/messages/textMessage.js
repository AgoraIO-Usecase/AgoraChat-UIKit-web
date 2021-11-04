import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { Menu, MenuItem } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { emoji } from "../../../common/emoji";
import { renderTime } from "../../../utils";
const useStyles = makeStyles((theme) => ({
  pulldownListItem: {
    display: "flex",
    padding: "10px 0",
    listStyle: "none",
    marginBottom: "26px",
    position: "relative",
    flexDirection: (props) => (props.bySelf ? "row-reverse" : "row"),
    alignItems:'center'
  },
  textBody: {
    display: "flex",
    margin: (props) => (props.bySelf ? "0 10px 10px 0" : "0 0 10px 10px"),
    lineHeight: "20px",
    fontSize: "14px",
    background: (props) =>
      props.bySelf
        ? "linear-gradient(124deg, #c913df 20%,#154DFE 90%)"
        : "#F2F2F2",
    color: (props) => (props.bySelf ? "#fff" : "#000"),
    border: "1px solid #fff",
    borderRadius: (props) =>
      props.bySelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    padding: "15px",
    maxWidth: "65%",
    overflowWrap: "break-word",
  },
  time: {
    position: "absolute",
    fontSize: "11px",
    height: "16px",
    color: "rgba(1, 1, 1, .2)",
    lineHeight: "16px",
    textAlign: "center",
    top: "-18px",
    width: "100%",
  },
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
function TextMessage({ message, onRecallMessage }) {
  const classes = useStyles({ bySelf: message.bySelf });
  const [state, setState] = useState(initialState);
  const handleClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  const handleClose = () => {
    setState(initialState);
  };
  const recallMessage = () => {
    onRecallMessage(message);
    handleClose();
  };
  const renderTxt = (txt) => {
    if (txt === undefined) {
      return [];
    }
    let rnTxt = [];
    let match = null;
    const regex = /(\[.*?\])/g;
    let start = 0;
    let index = 0;
    while ((match = regex.exec(txt))) {
      index = match.index;
      if (index > start) {
        rnTxt.push(txt.substring(start, index));
      }
      if (match[1] in emoji.map) {
        const v = emoji.map[match[1]];
        rnTxt.push(
          <img
            alt=""
            key={index}
            src={require(`../../../assets/faces/${v}`).default}
            width={20}
            height={20}
          />
        );
      } else {
        rnTxt.push(match[1]);
      }
      start = index + match[1].length;
    }
    rnTxt.push(txt.substring(start, txt.length));

    return rnTxt;
  };
  return (
    <li className={classes.pulldownListItem}>
      <Avatar></Avatar>
      <div className={classes.textBody} onContextMenu={handleClick}>
        {renderTxt(message.body.msg)}
      </div>
      <div className={classes.time}>{renderTime(message.time)}</div>
      {message.bySelf ? (
        <Menu
          keepMounted
          open={state.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>
        </Menu>
      ) : null}
    </li>
  );
}

export default memo(TextMessage);
