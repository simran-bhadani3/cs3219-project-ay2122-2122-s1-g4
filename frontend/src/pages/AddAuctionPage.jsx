import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Grid, FormControl, InputLabel, MenuItem, Typography, TextField, Select } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import EButton from '../components/EButton';
import { categoryList } from '../resources/constants';
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
    mt2: {
        marginTop: "16px !important"
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
    // const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
    const dockerAuctionDetailsServer = `https://${process.env.REACT_APP_dockerauctiondetailsserver||'localhost'}/api/auctiondetails`;
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

    const initialValues = {
        room_display_name: "",
        auction_item_name: "",
        start_time: new Date(),
        end_time: new Date(),
        minbid: 0,
        increment: 0,
        category: "",
        description: ""
    };

    async function onSubmit(values) {
        const userId = JSON.parse(localStorage.getItem('userid'));
        // console.log("userid:", userId);
        const data = {
            ...values,
            owner_id: userId || '6177fd6569855c2c37d931f4' // dummy userId
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

    const auctionYupSchema = yup.object().shape({
        room_display_name: yup.string()
            .min(1, 'Too Short!')
            .max(200, 'Too Long!')
            .required('Room Display Name is required'),
        auction_item_name: yup.string()
            .min(1, 'Too Short!')
            .max(200, 'Too Long!')
            .required('Auction Item Name is required'),
        start_time: yup.date()
            .required('Start Time is required'),
        end_time: yup.date()
            .min(yup.ref('start_time'),  "End time can't be before Start time")
            .required('End Time is required'),
        minbid: yup.number()
            .min(0)
            .required('Starting Bid is required'),
        increment: yup.number()
            .min(0)
            .required('Minimum Bid Increment is required'),
        category: yup.string()
            .oneOf(categoryList)
            .required('Category is required'),
        description: yup.string()
            .min(1, 'Too Short!')
            .max(500, 'Too Long!')
            .notRequired()
            .nullable()
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: auctionYupSchema,
        onSubmit: async values => {
            await onSubmit(values);
        },
    });

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

    const renderErrorMsg = id => {
        return formik.errors[id] && (
            <div style={{ color: theme.palette.error.main }}>{formik.errors[id]}</div> 
        );
    };

    const renderTextField = (id, label, md=6, minRows=1, type="string", required=true) => {
        return (
            <Grid item xs={12} md={md}>
                <TextField
                    margin="normal"
                    required={required}
                    type={type}
                    fullWidth
                    multiline={minRows > 1}
                    minRows={minRows}
                    id={id}
                    label={label}
                    name={id}
                    autoComplete={id}
                    autoFocus
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                />
                {renderErrorMsg(id)}
            </Grid>
        );
    };

    const renderDateTimeField = (id, label) => {
        return (
            <Grid item xs={12} sm={6} md={3}>
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    required
                    id={id}
                    name={id}
                    label={label}
                    value={formik.values[id]}
                    onChange={val => {
                        formik.setFieldValue(id, val);
                    }}
                    minutesStep={5}
                />
                {renderErrorMsg(id)}
            </Grid>
        );
    };

    const renderDropdownField = (id, label, options) => {
        return (
            <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                    <InputLabel id={`${id}-label`}>{label}</InputLabel>
                    <Select
                        labelId={`${id}-label`}
                        id={id}
                        name={id}
                        value={formik.values[id]}
                        label={label}
                        onChange={val => {
                            console.log(val.target.value, val)
                            formik.setFieldValue(id, val.target.value);
                        }}
                    >
                        {options.map(cat => <MenuItem value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
                {renderErrorMsg(id)}
            </Grid>
        );
    }

    const renderForm = () => {
        return (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    {renderTextField("room_display_name", "Room Display Name")}
                    {renderTextField("auction_item_name", "Auction Item Name")}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {renderDateTimeField("start_time", "Start Time")}
                        {renderDateTimeField("end_time", "End Time")}
                    </LocalizationProvider>
                    {renderDropdownField("category", "Category", categoryList)}
                    {renderTextField("minbid", "Starting Bid", 6, 1, "number")}
                    {renderTextField("increment", "Minimum Bid Increment", 6, 1, "number")}
                    {renderTextField("description", "Description", 12, 3, "string", false)}
                    <Grid item xs={12}>
                        <EButton
                            type="submit"
                            variant="contained"
                            className={classes.mt2}
                            content="Add Auction"
                        />
                    </Grid>
                </Grid>
            </Box>
        );
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
                            {renderForm()}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}

export default AddAuctionPage;