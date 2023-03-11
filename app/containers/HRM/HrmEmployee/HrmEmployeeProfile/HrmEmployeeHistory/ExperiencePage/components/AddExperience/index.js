/**
 *
 * AddExperience
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
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function AddExperience(props) {
  const { experience, onSave, onClose, code, hrmEmployeeId } = props;

  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  const [localState, setLocalState] = useState({
    others: {},
  });
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

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
      if (experience && experience.originItem) {
        setLocalState({ ...experience.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [experience],
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

  const handleInputChange = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // setTime({ ...time, [name]: value });
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.startDate && newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.startDate && !newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }
    setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: '20px' }}>
      <CustomAppBar
        title="Thông tin kinh nghiệm làm việc"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => onSave(localState)}
      />
      <Grid container style={{ marginTop: 70 }} />

      <Grid container spacing={8}>
        <Grid item xs={6}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              variant="outlined"
              fullWidth
              label={name2Title.startDate || 'Chọn ngày'}
              value={localState.startDate}
              name="startDate"
              onChange={e => handleInputChange(e, true)}
              checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
              required={localCheckRequired && localCheckRequired.startDate}
              error={localMessages && localMessages.startDate}
              helperText={localMessages && localMessages.startDate}
            />
          </MuiPickersUtilsProvider>
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
        </Grid>
        <Grid item xs={6}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              variant="outlined"
              fullWidth
              label={name2Title.endDate || 'Chọn ngày'}
              value={localState.endDate}
              name="endDate"
              onChange={e => handleInputChange(e, false)}
              checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
              required={localCheckRequired && localCheckRequired.endDate}
              error={localMessages && localMessages.endDate}
              helperText={localMessages && localMessages.endDate}
            />
          </MuiPickersUtilsProvider>
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={12}>
          <CustomInputBase
            label={name2Title.note}
            row={2}
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

AddExperience.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddExperience);
