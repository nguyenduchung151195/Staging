/**
 *
 * PraisePage
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Person } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Grid, Paper, withStyles } from '@material-ui/core';
import { Typography, SwipeableDrawer, Autocomplete, FileUpload } from 'components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import CustomInputBase from '../../../../../components/Input/CustomInputBase';
import { MenuItem, Button, Checkbox, Avatar, TextField } from '@material-ui/core';
import styles from './styles';
import CustomInputField from '../../../../../components/Input/CustomInputField';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import { Delete } from '@material-ui/icons';
import Snackbar from '../../../../../components/Snackbar';
import { AsyncAutocomplete } from '../../../../../components/LifetekUi';
import { API_HRM_SHIFT, API_ASSET } from '../../../../../config/urlConfig';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import ListPage from 'components/List';
import { MODULE_CODE } from 'utils/constants';

/* eslint-disable react/prefer-stateless-function */
function ContractInsuranceAndTimeKeep(props) {
  const [addPersonnelState, setPersonnelState] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [localEquipment, setLocalEquipment] = useState([]);
  const [localWorkingInformation, setLocalWorkingInformation] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: 'error' });
  const { handleChangeInput, addPersonnel, handleDiscount, classes, code } = props;
  useEffect(
    () => {
      setPersonnelState(addPersonnel);
      setLocalEquipment(addPersonnel.equipmentList || []);
      setLocalWorkingInformation(addPersonnel.workingInformation || []);
    },
    [addPersonnel],
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
  const validateSpecialCharacters = value => {
    const regex = /[^A-Za-z0-9_-]/u;
    const data = regex.test(value);
    return data;
  };
  const validateNotNumber = value => {
    const regex = /[^0-9]/u;
    const data = regex.test(value);
    return data;
  };
  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, addPersonnelState);
      setLocalMessages(messages);
      if (addPersonnelState.rank && validateSpecialCharacters(addPersonnelState.rank)) {
        messages = { ...messages, rank: 'Không được chứa ký tự đặc biệt' };
      }
      if (addPersonnel.insuranceCode && validateSpecialCharacters(addPersonnel.insuranceCode)) {
        messages = { ...messages, insuranceCode: 'Không được chứa ký tự đặc biệt' };
      }
      if (addPersonnel.graduateYear && validateNotNumber(addPersonnel.graduateYear)) {
        messages = { ...messages, graduateYear: 'Không được chứa ký tự đặc biệt' };
      }
      if (addPersonnel.passport && validateSpecialCharacters(addPersonnel.passport)) {
        messages = { ...messages, passport: 'Không được chứa ký tự đặc biệt' };
      }
      setLocalMessages(messages);
      props.messages(messages);
      return () => {
        messages;
      };
    },
    [addPersonnelState],
  );

  const handleChangeTextField = e => {
    const {
      target: { name, value },
    } = e;
    //setPersonnelState({ ...addPersonnelState, [name]: value });
    handleChangeInput(name, value);
  };

  const handleChangeWorking = (e, index) => {
    switch (e.target.name) {
      case 'equipmentId':
        const duplicate = localWorkingInformation.filter(item => item.equipmentId === e.target.value);
        if (duplicate.length === 0) {
          localWorkingInformation[index].equipmentId = e.target.value;
          props.mergeData({
            workingInformation: localWorkingInformation,
          });
        } else {
          // setSnackbar({ variant: 'error', message: "Đã chọn máy chấm công này! Vui lòng chọn máy khác", open: true });
        }

        break;
      case 'codeEmployee':
        localWorkingInformation[index].codeEmployee = e.target.value;
        props.mergeData({
          workingInformation: localWorkingInformation,
        });
        break;
      case 'shift':
        localWorkingInformation[index].shift = e.target.value;
        props.mergeData({
          workingInformation: localWorkingInformation,
        });
        break;
    }
  };

  const handleChangeShifts = value => {
    props.mergeData({ codeShift: value });
  };

  const addColumn = () => {
    const add = {
      codeEmployee: '',
      shift: '',
      equipmentId: {},
    };
    const newCls = localWorkingInformation.concat(add);
    props.mergeData({
      workingInformation: newCls,
    });
  };

  const delColumn = value => {
    if (value.equipmentId !== '') {
      const removeIndex = localWorkingInformation.map(item => item.equipmentId).indexOf(value.equipmentId);
      localWorkingInformation.splice(removeIndex, 1);
      props.mergeData({
        workingInformation: localWorkingInformation,
      });
    } else {
      const newCls = localWorkingInformation.pop();
      props.mergeData({
        workingInformation: localWorkingInformation,
      });
    }
  };

  return (
    <Paper className={classes.paper}>
      <Snackbar message={snackbar.message} onClose={() => setSnackbar({ ...snackbar, open: false })} open={snackbar.open} />
      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Hợp đồng
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      <Grid container md={12} spacing={16}>
        <Grid item xs={12}>
          <CustomInputBase
            value={addPersonnel.rank}
            onChange={e =>
              props.mergeData({
                rank: e.target.value,
              })
            }
            name="rank"
            label={name2Title.rank}
            checkedShowForm={localCheckShowForm && localCheckShowForm.rank}
            required={localCheckRequired && localCheckRequired.rank}
            error={localMessages && localMessages.rank}
            helperText={localMessages && localMessages.rank}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            <Checkbox color="primary" checked={addPersonnel.restStatus} onChange={e => handleDiscount('restStatus', e.target.checked)} />
            Trạng thái nghỉ việc
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              variant="outlined"
              fullWidth
              value={addPersonnel.inactivityDate}
              // onChange={e =>
              //   props.mergeData({
              //     inactivityDate: e.target.value,
              //   })
              // }
              onChange={value => props.mergeData({ inactivityDate: value })}
              name="inactivityDate"
              label={name2Title.inactivityDate || 'Chọn ngày'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.inactivityDate}
              required={localCheckRequired && localCheckRequired.inactivityDate}
              error={localMessages && localMessages.inactivityDate}
              helperText={localMessages && localMessages.inactivityDate}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.insuranceNumber === null || addPersonnel.insuranceNumber === '' ? '' : addPersonnel.insuranceNumber}
            onChange={e =>
              props.mergeData({
                insuranceNumber: e.target.value,
              })
            }
            name="insuranceNumber"
            label={name2Title.insuranceNumber}
            checkedShowForm={localCheckShowForm && localCheckShowForm.insuranceNumber}
            required={localCheckRequired && localCheckRequired.insuranceNumber}
            error={localMessages && localMessages.insuranceNumber}
            helperText={localMessages && localMessages.insuranceNumber}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.insuranceCode}
            onChange={e =>
              props.mergeData({
                insuranceCode: e.target.value,
              })
            }
            name="insuranceCode"
            label={name2Title.insuranceCode}
            checkedShowForm={localCheckShowForm && localCheckShowForm.insuranceCode}
            required={localCheckRequired && localCheckRequired.insuranceCode}
            error={localMessages && localMessages.insuranceCode}
            helperText={localMessages && localMessages.insuranceCode}
          />
        </Grid>
        <Grid item xs={3}>
          <AsyncAutocomplete
            isMulti
            label="Chọn ca làm việc"
            name="shifts"
            onChange={value => handleChangeShifts(value)}
            value={addPersonnelState.codeShift}
            url={API_HRM_SHIFT}
          />
        </Grid>
      </Grid>
      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin ca làm việc - chấm công
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      {addPersonnelState.workingInformation &&
        addPersonnelState.workingInformation.map((item, index) => (
          <Grid container md={12} spacing={16}>
            <Grid item xs={3}>
              <CustomInputBase
                value={item.equipmentId}
                onChange={e => handleChangeWorking(e, index)}
                name="equipmentId"
                select
                // label={name2Title["shift.title"] || "CA LÀM VIỆC"}
                label={'MÁY CHẤM CÔNG'}
                checkedShowForm={localCheckShowForm && localCheckShowForm['equipmentId']}
                required={localCheckRequired && localCheckRequired['equipmentId']}
                error={localMessages && localMessages['equipmentId']}
                helperText={localMessages && localMessages['equipmentId']}
              >
                {localEquipment.length > 0 &&
                  localEquipment.map((item, index) => {
                    return (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </CustomInputBase>
            </Grid>
            <Grid item xs={3}>
              <CustomInputBase
                value={item.codeEmployee}
                onChange={e => handleChangeWorking(e, index)}
                name="codeEmployee"
                label={name2Title.timekeepingCode}
                checkedShowForm={localCheckShowForm && localCheckShowForm.timekeepingCode}
                required={localCheckRequired && localCheckRequired.timekeepingCode}
                error={localMessages && localMessages.timekeepingCode}
                helperText={localMessages && localMessages.timekeepingCode}
              />
            </Grid>
            <Grid item xs={3}>
              <CustomInputBase
                value={item.shift}
                onChange={e => handleChangeWorking(e, index)}
                name="shift"
                label={name2Title['shift.title'] || 'CA LÀM VIỆC'}
                checkedShowForm={localCheckShowForm && localCheckShowForm['shift.title']}
                required={localCheckRequired && localCheckRequired['shift.title']}
                error={localMessages && localMessages['shift.title']}
                helperText={localMessages && localMessages['shift.title']}
              />
            </Grid>
            {/* <Grid item xs={2}>
            <AsyncAutocomplete
              isMulti
              label="Chọn ca làm việc"
              name="shifts"
              onChange={value => handleChangeShifts(value, index)}
              // value={action.additionData.toNotice}
              url={API_HRM_SHIFT}
            />
          </Grid> */}
            <Grid item xs={1}>
              {addPersonnelState.workingInformation.length > 1 ? (
                <Delete onClick={() => delColumn(item)} style={{ cursor: 'pointer', marginTop: 20 }} />
              ) : null}
            </Grid>
          </Grid>
        ))}
      {localEquipment.length > localWorkingInformation.length && (
        <Button onClick={addColumn} variant="outlined" color="primary">
          Thêm trường
        </Button>
      )}

      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin khác
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      <Grid container md={12} spacing={16}>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.graduateSchool}
            onChange={handleChangeTextField}
            name="graduateSchool"
            label={name2Title['graduateSchool']}
            type="1"
            configType="hrmSource"
            configCode="S14"
            checkedShowForm={localCheckShowForm && localCheckShowForm['graduateSchool']}
            required={localCheckRequired && localCheckRequired['graduateSchool']}
            error={localMessages && localMessages['graduateSchool']}
            helperText={localMessages && localMessages['graduateSchool']}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.graduateYear}
            onChange={e =>
              props.mergeData({
                graduateYear: e.target.value,
              })
            }
            name="graduateYear"
            label={name2Title.graduateYear}
            checkedShowForm={localCheckShowForm && localCheckShowForm.graduateYear}
            required={localCheckRequired && localCheckRequired.graduateYear}
            error={localMessages && localMessages.graduateYear}
            helperText={localMessages && localMessages.graduateYear}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.bloodGroup}
            onChange={handleChangeTextField}
            name="bloodGroup"
            label={name2Title['bloodGroup']}
            type="1"
            configType="hrmSource"
            configCode="S15"
            checkedShowForm={localCheckShowForm && localCheckShowForm['bloodGroup']}
            required={localCheckRequired && localCheckRequired['bloodGroup']}
            error={localMessages && localMessages['bloodGroup']}
            helperText={localMessages && localMessages['bloodGroup']}
          />
        </Grid>

        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.healthStatus}
            onChange={e =>
              props.mergeData({
                healthStatus: e.target.value,
              })
            }
            name="healthStatus"
            label={name2Title.healthStatus}
            checkedShowForm={localCheckShowForm && localCheckShowForm.healthStatus}
            required={localCheckRequired && localCheckRequired.healthStatus}
            error={localMessages && localMessages.healthStatus}
            helperText={localMessages && localMessages.healthStatus}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnel.relationship}
            onChange={e =>
              props.mergeData({
                relationship: e.target.value,
              })
            }
            name="relationship"
            label={name2Title.relationship}
            checkedShowForm={localCheckShowForm && localCheckShowForm.relationship}
            required={localCheckRequired && localCheckRequired.relationship}
            error={localMessages && localMessages.relationship}
            helperText={localMessages && localMessages.relationship}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnel.passport}
            onChange={e =>
              props.mergeData({
                passport: e.target.value,
              })
            }
            name="passport"
            label={name2Title.passport}
            checkedShowForm={localCheckShowForm && localCheckShowForm.passport}
            required={localCheckRequired && localCheckRequired.passport}
            error={localMessages && localMessages.passport}
            helperText={localMessages && localMessages.passport}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              variant="outlined"
              fullWidth
              value={addPersonnel.passportDate}
              onChange={value => props.mergeData({ passportDate: value })}
              name="passportDate"
              label={name2Title.passportDate || 'Chọn ngày'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.passportDate}
              required={localCheckRequired && localCheckRequired.passportDate}
              error={localMessages && localMessages.passportDate}
              helperText={localMessages && localMessages.passportDate}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.facebook}
            onChange={e =>
              props.mergeData({
                facebook: e.target.value,
              })
            }
            name="facebook"
            label={name2Title.facebook}
            checkedShowForm={localCheckShowForm && localCheckShowForm.facebook}
            required={localCheckRequired && localCheckRequired.facebook}
            error={localMessages && localMessages.facebook}
            helperText={localMessages && localMessages.facebook}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnel.skype}
            onChange={e => props.mergeData({ skype: e.target.value })}
            name="skype"
            label={name2Title.skype || 'SKYPE'}
            checkedShowForm={localCheckShowForm && localCheckShowForm.skype}
            required={localCheckRequired && localCheckRequired.skype}
            error={localMessages && localMessages.skype}
            helperText={localMessages && localMessages.skype}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnel.yahoo}
            onChange={e => props.mergeData({ yahoo: e.target.value })}
            name="yahoo"
            label={name2Title.yahoo || 'YAHOO'}
            checkedShowForm={localCheckShowForm && localCheckShowForm.yahoo}
            required={localCheckRequired && localCheckRequired.yahoo}
            error={localMessages && localMessages.yahoo}
            helperText={localMessages && localMessages.yahoo}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnel.twitter}
            onChange={e =>
              props.mergeData({
                twitter: e.target.value,
              })
            }
            name="twitter"
            label={name2Title.twitter}
            checkedShowForm={localCheckShowForm && localCheckShowForm.twitter}
            required={localCheckRequired && localCheckRequired.twitter}
            error={localMessages && localMessages.twitter}
            helperText={localMessages && localMessages.twitter}
          />
        </Grid>
      </Grid>
      {addPersonnelState._id && (
        <>
          <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
            <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Danh sách thiết bị được cấp phát
            <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
          </Typography>

          <ListPage
            disableViewConfig
            disableEdit
            disableAdd
            disableConfig
            disableSearch
            disableSelect
            disableImport
            columns={[
              { name: 'code', title: 'Mã tài sản', checked: true, width: 200, enabaleSearch: true },
              { name: 'name', title: 'Tên tài sản', checked: true, width: 200, enabaleSearch: true },
              // { name: 'allocation.personReceiveName', title: 'Người tiếp nhận', checked: true, width: 300 },
              { name: 'allocation.dateReceive', title: 'Thời gian tiếp nhận', checked: true, width: 300 },
              { name: 'note', title: 'Mô tả', checked: true, width: 300 },
            ]}
            code={MODULE_CODE.Allocate}
            apiUrl={API_ASSET}
            mapFunction={item => {
              return {
                ...item,
                type: item['type.name'] || '',
                note: item['allocation.note'] || '',
              };
            }}
            filter={{
              'allocation.status': { $in: [0, 1, 2] },
              'allocation.personReceive': addPersonnelState._id,
            }}
          />
        </>
      )}
    </Paper>
  );
}

ContractInsuranceAndTimeKeep.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(
  null,
  null,
);

const withReducer = injectReducer({ key: 'contractInsuranceAndTimeKeep', reducer });
const withSaga = injectSaga({ key: 'contractInsuranceAndTimeKeep', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
)(ContractInsuranceAndTimeKeep);
