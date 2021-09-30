import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import ErrorComponent from './ErrorComponent';

const useStyles = makeStyles(theme => ({
    formControl: {
        marginBottom: theme.spacing(2)
    },
    component: {
        display: "block",
        width: "100%",
        height: theme.spacing(13),
        padding: theme.spacing(1.5),
        fontSize: "1rem",
        lineHeight: "160%",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        border: "1px solid",
        borderColor: theme.palette.primary.main,
        '&:focus': {
            outline: "none",
            borderRadius: "0 !important",
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            boxShadow: "0 0 4px #E2DEE5"
        }
    },
    hasError: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        '&:focus': {
            borderColor: theme.palette.error.dark,
            backgroundColor: theme.palette.error[50],
            boxShadow: "0 0 4px #FEF8F8"
        }
    }
}));

function TextArea(props) {
    const { label, name, placeholder, required = false, hasError = false, ...rest } = props;
    const classes = useStyles();

    return (
        <Grid container item className={classes.formControl} justitfy="flex-start">
            <Grid container item xs={12} justifyContent="space-between">
                <Grid item>
                    <label htmlFor={name} className={hasError && classes.hasError}>{`${label}${required ? ' *' : ''}`}</label>
                </Grid>
                <ErrorMessage name={name} component={ErrorComponent} />
            </Grid>
            <Field as='textarea' id={name} name={name} placeholder={placeholder} cols={3} className={`${classes.component} ${hasError && classes.hasError}`} {...rest} />
        </Grid>
    );
}

export default TextArea;