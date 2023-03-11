/**
 *
 * AddRoundRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info, Add } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar } from '@material-ui/core';
import { API_USERS, API_RECRUITMENT, API_HUMAN_RESOURCE } from 'config/urlConfig';
import AddSubjectRecruimentDialog from '../AddSubjectRecruiment';
import Buttons from 'components/CustomButtons/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */
function AddRoundRecruitment(props) {
  const [tab, setTab] = useState(0);

  const [localState, setLocalState] = useState({});

  const [name2Title, setName2Title] = useState({});
  const [kanbanStatuses, setKanbanStatuses] = useState(['']);
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { recruitmentWavePage, recruitmentWave, onClose, code, apiUrl, createRoundRecruitment, onCreateRoundRecruitment } = props;
  const { updateSubjectSuccess } = recruitmentWavePage;

  useEffect(() => {
    setIsOpenDialog(false);
  },
    [updateSubjectSuccess]);

  const Bt = props => (
    <Buttons onClick={() => setTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );

  useEffect(
    () => {
      if (false) {
        setLocalState({});
      } else {
        setLocalState({ recruitmentWaveId: recruitmentWave.originItem._id });
      }
    },
    [recruitmentWave],
  );

  useEffect(() => {
    setName2Title(viewConfigName2Title(code));
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));

    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const crmStatus = listCrmStatus && listCrmStatus.find(element => String(element.code) === 'ST09');
    if (crmStatus) {
      setKanbanStatuses(crmStatus.data);
    }
  }, []);

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleAsyncChange = useCallback(
    e => {
      setLocalState({ ...localState, judges: e });
    },
    [localState],
  );

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={() => setIsOpenDialog(true)}>
      Open Menu
    </Add>
  );

  return (
    <>
      <Grid container>
        <Bt tab={0} style={{ marginLeft: 30 }}>
          Thông tin chính
        </Bt>

        <Bt tab={1}>Môn thi</Bt>
      </Grid>

      {tab === 0 && (
        <Grid container spacing={16}>
          <Grid item md={8}>
            <CustomInputBase label="Tên vòng thi" name="name" value={localState.name} onChange={handleInputChange} />
          </Grid>

          <Grid item md={4}>
            <CustomInputBase label="Ngày thực hiện" name="dateStart" value={localState.dateStart} type="date" onChange={handleInputChange} />
          </Grid>
          <Grid item md={4}>
            <CustomInputBase label="Số thứ tự" name="no" value={localState.no} onChange={handleInputChange} type="number" />
          </Grid>
          <Grid item md={4}>
            <CustomInputBase label="Điểm cần đạt" name="minScoreRequire" value={localState.minScoreRequire} onChange={handleInputChange} />
          </Grid>
          <Grid item md={4}>
            <AsyncAutocomplete url={API_USERS} label="Ban giám khảo" name="judges" isMulti onChange={handleAsyncChange} value={localState.judges} />
          </Grid>
          <Grid item md={12}>
            <CustomInputBase label="Mô tả" name="description" value={localState.description} multiline rows={5} onChange={handleInputChange} />
          </Grid>

          <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <CustomButton
                color="primary"
                onClick={e => {
                  if (!localState._id) createRoundRecruitment(localState);
                  else onCreateRoundRecruitment(localState);
                }}
              >
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
      )}

      {tab === 1 && (
        <Grid container spacing={16}>
          <ListPage
            code={code}
            parentCode="hrm"
            onEdit={row => setIsOpenDialog(false)}
            onDelete={() => { }}
            reload={updateSubjectSuccess}
            apiUrl={apiUrl}
            settingBar={[addItem()]}
            disableAdd
          />
        </Grid>
      )}

      <Dialog maxWidth={'md'} open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <DialogTitle>THIẾT LẬP MÔN THI</DialogTitle>
        <DialogContent>
          <AddSubjectRecruimentDialog {...props} isOpenDialog={isOpenDialog} setIsOpenDialog={setIsOpenDialog} code={code} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddRoundRecruitment);
