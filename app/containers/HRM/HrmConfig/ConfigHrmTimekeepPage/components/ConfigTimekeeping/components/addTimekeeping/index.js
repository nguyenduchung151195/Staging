import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from 'components/LifetekUi';
import { Typography, AppBar, Toolbar, IconButton, Button, TextField, MenuItem } from '@material-ui/core';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';

import { API_TIMEKEEPING_ADDEQUIPMENT } from 'config/urlConfig';
import ListPage from 'components/List';
import Department from 'components/Filter/DepartmentAndEmployee';
import { SwipeableDrawer } from 'components/LifetekUi';
import EditEmployees from '../EditEmployees/Loadable';
import { configAddTimeKeeping } from 'variable';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomAppBar from 'components/CustomAppBar';
import './index.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { mergeData as MergeData } from '../../../../../../../Dashboard/actions';
function AddTimekeeping(props) {
  const { update, timekeeping, onUpdate, onClose, onChangeSnackbar, profile } = props;
  const [configState, setConfigState] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [configMessages, setConfigMessages] = useState({});
  const [selectEditEmployees, setSelectEditEmployees] = useState(false);

  useEffect(
    () => {
      if (timekeeping) {
        setConfigState({ ...timekeeping });
      } else {
        setConfigState({});
      }
    },
    [timekeeping],
  );

  // useEffect(
  //   () => {
  //     const messages = viewConfigCheckForm(code, configState);
  //     setConfigMessages(messages);
  //     return () => {
  //       messages;
  //     };
  //   },
  //   [configState],
  // );

  const handleOpenEditConfigDialog = row => {
    setSelectEditEmployees(row);
    setOpenDialog(true);
  };

  useEffect(() => {
    return () => {
      setTimeout(() => {
        props.onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  const handleCloseEditConfigDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleInputChange = e => {
    setConfigState({
      ...configState,
      [e.target.name]: e.target.value,
    });
  };

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setConfigState({ ...configState, organizationUnit: department });
    },
    [configState],
  );

  const handleTimekeepingUpdate = e => {
    if (Object.keys(configMessages).length === 0) {
      // console.log('check>>>>', configState)
      onUpdate(configState);
    } else {
      onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };
  return (
    <React.Fragment>
      <Grid container spacing={24} style={{ marginTop: 70, padding: 10 }}>
        <CustomAppBar className isTask title="CẤU HÌNH MÁY CHẤM CÔNG" onGoBack={() => props.onClose()} onSubmit={handleTimekeepingUpdate} />

        <Grid item xl={6} xs={6}>
          <CustomInputBase name="code" label="Mã máy chấm công" onChange={handleInputChange} value={configState.code} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="name" label="Tên máy chấm công" onChange={handleInputChange} value={configState.name} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="port" label="Port" onChange={handleInputChange} value={configState.port} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="ip" label="Địa chỉ ip" onChange={handleInputChange} value={configState.ip} />
        </Grid>

        <Grid item xl={6} xs={6}>
          <Department
            onChange={handeChangeDepartment}
            department={configState.organizationUnit}
            disableEmployee
            moduleCode="hrm"
            fullWidth
            profile={profile}
          />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase
            label="Mật khẩu"
            value={configState.password}
            name="password"
            onChange={handleInputChange}
            variant="outlined"
            type="password"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            required
          />
        </Grid>
        <SwipeableDrawer anchor="right" onClose={handleCloseEditConfigDialog} open={openDialog} width={window.innerWidth - 260}>
          <Grid>
            <EditEmployees employees={selectEditEmployees} onClose={handleCloseEditConfigDialog} propsAll={props} />
          </Grid>
        </SwipeableDrawer>
      </Grid>
    </React.Fragment>
  );
}

AddTimekeeping.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AddTimekeeping);
