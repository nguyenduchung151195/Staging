/**
 *
 * AddSabbatical
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import { Grid, FileUpload } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

function AddSabbatical(props) {
  const { sabbatical, onSave, onClose, code, fileName, hrmEmployeeId, miniActive } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

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
      if (sabbatical && sabbatical.originItem) {
        setLocalState({ ...sabbatical.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [sabbatical],
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
    const name = 'foundedDate';
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleInpuDate = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
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
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  return (
    <div style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', padding: 20 }}>
      <CustomAppBar
        title="Thông tin nghỉ phép"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => onSave(localState)}
      />
      <Grid container style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            name="decisionNumber"
            type="number"
            onChange={e => handleInputChange(e, 'decisionNumber')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
            onKeyDown={blockInvalidChar}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.foundedDate || 'Ngày lập'}
            value={localState.foundedDate || ''}
            name="foundedDate"
            onChange={e => handleInputChange(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.foundedDate}
            required={localCheckRequired && localCheckRequired.foundedDate}
            error={localMessages && localMessages.foundedDate}
            helperText={localMessages && localMessages.foundedDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.reason}
            value={localState.reason}
            name="reason"
            onChange={e => handleInputChange(e, 'reason')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.reason}
            required={localCheckRequired && localCheckRequired.reason}
            error={localMessages && localMessages.reason}
            helperText={localMessages && localMessages.reason}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.startDate || 'Từ ngày'}
            value={localState.startDate || ''}
            name="startDate"
            onChange={e => handleInpuDate(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
            required={localCheckRequired && localCheckRequired.startDate}
            error={localMessages && localMessages.startDate}
            helperText={localMessages && localMessages.startDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.endDate || 'Đến ngày'}
            value={localState.endDate || ''}
            name="endDate"
            onChange={e => handleInpuDate(e, false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
            required={localCheckRequired && localCheckRequired.endDate}
            error={localMessages && localMessages.endDate}
            helperText={localMessages && localMessages.endDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.totalDate}
            value={localState.totalDate}
            name="totalDate"
            onChange={e => handleInputChange(e, 'totalDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.totalDate}
            required={localCheckRequired && localCheckRequired.totalDate}
            error={localMessages && localMessages.totalDate}
            helperText={localMessages && localMessages.totalDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.bonusDate}
            value={localState.bonusDate}
            name="bonusDate"
            onChange={e => handleInputChange(e, 'bonusDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bonusDate}
            required={localCheckRequired && localCheckRequired.bonusDate}
            error={localMessages && localMessages.bonusDate}
            helperText={localMessages && localMessages.bonusDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.explain}
            value={localState.explain}
            name="explain"
            onChange={e => handleInputChange(e, 'explain')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.explain}
            required={localCheckRequired && localCheckRequired.explain}
            error={localMessages && localMessages.explain}
            helperText={localMessages && localMessages.explain}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.note}
            value={localState.note}
            name="note"
            onChange={e => handleInputChange(e, 'note')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.note}
            required={localCheckRequired && localCheckRequired.note}
            error={localMessages && localMessages.note}
            helperText={localMessages && localMessages.note}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.address}
            value={localState.address}
            name="address"
            onChange={e => handleInputChange(e, 'address')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.address}
            required={localCheckRequired && localCheckRequired.address}
            error={localMessages && localMessages.address}
            helperText={localMessages && localMessages.address}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase type="file" label={name2Title.file} value={localState.file} name="file" onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.file}
            required={localCheckRequired && localCheckRequired.file}
            error={localMessages && localMessages.file}
            helperText={localMessages && localMessages.file}
          />
        </Grid> */}

        <Grid item xs={12}>
          {sabbatical && <FileUpload name={`${fileName}/Đơn nghỉ phép ngày ${name2Title.foundedDate}`} id={sabbatical._id} code={'hrm'} />}
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddSabbatical.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddSabbatical);
