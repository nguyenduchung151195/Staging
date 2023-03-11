/**
 *
 * AddPraise
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
function AddPraise(props) {
  const { praise, onSave, onClose, code, hrmEmployeeId, miniActive } = props;
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
      if (praise && praise.originItem) {
        setLocalState({ ...praise.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [praise],
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
  const handleInputChangeDate = (e, fieldName) => {
    const name = fieldName;
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
  };
  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  return (
    <div style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', padding: 20 }}>
      <CustomAppBar title="Thông tin khen thưởng con" onGoBack={() => props.onClose && props.onClose()} onSubmit={() => onSave(localState)} />
      <Grid style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.nameChild || 'Tên khen thưởng'}
            value={localState.nameChild}
            name="nameChild"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.nameChild}
            required={localCheckRequired && localCheckRequired.nameChild}
            error={localMessages && localMessages.nameChild}
            helperText={localMessages && localMessages.nameChild}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.bonusDate || 'Ngày thưởng'}
            value={localState.bonusDate}
            name="bonusDate"
            onChange={e => handleInputChangeDate(e, 'bonusDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bonusDate}
            required={localCheckRequired && localCheckRequired.bonusDate}
            error={localMessages && localMessages.bonusDate}
            helperText={localMessages && localMessages.bonusDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.agency}
            value={localState.agency}
            name="agency"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.agency}
            required={localCheckRequired && localCheckRequired.agency}
            error={localMessages && localMessages.agency}
            helperText={localMessages && localMessages.agency}
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
      </Grid>
      <CustomGroupInputField code columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddPraise.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddPraise);
