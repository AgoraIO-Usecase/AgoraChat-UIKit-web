import Dialog from './dialog'
import { useSelector, useDispatch } from "../../../EaseApp/index";
import React, { useState, useEffect } from 'react'
import i18next from "i18next";
import { Box, Checkbox, List, ListItem, InputBase, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash'
import rearch_icon from '../../../common/images/search@2x.png'
import deldete_icon from '../../../common/images/delete@2x.png'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import WebIM from '../../../utils/WebIM'
import { message } from '../../common/alert'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '650px',
            height: '480px',
        },
        listBox: {
            height: '410px',
            overflowY: 'auto'
        },
        container: {
            display: 'flex',
            minHeight: '410px',
        },
        btnBox: {
            height: '70px',
            lineHeight: '70px',
            textAlign: 'right',
            padding: '0 23px'
        },
        gMemberAvatar: {
            width: '36px',
            height: '36px',
            borderRadius: '20px',
            backgroundColor: '#FF9F4D',
        },

        searchBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '30px'
        },

        contactsItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '50px'
        },

        memberBox: {
            width: '50%',
            background: '#EDEFF2',
            padding: '10px',
        },
    })
});



const InviteModal = (props) => {
    const { open, onClose, onCall, members, joinedMembers } = props
    const classes = useStyles();
    const username = WebIM.conn?.context?.userId
    let contacts = members.length > 0 ? members.map((item) => {
        return { id: item.member || item.owner }
    }) : []
    contacts = contacts.filter((item) => {
        if (username == item.id) {
            return false
        } else {
            return true
        }
    })
    console.log('joinedMembers', joinedMembers)
    joinedMembers && joinedMembers.forEach((item) => {
        let user = contacts.find((el) => {
            if (el.id === item.imUserId) {
                return true
            }
        })
        if (user) {
            user.checked = true
            user.disabled = true
        }
    })
    const groupById = useSelector((state) => state.group?.group.byId) || {};
    const [searchValue, setSearchValue] = useState('')
    const [groupMembers, setGroupMembers] = useState([]);
    const [contactsObjs, setContactsObjs] = useState(contacts);
    console.log('contactsObjs', contactsObjs)
    useEffect(() => {
        setContactsObjs(contacts)
    }, [members])
    // search value
    const searchChangeValue = (e) => {
        setSearchValue(e.target.value)
    }

    // click search
    const handleSearchValue = () => {
        console.log(searchValue)
        if (searchValue === '') {
            contacts.forEach((user) => {
                if (groupMembers.includes(user.id)) {
                    user.checked = true
                } else {
                    user.checked = false
                }
            })
            setContactsObjs(contacts)
            return
        }

        let searched = contactsObjs.filter((item) => {
            if (item.id.includes(searchValue)) {
                return item
            }
        })
        setContactsObjs(searched)
    }

    const handleSelect = (val) => (e) => {
        console.log('e.target.checked', e.target)
        if (e.target.checked) {
            let joinedNum = joinedMembers ? joinedMembers.length : 0

            if (joinedNum > 0 && groupMembers.length + joinedNum >= 3) {
                message.error('There can only be 16 people in the channel')
                return
            }
            if (joinedNum === 0 && groupMembers.length + 1 >= 3) {
                message.error('There can only be 16 people in the channel')
                return
            }

            let newSelected = [...groupMembers]
            newSelected.push(val)
            console.log('groupMembers', [...newSelected])
            setGroupMembers(newSelected)
            let newContactsObjs = [...contactsObjs]
            newContactsObjs.forEach((value) => {
                if (value.id === val) {
                    value.checked = true
                }
            })
            setContactsObjs(newContactsObjs)
        } else if (!(e.target.checked)) {
            let newSelected = [...groupMembers]
            let groupMembersPull = _.pull(newSelected, val)
            setGroupMembers(groupMembersPull)
            let newContactsObjs = [...contactsObjs]
            newContactsObjs.forEach((value) => {
                if (value.id === val) {
                    value.checked = false
                }
            })
            setContactsObjs(newContactsObjs)
        }
    }

    const deleteGroupMember = (val) => () => {
        let newGroupAry = _.pull(groupMembers, val);
        setGroupMembers(newGroupAry)
        contactsObjs.forEach((value) => {
            if (value.id === val) {
                value.checked = false
            }
        })
        setContactsObjs([...contactsObjs])
    }

    const startCall = () => {
        onCall(groupMembers)
        setGroupMembers([])
        setContactsObjs([])
        setSearchValue([])
    }

    const onCloseModal = () => {
        setGroupMembers([])
        setContactsObjs([])
        setSearchValue([])
        onClose()
    }

    const renderMember = () => {
        return <Box className={classes.root}>
            <Box className={classes.listBox}>
                <Box className={classes.container}>
                    <Box style={{ width: '50%', background: '#F5F7FA', padding: '10px' }}>
                        <Box className={classes.searchBox}>
                            <InputBase type="search"
                                placeholder={i18next.t('Group Members')}
                                style={{ width: '100%', padding: '5px' }}
                                onChange={searchChangeValue}
                            />
                            <img src={rearch_icon} alt=""
                                style={{ width: '32px', cursor: 'pointer' }}
                                onClick={handleSearchValue}
                            />
                        </Box>
                        <List>
                            {contactsObjs.length > 0 && contactsObjs.map((item, key) => {
                                return (
                                    <ListItem key={key} onClick={handleSelect(item.id)} className={classes.contactsItem}>
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <Box className={classes.gMemberAvatar}></Box>
                                            <Typography style={{ marginLeft: '10px' }}>{item.id}</Typography>
                                        </Box>

                                        <FormControlLabel
                                            disabled={item.disabled}
                                            control={<Checkbox checked={!!item.checked} />}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                    <Box className={classes.memberBox}>
                        <Typography >{`${i18next.t('Selected')}(${groupMembers.length})`}</Typography>
                        <List>
                            {groupMembers.length > 0 && groupMembers.map((item, key) => {
                                return (
                                    <ListItem key={key} className={classes.contactsItem}>
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <Box className={classes.gMemberAvatar} ></Box>
                                            <Typography style={{ marginLeft: '10px' }}>{item}</Typography>
                                        </Box>
                                        <img src={deldete_icon} alt="" style={{ width: '20px', cursor: 'pointer' }} onClick={deleteGroupMember(item)} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
            </Box>

            <Box className={classes.btnBox}>
                <Button style={{ textTransform: "none"}} variant="contained" color="primary" onClick={startCall} disabled={groupMembers.length == 0}>Call</Button>
            </Box>
        </Box>
    }
    return (
        <Dialog
            open={!!open}
            onClose={onCloseModal}
            title={i18next.t('Call for Gromp Members')}
            content={renderMember()}
            maxWidth={880}
        ></Dialog>
    )
}

export default InviteModal

