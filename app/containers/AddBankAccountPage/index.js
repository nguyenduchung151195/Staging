/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import { MenuItem, AppBar, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { serialize } from 'helper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { API_BANK_ACCOUNT } from '../../config/urlConfig';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddLtAccount from './selectors';
import reducer from './reducer';
import CustomInputField from 'components/Input/CustomInputField';
import saga from './saga';
import { createAccountRequest, updateAccountRequest, updatePasswordRequest, defaultAccountRequest } from './actions';
import { viewConfigCheckRequired, viewConfigCheckForm, viewConfigName2Title } from '../../utils/common';
import { changeSnackbar } from '../../containers/Dashboard/actions';

/* eslint-disable react/prefer-stateless-function */
function AddBankAccountPage(props) {
  const [localState, setLocalState] = useState({
    initialBalance: null,
    currentBalance: null,
    accountNumber: "",
    bank: "",
    name: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [localMessages, setLocalMessages] = useState({});

  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [name2Title, setName2Title] = useState({});


  const menu = localStorage.getItem('viewConfig');
  const { createAccountRequestSuccess, updateAccountRequestSuccess, loading, updatePasswordRequestSuccess } = props.accountRequest;
  const id = props.history.valueTab;
  const requestURL = API_BANK_ACCOUNT;

  useEffect(() => {
    props.onDefaultAccountRequest();
  }, []);

  useEffect(
    () => {
      if (id !== 'add')
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setLocalState(data);
          });
    },
    [id],
  );

  useEffect(
    () => {
      if (loading) {
        props.history.goBack();
      }
    },
    [loading],
  );

  // useEffect(() => {
  //     if (updatePasswordRequestSuccess === true) {
  //         setOpenModal(false)
  //     }
  // }, [updatePasswordRequestSuccess])
  useEffect(() => {
    setCheckRequired(viewConfigCheckRequired("BankAccount", 'required') || {})
    setCheckShowForm(viewConfigCheckRequired("BankAccount", 'showForm') || {})
    setName2Title(viewConfigName2Title('BankAccount') || {})

  }, [])
  const handleChange = e => {
    let value;
    if (e.target.name === 'initialBalance' || e.target.name === 'currentBalance') {
      value = parseInt(e.target.value);
      if (isNaN(value)) value = e.target.value
    } else {
      value = e.target.value;
    }
    setLocalState({
      ...localState,
      [e.target.name]: value,
    });
  };
  const onSave = () => {
    if (Object.keys(localMessages).length > 0) {
      return props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Vui lòng điền đầy đủ dữ liệu!', variant: 'error' });
    }
    const body = {
      ...localState,
    };
    if (body._id) {
      props.onUpdateAccountRequest(body);
    } else {
      props.onCreateAccountRequest(body);
    }
  };
  useEffect(() => {
    const messages = viewConfigCheckForm("BankAccount", { ...localState, "bank.title": localState.bank });
    setLocalMessages(messages)
  }, [localState])
  return (
    <>
      <CustomAppBar
        title={id === 'add' ? `Thêm mới tài khoản ngân hàng` : `Cập nhật tài khoản ngân hàng`}
        onGoBack={() => {
          props.history.goBack();
        }}
        onSubmit={onSave}
        //  onChangePass={onChangePass}
        id={id}
      />
      <Grid container>
        <Typography variant="h5" color="primary">
          Điền thông tin
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        {
          checkShowForm.name && <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.name || 'Tên tài khoản'}
              value={localState.name}
              name="name"
              required={checkRequired.name}
              onChange={handleChange}
              error={localMessages && localMessages.name}
              helperText={localMessages && localMessages.name}
            />
          </Grid>
        }
        {
          checkShowForm["bank.title"] && <Grid item md={4}>
            <CustomInputField
              configType="crmSource"
              configCode="S04"
              type="Source|CrmSource,S04|Id||_id"
              label={name2Title["bank.title"] || 'Tên ngân hàng'}
              name="bank"
              required={checkRequired["bank.title"]}
              value={localState.bank ? localState.bank : null}
              onChange={handleChange}
              error={localMessages && localMessages["bank.title"]}
              helperText={localMessages && localMessages["bank.title"]}

            />
          </Grid>
        }
        {
          checkShowForm.accountNumber && <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.accountNumber || 'Số tài khoản'}
              value={localState.accountNumber ? localState.accountNumber : null}
              name="accountNumber"
              type="number"
              required={checkRequired.accountNumber}
              onChange={handleChange}
              error={localMessages && localMessages.accountNumber}
              helperText={localMessages && localMessages.accountNumber}
            />
          </Grid>
        }
        {
          checkShowForm.initialBalance && <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.initialBalance || 'Số dư ban đầu'}
              value={localState.initialBalance}
              type="number"
              name="initialBalance"
              required={checkRequired.initialBalance}
              onChange={handleChange}
              error={localMessages && localMessages.initialBalance}
              helperText={localMessages && localMessages.initialBalance}
            />
          </Grid>
        }
        {
          checkShowForm.currentBalance && <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.currentBalance || 'Số dư hiện tại'}
              value={localState.currentBalance}
              type="number"
              required={checkRequired.currentBalance}
              name="currentBalance"
              onChange={handleChange}
              error={localMessages && localMessages.currentBalance}
              helperText={localMessages && localMessages.currentBalance}
            />
          </Grid>
        }
      </Grid>

    </>
  );
}

const mapStateToProps = createStructuredSelector({
  accountRequest: makeSelectAddLtAccount(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDefaultAccountRequest: () => dispatch(defaultAccountRequest()),
    onCreateAccountRequest: data => dispatch(createAccountRequest(data)),
    onUpdateAccountRequest: data => dispatch(updateAccountRequest(data)),
    onUpdatePasswordRequest: data => dispatch(updatePasswordRequest(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'accountRequest', reducer });
const withSaga = injectSaga({ key: 'accountRequest', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddBankAccountPage);
