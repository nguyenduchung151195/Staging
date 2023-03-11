/**
 *
 * AddRelation
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Checkbox } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';
import { createStructuredSelector } from 'reselect';
import { changeSnackbar } from '../../../../../../../Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';

const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

function AddRelation(props) {
  const { relation, onSave, onClose, code, hrmEmployeeId, miniActive } = props;
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
      if (relation && relation.originItem) {
        setLocalState({ ...relation.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [relation],
  );
  const validationBookRegistration = value => {
    const isNumeric = /^[0-9]+$/;
    return !isNumeric.test(value);
  };
  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      if (localState.bookRegistration === undefined || localState.bookRegistration === '')
        messages = { ...messages, bookRegistration: 'Trường số đăng ký là trường bắt buộc nhập' };
      else if (validationBookRegistration(localState.bookRegistration))
        messages = { ...messages, bookRegistration: 'Trường số đăng ký chỉ cho phép nhập số' };

      if (localState.bookNumber === undefined || localState.bookNumber === '')
        messages = { ...messages, bookNumber: 'Trường số sổ là trường bắt buộc nhập' };
      else if (validationBookRegistration(localState.bookNumber)) messages = { ...messages, bookNumber: 'Trường số sổ chỉ cho phép nhập số' };

      if (localState.codeSocialInsurance === undefined || localState.codeSocialInsurance === '')
        messages = { ...messages, codeSocialInsurance: 'Trường Mã BHXH là trường bắt buộc nhập' };
      else if (validationBookRegistration(localState.codeSocialInsurance))
        messages = { ...messages, codeSocialInsurance: 'Trường Mã BHXH chỉ cho phép nhập số' };

      setLocalMessages({ ...messages });
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = e => {
    // const name = 'birthDay';
    // const value = moment(e).format('YYYY-MM-DD');
    // setLocalState({ ...localState, [name]: value });
    // setLocalState({ ...localState, [e.target.name]: e.target.value });
    if (e.target.name === 'birthDay') setLocalState({ ...localState, [e.target.name]: moment(e).format('YYYY-MM-DD') });
    else setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handleCheckbox = (name, value) => {
    setLocalState(state => ({ ...state, [name]: value }));
  };
  const saveData = () => {
    if (Object.keys(localMessages).length > 0)
      return props.onChangeSnackbar({ status: true, message: 'Bạn chưa nhập đủ thông tin!', variant: 'error' });
    onSave(localState);
  };
  return (
    <div style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', padding: 20 }}>
      <CustomAppBar
        title="Thông tin quan hệ"
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => saveData()}
      />
      <Grid container style={{ marginTop: 60 }} />
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <CustomInputBase
            label={name2Title.relationship}
            value={localState.relationship}
            name="relationship"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.relationship}
            required={localCheckRequired && localCheckRequired.relationship}
            error={localMessages && localMessages.relationship}
            helperText={localMessages && localMessages.relationship}
          />
          <Typography>
            Đã mất
            <Checkbox color="primary" checked={localState.dead ? localState.dead : false} onChange={e => handleCheckbox('dead', e.target.checked)} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase
            label={name2Title.fullName}
            value={localState.fullName}
            name="fullName"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.fullName}
            required={localCheckRequired && localCheckRequired.fullName}
            error={localMessages && localMessages.fullName}
            helperText={localMessages && localMessages.fullName}
          />
          <Typography>
            Đã liên lạc khẩn cấp
            <Checkbox
              color="primary"
              checked={localState.emergencyContact ? localState.emergencyContact : false}
              onChange={e => handleCheckbox('emergencyContact', e.target.checked)}
            />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.identificationNumber}
            value={localState.identificationNumber}
            name="identificationNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.identificationNumber}
            required={localCheckRequired && localCheckRequired.identificationNumber}
            error={localMessages && localMessages.identificationNumber}
            helperText={localMessages && localMessages.identificationNumber}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.birthDay || 'Chọn ngày'}
            value={localState.birthDay}
            name="birthDay"
            onChange={e => handleInputChange(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.birthDay}
            required={localCheckRequired && localCheckRequired.birthDay}
            error={localMessages && localMessages.birthDay}
            helperText={localMessages && localMessages.birthDay}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.phoneNumber}
            value={localState.phoneNumber}
            name="phoneNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.phoneNumber}
            required={localCheckRequired && localCheckRequired.phoneNumber}
            error={localMessages && localMessages.phoneNumber}
            helperText={localMessages && localMessages.phoneNumber}
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
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin quan hệ nhân thân/Kê khai thuế
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.relaHousehold}
            value={localState.relaHousehold}
            name="relaHousehold"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.relaHousehold}
            required={localCheckRequired && localCheckRequired.relaHousehold}
            error={localMessages && localMessages.relaHousehold}
            helperText={localMessages && localMessages.relaHousehold}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.papersType}
            value={localState.papersType}
            name="papersType"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.papersType}
            required={localCheckRequired && localCheckRequired.papersType}
            error={localMessages && localMessages.papersType}
            helperText={localMessages && localMessages.papersType}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.taxCode}
            value={localState.taxCode}
            name="taxCode"
            type="number"
            onKeyDown={blockInvalidChar}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.taxCode}
            required={localCheckRequired && localCheckRequired.taxCode}
            error={localMessages && localMessages.taxCode}
            helperText={localMessages && localMessages.taxCode}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.job}
            value={localState.job}
            name="job"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.job}
            required={localCheckRequired && localCheckRequired.job}
            error={localMessages && localMessages.job}
            helperText={localMessages && localMessages.job}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.nationality}
            value={localState.nationality}
            name="nationality"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.nationality}
            required={localCheckRequired && localCheckRequired.nationality}
            error={localMessages && localMessages.nationality}
            helperText={localMessages && localMessages.nationality}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.birthCertificate}
            value={localState.birthCertificate}
            name="birthCertificate"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.birthCertificate}
            required={localCheckRequired && localCheckRequired.birthCertificate}
            error={localMessages && localMessages.birthCertificate}
            helperText={localMessages && localMessages.birthCertificate}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.addressRegistration}
            value={localState.addressRegistration}
            name="addressRegistration"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.addressRegistration}
            required={localCheckRequired && localCheckRequired.addressRegistration}
            error={localMessages && localMessages.addressRegistration}
            helperText={localMessages && localMessages.addressRegistration}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.bookRegistration}
            value={localState.bookRegistration}
            name="bookRegistration"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bookRegistration}
            required={localCheckRequired && localCheckRequired.bookRegistration}
            error={localMessages && localMessages.bookRegistration}
            helperText={localMessages && localMessages.bookRegistration}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.bookNumber}
            value={localState.bookNumber}
            name="bookNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bookNumber}
            required={localCheckRequired && localCheckRequired.bookNumber}
            error={localMessages && localMessages.bookNumber}
            helperText={localMessages && localMessages.bookNumber}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.bookSocialInsurance}
            value={localState.bookSocialInsurance}
            name="bookSocialInsurance"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bookSocialInsurance}
            required={localCheckRequired && localCheckRequired.bookSocialInsurance}
            error={localMessages && localMessages.bookSocialInsurance}
            helperText={localMessages && localMessages.bookSocialInsurance}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.codeSocialInsurance}
            value={localState.codeSocialInsurance}
            name="codeSocialInsurance"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.codeSocialInsurance}
            required={localCheckRequired && localCheckRequired.codeSocialInsurance}
            error={localMessages && localMessages.codeSocialInsurance}
            helperText={localMessages && localMessages.codeSocialInsurance}
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
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Giảm trừ gia cảnh/nuôi con nhỏ
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            Thuộc diện giảm trừ gia cảnh
            <Checkbox
              color="primary"
              checked={localState.familyCircumstances ? localState.familyCircumstances : false}
              onChange={e => handleCheckbox('familyCircumstances', e.target.checked)}
            />
          </Typography>
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddRelation.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
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
)(AddRelation);
