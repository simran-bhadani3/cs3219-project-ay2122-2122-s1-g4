import React from 'react';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';

const commonStyles = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    width: '5rem',
    height: '5rem',
};

export default function BidCard(props) {
    // return <div>My name is: {name}</div>
    // senderId should be username
    return (<ListItem key={props.index}>
        <Grid container >
            <Grid item xs={6} sx={{ ...commonStyles, border: 1, borderRadius: 1, padding: 1 }} >
                {props.data.length === 0 ?
                    <ListItemText align="left" primary={"Bid:" + " " + "No bids"}></ListItemText> :
                    <ListItemText align="left" primary={"Bid:" + " " + props.data.at(-1).body}></ListItemText>}
            </Grid>
            <Grid item xs={12}>
                {props.data.length === 0 ?
                    <ListItemText align="left" secondary={props.data.timestamp + " " + props.data.senderId}></ListItemText> :
                    <ListItemText align="left" secondary={props.data.at(-1).timestamp + " " + props.data.at(-1).senderId}></ListItemText>}
            </Grid>
        </Grid>
    </ListItem>);
}