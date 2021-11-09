import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { makeStyles } from '@mui/styles';
import { useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Typography, Paper, TextField } from '@mui/material';
import EButton from '../components/EButton';
import ProfileAuctions from '../components/ProfileAuctions';
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

    const userId = JSON.parse(localStorage.getItem('userid'));
    const dockerUserServer = 'http://localhost:8080/api/user/user';
    // const dockerUserServer = `https://${process.env.REACT_APP_dockerauthserver||'localhost'}/api/user/user`;
    const dockerAuctionDetailsServer = `http://localhost:4000/api/auctiondetails/user/${userId}`;
    // const dockerAuctionDetailsServer = `https://${process.env.REACT_APP_dockerauctiondetailsserver||'localhost/api/auctiondetails/'}user/${userId}`;

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [currency, setCurrency] = useState(0);
    const [openAddValueDialog, setOpenAddValueDialog] = useState(false);
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        getProfile();
        getAuctions();
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

    const getAuctions = () => {
        axios.get(dockerAuctionDetailsServer)
            .then(res => {
                console.log("auction response", res);
                setAuctions(res.data);
            })
            .catch(error => {
                console.log("error", error);
            });
    }

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

    const onSubmitAddValue = async values => {
        // process add currency
        const dockerCurrencyServer = `http://localhost:3003/api/currency/add/${userId}`;
        // const dockerCurrencyServer = `https://${process.env.REACT_APP_dockercurrencymanagementserver||'localhost/api/currency/'}add/${userId}`;
        console.log("onSubmitAddValue", values, userId);
        await axios.put(dockerCurrencyServer, values)
            .then(res => {
                console.log("currency updated successfully", res);
            })
            .catch(err => {
                console.log("error", err);
            });
        formik.setFieldValue("currency", null);
        handleCloseAddValueDialog();
    }

    const initialValues = { currency: null };
    const currencyYupSchema = yup.object().shape({
        currency: yup.number()
            .min(0)
            .required('Currency is required')
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: currencyYupSchema,
        onSubmit: async values => {
            await onSubmitAddValue(values);
        },
    });

    const renderAddValueDialog = () => {
        return (
            <Dialog open={openAddValueDialog} onClose={handleCloseAddValueDialog} maxWidth="lg">
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <DialogTitle>Add Amount</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.pb2}>
                            Input the amout that you would like to add into your account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="currency"
                            name="currency"
                            label="Amount"
                            type="number"
                            fullWidth
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.currency}
                        />
                    </DialogContent>
                    <DialogActions>
                        <EButton content="Confirm" type="submit" />
                    </DialogActions>
                </Box>
            </Dialog>
        );
    };

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
            {<ProfileAuctions auctions={auctions} updateAuctions={getAuctions} />}
        </Grid>
    );
}

export default ProfilePage;