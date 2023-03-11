/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { TextField } from 'components/LifetekUi';

import { AsyncAutocomplete, Grid, Typography } from '../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigName2Title, viewConfigCheckShowForm, getListData } from 'utils/common';
import { changeSnackbar } from 'containers/Dashboard/actions';
import KanbanStepper from '../../../../../../components/KanbanStepper';
import Department from '../../../../../../components/Filter/DepartmentAndEmployee';
import { MenuItem, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import CustomInputField from '../../../../../../components/Input/CustomInputField';
import { API_USERS, API_VANCANCIES, API_RECRUITMENT } from 'config/urlConfig';
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
import './style.css';
import CustomizedSnackbars from '../../../../../../components/Snackbar';
import { viewConfigHandleOnChange } from 'utils/common';

/* eslint-disable react/prefer-stateless-function */
function AddRecruitmentManagement(props) {
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
    dateFounded: new Date(),
    dateNeed: new Date(),
    others: {},
    amount: '',
    check: false,
    vacanciesId: '',
    vacancy: '',
    kanbanStatus: JSON.parse(localStorage.getItem('hrmStatus')) &&
      JSON.parse(localStorage.getItem('hrmStatus')).find(p => p.code === 'ST06') &&
      JSON.parse(localStorage.getItem('hrmStatus')).find(p => p.code === 'ST06').data[0] ?
      JSON.parse(localStorage.getItem('hrmStatus')).find(p => p.code === 'ST06').data[0]._id : ""
  });
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.']);
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [checkDate, setCheckDate] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    variant: '',
    message: '',
  });
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title({ ...newNam2Title });
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
  }, []);

  useEffect(
    () => {
      const localMessages = viewConfigCheckForm(code, localState);
      setLocalMessages(localMessages);
    },
    [localState],
  );

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
  useEffect(
    () => {
      let date1 = new Date(localState.dateFounded);
      let date2 = new Date(localState.dateNeed);
      let time1 = date1.getTime();
      let time2 = date2.getTime();

      if (localState.dateFounded !== '' && localState.dateNeed !== '') {
        if (time1 > time2) {
          setCheckDate(true);
          setLocalState({ ...localState, check: true });
        } else {
          setCheckDate(false);
          setLocalState({ ...localState, check: false });
        }
      }
    },
    [localState.dateFounded, localState.dateNeed],
  );

  useEffect(
    () => {
      if (props.recruitmentManagement !== null) {
        const api = `${API_RECRUITMENT}/${recruitmentManagement._id}`;
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            // console.log('12312321321', data);
            setLocalState(data.data);
          });
      }
    },
    [recruitmentManagement],
  );

  const handleInputChange = useCallback(
    (e, isDate, date) => {
      const name = isDate ? 'dateFounded' : 'dateNeed';
      const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      if (date) {
        setLocalState({ ...localState, [name]: value });
      } else {
        setLocalState({ ...localState, [e.target.name]: e.target.value });
      }
    },
    [localState],
  );
  // const handleInputChangeSelect = (e, fieldName) => {
  //   const value = e.target.value;
  //   const messages = viewConfigHandleOnChange('HrmRecruitment', localMessages, fieldName, value);

  //   setLocalState({ ...localState, [fieldName]: value });
  //   setLocalMessages({ localMessages: messages });
  // };
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      let { department } = result;
      if (department === 0) department = ""
      console.log(department, 'department')
      setLocalState({ ...localState, unitId: department });
    },
    [localState],
  );
  const handleChangeProponent = useCallback(
    value => {
      setLocalState({ ...localState, proponent: value });
    },
    [localState],
  );
  // const addItem = code => {
  //   const dataRenderLocal = JSON.parse(localStorage.getItem('hrmSource')) || null;
  //   const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
  //   if (dataRender) return dataRender.data.map(element => <MenuItem value={element.value}>{element.title}</MenuItem>);
  //   return null;
  // };
  const handleChangeVacancy = useCallback(
    e => {
      const {
        target: { name, value },
      } = e;
      const vacancy = { roleName: value.name, roleCode: value.code };
      // console.log(e.target.value, e.target.name);
      setLocalState({ ...localState, [name]: vacancy, vacanciesId: '' });
    },
    [localState],
  );
  const handleChangePosition = useCallback(
    e => {
      const {
        target: { name, value },
      } = e;
      const position = { ...value, name: value.name, code: value.code };
      setLocalState({ ...localState, [name]: position });
    },
    [localState],
  );

  const handleInputField = useCallback(
    e => {
      const {
        target: { name, value: obj },
      } = e;
      const newObj = { title: obj.title || '', value: obj.value || '' };
      setLocalState({ ...localState, [name]: newObj });
    },
    [localState],
  );

  const getValueFieldRole = value => {
    if (!value) return null;
    return fieldRole.find(it => it.code === value.roleCode);
  };
  const getValuePosition = value => {
    if (!value) return null;
    return positionVacation.find(it => it.name === value.name);
  };
  // console.log('4444', fieldRole);
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
  const handleSave = () => {
    let newLocalState = {...localState ,
      amountApprove : parseInt(localState.amountApprove)
    }
    if (!checkDate) {
      if (localState.dateFounded === '') {
        setOpenSnackbar({ ...openSnackbar, open: true, variant: 'error', message: 'Thiếu Ngày tạo tuyển dụng' });
      } else if (localState.dateNeed === '') {
        setOpenSnackbar({ ...openSnackbar, open: true, variant: 'error', message: 'Thiếu Ngày cần nhân sự' });
      } else if (localState.vacancy === '') {
        setOpenSnackbar({ ...openSnackbar, open: true, variant: 'error', message: 'Thiếu Chức vụ' });
      } else if (localState.vacanciesId === '') {
        setOpenSnackbar({ ...openSnackbar, open: true, variant: 'error', message: 'Thiếu Vị trí tuyển dụng' });
      } else if (localState.amount === '') {
        setOpenSnackbar({ ...openSnackbar, open: true, variant: 'error', message: 'Thiếu Số lượng' });
      } else {
        onSave(newLocalState);
      }
    } else {
      props.onChangeSnackbar({ status: true, message: 'Ngày cần nhân sự phải lớn hơn ngày tạo tuyển dụng', variant: 'error' });
    }
  };
  // console.log('000', recruitmentManagement);
  // console.log('1234', localState);
  return (
    <div style={{ width: props.miniActive ? window.innerWidth - 110 : window.innerWidth - 285 }}>
      <CustomizedSnackbars
        open={openSnackbar.open}
        onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
        variant={openSnackbar.variant}
        message={openSnackbar.message}
      />
      <CustomAppBar
        title={props.recruitmentManagement === null ? 'THÊM MỚI NHU CẦU TUYỂN DỤNG' : 'CẬP NHẬT NHU CẦU TUYỂN DỤNG'}
        onGoBack={onClose}
        onSubmit={e => {
          handleSave(localState);
        }}
        className
        isTask
      />
      <Grid item xs={12} container style={{ height: 'calc(100vh - 80px)', overflow: 'auto', marginTop: 50 }}>
        <Grid item xs={12}>
          <KanbanStepper
            listStatus={listKanbanStatus}
            onKabanClick={value => {
              setLocalState({ ...localState, kanbanStatus: value });
            }}
            activeStep={localState.kanbanStatus}
          />
        </Grid>
        <Grid container>
          <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
            <Info />
            QUẢN LÝ NHU CẦU TUYỂN DỤNG
          </Typography>
        </Grid>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <CustomInputBase
              className="CustomForm"
              label={name2Title.name}
              value={localState.name}
              name="name"
              onChange={handleInputChange}
              error={localMessages && localMessages.name}
              helperText={localMessages && localMessages.name}
              required={checkRequired.name}
              checkedShowForm={checkShowForm.name}
            />
          </Grid>
          <Grid item xs={4} className="CustomForm">
            <Department
              style={{ marginTop: 10 }}
              onChange={handeChangeDepartment}
              department={props.recruitmentManagement !== null && localState.unitId ? localState.unitId._id : localState.unitId}
              disableEmployee
              profile={profile}
              moduleCode="HrmRecruitment"
              upCaseDepartment={true}
              error={localMessages && localMessages.unitId}
              helperText={localMessages && localMessages.unitId}
              required={checkRequired.unitId}
              checkedShowForm={checkShowForm.unitId}
            />
          </Grid>
          <Grid item xs={4}>
            <AsyncAutocomplete
              url={API_USERS}
              onChange={value => handleChangeProponent(value)}
              value={localState.proponent}
              label={name2Title.proponent}
              optionLabel="name"
              optionValue="_id"
            />
            {/* <CustomInputBase label={name2Title.proponent} value={localState.proponent ? localState.proponent.name : ''} name="proponent" onChange={handleInputChange} disabled /> */}
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              className="CustomForm"
              label={name2Title.dateFounded || 'Chọn ngày'}
              value={localState.dateFounded}
              name="dateFounded"
              onChange={e => handleInputChange(e, true, true)}
              disablePast
              error={(localMessages && localMessages.dateFounded) || checkDate}
              helperText={
                localMessages && localMessages.dateFounded
                  ? 'Không được để trống ngày tạo tuyển dụng'
                  : checkDate
                    ? 'Ngày tạo tuyển dụng phải bé hơn ngày cần nhân sự'
                    : ''
              }
              required={checkRequired.dateFounded}
              checkedShowForm={checkShowForm.dateFounded}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              className="CustomForm"
              label={name2Title.dateNeed || 'Chọn ngày'}
              value={localState.dateNeed}
              name="dateNeed"
              onChange={e => handleInputChange(e, false, true)}
              error={(localMessages && localMessages.dateNeed) || checkDate}
              helperText={
                localMessages && localMessages.dateNeed
                  ? 'Không được để trống ngày cần nhân sự '
                  : checkDate
                    ? 'Ngày tạo cần nhân sự phải lớn hơn ngày tạo tuyển dụng'
                    : ''
              }
              required={checkRequired.dateNeed}
              checkedShowForm={checkShowForm.dateNeed}
              disablePast
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase label={name2Title.reason} value={localState.reason} name="reason" onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
              <Info />
              CHI TIẾT NHU CẦU TUYỂN DỤNG
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              className="CustomForm"
              select
              label={name2Title['vacancy.roleName']}
              value={getValueFieldRole(localState.vacancy)}
              name="vacancy"
              onChange={handleChangeVacancy}
              error={localState.vacancy === '' ? true : false}
              helperText={localState.vacancy !== '' ? '' : 'Không được để trống Chức vụ'}
              checkedShowForm={checkShowForm && checkShowForm['vacancy.roleName']}
              required={checkRequired && checkRequired['vacancy']}
            >
              {/* <MenuItem value={null}>--CHỌN CHỨC VỤ--</MenuItem> */}
              {Array.isArray(fieldRole) && fieldRole.length > 0 ? fieldRole.map(field => <MenuItem value={field}>{field.name}</MenuItem>) : null}
            </CustomInputBase>
            {/* <CustomInputField
              select
              value={getValueFieldRole(localState.vacancy)}
              onChange={(e) =>handleChangeVacancy(e)}
              name="vacancy"
              label={name2Title['vacancy.roleName']}
              type="1"
              configType="hrmSource"
              configCode="S16"
              error={localMessages && localMessages['vacancy.roleName']}
              helperText={localMessages && localMessages['vacancy.roleName']}
              checkedShowForm={checkShowForm && checkShowForm['vacancy.roleName']}
              required={checkRequired && checkRequired['vacancy']}
            /> */}
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              select
              className="CustomForm"
              label={'VỊ TRÍ TUYỂN DỤNG'}
              value={getValuePosition(localState.vacanciesId)}
              name="vacanciesId"
              onChange={e => handleChangePosition(e)}
              error={localState.vacanciesId === '' ? true : false}
              helperText={localState.vacanciesId !== '' ? '' : 'Không được để trống Vị trí tuyển dụng'}
            >
              {Array.isArray(positionVacation) && positionVacation.length > 0
                ? positionVacation.map(field => <MenuItem value={field}>{field.name}</MenuItem>)
                : null}
            </CustomInputBase>
            {/* <CustomInputBase
              value={localState && localState.vacanciesId}
              select
              name="vacanciesId"
              onChange={e => handleInputChangeSelect(e, 'vacanciesId')}
              label={name2Title.vacanciesId}
              error={localMessages && localMessages.vacanciesId}
              helperText={localMessages && localMessages.vacanciesId}
              required={checkRequired && checkRequired.vacanciesId}
              checkedShowForm={checkShowForm && checkShowForm.vacanciesId}
            >
              {addItem('S30')}
            </CustomInputBase> */}
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.amount}
              value={localState.amount}
              name="amount"
              type="number"
              onChange={handleInputChange}
              error={localMessages && localMessages['amount']}
              helperText={localMessages && localMessages['amount']}
              checkedShowForm={checkShowForm && checkShowForm['amount']}
              required={checkRequired && checkRequired['amount']}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.amountApprove}
              value={localState.amountApprove}
              name="amountApprove"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={localState.certificate}
              onChange={handleInputField}
              name="certificate"
              label={name2Title['certificate']}
              type="1"
              configType="hrmSource"
              configCode="S07"
            // checkedShowForm={localCheckShowForm && localCheckShowForm['certificate.title']}
            // required={localCheckRequired && localCheckRequired['certificate.title']}
            // error={localMessages && localMessages["certificate.title"]}
            // helperText={localMessages && localMessages["certificate.title"]}
            />
            {/* <CustomInputBase label={name2Title['certificate']} value={localState.certificate} name="certificate" onChange={handleInputChange} /> */}
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={localState.specialized}
              onChange={handleInputField}
              name="specialized"
              label={name2Title['specialized']}
              type="1"
              configType="hrmSource"
              configCode="S06"
            // checkedShowForm={localCheckShowForm && localCheckShowForm["specialized.title"]}
            // required={localCheckRequired && localCheckRequired["specialized.title"]}
            // error={localMessages && localMessages["specialized.title"]}
            // helperText={localMessages && localMessages["specialized.title"]}
            />
            {/* <CustomInputBase label={name2Title['specialized']} value={localState.specialized} name="specialized" onChange={handleInputChange} /> */}
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.experienceYear}
              value={localState.experienceYear}
              name="experienceYear"
              onChange={handleInputChange}
              onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={localState.age}
              onChange={handleInputField}
              name="age"
              label={name2Title['age']}
              type="1"
              configType="hrmSource"
              configCode="S21"
            // checkedShowForm={localCheckShowForm && localCheckShowForm["specialized.title"]}
            // required={localCheckRequired && localCheckRequired["specialized.title"]}
            // error={localMessages && localMessages["specialized.title"]}
            // helperText={localMessages && localMessages["specialized.title"]}
            />
            {/* <CustomInputBase label={name2Title.age} value={localState.age} name="age" onChange={handleInputChange} /> */}
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={localState.levelLanguage}
              onChange={handleInputField}
              name="levelLanguage"
              label={name2Title['levelLanguage']}
              type="1"
              configType="hrmSource"
              configCode="S09"
            // checkedShowForm={localCheckShowForm && localCheckShowForm["levelLanguage.title"]}
            // required={localCheckRequired && localCheckRequired["levelLanguage.title"]}
            // error={localMessages && localMessages["levelLanguage.title"]}
            // helperText={localMessages && localMessages["levelLanguage.title"]}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase select label={name2Title.gender} value={localState.gender} name="gender" onChange={handleInputChange}>
              <MenuItem value={0}>Nam</MenuItem>
              <MenuItem value={1}>Nữ</MenuItem>
            </CustomInputBase>
          </Grid>
          <Grid item xs={4}>
            <CustomInputField
              select
              value={localState.marriage}
              onChange={handleInputField}
              name="marriage"
              label={name2Title['marriage']}
              type="1"
              configType="hrmSource"
              configCode="S02"
            // checkedShowForm={localCheckShowForm && localCheckShowForm["levelLanguage.title"]}
            // required={localCheckRequired && localCheckRequired["levelLanguage.title"]}
            // error={localMessages && localMessages["levelLanguage.title"]}
            // helperText={localMessages && localMessages["levelLanguage.title"]}
            />
            {/* <CustomInputBase select label={name2Title.marriage} value={localState.marriage} name="marriage" onChange={handleInputChange} /> */}
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="string"
              label={name2Title && name2Title.hrmRecruitmentUnit}
              value={localState && localState.hrmRecruitmentUnit}
              name="hrmRecruitmentUnit"
              onChange={handleInputChange}
              error={localMessages && localMessages.hrmRecruitmentUnit}
              helperText={localMessages && localMessages.hrmRecruitmentUnit}
              required={checkRequired && checkRequired.hrmRecruitmentUnit}
              checkedShowForm={checkShowForm && checkShowForm.hrmRecruitmentUnit}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              rows={5}
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              inputProps={{ maxLength: 2000 }}
              label={name2Title.skill || 'KỸ NĂNG'}
              value={localState.skill}
              name="skill"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              rows={5}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              multiline
              inputProps={{ maxLength: 2000 }}
              label={name2Title.experience || 'KINH NGHIỆM'}
              value={localState.experience}
              name="experience"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              rows={5}
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              inputProps={{ maxLength: 2000 }}
              label={name2Title.requirementsOther || 'YÊU CẦU KHÁC'}
              value={localState.requirementsOther}
              name="requirementsOther"
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
        <Grid container spacing={8} direction="row" justify="flex-end" alignItems="flex-end">
          {/* <Grid item xs={4}>
          <CustomInputBase select label="Chọn mẫu báo cáo" value={localState.reportForm} name="reportForm" onChange={handleInputChange} />
        </Grid> */}
          {/* <Grid item>
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
          <CustomButton color="secondary" onClick={onClose}>
            Đóng
          </CustomButton>
        </Grid> */}
        </Grid>
      </Grid>
    </div>
  );
}

AddRecruitmentManagement.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
)(AddRecruitmentManagement);
