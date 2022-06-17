import React, { memo, useContext } from 'react'
import { makeStyles } from "@material-ui/styles";
import i18next from "i18next";
import { useSelector, useDispatch } from "react-redux";
import ThreadActions from "../../../redux/thread"
import AppDB from "../../../utils/AppDB"
import { message as Alert } from '../../../EaseChat/common/alert'
import { EaseChatContext } from "../index"

const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        listStyle: 'none',
        position: 'relative',
        alignItems: 'center',
        // '& :last-child': {
        //     marginBottom: '26px'
        // }
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
        marginRight: "4px",
    }
}))

function Notify({ message }) {
    const classes = useStyles();
    return (
        <li className={classes.pulldownListItem}>
            <div className={classes.root}>
                <span className={classes.name}>{message.whoName || message.from}</span>
                {i18next.t(message.actionContent)}
            </div>
        </li>
    )
}

export default memo(Notify)

