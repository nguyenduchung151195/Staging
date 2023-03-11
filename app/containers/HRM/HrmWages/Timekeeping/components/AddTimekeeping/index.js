/**
 *
 * AddTimekeeping
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
// import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title } from 'utils/common';
import KanbanStepper from 'components/KanbanStepper';
/* eslint-disable react/prefer-stateless-function */
function AddTimekeeping(props) {
  const { timekeeping, onSave, onClose, code } = props;
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
  }, []);

  useEffect(
    () => {
      if (timekeeping && timekeeping.originItem) {
        setLocalState({ ...timekeeping.originItem });
      } else {
        setLocalState({});
      }
    },
    [timekeeping],
  );

  useEffect(() => {
    const listKanBan = JSON.parse(localStorage.getItem('hrmStatus')) || null;
    if (listKanBan) {
      let hrmKanbanStatuses = listKanBan.find(p => p.code === 'ST06');
      if (hrmKanbanStatuses && hrmKanbanStatuses.data) {
        setListKanbanStatus(hrmKanbanStatuses.data);
        // if (id === 'add') {
        const { _id } = hrmKanbanStatuses.data;
        setLocalState({ ...localState, kanbanStatus: _id });
        // }
      }
    }
  }, [timekeeping])

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  // const handeChangeDepartment = result => {
  //   const { department } = result;
  //   setLocalState({ ...localState, organizationUnit: department });
  // };

  return (
    <>
      {/* <Grid>
        <KanbanStepper
          listStatus={listKanbanStatus}
          onKabanClick={value => {
            setLocalState({ kanbanStatus: value });
          }}
          activeStep={localState.kanbanStatus}
        />
      </Grid> */}
      {/* <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
            Chấm công
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.name} value={localState.name} name="name" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.unit} value={localState.unit} name="unit" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.proponent} value={localState.proponent} name="proponent" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase type="date" label={name2Title.dateFounded} value={localState.dateFounded} name="dateFounded" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase type="date" label={name2Title.dateNeeded} value={localState.dateNeeded} name="dateNeeded" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.reason} value={localState.reason} name="reason" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Chi tiết nhu cầu tuyển dụng
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.vacancy} value={localState.vacancy} name="vacancy" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase type="number" label={name2Title.amount} value={localState.amount} name="amount" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase type="number" label={name2Title.amountApprove} value={localState.amountApprove} name="amountApprove" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.certificate} value={localState.certificate} name="certificate" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.specialized} value={localState.specialized} name="specialized" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.experienceYear} value={localState.experienceYear} name="experienceYear" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.age} value={localState.age} name="age" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.levelLanguage} value={localState.levelLanguage} name="levelLanguage" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.gender} value={localState.gender} name="gender" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.marriage} value={localState.marriage} name="marriage" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase rows={5} multiline label={name2Title.skill} value={localState.skill} name="skill" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase rows={5} multiline label={name2Title.experience} value={localState.experience} name="experience" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase rows={5} multiline label={name2Title.requirementsOther} value={localState.requirementsOther} name="requirementsOther" onChange={handleInputChange} />
        </Grid>
      </Grid> */}
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      <Grid container spacing={8}
        direction="row"
        justify="space-between"
        alignItems="flex-end">
        <Grid item xs={4}>
          <CustomInputBase select label="Chọn mẫu báo cáo" value={localState.reportForm} name="reportForm" onChange={handleInputChange} />
        </Grid>
        <Grid item>
          <Grid container spacing={8}>
            <Grid item>
              <CustomButton
                color="primary"
                onClick={e => {
                  onSave(localState);
                }}
              >
                Lưu
          </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton color="secondary" onClick={e => onClose()}>
                hủy
          </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

AddTimekeeping.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddTimekeeping);
