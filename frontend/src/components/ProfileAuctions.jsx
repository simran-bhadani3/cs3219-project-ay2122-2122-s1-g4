import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import SwipeableViews from "react-swipeable-views";
import { Box, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import AuctionCard from './AuctionCard';

const useStyles = makeStyles(theme => ({
    pt4: {
        paddingTop: theme.spacing(4)
    },
    py1: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    tabs: {
        backgroundColor: theme.palette.background.paper,
        borderTop: "1rem"
    }
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function ProfileAuctions({ auctions, bids, updateAuctions, className }) {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const renderTabLabel = label => {
        return <Typography className={classes.py1} variant="h6" color="primary">{label}</Typography>;
    }

    return (
        <Grid>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                aria-label="profile tabs"
                variant="fullWidth"
                className={classes.tabs}
            >
                <Tab label={renderTabLabel("Manage my Auctions")} />
                <Tab label={renderTabLabel("My Successful Bids")} />
            </Tabs>

            <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
                <TabPanel value={0} index={0}>
                    {/* <Grid item container xs={12} alignItems="flex-start" className={`${classes.pb4} ${classes.pt4}`}>  
                        <Typography variant="h2" color="primary">Auctions I created</Typography>
                    </Grid> */}
                    <Grid container alignItems="flex-start" className={classes.pt4}>
                        {auctions.length === 0 ? (
                                <Typography variant="h4">No auctions created currently. <Link href="/new">Create one now!</Link></Typography>
                            ) : (
                                auctions.map(item => <AuctionCard item={item} isEditDelete updateAuctions={updateAuctions} />)
                        )}
                    </Grid> 
                </TabPanel>

                <TabPanel value={value} index={1}>
                    {/* <Grid item container xs={12} alignItems="flex-start" className={`${classes.pb4} ${classes.pt8}`}>  
                        <Typography variant="h2" color="primary">My Successful Bids</Typography>
                    </Grid> */}
                    <Grid container alignItems="flex-start" className={classes.pt4}>
                        {bids.length === 0 ? (
                                <Typography variant="h4">No successful bid currently. <Link href="/all">View all auctions now!</Link></Typography>
                            ) : (
                                bids.map(item => <AuctionCard item={item} isEditDelete />)
                        )}
                    </Grid> 
                </TabPanel>
            </SwipeableViews>
        </Grid>
    );
}

export default ProfileAuctions;