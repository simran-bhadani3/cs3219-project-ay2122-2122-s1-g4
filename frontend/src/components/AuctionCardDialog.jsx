import React from 'react';
import {Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from '@mui/material';
import EButton from '../components/EButton';

function AuctionCardDialog({ title, description, open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <EButton content="Okay" onClick={onClose} />
            </DialogActions>
        </Dialog>
    );
}

export default AuctionCardDialog;