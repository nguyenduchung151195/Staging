/**
 *
 * AddSocial
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';

import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Tab, Tabs, Avatar, MenuItem, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Add, TrendingFlat, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../../../../../Dashboard/actions';
import messages from './messages';
import './style.css';
import { createStructuredSelector } from 'reselect';
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';
/* eslint-disable react/prefer-stateless-function */
function AddSocial(props) {
  const { social, onSave, onClose, code, hrmEmployeeId, miniActive, onMergeData, profile } = props;

  const [localState, setLocalState] = useState({
    others: {},
    hrmEmployeeId: hrmEmployeeId,
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [errorInsuranceStart, setErrorInsuranceStart] = useState('');
  const [errorInsuranceEnd, setErrorInsuranceEnd] = useState('');
  const [errorToxicStart, setErrorToxicStart] = useState('');
  const [errorToxicEnd, setErrorToxicEnd] = useState('');
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    console.log(newNam2Title, 'stet');
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  useEffect(
    () => {
      if (social && social.originItem) {
        setLocalState({ ...social.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [social],
  );
  // const notNegative = value => {
  //   const regex = /[^-+eE]/u;
  //   const data = regex.test(value);
  //   return data;
  // };

  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      if (localState.salary && localState.salary < 0) messages = { ...messages, salary: 'Tiền lương không thể âm' };
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );
  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setLocalState({ ...localState, organizationUnit: department });
    },
    [localState],
  );
  const handleInputChange = (e, isDate, isFirst) => {
    // const name = 'payDay';
    // const value = moment(e).format('YYYY-MM-DD');
    // setLocalState({ ...localState, [name]: value });
    const name = isDate ? (isFirst ? 'birthday' : 'contractStartDateIndefinite') : e.target.name;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    setLocalState({ ...localState, [name]: value });
  };
  const handldeDateToxic = (e, isDate, isFirst) => {
    const name = isDate ? (isFirst ? 'startTimeToxic' : 'endTimeToxic') : e.target.name;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.startTimeToxic && newFilter.endTimeToxic) {
      setErrorStartDateEndDate(true);
      setErrorToxicStart('nhập thiếu: "Thời gian bắt đầu "');
      setErrorToxicEnd('');
    } else if (newFilter.startTimeToxic && !newFilter.endTimeToxic) {
      setErrorStartDateEndDate(true);
      setErrorToxicStart('');
      setErrorToxicEnd('nhập thiếu: "Thời gian kết thúc "');
    } else if (newFilter.startTimeToxic && newFilter.endTimeToxic && new Date(newFilter.endTimeToxic) < new Date(newFilter.startTimeToxic)) {
      setErrorStartDateEndDate(true);
      setErrorToxicStart('"Thời gian bắt đầu " phải nhỏ hơn "Thời gian kết thúc "');
      setErrorToxicEnd('"Thời gian kết thúc " phải lớn hơn "Thời gian bắt đầu "');
    } else {
      setErrorStartDateEndDate(false);
      setErrorToxicStart('');
      setErrorToxicEnd('');
    }
    setLocalState(newFilter);
  };
  const handleDateInsurance = (e, isDate, isFirst) => {
    const name = isDate ? (isFirst ? 'insuranceStartDate' : 'insuranceEndDate') : e.target.name;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.insuranceStartDate && newFilter.insuranceEndDate) {
      setErrorStartDateEndDate(true);
      setErrorInsuranceStart('nhập thiếu: "Thời điểm bắt đầu "');
      setErrorInsuranceEnd('');
    } else if (newFilter.insuranceStartDate && !newFilter.insuranceEndDate) {
      setErrorStartDateEndDate(true);
      setErrorInsuranceStart('');
      setErrorInsuranceEnd('nhập thiếu: "Thời điểm kết thúc "');
    } else if (
      newFilter.insuranceStartDate &&
      newFilter.insuranceEndDate &&
      new Date(newFilter.insuranceEndDate) < new Date(newFilter.insuranceStartDate)
    ) {
      setErrorStartDateEndDate(true);
      setErrorInsuranceStart('"Thời điểm bắt đầu " phải nhỏ hơn "Thời điểm kết thúc "');
      setErrorInsuranceEnd('"Thời điểm kết thúc " phải lớn hơn "Thời điểm bắt đầu "');
    } else {
      setErrorStartDateEndDate(false);
      setErrorInsuranceStart('');
      setErrorInsuranceEnd('');
    }
    setLocalState(newFilter);
  };
  const handleInputDate = (e, isDate, isStartDate) => {
    const name = isDate ? (isStartDate ? 'contractStartDate' : 'contractEndDate') : e.target.name;
    const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.contractStartDate && newFilter.contractEndDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Ngày bắt đầu"');
      setErrorTextEndDate('');
    } else if (newFilter.contractStartDate && !newFilter.contractEndDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Ngày kết thúc"');
    } else if (
      newFilter.contractStartDate &&
      newFilter.contractEndDate &&
      new Date(newFilter.contractEndDate) < new Date(newFilter.contractStartDate)
    ) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Ngày bắt đầu" phải nhỏ hơn "Ngày kết thúc"');
      setErrorTextEndDate('"Ngày kết thúc" phải lớn hơn "Ngày bắt đầu"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }
    setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  return (
    <div style={{ width: miniActive === true ? window.innerWidth - 80 : window.innerWidth - 260, padding: 20 }}>
      {/* <AppBar className='HearderappBarSocial'>
        <Toolbar>
          <IconButton
            className='BTNSocial'
            color="inherit"
            variant="contained"
            onClick={e => onClose()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {props.social === null
              ? <p variant="h6" color="inherit">THÊM MỚI</p>
              : <p variant="h6" color="inherit">CẬP NHẬT</p>}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={e => {
              onSave(localState);
            }}
          >
            LƯU
          </Button>
        </Toolbar>
      </AppBar>   */}
      <CustomAppBar
        title={props.social === null ? 'THÊM MỚI bảo hiểm xã hội' : 'CẬP NHẬT bảo hiểm xã hội'}
        onGoBack={e => onClose()}
        className
        isTask
        onSubmit={e => {
          onSave(localState);
        }}
      />

      <Grid container spacing={8} style={{ marginTop: '80px' }}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.hrmEmployeeId}
            name="hrmEmployeeId"
            value={localState.name}
            onChange={e => handleInputChange(e, 'hrmEmployeeId')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.hrmEmployeeId}
            required={localCheckRequired && localCheckRequired.hrmEmployeeId}
            error={localMessages && localMessages.hrmEmployeeId}
            helperText={localMessages && localMessages.hrmEmployeeId}
          />
        </Grid>
        <Grid item xs={4}>
          <Department
            onChange={handeChangeDepartment}
            department={localState && localState.organizationUnit}
            profile={profile}
            disableEmployee
            moduleCode="hrm"
            upCaseDepartment={true}
          />
          {/* <CustomInputBase
            type="number"
            label={name2Title.organizationUnit || 'PHÒNG BAN'}
            name="organizationUnit"
            value={localState.organizationUnit}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.organizationUnit}
            required={localCheckRequired && localCheckRequired.organizationUnit}
            error={localMessages && localMessages.organizationUnit}
            helperText={localMessages && localMessages.organizationUnit}
          /> */}
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.insuranceNumber}
            name="insuranceNumber"
            value={localState.insuranceNumber}
            onChange={e => handleInputChange(e, 'insuranceNumber')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.insuranceNumber}
            required={localCheckRequired && localCheckRequired.insuranceNumber}
            error={localMessages && localMessages.insuranceNumber}
            helperText={localMessages && localMessages.insuranceNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.birthday || 'NGÀY SINH'}
            name="birthday"
            value={localState.birthday}
            // label={name2Title.fromMonth || 'Chọn từ ngày'}
            // name="fromMonth"
            // value={localState.fromMonth}

            onChange={e => handleInputChange(e, 'birthday', true, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.birthday}
            required={localCheckRequired && localCheckRequired.birthday}
            error={localMessages && localMessages.birthday}
            helperText={localMessages && localMessages.birthday}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.gender}
            select
            value={localState.gender}
            name="gender"
            onChange={e => handleInputChange(e, 'gender')}
            error={localMessages && localMessages.gender}
            helperText={localMessages && localMessages.gender}
            required={localCheckRequired && localCheckRequired.gender}
            checkedShowForm={localCheckShowForm && localCheckShowForm.gender}
          >
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
          </CustomInputBase>
          {/* <CustomDatePicker
            label={name2Title.toMonth || 'Chọn đến ngày'}
            name="toMonth"
            value={localState.toMonth}
            onChange={e => handleInpuDate(e, false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.toMonth}
            required={localCheckRequired && localCheckRequired.toMonth}
            error={localMessages && localMessages.toMonth}
            helperText={localMessages && localMessages.toMonth}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid> */}
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.identityCardNumber}
            name="identityCardNumber"
            value={localState.identityCardNumber}
            // label={name2Title.numberMonth || "Số tháng"}
            // name="numberMonth"
            // value={localState.numberMonth}
            onChange={e => handleInputChange(e, 'identityCardNumber')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.identityCardNumber}
            required={localCheckRequired && localCheckRequired.identityCardNumber}
            error={localMessages && localMessages.identityCardNumber}
            helperText={localMessages && localMessages.identityCardNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title[`position.title`]}
            name="position"
            value={localState.position && localState.position.title}
            // type="number"
            // label={name2Title.numberYear || 'Số năm'}
            // name="numberYear"
            // value={localState.numberYear}
            onChange={e => handleInputChange(e, 'position')}
            checkedShowForm={localCheckShowForm && localCheckShowForm['position.title']}
            required={localCheckRequired && localCheckRequired['position.title']}
            error={localMessages && localMessages['position.title']}
            helperText={localMessages && localMessages['position.title']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title[`title.title`]}
            name="title"
            value={localState.title && localState.title.title}
            onChange={e => handleInputChange(e, 'title')}
            checkedShowForm={localCheckShowForm && localCheckShowForm['title.title']}
            required={localCheckRequired && localCheckRequired['title.title']}
            error={localMessages && localMessages['title.title']}
            helperText={localMessages && localMessages['title.title']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title[`role.title`]}
            name="role"
            value={localState.role && localState.role.roleName}
            onChange={e=> handleInputChange(e,'role')}
            checkedShowForm={localCheckShowForm && localCheckShowForm['role.title']}
            required={localCheckRequired && localCheckRequired['role.title']}
            error={localMessages && localMessages['role.title']}
            helperText={localMessages && localMessages['role.title']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.salary}
            name="salary"
            value={localState.salary}
            onChange={e => handleInputChange(e, 'salary')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.salary}
            required={localCheckRequired && localCheckRequired.salary}
            error={localMessages && localMessages.salary}
            helperText={localMessages && localMessages.salary}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.allowance}
            name="allowance"
            value={localState.allowance}
            onChange={e => handleInputChange(e, 'allowance')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.allowance}
            required={localCheckRequired && localCheckRequired.allowance}
            error={localMessages && localMessages.allowance}
            helperText={localMessages && localMessages.allowance}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.contractStartDateIndefinite || 'NGÀY BẮT ĐẦU HĐLĐ KHÔNG XÁC ĐỊNH THỜI HẠN'}
            name="contractStartDateIndefinite"
            value={localState.contractStartDateIndefinite}
            onChange={e => handleInputChange(e, 'contractStartDateIndefinite')}
            InputLabelProps={{ shrink: true }}
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractStartDateIndefinite}
            required={localCheckRequired && localCheckRequired.contractStartDateIndefinite}
            error={localMessages && localMessages.contractStartDateIndefinite}
            helperText={localMessages && localMessages.contractStartDateIndefinite}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title[`contractType.title`]}
            name="contractType "
            value={localState.contractType && localState.contractType.title}
            onChange={e => handleInputChange(e, 'contractType')}
            checkedShowForm={localCheckShowForm && localCheckShowForm[`contractType.title`]}
            required={localCheckRequired && localCheckRequired[`contractType.title`]}
            error={localMessages && localMessages[`contractType.title`]}
            helperText={localMessages && localMessages[`contractType.title`]}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.contractStartDate || 'NGÀY BẮT ĐẦU'}
            name="contractStartDate"
            value={localState.contractStartDate}
            onChange={e => handleInputDate(e, 'contractStartDate', true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractStartDate}
            required={localCheckRequired && localCheckRequired.contractStartDate}
            error={localMessages && localMessages.contractStartDate}
            helperText={localMessages && localMessages.contractStartDate}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.contractEndDate || 'NGÀY KẾT THÚC'}
            name="contractEndDate"
            value={localState.contractEndDate}
            onChange={e => handleInputDate(e, 'contractEndDate', false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractEndDate}
            required={localCheckRequired && localCheckRequired.contractEndDate}
            error={localMessages && localMessages.contractEndDate}
            helperText={localMessages && localMessages.contractEndDate}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid>

        {/* <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.numberYear}
            name="numberYear"
            value={localState.numberYear}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.numberYear}
            required={localCheckRequired && localCheckRequired.numberYear}
            error={localMessages && localMessages.numberYear}
            helperText={localMessages && localMessages.numberYear}
          />
        </Grid>
        
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.currency}
            label={name2Title.currency || "tiền tệ"}
            name="currency"
            value={localState.currency}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.currency}
            required={localCheckRequired && localCheckRequired.currency}
            error={localMessages && localMessages.currency}
            helperText={localMessages && localMessages.currency}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.ratio || "Tỉ lệ"}
            name="ratio"
            value={localState.ratio}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.ratio}
            required={localCheckRequired && localCheckRequired.ratio}
            error={localMessages && localMessages.ratio}
            helperText={localMessages && localMessages.ratio}
          />
        </Grid> */}
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.insuranceStartDate || 'THỜI ĐIỂM ĐƠN VỊ BẮT ĐẦU ĐÓNG BHXH'}
            name="insuranceStartDate"
            value={localState.insuranceStartDate}
            onChange={e => handleDateInsurance(e, 'insuranceStartDate', true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.insuranceStartDate}
            required={localCheckRequired && localCheckRequired.insuranceStartDate}
            error={localMessages && localMessages.insuranceStartDate}
            helperText={localMessages && localMessages.insuranceStartDate}
            // label={name2Title.handleInputChange || 'Chọn ngày sinh'}
            // name="birthday"
            // value={localState.birthday}
            // onChange={e => handleInputChange(e, true)}
            // // onChange={(e) => handleInpuDateDay(e,payDay)}
            // checkedShowForm={localCheckShowForm && localCheckShowForm.birthday}
            // required={localCheckRequired && localCheckRequired.birthday}
            // error={localMessages && localMessages.birthday}
            // helperText={localMessages && localMessages.birthday}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorInsuranceStart}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.insuranceEndDate || 'THỜI ĐIỂM ĐƠN VỊ KẾT THÚC ĐÓNG BHXH'}
            name="insuranceEndDate"
            value={localState.insuranceEndDate}
            onChange={e => handleDateInsurance(e, 'insuranceEndDate', false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.insuranceEndDate}
            required={localCheckRequired && localCheckRequired.insuranceEndDate}
            error={localMessages && localMessages.insuranceEndDate}
            helperText={localMessages && localMessages.insuranceEndDate}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorInsuranceEnd}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.startTimeToxic || 'THỜI GIAN BẮT ĐẦU NGÀNH/NGHỀ NẶNG NHỌC ĐỘC HẠI'}
            name="startTimeToxic"
            value={localState.startTimeToxic}
            onChange={e => handldeDateToxic(e, 'startTimeToxic', true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startTimeToxic}
            required={localCheckRequired && localCheckRequired.startTimeToxic}
            error={localMessages && localMessages.startTimeToxic}
            helperText={localMessages && localMessages.startTimeToxic}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorToxicStart}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.endTimeToxic || 'THỜI GIAN KẾT THÚC NGÀNH/NGHỀ NẶNG NHỌC ĐỘC HẠI'}
            name="endTimeToxic"
            value={localState.endTimeToxic}
            InputLabelProps={{ shrink: true }}
            onChange={e => handldeDateToxic(e, 'endTimeToxic', false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endTimeToxic}
            required={localCheckRequired && localCheckRequired.endTimeToxic}
            error={localMessages && localMessages.endTimeToxic}
            helperText={localMessages && localMessages.endTimeToxic}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorToxicEnd}</Typography> : null}
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.jobDetail || "Chi tiết công việc"}
            name="jobDetail"
            value={localState.jobDetail}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.jobDetail}
            required={localCheckRequired && localCheckRequired.jobDetail}
            error={localMessages && localMessages.jobDetail}
            helperText={localMessages && localMessages.jobDetail}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.coefficientInsurance || "Hệ số bảo hiểm"}
            name="coefficientInsurance"
            value={localState.coefficientInsurance}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.coefficientInsurance}
            required={localCheckRequired && localCheckRequired.coefficientInsurance}
            error={localMessages && localMessages.coefficientInsurance}
            helperText={localMessages && localMessages.coefficientInsurance}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.coefficientPosition || 'Hệ số'}
            name="coefficientPosition"
            value={localState.coefficientPosition}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.coefficientPosition}
            required={localCheckRequired && localCheckRequired.coefficientPosition}
            error={localMessages && localMessages.coefficientPosition}
            helperText={localMessages && localMessages.coefficientPosition}
          />
        </Grid> */}
        {/* ghi chú */}
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.note}
            name="note"
            value={localState.note}
            // label={name2Title.reason || "Lý do"}
            // name="reason"
            // value={localState.reason}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.note}
            required={localCheckRequired && localCheckRequired.note}
            error={localMessages && localMessages.note}
            helperText={localMessages && localMessages.note}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      {/* <Grid container spacing={8} justify="flex-end">
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
            Hỷ
          </CustomButton>
        </Grid>
      </Grid> */}
    </div>
  );
}

AddSocial.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
  injectIntl,
)(AddSocial);
