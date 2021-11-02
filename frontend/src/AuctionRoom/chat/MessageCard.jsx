import React from 'react';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Box from '@mui/material/Box';

const commonStyles = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    width: '5rem',
    height: '5rem',
};

export default function MessageCard(props) {
    // return <div>My name is: {name}</div>
    // senderId should be username
    return (<ListItem key={props.index}>
        <Grid container >
            <Grid item xs={6} sx={{ ...commonStyles, border: 0, borderRadius: 1, padding: 0, flexWrap: 'wrap' }} >
                <Box component="div" sx={{ wordWrap: 'break-word' ,overflow: 'auto', border: 1, borderRadius: 1, padding: 0, display: 'inline', width: 'auto'}}>{props.data.body}</Box>
                {/* <ListItemText align="left" primary={props.data.body}>
                    <TextField multiline fullWidth row={1} primary={props.data.body} />
                </ListItemText> */}
            </Grid>
            <Grid item xs={12}>
                <ListItemText align="left" secondary={
                    props.data.timestamp + " " + props.data.username.replace(/['"]+/g, '')}>
                </ListItemText>
            </Grid>
        </Grid>
    </ListItem >);
}