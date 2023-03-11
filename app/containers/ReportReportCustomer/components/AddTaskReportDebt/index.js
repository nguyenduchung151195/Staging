import { Grid, MenuItem, Paper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { API_REPORT_TASK_DEBT } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';

function AddTaskReportDebt(props) {
  const { item, miniActive } = props;
  const mapFunction = item => {
    return {
      ...item,
      taskWeeks: item.weekTasks,
    };
  };

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
      <Paper style={{ marginTop: 20 }}>
        <Typography gutterBottom variant="h5" style={{ marginTop: 30, marginLeft: 600 }}>
          Báo cáo công nợ dự án
        </Typography>
        <Grid container>
          {/* {tab === 2 ? ( */}
          <Grid item xs={12}>
            <ListPage
              apiUrl={`${API_REPORT_TASK_DEBT}`}
              code={MODULE_CODE.reportTaskDebt}
              disableEdit
              disableAdd
              disableConfig
              disableImport
              mapFunction={mapFunction}
              exportExcel
              notChangeSearch
              notChangeApi
              wantCashFormat
              // disableSearch
              disableSelect
            />
          </Grid>
        </Grid>
        {/* ) : null} */}
      </Paper>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddTaskReportDebt);
