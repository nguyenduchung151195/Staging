/**
 *
 * AddProcess
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
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';
import { TextField } from '@material-ui/core';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
import { changeSnackbar } from 'containers/Dashboard/actions'
function AddProcess(props) {
  const { process, onSave, onClose, code, hrmEmployeeId, profile } = props;
  const [localState, setLocalState] = useState({
    decisionNumber: '',
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

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
      console.log(process, "process")
      if (process && process.originItem) {
        setLocalState({ ...process.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
          decisionNumber: ""
        });
      }
    },
    [process],
  );

  useEffect(
    () => {
      let data = localState
      const {
        oldOrganizationUnit,
        newOrganizationUnit
      } = data
      if (!oldOrganizationUnit || !(oldOrganizationUnit && oldOrganizationUnit.department)) {
        // delete data.oldOrganizationUnit
        data.oldOrganizationUnit = ""
      }
      if (!newOrganizationUnit || !(newOrganizationUnit && newOrganizationUnit.department)) {
        data.newOrganizationUnit = ""
      }
      const messages = viewConfigCheckForm(code, data);
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInput = (e, isDate) => {
    console.log(localMessages, 'localMessageslocalMessages');
    const name = isDate ? 'decisionDate' : 'efficiencyDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });

  };

  const handleInputDuration = e => {
    const name = 'duration';
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
  };

  const handleInputChange = e => {
    if (e.target.name === 'decisionNumber')
      if (!e.target.value) {
        setLocalMessages({ ...localMessages, decisionNumber: `Không được để trống ${name2Title.decisionNumber}` })
      }
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputChangeFile = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);

    setLocalState({ ...localState, file: urlAvt });
  };
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  const handleInputChangeOrg = (e, isDate) => {
    const name = isDate ? 'oldOrganizationUnit' : 'newOrganizationUnit';
    // if (isDate) setLocalMessages({ ...localState, oldOrganizationUnit: `Không được để trống ${name2Title.oldOrganizationUnit}` });
    // else setLocalMessages({ ...localState, newOrganizationUnit: `Không được để trống ${name2Title.newOrganizationUnit}` });
    // setLocalState({ ...localState, [name]: e });
    setLocalState({ ...localState, [name]: e })

  };
  const handleSave = (data) => {
    // onSave(localState) 
    const {
      oldOrganizationUnit,
      newOrganizationUnit
    } = data
    // if (!oldOrganizationUnit || !(oldOrganizationUnit && oldOrganizationUnit.department)) {
    //   return props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn phòng ban cũ!', variant: 'error' });
    // }
    // if (!newOrganizationUnit || !(newOrganizationUnit && newOrganizationUnit.department)) {
    //   return props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn phòng ban mới!', variant: 'error' });
    // }
    let dataClone = localState
    if (!oldOrganizationUnit || !(oldOrganizationUnit && oldOrganizationUnit.department)) {
      // delete dataClone.oldOrganizationUnit
      dataClone.oldOrganizationUnit = ""
    }
    if (!newOrganizationUnit || !(newOrganizationUnit && newOrganizationUnit.department)) {
      // delete dataClone.oldOrganizationUnit
      dataClone.newOrganizationUnit = ""
    }
    const messages = viewConfigCheckForm('WorkProgress', dataClone)
    console.log(messages, 'messages', dataClone)
    if (Object.keys(messages).length === 0) {
      onSave(data)
    } else {
      let mess = ''
      for (const mes in messages) {
        if (!mess)
          mess = mess + `${messages[mes]}`
        else mess = mess + `, ${messages[mes]}`
      }
      return props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: mess || 'Vui lòng chọn phòng ban mới!', variant: 'error' });
    }
    // onSave(data)
  }
  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar
        title="Thông tin quá trình điều chuyển/bổ nhiệm"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => handleSave(localState)}
      />
      <Grid container style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            name="decisionNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
            type="number"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.decisionDate || 'Chọn ngày'}
            value={localState.decisionDate}
            name="decisionDate"
            onChange={e => handleInput(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
            required={localCheckRequired && localCheckRequired.decisionDate}
            error={localMessages && localMessages.decisionDate}
            helperText={localMessages && localMessages.decisionDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.efficiencyDate || 'Chọn ngày'}
            value={localState.efficiencyDate}
            name="efficiencyDate"
            onChange={e => handleInput(e, false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.efficiencyDate}
            required={localCheckRequired && localCheckRequired.efficiencyDate}
            error={localMessages && localMessages.efficiencyDate}
            helperText={localMessages && localMessages.efficiencyDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.duration || 'Chọn ngày'}
            value={localState.duration}
            name="duration"
            onChange={e => handleInputDuration(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.duration}
            required={localCheckRequired && localCheckRequired.duration}
            error={localMessages && localMessages.duration}
            helperText={localMessages && localMessages.duration}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin phòng ban/chức vụ hiện tại
          </Typography>
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase
            select
            label={name2Title.oldOrganizationUnit}
            value={localState.oldOrganizationUnit}
            name="oldOrganizationUnit"
            onChange={handleInputChange}
            
          /> */}
          {/* phòng ban cũ */}
          <DepartmentAndEmployee
            disableEmployee
            profile={profile}
            moduleCode="DisciplineProcess"
            department={localState.oldOrganizationUnit && localState.oldOrganizationUnit.department}
            // onChange={e => setLocalState({ ...localState, oldOrganizationUnit: e })}
            onChange={e => handleInputChangeOrg(e, true)}
            error={localMessages && localMessages.oldOrganizationUnit}
            helperText={localMessages && localMessages.oldOrganizationUnit}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase label={name2Title.oldPosition} value={localState.oldPosition} name="oldPosition" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.oldPosition}
            onChange={handleInputChange}
            name="oldPosition"
            label={name2Title['oldPosition.title']}
            type="1"
            configType="hrmSource"
            configCode="S16"
            checkedShowForm={localCheckShowForm && localCheckShowForm['oldPosition.title']}
            required={localCheckRequired && localCheckRequired['oldPosition.title']}
            error={localMessages && localMessages['oldPosition.title']}
            helperText={localMessages && localMessages['oldPosition.title']}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase select label={name2Title.oldTitle} value={localState.oldTitle} name="oldTitle" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.oldTitle}
            onChange={handleInputChange}
            name="oldTitle"
            label={name2Title['oldTitle.title']}
            type="1"
            configType="hrmSource"
            configCode="S04"
            checkedShowForm={localCheckShowForm && localCheckShowForm['oldTitle.title']}
            required={localCheckRequired && localCheckRequired['oldTitle.title']}
            error={localMessages && localMessages['oldTitle.title']}
            helperText={localMessages && localMessages['oldTitle.title']}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Điều chuyển tới
          </Typography>
        </Grid>

        <Grid item xs={4}>
          {/* <CustomInputBase
            select
            label={name2Title.newOrganizationUnit}
            value={localState.newOrganizationUnit}
            name="newOrganizationUnit"
            onChange={handleInputChange}
          /> */}
          {/* phòng ban mới */}
          <DepartmentAndEmployee
            disableEmployee
            profile={profile}
            moduleCode="DisciplineProcess"
            department={localState.oldOrganizationUnit && localState.newOrganizationUnit.department}
            onChange={e => handleInputChangeOrg(e, false)}
            // onChange={e => setLocalState({ ...localState, newOrganizationUnit: e })}
            error={localMessages && localMessages.newOrganizationUnit}
            helperText={localMessages && localMessages.newOrganizationUnit}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase label={name2Title.newPosition} value={localState.newPosition} name="newPosition" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.newPosition}
            onChange={handleInputChange}
            name="newPosition"
            label={name2Title['newPosition.title']}
            type="1"
            configType="hrmSource"
            configCode="S16"
            checkedShowForm={localCheckShowForm && localCheckShowForm['newPosition.title']}
            required={localCheckRequired && localCheckRequired['newPosition.title']}
            error={localMessages && localMessages['newPosition.title']}
            helperText={localMessages && localMessages['newPosition.title']}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase select label={name2Title.newTitle} value={localState.newTitle} name="newTitle" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.newTitle}
            onChange={handleInputChange}
            name="newTitle"
            label={name2Title['newTitle.title']}
            type="1"
            configType="hrmSource"
            configCode="S04"
            checkedShowForm={localCheckShowForm && localCheckShowForm['newTitle.title']}
            required={localCheckRequired && localCheckRequired['newTitle.title']}
            error={localMessages && localMessages['newTitle.title']}
            helperText={localMessages && localMessages['newTitle.title']}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase select label={name2Title.newTitle} value={localState.newTitle} name="newTitle" onChange={handleInputChange} />
        </Grid> */}
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Lý do/ghi chú
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.reason}
            value={localState.reason}
            name="reason"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.reason}
            required={localCheckRequired && localCheckRequired.reason}
            error={localMessages && localMessages.reason}
            helperText={localMessages && localMessages.reason}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.node}
            value={localState.node}
            name="node"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.node}
            required={localCheckRequired && localCheckRequired.node}
            error={localMessages && localMessages.node}
            helperText={localMessages && localMessages.node}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase
            label="File Upload"
            name="url"
            type="file"
            value={localState.fileURL}
            onChange={(e) => handleInputChangeFile(e)}
          /> */}
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            className="custominput"
            fullWidth
            id="standard-size-small"
            label="File Upload"
            type="file"
            // value={localState.file}
            onChange={e => {
              handleInputChangeFile(e);
            }}
            variant="outlined"
            style={{ margin: 0, paddingBottom: 0 }}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddProcess.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {

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
)(AddProcess);
