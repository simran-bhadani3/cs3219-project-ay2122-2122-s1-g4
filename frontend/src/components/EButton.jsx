import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';

const useStyles = makeStyles(theme => ({
    button: {
        backgroundColor: theme.palette.primary.light,
        height: theme.spacing(6),
        color: theme.palette.primary.dark,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText
        },
    },
    small: {
        minWidth: "160px !important"
    },
    large: {
        minWidth: "240px !important"
    }
}));

function EButton({ content, onClick, icon, size = "large", variant = "contained", disabled = false, type = "button", color = "primary", fullWidth = false, className }) {
    const classes = useStyles();

    return (
        <Button
            fullWidth={fullWidth}
            color={color}
            disabled={disabled}
            variant={variant}
            startIcon={icon}
            onClick={onClick}
            type={type}
            className={`${classes.button} ${classes[size]} ${className}`}
        >
            {content}
        </Button>
    );
}

export default EButton;