/**
 *
 * AddEducations
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired, viewConfigCheckShowForm } from '../../../../../../../../utils/common';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import CustomAppBar from 'components/CustomAppBar';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import {
  API_RECRUITMENT,
  API_HRM_EDUCATE,
  API_USERS,
  API_EDUCATE_ROUND,
  API_EDUCATE_PLAN,
  API_PERSONNEL,
  API_HRM_EMPLOYEE,
} from '../../../../../../../../config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';
import KanbanStepper from '../../../../../../../../components/KanbanStepper/';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase/';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField/';
import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import { fetchData } from '../../../../../../../../helper';
import NumberFormat from 'react-number-format';
import { TextField } from 'components/LifetekUi';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField/';
import { changeSnackbar } from 'containers/Dashboard/actions';
import dot from 'dot-object';

import './style.css';
function AddTraining(props) {
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localState, setLocalState] = useState({
    educatePlan: '',
    personalCosts: '',
    name: '',
    classTraining: '',
    title: '',
    degree: '',
    educateMethod: '',
    educateCenter: '',
    address: '',
    amount: 0,
    startDate: '',
    endDate: '',
    content: '',
    other: {},
  });
  const [localState1, setLocalState1] = useState({});
  const [localState2, setLocalState2] = useState({
    userNeed: '',
  });

  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [hrmJoin, setHrmJoin] = useState([]);

  const { training, onSave, onClose, code, hrmEmployeeId, profile, educatePlan } = props;
  useEffect(() => {
    let kanbanStatus;
    const listKanBan = JSON.parse(localStorage.getItem('hrmStatus'));
    if (listKanBan) {
      let hrmKanbanStatuses = listKanBan.find(p => p.code === 'ST07');
      if (hrmKanbanStatuses && hrmKanbanStatuses.data) {
        const { _id } = hrmKanbanStatuses.data[0];
        kanbanStatus = _id;
        setListKanbanStatus(hrmKanbanStatuses.data);
      }
    }
  }, []);
  useEffect(
    () => {
      const messages = viewConfigCheckForm(code, { ...localState, 'title.title': localState.title });
      setLocalMessages(messages);
    },
    [localState],
  );
  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    console.log(setName2Title(newName2Title), 'setName2Title(newName2Title)');
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
  const keyPress = event => {
    let { content } = localState;
    if (event.keyCode === 13) {
      const newMulti = { ...content, content: '' };
      setLocalState({ ...localState, newMulti });
    }
  };
  const handleAddRow = () => {
    if(localState.amount === '' || localState.amount == 0 || hrmJoin.length >= localState.amount) {
      props.onChangeSnackbar({ variant: 'error', message: 'Không được thêm số lượng nhân sự quá số lượng người tham gia!', status: true });
    } else if (hrmJoin.length < localState.amount){
      const item = {
        hrmEmployeeId: '',
        cost: '',
        result1: '',
        result2: '',
        certificate: '',
      };
      setHrmJoin([...hrmJoin, item]);
    }
  };
  const changeHRM = (e, index) => {
    let hrm = [...hrmJoin];
    hrm[index] = {
      ...hrm[index],
      [e.target.name]: e.target.value,
    };
    setHrmJoin([...hrm]);
  };
  const changeHRMname = (ind, e) => {
    const hrm = [...hrmJoin];
    hrm[e] = {
      ...hrm[e],
      hrmEmployeeId: ind,
    };
    setHrmJoin([...hrm]);
  };

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputMenuChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputChangePlan = e => {
    let obj = {
      personalCosts: e.fee,
      educateMethod: e.educateMethod,
      startDate: e.startDate,
      endDate: e.endDate,
      amount: e.amount,
      content: e.content,
      address: e.address,
      userNeed: e.userNeed,

    }
    console.log(e,'rtfgfgfd');
    setLocalState({ ...localState, ...obj, educatePlan: e })
  }
  const formatnumber = (cs) => {
    if (cs === "" || cs === null || cs === undefined) return 0
    else {
      let ctt = '';

      for (let index = 0; index < cs.toString().length; index++) {
        if (cs.toString()[index] !== '.') ctt = ctt + cs.toString()[index];
      }
      return parseInt(ctt);
    }
  };
  const ListPeople = (value, index) => {
    return (
      <Grid container style={{ padding: 10 }}>
        <Grid container spacing={8}>
          <Grid item xs={3}>
            <AsyncAutocomplete
              className="setColor"
              url={API_PERSONNEL}
              name="hrmEmployeeId"
              value={hrmJoin[index] && hrmJoin[index].hrmEmployeeId}
              onChange={e => changeHRMname(e, index)}
            />
          </Grid>
          <Grid item xs={3}>
            <NumberFormat
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator={false}
              customInput={CustomInputBase}
              allowLeadingZeros={false}
              label=" "
              name="cost"
              value={hrmJoin[index] && hrmJoin[index].cost}
              onChange={e => changeHRM(e, index)}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              // value={localState.degree}
              onChange={e => changeHRM(e, index)}
              name="result1"
              label="TRẠNG THÁI ĐÀO TẠO"
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S34"
              value={hrmJoin[index] && hrmJoin[index].result1}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              // value={localState.result2}
              onChange={e => changeHRM(e, index)}
              name="result2"
              label="XẾP LOẠI ĐÀO TẠO"
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S35"
              value={hrmJoin[index] && hrmJoin[index].result2}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              // value={localState.certificate}
              onChange={e => changeHRM(e, index)}
              name="certificate"
              label={'CHỨNG CHỈ ĐÀO TẠO'}
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S36"
              value={hrmJoin[index] && hrmJoin[index].certificate}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const OptionLabel = option => {
    return option.name;
  };
  const handleSave = () => {
    const { degree, educateCenter, educateMethod, title, personalCosts, educatePlan } = localState;
    // const { educatePlan } = localState1;
    const { userNeed } = localState2;
    let data = {
      educatePlan: localState.educatePlan,
      personalCosts: localState.personalCosts,
      name: localState.name,
      classTraining: localState.training,
      title: localState.title,
      degree: localState.degree,
      educateMethod: localState.educateMethod,
      educateCenter: localState.educateCenter,
      address: localState.address,
      amount: localState.amount,
      startDate: localState.startDate,
      endDate: localState.endDate,
      content: localState.content,
    };
    if (personalCosts) data = { ...data, personalCosts: formatnumber(personalCosts) };
    if (educatePlan && educatePlan._id) data = { ...data, educatePlan: educatePlan._id };
    if (userNeed && userNeed._id) data = { ...data, userNeed: userNeed._id };
    data = { ...data, hrmJoin };

    if (data.hrmJoin && data.hrmJoin.length > 0) {
      let hrmJoin = [];
      data.hrmJoin.map(el => {
        if (el.hrmEmployeeId) hrmJoin.push({ ...el, hrmEmployeeId: el.hrmEmployeeId._id, cost: formatnumber(el.cost) });
      });
      data = { ...data, hrmJoin };
    }
    const messages = viewConfigCheckForm('EducateRound', dot.dot(data));
    if (Object.keys(messages).length === 0) {
      if(props.training && props.training._id){
        data ={
          ...data,
          _id:  props.training._id,
        }
      }
      console.log(data, 'data');
        props.onSave(data);
    } else {
      props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    }
  };
  useEffect(
    () => {
      if (hrmJoin.length > 0) {
        let cost = 0;
        hrmJoin.forEach(el => {
          let cs = el.cost;
          if (cs === '' || cs === null) cs = 0;
          else {
            cost = cost + parseInt(formatnumber(cs));
          }
        });
        setLocalState({ ...localState, totalFee: cost });
      }
    },
    [hrmJoin],
  );
  useEffect(() => {
    if (training && training.originItem) {
      let listJoin = [];
      let cost = 0;
      if (training.originItem.hrmJoin && training.originItem.hrmJoin.length > 0) {
        training.originItem.hrmJoin.forEach(el => {
          fetchData(`${API_PERSONNEL}/${el.hrmEmployeeId}`).then(res => {
            let das = el;
            das.hrmEmployeeId = res;
            listJoin.push(das);
          });
          let cs = el.cost;
          if (cs === '' || cs === null) cs = 0;
          else {
            cost = cost + parseInt(cs);
          }
        });
      }
      setLocalState({ ...training.originItem, totalFee: cost });
      setHrmJoin(listJoin);
    } else {
      setLocalState({
        ...localState,
      });
    }

    if (training !== null && training.userNeed) {
      fetchData(`${API_PERSONNEL}`).then(res => {
        if (res.data) {
          const dataNeed = res.data.find(item => item._id === training.userNeed);
          console.log(dataNeed, 'dataNeed', training.userNeed);
          setLocalState2({ ...localState2, userNeed: dataNeed });
        }
      });
    }
  }, []);
  const handleInputChangeRequest = (e, name) => {
    if (name === 'userNeed') {
      setLocalState2({ ...localState2, userNeed: e });
    }
  };
  useEffect(() => {
    if (props.training && props.training['educatePlan._id']) {
      fetchData(`${API_EDUCATE_PLAN}/${props.training['educatePlan._id']}`, 'GET', null).then(res => {
        setLocalState1({ ...localState1, educatePlan: res });
      });
    } else if (props.educateID)
      fetchData(`${API_EDUCATE_PLAN}/${props.educateID}`, 'GET', null).then(res => {
        setLocalState1({ ...localState1, educatePlan: res });
      });
  }, []);
  const getLabelNames = name => {
    return viewConfigCheckShowForm(code, name, '', 'title');
  };
  const handleChangeDate = (e, name) => {
    setLocalState({ ...localState, [name]: e });
  };
  return (
    <div style={{ width: props.miniActive ? window.innerWidth - 89 : window.innerWidth - 250, marginTop: 58 }}>
      <CustomAppBar
        title={props.training === null ? 'THÊM MỚI khóa đào tạo' : 'CẬP NHẬT khóa đào tạo'}
        onGoBack={e => onClose()}
        className
        isTask
        onSubmit={() => handleSave()}
      />
      <Grid container style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <KanbanStepper
              listStatus={listKanbanStatus}
              onKabanClick={value => {
                setLocalState({ ...localState, kanbanStatus: value });
              }}
              activeStep={localState.kanbanStatus}
            />
          </Grid>
          <Grid item xs={3}>
            {/* {console.log('1111', localState)} */}
            <AsyncAutocomplete
              className="setColor"
              customOptionLabel={OptionLabel}
              value={localState.educatePlan}
              url={API_EDUCATE_PLAN}
              name="educatePlan"
              onChange={e => handleInputChangePlan(e)}
              isDisabled={props.isDisabled}
              label={getLabelNames('educatePlan') || 'KẾ HOẠCH ĐÀO TẠO'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educatePlan}
              required={localCheckRequired && localCheckRequired.educatePlan}
              error={localMessages && localMessages.educatePlan}
              helperText={localMessages && localMessages.educatePlan}
            />
          </Grid>

          <Grid item xs={3}>
            <NumberFormat
              className="setColor"
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator={false}
              customInput={CustomInputBase}
              allowLeadingZeros={false}
              name="personalCosts"
              onChange={e => handleInputChange(e)}
              value={localState.personalCosts}
              label={getLabelNames('personalCosts') || 'TỰ TÍNH CHI PHÍ'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.personalCosts}
              required={localCheckRequired && localCheckRequired.personalCosts}
              error={localMessages && localMessages.personalCosts}
              helperText={localMessages && localMessages.personalCosts}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              type="string"
              name="name"
              className="setColor"
              onChange={e => handleInputChange(e)}
              value={localState.name}
              label={getLabelNames('name') || 'KHÓA ĐÀO TẠO'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.name}
              required={localCheckRequired && localCheckRequired.name}
              error={localMessages && localMessages.name}
              helperText={localMessages && localMessages.name}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              type="string"
              className="setColor"
              name="classTraining"
              onChange={e => handleInputChange(e)}
              value={localState.classTraining}
              label={getLabelNames('classTraining') || 'LỚP ĐÀO TẠO'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.classTraining}
              required={localCheckRequired && localCheckRequired.classTraining}
              error={localMessages && localMessages.classTraining}
              helperText={localMessages && localMessages.classTraining}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              value={localState.title}
              className="setColor"
              onChange={e => handleInputMenuChange(e)}
              name="title"
              type="1"
              configType="hrmSource"
              configCode="S06"
              label={getLabelNames('title') || 'NGÀNH HỌC'}
              checkedShowForm={localCheckShowForm && localCheckShowForm['title.title']}
              required={localCheckRequired && localCheckRequired['title.title']}
              error={localMessages && localMessages['title.title']}
              helperText={localMessages && localMessages['title.title']}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.degree}
              onChange={e => handleInputMenuChange(e)}
              name="degree"
              type="1"
              configType="hrmSource"
              configCode="S07"
              label={getLabelNames('degree') || 'VĂN BẰNG'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.degree}
              required={localCheckRequired && localCheckRequired.degree}
              error={localMessages && localMessages.degree}
              helperText={localMessages && localMessages.degree}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.educateMethod}
              onChange={e => handleInputMenuChange(e)}
              name="educateMethod"
              type="1"
              configType="hrmSource"
              configCode="S32"
              label={getLabelNames('educateMethod') || 'HÌNH THỨC ĐÀO TẠO'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educateMethod}
              required={localCheckRequired && localCheckRequired.educateMethod}
              error={localMessages && localMessages.educateMethod}
              helperText={localMessages && localMessages.educateMethod}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.educateCenter}
              onChange={e => handleInputMenuChange(e)}
              name="educateCenter"
              type="1"
              configType="hrmSource"
              configCode="S33"
              label={getLabelNames('educateCenter') || 'TRUNG TÂM ĐÀO TẠO'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educateCenter}
              required={localCheckRequired && localCheckRequired.educateCenter}
              error={localMessages && localMessages.educateCenter}
              helperText={localMessages && localMessages.educateCenter}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase
              type="string"
              name="address"
              className="setColor"
              onChange={e => handleInputChange(e)}
              value={localState.address}
              label={getLabelNames('address') || 'ĐỊA ĐIỂM'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.address}
              required={localCheckRequired && localCheckRequired.address}
              error={localMessages && localMessages.address}
              helperText={localMessages && localMessages.address}
            />
          </Grid>
          <Grid item xs={3}>
            <AsyncAutocomplete
              url={API_HRM_EMPLOYEE}
              label={name2Title.userNeed || 'NGƯỜI GỬI YÊU CẦU'}
              name2Title
              value={localState2.userNeed}
              name="userNeed"
              className="setColor"
              onChange={e => handleInputChangeRequest(e, 'userNeed')}
              checkedShowForm={localCheckShowForm && localCheckShowForm.userNeed}
              required={localCheckRequired && localCheckRequired.userNeed}
              error={localMessages && localMessages.userNeed}
              helperText={localMessages && localMessages.userNeed}
            />
          </Grid>
          <Grid item xs={3}>
            <NumberFormat
              allowNegative={false}
              decimalSeparator={false}
              customInput={CustomInputBase}
              allowLeadingZeros={false}
              label={name2Title.amount || 'SỐ LƯỢNG'}
              value={localState.amount}
              className="setColor"
              name="amount"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.amount}
              required={localCheckRequired && localCheckRequired.amount}
              error={localMessages && localMessages.amount}
              helperText={localMessages && localMessages.amount}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomDatePicker
              name="startDate"
              className="setColor"
              value={localState.startDate}
              disablePast
              onChange={e => handleChangeDate(e, 'startDate')}
              label={getLabelNames('startDate') || 'NGÀY BẮT ĐẦU'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
              required={localCheckRequired && localCheckRequired.startDate}
              error={localMessages && localMessages.startDate}
              helperText={localMessages && localMessages.startDate}
              mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomDatePicker
              name="endDate"
              className="setColor"
              value={localState.endDate}
              onChange={e => handleChangeDate(e, 'endDate')}
              label={getLabelNames('endDate') || 'NGÀY KẾT THÚC'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
              required={localCheckRequired && localCheckRequired.endDate}
              error={localMessages && localMessages.endDate}
              helperText={localMessages && localMessages.endDate}
              disablePast
              mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={localState.content}
              name="content"
              onKeyDown={keyPress}
              rows={5}
              InputLabelProps={{
                shrink: true,
              }}
              className="setColor"
              fullWidth
              multiline
              variant="outlined"
              aria-describedby="component-error-text"
              onChange={e => handleInputChange(e)}
              label={getLabelNames('content') || 'NỘI DUNG MÔ TẢ'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.content}
              required={localCheckRequired && localCheckRequired.content}
              error={localMessages && localMessages.content}
              helperText={localMessages && localMessages.content}
            />
          </Grid>
          <Grid item xs={12} container>
            <CustomGroupInputField
              code={'EducateRound'}
              columnPerRow={3}
              value={localState.others}
              onChange={params => {
                setLocalState({ ...localState, others: params });
                console.log(params, 'params');
              }}
            />
          </Grid>

          <Grid item xs={12} container>
            <Grid item xs={3} style={{ textAlign: 'center', fontWeight: 'bold' }}>
              NHÂN SỰ THAM GIA ĐÀO TẠO
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center', fontWeight: 'bold' }}>
              CHI PHÍ ĐÀO TẠO
            </Grid>
            <Grid item xs={5} style={{ textAlign: 'center', fontWeight: 'bold' }}>
              KẾT QUẢ ĐÀO TẠO
            </Grid>
            <Grid item xs={1} style={{ textAlign: 'end' }}>
              <Tooltip title="Thêm mới">
                <Add color="primary" onClick={() => handleAddRow()} />
              </Tooltip>
            </Grid>
          </Grid>
          {hrmJoin &&
            hrmJoin.length > 0 &&
            hrmJoin.map((item, index) => {
              return ListPeople(item, index);
            })}
          <Grid item xs={12} container>
            <Grid item xs={3} style={{ fontWeight: 'bold', marginLeft: 10 }}>
              Tổng chi phí:
            </Grid>
            <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', marginRight: 10 }}>
              {localState.totalFee && localState.totalFee.toLocaleString('da-DK')}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

AddTraining.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
)(AddTraining);
