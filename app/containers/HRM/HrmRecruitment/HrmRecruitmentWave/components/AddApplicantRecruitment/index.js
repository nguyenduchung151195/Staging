/**
 *
 * AddApplicantRecruitment
 *
 */
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigCheckShowForm } from 'utils/common';
import moment from 'moment';
import { Paper, Typography, Swipe, Grid, FileUpload } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, IconButton } from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import CustomAppBar from 'components/CustomAppBar';
import axios from 'axios';
import { API_CANDIDATE, API_PERSONNEL, API_TO_LINK_IDS, API_ADD_CANDIDATE } from 'config/urlConfig';
import { fetchData } from 'helper';
import { API_RECRUITMENT_AGENCY } from '../../../../../../config/urlConfig';
import CustomizedSnackbars from '../../../../../../components/Snackbar';
import './style.css';

/* eslint-disable react/prefer-stateless-function */

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
function validatePhone(phone) {
  const regex = /^\d+$/;
  const data = regex.test(phone);
  return data;
}

function AddApplicantRecruitment(props) {
  const { code, onCreateApplicantRecruitment, onUpdateApplicantRecruitment, onClose, onSave, dataPage, module } = props;
  const [localState, setLocalState] = useState({
    name: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    identityCardNumber: '',
    birthday: null,
    errorEmail: false,
  });
  const [listRecruitment, setListRecruitment] = useState([]);
  const [listKanbanStatus, setListKanbanStatus] = useState(['']);
  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const chanelRecruiment = JSON.parse(localStorage.getItem('hrmSource')).find(item => item.code === 'S31');
  const chanelRecruimentData = chanelRecruiment ? chanelRecruiment.data : [];
  const [isLenghtCmnd, setIsLenghtCmnd] = useState(false);
  const [isLenghtPhone, setIsLenghtPhone] = useState(false);
  const [isEmail, setIsEmail] = useState(true);
  const [errorName, setErrorName] = useState(true);
  const [errorGender, setGender] = useState(true);
  const [errorBirthday, setBirthday] = useState(true);
  const [errorIdentityCardNumber, setIdentityCardNumber] = useState(true);
  const [errorPhoneNumber, setPhoneNumber] = useState(true);
  const [errorEmail, setEmail] = useState(true);
  const [errorAddress, setAddress] = useState(true);

  const handleSave = () => {
    setErrorName(true);
    setGender(true);
    setBirthday(true);
    setIdentityCardNumber(true);
    setPhoneNumber(true);
    setEmail(true);
    setAddress(true);
    if (localState.name === '' || localState.name === undefined) {
      setErrorName(false);
      return;
    }
    if (localState.gender === '' || localState.gender === undefined) {
      setGender(false);
      return;
    }
    if (localState.birthday === null || localState.birthday === undefined) {
      setBirthday(false);
      return;
    }
    if (localState.identityCardNumber === '' || localState.identityCardNumber === undefined) {
      setIdentityCardNumber(false);
      return;
    }
    if (localState.phoneNumber === '' || localState.phoneNumber === undefined) {
      setPhoneNumber(false);
      return;
    }
    if (localState.phoneNumber.length != 10) {
      setPhoneNumber(false);
      return;
    }
    if (localState.email === '' || localState.email === undefined) {
      setEmail(false);
      return;
    }
    if (localState.address === '' || localState.address === undefined) {
      setAddress(false);
      return;
    }
    // if (arrayCheck.includes(localState.code)) {
    //   setErrorCheckCode(false);
    //   return;
    // }
    onSave(localState);
  };

  useEffect(() => {
    // code = HrmCandidate
    setName2Title(viewConfigName2Title(code));
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));

    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const crmStatus = listCrmStatus && listCrmStatus.find(element => String(element.code) === 'ST09');
    if (crmStatus) {
      setListKanbanStatus(crmStatus.data);
    }
    const datas = fetchData(`${API_RECRUITMENT_AGENCY}`, 'GET', null).then(res => {
      if (res.data) setListRecruitment(res.data);
    });
  }, []);

  const isEmailAddress = val => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
  };
  useEffect(
    () => {
      let vali = viewConfigCheckForm(code, localState);

      setLocalMessages({ ...vali, ...localMessages });
      // let cmnd = localState.identityCardNumber.length;
      // let phone = localState.phoneNumber.length;
      // if (cmnd === 12) {
      //   setIsLenghtCmnd(false);
      // } else {
      //   setIsLenghtCmnd(true);
      // }
      // if (phone === 10) {
      //   setIsLenghtPhone(false);
      // } else {
      //   setIsLenghtPhone(true);
      // }

      let email = localState.email;
      if (isEmailAddress(email)) {
        setIsEmail(false);
      } else {
        setIsEmail(true);
      }
    },
    [localState],
  );

  useEffect(() => {
    dataPage.type === 'edit' &&
      fetch(`${API_ADD_CANDIDATE}/${dataPage.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setLocalState(data);
        });
  }, []);

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleAvatarChange = useCallback(
    e => {
      const avtURL = URL.createObjectURL(e.target.files[0]);
      setLocalState({ ...localState, avatar: avtURL });
    },
    [localState],
  );

  useEffect(
    () => {
      let message = { ...localMessages };
      let checkPhoneNumber = true;
      let checkIdentityCardNumber = true;
      if (localState.phoneNumber === '') {
        message = { ...message, phoneNumber: 'Không được để trống số điện thoại' };
      } else if (validatePhone(localState.phoneNumber) === false) {
        message = { ...message, phoneNumber: 'Số điện thoại không đúng định dạng' };
      } else if (localState.phoneNumber.length !== 10) {
        message = { ...message, phoneNumber: 'Số điện thoại phải bao gồm 10 chữ số' };
        checkPhoneNumber = false;
      } else {
        checkPhoneNumber = true;
        delete message.phoneNumber;
      }
      if (localState.identityCardNumber === '') {
        message = { ...message, identityCardNumber: 'Không được để trống số CMND' };
      } else if (validatePhone(localState.identityCardNumber) === false) {
        message = { ...message, identityCardNumber: 'Số CMND không đúng định dạng' };
      } else if (localState.identityCardNumber.length !== 12) {
        message = { ...message, identityCardNumber: 'Số CMND phải bao gồm 12 chữ số' };
        checkIdentityCardNumber = false;
      } else {
        delete message.identityCardNumber;
        checkIdentityCardNumber = true;
      }
      setLocalState({ ...localState, checkPhoneNumber: checkPhoneNumber, checkIdentityCardNumber: checkIdentityCardNumber });
      setLocalMessages({ ...message });
    },
    [localState.phoneNumber, localState.identityCardNumber],
  );

  function handleSwitchCandidate() {
    if (dataPage.typePage !== 'result') {
      try {
        const response = fetch(`${API_TO_LINK_IDS}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recruitmentWaveId: dataPage.recruitmentWaveId,
            roundExamId: dataPage.roundExamId,
            ids: [dataPage.id],
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 1) {
              setLocalState({ ...localState, openSnackbar: true, variant: 'success', message: 'Chuyển ứng viên thành công' });
            } else {
              setLocalState({ ...localState, openSnackbar: true, variant: 'error', message: 'Chuyển ứng viên thất bại' });
            }
          });
      } catch {
        error => {
          throw error;
        };
      }
    } else {
      props.history.push(`/hrm/personnel/${dataPage.id}`);
    }
  }

  function checkBeforeSubmit() {
    if (
      localState.name !== '' &&
      localState.phoneNumber !== '' &&
      localState.email !== '' &&
      localState.gender !== '' &&
      localState.identityCardNumber !== '' &&
      localState.birthday !== null &&
      localState.checkPhoneNumber === true &&
      localState.checkIdentityCardNumber === true
    ) {

      onSave(localState);
    } else {
      setLocalState({
        ...localState,
        openSnackbar: true,
        variant: 'error',
        message: 'Vui lòng nhập đầy đủ và chính xác định dạng các trường bắt buộc',
      });
    }
  }

  const swicthCandidate = (
    <Button variant="outlined" color="inherit" onClick={() => handleSwitchCandidate()} style={{ marginRight: 20 }}>
      {dataPage.typePage !== 'result' ? 'Chuyển ứng viên' : 'Chuyển thành nhân viên'}
    </Button>
  );
  const getLabelNames = name => {
    return viewConfigCheckShowForm(code, name, '', 'title');
  };
  return (
    <>
      <CustomizedSnackbars
        open={localState.openSnackbar}
        onClose={() => setLocalState({ ...localState, openSnackbar: false })}
        variant={localState.variant}
        message={localState.message}
      />
      <CustomAppBar
        title={dataPage.type === 'add' ? 'THÊM MỚI ỨNG VIÊN' : 'CẬP NHẬT ỨNG VIÊN'}
        onGoBack={onClose}
        frontBtn={dataPage.type !== 'add' && swicthCandidate}
        onSubmit={e => {
          checkBeforeSubmit();
        }}
      />
      {/* <KanbanStepper
        listStatus={listKanbanStatus}
        onKabanClick={value => {
          // addPersonnelState.kanbanStatus = value;
          props.mergeData({ kanbanStatus: value });
        }}
        activeStep={addPersonnelState.kanbanStatus}
      /> */}
      <Grid container style={{ padding: '15px 10px 10px 10px ' }}>
        <Grid item md={6}>
          <Grid container spacing={16}>
            {/* <Grid item md={6}>
              <CustomInputBase label="ĐỢT TUYỂN DỤNG" name="" value={localState.n} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="VỊ TRÍ" name="" value={localState.N} />
            </Grid> */}

            <Grid item md={12}>
              <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin ứng viên
                <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
              </Typography>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomForm"
                name="name"
                value={localState.name}
                onChange={handleInputChange}
                error={localState.name == '' ? true : false}
                helperText={localState.name ? '' : 'Họ tên không được để trống'}
                //label={getLabelNames('name') || 'HỌ TÊN'}
                label={name2Title.name}
                checkedShowForm={localCheckShowForm && localCheckShowForm.name}
                required={localCheckRequired && localCheckRequired.name}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomForm"
                select
                name="gender"
                value={localState.gender}
                onChange={handleInputChange}
                error={localState.gender === '' || localState.gender === null ? true : false}
                helperText={localState.gender !== '' && localState.gender !== null ? '' : 'Giới tính không được để trống'}
                //label={getLabelNames('gender') || 'GIỚI TÍNH'}
                label={name2Title.gender}
                checkedShowForm={localCheckShowForm && localCheckShowForm.gender}
                required={localCheckRequired && localCheckRequired.gender}
              >
                <MenuItem value={null}>-- CHỌN GIỚI TÍNH --</MenuItem>
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </CustomInputBase>
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                className="CustomForm"
                name="birthday"
                value={localState.birthday}
                InputLabelProps={{ shrink: true }}
                error={localState.birthday === null ? true : false}
                helperText={localState.birthday === null ? 'Ngày sinh không được để trống' : ''}
                onChange={e => setLocalState({ ...localState, birthday: e })}
                //label={getLabelNames('birthday') || 'NGÀY SINH'}
                label={name2Title.birthday}
                checkedShowForm={localCheckShowForm && localCheckShowForm.birthday}
                required={localCheckRequired && localCheckRequired.birthday}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomForm"
                onKeyDown={blockInvalidChar}
                name="identityCardNumber"
                value={localState.identityCardNumber}
                onChange={handleInputChange}
                inputProps={{ maxLength: 12 }}
                error={localMessages.identityCardNumber}
                helperText={localMessages.identityCardNumber && localMessages.identityCardNumber}
                //label={getLabelNames('identityCardNumber')}
                label={name2Title.identityCardNumber}
                required
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomForm"
                name="phoneNumber"
                value={localState.phoneNumber}
                onChange={handleInputChange}
                error={localMessages.phoneNumber}
                inputProps={{ maxLength: 10 }}
                helperText={localMessages.phoneNumber && localMessages.phoneNumber}
                // label={getLabelNames('phoneNumber')}
                label={name2Title.phoneNumber}
                required
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomForm"
                name="email"
                value={localState.email}
                onChange={handleInputChange}
                error={localState.email == '' ? true : false}
                helperText={localState.email ? '' : 'Email không được để trống'}
                //label={getLabelNames('email')}
                label={name2Title.email}
                checkedShowForm={localCheckShowForm && localCheckShowForm.email}
                required={localCheckRequired && localCheckRequired.email}
              />
            </Grid>
            <Grid item md={12}>
              <CustomInputBase
                className="CustomForm"
                name="address"
                value={localState.address}
                onChange={handleInputChange}
                error={localState.address == '' ? true : false}
                helperText={localState.address ? '' : 'Địa chỉ không được để trống'}
                //label={getLabelNames('address')}
                label={name2Title.address}
                checkedShowForm={localCheckShowForm && localCheckShowForm.address}
                required={localCheckRequired && localCheckRequired.address}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                className="CustomText"
                name="recruitmentChannel"
                value={localState.recruitmentChannel}
                select
                onChange={handleInputChange}
                // label={getLabelNames('recruitmentChannel')}
                label={name2Title.recruitmentChannel || 'KÊNH TUYỂN DỤNG '}
                checkedShowForm={localCheckShowForm && localCheckShowForm.recruitmentChannel}
                required={localCheckRequired && localCheckRequired.recruitmentChannel}
                error={localMessages && localMessages.recruitmentChannel}
                helperText={localMessages && localMessages.recruitmentChannel}
              >
                <MenuItem value={null}>-- CHỌN --</MenuItem>
                {Array.isArray(chanelRecruimentData) && chanelRecruimentData.length > 0
                  ? chanelRecruimentData.map(item => <MenuItem value={item.value}>{item.title}</MenuItem>)
                  : null}
              </CustomInputBase>
            </Grid>
            {localState.recruitmentChannel && (
              <Grid item md={6}>
                <CustomInputBase
                  className="CustomText"
                  name="recruitmentUnit"
                  value={localState.recruitmentUnit}
                  select
                  onChange={handleInputChange}
                  // label={getLabelNames('recruitmentUnit')}
                  label={name2Title.recruitmentUnit || 'TUYỂN DỤNG'}
                  checkedShowForm={localCheckShowForm && localCheckShowForm.recruitmentUnit}
                  required={localCheckRequired && localCheckRequired.recruitmentUnit}
                  error={localMessages && localMessages.recruitmentUnit}
                  helperText={localMessages && localMessages.recruitmentUnit}
                >
                  <MenuItem value={null}>-- CHỌN --</MenuItem>
                  {listRecruitment && listRecruitment.length && listRecruitment.map(item => <MenuItem value={item.name}>{item.name}</MenuItem>)}
                </CustomInputBase>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item md={6} container justify="center" style={{ marginTop: 40 }}>
          <div style={{ display: 'grid', justifyContent: 'center' }}>
            <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
              <Person style={{ fontSize: '20px', marginBottom: '5px' }} /> Chọn ảnh đại diện
            </Typography>
            <Avatar alt="Ảnh đại diện" src={localState.avatar} style={{ marginTop: 20, width: 200, height: 200 }} />
            <input accept="image/*" style={{ display: 'none' }} id="avatarRecruitment" onChange={handleAvatarChange} type="file" />
            <label htmlFor="avatarRecruitment">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                style={
                  { marginLeft: 16, marginTop: 10 } // textAlign: 'center',
                }
              >
                Thêm ảnh đại diện
              </Button>
            </label>
          </div>
        </Grid>

        <Grid container spacing={16}>
          <Grid item md={3}>
            <CustomInputField
              className="CustomText"
              name="certificate"
              value={localState.certificate}
              // label={getLabelNames('certificate')}
              label={name2Title.certificate || 'CHỨNG CHỈ'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.certificate}
              required={localCheckRequired && localCheckRequired.certificate}
              error={localMessages && localMessages.certificate}
              helperText={localMessages && localMessages.certificate}
              select
              type="1"
              configType="hrmSource"
              configCode="S05"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              className="CustomText"
              name="specialize"
              value={localState.specialize}
              select
              type="1"
              configType="hrmSource"
              configCode="S06"
              onChange={handleInputChange}
              // label={getLabelNames('specialize')}
              label={name2Title.specialize || 'CHUYÊN NGÀNH'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.specialize}
              required={localCheckRequired && localCheckRequired.specialize}
              error={localMessages && localMessages.specialize}
              helperText={localMessages && localMessages.specialize}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              className="CustomText"
              name="language1"
              value={localState.language1}
              select
              type="1"
              configType="hrmSource"
              configCode="S09"
              onChange={handleInputChange}
              // label={getLabelNames('language1')}
              label={name2Title['language1.title'] || 'NGOẠI NGỮ'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.language1}
              required={localCheckRequired && localCheckRequired.language1}
              error={localMessages && localMessages.language1}
              helperText={localMessages && localMessages.language1}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              className="CustomText"
              name="informatics"
              value={localState.informatics}
              select
              type="1"
              configType="hrmSource"
              configCode="S08"
              onChange={handleInputChange}
              // label={getLabelNames('informatics')}
              label={name2Title['informatics.title'] || 'Tin học'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.informatics}
              required={localCheckRequired && localCheckRequired.informatics}
              error={localMessages && localMessages.informatics}
              helperText={localMessages && localMessages.informatics}
            />
          </Grid>
          <Grid item md={12}>
            <CustomInputBase
              className="CustomText"
              name="experienceYear"
              value={localState.experienceYear}
              multiline
              rows={5}
              onChange={handleInputChange}
              // label={getLabelNames('experienceYear')}
              label={name2Title.experienceYear || 'NĂM KINH NGHIỆM'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.experienceYear}
              required={localCheckRequired && localCheckRequired.experienceYear}
              error={localMessages && localMessages.experienceYear}
              helperText={localMessages && localMessages.experienceYear}
            />
          </Grid>
          <Grid item md={12}>
            <CustomInputBase
              className="CustomText"
              name="description"
              value={localState.description}
              multiline
              rows={5}
              onChange={handleInputChange}
              // label={getLabelNames('description')}
              label={name2Title.description || 'THÔNG TIN THÊM'}
              checkedShowForm={localCheckShowForm && localCheckShowForm.description}
              required={localCheckRequired && localCheckRequired.description}
              error={localMessages && localMessages.description}
              helperText={localMessages && localMessages.description}
            />
          </Grid>
        </Grid>
      </Grid>

      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Tải file đính kèm - Quản lý file scan
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>

      <Grid item md={12}>
        {/* <FileUpload name={'`${addPersonnelState.name}_${addPersonnelState.code}`'} id="" code="hrm" /> */}
      </Grid>

      {/* <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              if (!localState._id) onCreateApplicantRecruitment(localState);
              else onUpdateApplicantRecruitment(localState);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            HỦY
          </CustomButton>
        </Grid>
      </Grid> */}
    </>
  );
}

AddApplicantRecruitment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddApplicantRecruitment);
