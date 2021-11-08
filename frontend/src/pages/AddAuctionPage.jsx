import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import AuctionForm from '../components/AuctionForm';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    fullScreenHeight: {
        minHeight: "90vh"
    },
    headerStyle: {
        textAlign: "center",
        color: theme.palette.primary.main
    },
    mb5: {
        marginBottom: "40px !important"
    },
    mt3: {
        marginTop: "24px !important"
    },
    mt5: {
        marginTop: "40px !important"
    },
    pl1: {
        paddingLeft: "8px !important"
    },
    pr1: {
        paddingRight: "8px !important"
    }
}));

function AddAuctionPage() {
    const classes = useStyles();
    const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
    // const dockerAuctionDetailsServer = `https://${process.env.REACT_APP_dockerauctiondetailsserver||'localhost'}/api/auctiondetails`;
    const history = useHistory();
    const theme = useTheme();
    const atLeastScreenSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            setTimeout(() => setCountdown(countdown - 1), 1000);
        }
    });

    async function onSubmit(values) {
        const userId = JSON.parse(localStorage.getItem('userid'));
        const data = {
            ...values,
            owner_id: userId
        }

        // console.log("onSubmit: ", data);
        // console.log("dockerAuctionDetailsServer", dockerAuctionDetailsServer);

        await axios.post(dockerAuctionDetailsServer, data)
            .then(response => {
                setIsSubmitted(true);
                setCountdown(5);
                // redirect to home page in 5 seconds
                setTimeout(function() {
                    history.push("/all");
                }, 5000);
            })
            .catch(function (error) {
                console.log("error", error);
            });
    };

    const renderHeader = (header) => {
        return (
            <Grid item xs={12} className={classes.mt3}>
                <Typography variant="h1" className={classes.headerStyle}>
                    {header}
                </Typography>
            </Grid>
        );
    };

    const renderCountdown = () => {
        return (
            <Typography>You will be redirected to the homepage in {countdown} seconds.</Typography>
        )
    };

    return (
        <Grid justifyContent="center" container className={classes.fullScreenHeight}>
            {isSubmitted ? (
                <Grid container item xs={11} justifyContent="center" alignItems="center" className={classes.textAlignCenter}>
                    {renderHeader("Auction has been successfully added!")}
                    {renderCountdown()}
                </Grid>
            ) : (
                <Grid container item xs={11} justifyContent="center" alignItems="center" className={classes.textAlignCenter}>
                    <Grid container>
                        {renderHeader("Create a New Auction")}
                        <Grid item xs={12} className={atLeastScreenSmall ? classes.mt5 : classes.mt2}>
                            <AuctionForm onSubmit={onSubmit} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}

export default AddAuctionPage;