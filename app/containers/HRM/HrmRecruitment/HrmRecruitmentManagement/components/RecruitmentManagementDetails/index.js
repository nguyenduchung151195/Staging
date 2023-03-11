/**
 *
 * RecruitmentManagementDetails
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { AsyncAutocomplete, Grid, Typography } from '../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigName2Title, viewConfigCheckShowForm, getListData } from 'utils/common';

import KanbanStepper from '../../../../../../components/KanbanStepper';
import Department from '../../../../../../components/Filter/DepartmentAndEmployee';
import { MenuItem, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import CustomInputField from '../../../../../../components/Input/CustomInputField';
import { API_USERS, API_VANCANCIES } from 'config/urlConfig';
import moment from 'moment';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import axios from 'axios';
import { serialize } from 'helper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import { mergeData as MergeData } from '../../../../../Dashboard/actions';
/* eslint-disable react/prefer-stateless-function */
function RecruitmentManagementDetails(props) {
  const {
    recruitmentManagement,
    onSave,
    onClose,
    code,
    humanResource,
    fieldRole,
    countEmployee,
    positionVacation,
    getCountHrmByRole,
    getPositionVacation,
    profile,
    onMergeData,
  } = props;
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localState, setLocalState] = useState({
    name: '',
    unitId: '',
    dateFounded: '',
    dateNeed: '',
    others: {},
    amount: '',
    check: false,
  });
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title({ ...newNam2Title });
  }, []);

  useEffect(
    () => {
      const { unitId, vacancy } = localState;
      if (unitId && vacancy && vacancy.roleCode) {
        getCountHrmByRole(vacancy.roleCode, unitId);
      }
    },
    [localState.unitId, localState.vacancy],
  );
  useEffect(
    () => {
      const { vacancy } = localState;
      if (vacancy && vacancy.roleCode) {
        getPositionVacation(vacancy.roleCode);
      }
    },
    [localState.vacancy],
  );

  useEffect(
    () => {
      const { unitId, vacancy } = localState;
      if (unitId && vacancy && vacancy.roleCode) {
        calAmountHumanResource(unitId, vacancy);
      }
    },
    [localState.unitId, localState.vacancy, countEmployee],
  );
  function calAmountHumanResource(unitId, vacancy) {
    const foundHumanResource = Array.isArray(humanResource) && humanResource.length > 0 ? humanResource.find(it => it.unitId === unitId) : null;
    const foundValueByRoleCode = foundHumanResource
      ? Array.isArray(foundHumanResource.roles) && foundHumanResource.roles.length > 0
        ? foundHumanResource.roles.find(it => it.code === vacancy.code)
        : null
      : null;
    const amountHumanResource = foundValueByRoleCode ? foundValueByRoleCode.value : 0;
    const amountVacancy = amountHumanResource - countEmployee;
    setLocalState({ ...localState, amount: amountVacancy > 0 ? amountVacancy : localState.amount });
  }
  useEffect(
    () => {
      let kanbanStatus;
      const listKanBan = JSON.parse(localStorage.getItem('hrmStatus'));
      if (listKanBan) {
        let hrmKanbanStatuses = listKanBan.find(p => p.code === 'ST06');
        if (hrmKanbanStatuses && hrmKanbanStatuses.data) {
          const { _id } = hrmKanbanStatuses.data[0];
          kanbanStatus = _id;
          setListKanbanStatus(hrmKanbanStatuses.data);
        }
      }
      if (recruitmentManagement && recruitmentManagement.originItem) {
        const { dateFounded, dateNeed, unitId } = recruitmentManagement.originItem;
        setLocalState({
          ...recruitmentManagement.originItem,
          unitId: unitId && unitId._id,
          dateFounded: formatDate(dateFounded),
          dateNeed: formatDate(dateNeed),
        });
      } else {
        setLocalState({ ...localState, proponent: profile, kanbanStatus, gender: 0 });
      }
    },
    [recruitmentManagement],
  );
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);
  const formatDate = date => {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return date;
  };

  const getValueFieldRole = value => {
    if (!value) return null;
    return fieldRole.find(it => it.code === value.roleCode);
  };
  const getValuePosition = value => {
    if (!value) return null;
    return positionVacation.find(it => it.name === value.name);
  };

  return (
    <div style={{ width: props.miniActive ? window.innerWidth - 110 : window.innerWidth - 285 }}>
      <CustomAppBar title={'Chi tiết nhu cầu tuyển dụng'} onGoBack={onClose} className isTask disableAdd />
      <Grid item xs={12} container style={{ height: 'calc(100vh - 80px)', overflow: 'auto', marginTop: 50 }}>
        <Grid container>
          <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
            <Info />
            QUẢN LÝ NHU CẦU TUYỂN DỤNG
          </Typography>
        </Grid>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <CustomInputBase InputProps={{ readOnly: true }} className="CustomForm" label={name2Title.name} value={localState.name} />
          </Grid>
          <Grid item xs={4} className="CustomForm">
            <Department
              style={{ marginTop: 10 }}
              department={localState.unitId}
              disableEmployee
              profile={profile}
              moduleCode="HrmRecruitment"
              upCaseDepartment={true}
              disableDepartment={true}
            />
          </Grid>
          <Grid item xs={4}>
            <AsyncAutocomplete
              InputProps={{ readOnly: true }}
              url={API_USERS}
              value={localState.proponent}
              label={name2Title.proponent}
              optionLabel="name"
              optionValue="_id"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              disabled
              className="CustomForm"
              InputProps={{ readOnly: true }}
              label={name2Title.dateFounded || 'Chọn ngày'}
              value={localState.dateFounded}
              name="dateFounded"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              disabled
              className="CustomForm"
              InputProps={{ readOnly: true }}
              label={name2Title.dateNeed || 'Chọn ngày'}
              value={localState.dateNeed}
              name="dateNeed"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase InputProps={{ readOnly: true }} label={name2Title.reason} value={localState.reason} name="reason" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
              <Info />
              CHI TIẾT NHU CẦU TUYỂN DỤNG
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={getValueFieldRole(localState.vacancy)}
              name="vacancy"
              label={name2Title['vacancy.roleName']}
              type="1"
              configType="hrmSource"
              configCode="S07"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              select
              className="CustomForm"
              label={'VỊ TRÍ TUYỂN DỤNG'}
              value={getValuePosition(localState.vacanciesId)}
              name="vacanciesId"
              InputProps={{ readOnly: true }}
            >
              {Array.isArray(positionVacation) && positionVacation.length > 0
                ? positionVacation.map(field => <MenuItem value={field}>{field.name}</MenuItem>)
                : null}
            </CustomInputBase>
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase InputProps={{ readOnly: true }} label={name2Title.amount} value={localState.amount} name="amount" />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase type="number" label={name2Title.amountApprove} value={localState.amountApprove} name="amountApprove" />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              InputProps={{ readOnly: true }}
              select
              value={localState.certificate}
              name="certificate"
              label={name2Title['certificate']}
              type="1"
              configType="hrmSource"
              configCode="S07"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              InputProps={{ readOnly: true }}
              select
              value={localState.specialized}
              name="specialized"
              label={name2Title['specialized']}
              type="1"
              configType="hrmSource"
              configCode="S06"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase type="number" label={name2Title.experienceYear} value={localState.experienceYear} name="experienceYear" />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              InputProps={{ readOnly: true }}
              select
              value={localState.age}
              name="age"
              label={name2Title['age']}
              type="1"
              configType="hrmSource"
              configCode="S21"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              InputProps={{ readOnly: true }}
              select
              value={localState.levelLanguage}
              name="levelLanguage"
              label={name2Title['levelLanguage']}
              type="1"
              configType="hrmSource"
              configCode="S09"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase InputProps={{ readOnly: true }} select label={name2Title.gender} value={localState.gender} name="gender">
            {/* <CustomInputBase InputProps={{ readOnly: true }} select label={name2Title.gender} value={localState.gender} name="gender" select> */}
              <MenuItem value={0}>Nam</MenuItem>
              <MenuItem value={1}>Nữ</MenuItem>
            </CustomInputBase>
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              InputProps={{ readOnly: true }}
              value={localState.marriage}
              name="marriage"
              label={name2Title['marriage']}
              type="1"
              configType="hrmSource"
              configCode="S02"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase rows={5} multiline inputProps={{ maxLength: 2000 }} label={name2Title.skill} value={localState.skill} name="skill" />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase
              rows={5}
              multiline
              inputProps={{ maxLength: 2000, readOnly: true }}
              label={name2Title.experience}
              value={localState.experience}
              name="experience"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase
              rows={5}
              multiline
              inputProps={{ maxLength: 2000, readOnly: true }}
              label={name2Title.requirementsOther}
              value={localState.requirementsOther}
              name="requirementsOther"
            />
          </Grid>
        </Grid>
        <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} />
        <Grid container spacing={8} direction="row" justify="flex-end" alignItems="flex-end" />
      </Grid>
    </div>
  );
}

RecruitmentManagementDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
)(RecruitmentManagementDetails);
