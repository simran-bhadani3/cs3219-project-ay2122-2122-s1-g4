import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';

const useStyles = makeStyles(theme => ({
    toolBar: {
        justifyContent: "center"
    }
}));

function Footer() {
    const classes = useStyles();

    return (
        <AppBar position="static" id="footer">
            <Toolbar className={classes.toolBar}>
              <Typography variant="body1" color="inherit">
                © e-Auction by CS3219 Team 4
              </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Footer;