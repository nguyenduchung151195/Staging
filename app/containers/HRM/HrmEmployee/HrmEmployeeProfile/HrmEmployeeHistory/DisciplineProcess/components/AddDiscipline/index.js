/**
 *
 * DisciplineProcess
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
import moment from 'moment';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import { changeSnackbar } from '../../../../../../../Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

/* eslint-disable react/prefer-stateless-function */
function DisciplineProcess(props) {
  const { discipline, onSave, onClose, code, hrmEmployeeId } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    console.log(code);
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
      if (discipline && discipline.originItem) {
        setLocalState({ ...discipline.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [discipline],
  );

  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      if (localState.decisionNumber === undefined || localState.decisionNumber === '')
        messages = { ...messages, decisionNumber: 'Trường số quyết định là trường bắt buộc nhập' };
      setLocalMessages({ ...messages });
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = e => {
    // const name = 'decisionDate';
    // const value = moment(e).format('YYYY-MM-DD');
    // setLocalState({ ...localState, [name]: value });
    // setLocalState({ ...localState, [e.target.name]: e.target.value });
    if (e.target.name === 'decisionDate') setLocalState({ ...localState, [e.target.name]: moment(e).format('YYYY-MM-DD') });
    else setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const saveData = () => {
    if (Object.keys(localMessages).length > 0)
      return props.onChangeSnackbar({ status: true, message: 'Bạn chưa nhập đủ thông tin!', variant: 'error' });
    onSave(localState);
  };
  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar
        title=" Thông tin kỷ luật"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={() => onSave(localState)}
        onSubmit={() => saveData()}
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
          />
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
            label={name2Title.disciplineLevel}
            value={localState.disciplineLevel}
            name="disciplineLevel"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.disciplineLevel}
            required={localCheckRequired && localCheckRequired.disciplineLevel}
            error={localMessages && localMessages.disciplineLevel}
            helperText={localMessages && localMessages.disciplineLevel}
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
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

DisciplineProcess.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

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

// const withReducer = injectReducer({ key: 'DisciplineProcess', reducer });
// const withSaga = injectSaga({ key: 'DisciplineProcess', saga });

export default compose(
  memo,
  withConnect,
)(DisciplineProcess);
