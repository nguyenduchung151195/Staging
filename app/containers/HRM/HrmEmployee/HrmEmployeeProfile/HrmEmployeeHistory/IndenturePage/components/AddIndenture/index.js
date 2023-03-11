/**
 *
 * AddIndenture
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography, FileUpload } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired, viewConfigType } from 'utils/common';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';
import moment from 'moment';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */

function AddIndenture(props) {
  const { indenture, onSave, onClose, code, hrmEmployeeId, folderName, profile, miniActive } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [typeInput, setTypeInput] = useState({});
  const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    const newType = viewConfigType(code);
    setTypeInput(newType);
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
      if (indenture && indenture.originItem) {
        setLocalState({ ...indenture.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [indenture],
  );
  const validateNotNumber = value => {
    const regex = /[^0-9]/u;
    const data = regex.test(value);
    return data;
  };
  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      // if (localState.level && validateNotNumber(localState.level)) messages = { ...messages, level: 'Không nhập số âm và các ký tự' };
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = e => {
    // const name = isStartDate ? 'startDate' : 'endDate';
    // const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // // setTime({ ...time, [name]: value });
    // const newFilter = { ...localState, [name]: value };

    // // TT
    // if (!newFilter.startDate && newFilter.endDate) {
    //   setErrorStartDateEndDate(true);
    //   setErrorTextStartDate('nhập thiếu: "Từ ngày"');
    //   setErrorTextEndDate('');
    // } else if (newFilter.startDate && !newFilter.endDate) {
    //   setErrorStartDateEndDate(true);
    //   setErrorTextStartDate('');
    //   setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    // } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
    //   setErrorStartDateEndDate(true);
    //   setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
    //   setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    // } else {
    //   setErrorStartDateEndDate(false);
    //   setErrorTextStartDate('');
    //   setErrorTextEndDate('');
    // }
    // setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  // const handeChangeDepartment = useCallback(
  //   result => {
  //     const { department } = result;
  //     setLocalState(state => ({ ...state, organizationUnit: department }));
  //   },
  //   [localState],
  // );
  const handeChangeDepartment = data => {
    const { department } = data;
    setLocalState({ ...localState, organizationUnit: department });
  };

  const handleInputSignDate = e => {
    // const name = 'signDate';
    // const value = moment(e).format('YYYY-MM-DD');
    // setLocalState({ ...localState, [name]: value });
  };

  return (
    <div style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', padding: 20 }}>
      <CustomAppBar
        title={indenture === null ? 'Thêm mới Thông tin tiến độ hợp đồng' : 'Cập nhật Thông tin tiến độ hợp đồng'}
        onGoBack={() => props.onClose && props.onClose()}
        // onSubmit={this.onSubmit}
        onSubmit={() => onSave(localState)}
      />
      <Grid container style={{ marginTop: 60 }}>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.contractNumber}
              label={name2Title && name2Title.contractNumber}
              value={localState && localState.contractNumber}
              name="contractNumber"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.contractNumber}
              required={localCheckRequired && localCheckRequired.contractNumber}
              error={localMessages && localMessages.contractNumber}
              helperText={localMessages && localMessages.contractNumber}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.fileSend}
              label={name2Title && name2Title.fileSend}
              value={localState && localState.fileSend}
              name="fileSend"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.fileSend}
              required={localCheckRequired && localCheckRequired.fileSend}
              error={localMessages && localMessages.fileSend}
              helperText={localMessages && localMessages.fileSend}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.fileUpload}
              label={name2Title && name2Title.fileUpload}
              value={localState && localState.fileUpload}
              name="fileUpload"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.fileUpload}
              required={localCheckRequired && localCheckRequired.fileUpload}
              error={localMessages && localMessages.fileUpload}
              helperText={localMessages && localMessages.fileUpload}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.advantages}
              label={name2Title && name2Title.advantages}
              value={localState && localState.advantages}
              name="advantages"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.advantages}
              required={localCheckRequired && localCheckRequired.advantages}
              error={localMessages && localMessages.advantages}
              helperText={localMessages && localMessages.advantages}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.defect}
              label={name2Title && name2Title.defect}
              value={localState && localState.defect}
              name="defect"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.defect}
              required={localCheckRequired && localCheckRequired.defect}
              error={localMessages && localMessages.defect}
              helperText={localMessages && localMessages.defect}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type={typeInput && typeInput.conclude}
              label={name2Title && name2Title.conclude}
              value={localState && localState.conclude}
              name="conclude"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.conclude}
              required={localCheckRequired && localCheckRequired.conclude}
              error={localMessages && localMessages.conclude}
              helperText={localMessages && localMessages.conclude}
            />
          </Grid>

          <Grid item xs={4}>
            {/* <CustomInputBase select label={name2Title.contractType} value={localState.contractType} name="contractType" onChange={handleInputChange} /> */}
            <CustomInputField
              value={localState.contractType}
              onChange={handleInputChange}
              name="contractType"
              label={name2Title.contractType || 'Thể loại hợp đồng'}
              type={typeInput && typeInput.contractType}
              configType="hrmSource"
              configCode="S03"
              checkedShowForm={localCheckShowForm && localCheckShowForm.contractType}
              required={localCheckRequired && localCheckRequired.contractType}
              error={localMessages && localMessages.contractType}
              helperText={localMessages && localMessages.contractType}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              label={name2Title.signDate || 'Chọn ngày'}
              value={localState.signDate}
              name="signDate"
              onChange={e => setLocalState({ ...localState, signDate: e })}
              checkedShowForm={localCheckShowForm && localCheckShowForm.signDate}
              required={localCheckRequired && localCheckRequired.signDate}
              error={localMessages && localMessages.signDate}
              helperText={localMessages && localMessages.signDate}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title['signer.signerId']}
              value={localState.signerId}
              type={typeInput && typeInput['signer.signerId']}
              name="signerId"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm['signer.signerId']}
              required={localCheckRequired && localCheckRequired['signer.signerId']}
              error={localMessages && localMessages['signer.signerId']}
              helperText={localMessages && localMessages['signer.signerId']}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title['signer.title']}
              value={localState.signer}
              type={typeInput && typeInput['signer.title']}
              name="signer"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm['signer.title']}
              required={localCheckRequired && localCheckRequired['signer.title']}
              error={localMessages && localMessages['signer.title']}
              helperText={localMessages && localMessages['signer.title']}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              label={name2Title.startDate || 'Chọn ngày'}
              value={localState.startDate}
              name="startDate"
              onChange={e => setLocalState({ ...localState, startDate: e })}
              checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
              required={localCheckRequired && localCheckRequired.startDate}
              error={localMessages && localMessages.startDate}
              helperText={localMessages && localMessages.startDate}
            />
            {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
          </Grid>
          <Grid item xs={4}>
            <CustomDatePicker
              label={name2Title.endDate || 'Chọn ngày'}
              value={localState.endDate}
              name="endDate"
              onChange={e => setLocalState({ ...localState, endDate: e })}
              checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
              required={localCheckRequired && localCheckRequired.endDate}
              error={localMessages && localMessages.endDate}
              helperText={localMessages && localMessages.endDate}
            />
            {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
          </Grid>
          <Grid item xs={4}>
            <Department
              onChange={handeChangeDepartment}
              department={localState.organizationUnit}
              disableEmployee
              profile={profile}
              moduleCode="hrm"
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
              type="number"
              label={name2Title.level}
              value={localState.level}
              name="level"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.level}
              required={localCheckRequired && localCheckRequired.level}
              error={localMessages && localMessages.level}
              helperText={localMessages && localMessages.level}
              onKeyDown={blockInvalidChar}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.ratio}
              value={localState.ratio}
              name="ratio"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.ratio}
              required={localCheckRequired && localCheckRequired.ratio}
              error={localMessages && localMessages.ratio}
              helperText={localMessages && localMessages.ratio}
              onKeyDown={blockInvalidChar}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.title}
              value={localState.title}
              name="title"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.title}
              required={localCheckRequired && localCheckRequired.title}
              error={localMessages && localMessages.title}
              helperText={localMessages && localMessages.title}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.salary}
              value={localState.salary}
              name="salary"
              onKeyDown={blockInvalidChar}
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.salary}
              required={localCheckRequired && localCheckRequired.salary}
              error={localMessages && localMessages.salary}
              helperText={localMessages && localMessages.salary}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.allowance}
              type="number"
              onKeyDown={blockInvalidChar}
              value={localState.allowance}
              name="allowance"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.allowance}
              required={localCheckRequired && localCheckRequired.allowance}
              error={localMessages && localMessages.allowance}
              helperText={localMessages && localMessages.allowance}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.locationWork}
              value={localState.locationWork}
              name="locationWork"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.locationWork}
              required={localCheckRequired && localCheckRequired.locationWork}
              error={localMessages && localMessages.locationWork}
              helperText={localMessages && localMessages.locationWork}
            />
          </Grid>

          {/* <Grid item xs={4}>
          <CustomInputBase type="file" label={name2Title.fileUpload} value={localState.fileUpload} name="fileUpload" onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.fileUpload}
            required={localCheckRequired && localCheckRequired.fileUpload}
            error={localMessages && localMessages.fileUpload}
            helperText={localMessages && localMessages.fileUpload} />
        </Grid> */}

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
            {indenture && <FileUpload name={`${folderName}/${name2Title.title}`} id={indenture._id} code={'hrm'} nameFile="Hợp đồng" />}
          </Grid>
        </Grid>
        <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      </Grid>
    </div>
  );
}

AddIndenture.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddIndenture);
