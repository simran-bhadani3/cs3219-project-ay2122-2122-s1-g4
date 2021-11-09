import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {AppBar, Dialog, Grid, IconButton, Menu, MenuItem, Snackbar, Toolbar, Popover, Typography} from '@mui/material';
import AuctionForm from '../components/AuctionForm';
import {getAuthConfig, getAuctionDetailsUrl} from '../actions.js';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    deleteStyle: {
        color: theme.palette.error.main
    },
    ml1: {
        marginLeft: `${theme.spacing(2)} !important`
    },
    p1: {
        margin: `${theme.spacing(1)} !important`
    },
    dialogStyle: {
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(5)
        },
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(3)
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        }
    }
}));


function AuctionCardSettings({ auction, updateAuctions, isOngoingHasEnded }) {
    const classes = useStyles();
    const [ongoing, setOngoing] = useState(false);
    const [ended, setEnded] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    // const dockerAuctionDetailsServer = `http://localhost:4000/api/auctiondetails/${auction?._id}`;
    // const dockerAuctionDetailsServer = `${process.env.REACT_APP_dockerauctiondetailsserver||'http://localhost/api/auctiondetails'}${auction?._id}`;

    useEffect(() => {
        if (isOngoingHasEnded) {
            const {isOngoing, hasEnded} = isOngoingHasEnded();
            setOngoing(isOngoing);
            setEnded(hasEnded);
        }
    }, []);

    const onClickSetting = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSettingsPopup = () => {
        setAnchorEl(null);
    };

    const handleCloseEditFormDialog = () => {
        setOpenEditDialog(false);
    };

    async function onEditSubmit(values) {
        const userId = JSON.parse(localStorage.getItem('userid'));
        const data = {
            ...values,
            owner_id: userId
        }

        await axios.put(`${getAuctionDetailsUrl() + auction?._id}`, data, getAuthConfig())
            .then(res => {
                // console.log("res:", res);
                handleCloseEditFormDialog();
                updateAuctions();
                setSnackbarMessage("Auction has been edited.");
                setOpenSnackbar(true);
            })
            .catch(err => {
                console.log("error:", err);
            });
    };

    const renderEditDialog = () => {
        return (
            <Dialog
                fullScreen
                open={openEditDialog}
                onClose={handleCloseEditFormDialog}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseEditFormDialog}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h5">
                        Edit Auction Details
                    </Typography>
                </Toolbar>
                </AppBar>
                <Grid className={classes.dialogStyle}>
                    <AuctionForm onSubmit={onEditSubmit} currValues={auction} isEdit />
                </Grid>
            </Dialog>
        );
    };

    const onClickEdit = () => {
        setOpenEditDialog(true);
        handleCloseSettingsPopup();
    };

    const deleteAuction = () => {
        axios.delete(`${getAuctionDetailsUrl() + auction?._id}`, getAuthConfig())
            .then(res => {
                updateAuctions();
                setSnackbarMessage("Auction has been deleted.");
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.log("error", error);
            });
    };

    const onClickDelete = () => {
        deleteAuction();
        handleCloseSettingsPopup();
    };

    const renderSnackbar = () => {
        return (
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        )
    };

    return (
        <div>
            <IconButton 
                aria-label="editDeleteButton"
                aria-controls="settingsMenu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={onClickSetting}
            >
                <MoreVertIcon />
            </IconButton>

            {!(ongoing || ended) && (<Menu
                id="settingsMenu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseSettingsPopup}
                MenuListProps={{ 'aria-labelledby': 'editDeleteButton' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div>
                    <MenuItem onClick={onClickEdit}>
                        <Grid container className={classes.p1}>
                            <EditIcon />
                            <Typography className={classes.ml1}>Edit</Typography>
                        </Grid>
                    </MenuItem>
                    <MenuItem onClick={onClickDelete}>
                        <Grid container className={`${classes.deleteStyle} ${classes.p1}`}>
                            <DeleteIcon color="error" />
                            <Typography color="error" className={classes.ml1}>Delete</Typography>
                        </Grid>
                    </MenuItem>
                </div>
            </Menu>
            )}

            {(ongoing || ended) && (
                <Popover
                    id="settingsMenu"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseSettingsPopup}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Grid className={classes.p1}>
                        <Typography>Unable to edit or delete.</Typography>
                        <Typography>Auction {ongoing ? "is ongoing. Click into auction to end it." : "has ended."}</Typography>
                    </Grid>
                </Popover>
            )}
            
            {renderEditDialog()}
            {renderSnackbar()}
        </div>
    );
}

export default AuctionCardSettings;