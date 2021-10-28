import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    SwipeableDrawer,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from "../AuthContext";

const useStyles = makeStyles(theme => ({
    header: {
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(2),
            height: theme.spacing(10)
        }
    },
    navButton: {
        margin: '0 16px !important'
    },
    drawer: {
        padding: theme.spacing(9)
    },
    eauction: {
        cursor: "pointer",
        color: theme.palette.textPrimary.main
    }
}));



function Header({ pages }) {
    const classes = useStyles();
    const location = useLocation();
    const authContext = useContext(AuthContext);
    let history = useHistory();
    const [isMobileView, setIsMobileView] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const setResponsiveness = () => {
            if (window.innerWidth < 736) {
                setIsMobileView(true);
            } else {
                setIsMobileView(false);
            }
        }
        setResponsiveness();
        window.addEventListener("resize", () => setResponsiveness());
        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    const goToHomePage = () => {
        history.push("/all");
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const logout = () => {
        // perform log out
        console.log(JSON.parse(localStorage.getItem('user')));
        localStorage.removeItem("user");
        authContext.logout();
        console.log('logout')
        console.log(JSON.parse(localStorage.getItem('user')));
        history.push("/");
    }


    const renderLinks = (isMobile = false) => {
        console.log("pages", pages);
        return pages.map(({ href, label, isButton, icon }) => {
            if (icon) {
                return <IconButton color="textPrimary" onClick={logout}>{icon}</IconButton>;
            }
            return (
                <Button
                    className={classes.navButton}
                    component={Link}
                    to={href}
                    variant={isButton ? "outlined" : "text"}
                    color={location.pathname === href ? "secondary" : "textPrimary"}
                    onClick={isMobile && handleCloseDrawer}
                >
                    {label}
                </Button>
            );
        });
    }

    const renderDrawerOptions = () => {
        return (
            <Grid container direction="column" alignItems="center" ustify="center" className={classes.drawer}>
                {renderLinks(true)}
            </Grid>
        );
    };

    const renderMobileDisplay = () => {
        return (
            <>
                <IconButton onClick={() => setIsDrawerOpen(true)}>
                    <MenuIcon fontSize="large" color="textPrimary" />
                </IconButton>
                <SwipeableDrawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
                    {renderDrawerOptions()}
                </SwipeableDrawer>
            </>
        );
    };

    const renderDesktopDisplay = () => {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                {renderLinks()}
            </Box>
        );
    };

    return (
        <AppBar position="static" className={classes.header} classes={{root:classes.header}}>
            <Toolbar>
                <Grid container justify="space-between" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" onClick={goToHomePage} className={classes.eauction}>
                        e-Auction
                    </Typography>
                    {isMobileView ? renderMobileDisplay() : renderDesktopDisplay()}
                </Grid>
            </Toolbar>
        </AppBar >
    );
}



export default Header;