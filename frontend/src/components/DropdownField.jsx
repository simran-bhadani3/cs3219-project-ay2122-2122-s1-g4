import React from 'react';
import { Grid, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function DropdownField({ id, label, options, renderError, formik, md=6, className, isRequired=true }) {
    return (
        <Grid item xs={12} md={md} className={className}>
            <FormControl fullWidth required={isRequired}>
                <InputLabel id={`${id}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${id}-label`}
                    id={id}
                    name={id}
                    value={formik.values[id]}
                    label={label}
                    onChange={val => {
                        // console.log(val.target.value, val)
                        formik.setFieldValue(id, val.target.value);
                    }}
                >
                    {options.map(cat => <MenuItem value={cat}>{cat}</MenuItem>)}
                </Select>
            </FormControl>
            {renderError && renderError(id)}
        </Grid>
    );
}

export default DropdownField;