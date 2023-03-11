/**
 *
 * EditAllocationPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Button, Grid, MenuItem, Paper, Step, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';
import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAllocationPage from '../selectors';
import reducer from '../reducer';
import saga from '../saga';

import { Grid as GridLT } from 'components/LifetekUi';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import styles from '../styles';
import { cleanup, editAllocationAct, getAssetAct } from '../actions';
import { API_ASSET, API_USERS, API_HRM_EMPLOYEE } from '../../../../config/urlConfig';
import CustomAppBar from 'components/CustomAppBar';
import messages from './messages';

const listStatus = [
  {
    code: 0,
    name: 'Chưa cấp phát',
  },
  {
    code: 1,
    name: 'Đã cấp phát',
  },
  {
    code: 2,
    name: 'Thu hồi',
  },
];

function KanbanStep(props) {
  const { listStatus, currentStatus, onChange } = props;

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={currentStatus}>
      {listStatus.map((item, i) => (
        <Step key={i} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

function EditAllocationPage(props) {
  const { match, allocationPage, classes, onGetAsset, onEditAllocation, onCleanup } = props;

  const { successCreate } = allocationPage;

  const [status, setStatus] = useState(0);

  const [filter] = useState({ level: 0 });

  const [asset, setAsset] = useState(null);

  const [allocation, setAllocation] = useState(null);

  const [personReceive, setPersonReceive] = useState(null);

  //const [serial, setSerial] = useState('');

  const [dateReceive, setDateReceive] = useState(null);

  const [note, setNote] = useState('');

  const id = props.id ? props.id : props.match.params.id;

  useEffect(() => {
    if (match.params.id && match.params.id !== 'add') {
      console.log('render');
      onGetAsset(match.params.id);
    }
    return () => {
      onCleanup();
    };
  }, []);

  const handleSubmit = () => {
    if (asset && dateReceive && personReceive) {
      const data = {
        code: asset && asset.code,
        personReceive: personReceive && personReceive._id,
        dateReceive,
        status,
        note,
      };
      onEditAllocation(data);
    }
  };

  useEffect(
    () => {
      if (allocationPage.asset) {
        setAsset(allocationPage.asset);
        if (allocationPage.asset.allocation) {
          const { allocation } = allocationPage.asset;
          setAllocation(allocation);
          setStatus(allocation.status);
          setPersonReceive(allocation.personReceive);
          setDateReceive(allocation.dateReceive);
          setNote(allocation.note);
        }
      }
    },
    [allocationPage.asset],
  );

  useEffect(
    () => {
      console.log(successCreate);
      if (successCreate && successCreate === true) {
        handleGoback();
      }
    },
    [successCreate],
  );

  // const handleChangeSerial = (e) => {
  //   const { value } = e.target;
  //   setSerial(value);
  //   if (value && value.personReceive) {
  //     setPersonReceive(value.personReceive);
  //     setDateReceive(value.dateReceive);
  //     setNote(value.note);
  //     setStatus(value.status);
  //   }
  // }

  const handleGoback = () => {
    props.history.goBack();
  };

  return (
    <div>
      <CustomAppBar title={id === 'add' ? 'Thêm mới cấp phát' : 'cập nhật cấp phát'} onGoBack={handleGoback} onSubmit={handleSubmit} />
      {/* <Paper className={classes.breadcrumbs}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ margin: 2 }}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Allocation">
                Cấp phát
              </Link>
              <Typography color="textPrimary">Chi tiết cấp phát </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper> */}

      <Grid container spacing={24}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper>
            <GridLT container spacing={16}>
              <Grid md={12} item>
                <KanbanStep listStatus={listStatus} currentStatus={status} onChange={setStatus} />
              </Grid>
              <Grid item sm={12}>
                <Grid container spacing={16}>
                  <Grid item xs={12} style={{ margin: "0px 16px" }}>
                    <AsyncAutocomplete
                      name="Chọn mã tài sản..."
                      label="Mã tài sản"
                      customOptionLabel={opt => opt.code}
                      filters={['code']}
                      onChange={value => setAsset(value)}
                      url={API_ASSET}
                      value={asset}
                      required
                      error={!asset}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ margin: "0px 16px" }}>
                    <TextField label="Tên tài sản" name="name" fullWidth disabled value={asset ? asset.name : ''} />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Serial"
                      name="serial"
                      value={serial}
                      onChange={handleChangeSerial}>
                      {asset &&
                        asset.assetSerial.map((item, i) => (
                          <MenuItem key={i} value={item}>
                            {item.serial}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid> */}
                  <Grid item xs={12} style={{ margin: "0px 16px" }}>
                    <AsyncAutocomplete
                      name="Chọn người cấp phát..."
                      label="Người tiếp nhận"
                      onChange={value => setPersonReceive(value)}
                      url={API_HRM_EMPLOYEE}
                      value={personReceive}
                      required
                      error={!personReceive}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ margin: "0px 16px" }}>
                    <DatePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY"
                      value={dateReceive || null}
                      fullWidth
                      variant="outlined"
                      label="Thời gian tiếp nhận"
                      margin="dense"
                      onChange={date => setDateReceive(date)}
                      required
                      error={!dateReceive}
                    />
                  </Grid>
                  <Grid md={12} item style={{ margin: "0px 16px" }}>
                    <TextField label={'Mô tả'} multiline rows={3} fullWidth name="note" value={note} onChange={e => setNote(e.target.value)} />
                  </Grid>
                </Grid>
              </Grid>
            </GridLT>
          </Paper>
          {/* <Grid container spacing={24}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Button variant="contained" className={classes.button} color="primary" onClick={handleSubmit}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button} onClick={handleGoback}>
                Hủy
              </Button>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      {allocationPage.loading ? <LoadingIndicator /> : ''}
    </div>
  );
}

EditAllocationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allocationPage: makeSelectAllocationPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onEditAllocation: body => {
      dispatch(editAllocationAct(body));
    },
    onGetAsset: id => {
      dispatch(getAssetAct(id));
    },
    onCleanup: () => {
      dispatch(cleanup());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'allocationPage', reducer });
const withSaga = injectSaga({ key: 'allocationPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(EditAllocationPage);
