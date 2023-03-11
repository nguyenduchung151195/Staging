import React, { memo, useEffect, useState, useCallback } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Grid, AsyncAutocomplete } from 'components/LifetekUi';
import {  API_EXAM } from 'config/urlConfig';


/* eslint-disable react/prefer-stateless-function */
function AddRound(props) {
  const [localState, setLocalState] = useState({});

  const { onSave, onClose, passwordData } = props;

//   useEffect(
//     () => {
//       setLocalState({ ...passwordData });
//     },
//     [passwordData],
//   );

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  return (
    <Grid container spacing={16}>

      <Grid item md={6}>
        <CustomInputBase label="Mật khẩu mới" name="password" value={localState.password} onChange={handleInputChange} />
      </Grid>
      <Grid item md={6}>
        <CustomInputBase label="Nhập lại mật khẩu mới" name="newPassword" value={localState.newPassword} onChange={handleInputChange} />
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
