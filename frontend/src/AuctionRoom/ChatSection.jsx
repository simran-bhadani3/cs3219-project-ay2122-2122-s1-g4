import React from "react";
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
import MessageCard from './chat/MessageCard';
import useChat from "./useChat";

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
  },
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    width: '100%',
    overflowY: 'auto'
  }
});


function ChatSection(props) {
  const classes = useStyles();
  const roomId = props.roomId; // Gets roomId from URL
  // const { messages, sendMessage, bids, sendBid} = useChat(roomId); // Creates a websocket and manages messaging
  const { messages, sendMessage } = { messages: props.messages, sendMessage: props.sendMessage };
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent


  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log('message sent!');
    console.log(newMessage);
    sendMessage(newMessage);
    setNewMessage("");
  };



  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log('message sent!');
      console.log(newMessage);
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <Grid container item xs={3}>
      <Grid container direction="column">
        <Grid item xs={1} >
          <Typography variant="h5" className="header-message" textAlign="center">Chat</Typography>
        </Grid>
        <Grid container item xs={10} name="chat section" >
          <List className={classes.messageArea}>
            {messages.map((message, i) => (
              <MessageCard key={i} data={message} index={i} />
            ))}
          </List>
        </Grid>
        <Grid container item xs={1}>
          <Grid container item xs={10} >
            <TextField value={newMessage} sx={{ ml:1, mr: 1}}
              onChange={handleNewMessageChange} onKeyPress={handleKeyPress} id="message" label="Type Something" fullWidth autoComplete='off' />
          </Grid>
          <Grid item xs={1}>
            <Fab margin = {0} onClick={handleSendMessage} color="primary" aria-label="add"><SendIcon /></Fab>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatSection;
