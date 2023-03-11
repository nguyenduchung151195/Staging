/**
 *
 * AddSubjectRecruiment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, AsyncAutocomplete } from 'components/LifetekUi';
import { API_HRM_RECRUIMENTWAVE, API_USERS } from 'config/urlConfig';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';

/* eslint-disable react/prefer-stateless-function */
function AddSubjectRecruiment(props) {
  const [localState, setLocalState] = useState({});

  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const { code, isOpenDialog, setIsOpenDialog, onCreateSubjectRecruiment } = props;

  useEffect(() => {
    setName2Title(viewConfigName2Title(code));
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));
  }, []);

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleAsyncChange = useCallback(
    e => {
      setLocalState({ ...localState, supervisor: e });
    },
    [localState],
  );

  return (
    <>
      <Grid container spacing={8}>
        <Grid container spacing={16}>
          <Grid item md={6}>
            <CustomInputBase label="Môn thi" name="name" value={localState.name} onChange={handleInputChange} />
          </Grid>
          <Grid item md={6}>
            <AsyncAutocomplete
              isMulti
              url={API_USERS}
              label="Giám thị"
              name="supervisor"
              value={localState.supervisor}
              onChange={handleAsyncChange}
            />
          </Grid>
          <Grid item md={6}>
            <CustomInputBase label="Thời gian thi" name="startTime" value={localState.startTime} onChange={handleInputChange} type="date" />
          </Grid>
          <Grid item md={6}>
            <CustomInputBase label="Thời gian kết thúc" name="endTime" value={localState.endTime} onChange={handleInputChange} type="date" />
          </Grid>

          <Grid item md={12}>
            <CustomInputBase multiline rows={5} label="Mô tả" name="description" value={localState.description} onChange={handleInputChange} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              setIsOpenDialog(false);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={() => setIsOpenDialog(false)}>
          hủy
          </CustomButton>
        </Grid>
      </Grid>
    </>
  );
}

AddSubjectRecruiment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddSubjectRecruiment);
