/**
 *
 * AddSalary
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';

/* eslint-disable react/prefer-stateless-function */
function AddSalary(props) {
  const { salary, onSave, onClose, code, hrmEmployeeId, profile, miniActive } = props;
  const [localState, setLocalState] = useState({
    others: {},
    hrmEmployeeId: hrmEmployeeId,
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
      if (salary && salary.originItem) {
        setLocalState({ ...salary.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [salary],
  );

  useEffect(
    () => {
      const messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputChangeDate = (e, fieldName) => {
    const name = fieldName;
    const value = moment(e) && moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
  };
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setLocalState(state => ({ ...state, organizationUnit: department }));
    },
    [localState],
  );

  const handleSave = e => {
    if (Object.keys(localMessages).length === 0) {
      onSave(localState);
    } else {
      props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };

  return (
    <div style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', padding: 20 }}>
      <CustomAppBar
        title="Thông tin diễn biến lương"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={handleSave}
      />
      <Grid container style={{ marginTop: 60 }} />

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            name="decisionNumber"
            type="number"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={(name2Title && name2Title.enjoymentDate) || 'Chọn ngày'}
            value={localState && localState.enjoymentDate}
            name="enjoymentDate"
            onChange={e => handleInputChangeDate(e, 'enjoymentDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.enjoymentDate}
            required={localCheckRequired && localCheckRequired.enjoymentDate}
            error={localMessages && localMessages.enjoymentDate}
            helperText={localMessages && localMessages.enjoymentDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.decisionDate || 'Chọn ngày'}
            value={localState.decisionDate}
            name="decisionDate"
            onChange={e => handleInputChangeDate(e, 'decisionDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
            required={localCheckRequired && localCheckRequired.decisionDate}
            error={localMessages && localMessages.decisionDate}
            helperText={localMessages && localMessages.decisionDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.workPlace}
            value={localState.workPlace}
            name="workPlace"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.workPlace}
            required={localCheckRequired && localCheckRequired.workPlace}
            error={localMessages && localMessages.workPlace}
            helperText={localMessages && localMessages.workPlace}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.procedure || 'Chọn ngày'}
            value={localState.procedure}
            name="procedure"
            onChange={e => handleInputChangeDate(e, 'procedure')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.procedure}
            required={localCheckRequired && localCheckRequired.procedure}
            error={localMessages && localMessages.procedure}
            helperText={localMessages && localMessages.procedure}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase label={name2Title.position} value={localState.position} name="position" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.position}
            onChange={handleInputChange}
            name="position"
            label={name2Title['position.title']}
            type="1"
            configType="hrmSource"
            configCode="S16"
            checkedShowForm={localCheckShowForm && localCheckShowForm['position.title']}
            required={localCheckRequired && localCheckRequired['position.title']}
            error={localMessages && localMessages['position.title']}
            helperText={localMessages && localMessages['position.title']}
          />
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
          <Department
            onChange={handeChangeDepartment}
            department={localState.organizationUnit}
            disableEmployee
            moduleCode="SalaryDevelopment"
            profile={profile}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.note}
            value={localState.note}
            name="note"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.note}
            required={localCheckRequired && localCheckRequired.note}
            error={localMessages && localMessages.note}
            helperText={localMessages && localMessages.note}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddSalary);
