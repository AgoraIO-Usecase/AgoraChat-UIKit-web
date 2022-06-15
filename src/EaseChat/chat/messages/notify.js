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
        marginRight: "4px",
    }
}))

function Notify({ message }) {
    const classes = useStyles();
    return (
        <li className={classes.pulldownListItem}>
            <div className={classes.root}>
                <span className={classes.name}>{message.from}</span>
                {i18next.t(`Joined the Group`)},
            </div>
        </li>
    )
}

export default memo(Notify)

