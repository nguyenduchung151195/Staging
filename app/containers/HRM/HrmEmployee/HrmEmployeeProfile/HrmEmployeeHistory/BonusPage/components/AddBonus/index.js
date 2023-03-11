/**
 *
 * AddSalary
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
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function AddBonus(props) {
  const { bonus, onSave, onClose, code, hrmEmployeeId, profile } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
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

  useEffect(
    () => {
      if (bonus && bonus.originItem) {
        setLocalState({ ...bonus.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [bonus],
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
    const name = 'decisionDate';
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
    setLocalState({ ...localState, [e.target.name]: e.target.value });
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
      setLocalState(state => ({ ...state, agency: department }));
    },
    [localState],
  );

  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar
        title="Thông tin thưởng"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => onSave(localState)}
      />
      <Grid container style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.decisionNumber} value={localState.decisionNumber} name="decisionNumber" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.decisionDate || 'Chọn ngày'}
            value={localState.decisionDate}
            name="decisionDate"
            onChange={e => handleInputChange(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
            required={localCheckRequired && localCheckRequired.decisionDate}
            error={localMessages && localMessages.decisionDate}
            helperText={localMessages && localMessages.decisionDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.signer}
            value={localState.signer}
            name="signer"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.signer}
            required={localCheckRequired && localCheckRequired.signer}
            error={localMessages && localMessages.signer}
            helperText={localMessages && localMessages.signer}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.form}
            value={localState.form}
            name="form"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.form}
            required={localCheckRequired && localCheckRequired.form}
            error={localMessages && localMessages.form}
            helperText={localMessages && localMessages.form}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.money}
            value={localState.money}
            name="money"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.money}
            required={localCheckRequired && localCheckRequired.money}
            error={localMessages && localMessages.money}
            helperText={localMessages && localMessages.money}
          />
        </Grid>
        <Grid item xs={4}>
          <Department
            onChange={handeChangeDepartment}
            department={localState.agency}
            disableEmployee
            profile={profile}
            moduleCode="hrm"
            labelEmployee="Cơ quan"
          />
          {/* <CustomInputBase label={name2Title.agency} value={localState.agency} name="agency" onChange={handleInputChange} /> */}
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
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.orther}
            value={localState.orther}
            name="orther"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.orther}
            required={localCheckRequired && localCheckRequired.orther}
            error={localMessages && localMessages.orther}
            helperText={localMessages && localMessages.orther}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.state}
            value={localState.state}
            name="state"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.state}
            required={localCheckRequired && localCheckRequired.state}
            error={localMessages && localMessages.state}
            helperText={localMessages && localMessages.state}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddBonus.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddBonus);
