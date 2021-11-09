import React, { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, TextField } from '@mui/material';
import EButton from '../components/EButton';
import DropdownField from '../components/DropdownField';
import { categoryList } from '../resources/constants';

const useStyles = makeStyles(theme => ({
    py1: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    }
}));

function AuctionFilter({ newValue="", onFilter }) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);

    const openFilterDialog = () => {
        setOpenDialog(true);
    };

    const closeFilterDialog = () => {
        setOpenDialog(false);
    };

    const initialValues = { showAll: false };

    const currencyYupSchema = yup.object().shape({
        lowerbound: yup.number().min(0),
        upperbound: yup.number().min(0),
        category: yup.string().oneOf(categoryList),
        showAll: yup.boolean()
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: currencyYupSchema,
        onSubmit: async values => {
            await onFilter(values);
            closeFilterDialog();
        },
    });

    const resetForm = () => {
        formik.setFieldValue("showAll", false);
        formik.setFieldValue("lowerbound", '');
        formik.setFieldValue("upperbound", '');
        formik.setFieldValue("category", '');
    };

    const renderFilterDialog = () => {
        return (
            <Dialog open={openDialog} onClose={closeFilterDialog} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogContent>
                        <FormControlLabel
                            label="Show All Auctions (including past ones)"
                            control={
                            <Checkbox
                                checked={formik.values.showAll}
                                onChange={() => formik.setFieldValue("showAll", !formik.values.showAll)}
                            />
                            }
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="lowerbound"
                            name="lowerbound"
                            label="Minimum Starting Bid"
                            type="number"
                            fullWidth
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.lowerbound}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="upperbound"
                            name="upperbound"
                            label="Maximum Starting Bid"
                            type="number"
                            fullWidth
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.upperbound}
                        />
                        <DropdownField 
                            id="category" 
                            label="Category" 
                            options={categoryList} 
                            formik={formik}
                            md={12}
                            className={classes.py1}
                        />
                    </DialogContent>
                    <DialogActions>
                        <EButton content="Reset" variant="outlined" onClick={resetForm} />
                        <EButton content="Filter" type="submit" />
                    </DialogActions>
                </Box>
            </Dialog>
        );
    };
    
    return (
        <div>
            <IconButton
                aria-label="filter auction"
                onClick={openFilterDialog}
                onMouseDown={openFilterDialog}
            >
                <FilterListIcon fontSize="large" />
            </IconButton>
            {renderFilterDialog()}
        </div>
    );
}

export default AuctionFilter;