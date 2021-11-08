import { useEffect, useState } from "react";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { theme } from '../theme';
import { ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import clsx from "clsx";
import { textAlign } from "@mui/system";
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import ChatSection from './ChatSection';
import useChat from "./useChat";
import BidCard from './chat/BidCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
const axios = require('axios');


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                e-Auction
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const useStyles = makeStyles({
    main: {
        height: "100%", // So that grids 1 & 4 go all the way down
        minHeight: 150, // Give minimum height to a div
        fontSize: 30,
        textAlign: "center"
    },
    container: {
        height: "100%", // So that grids 1 & 4 go all the way down
        minHeight: 150, // Give minimum height to a div
        border: "1px solid black",
        fontSize: 30,
        textAlign: "center"
    },
    containerTall: {
        minHeight: 250 // This div has higher minimum height
    }
});



export default function AuctionRoomDisplay(props) {
    const roomId = props.match.params.id;
    const { messages, sendMessage, bids, sendBid, status, endAuction, highestBid, setHighestBid } = useChat(roomId);
    const [newBid, setNewBid] = useState(0);
    const [isOwner, setOwner] = useState(false);
    let history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [auctionclose, setAuctionclose] = React.useState(false);
    const [auctiondetails, setDetails] = useState({});
    const [currency, setCurrency] = useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAuctionclose = () => {
        setAuctionclose(true);
    };

    const handleAuctioncomplete = () => {
        history.push("/all");
    };

    function getCurrentUser() {
        console.log(JSON.parse(localStorage.getItem('userid')));
        return JSON.parse(localStorage.getItem('userid'));
    }

    // external auctiondetails url
    const auctiondetailurl = `${process.env.REACT_APP_dockerauctiondetailsserver || 'http://localhost/api/auctiondetails/'}`;

    // external currency url
    const currencyurl = `${process.env.REACT_APP_dockercurrencymanagementserver || 'http://localhost/api/currency/'}`;
    // external bid url
    const bidurl = `${process.env.REACT_APP_dockerauctionroomserver || 'http://localhost/api/room/'}`;
    //redirect to home page if auction ends
    useEffect(() => {
        if (!status) {
            handleAuctionclose();
            // history.push("/all");
        };
    });
    useEffect(() => {
        //check whether client is room owner, then show end auction button
        const config = {
            headers: { Authorization: JSON.parse(localStorage.getItem('user')) }
        };

        axios.get(`${auctiondetailurl + roomId}`, config)
            .then(response => {
                console.log(response);
                setDetails(response.data)
                if (getCurrentUser() == response.data['owner_id']) {
                    setOwner(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        //get money
        axios.get(`${currencyurl + getCurrentUser()}`, config)
            .then(response => {
                console.log(response);
                setCurrency(response.data['currency'])
            })
            .catch(function (error) {
                console.log(error);
            });

        //call api sethighestbid
        // setHighestBid()
        axios.get(`${bidurl}gethighest/${roomId}`, config)
            .then(response => {
                setHighestBid({ highest: parseInt(response['data'].bid), username: response['data'].username })
                console.log(response['data'].bid);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);


    const handleNewBidChange = (event) => {
        setNewBid(event.target.value);
    };

    const validateAndSend = () => {
        var min = parseInt(highestBid['highest']) + parseInt(auctiondetails['increment']);
        console.log(min)
        // non-numerical input
        if (!/^[0-9\b]+$/i.test(newBid)) {
            console.log('Please enter a valid bid!');
            handleClickOpen();
        }
        // bid does not satisfy minimum bid
        else if (newBid < parseInt(auctiondetails['minbid'])) {
            console.log('Bid does not satisfy minimum bid ' + auctiondetails['minbid']);
            handleClickOpen();
        }
        // bid does not satisfy increment
        else if (newBid < min) {
            console.log('Bid does not satisfy increment' + min);
            handleClickOpen();
        }
        // insufficient currency
        else if (currency < newBid) {
            console.log('Insufficient currency');
            handleClickOpen();
        }
        else {
            console.log('bid sent!');
            console.log(newBid);
            sendBid(newBid);
            setNewBid("");
        }
    }

    const handleSendBid = () => {
        validateAndSend();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            validateAndSend();
        }
    };

    const handleEndAuction = () => {
        // handleAuctionclose();
        console.log('END');
        endAuction(newBid);
    };

    return (
        <Grid container direction="row" spacing={0} container style={{ height: '84vh', }}>
            <Grid container item xs={3} border={1}>
                <Grid container direction="column">
                    <Grid item xs={1} >
                        <Typography variant="h5" className="header-message" textAlign="center">Item Details</Typography>
                    </Grid>
                    <Grid container item xs={10} >
                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <nav aria-label="main mailbox folders">
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText
                                                primary="Item Name"
                                                secondary={`${auctiondetails['auction_item_name']}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText
                                                primary="Category"
                                                secondary={`${auctiondetails['category']}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText
                                                primary="Description"
                                                secondary={`${auctiondetails['description']}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav>
                            <Divider />
                            <nav aria-label="secondary mailbox folders">
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText
                                                primary="Minimum Increment"
                                                secondary={`${auctiondetails['increment']}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton component="a" href="#simple-list">
                                            <ListItemText primary="Minimum Bid"
                                                secondary={`${auctiondetails['minbid']}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton component="a" href="#simple-list">
                                            <ListItemText primary="Auction end time"
                                                secondary={`${new Date(auctiondetails['end_time']).toLocaleTimeString()}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav>
                        </Box>
                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle>{"Please enter a valid bid!"}</DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Okay</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={auctionclose}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleAuctioncomplete}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle>{"Auction closed!"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {isOwner ? (
                                        
                                        [
                                        (typeof highestBid['highest'] == 'undefined'
                                            ? 'Looks like no one dropped by :('
                                            : 'Congrats, your item has been sold!'
                                        ),
                                        <div key='1'>body</div>
                                        ]
                                    ) : `Winner : ${highestBid['username']}
                                    Sold For : ${highestBid['highest']}
                                    Thank you for joining this auction!`
                                    }

                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleAuctioncomplete}>Okay</Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    {isOwner ? (
                        <Grid container item xs={1}>
                            <Button onClick={handleEndAuction} variant="contained" color="warning" fullWidth sx={{ margin: 1 }}>End Auction</Button>
                        </Grid>
                    ) : (
                        null
                    )}

                </Grid>
            </Grid>
            <Grid item container xs={6} spacing={0} border={1}>
                <Grid container direction="column">
                    <Grid item xs={1} >
                        <Typography variant="h5" className="header-message" textAlign="center">Auction : {auctiondetails['room_display_name']}</Typography>
                        <Typography variant="h5" className="header-message" textAlign="center">Highest Bid: ${highestBid['highest']}</Typography>
                    </Grid>
                    <Grid container item xs={10} alignItems="center" direction="column" justifyContent="center">
                        <Grid item xs={10}>
                            <img
                                src={auctiondetailurl + 'download/' + auctiondetails['_id']}
                                // src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
                                alt="new"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={1}>
                        <Grid item xs={10}>
                            <FormControl fullWidth sx={{ ml: 1, mr: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput onKeyPress={handleKeyPress}
                                    name="bid"
                                    label="bid"
                                    type="bid"
                                    id="bid"
                                    value={newBid}
                                    onChange={handleNewBidChange}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Amount"
                                    autoComplete='off'
                                />
                            </FormControl>
                        </Grid>
                        <Grid container item xs={2} >
                            <Button sx={{ ml: 1, mr: 1, mb: 1 }} onClick={handleSendBid} variant="contained" color={'success'} fullWidth>Bid</Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
            <ChatSection roomId={roomId} messages={messages} sendMessage={sendMessage} />
        </Grid>
    );
}