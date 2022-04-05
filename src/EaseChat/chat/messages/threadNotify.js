import React, { memo } from 'react'
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { useDispatch } from "react-redux";
import ThreadActions from "../../../redux/thread"
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        alignItems: 'center'
    },
    root: {
        width: '100%',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999',
        fontWeight: '600',
        lineHeight: '20px',
    },
    name: {
        color: '#154DFE',
        cursor: 'pointer',
    }
}))

function ThreadNotify({ message }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const openThreadListPanel = () => {
        dispatch(ThreadActions.setThreadListPanelDisplay(true));
    }
    return (
        <li className={classes.pulldownListItem}><div className={classes.root}>{message.from} {i18next.t(`Started a Thread`)}: {message.name}, {i18next.t(`See all`)} <span className={classes.name} onClick={openThreadListPanel}>{i18next.t(`Threads`)}</span></div></li>
    )
}

export default memo(ThreadNotify)

