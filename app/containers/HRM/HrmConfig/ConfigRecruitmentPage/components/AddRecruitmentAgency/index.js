import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete, TextField } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info, Add, ShortText, RadioButtonChecked, Image, CheckBox as CheckBoxUI, CropOriginal } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, Tooltip, FormControlLabel, FormControl, RadioGroup, Radio, IconButton } from '@material-ui/core';
import { API_USERS, API_RECRUITMENT, API_HUMAN_RESOURCE } from 'config/urlConfig';
import Buttons from 'components/CustomButtons/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { API_RECRUITMENT_AGENCY } from '../../../../../../config/urlConfig';
import './index.css';
/* eslint-disable react/prefer-stateless-function */
function AddSubject(props) {
  const { onSave, onClose, questionData } = props;
  const [localState, setLocalState] = useState({});
  const [checked, setChecked] = useState(0);
  const [dataCheck, setDataCheck] = useState([]);
  const [errorName, setErrorName] = useState(true);
  const [errorCode, setErrorCode] = useState(true);
  const [errorCheckCode, setErrorCheckCode] = useState(true);

  useEffect(
    () => {
      const api = `${API_RECRUITMENT_AGENCY}`;
      if (api)
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setDataCheck(data.data);
          });
    },
    [onClose],
  );
  const arrayCheck = dataCheck.map(i => i.code);
  useEffect(
    () => {
      if (localState.name === '' || localState.name === undefined) {
        setErrorName(false);
      } else setErrorName(true);
      if (localState.code === '' || localState.code === undefined) {
        setErrorCode(false);
      } else setErrorCode(true);
      if (arrayCheck.includes(localState.code)) {
        setErrorCheckCode(false);
      } else setErrorCheckCode(true);
    },
    [localState],
  );

  const handleSave = () => {
    // setErrorName(true);
    // setErrorCode(true);
    // setErrorCheckCode(true);
    if (localState.name === '' || localState.name === undefined) {
      // setErrorName(false);
      return;
    }
    if (localState.code === '' || localState.code === undefined) {
      // setErrorCode(false);
      return;
    }
    if (arrayCheck.includes(localState.code)) {
      // setErrorCheckCode(false);
      return;
    }
    onSave(localState);
  };

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );
  useEffect(() => {
    setLocalState(props.recruitmentAgencyData);
  }, []);
  return (
    <Grid container item xs={12} spacing={16}>
      <Grid container justify="center" item xs={4}>
        <CustomInputBase
          // className="CustomTextRequired"
          label="Tên đơn vị tuyển dụng*"
          onChange={e => handleInputChange(e)}
          value={localState.name}
          name="name"
          margin="normal"
          error={!errorName}
          helperText={!errorName ? 'Không được để trống trường Tên đơn vị tuyển dụng' : ''}
        />
      </Grid>
      <Grid container justify="center" item xs={4}>
        <CustomInputBase
          // className="CustomTextRequired"
          label="Mã đơn vị*"
          onChange={e => handleInputChange(e)}
          value={localState.code}
          name="code"
          margin="normal"
          error={!errorCode || !errorCheckCode}
          helperText={!errorCode ? 'Không được để trống trường Mã đơn vị' : !errorCheckCode ? 'Mã đơn vị bị trùng' : ''}
        />
      </Grid>
      <Grid container justify="center" item xs={4}>
        <CustomInputBase
          className="CustomText"
          label="Số điện thoại"
          onChange={e => handleInputChange(e)}
          value={localState.phoneNumber}
          name="phoneNumber"
          margin="normal"
        />
      </Grid>
      <Grid container justify="center" item xs={6}>
        <CustomInputBase
          className="CustomText"
          label="Địa chỉ"
          onChange={e => handleInputChange(e)}
          value={localState.address}
          name="address"
          margin="normal"
        />
      </Grid>
      <Grid container justify="center" item xs={6}>
        <CustomInputBase
          className="CustomText"
          label="Người liên lạc"
          onChange={e => handleInputChange(e)}
          value={localState.contact}
          name="contact"
          margin="normal"
        />
      </Grid>
      <Grid container item xs={12} spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={handleSave}>
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
            hủy
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(AddSubject);
