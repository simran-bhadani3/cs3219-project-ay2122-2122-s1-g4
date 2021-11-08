import React from 'react';
import { makeStyles } from '@mui/styles';
import { Divider, Grid, Link, Typography } from '@mui/material';
import AuctionCard from './AuctionCard';

const useStyles = makeStyles(theme => ({
    pt4: {
        paddingTop: theme.spacing(4)
    },
    pb2: {
        paddingBottom: theme.spacing(2)
    }
}));

function ProfileAuctions({ auctions, bids, updateAuctions, className }) {
    const classes = useStyles();

    return (
        <Grid>
            <Grid item container xs={12} alignItems="flex-start" className={`${classes.pb2} ${classes.pt4}`}>  
                <Typography variant="h2" color="primary">Manage Auctions</Typography>
            </Grid>
            <Divider />
            <Grid container alignItems="flex-start" className={classes.pt4}>
                {auctions.length === 0 ? (
                        <Typography variant="h4">No auctions created currently. <Link href="/new">Create one now!</Link></Typography>
                    ) : (
                        auctions.map(item => <AuctionCard item={item} isEditDelete updateAuctions={updateAuctions} />)
                )}
            </Grid> 
        </Grid>
    );
}

export default ProfileAuctions;