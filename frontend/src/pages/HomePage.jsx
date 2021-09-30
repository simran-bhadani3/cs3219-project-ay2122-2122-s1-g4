import React, { useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ScrollToTop from '../components/ScrollToTop';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        },
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2)
        }
    },
}));

function AuctionsPage() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const atLeastMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const experienceRef = useRef(null)

    const scrollTo = (ref) => {
        window.scroll({
            top: ref.current.offsetTop,
            behavior: "smooth",
        });
    }

    const renderIntro = () => {
        return (
            <Grid container justify="center" alignItems="center" className={`${classes.fullScreenWithHeaderHeight}`} id="aboutIntro">
                <Grid item container justify={!atLeastMediumScreen && "center"} xs={11} sm={10} md={6} lg={5} className={`${classes.introDesc} ${!atLeastMediumScreen && classes.textAlignCenter}`}>
                    {atLeastMediumScreen && (
                        <Typography variant="h6" color="primary" className={`${classes.mb2}`}>
                            THIS IS ME
                        </Typography>
                    )}
                    <Typography variant="subtitle1">
                        Hello there, nice to meet you! This is Michelle, a Year 4 NUS undergraduate, pursuing a Bachelor of Computing in Computer Science and a minor in Management. I enjoy design, product and development ♡
                    </Typography>
                    <ArrowDownwardRoundedIcon
                        color="primary" 
                        className={`${classes.outlineRounded} ${classes.mt10}`} 
                        onClick={() => scrollTo(experienceRef)}
                    />
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid container className={classes.container}>
            <ScrollToTop />
        </Grid>
    );
}

export default AuctionsPage;