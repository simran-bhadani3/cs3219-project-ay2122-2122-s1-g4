import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

const useStyles = makeStyles(theme => ({
    scrollButton: {
        padding: "4px !important",
        fontSize: "4px !important",
        border: "1px solid",
        borderColor: theme.palette.primary.main,
        borderRadius: "80px !important",
        position: "fixed",
        bottom: "32px !important",
        right: "32px !important",
        height: "64px !important",
        zIndex: 1000,
        cursor: "pointer",
        animation: "fadeIn 0.3s",
        transition: "opacity 0.4s",
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            borderColor: theme.palette.primary.dark,
            color: theme.palette.primary.dark
        }
    }
}));

function ScrollToTop() {
    const classes = useStyles();
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollToTop = () =>{
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', checkScrollTop);

    return (
        <ArrowUpwardRoundedIcon 
            color="primary"
            className={classes.scrollButton} 
            onClick={scrollToTop} 
            style={{ display: showScroll ? 'flex' : 'none' }}
        />
    );
}

export default ScrollToTop;