import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterListIcon from '@mui/icons-material/FilterList';

const useStyles = makeStyles(theme => ({
    
}));

function AuctionFilter({ newValue="", onFilter }) {
    const classes = useStyles();

    const openFilterPopup = () => {
        console.log("openFilterPopup");
    }
    
    return (
        <IconButton
            aria-label="filter auction"
            onClick={openFilterPopup}
            onMouseDown={openFilterPopup}
        >
            <FilterListIcon fontSize="large" />
        </IconButton>
    );
}

export default AuctionFilter;