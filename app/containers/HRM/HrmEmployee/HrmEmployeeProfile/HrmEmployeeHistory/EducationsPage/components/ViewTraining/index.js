/**
 *
 * AddEducations
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired, viewConfigCheckShowForm } from 'utils/common';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import CustomAppBar from 'components/CustomAppBar';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import { API_RECRUITMENT, API_HRM_EDUCATE, API_USERS, API_EDUCATE_ROUND, API_EDUCATE_PLAN, API_PERSONNEL, API_HRM_EMPLOYEE } from '../../../../../../../../config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';
import KanbanStepper from '../../../../../../../../components/KanbanStepper';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import { fetchData } from '../../../../../../../../helper';
import NumberFormat from 'react-number-format';
import { TextField } from 'components/LifetekUi';
import './style.css'
function AddTraining(props) {
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localState, setLocalState] = useState({})
  const [localState1, setLocalState1] = useState({})
  const [localState2, setLocalState2] = useState({})

  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [hrmJoin, setHrmJoin] = useState([])
  const [listUser, setListUser] = useState([])
  const { training, onSave, onClose, code, hrmEmployeeId, profile, educatePlan } = props;
  useEffect(
    () => {
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

    }, [],
  );
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
  const keyPress = event => {
    let { content } = localState;
    if (event.keyCode === 13) {
      const newMulti = { ...content, content: '' };
      setLocalState({ ...localState, newMulti });
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
              isDisabled
            />
          </Grid>
          <Grid item xs={3}>
            <NumberFormat
              allowNegative={false}
              thousandSeparator='.'
              decimalSeparator={false}
              customInput={CustomInputBase}
              allowLeadingZeros={false}
              label=" "
              name="cost"
              value={hrmJoin[index] && hrmJoin[index].cost}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              value={localState.degree}
              name="result1"
              label="TRẠNG THÁI ĐÀO TẠO"
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S34"
              value={hrmJoin[index] && hrmJoin[index].result1}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              value={localState.degree}
              name="result2"
              label="XẾP LOẠI ĐÀO TẠO"
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S35"
              value={hrmJoin[index] && hrmJoin[index].result2}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputField
              value={localState.degree}
              name="certificate"
              label={"CHỨNG CHỈ ĐÀO TẠO"}
              className="setColor"
              type="1"
              configType="hrmSource"
              configCode="S36"
              value={hrmJoin[index] && hrmJoin[index].certificate}
              disabled
            />
          </Grid>
        </Grid>

      </Grid>

    )
  }
  const OptionLabel = option => {
    return option.name;
  };

  useEffect(
    () => {
      if (training && training.originItem) {
        let cost = 0;
        if (training.originItem && training.originItem.hrmJoin && training.originItem.hrmJoin.length > 0) {
          training.originItem.hrmJoin.forEach((el) => {
            if (el.hrmEmployeeId === hrmEmployeeId) {
              let cs = el.cost
              if (cs === "" || cs === null) cs = 0
              else {
                cost = cost + parseInt(cs)
              }
            }
          })
          setLocalState({ ...training.originItem, totalFee: cost })
        }
        let listJoin = []
        if (training.originItem.hrmJoin && training.originItem.hrmJoin.length > 0) {
          training.originItem.hrmJoin.forEach(el => {
            if (el.hrmEmployeeId === hrmEmployeeId) {
              fetchData(`${API_PERSONNEL}/${hrmEmployeeId}`).then(res => {
                let das = el
                das.hrmEmployeeId = res
                listJoin.push(das)
              })
            }
          });
        }
        setHrmJoin(listJoin)
      } else {
        setLocalState({
          ...localState,
        });
      }
    },
    [],
  );
  useEffect(() => {
    if (props.training && props.training['educatePlan._id']) {
      fetchData(`${API_EDUCATE_PLAN}/${props.training['educatePlan._id']}`, 'GET', null).then(res => {
        setLocalState1({ ...localState1, educatePlan: res })
      })
    }
    else if (props.educateID)
      fetchData(`${API_EDUCATE_PLAN}/${props.educateID}`, 'GET', null).then(res => {
        setLocalState1({ ...localState1, educatePlan: res })
      })
  }, [])
  useEffect(
    () => {
      if (training !== null && training.userNeed) {
        fetchData(`${API_PERSONNEL}`).then(res => {
          if (res.data) {
            const dataNeed = res.data.find(item => item._id === training.userNeed);
            setLocalState2({ ...localState2, userNeed: dataNeed });
          }
        })
      }
    },
    [],
  );


  return (
    <div style={{ width: props.miniActive ? window.innerWidth - 89 : window.innerWidth - 250, marginTop: 58 }} >
      <CustomAppBar
        title={"THÔNG TIN KHÓA ĐÀO TẠO"}
        onGoBack={e => onClose()}
        className
        isTask
        disableAdd
      />
      <Grid container style={{ paddingLeft: 10, paddingRight: 10 }} >
        <Grid container spacing={8} >
          <Grid item xs={12}>
            <KanbanStepper
              listStatus={listKanbanStatus}
              onKabanClick={value => {
                // setLocalState({ ...localState, kanbanStatus: value });
              }}
              activeStep={localState.kanbanStatus}
            />
          </Grid>
          <Grid item xs={3}>
            <AsyncAutocomplete
              className="setColor"
              customOptionLabel={OptionLabel}
              value={localState1.educatePlan}
              url={API_EDUCATE_PLAN}
              name="educatePlan"
              isDisabled={props.isDisabled}
              label={name2Title.educatePlan || "KẾ HOẠCH ĐÀO TẠO"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educatePlan}
              required={localCheckRequired && localCheckRequired.educatePlan}
              error={localMessages && localMessages.educatePlan}
              helperText={localMessages && localMessages.educatePlan}
              disabled
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
              value={localState.personalCosts}
              label={name2Title.personalCosts || "TỰ TÍNH CHI PHÍ"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.personalCosts}
              required={localCheckRequired && localCheckRequired.personalCosts}
              error={localMessages && localMessages.personalCosts}
              helperText={localMessages && localMessages.personalCosts}
              disabled
            />

          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              type="string"
              name="name"
              className="setColor"
              value={localState.name}
              label={name2Title.name || "KHÓA ĐÀO TẠO"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.name}
              required={localCheckRequired && localCheckRequired.name}
              error={localMessages && localMessages.name}
              helperText={localMessages && localMessages.name}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              type="string"
              className="setColor"
              name="classTraining"
              value={localState.classTraining}
              label={name2Title.classTraining || "LỚP ĐÀO TẠO"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.classTraining}
              required={localCheckRequired && localCheckRequired.classTraining}
              error={localMessages && localMessages.classTraining}
              helperText={localMessages && localMessages.classTraining}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              value={localState.title}
              className="setColor"
              name="title"
              type="1"
              configType="hrmSource"
              configCode="S06"
              label={name2Title.title || "NGÀNH HỌC"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.title}
              required={localCheckRequired && localCheckRequired.title}
              error={localMessages && localMessages.title}
              helperText={localMessages && localMessages.title}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.degree}
              name="degree"
              type="1"
              configType="hrmSource"
              configCode="S07"
              label={name2Title.degree || "VĂN BẰNG"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.degree}
              required={localCheckRequired && localCheckRequired.degree}
              error={localMessages && localMessages.degree}
              helperText={localMessages && localMessages.degree}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.educateMethod}
              name="educateMethod"
              type="1"
              configType="hrmSource"
              configCode="S32"
              label={name2Title.educateMethod || "HÌNH THỨC ĐÀO TẠO"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educateMethod}
              required={localCheckRequired && localCheckRequired.educateMethod}
              error={localMessages && localMessages.educateMethod}
              helperText={localMessages && localMessages.educateMethod}
              disabled
            />

          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              className="setColor"
              value={localState.educateCenter}
              name="educateCenter"
              type="1"
              configType="hrmSource"
              configCode="S33"
              label={name2Title.educateCenter || "TRUNG TÂM ĐÀO TẠO"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.educateCenter}
              required={localCheckRequired && localCheckRequired.educateCenter}
              error={localMessages && localMessages.educateCenter}
              helperText={localMessages && localMessages.educateCenter}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase
              type="string"
              name="address"
              className="setColor"
              value={localState.address}
              label={name2Title.address || "ĐỊA ĐIỂM"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.address}
              required={localCheckRequired && localCheckRequired.address}
              error={localMessages && localMessages.address}
              helperText={localMessages && localMessages.address}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <AsyncAutocomplete
              url={API_HRM_EMPLOYEE}
              label={name2Title.userNeed || "NGƯỜI GỬI YÊU CẦU"}
              value={localState2.userNeed}
              name="userNeed"
              className="setColor"
              checkedShowForm={localCheckShowForm && localCheckShowForm.userNeed}
              required={localCheckRequired && localCheckRequired.userNeed}
              error={localMessages && localMessages.userNeed}
              helperText={localMessages && localMessages.userNeed}
              isDisabled
            />
          </Grid>
          <Grid item xs={3}>
            <NumberFormat
              allowNegative={false}
              decimalSeparator={false}
              customInput={CustomInputBase}
              allowLeadingZeros={false}
              label={name2Title.amount || "SỐ LƯỢNG"}
              value={localState.amount}
              className="setColor"
              name="amount"
              checkedShowForm={localCheckShowForm && localCheckShowForm.amount}
              required={localCheckRequired && localCheckRequired.amount}
              error={localMessages && localMessages.amount}
              helperText={localMessages && localMessages.amount}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <CustomDatePicker
              name="startDate"
              className="setColor"
              value={localState.startDate}
              disablePast
              label={name2Title.startDate || "NGÀY BẮT ĐẦU"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
              required={localCheckRequired && localCheckRequired.startDate}
              error={localMessages && localMessages.startDate}
              helperText={localMessages && localMessages.startDate}
              mask={value =>
                value
                  ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                  : []
              }
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <CustomDatePicker
              name="endDate"
              className="setColor"
              value={localState.endDate}
              label={name2Title.endDate || "NGÀY BẮT ĐẦU"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
              required={localCheckRequired && localCheckRequired.endDate}
              error={localMessages && localMessages.endDate}
              helperText={localMessages && localMessages.endDate}
              disablePast
              mask={value =>
                value
                  ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                  : []
              }
              disabled
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
              label={name2Title.content || "NỘI DUNG MÔ TẢ"}
              checkedShowForm={localCheckShowForm && localCheckShowForm.content}
              required={localCheckRequired && localCheckRequired.content}
              error={localMessages && localMessages.content}
              helperText={localMessages && localMessages.content}
              disabled
            />

          </Grid>
          <Grid item xs={12} container >
            <Grid item xs={3} style={{ textAlign: "center", fontWeight: "bold" }}>
              NHÂN SỰ THAM GIA ĐÀO TẠO
            </Grid>
            <Grid item xs={3} style={{ textAlign: "center", fontWeight: "bold" }}>
              CHI PHÍ ĐÀO TẠO
            </Grid>
            <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
              KẾT QUẢ ĐÀO TẠO
            </Grid>
          </Grid>
          {
            hrmJoin && hrmJoin.length > 0 && hrmJoin.map((item, index) => {
              return (ListPeople(item, index))
            })
          }
          <Grid item xs={12} container >
            <Grid item xs={3} style={{ fontWeight: "bold", marginLeft: 10 }}>
              Tổng chi phí:
            </Grid>
            <Grid item xs={3} style={{ display: "flex", justifyContent: "flex-start", fontWeight: "bold", marginRight: 10 }}>
              {
                localState.totalFee && localState.totalFee.toLocaleString('da-DK')
              }
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

const withConnect = connect(mapStateToProps);

export default compose(
  memo,
  withConnect,
)(AddTraining);
