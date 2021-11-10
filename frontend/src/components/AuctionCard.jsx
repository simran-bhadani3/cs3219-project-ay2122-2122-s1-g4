import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
// import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia, Chip, Collapse, Grid, IconButton, Typography } from '@mui/material';
import AuctionCardDialog from '../components/AuctionCardDialog';
import AuctionCardSettings from '../components/AuctionCardSettings';
import {getAuthConfig, getAuctionDetailsUrl} from '../actions.js';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    px1: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    px2: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    pb4: {
        paddingBottom: theme.spacing(4)
    },
    p1: {
        padding: theme.spacing(1)
    },
    m2: {
        margin: theme.spacing(2)
    }, 
    chip: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '13rem',
    },
    chipOngoing: {
        color: `${theme.palette.success.main} !important`,
        borderColor: `${theme.palette.success.main} !important`,
    },
    chipEnded: {
        color: `${theme.palette.text.hint} !important`,
        borderColor: `${theme.palette.text.disabled} !important`,
    },
}));

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
        })(({ theme, expand }) => ({
            transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            }),
  }));

function AuctionCard({ item, updateAuctions, isEditDelete=false }) {
    const classes = useStyles();
    // const theme = useTheme();
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState("");
    // console.log("item", item);

    const {
        room_display_name,
        auction_item_name,
        start_time,
        end_time,
        minbid,
        increment,
        category
    } = item;
    const description = item?.description;
    const auctionId = item?._id;

    const getImage = () => {
        // const dockerAuctionDetailsServer = 'http://localhost:4000/api/auctiondetails';
        // const dockerAuctionDetailsServer = `${process.env.REACT_APP_dockerauctiondetailsserver||'http://localhost/api/auctiondetails'}`;
        
        axios.get(`${getAuctionDetailsUrl()}download/${auctionId}`, getAuthConfig())
            .then(res => {
                console.log("response", res);
                setImageUrl(res.data.url);
            })
            .catch(err => {
                console.log("error", err);
            });
    };

    useEffect(() => {
        getImage();
    }, [auctionId]);

    const [openNotStartedDialog, setOpenNotStartedDialog] = useState(false);
    const [openHasEndedDialog, setOpenHasEndedDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const formatTwoDigit = num => {
        return num.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    };

    const getDate = date => {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
    };

    const formatDate = date => {
        const formatDateTime = getDate(date);
        const formatDateTimeStr = formatDateTime.toString();
        const hours = formatDateTime.getHours();
        const formatTime = `${hours > 12 ? formatTwoDigit(hours - 12) : formatTwoDigit(hours)}${formatDateTimeStr.substring(18, 21)} ${hours >= 12 ? 'pm' : 'am'}`;
        return `${formatDateTimeStr.substring(4, 15)} (${formatDateTimeStr.substring(0, 3)}), ${formatTime}`;
    };

    const formatCurrency = amount => {
        return parseFloat(amount || 0)?.toFixed(2);
    };

    const getIsOngoingOrEnded = () => {
        const startDate = getDate(start_time);
        const endDate = getDate(end_time);
        const now = new Date();
        const isOngoing = now >= startDate && now <= endDate;
        const hasEnded = now > startDate && now > endDate;
        return {
            isOngoing: isOngoing,
            hasEnded: hasEnded
        };
    };

    const goToAuctionRoom = () => {
        const href = `/auction/${auctionId}`;
        history.push(href);
    };

    const onClickAuctionRoom = () => {
        const { isOngoing, hasEnded } = getIsOngoingOrEnded();
        if (isOngoing) {
            goToAuctionRoom();
        } else if (hasEnded) {
            setOpenHasEndedDialog(true);
        } else {
            setOpenNotStartedDialog(true);
        }
    };

    const renderCategory = () => {
        const { isOngoing, hasEnded } = getIsOngoingOrEnded();
        return (
            <Grid>
                <Chip 
                    className={`${isOngoing && classes.chipOngoing} ${hasEnded && classes.chipEnded}`} 
                    label={<Typography className={classes.chip}>{category}</Typography>} c
                    color="primary" 
                    variant="outlined" 
                />
            </Grid>
        );
    };

    const renderCardHeader = () => {
        return (
            <Grid className={classes.px1} alignItems="center" justifyContent="space-between">
                <CardHeader
                    title={renderCategory()}
                    action={isEditDelete && (
                        <AuctionCardSettings 
                            auction={item}
                            updateAuctions={updateAuctions} 
                            isOngoingHasEnded={getIsOngoingOrEnded} 
                        />
                    )}
                />
            </Grid>
        );
    };

    const renderCardActionArea = () => {
        return (
            <CardActionArea onClick={onClickAuctionRoom}>
                {imageUrl && (
                    <CardMedia
                        component="img"
                        sx={{ width: "100%", height: "100%" }}
                        image={imageUrl}
                        alt={auction_item_name}
                    />
                )}
                <CardContent>
                    <Grid container className={classes.px1} justifyContent="space-between">
                        <Grid>
                            <Typography gutterBottom variant="h5" color="primary">{room_display_name}</Typography>
                            <Typography variant="h6" color="textPrimary">{auction_item_name}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        );
    };

    const renderExpandMoreSection = () => {
        return (
            <Grid>
                <CardActions>
                    <CardContent>
                        <Typography variant="body1" color="textPrimary">
                            Starting Bid: <b>${formatCurrency(minbid)}</b>
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                            (Increment of <b>${formatCurrency(increment)}</b>)
                        </Typography>
                    </CardContent>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Grid className={classes.px1}>
                            <Typography>Start at: <b>{formatDate(start_time)}</b></Typography>
                            <Typography paragraph>End at: <b>{formatDate(end_time)}</b></Typography>
                            <Typography>About the auction/item:</Typography>
                            <Typography>{description || '-'}</Typography>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Grid>
        );
    };

    return (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} className={`${classes.px2} ${classes.pb4}`}>
            <Card>
                {renderCardHeader()}
                {renderCardActionArea()}
                {renderExpandMoreSection()}
                <AuctionCardDialog 
                    title="Auction Room has not started"
                    description={`The auction room "${room_display_name}" for the item "${auction_item_name}" will start at ${formatDate(start_time)}.`}
                    open={openNotStartedDialog}
                    onClose={() => setOpenNotStartedDialog(false)}
                />
                <AuctionCardDialog 
                    title="Auction Room has ended"
                    description={`The auction room "${room_display_name}" for the item "${auction_item_name}" has ended at ${formatDate(end_time)}. Thank you for your interest in the auction!`}
                    open={openHasEndedDialog}
                    onClose={() => setOpenHasEndedDialog(false)}
                />
            </Card>
        </Grid>
    );
}

export default AuctionCard;