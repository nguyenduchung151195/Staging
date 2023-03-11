import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@material-ui/core';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import CustomButton from '../../../../../../../components/Button/CustomButton';
import CustomInputBase from '../../../../../../../components/Input/CustomInputBase';
import { AsyncAutocomplete, Autocomplete } from '../../../../../../../components/LifetekUi';
import { API_PERSONNEL } from '../../../../../../../config/urlConfig';

function AddTakeLeaveManager(props) {
  const { onSave, onClose, data, name2Title, open } = props;
  const [localData, setLocalData] = useState({
    hrmEmployeeId: {},
    date: '',
    approved: [],
    type: '',
    reason: '',
  });
  const [vacationMode, setVactionMode] = useState([]);

  useEffect(() => {
    const viewConfig = JSON.parse(localStorage.getItem('hrmSource'));
    const viewConfigCode = viewConfig ? viewConfig.filter(item => item.code === 'S19') : null;
    const data = viewConfigCode ? viewConfigCode[0].data : null;
    setVactionMode(data);
  }, []);

  useEffect(
    () => {
      if (data && data.originItem) {
        setLocalData({ ...data.originItem });
      } else {
        setLocalData({});
      }
    },
    [data],
  );

  const handleChange = useCallback(
    e => {
      const {
        target: { value, name },
      } = e;
      setLocalData({
        ...localData,
        [name]: value,
      });
    },
    [localData],
  );

  const handleChangeEmployee = value => {
    if (value) {
      setLocalData({ ...localData, hrmEmployeeId: value });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localData);
    }
  };

  const getSelectedValue = val => {
    if (!val) return null;
    return vacationMode.find(i => i._id === val._id);
  };

  // console.log('1', localData.hrmEmployeeId)
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle id="alert-dialog-title">Thêm bảng công</DialogTitle>
        <DialogContent style={{  height: 450 }}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <CustomInputBase type="date" label={name2Title.date} value={localData.date} onChange={handleChange} name="date" />
            </Grid>
            <Grid item xs={6}>
              <AsyncAutocomplete
                // isMulti
                name="Chọn..."
                label="Nhân viên"
                url={API_PERSONNEL}
                onChange={handleChangeEmployee}
                value={localData.hrmEmployeeId}
                // optionValue="name"
                // optionLabel="name"
              />
            </Grid>
            {localData.hrmEmployeeId && localData.hrmEmployeeId._id ? (
              <Grid item xs={6}>
                <CustomInputBase select label={name2Title['type.title']} value={getSelectedValue(localData.type)} onChange={handleChange} name="type">
                  {Array.isArray(vacationMode) && vacationMode.length && vacationMode.map(item => <MenuItem value={item}>{item.title}</MenuItem>)}
                </CustomInputBase>
              </Grid>
            ) : (
              ''
            )}
            <Grid item xs={6}>
              <CustomInputBase label={name2Title.reason} value={localData.reason} onChange={handleChange} name="reason" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <CustomButton color="primary" onClick={handleSave}>
                Lưu
              </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton color="secondary" onClick={e => onClose()}>
                HỦY
              </CustomButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default compose(memo)(AddTakeLeaveManager);
