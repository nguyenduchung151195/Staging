/**
 *
 * AddSalary
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { Info } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddSalary from './selectors';
import { TextField, Grid, Typography } from '../../components/LifetekUi';

import reducer from './reducer';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class AddSalary extends React.Component {
  render() {
    return (
      <>
        <Grid container>
          <Helmet>
            <title>Thêm mới diến biến lương</title>
            <meta name="description" content="Description of AddSalary " />
          </Helmet>
          <Typography variant="h5" color="primary" style={{ marginLeft: 40, marginTop: 50 }}>
            <Info />
            Thông tin diễn biến lương
          </Typography>
        </Grid>
        <Grid container>
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} label="Số quyết định" style={{ width: '32%' }} />
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} type="date" style={{ marginLeft: 10, width: '32%' }} label="Ngày hưởng" />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
            style={{ marginLeft: 10, width: '32%' }}
            label="Ngày quyết định"
          />
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} label="Nơi làm việc" style={{ width: '32%' }} />
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} type="date" style={{ marginLeft: 10, width: '32%' }} label="Phương pháp" />
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} style={{ marginLeft: 10, width: '32%' }} label="Chức vụ" />
          <TextField variant="outlined" InputLabelProps={{ shrink: true }} label="Lý do" style={{ width: '32%' }} />
          <TextField select variant="outlined" InputLabelProps={{ shrink: true }} style={{ marginLeft: 10, width: 1050 }} label="Phòng ban" />
          <TextField name="note" variant="outlined" InputLabelProps={{ shrink: true }} style={{ width: '97%' }} label="Ghi chú" />
        </Grid>
        <Grid container>
          <Grid item>
            <Button variant="outlined" color="primary" style={{ marginRight: 20 }} type="submit" onClick={this.onSubmit}>
              Lưu
            </Button>
            
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" style={{ marginRight: 30 }} onClick={this.goBack}>
              HỦY
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
}

AddSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addSalary: makeSelectAddSalary(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSalary', reducer });
const withSaga = injectSaga({ key: 'addSalary', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddSalary);
