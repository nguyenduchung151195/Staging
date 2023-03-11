import { Grid } from '@material-ui/core';
import React from 'react';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { Paper } from '../../../../components/LifetekUi';

function ReportTopCustomer(props){
    return(
        <Paper>
               <Grid container>
                   <Grid item md={3}>
                        <CustomInputBase/>
                   </Grid>
                   <Grid item md={3}>
                        <CustomInputBase/>
                   </Grid>
                   <Grid item md={3}>
                        <CustomInputBase/>
                   </Grid>
               </Grid>
        </Paper>
    )
}