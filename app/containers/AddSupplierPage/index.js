/**
 *
 * AddSupplierPage
 *
 */

import React from 'react';
import TodayIcon from '@material-ui/icons/Today';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { fetchData } from '../../helper';
import { API_SUPPLIERS } from 'config/urlConfig';
import { API_CHECK_DUPLICATE_DATA } from '../../config/urlConfig';

import {
  Typography,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Button,
  Tabs,
  Tab,
  OutlinedInput,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import SwipeableViews from 'react-swipeable-views';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Edit, Person, Close } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { TextField, TextValidator, FileUpload } from 'components/LifetekUi';
import makeSelectAddSupplierPage from './selectors';
import Attribute from '../../components/Attribute';
import reducer from './reducer';
import saga from './saga';
import avatarDefault from '../../images/default-avatar.png';
import { postSupplier, putSupplier, getSupplier, changeValue, changeImage, setDefaultState, getData, mergeData } from './actions';
import TextFieldCode from '../../components/TextFieldCode';
import messages from './messages';
import dot from 'dot-object';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { changeSnackbar } from '../Dashboard/actions';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import './style.css';
import { checkValidEmail, checkValidWebsite, checkValidStringSpecial, checkPhoneNumber } from '../../utils/functions';
import _ from 'lodash';

function TabContainer({ children, dir }) {
  return (
    <GridUI item md={12} sm={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </GridUI>
  );
}
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
const blockNumberStringSpecial = e =>
  [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '-',
    '@',
    '$',
    '#',
    '+',
    '!',
    '.',
    '~',
    '*',
    '%',
    '^',
    '?',
    '>',
    '<',
    '|',
    '\\',
    ':',
    '&',
    "'",
    '(',
    ')',
    ';',
    '"',
    '{',
    '}',
    '[',
    ']',
    '=',
    ',',
    '/',
  ].includes(e.key) && e.preventDefault();
const blockNumber = e => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key) && e.preventDefault();
const blockStringSpecial = e =>
  [
    '-',
    '@',
    '$',
    '#',
    '+',
    '!',
    '.',
    '~',
    '*',
    '%',
    '^',
    '?',
    '>',
    '<',
    '|',
    '\\',
    ':',
    '&',
    "'",
    '(',
    ')',
    ';',
    '"',
    '{',
    '}',
    '[',
    ']',
    '=',
    ',',
    '/',
  ].includes(e.key) && e.preventDefault();
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const crmSource = JSON.parse(localStorage.getItem('crmSource'));

// Validate max date
const d = new Date();
const currentMonth = (d.getMonth() + 1).toString();
const currentDay = d.getDate().toString();
const month = currentMonth.length === 1 ? `0${currentMonth}` : currentMonth;
const day = currentDay.length === 1 ? `0${currentDay}` : currentDay;
const year = d.getFullYear();
const max = `${year}-${month}-${day}`;

class AddSupplierPage extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = 'Supplier';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      tab: 0,

      // dữ liệu hiển thị
      // columns: [
      //   { name: 'order', title: 'STT', checked: true, type: 'order' },
      //   { name: 'name', title: 'Họ tên', checked: true },
      //   { name: 'phone', title: 'SĐT', checked: true, type: 'number' },
      //   { name: 'email', title: 'Email', checked: true },
      //   { name: 'department', title: 'Phòng ban', checked: true, type: 'number' },
      //   { name: 'note', title: 'Ghi chú', checked: true },
      // ],
      supplierColumns: JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Supplier').listDisplay.type.fields.type.columns,
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
    };
  }

  getMessages(props) {
    // const props = this.props.addSupplierPage;
    //console.log(this.props.addSupplierPage);
    const attributes = {};
    if (props.listAtt.length !== 0) {
      Object.keys(props.listAtt).forEach(item => {
        attributes[item] = this.props.addSupplierPage[item];
      });
    }

    const data = {
      name: props.name,
      code: props.supplierCode,
      email: props.email,
      website: props.website,
      phone: props.phone,
      adress: props.address,
      bankAccountNumber: props.bankAccountNumber,
      taxCode: props.taxCode,
      createdAtSupplier: props.createdAtSupplier,
      charterCapital: props.charterCapital,
      businessRegistrationNumber: props.businessRegistrationNumber,
      dateRange: props.dateRange,
      note: props.note,
      logo: props.logo,
      logoURL: props.logoURL,
      representativeName: props.representativeName,
      representativePhone: props.representativePhone,
      representativeGender: props.representativeGender,
      representativeBirthDate: props.representativeBirthDate,
      representativeEmail: props.representativeEmail,
      representativeNote: props.representativeNote,
      representativePosition: props.representativePosition,
      setAttribute: attributes,
      clueInformation: props.clueInformation,
      classifySupplier: {
        location: props.location,
        companyType: props.companyType,
        job: props.job,
        unit: props.unit,
      },
      rows: props.rows,
    };
    const messages = viewConfigCheckForm(this.state.moduleCode, dot.dot(data));
    this.setState({
      localMessages: messages,
    });
  }

  componentDidMount() {
    this.props.getData();
    const id = this.props.match.params.id;
    if (id !== 'add') this.props.getSupplier(id);
    else this.props.setDefaultState();
  }

  componentWillReceiveProps(props) {
    if (props.addSupplierPage.defaultState) {
      this.getMessages(props.addSupplierPage);
    } else {
      this.getMessages(this.props.addSupplierPage);
    }
  }

  handleChangeTab = (e, value) => this.setState({ tab: value });

  handleChangeIndex = index => this.setState({ tab: index });

  onSave = () => {
    const props = this.props.addSupplierPage;
    const attributes = {};
    Object.keys(props.listAtt).forEach(item => {
      if (this.props.addSupplierPage[item].length) attributes[item] = this.props.addSupplierPage[item];
    });
    const data = {
      name: props.name,
      code: props.supplierCode,
      email: props.email,
      website: props.website,
      phone: props.phone,
      adress: props.address,
      bankAccountNumber: props.bankAccountNumber,
      taxCode: props.taxCode,
      createdAtSupplier: props.createdAtSupplier,
      charterCapital: props.charterCapital,
      businessRegistrationNumber: props.businessRegistrationNumber,
      dateRange: props.dateRange,
      note: props.note,
      logo: props.logo,
      logoURL: props.logoURL,
      representativeName: props.representativeName,
      representativePhone: props.representativePhone,
      representativeGender: props.representativeGender,
      representativeBirthDate: props.representativeBirthDate,
      representativeEmail: props.representativeEmail,
      representativeNote: props.representativeNote,
      representativePosition: props.representativePosition,
      setAttribute: attributes,
      clueInformation: props.clueInformation,
      classifySupplier: {
        location: props.location,
        companyType: props.companyType,
        job: props.job,
        unit: props.unit,
      },
      rows: props.rows,
    };

    const { localMessages } = this.state;
    if (localMessages && Object.keys(localMessages).length === 0) {
      const id = this.props.match.params.id;
      if (id === 'add') this.props.postSupplier(data);
      else this.props.putSupplier(id, data);
    } else {
      const id = this.props.match.params.id;
      if (id === 'add') {
        this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
      } else {
        this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' });
      }
    }
  };

  handleOnSave = () => {
    const props = this.props.addSupplierPage;
    const { erorrMessages, messagesE } = this.state;
    const id = this.props.match.params.id;

    let body = {
      name: props.name,
      code: props.supplierCode,
      email: props.email,
      website: props.website,
      phone: props.phone,
      adress: props.address,
      bankAccountNumber: props.bankAccountNumber,
      taxCode: props.taxCode,
      createdAtSupplier: props.createdAtSupplier,
      charterCapital: props.charterCapital,
      businessRegistrationNumber: props.businessRegistrationNumber,
      dateRange: props.dateRange,
      note: props.note,
      logo: props.logo,
      logoURL: props.logoURL,
      representativeName: props.representativeName,
      representativePhone: props.representativePhone,
      representativeGender: props.representativeGender,
      representativeBirthDate: props.representativeBirthDate,
      representativeEmail: props.representativeEmail,
      representativeNote: props.representativeNote,
      representativePosition: props.representativePosition,
      setAttribute: props.attributes,
      clueInformation: props.clueInformation,
      classifySupplier: {
        location: props.location,
        companyType: props.companyType,
        job: props.job,
        unit: props.unit,
      },
      rows: props.rows,
    };
    if (id && id !== "add") {
      body = {
        ...body,
        id: id
      }
    }
    fetch(`${API_SUPPLIERS}/check-duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 0) {
          this.props.onChangeSnackbar({ status: true, message: data.message, variant: 'error' });
        } else {
          this.onSave();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    // if (erorrMessages === true) {
    //   console.log('messagesE', messagesE);
    //   this.props.onChangeSnackbar({ status: true, message: messagesE, variant: 'error' });
    // } else {
    //   this.onSave();
    // }
  };
  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.props.changeImage({ logoURL: urlAvt, logo: e.target.files[0] });
  };

  handleChange = name => e => {
    this.props.mergeData({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeSupper = (e, isDate, fieldName) => {
    const name = isDate ? 'dateRange' : 'representativeBirthDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.props.mergeData({ [name]: value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, fieldName, value);
    this.setState({
      [name]: value,
      localMessages: messages,
    });
  };
  handleChangeSupplier = (e, isDate, fieldName) => {
    const name = 'createdAtSupplier';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.props.mergeData({ [name]: value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, fieldName, value);
    this.setState({
      [name]: value,
      localMessages: messages,
    });
  };
  changeBank = e => {
    if (e.target.value < 0) return;
    this.props.mergeData({ bankAccountNumber: e.target.value });
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  render() {
    const names = {};
    this.state.supplierColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const props = this.props;
    const id = this.props.match.params.id;
    const { intl } = this.props;
    const { localMessages, checkRequired, checkShowForm } = this.state;
    return (
      <div style={{ width: props.miniActive ? window.innerWidth - 110 : window.innerWidth - 285 }}>
        <Helmet>
          <title>
            {id === 'add'
              ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
              : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
          </title>
          <meta name="description" content="Description of addSupplierPage" />
        </Helmet>
        {/* <Paper style={{ marginBottom: '20px' }}>
          <Breadcrumbs style={{ padding: 10 }} aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/ConfigCRM">
              CRM
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/Supplier">
              {intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}
            </Link>
            <Typography color="textPrimary">
              {id === 'add'
                ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
                : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
            </Typography>
          </Breadcrumbs>
        </Paper> */}
        {/* <ValidatorForm onSubmit={this.onSave}> */}
        {/* <AppBar className='HearderappBarSupplier'>
              <Toolbar>
                <IconButton
                  className='BTNSupplier'
                  color="inherit"
                  variant="contained"
                  onClick={this.onGoBack}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {id === 'add'
                    ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới nhà cung cấp' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật nhà cung cấp' })}`}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.onSave}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới nhà cung cấp' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật nhà cung cấp' })}`
          }
          onGoBack={this.onGoBack}
          onSubmit={this.handleOnSave}
        />
        <Paper
          style={{
            padding: 20,
            marginBottom: 20,
          }}
        >
          <GridUI container item md={12}>
            <GridUI item md={6}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} />{' '}
                {intl.formatMessage(messages.thongtin || { id: 'thongtin', defaultMessage: 'thongtin' })}{' '}
                <span
                  style={{
                    color: '#A4A4A4',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                </span>
              </Typography>

              <TextFieldCode
                code={12}
                name="supplierCode"
                value={props.addSupplierPage.supplierCode}
                onChange={this.handleChange('supplierCode')}
                label={names.code}
                error={localMessages && localMessages.supplierCode}
                helperText={localMessages && localMessages.supplierCode}
                required={checkRequired.supplierCode}
                checkedShowForm={checkShowForm.supplierCode}
              />
              <CustomInputBase
                name="name"
                value={props.addSupplierPage.name}
                onChange={this.handleChange('name')}
                label={names.name}
                error={localMessages && localMessages.name}
                helperText={localMessages && localMessages.name}
                required={checkRequired.name}
                checkedShowForm={checkShowForm.name}
              />
              <CustomInputBase
                name="email"
                value={props.addSupplierPage.email}
                onChange={this.handleChange('email')}
                label={names.email}
                error={props.addSupplierPage.email && checkValidEmail(props.addSupplierPage.email) !== '' ? true : false}
                helperText={props.addSupplierPage.email && checkValidEmail(props.addSupplierPage.email)}
                required={checkRequired.email}
                checkedShowForm={checkShowForm.email}
              />
              <CustomInputBase
                value={props.addSupplierPage.website}
                name="website"
                onChange={this.handleChange('website')}
                label={names.website}
                error={(localMessages && localMessages.website) || checkValidWebsite(props.addSupplierPage.website) !== '' ? true : false}
                helperText={(localMessages && localMessages.website) || checkValidWebsite(props.addSupplierPage.website)}
                required={checkRequired.website}
                checkedShowForm={checkShowForm.website}
              />
              <CustomInputBase
                type="number"
                onKeyDown={blockInvalidChar}
                value={props.addSupplierPage.phone}
                name="phone"
                onChange={this.handleChange('phone')}
                label={names.phone}
                error={(localMessages && localMessages.phone) || checkPhoneNumber(props.addSupplierPage.phone) !== '' ? true : false}
                helperText={(localMessages && localMessages.phone) || checkPhoneNumber(props.addSupplierPage.phone)}
                required={checkRequired.phone}
                checkedShowForm={checkShowForm.phone}
              />
              <CustomInputBase
                value={props.addSupplierPage.address}
                type="text"
                name="address"
                onChange={this.handleChange('address')}
                label={names.adress}
                error={localMessages && localMessages.address}
                helperText={localMessages && localMessages.address}
                required={checkRequired.address}
                checkedShowForm={checkShowForm.address}
              />

              <CustomInputBase
                value={props.addSupplierPage.bankAccountNumber}
                type="number"
                name="bankAccountNumber"
                onKeyDown={blockInvalidChar}
                onChange={e => this.changeBank(e)}
                label={names.bankAccountNumber}
                error={localMessages && localMessages.bankAccountNumber}
                helperText={localMessages && localMessages.bankAccountNumber}
                required={checkRequired.bankAccountNumber}
                checkedShowForm={checkShowForm.bankAccountNumber}
              />
              <CustomInputBase
                value={props.addSupplierPage.taxCode}
                name="taxCode"
                onKeyDown={blockStringSpecial}
                onChange={this.handleChange('taxCode')}
                label={names.taxCode}
                error={localMessages && localMessages.taxCode}
                helperText={localMessages && localMessages.taxCode}
                required={checkRequired.taxCode}
                checkedShowForm={checkShowForm.taxCode}
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  invalidLabel="DD/MM/YYYY"
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  keyboard
                  keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  value={props.addSupplierPage.createdAtSupplier}
                  variant="outlined"
                  label={names.createdAtSupplier}
                  margin="dense"

                  name="createdAtSupplier"
                  error={localMessages && localMessages.createdAtSupplier}
                  helperText={localMessages && localMessages.createdAtSupplier}
                  required={checkRequired.dateRange}
                  checkedShowForm={checkShowForm.createdAtSupplier}
                  onChange={e => this.handleChangeSupplier(e, true)}
                  disableFuture
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max }}
                />
              </MuiPickersUtilsProvider>
              <CustomInputBase
                onKeyDown={blockInvalidChar}
                value={props.addSupplierPage.charterCapital}
                name="charterCapital"
                onChange={this.handleChange('charterCapital')}
                label={names.charterCapital}
                type="number"
                error={localMessages && localMessages.charterCapital}
                helperText={localMessages && localMessages.charterCapital}
                required={checkRequired.charterCapital}
                checkedShowForm={checkShowForm.charterCapital}
              />
              <CustomInputBase
                type="number"
                onKeyDown={blockInvalidChar}
                value={props.addSupplierPage.businessRegistrationNumber}
                name="businessRegistrationNumber"
                onChange={this.handleChange('businessRegistrationNumber')}
                label={names.businessRegistrationNumber}
                error={localMessages && localMessages.businessRegistrationNumber}
                helperText={localMessages && localMessages.businessRegistrationNumber}
                required={checkRequired.businessRegistrationNumber}
                checkedShowForm={checkShowForm.businessRegistrationNumber}
              />
              {/* <CustomInputBase
                  value={props.addSupplierPage.dateRange}
                  name="dateRange"
                  onChange={this.handleChange('dateRange')}
                  label={names.dateRange}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max }}
                  error={localMessages && localMessages.dateRange}
                  helperText={localMessages && localMessages.dateRange}
                  required={checkRequired.dateRange}
                  checkedShowForm={checkShowForm.dateRange}
                /> */}
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  keyboard
                  keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  invalidLabel="DD/MM/YYYY"
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={props.addSupplierPage.dateRange}
                  variant="outlined"
                  label={names.dateRange}
                  margin="dense"

                  name="dateRange"
                  error={localMessages && localMessages.dateRange}
                  helperText={localMessages && localMessages.dateRange}
                  required={checkRequired.dateRange}
                  checkedShowForm={checkShowForm.dateRange}
                  //onChange={this.handleChange('dateRange')}
                  onChange={e => this.handleChangeSupper(e, true)}
                  disableFuture
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                rows={4}
                value={props.addSupplierPage.note}
                name="note"
                onChange={this.handleChange('note')}
                label={names.note}
                error={localMessages && localMessages.note}
                helperText={localMessages && localMessages.note}
                required={checkRequired.note}
                checkedShowForm={checkShowForm.note}
              />
              <FileUpload name={props.addSupplierPage.name} id={id} code="Supplier" />
            </GridUI>

            <GridUI item md={6}>
              <div style={{ display: 'grid', justifyContent: 'center' }}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                  }}
                >
                  <Person style={{ fontSize: '20px', marginBottom: '5px' }} />{' '}
                  {intl.formatMessage(messages.chonanh || { id: 'chonanh', defaultMessage: 'chonanh' })}
                </Typography>
                <Avatar
                  alt="Ảnh đại diện"
                  src={props.addSupplierPage.logoURL || props.addSupplierPage.logo || avatarDefault}
                  style={{
                    marginTop: 20,
                    width: 200,
                    height: 200,
                  }}
                />
                <input accept="image/*" style={{ display: 'none' }} id="contained-button-file" multiple onChange={this.onSelectImg} type="file" />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    style={{
                      marginLeft: 16,
                      // textAlign: 'center',
                      marginTop: 10,
                    }}
                  >
                    {intl.formatMessage(messages.themanh || { id: 'themanh', defaultMessage: 'themanh' })}
                  </Button>
                </label>
              </div>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                  marginTop: 20,
                  marginLeft: 20,
                }}
              >
                <Edit style={{ fontSize: '20px', marginBottom: 7 }} />
                {intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' })}{' '}
                <span
                  style={{
                    color: '#A4A4A4',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                </span>
              </Typography>
              <Tabs value={this.state.tab} onChange={this.handleChangeTab} indicatorColor="primary" variant="scrollable" scrollButtons="on">
                <Tab disableRipple label={intl.formatMessage(messages.nguoidaidien || { id: 'nguoidaidien', defaultMessage: 'nguoidaidien' })} />
                <Tab
                  disableRipple
                  label={intl.formatMessage(messages.phanloaikhachhang || { id: 'phanloaikhachhang', defaultMessage: 'phanloaikhachhang' })}
                />
              </Tabs>
              <SwipeableViews index={this.state.tab} onChangeIndex={this.handleChangeIndex} width={window.innerWidth - 260}>
                <TabContainer>
                  <CustomInputBase
                    value={props.addSupplierPage.representativeName}
                    name="representativeName"
                    onKeyDown={blockNumberStringSpecial}
                    onChange={this.handleChange('representativeName')}
                    label={names.representativeName}
                    error={localMessages && localMessages.representativeName}
                    helperText={localMessages && localMessages.representativeName}
                    required={checkRequired.representativeName}
                    checkedShowForm={checkShowForm.representativeName}
                  />
                  <CustomInputBase
                    type="number"
                    onKeyDown={blockInvalidChar}
                    value={props.addSupplierPage.representativePhone}
                    name="representativePhone"
                    onChange={this.handleChange('representativePhone')}
                    label={names.representativePhone}
                    error={
                      (localMessages && localMessages.representativePhone) || checkPhoneNumber(props.addSupplierPage.representativePhone) !== ''
                        ? true
                        : false
                    }
                    helperText={(localMessages && localMessages.representativePhone) || checkPhoneNumber(props.addSupplierPage.representativePhone)}
                    required={checkRequired.representativePhone}
                    checkedShowForm={checkShowForm.representativePhone}
                  />
                  <CustomInputBase
                    label={names.representativeGender}
                    value={props.addSupplierPage.representativeGender}
                    name="representativeGender"
                    select
                    onChange={this.handleChange('representativeGender')}
                    error={localMessages && localMessages.representativeGender}
                    helperText={localMessages && localMessages.representativeGender}
                    required={checkRequired.representativeGender}
                    checkedShowForm={checkShowForm.representativeGender}
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                  </CustomInputBase>

                  {/* <CustomInputBase
                      value={props.addSupplierPage.representativeBirthDate}
                      type="date"
                      name="representativeBirthDate"
                      onChange={this.handleChange('representativeBirthDate')}
                      label={names.representativeBirthDate}
                      inputProps={{ max }}
                      error={localMessages && localMessages.representativeBirthDate}
                      helperText={localMessages && localMessages.representativeBirthDate}
                      required={checkRequired.representativeBirthDate}
                      checkedShowForm={checkShowForm.representativeBirthDate}
                    /> */}
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      invalidLabel="DD/MM/YYYY"
                      inputVariant="outlined"
                      keyboard
                      keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                      format="DD/MM/YYYY"
                      value={props.addSupplierPage.representativeBirthDate}
                      variant="outlined"
                      label={names.representativeBirthDate}
                      margin="dense"

                      name="representativeBirthDate"
                      error={localMessages && localMessages.representativeBirthDate}
                      helperText={localMessages && localMessages.representativeBirthDate}
                      required={checkRequired.representativeBirthDate}
                      checkedShowForm={checkShowForm.representativeBirthDate}
                      //onChange={this.handleChange('dateRange')}
                      onChange={e => this.handleChangeSupper(e, false)}
                      disableFuture
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max }}
                    />
                  </MuiPickersUtilsProvider>
                  <CustomInputBase
                    value={props.addSupplierPage.representativeEmail}
                    name="representativeEmail"
                    onChange={this.handleChange('representativeEmail')}
                    label={names.representativeEmail}
                    error={localMessages && localMessages.representativeEmail}
                    helperText={localMessages && localMessages.representativeEmail}
                    // error={
                    //   props.addSupplierPage.representativeEmail && checkValidEmail(props.addSupplierPage.representativeEmail) !== '' ? true : false
                    // }
                    // helperText={props.addSupplierPage.representativeEmail && checkValidEmail(props.addSupplierPage.representativeEmail)}
                    // required={checkRequired.representativeEmail}
                    checkedShowForm={checkShowForm.representativeEmail}
                  />
                  <CustomInputBase
                    onKeyDown={blockStringSpecial}
                    value={props.addSupplierPage.representativePosition}
                    name="representativePosition"
                    onChange={this.handleChange('representativePosition')}
                    label={names.representativePosition}
                    error={localMessages && localMessages.representativePosition}
                    helperText={localMessages && localMessages.representativePosition}
                    required={checkRequired.representativePosition}
                    checkedShowForm={checkShowForm.representativePosition}
                  />
                  <TextField
                    value={props.addSupplierPage.representativeNote}
                    multiline
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    rows={4}
                    name="representativeNote"
                    onChange={this.handleChange('representativeNote')}
                    label={names.representativeNote}
                    error={localMessages && localMessages.representativeNote}
                    helperText={localMessages && localMessages.representativeNote}
                    required={checkRequired.representativeNote}
                    checkedShowForm={checkShowForm.representativeNote}
                  />
                </TabContainer>
                <TabContainer>
                  <CustomInputBase
                    label="Loại đơn vị"
                    select
                    value={props.addSupplierPage.unit}
                    name="unit"
                    onChange={this.handleChange('unit')}
                    error={localMessages && localMessages.unit}
                    helperText={localMessages && localMessages.unit}
                    required={checkRequired.unit}
                    checkedShowForm={checkShowForm.unit}
                  >
                    {this.listSource('S01')}
                  </CustomInputBase>
                  <CustomInputBase
                    label="Khu vực"
                    select
                    value={props.addSupplierPage.location}
                    name="location"
                    onChange={this.handleChange('location')}
                    error={localMessages && localMessages.location}
                    helperText={localMessages && localMessages.location}
                    required={checkRequired.location}
                    checkedShowForm={checkShowForm.location}
                  >
                    {this.listSource('S10')}
                  </CustomInputBase>
                  <CustomInputBase
                    label="Ngành nghề kinh doanh"
                    value={props.addSupplierPage.job}
                    name="job"
                    select
                    onChange={this.handleChange('job')}
                    error={localMessages && localMessages.job}
                    helperText={localMessages && localMessages.job}
                    required={checkRequired.job}
                    checkedShowForm={checkShowForm.job}
                  >
                    {this.listSource('S12')}
                  </CustomInputBase>

                  <CustomInputBase
                    label="Hình thức công ty"
                    value={props.addSupplierPage.companyType}
                    name="referralSource"
                    onChange={this.handleChange('companyType')}
                    error={localMessages && localMessages.companyType}
                    helperText={localMessages && localMessages.companyType}
                    required={checkRequired.companyType}
                    checkedShowForm={checkShowForm.companyType}
                  >
                    <MenuItem value={0}>Cổ phần</MenuItem>
                    <MenuItem value={1}>TNHH</MenuItem>
                  </CustomInputBase>

                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '18px',
                      marginTop: 20,
                    }}
                  >
                    Chọn bộ thuộc tính
                  </Typography>
                  <Select
                    fullWidth
                    value={this.props.addSupplierPage.attributeSelect}
                    name="attributeSelect"
                    onChange={this.handleChangeSelect}
                    input={<OutlinedInput name="age" id="outlined-age-native-simple" />}
                  >
                    {this.props.addSupplierPage.attributes.map(item => (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                  {this.props.addSupplierPage.attributeSelect ? (
                    <Attribute
                      page={this.props.addSupplierPage}
                      handleRemove={this.props.handleRemove}
                      handleChangeAtt={this.props.changeName}
                      handleChecked={this.props.handleChecked}
                    />
                  ) : null}
                </TabContainer>
              </SwipeableViews>
              {/* <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                  <Button
                    type="button"
                    onClick={this.onSave}
                    variant="contained"
                    color="primary"
                    // style={{
                    //   position: 'fixed',
                    //   top: 160,
                    // }}
                  >
                    {[intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })]}
                  </Button>
                </div> */}
            </GridUI>
          </GridUI>

          <GridUI item sm={12}>
            <Typography
              component="p"
              style={{
                fontWeight: 550,
                fontSize: '18px',
                marginTop: 20,
              }}
            >
              <Edit style={{ fontSize: '20px', marginBottom: 7 }} />{' '}
              {intl.formatMessage(messages.thongtindaumoi || { id: 'thongtindaumoi', defaultMessage: 'thongtindaumoi' })}
            </Typography>
            <DataGrid id="gridContainer" dataSource={this.props.addSupplierPage.clueInformation} ders repaintChangesOnly>
              <Paging enabled={false} />
              <Editing
                refreshMode="repaint"
                mode="cell"
                texts={{ confirmDeleteMessage: intl.formatMessage(messages.xoa || { id: 'xoa', defaultMessage: 'Xóa' }) }}
                allowUpdating
                allowDeleting
                allowAdding
              />

              <Column dataField="id" caption="STT" width={55} />
              <Column dataField="name" caption="Họ tên" />
              <Column dataField="phoneNumber" caption="SĐT" />
              <Column dataField="email" caption="Email" />
              <Column dataField="department" caption="Phòng ban" />
              <Column dataField="note" caption="Ghi chú" />
            </DataGrid>
          </GridUI>
        </Paper>
        {/* </ValidatorForm> */}
      </div>
    );
  }

  listSource = code =>
    crmSource.find(item => item.code === code).data.map(ele => (
      <MenuItem value={ele.value} key={ele.value}>
        {ele.title}
      </MenuItem>
    ));

  handleChangeSelect = e => {
    this.props.mergeData({ attributeSelect: e.target.value });
  };
}

const mapStateToProps = createStructuredSelector({
  addSupplierPage: makeSelectAddSupplierPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    postSupplier: data => dispatch(postSupplier(data)),
    putSupplier: (id, data) => dispatch(putSupplier(id, data)),
    getSupplier: id => dispatch(getSupplier(id)),
    changeName: name => event => dispatch(changeValue({ name, value: event.target.value })),
    changeImage: data => dispatch(changeImage(data)),
    setDefaultState: () => dispatch(setDefaultState()),
    getData: () => dispatch(getData()),
    handleRemove: (name, value) => dispatch(changeValue({ name, value })),
    handleChecked: name => event => dispatch(changeValue({ name, value: event.target.checked })),
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSupplierPage', reducer });
const withSaga = injectSaga({ key: 'addSupplierPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddSupplierPage);
