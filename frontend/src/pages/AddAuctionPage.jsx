import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import EButton from '../components/EButton';
import FormElement from '../form/FormElement';
import { textAlign } from '@mui/system';

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

    const theme = useTheme();
    const atLeastScreenSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [isSubmitted, setIsSubmitted] = useState(false);

    const initialValues = { 
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    };

    const onSubmit = (values) => {
        // send to backend and save
    };

    const contactYupSchema = yup.object().shape({
        firstName: yup.string()
            .min(1, 'Too Short!')
            .max(50, 'Too Long!')
            .required('First name is required'),
        lastName: yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .notRequired()
            .nullable(),
        email: yup.string().email('Invalid email').required('Email is required'),
        phone: yup.string().notRequired().nullable(),
        subject: yup.string()
            .min(1, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Subject is required'),
        message: yup.string()
            .min(1, 'Too Short!')
            .max(500, 'Too Long!')
            .required('Message is required'),
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

    const renderForm = formikBag => {
        const { touched, errors } = formikBag;
        return (
            <Form>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid container item xs={11} sm={10} lg={8}>
                        <Grid container item justifyContent="space-between">
                            <Grid item xs={12} sm={6} className={atLeastScreenSmall && classes.pr1}>
                                <FormElement 
                                    name="auctionName" 
                                    type="text" 
                                    label="Auction Name"
                                    hasError={touched.auctionName && errors.auctionName} 
                                    required 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} className={atLeastScreenSmall && classes.pl1}>
                                <FormElement 
                                    name="itemName" 
                                    type="text" 
                                    label="Item Name"
                                    hasError={touched.itemName && errors.itemName} 
                                    required 
                                />
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="space-between">
                            <Grid item xs={12} sm={6} className={atLeastScreenSmall && classes.pr1}>
                                <FormElement 
                                    name="email" 
                                    type="email" 
                                    label="Email"
                                    control="select"
                                    options={[{ value: "idk", label: "idk man" }]}
                                    hasError={touched.email && errors.email} 
                                    required 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} className={atLeastScreenSmall && classes.pl1}>
                                <FormElement name="phone" label="Phone" />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12}>
                                <FormElement   
                                    name="description" 
                                    type="text" 
                                    label="Description" 
                                    control="textarea"
                                    hasError={touched.description && errors.description} 
                                    required 
                                />
                            </Grid>
                        </Grid>
                        <Grid container item justify={atLeastScreenSmall ? "flex-end": "center"} className={`${classes.mt2} ${classes.mb5}`}>
                            <EButton content="Submit" type="submit" />
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
        );
    };

    return (
        <Grid justifyContent="center" container className={classes.fullScreenHeight}>
            {isSubmitted ? (
                <Grid container item xs={11} justifyContent="center" alignItems="center" className={classes.textAlignCenter}>
                    {renderHeader("Auction has been successfully added!")}
                </Grid>
            ) : (
                <Grid container item xs={11} justifyContent="center" alignItems="center" className={classes.textAlignCenter}>
                    <Grid container>
                        {renderHeader("Create a new auction")}
                        <Grid item xs={12} className={atLeastScreenSmall ? classes.mt5 : classes.mt2}>
                            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={contactYupSchema}>
                                {formikBag => renderForm(formikBag)}
                            </Formik>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}

export default AddAuctionPage;