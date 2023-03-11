/**
 *
 * AddCollaborate
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
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
/* eslint-disable react/prefer-stateless-function */
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

function AddCollaborate(props) {
  const { collaborate, onSave, onClose, code, hrmEmployeeId } = props;
  const [localState, setLocalState] = useState({
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
      if (collaborate && collaborate.originItem) {
        setLocalState({ ...collaborate.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [collaborate],
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

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  const handleInputChangeDate = (e, fieldName) => {
    const name = fieldName;
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
  };
  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar title="Thông tin công tác" onGoBack={() => props.onClose && props.onClose()} onSubmit={() => onSave(localState)} />
      <Grid style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
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
          <CustomDatePicker
            label={name2Title.startDate || 'Ngày bắt đầu'}
            value={localState.startDate}
            name="startDate"
            onChange={e => handleInputChangeDate(e, 'startDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
            required={localCheckRequired && localCheckRequired.startDate}
            error={localMessages && localMessages.startDate}
            helperText={localMessages && localMessages.startDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.endDate || 'Ngày kết thúc'}
            value={localState.endDate}
            name="endDate"
            onChange={e => handleInputChangeDate(e, 'endDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
            required={localCheckRequired && localCheckRequired.endDate}
            error={localMessages && localMessages.endDate}
            helperText={localMessages && localMessages.endDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.address}
            value={localState.address}
            name="address"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.address}
            required={localCheckRequired && localCheckRequired.address}
            error={localMessages && localMessages.address}
            helperText={localMessages && localMessages.address}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.position || 'position'}
            value={localState.position}
            name="position"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm['position.title']}
            required={localCheckRequired && localCheckRequired['position.title']}
            error={localMessages && localMessages['position.title']}
            helperText={localMessages && localMessages['position.title']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.positionSpeci}
            value={localState.positionSpeci}
            name="positionSpeci"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.positionSpeci}
            required={localCheckRequired && localCheckRequired.positionSpeci}
            error={localMessages && localMessages.positionSpeci}
            helperText={localMessages && localMessages.positionSpeci}
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
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin công tác
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.costs}
            value={localState.costs}
            type="number"
            name="costs"
            onKeyDown={blockInvalidChar}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.costs}
            required={localCheckRequired && localCheckRequired.costs}
            error={localMessages && localMessages.costs}
            helperText={localMessages && localMessages.costs}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddCollaborate.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddCollaborate);
