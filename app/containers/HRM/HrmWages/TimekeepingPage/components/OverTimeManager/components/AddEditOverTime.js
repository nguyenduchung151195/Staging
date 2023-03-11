/**
 *
 * AddWageSalary
 *
 */

import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomButton from 'components/Button/CustomButton';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import CustomInputBase from 'components/Input/CustomInputBase';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { API_HRM_EMPLOYEE } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange, viewConfigName2Title } from 'utils/common';
/* eslint-disable react/prefer-stateless-function */
function AddWageSalary(props) {
  const { onSave, onClose, code, open, onChangeSnackbar, data, profile } = props;
  const [localState, setLocalState] = useState({
    timeStart: '',
    timeEnd: '',
    month: '',
    year: '',
    reason: '',
    organizationUnitId: '',
  });
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  useEffect(() => {
    // const newNam2Title = viewConfigName2Title(code);
    // setName2Title(newNam2Title);
    // const checkRequired = viewConfigCheckRequired(code, 'required');
    // const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    // const messages = viewConfigCheckForm(code, localState);
    // setLocalMessages(messages);
    // setCheckRequired(checkRequired);
    // setCheckShowForm(checkShowForm);
    // return () => {
    //   newNam2Title;
    //   checkRequired;
    //   checkShowForm;
    //   messages;
    // }
  }, []);

  useEffect(
    () => {
      if (data) {
        const localHrmEmployeeId = {
          _id: '',
          name: '',
        };
        localHrmEmployeeId._id = data['hrmEmployeeId._id'];
        localHrmEmployeeId.name = data['hrmEmployeeId.name'];
        setLocalState({ ...data, organizationUnitId: data['organizationUnit._id'], hrmEmployeeId: localHrmEmployeeId });
      } else {
        setLocalState({});
      }
    },
    [data],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    // const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    // setLocalMessages(messages);
  };

  const handleInputChangeEmp = useCallback(
    e => {
      setLocalState({ ...localState, hrmEmployeeId: e });
      // const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
      // setLocalMessages(messages);
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department, employee } = result;
      setLocalState({ ...localState, organizationUnitId: department, hrmEmployeeId: '' });
    },
    [localState],
  );

  const handleSave = () => {
    // if (localState.month && localState.year && localState.organizationUnitId && localState.formula && localState.inChargedEmployeeId !== null) {
    onSave(localState);
    setLocalState({});
    onClose();
    // }
    // if (!localState.month) {
    //   setLocalMessages({ ...localMessages, month: 'Không được để trống tháng' })
    // } else {
    //   delete localMessages.month
    // }
    // if (!localState.year) {
    //   setLocalMessages({ ...localMessages, year: 'Không được để trống năm' })
    // } else {
    //   delete localMessages.year
    // }
    // if (!localState.formula) { onChangeSnackbar({ status: true, message: 'Không được để trống công thức lương', variant: 'error' }) }
    // if (!localState.organizationUnitId) { onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' }) }
    // if (localState.inChargedEmployeeId === null) { onChangeSnackbar({ status: true, message: 'Không được để trống người phụ trách', variant: 'error' }) }
  };
  const handleClose = () => {
    setLocalState({});
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{data ? 'Sửa thời gian tăng ca' : 'Thêm thời gian tăng ca'}</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <Grid container direction="row" justify="center" alignItems="flex-start" spacing={8}>
            <Grid item xs={6}>
              <Department
                onChange={handeChangeDepartment}
                department={localState.organizationUnitId}
                disableEmployee
                profile={profile}
                moduleCode="HrmOverTime"
              />
            </Grid>
            {localState.organizationUnitId && (
              <Grid item xs={6}>
                <AsyncAutocomplete
                  // isMulti
                  name="hrmEmployeeId"
                  style={{ width: '100%', height: '100%' }}
                  label="Tên nhân viên"
                  onChange={handleInputChangeEmp}
                  url={API_HRM_EMPLOYEE}
                  value={localState.hrmEmployeeId}
                  filter={{
                    organizationUnit: localState.organizationUnitId,
                  }}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <CustomInputBase
                type="time"
                label={'Thời gian bắt đầu'}
                value={localState.timeStart}
                name="timeStart"
                onChange={handleInputChange}
              // required={checkRequired && checkRequired.month}
              // checkedShowForm={checkShowForm && checkShowForm.month}
              // error={localMessages && localMessages.month}
              // helperText={localMessages && localMessages.month}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInputBase
                type="time"
                label={'Thời gian kết thúc'}
                value={localState.timeEnd}
                name="timeEnd"
                onChange={handleInputChange}
              // required={checkRequired && checkRequired.year}
              // checkedShowForm={checkShowForm && checkShowForm.year}
              // error={localMessages && localMessages.year}
              // helperText={localMessages && localMessages.year}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomInputBase type="number" label={'Tháng'} value={localState.month} name="month" onChange={handleInputChange} />
            </Grid>

            <Grid item xs={6}>
              <CustomInputBase type="number" label={'Năm'} value={localState.year} name="year" onChange={handleInputChange} />
            </Grid>

            <Grid item xs={12}>
              <CustomInputBase
                // label={getLabelName('description', 'Stock')}
                label={'GHI CHÚ'}
                multiline
                rows={3}
                name="reason"
                value={localState.reason}
                onChange={handleInputChange}
              // required={checkRequired && checkRequired.formula}
              // checkedShowForm={checkShowForm && checkShowForm.formula}
              // error={localMessages && localMessages.formula}
              // helperText={localMessages && localMessages.formula}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton
                  color="primary"
                  onClick={e => {
                    if (Object.keys(localMessages).length === 0) {
                      handleSave();
                    } else {
                      // onChangeSnackbar({ status: true, message: 'Thêm mới thất bại!', variant: 'error' });
                    }
                  }}
                >
                  Lưu
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton color="secondary" onClick={e => handleClose()}>
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddWageSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(AddWageSalary);
