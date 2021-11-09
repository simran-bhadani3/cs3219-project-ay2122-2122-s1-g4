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
    const history = useHistory();
    const theme = useTheme();
    const atLeastScreenSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (countdown > 0) {
            setTimeout(() => setCountdown(countdown - 1), 1000);
        }
    });

    async function onSubmit(values) {
        const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
        // const dockerAuctionDetailsServer = `https://${process.env.REACT_APP_dockerauctiondetailsserver||'localhost/api/auctiondetails'}`;
        const dockerAuctionRoomServer = 'http://localhost:3003/api/room/newroom';
        // const dockerAuctionRoomServer = `https://${process.env.REACT_APP_dockerauctionroomserver||'localhost/api/room/newroom'}`;

        let auctionId = "";
        const userId = JSON.parse(localStorage.getItem('userid'));

        // Upload details (exclude images)
        const formData = { ...values, owner_id: userId };
        await axios.post(dockerAuctionDetailsServer, formData)
            .then(res => {
                auctionId = res.data._id;
                console.log("form added successfully", res);
            })
            .catch(function (error) {
                console.log("error", error);
            });

        // Create auction room
        const roomData = { roomname: auctionId, owner: userId };
        await axios.post(dockerAuctionRoomServer, roomData)
            .then(res => {
                console.log("auction room created successfully", res);
                setIsSubmitted(true);
                setCountdown(5);
                setTimeout(function() {
                    history.push("/all");
                }, 5000);
            })
            .catch(err => {
                console.log("error", err, roomData);
            });

        // unable to upload images: the function below takes very long to load, need to check!
        // const imgBodyFormData = new FormData();
        // imgBodyFormData.append('id', auctionId);
        // imgBodyFormData.append('file', image);
        // await axios({
        //     method: "post",
        //     url: `${dockerAuctionDetailsServer}/upload/`,
        //     data: imgBodyFormData,
        //     headers: { "Content-Type": "multipart/form-data" },
        // })
        //     .then(response => {
        //         console.log("image uploaded successfully", response);
        //         setIsSubmitted(true);
        //         setCountdown(5);
        //         setTimeout(function() {
        //             history.push("/all");
        //         }, 5000);
        //     })
        //     .catch(function (error) {
        //         console.log("image upload error", error);
        //     });
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
                            <AuctionForm onSubmit={onSubmit} updateImage={setImage} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}

export default AddAuctionPage;