import { React, useEffect, useState} from "react";
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
    const { messages, sendMessage, bids, sendBid, status, endAuction } = useChat(roomId);
    const [newBid, setNewBid] = useState("");
    let history = useHistory();
    const classes = useStyles();

    //redirect to home page if auction ends
    useEffect(() => {
        if (!status) {
            history.push("/all");
        };
    });


    const [values, setValues] = useState({
        amount: '',
    });

    const handleNewBidChange = (event) => {
        setNewBid(event.target.value);
    };
    // sendBid(newBid);
    const handleSendBid = () => {
        console.log('bid sent!');
        console.log(newBid);
        sendBid(newBid);
        setNewBid("");
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('bid sent!');
            console.log(newBid);
            sendBid(newBid);
            setNewBid("");
        }
    };

    const handleEndAuction = () => {
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
                                                secondary='Sample Text'
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemText
                                                primary="Details"
                                                secondary='Secondary text'
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
                                            <ListItemText primary="Trash" />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton component="a" href="#simple-list">
                                            <ListItemText primary="Spam" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav>
                        </Box>
                    </Grid>
                    <Grid container item xs={1}>
                        <Button onClick={handleEndAuction} variant="contained" color="warning" fullWidth sx={{ margin: 1 }}>End Auction</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container xs={6} spacing={0} border={1}>
                <Grid container direction="column">
                    <Grid item xs={1} >
                        <Typography variant="h5" className="header-message" textAlign="center">Item Details</Typography>
                    </Grid>
                    <Grid container item xs={10} >
                    </Grid>
                    <Grid container item xs={1}>
                        <Grid item xs={10}>
                            <FormControl fullWidth sx={{ ml: 1, mr: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput onKeyPress={handleKeyPress}
                                    id="outlined-adornment-amount"
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