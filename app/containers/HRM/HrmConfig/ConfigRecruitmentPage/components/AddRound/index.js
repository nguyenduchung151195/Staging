import React, { memo, useEffect, useState, useCallback } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Grid, AsyncAutocomplete } from 'components/LifetekUi';
import { API_EXAM } from 'config/urlConfig';
import { Checkbox, MenuItem } from '@material-ui/core';
import './index.css';

/* eslint-disable react/prefer-stateless-function */
function AddRound(props) {
  const [localState, setLocalState] = useState({
    autoSend: false,
  });

  const { onSave, onClose, roundData } = props;

  useEffect(
    () => {
      setLocalState({ ...roundData });
    },
    [roundData],
  );

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );
  const handleExamChanged = e => {
    setLocalState({ ...localState, exams: e });
  };
  const handleCheckboxChange = e => {
    setLocalState({ ...localState, autoSend: e.target.checked });
  };

  return (
    <Grid container spacing={16}>
      <Grid item md={6}>
        <CustomInputBase className="CustomTextRequired" label="Mã vòng thi*" name="code" value={localState.code} onChange={handleInputChange} />
      </Grid>

      <Grid item md={6}>
        <CustomInputBase className="CustomTextRequired" label="Tên vòng thi*" name="name" value={localState.name} onChange={handleInputChange} />
      </Grid>

      {/* <Grid item md={6}>
        <CustomInputBase label="Điểm cần đạt" name="scoreRequire" value={localState.scoreRequire} onChange={handleInputChange} />
      </Grid>

      <Grid item md={6}>
        <CustomInputBase label="Thứ tự" name="num" value={localState.num} onChange={handleInputChange} />
      </Grid> */}

      <Grid item md={12}>
        <AsyncAutocomplete
          className="CustomTextRequired"
          isMulti
          label={'Chọn môn thi*'}
          name="exams"
          value={localState.exams}
          onChange={handleExamChanged}
          url={API_EXAM}
        />
      </Grid>

      <Grid item md={12}>
        <CustomInputBase className="CustomText" label="Mô tả" name="note" value={localState.note} onChange={handleInputChange} mutiline rows={5} />
      </Grid>
      <Grid item md={12}>
        <CustomInputBase className="CustomText" select onChange={handleInputChange} label={'Loại vòng thi'} value={localState.type} name="type">
          <MenuItem key={'online'} value={'link'}>
            Online
          </MenuItem>
          <MenuItem key={'offine'} value={'direct'}>
            Trực tiếp
          </MenuItem>
        </CustomInputBase>
        <Grid item md={12} className="CustomText">
          Tự động:
          <Checkbox checked={localState.autoSend} onChange={e => handleCheckboxChange(e)} />
        </Grid>
      </Grid>
      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => onSave(localState)}>
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
            HỦY
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(AddRound);
