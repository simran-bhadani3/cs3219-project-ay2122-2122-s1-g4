import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Select, MenuItem } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import ErrorComponent from './ErrorComponent';

const useStyles = makeStyles(theme => ({
    formControl: {
        marginBottom: theme.spacing(2)
    },
    component: {
        display: "block",
        width: "100%",
        height: theme.spacing(6),
        padding: "6px 24px 6px 12px",
        fontSize: "1rem",
        // color: theme.palette.text.primary,
        // backgroundColor: theme.palette.background.default,
        // border: "1px solid",
        borderRadius: "0 !important",
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

// NOT WORKING PROPERLY YET

function SelectField(props) {
    const { label, name, options, placeholder, required = false, hasError = false, ...rest } = props;
    const classes = useStyles();
    const [selectValue, setSelectValue] = useState();

    const updateSelectValue = val => {
        setSelectValue(val);
    }

    const selectField = (label, name, options, placeholder, required = false, hasError = false, ...rest) => {
        return (
            <Grid container>
                <Select
                    labelId={name}
                    id={name}
                    value={selectValue}
                    label="Age"
                    onChange={updateSelectValue}
                    className={`${classes.component} ${hasError && classes.hasError}`}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                </Select>
            </Grid>
        );
    }

    return (
        <Grid container item className={classes.formControl} justitfy="flex-start">
            <Grid container item xs={12} justifyContent="space-between">
                <Grid item>
                    <label htmlFor={name} className={hasError && classes.hasError}>{`${label}${required ? ' *' : ''}`}</label>
                </Grid>
                <ErrorMessage name={name} component={ErrorComponent} />
            </Grid>
            <Field id={name} name={name} placeholder={placeholder} component={selectField} {...rest} />
        </Grid>
    );
}

export default SelectField;