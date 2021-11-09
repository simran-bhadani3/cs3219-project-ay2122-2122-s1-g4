import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Chip, Grid, Link, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import AuctionCard from '../components/AuctionCard';
import AuctionFilter from '../components/AuctionFilter';
import EButton from '../components/EButton';
import {getAuthConfig, getAuctionDetailsUrl, getCurrencyUrl, getBidUrl} from '../actions.js';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(10),
            paddingLeft: theme.spacing(10),
            paddingRight: theme.spacing(10)
        },
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        },
    },
    fullScreenHeight: {
        minHeight: "85vh"
    },
    pl2: {
        paddingLeft: theme.spacing(2)
    },
    pb2: {
        paddingBottom: theme.spacing(2)
    },
    px2: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    mx1: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    topBarStyle: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    },
    alignCenter: {
        textAlign: "center"
    }
}));

function AuctionsPage() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const atLeastMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
    const [auctions, setAuctions] = useState([]);
    const [filterSearchOptions, setFilterSearchOptions] = useState({});
    const [searchValue, setSearchValue] = useState("");

    // const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
    const dockerAuctionDetailsServer = `${process.env.REACT_APP_dockerauctiondetailsserver||'http://localhost/api/auctiondetails'}`;
    
    const getAllFutureAuctions = () => {
        axios.get(`${getAuctionDetailsUrl()}/notover`, getAuthConfig())
            .then(res => {
                // console.log("response", res);
                setAuctions(res.data);
            })
            .catch(error => {
                console.log("error", error);
            });
    }

    const serialize = function(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p].toString().length > 0) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
        }
        return str.join("&");
    };

    const optionsLabelMapping = {
        room_display_name: "Auction Name",
        auction_item_name: "Item Name",
        lowerbound: "Minimum Starting Bid",
        upperbound: "Maximum Starting Bid",
        category: "Category",
        showAll: "Show All Auctions (includes past)"
    };

    const getFilteredAndSearchAuctions = values => {
        // const val = { category: "", upperbound: 90, lowerbound: 0, showAll: false, room_display_name: "" };
        axios.get(`${getAuctionDetailsUrl()}/filterandsearch?${serialize(values)}`, getAuthConfig())
            .then(res => {
                console.log("response", res);
                setAuctions(res.data);
            })
            .catch(error => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        getAllFutureAuctions();
    }, []);

    const onSearch = name => {
        if (name.length > 0) {
            const newOptions = { ...filterSearchOptions, room_display_name: name };
            setFilterSearchOptions(newOptions);
            getFilteredAndSearchAuctions(newOptions);
        }
    };

    const onFilter = values => {
        const newOptions = {
            ...filterSearchOptions,
            ...values
        };
        // remove any default values to prevent display
        Object.entries(newOptions).map(([key, val]) => {
            if ((key === "showAll" && !val) || val.toString().length === 0) {
                delete newOptions[key];
            }
        });
        setFilterSearchOptions(newOptions);
        getFilteredAndSearchAuctions(newOptions);
    };

    const onReset = () => {
        setFilterSearchOptions({});
        setSearchValue("");
        getAllFutureAuctions();
    };

    const goToPage = href => {
        history.push(href);
    }

    const renderChip = label => {
        return <Chip className={classes.mx1} color="primary" label={label} variant="outlined" />
    };

    const renderOptionList = () => {
        console.log("filterSearchOptions", filterSearchOptions);
        return (
            <Grid item container xs={12} alignItems="baseline">
                <Link variant="button" onClick={onReset} className={classes.px2}>Reset Search/Filter</Link>
                {Object.entries(filterSearchOptions).map(([key, val]) => {
                    if (key == "showAll") {
                        return val && renderChip(optionsLabelMapping[key]);
                    }
                    console.log(key, val);
                    return renderChip(`${optionsLabelMapping[key]}: ${val}`);
                })}
            </Grid>
        );
    };

    const renderTopBar = () => {
        return (
            <Grid container alignItems="center" className={classes.topBarStyle}>
                <Grid item xs={11}>
                    <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} onSearch={onSearch} />
                </Grid>
                <Grid item xs={1} className={classes.pl2}>
                    <AuctionFilter onFilter={onFilter} />
                </Grid>
                {Object.keys(filterSearchOptions).length > 0 && renderOptionList()}
            </Grid>
        );
    };

    const renderEmptyAuctionList = () => {
        return (
            <Grid item alignItems="center" justifyItems="center" className={classes.alignCenter}>
                <Typography variant="h4" className={classes.pb2}>
                    No auction created by any user. Create the first one now!
                </Typography>
                <EButton onClick={() => goToPage("/new")} content="Create an auction now!" />
            </Grid>
        );
    }

    return (
        <Grid className={`${classes.container} ${classes.fullScreenHeight}`}>
            <Grid container alignItems="flex-start">   
                {renderTopBar()}
                <Grid container justifyContent={auctions.length === 0 ? "center" : "flex-start"}>
                    {auctions.length === 0 ? renderEmptyAuctionList() : (
                        auctions.map(item => {
                            return (
                                <AuctionCard 
                                    item={item} 
                                    isEditDelete={item.owner_id === JSON.parse(localStorage.getItem('userid'))} 
                                    updateAuctions={() => getFilteredAndSearchAuctions(searchValue)} 
                                />
                            );
                        })
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AuctionsPage;