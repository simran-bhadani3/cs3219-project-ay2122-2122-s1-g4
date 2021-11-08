import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import AuctionCard from '../components/AuctionCard';
import AuctionFilter from '../components/AuctionFilter';
import EButton from '../components/EButton';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(10),
            paddingLeft: theme.spacing(10),
            paddingRight: theme.spacing(10)
        },
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        },
    },
    fullScreenHeight: {
        minHeight: "85vh"
    },
    pl2: {
        paddingLeft: theme.spacing(2)
    },
    pb2: {
        paddingBottom: theme.spacing(2)
    },
    px2: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    topBarStyle: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    },
    alignCenter: {
        textAlign: "center"
    }
}));

function AuctionsPage() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const atLeastMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [isGetAll, setIsGetAll] = useState([]);
    const [auctions, setAuctions] = useState([]);

    const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
    // const dockerAuctionDetailsServer = `https://${process.env.REACT_APP_dockerauctiondetailsserver||'localhost'}/api/auctiondetails`;
    
    

    useEffect(() => {
        axios.get(dockerAuctionDetailsServer)
            .then(res => {
                // console.log("response", res);
                setAuctions(res.data);
            })
            .catch(error => {
                console.log("error", error);
            });
    }, []);

    const onSearch = name => {
        ///////////////////////////////////
        console.log("to search", name);
    };

    const onFilter = values => {
        ///////////////////////////////////
        console.log("to filter", values);
    };


    const goToPage = href => {
        history.push(href);
    }

    const renderTopBar = () => {
        return (
            <Grid container alignItems="center" className={classes.topBarStyle}>
                <Grid item xs={11}>
                    <SearchBar newValue="" onSearch={onSearch} />
                </Grid>
                <Grid item xs={1} className={classes.pl2}>
                    <AuctionFilter onFilter={onFilter} />
                </Grid>
            </Grid>
        );
    };

    const renderEmptyAuctionList = () => {
        return (
            <Grid item alignItems="center" justifyItems="center" className={classes.alignCenter}>
                <Typography variant="h4" className={classes.pb2}>
                    No auction created by any user. Create the first one now!
                </Typography>
                <EButton onClick={() => goToPage("/new")} content="Create an auction now!" />
            </Grid>
        );
    }

    return (
        <Grid className={`${classes.container} ${classes.fullScreenHeight}`}>
            <Grid container alignItems="flex-start">   
                {renderTopBar()}
                <Grid container justifyContent={auctions.length === 0 ? "center" : "flex-start"}>
                    {auctions.length === 0 ? renderEmptyAuctionList() : (
                        auctions.map(item => <AuctionCard item={item} />)
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AuctionsPage;