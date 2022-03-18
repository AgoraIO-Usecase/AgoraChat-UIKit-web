import React, { useState, } from "react";
import { makeStyles } from "@material-ui/styles";
import closeIcon from '../images/close.png'
import deleteIcon from '../images/delete.png'

const useStyles = makeStyles((theme) => {
    return {
        dialog: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '540px',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
            zIndex:'100',
        },
        dialogHeader: {
            display: 'flex',
            justifyContent: "space-between",
            height: '59px',
            lineHeight: '59px',
            borderBottom: '1px solid #ccc',
        },
        title: {
            marginLeft: '24px',
            fontWeight: '600',
            color: '#000',
        },
        icon: {
            display: 'block',
            marginRight: '23px',
            marginTop: '23px',
            height: '14px',
            width: '14px',
            cursor: 'pointer',
        },
        buttons: {
            display: 'flex',
            height: '100px',
            paddingTop: '40px',
            boxSizing: 'border-box',
        },
        button1: {
            marginLeft: '341px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            width: '84px',
            borderRadius: '26px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#000',
        },
        button2: {
            marginLeft: '8px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            width: '84px',
            borderRadius: '26px',
            background: '#114EFF',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
        },
        changeName:{
            display: 'flex',
            margin: '16px auto',
            height: '54px',
            width: '508px',
            background: '#F4F5F7',
            borderRadius: '16px',
        },
        changeNameInput: {
            marginLeft: '15px',
            lineHeight: '54px',
            width: '450px',
            outline: 'none',
            border: 'none',
            background: 'none',
            fontWeight: '500',
            fontSize: '18px',
            '&:focus':{
                outline: 'none',
            }
        },
        deleteIcon:{
            display: 'block',
            marginLeft: '8px',
            marginTop: '20px',
            height: '14px',
            width: '14px',
            cursor: 'pointer',
        }

    };
});

const dialog = (props) => {
    const classes = useStyles();
    const [inputValue,changeInputValue] = useState('');
    const handleNameChange = (e)=>{
        changeInputValue(e.target.value);
    }
    const clearInputValue = ()=>{
        changeInputValue('');
    }
    const closeDialog = ()=>{
        console.log('closeDialog');
    }
    const renderContent = ()=>{
        if(props.input){
            return (
                <div className={classes.changeName}>
                    <input className={classes.changeNameInput} value={inputValue} onChange={handleNameChange}></input>
                    <img src={deleteIcon} className={classes.deleteIcon} onClick={clearInputValue}></img>
                </div>
            )
        }
        
    }
    const renderButtons = ()=>{
        return (
            <div className={classes.buttons}>
                <div className={classes.button1}>{props.button1}</div>
                <div className={classes.button2}>{props.button2}</div>
            </div>
        )
    }
    return (
        <div className={classes.dialog}>
            <div className={classes.dialogHeader}>
                <div className={classes.title}>{props.title}</div>
                <img src={closeIcon} className={classes.icon} onClick={closeDialog}></img>
            </div>
            {renderContent()}
            {renderButtons()}
        </div>


    );
}
export default dialog