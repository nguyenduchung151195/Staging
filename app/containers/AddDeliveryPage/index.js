/**
 *
 * AddDeliveryPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Button } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddDeliveryPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { TextField, Tabs, Tab } from '../../components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
export class AddDeliveryPage extends React.Component {
  state = {
    tab1: 3,
  };

  handleTab(tab1) {
    this.setState({ tab1 });
  }

  render() {
    const addDeliveryPage = this.props.addDeliveryPage;
    const { tab } = addDeliveryPage;
    const { tab1 } = this.state;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab1)} {...props} color={props.tab1 === tab1 ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
          <Tab value={0} label="Phương thức vẫn chuyển" />
          <Tab value={1} label="Địa chỉ giao hàng" />
          <Tab value={2} label="Phí giao hàng" />
        </Tabs>

        {tab === 0 ? (
          <div>
            <Grid container>
              <Grid item xs={12} md={12} style={{ marginLeft: '30px', cursor: 'pointer', marginTop: '30px' }}>
                <Bt tab1={3}>viettel</Bt>
                <Bt tab1={4}>Mua trong kho</Bt>
              </Grid>
            </Grid>
            {tab1 === 3 ? (
              <Grid md={12} spacing={3} style={{ width: '95%', marginLeft: '30px' }}>
                <TextField fullWidth InputLabelProps={{ shrink: true }} label="Số theo dõi" />
                <TextField fullWidth InputLabelProps={{ shrink: true }} label="Dự kiến xử lý" type="date" />
                <TextField fullWidth InputLabelProps={{ shrink: true }} label="Giao hàng dự kiến" type="date" />
                <TextField fullWidth rows={3} multiline label="Nhận hàng" />
              </Grid>
            ) : null}
            {tab1 === 4 ? (
              <Grid md={12} spacing={3} style={{ width: '95%', marginLeft: '30px' }}>
                <TextField fullWidth InputLabelProps={{ shrink: true }} label="Dự kiến" type="date" />
                <TextField rows={3} fullWidth multiline label="Nhận hàng" />
              </Grid>
            ) : null}
          </div>
        ) : null}
        {tab === 1 ? (
          <Grid md={12} spacing={2} style={{ width: '95%', marginLeft: '30px', marginTop: '30px' }}>
            <TextField fullWidth label="Tên" />
            <TextField fullWidth label="Họ và tên đệm" />
            <TextField fullWidth label="Số điện thoại" type="number" />
            <TextField fullWidth label="Địa chỉ 1" />
            <TextField fullWidth label="Địa chỉ 2" />
            <TextField fullWidth label="Thành phố" />
            <TextField fullWidth label="Huyện/Tỉnh" />
            <TextField fullWidth label="Mã vùng" type="number" />
            <TextField fullWidth label="Quốc gia" />
          </Grid>
        ) : null}
        {tab === 2 ? (
          <Grid md={12} spacing={2} style={{ width: '95%', marginLeft: '30px', marginTop: '30px' }}>
            <TextField fullWidth InputLabelProps={{ shrink: true }} label="Phí giao hàng" />
            <TextField fullWidth InputLabelProps={{ shrink: true }} label="Khu vực vận chuyển" />
            <TextField fullWidth InputLabelProps={{ shrink: true }} label="Nhóm thuế" />
          </Grid>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 30 }}>
          <Button variant="outlined" style={{ marginRight: 30 }}>
            Huỷ giao hàng
          </Button>
          <Button variant="outlined" color="primary" style={{ marginRight: 20 }}>
            Giao hàng tiết kiệm
          </Button>
        </div>
      </div>
    );
  }
}

AddDeliveryPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addDeliveryPage: makeSelectAddDeliveryPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addDeliveryPage', reducer });
const withSaga = injectSaga({ key: 'addDeliveryPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddDeliveryPage);
