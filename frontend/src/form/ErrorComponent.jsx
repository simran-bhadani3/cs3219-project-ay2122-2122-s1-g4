import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

const useStyles = makeStyles(theme => ({
    hasError: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
    },
    errorText: {
        color: theme.palette.error.main,
        fontStyle: "italic"
    },
    infoErrorSize: {
        fontSize: theme.spacing(1.8),
        marginRight: theme.spacing(0.5)
    }
}));

function ErrorComponent({ children }) {
    const classes = useStyles();

    return (
        <Grid item>
            <Grid container alignItems="center">
                <InfoRoundedIcon color="error" className={classes.infoErrorSize} />
                <Typography className={classes.errorText}>{children}</Typography>
            </Grid>
        </Grid>
    );
}

export default ErrorComponent;