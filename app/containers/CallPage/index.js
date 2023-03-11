import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, Grid } from '@material-ui/core';
import makeSelectCallPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getCustomerAction, resetNotis } from './actions';
import Call from '../../components/Call/Call';
import CallDialog from '../../components/List/CallDialog';
import { makeSelectProfile } from 'containers/Dashboard/selectors';

const CallPage = (props) => {
  const { title, editData, customerId, onGetCustomer, callPage, profile } = props
  const { customer } = callPage

  const [open, setOpen] = useState()
  const [callDialog, setCallDialog] = useState()
  const [call, setCall] = useState({})

  useEffect(() => {
    onGetCustomer(customerId)
  }, [])

  useEffect(() => {
    customer && setCall(customer)
  }, [customer])

  const handleClickOpen = () => {
    setOpen(true)
    handleCreateLog();
  };

  const handleClose = () => {
    setOpen(false)
  };

  const onCall = () => {
    setCallDialog(true)
  };

  const onStartCall = (session) => {
    // console.log(session)
    handleCreateLog()
  };

  const handleCreateLog = () => {
    const objectId = editData._id;
    const employee = {
      employeeId: profile._id,
      name: profile.name,
    };
    const content = `Gọi đến ${customer.phoneNumber}`;
    props.onPostLog({ content, objectId, type: 'call', employee });
  };

  return (
    <div>
      <Grid container justify="center" alignItems="center">
        <Grid item sm={6}>
          {!call.phoneNumber ? null : <Button fullWidth variant="outlined" color="primary" onClick={onCall}>
            {title || 'Gọi điện'}
          </Button>}
        </Grid>
      </Grid>

      <CallDialog
        open={callDialog}
        call={call}
        onClose={() => { setCallDialog(false); }}
        onStartCall={onStartCall}
      />

      {/* <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Tên khách hàng: Đỗ Thắng</DialogTitle>
        <DialogContent>
          <Call phoneNumber={!call.phoneNumber ? call.phoneNumber : null} />
          {!call.phoneNumber ? <p style={{ color: 'red' }}>*Khách hàng này chưa có số điện thoại trên hệ thống</p> : ''}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng bỏ
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  callPage: makeSelectCallPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCustomer: customerId => {
      dispatch(getCustomerAction(customerId));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'callPage', reducer });
const withSaga = injectSaga({ key: 'callPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CallPage);
