import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, IconButton, InputLabel, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const useStyles = makeStyles(theme => ({

}));

function SearchBar({ newValue="", onSearch }) {
    const [currValue, setCurrValue] = useState("");

    const enterKeyPress = e => {
        if (e.keyCode === 13) {
            console.log('enterKeyPress: ', e.target.value);
            onSearch(e.target.value);
         }
    };

    return (
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-search">
                <Typography variant="body1">Search Auctions</Typography>
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-search"
                value={currValue}
                onChange={e => setCurrValue(e.target.value)}
                onKeyDown={enterKeyPress}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="search auction"
                        onClick={() => onSearch(currValue)}
                        onMouseDown={() => onSearch(currValue)}
                        edge="end"
                    >
                        <SearchIcon fontSize="large" />
                    </IconButton>
                    </InputAdornment>
                }
            label={<Typography variant="body1">Search Auctions</Typography>}
            />
        </FormControl>
    );
}

export default SearchBar;