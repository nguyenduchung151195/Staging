/**
 *
 * AddWages
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { API_USERS } from '../../../../../../config/urlConfig';
import { compose } from 'redux';
import { replace } from 'lodash';
import NumberFormat from 'react-number-format';
/* eslint-disable react/prefer-stateless-function */
function AddWages(props) {
  const { wages, onSave, onClose, code, open, onChangeSnackbar, profile } = props;
  const [localState, setLocalState] = useState({
    month: '',
    year: '',
    file: {},
    // employee: '',
    // organizationUnitId: '',
    others: {},
  });
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [isMonth, setIsMonth] = useState(false);
  const [isYear, setIsYear] = useState(false);

  const [isLenghtYear, setIsLenghtYear] = useState(false);
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === code);
  const yearConfig = list.listDisplay.type.fields.type.columns[1];
  const minYear = parseInt(yearConfig.min);
  const maxYear = parseInt(yearConfig.max);

  const [isLenghtMotnh, setIsLenghtMotnh] = useState(false);
  const monthConfig = list.listDisplay.type.fields.type.columns[0];
  const minMonth = parseInt(monthConfig.min);
  const maxMonth = parseInt(monthConfig.max);

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');

    const messages = viewConfigCheckForm(code, localState);
    setLocalMessages(messages);
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
      messages;
    };
  }, []);

  useEffect(
    () => {
      if (wages && wages.originItem) {
        setLocalState({ ...wages.originItem });
      } else {
        setLocalState({});
      }
    },
    [wages],
  );

  const handleInputChangeMonth = e => {
    // if (e.target.value > -1 && e.target.value < 13) {
    //   e.target.value = e.target.value.replace(/^(0|\+?[1-9][0-9][3-9]\d*)$/);
    // } else e.target.value = e.target.value.slice(0, 1);
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    setLocalMessages(messages);
    let month = parseInt(e.target.value);
    if (month > 12 || month < 1) {
      setIsMonth(true);
    } else {
      setIsMonth(false);
    }
    if (month < minMonth || month > maxMonth) {
      setIsLenghtMotnh(true);
    } else {
      setIsLenghtMotnh(false);
    }
  };

  const handleInputChangeYear = e => {
    // e.target.value = e.target.value.replace(/^(0|\+?[1-9][0-9][0-9][0-9][0-9]\d*)$/);
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    setLocalMessages(messages);
    let yearLength = e.target.value.length;
    let year = parseInt(e.target.value);
    if (yearLength > 4) {
      setIsYear(true);
    } else {
      setIsYear(false);
    }
    if (year < minYear || year > maxYear) {
      setIsLenghtYear(true);
    } else {
      setIsLenghtYear(false);
    }
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department, employee } = result;
      setLocalState({ ...localState, organizationUnitId: department, inChargedEmployeeId: employee && employee._id, employee });
    },
    [localState],
  );

  const handleSave = () => {
    const messages = viewConfigCheckForm(props.code, localState);
    if (
      localState.month !== 0 &&
      localState.year !== 0 &&
      localState.organizationUnitId &&
      localState.inChargedEmployeeId !== null &&
      localState.month >= 1 &&
      localState.month <= 13 &&
      localState.year < 10000 &&
      localState.year >= 1000
    ) {
      if (
        Object.values(messages).filter(v => v).length ||
        localState.month < minMonth ||
        localState.month > maxMonth ||
        localState.year < minYear ||
        localState.year > maxYear
      ) {
        return props.onChangeSnackbar({ variant: 'error', message: 'Lưu dữ liệu thất bại', status: true });
      }
      onSave(localState);
      setLocalState({});
    } else {
      if (!localState.month || localState.month === '') {
        onChangeSnackbar({ status: true, message: 'Không được để trống tháng', variant: 'error' });
      }
      if (localState.month < 1) {
        onChangeSnackbar({ status: true, message: 'Không được để trống tháng', variant: 'error' });
      }
      if (!localState.year || localState.year === '') {
        onChangeSnackbar({ status: true, message: 'Không được để trống năm', variant: 'error' });
      }
      if (localState.year < 1) {
        onChangeSnackbar({ status: true, message: 'Không được để trống năm', variant: 'error' });
      }
      if (localState.year > 10000) {
        onChangeSnackbar({ status: true, message: 'Năm không hợp lệ', variant: 'error' });
      }
      if (localState.year >= 1 && localState.year < 1000) {
        onChangeSnackbar({ status: true, message: 'Năm không hợp lệ', variant: 'error' });
      }
      if (localState.month > 12) {
        onChangeSnackbar({ status: true, message: 'Tháng không tồn tại', variant: 'error' });
      }
      if (!localState.organizationUnitId) {
        onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' });
      }
      if (localState.inChargedEmployeeId === null) {
        onChangeSnackbar({ status: true, message: 'Không được để trống người phụ trách', variant: 'error' });
      }
    }
  };

  const handleClose = () => {
    onClose();
    setLocalState({});
    setIsLenghtYear(false);
    setIsLenghtMotnh(false);
    setIsYear(false);
    setIsMonth(false);
    setIsEmployee && setIsEmployee('');
    setIsUnit('');
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle id="alert-dialog-title">Thêm bảng công</DialogTitle>
        <DialogContent style={{ height: 450 }}>
          <Grid container direction="row" justify="center" alignItems="flex-start" spacing={8}>
            <Grid item xs={6}>
              <NumberFormat
                label={name2Title.month}
                value={localState.month}
                name="month"
                onChange={handleInputChangeMonth}
                required={checkRequired && checkRequired.month}
                checkedShowForm={checkShowForm && checkShowForm.month}
                error={(localMessages && localMessages.month) || isMonth || isLenghtMotnh}
                helperText={
                  (localMessages && localMessages.month) ||
                  (isMonth ? 'Tháng không hợp lệ' : '') ||
                  (isLenghtMotnh ? `Tháng phải lớn hơn hoặc bằng ${minMonth} và nhỏ hơn hoặc bằng ${maxMonth}` : '')
                }
                margin="normal"
                customInput={CustomInputBase}
                allowNegative={false}
                decimalSeparator={null}
              />
            </Grid>
            <Grid item xs={6}>
              <NumberFormat
                label={name2Title.year}
                value={localState.year}
                name="year"
                onChange={handleInputChangeYear}
                required={checkRequired && checkRequired.year}
                checkedShowForm={checkShowForm && checkShowForm.year}
                error={(localMessages && localMessages.year) || isYear || isLenghtYear}
                helperText={
                  (localMessages && localMessages.year) ||
                  (isYear ? 'Năm không hợp lệ' : '') ||
                  (isLenghtYear ? `Năm phải lớn hơn hoặc bằng ${minYear} và nhỏ hơn hoặc bằng ${maxYear}` : '')
                }
                margin="normal"
                customInput={CustomInputBase}
                allowNegative={false}
                decimalSeparator={null}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Department
                onChange={handeChangeDepartment}
                department={localState.organizationUnitId}
                employee={localState.employee}
                required={checkRequired && checkRequired.organizationUnitId}
                checkedShowForm={checkShowForm && checkShowForm.organizationUnitId}
                errorEmployee={!localState.inChargedEmployeeId ? "không được để trống NHÂN VIÊN" : ''}
                error={!localState.organizationUnitId}
                helperText={!localState.organizationUnitId ? 'không được để trống PHÒNG BAN' : ''}
                profile={profile}
                moduleCode="HrmTimekeepingTable"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                type="file"
                name="file"
                onChange={e => setLocalState(prevState => ({ ...prevState, file: e.target.files[0] }))}
                id="HIDDEN"
                style={{ display: 'none' }}
              />
              <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                <Typography variant="body1">{localState.file && localState.file.name}</Typography>
                <label htmlFor="HIDDEN">
                  <Tooltip title="Import">
                    <CloudDownloadIcon color="primary" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                  </Tooltip>
                </label>
                <Typography>{localState.file && localState.file.name ? 'Import bảng chấm công' : ''}</Typography>
              </Grid>
            </Grid> */}
            <CustomGroupInputField code={code} columnPerRow={1} value={localState.others} onChange={handleOtherDataChange} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton color="primary" onClick={() => handleSave()} varian="outlined">
                  Lưu
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton varian="outlined" color="secondary" onClick={e => handleClose()}>
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

AddWages.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(AddWages);
