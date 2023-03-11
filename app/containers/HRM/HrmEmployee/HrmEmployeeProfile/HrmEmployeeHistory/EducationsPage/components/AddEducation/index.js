/**
 *
 * AddEducations
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired, viewConfigCheckShowForm, viewConfigCheckShowFormNoName } from 'utils/common';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import { Tabs, Tab, Paper, TextField } from 'components/LifetekUi';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import { fetchData } from 'helper';
import { mergeData as MergeData } from 'containers/Dashboard/actions';
import { AsyncAutocomplete } from '../../../../../../../../components/LifetekUi';
import { changeSnackbar } from 'containers/Dashboard/actions';
import {
  API_HRM_EMPLOYEE,
  API_EDUCATE_PLAN,
  API_PERSONNEL,
  API_HRM_TIMEKEEP_TYPE,
  API_EDUCATE_ROUND,
} from '../../../../../../../../config/urlConfig';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import moment from 'moment';
import { makeSelectProfile } from '../../../../../../../Dashboard/selectors';
import ListPage from 'components/List';
import { Add } from '@material-ui/icons';
import { SwipeableDrawer } from 'components/LifetekUi';
import AddTraining from '../../../../../../HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/EducationsPage/components/AddTraining/index';
import NumberFormat from 'react-number-format';
import { CommonSeriesSettingsHoverStyle } from 'devextreme-react/chart';
/* eslint-disable react/prefer-stateless-function */
function AddEducations(props) {
  const { educate, onSave, onClose, code, hrmEmployeeId, profile, miniActive, onMergeData, educatePage, education } = props;
  const { createEducateRoundSuccess, reload } = educatePage || { createEducateRoundSuccess: null, reload: null };

  const [localState, setLocalState] = useState({
    decisionNumber: '',
    name: '',
    // userNeed: '',
    educateMethod: '',
    educateTime: '',
    amount: '',
    address: '',
    startDate: '',
    endDate: '',
    fee: '',
    content: '',
    formsOfTraining: '',
    categoriesTraining: '',
    others: {},
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [openDialogTraining, setOpenDialogTraining] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [tab, setTab] = useState(0);
  const [employee, setEmployee] = useState({});
  const [origin, setOrigin] = useState({});
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [checkShowFormPro, setcheckShowFormPro] = useState({})
  const [messages, setMessages] = useState('');
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      });
    };
  }, []);
  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);
    return () => {
      newName2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);

  useEffect(
    () => {
      if (educate && educate.originItem) {
        setLocalState({ ...localState, ...educate.originItem });
      } else {
        setLocalState({
          ...localState,
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [educate],
  );
  useEffect(
    () => {
      if (education && education.originItem) {
        setLocalState({ ...localState, ...education.originItem });
      } else {
        setLocalState({
          ...localState,
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [education],
  );
  useEffect(
    () => {
      if (educate !== null && educate !== undefined) {
        fetchData(`${API_EDUCATE_PLAN}/${educate._id}`)
          .then(response => {
            let dataRes = response;
            fetchData(`${API_PERSONNEL}`)
              .then(res => {
                if (res.data) {
                  const dataNeed = res.data.find(item => item._id === dataRes.userNeed);
                  dataRes.userNeed = dataNeed;
                  setLocalState(dataRes);
                }
              })
              .catch();
          })
          .catch();
      }
    },
    [educate],
  );

  // useEffect(
  //   () => {
  //     const messages = viewConfigCheckForm(code, localState);
  //     console.log(messages, 'messages')
  //     setLocalMessages(messages);
  //     return () => {
  //       messages;
  //     };
  //   },
  //   [localState],
  // );
  useEffect(
    () => {
      if (localState.name !== undefined && localState.name.length < 5 && localState.name.length > 0) {
        setMessages('Tên kế hoạch phải lớn hơn hoặc bằng 5 ký tự');
      } else setMessages('');
    },
    [localState],
  );

  const keyPress = event => {
    let { content } = localState;
    if (event.keyCode === 13) {
      const newMulti = { ...content, content: '' };
      setLocalState({ ...localState, newMulti });
    }
  };
  const handleInputChangeRequest = (e, name) => {
    if (name === 'userNeed') {
      setLocalState(pre => ({ ...pre, [name]: e }));
    }
    if (name === 'educateMethod' || name === 'educateTime') {
      setLocalState(pre => ({ ...pre, [name]: e.target.value }));
    }
  };
  const addItem = () => (
    <Add
      onClick={() => {
        setOpenDialogTraining(true);
        setSelectedTraining(null);
      }}
    >
      Open Menu
    </Add>
  );
  const handleChangeTextField = useCallback(e => {
    const {
      target: { name, value },
    } = e;
    //setPersonnelState({ ...addPersonnelState, [name]: value });
    handleInputChangeRequest(name, value);
  });
  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputChangeEmployee = e => {
    setLocalState({ ...localState, hrmEmployeeId: e });
  };
  const handleInputChangeDate = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // setTime({ ...time, [name]: value });
    const newFilter = { ...localState, [name]: value };
    setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
  };
  useEffect(
    () => {
      const { startDate, endDate, decisionNumber } = localState;
      let mess = '';
      let localMessagess = localMessages;
      delete localMessagess.decisionNumber;
      delete localMessagess.name;
      if (!startDate) localMessagess = { ...localMessagess, startDate: 'Chọn NGÀY BẮT ĐẦU' };
      else if (!endDate) localMessagess = { ...localMessagess, endDate: 'Chọn NGÀY KẾT THÚC' };
      else if (moment(startDate, 'DD-MM-YYYY').diff(moment(endDate, 'DD-MM-YYYY')) > 0) {
        mess = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
        localMessagess = { ...localMessagess, startDate: mess, endDate: mess };
      } else {
        delete localMessagess.startDate;
        delete localMessagess.endDate;
      }
      // if (name === undefined || name === null || name === '') {
      //   localMessagess = { ...localMessagess, name: 'Không được để trống TÊN KẾ HOẠCH' };
      // } else delete localMessagess.name;
      // if (decisionNumber === undefined || decisionNumber === null || decisionNumber === '') {
      //   localMessagess = { ...localMessagess, decisionNumber: 'Không được để trống SỐ QUYẾT ĐỊNH' };
      // } else delete localMessagess.decisionNumber;
      const messages = viewConfigCheckForm(code, localState);
      setLocalMessages({ ...localMessagess, ...messages });
      
      // setLocalMessages({ ...localMessagess });
    },
    [localState],
  );
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );


  useEffect(() => {
    console.log(viewConfigCheckShowFormNoName(code, '', 'checkedShowForm'), "sssssssss")
    setcheckShowFormPro(viewConfigCheckShowFormNoName(code, '', 'checkedShowForm') || {})
  }, [code])
  function handleDepartmentAndEmployeeChange(data) {
    const { department, employee } = data;
    setOrigin(department);
    setEmployee(employee);
  }
  const blockInvalidChar = e => ['>', '<'].includes(e.key) && e.preventDefault();
  const onCloseTraning = () => {
    setOpenDialogTraining(false);
    setSelectedTraining(null);
  };
  const mapFunctionRound = item => {
    return {
      ...item,
      hrmEmployeeId: item['name'],
      degree: item['degree.title'],
      educateCenter: item['educateCenter.title'],
      educatePlan: item['educatePlan.name'],
      educateMethod: item['educateMethod.title'],
    };
  };

  const onSavedata = data => {
    if (!data._id) {
      
      props.createEducateRound && props.createEducateRound(data);
    } else {
      
      props.updateEducateRound && props.updateEducateRound(data._id, data);
    }
  };
  useEffect(
    () => {
      if (createEducateRoundSuccess) setOpenDialogTraining(false);
    },
    [createEducateRoundSuccess],
  );

  const handleDeleteRound = ids => {
    props.deleteEducateRound && props.deleteEducateRound(ids);
  };
  const handleSave = () => {
    // console.log(localMessages, "localMessages");
    if (Object.keys(localMessages).length > 0 || messages !== '') {
      props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    } else onSave(localState);
  };
  return (
    <div style={{ width: miniActive ? window.innerWidth - 89 : window.innerWidth - 260 }}>
      <CustomAppBar
        title={
          props.educate === null
            ? 'THÊM MỚI KẾ HOẠCH ĐÀO TẠO'
            : props.hrmEmployeeId !== null && props.hrmEmployeeId !== undefined
              ? 'KHÓA ĐÀO TẠO'
              : 'CẬP NHẬT KẾ HOẠCH ĐÀO TẠO'
        }
        onGoBack={e => onClose()}
        className
        isTask
        disableAdd={props.hrmEmployeeId}
        onSubmit={e => handleSave()}
      />
      <div style={{ marginTop: 70 }}>
        <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
          <Tab value={0} label={'THÔNG TIN CHUNG'} />
          {props.educate === null ? (
            ''
          ) : props.hrmEmployeeId !== null && props.hrmEmployeeId !== undefined ? null : (
            <Tab value={1} label={'KHÓA ĐÀO TẠO'} />
          )}
        </Tabs>
      </div>

      {tab === 0 && (
        <Grid container style={{ padding: 10 }}>
          <Grid container spacing={8}>
            {checkShowFormPro.name && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.name || "TÊN KẾ HOẠCH"}
                  value={localState.name}
                  name="name"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.name}
                  required={localCheckRequired && localCheckRequired.name}
                  error={(localMessages && localMessages.name) || messages}
                  helperText={(localMessages && localMessages.name) || messages}
                />
              </Grid>
            )}
            {checkShowFormPro.decisionNumber && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.decisionNumber || 'SỐ QUYẾT ĐỊNH'}
                  value={localState.decisionNumber}
                  name="decisionNumber"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
                  required={localCheckRequired && localCheckRequired.decisionNumber}
                  error={localMessages && localMessages.decisionNumber}
                  helperText={localMessages && localMessages.decisionNumber}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.userNeed && (
              <Grid item xs={3}>
                <AsyncAutocomplete
                  label={name2Title.userNeed || 'NGƯỜI YÊU CẦU'}
                  url={API_HRM_EMPLOYEE}
                  value={localState.userNeed}
                  name="userNeed"
                  onChange={e => handleInputChangeRequest(e, 'userNeed')}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.userNeed}
                  required={localCheckRequired && localCheckRequired.userNeed}
                  error={localMessages && localMessages.userNeed}
                  helperText={localMessages && localMessages.userNeed}
                />
              </Grid>
            )}
            {checkShowFormPro.educateMethod && (
              <Grid item xs={3}>
                <CustomInputField
                  label={name2Title.educateMethod || 'HÌNH THỨC ĐÀO TẠO'}
                  value={localState.educateMethod}
                  onChange={e => handleInputChangeRequest(e, 'educateMethod')}
                  // onChange={handleChangeTextField}
                  name="educateMethod"
                  type="1"
                  configType="hrmSource"
                  configCode="S32"
                  checkedShowForm={true}
                />
              </Grid>
            )}
            {checkShowFormPro.educateTime && (
              <Grid item xs={3}>
                <CustomInputField
                  label={name2Title.educateTime || 'LOẠI THỜI GIAN'}
                  value={localState.educateTime}
                  name="educateTime"
                  onChange={e => handleInputChangeRequest(e, 'educateTime')}
                  // onChange={handleChangeTextField}
                  type="1"
                  configType="hrmSource"
                  configCode="S37"
                  checkedShowForm={true}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.amount && (
              <Grid item xs={3}>
                <NumberFormat
                  allowNegative={false}
                  label={name2Title.amount || 'SỐ LƯỢNG'}
                  decimalSeparator={false}
                  customInput={CustomInputBase}
                  allowLeadingZeros={false}
                  value={localState.amount}
                  name="amount"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.amount}
                  required={localCheckRequired && localCheckRequired.amount}
                  error={localMessages && localMessages.amount}
                  helperText={localMessages && localMessages.amount}
                />
              </Grid>
            )}
            {checkShowFormPro.address && (
              <Grid item xs={6}>
                <CustomInputBase
                  label={name2Title.address || 'ĐỊA ĐIỂM'}
                  value={localState.address}
                  name="address"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.address}
                  required={localCheckRequired && localCheckRequired.address}
                  error={localMessages && localMessages.address}
                  helperText={localMessages && localMessages.address}
                />
              </Grid>
            )}
            {checkShowFormPro.startDate && (
              <Grid item xs={3}>
                <CustomDatePicker
                  label={name2Title.startDate || 'NGÀY BẮT ĐẦU'}
                  value={localState.startDate}
                  name="startDate"
                  disablePast
                  onChange={e => handleInputChangeDate(e, true)}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
                  required={localCheckRequired && localCheckRequired.startDate}
                  error={localMessages && localMessages.startDate}
                  helperText={localMessages && localMessages.startDate}
                  mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.endDate && (
              <Grid item xs={3}>
                <CustomDatePicker
                  label={name2Title.endDate || 'NGÀY KẾT THÚC'}
                  value={localState.endDate}
                  name="endDate"
                  disablePast
                  onChange={e => handleInputChangeDate(e, false)}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
                  required={localCheckRequired && localCheckRequired.endDate}
                  error={localMessages && localMessages.endDate}
                  helperText={localMessages && localMessages.endDate}
                  mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.fee && (
              <Grid item xs={6}>
                <NumberFormat
                  allowNegative={false}
                  // thousandSeparator={' '}
                  decimalSeparator={false}
                  customInput={CustomInputBase}
                  allowLeadingZeros={false}
                  disablePast
                  label={name2Title.fee || 'CHI PHÍ'}
                  value={localState.fee}
                  name="fee"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.fee}
                  required={localCheckRequired && localCheckRequired.fee}
                  error={localMessages && localMessages.fee}
                  helperText={localMessages && localMessages.fee}
                />
              </Grid>
            )}

            {/* thêm */}
            {checkShowFormPro.hrmEmployeeId && (
              <Grid item xs={3}>
                <AsyncAutocomplete
                  url={API_PERSONNEL}
                  name="hrmEmployeeId"
                  label={name2Title.hrmEmployeeId}
                  value={localState.hrmEmployeeId}
                  onChange={handleInputChangeEmployee}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.hrmEmployeeId}
                  required={localCheckRequired && localCheckRequired.hrmEmployeeId}
                  error={localMessages && localMessages.hrmEmployeeId}
                  helperText={localMessages && localMessages.hrmEmployeeId}
                  isDisabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.schoolTraining && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.schoolTraining}
                  value={localState.schoolTraining}
                  name="schoolTraining"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.schoolTraining}
                  required={localCheckRequired && localCheckRequired.schoolTraining}
                  error={localMessages && localMessages.schoolTraining}
                  helperText={localMessages && localMessages.schoolTraining}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.specialized && (
              <Grid item xs={3}>
                <CustomInputField
                  value={localState.title}
                  onChange={handleInputChange}
                  name="specialized"
                  type="1"
                  configType="hrmSource"
                  configCode="S06"
                  label={name2Title.specialized}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.specialized}
                  required={localCheckRequired && localCheckRequired.specialized}
                  error={localMessages && localMessages.specialized}
                  helperText={localMessages && localMessages.specialized}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.categoriesTraining && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.categoriesTraining}
                  value={localState.specialized}
                  name="categoriesTraining"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.categoriesTraining}
                  required={localCheckRequired && localCheckRequired.categoriesTraining}
                  error={localMessages && localMessages.categoriesTraining}
                  helperText={localMessages && localMessages.categoriesTraining}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.countryTraining && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.countryTraining}
                  value={localState.countryTraining}
                  name="countryTraining"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.countryTraining}
                  required={localCheckRequired && localCheckRequired.countryTraining}
                  error={localMessages && localMessages.countryTraining}
                  helperText={localMessages && localMessages.countryTraining}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}

            {checkShowFormPro.systemTraining && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.systemTraining}
                  value={localState.systemTraining}
                  name="systemTraining"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.systemTraining}
                  required={localCheckRequired && localCheckRequired.systemTraining}
                  error={localMessages && localMessages.systemTraining}
                  helperText={localMessages && localMessages.systemTraining}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.classTraining && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.classTraining}
                  value={localState.classTraining}
                  name="classTraining"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.classTraining}
                  required={localCheckRequired && localCheckRequired.classTraining}
                  error={localMessages && localMessages.classTraining}
                  helperText={localMessages && localMessages.classTraining}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.resultTraining && (
              <Grid item xs={3}>
                <CustomInputField
                  value={localState.resultTraining}
                  // onChange={(e) => changeHRM(e, index)}
                  name="result1"
                  label="KẾT QUẢ ĐÀO TẠO"
                  type="1"
                  configType="hrmSource"
                  configCode="S34"
                  // value={hrmJoin[index] && hrmJoin[index].result1}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}

            {checkShowFormPro.diploma && (
              <Grid item xs={3}>
                <CustomInputField
                  value={localState.diploma}
                  label={name2Title.diploma}
                  // onChange={(e) => handleInputMenuChange(e)}
                  name="diploma"
                  type="1"
                  configType="hrmSource"
                  configCode="S07"
                  checkedShowForm={localCheckShowForm && localCheckShowForm.diploma}
                  required={localCheckRequired && localCheckRequired.diploma}
                  error={localMessages && localMessages.diploma}
                  helperText={localMessages && localMessages.diploma}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}

            {checkShowFormPro.certificate && (
              <Grid item xs={3}>
                <CustomInputField
                  value={localState.certificate}
                  label={name2Title.certificate}
                  name="certificate"
                  type="1"
                  configType="hrmSource"
                  configCode="S36"
                  checkedShowForm={localCheckShowForm && localCheckShowForm.certificate}
                  required={localCheckRequired && localCheckRequired.certificate}
                  error={localMessages && localMessages.certificate}
                  helperText={localMessages && localMessages.certificate}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.scores && (
              <Grid item xs={3}>
                <NumberFormat
                  label={name2Title.scores}
                  allowNegative={false}
                  // thousandSeparator="."
                  decimalSeparator={false}
                  customInput={CustomInputBase}
                  allowLeadingZeros={false}
                  name="scores"
                  onChange={handleInputChange}
                  value={localState.otherCosts}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.scores}
                  required={localCheckRequired && localCheckRequired.scores}
                  error={localMessages && localMessages.scores}
                  helperText={localMessages && localMessages.scores}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}

            {checkShowFormPro.companyExpenses && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.companyExpenses}
                  value={localState.companyExpenses}
                  name="companyExpenses"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.companyExpenses}
                  required={localCheckRequired && localCheckRequired.companyExpenses}
                  error={localMessages && localMessages.companyExpenses}
                  helperText={localMessages && localMessages.companyExpenses}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.personalCosts && (
              <Grid item xs={3}>
                <NumberFormat
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator={false}
                  customInput={CustomInputBase}
                  allowLeadingZeros={false}
                  name="personalCosts"
                  onChange={handleInputChange}
                  value={localState.otherCosts}
                  label={name2Title.personalCosts}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.personalCosts}
                  required={localCheckRequired && localCheckRequired.personalCosts}
                  error={localMessages && localMessages.personalCosts}
                  helperText={localMessages && localMessages.personalCosts}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.otherCosts && (
              <Grid item xs={3}>
                <NumberFormat
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator={false}
                  customInput={CustomInputBase}
                  allowLeadingZeros={false}
                  name="otherCosts"
                  onChange={handleInputChange}
                  value={localState.otherCosts}
                  label={name2Title.otherCosts}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.otherCosts}
                  required={localCheckRequired && localCheckRequired.otherCosts}
                  error={localMessages && localMessages.otherCosts}
                  helperText={localMessages && localMessages.otherCosts}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}

            {checkShowFormPro.commitMonth && (
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.commitMonth}
                  value={localState.commitMonth}
                  name="commitMonth"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.commitMonth}
                  required={localCheckRequired && localCheckRequired.commitMonth}
                  error={localMessages && localMessages.commitMonth}
                  helperText={localMessages && localMessages.commitMonth}
                  disabled={props.hrmEmployeeId}
                />
              </Grid>
            )}
            {checkShowFormPro.content && (
              <Grid item xs={12}>
                <TextField
                  label={name2Title.content || "NỘI DUNG"}
                  value={localState.content}
                  name="content"
                  onKeyDown={keyPress}
                  rows={5}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  multiline
                  variant="outlined"
                  aria-describedby="component-error-text"
                  onChange={handleInputChange}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.content}
                  required={localCheckRequired && localCheckRequired.content}
                  error={localMessages && localMessages.content}
                  helperText={localMessages && localMessages.content}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {props.educate !== null && tab === 1 ? (
        <Paper style={{ paddingTop: 10 }}>
          <ListPage
            code="EducateRound"
            parentCode="hrm"
            onEdit={row => {
              setOpenDialogTraining(true);
              setSelectedTraining(row);
            }}
            onDelete={handleDeleteRound}
            filter={{ educatePlan: props.educate && props.educate._id }}
            reload={reload}
            apiUrl={API_EDUCATE_ROUND}
            settingBar={[addItem()]}
            mapFunction={mapFunctionRound}
            disableAdd
            profile={props.profile}
            disableSeenMail={true}
            disableSMS={true}
            disableExport={true}
          />
        </Paper>
      ) : null}

      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      <SwipeableDrawer anchor="right" onClose={() => onCloseTraning()} open={openDialogTraining} width={window.innerWidth - 260}>
        <div>
          <AddTraining
            code="EducateRound"
            {...props}
            isDisabled={true}
            training={selectedTraining}
            educateID={props.educate && props.educate._id}
            onSave={onSavedata}
            onClose={() => {
              onCloseTraning();
            }}
            profile={props.profile}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

AddEducations.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
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
)(AddEducations);
