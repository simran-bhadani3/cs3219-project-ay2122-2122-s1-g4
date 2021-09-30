import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import EButton from '../components/EButton';
import { pagesLoggedIn } from '../resources/constants';

const useStyles = makeStyles(theme => ({
    fullScreenHeight: {
        minHeight: "85vh"
    },
    textAlignCenter: {
        textAlign: "center"
    },
    mb2: {
        margin: "0 0 32px 0 !important",
    },
    my1: {
       margin: "8px !important"
    },
    mx2: {
        margin: "16px !important"
     }
}));

function NotFoundPage() {
    const classes = useStyles();
    let history = useHistory();

    const theme = useTheme();
    const atLeastMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const goToPage = href => {
        history.push(href);
    }

    const renderPagesButton = () => {
        return pagesLoggedIn.map(({ href, label , icon}) => {
            if (!icon) {
                return (
                    <EButton 
                        content={label} 
                        variant="contained"
                        className={!atLeastMediumScreen && `${classes.mx2} ${classes.my1}`} 
                        size={atLeastMediumScreen ? "small" : "large"} 
                        onClick={() => goToPage(href)} />
                );
            }
        });
    }

    return (
        <Grid container alignItems="center" justifyContent="center" className={classes.fullScreenHeight}>
            <Grid container sm={12} md={11} justifyContent="center" alignItems="center">
                <Grid item xs={12} justifyContent="center" alignItems="center">
                    <Typography variant="h1" className={`${classes.textAlignCenter} ${classes.mb2}`}>
                        Looking for any of the pages?
                    </Typography>
                </Grid>
                <Grid item container xs={11} sm={10} md={9} lg={6} justifyContent={atLeastMediumScreen ? "space-between" : "center"}>
                    {renderPagesButton()}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default NotFoundPage;