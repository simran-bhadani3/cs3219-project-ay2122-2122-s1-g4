import React from "react";
import { useFormik } from 'formik';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { theme } from '../theme';
import { ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import clsx from "clsx";
import { textAlign } from "@mui/system";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                e-Auction
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
        email: data.get('email'),
        password: data.get('password'),
    });
};



const useStyles = makeStyles({
    main: {
        height: "100%", // So that grids 1 & 4 go all the way down
        minHeight: 150, // Give minimum height to a div
        fontSize: 30,
        textAlign: "center"
    },
    container: {
        height: "100%", // So that grids 1 & 4 go all the way down
        minHeight: 150, // Give minimum height to a div
        border: "1px solid black",
        fontSize: 30,
        textAlign: "center"
    },
    containerTall: {
        minHeight: 250 // This div has higher minimum height
    }
});


export default function AuctionRoomDisplay() {

    const classes = useStyles();
    // Pass the useFormik() hook initial form values, a validate function that will be called when
    // form values change or fields are blurred, and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const [values, setValues] = React.useState({
        amount: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container direction="row" spacing={0} container style={{ height: '84vh', }}>
                <Grid item xs={3} >
                    <ListItem>
                        <ListItemText
                            primary="Item Name"
                            secondary='Sample Text'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Details"
                            secondary='Secondary text'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Single-line item"
                            secondary='Secondary text'
                        />
                    </ListItem>
                </Grid>
                <Grid item container direction="column" xs spacing={0}>
                    <Grid item xs>
                        <div className={clsx(classes.container, classes.containerTall)}>
                            3
                        </div>
                    </Grid>
                    <Grid item xs={1} direction="row" sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }} >
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={values.amount}
                                onChange={handleChange('amount')}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        <Button variant="contained" sx={{mr: 1 }}>Bid</Button>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.container}>Chat to be implemented</div>
                </Grid>
            </Grid>
            {/* <Container component="main" maxWidth="lg">
                <CssBaseline />
                {/* <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ mt: 3, ml: 20, mr: 20 }} >
                        <ListItemButton component="a" href="#simple-list">
                            <ListItemText primary="Spam" />
                        </ListItemButton>
                        <ListItemButton component="a" href="#simple-list">
                            <ListItemText primary="Spam" />
                        </ListItemButton>
                    </Box>
                </Box> }
                <Copyright sx={{ mt: 5 }} />
            </Container> */}
        </ThemeProvider>
    );
}