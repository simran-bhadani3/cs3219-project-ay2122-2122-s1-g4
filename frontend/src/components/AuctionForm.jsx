import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Box, Grid, FormControl, InputLabel, MenuItem, TextField, Select } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import EButton from '../components/EButton';
import ImageCropper from '../components/ImageCropper';
import DropdownField from '../components/DropdownField';
import { categoryList } from '../resources/constants';

const useStyles = makeStyles(theme => ({
    mt2: {
        marginTop: "16px !important"
    }
}));

function AuctionForm({ onSubmit, updateImage, isEdit=false, currValues={} }) {
    const classes = useStyles();
    const theme = useTheme();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const initialValues = {
        room_display_name: "",
        auction_item_name: "",
        start_time: new Date(),
        end_time: tomorrow,
        minbid: 0,
        increment: 0,
        category: "",
        description: ""
    };

    const auctionYupSchema = yup.object().shape({
        room_display_name: yup.string()
            .min(1, 'Too Short!')
            .max(200, 'Too Long! (Maximum 200 characters)')
            .required('Room Display Name is required'),
        auction_item_name: yup.string()
            .min(1, 'Too Short!')
            .max(200, 'Too Long! (Maximum 200 characters)')
            .required('Auction Item Name is required'),
        start_time: yup.date()
            .required('Start Time is required'),
        end_time: yup.date()
            .min(yup.ref('start_time'),  "End time can't be before Start time")
            .required('End Time is required'),
        minbid: yup.number()
            .min(0, "Starting Bid cannot be negative.")
            .required('Starting Bid is required'),
        increment: yup.number()
            .min(0, "Increment amount cannot be negative.")
            .required('Minimum Bid Increment is required'),
        category: yup.string()
            .oneOf(categoryList)
            .required('Category is required'),
        description: yup.string()
            .min(1, 'Too Short!')
            .max(500, 'Too Long! (Maximum 500 characters)')
            .notRequired()
            .nullable()
    });

    const formik = useFormik({
        initialValues: Object.keys(currValues).length > 0 ? currValues : initialValues,
        validationSchema: auctionYupSchema,
        onSubmit: async values => {
            await onSubmit(values);
        },
    });

    const renderImageField = () => {
        return (
            <Grid item xs={12}>
                <ImageCropper imageUrl={currValues?.img} updateImage={updateImage}/>
            </Grid>
        );
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

    return (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                {renderTextField("room_display_name", "Room Display Name")}
                {renderTextField("auction_item_name", "Auction Item Name")}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {renderDateTimeField("start_time", "Start Time")}
                    {renderDateTimeField("end_time", "End Time")}
                </LocalizationProvider>
                <DropdownField 
                    id="category" 
                    label="Category" 
                    options={categoryList} 
                    renderError={renderErrorMsg}
                    formik={formik}
                />
                {renderTextField("minbid", "Starting Bid", 6, 1, "number")}
                {renderTextField("increment", "Minimum Bid Increment", 6, 1, "number")}
                {renderTextField("description", "Description", 12, 3, "string", false)}
                {renderImageField()}
                <Grid item xs={12}>
                    <EButton
                        type="submit"
                        variant="contained"
                        className={classes.mt2}
                        content={isEdit ? "Edit Auction" : "Add Auction"}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AuctionForm;