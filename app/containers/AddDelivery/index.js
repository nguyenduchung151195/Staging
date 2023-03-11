/**
 *
 * AddDelivery
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import AsyncSelect from 'react-select/async';
import { Cancel, Done } from '@material-ui/icons';
import { Grid, TextField, Paper, MenuItem, Button, withStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddDelivery from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';

/* eslint-disable react/prefer-stateless-function */
export class AddDelivery extends React.Component {
  state = {
    itemChoose: {},
    // isEditPage: false,
    // deliveryList: [],
    // currentDelivery: 0,
    // typeOfBill: 0,
    // arrToSearch: [],
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title>Thêm mới giao hàng</title>
          <meta name="description" content="Description of ProjectPage" />
        </Helmet>
        <Grid item md={12} container spacing={24}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div style={{ display: 'flex' }}>
                <AsyncSelect
                  // cacheOptions
                  value={this.state.itemChoose}
                  className={classes.reactSelect}
                  onChange={this.handleChangeSelect}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '56px',
                    },
                  })}
                />
                <TextField
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{ width: '20%' }}
                >
                  <MenuItem value={0}>Đơn hàng</MenuItem>
                  <MenuItem value={1}>Hợp đồng</MenuItem>
                </TextField>
              </div>
              <div style={{ display: 'flex' }}>
                <TextField
                  label="Giai đoạn giao hàng"
                  name="currentDelivery"
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                >
                  <MenuItem value={0}>Tất cả</MenuItem>
                </TextField>
              </div>
            </Paper>
          </Grid>
          <Grid md={4} item>
            <Paper className={classes.paper} style={{ height: '97px' }}>
              <Grid container item md={12} spacing={24} justify="center" alignContent="center" alignItems="center">
                <Grid item md={5}>
                  <Button variant="outlined" color="primary">
                    <Done style={{ marginRight: '5px' }} /> Hoàn thành
                  </Button>
                </Grid>
                <Grid item md={5}>
                  <Button variant="outlined" color="secondary">
                    <Cancel style={{ marginRight: '5px' }} /> Hủy Giao hàng
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddDelivery.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addDelivery: makeSelectAddDelivery(),
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

const withReducer = injectReducer({ key: 'addDelivery', reducer });
const withSaga = injectSaga({ key: 'addDelivery', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddDelivery);
