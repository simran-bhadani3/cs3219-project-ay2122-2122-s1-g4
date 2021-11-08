import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Link, Typography, Paper, TextField } from '@mui/material';
import EButton from '../components/EButton';
import AuctionCard from '../components/AuctionCard';
import { pagesLoggedIn } from '../resources/constants';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
            paddingLeft: theme.spacing(12),
            paddingRight: theme.spacing(12)
        },
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4)
        }
    },
    p4: {
        padding: theme.spacing(4)
    },
    fullScreenHeight: {
        minHeight: "85vh"
    },
    pb2: {
        paddingBottom: theme.spacing(2)
    },
    pb4: {
        paddingBottom: theme.spacing(4)
    },
    pt5: {
        paddingTop: theme.spacing(5)
    },
    pt8: {
        paddingTop: theme.spacing(8)
    },
    fullWidth: {
        width: "100%"
    },
    pageRecommendStyle: {
        paddingLeft: theme.spacing(4)
    },
    mb4: {
        marginBottom: theme.spacing(4)
    },
    py3: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    textFont2rem: {
        fontSize: "1.5rem !important"
    }
}));

function ProfilePage() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const atLeastMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
    // const dockerUserServer = 'http://localhost:8080/api/user/user';
    const dockerUserServer = `https://${process.env.REACT_APP_dockerauthserver||'localhost'}/api/user/user`;
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [currency, setCurrency] = useState(0);
    const [openAddValueDialog, setOpenAddValueDialog] = useState(false);
    const [auctions, setAuctions] = useState([]);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        getProfile();
    }, [openAddValueDialog]);

    const getProfile = () => {
        const jwt = localStorage.getItem('user').toString();
        const userConfig = {
            headers: {
               "Authorization": jwt.substr(1, jwt.length - 2)
            }
        };
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('user');
        axios.get(dockerUserServer, userConfig)
            .then(res => {
                // console.log("response", res);
                setUserName(res.data.userid.username);
                setEmail(res.data.userid.email);
                setCurrency(res.data.userid.currency);
            })
            .catch(error => {
                console.log("error", error);
            });
    };

    const renderValueLabel = (value, label) => {
        return (
            <Grid item xs={12}>
                <Typography variant="body1" color="primary">{label}</Typography>
                <Typography variant="body1" className={classes.textFont2rem}>{value}</Typography>
            </Grid>
        )
    };

    const handleOpenAddValueDialog = () => {
        setOpenAddValueDialog(true);
    };

    const handleCloseAddValueDialog = () => {
        setOpenAddValueDialog(false);
    };

    const onConfirmAddValue = e => {
        // process add currency
        console.log(e);
        handleCloseAddValueDialog();
    }

    const renderAddValueDialog = () => {
        return (
            <Dialog open={openAddValueDialog} onClose={handleCloseAddValueDialog} maxWidth="lg">
                <DialogTitle>Add Amount</DialogTitle>
                <DialogContent>
                    <DialogContentText>Input the amout that you would like to add into your account.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <EButton content="Confirm" onClick={onConfirmAddValue} />
                </DialogActions>
            </Dialog>
        );
    }

    const renderPagesButton = () => {
        return (
            <Grid item container xs={12} md={6} lg={4} className={classes.pageRecommendStyle}>   
                <Paper variant="outlined" elevation={20} className={`${classes.fullWidth} ${classes.mb4}`}>
                    <Grid item container className={classes.p4} direction="column" justifyContent="center" alignItems="center">
                        {pagesLoggedIn.map(({ href, label , icon}) => {
                            if (!icon && label !== "Profile") {
                                return (
                                    <Grid item className={classes.py3}>
                                        <EButton 
                                            content={label} 
                                            variant="outlined"
                                            onClick={() => history.push(href)}
                                        />
                                    </Grid>
                                );
                            }
                        })}
                    </Grid>
                </Paper>
            </Grid>
        );
    };

    const renderEmail = () => {
        return (
            <Paper variant="outlined" elevation={20} className={`${classes.fullWidth} ${classes.mb4}`}>
                <Grid container className={classes.p4}>
                    {renderValueLabel(email, "Email:")}
                </Grid>
            </Paper>
        );
    };

    const renderCurrency = () => {
        return (
            <Paper variant="outlined" elevation={20} className={`${classes.fullWidth} ${classes.mb4}`}>
                <Grid container className={classes.p4} justifyContent="space-between">
                    <Grid container item xs={12} md={6} className={!atLeastMediumScreen && classes.pb2}>
                        {renderValueLabel(`$ ${currency}`, "Amount:")}
                    </Grid>
                    <Grid container item xs={12} md={6} justifyContent={atLeastMediumScreen ? "flex-end" : "flex-start"}>
                        <EButton content="Add value" onClick={handleOpenAddValueDialog} />
                        {renderAddValueDialog()}
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    return (
        <Grid className={`${classes.root} ${classes.container} ${classes.fullScreenHeight}`}>
            <Grid item container xs={12} alignItems="flex-start" className={classes.pb4}>  
                <Typography variant="h1">Welcome back, {userName}</Typography>
            </Grid>   
            <Grid container alignItems="flex-start">
                <Grid item container xs={12} md={6} lg={8} alignItems="flex-start">   
                    {renderEmail()}
                    {renderCurrency()}
                </Grid>
                {atLeastMediumScreen && renderPagesButton()}
            </Grid> 

            <Grid item container xs={12} alignItems="flex-start" className={`${classes.pb4} ${classes.pt5}`}>  
                <Typography variant="h2" color="primary">Auctions I created</Typography>
            </Grid> 
            <Grid container alignItems="flex-start">
                {auctions.length === 0 ? (
                        <Typography variant="h4">No auctions created currently. <Link href="/new">Create one now!</Link></Typography>
                    ) : (
                        auctions.map(item => <AuctionCard item={item} />)
                )}
            </Grid> 

            <Grid item container xs={12} alignItems="flex-start" className={`${classes.pb4} ${classes.pt8}`}>  
                <Typography variant="h2" color="primary">My Successful Bids</Typography>
            </Grid> 
            <Grid container alignItems="flex-start">
                {bids.length === 0 ? (
                        <Typography variant="h4">No successful bid currently. <Link href="/all">View all auctions now!</Link></Typography>
                    ) : (
                        bids.map(item => <AuctionCard item={item} />)
                )}
            </Grid> 
        </Grid>
    )
}

export default ProfilePage;