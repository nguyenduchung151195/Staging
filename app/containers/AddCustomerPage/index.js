/* eslint-disable prettier/prettier */
/**
 *
 * AddCustomerPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Typography,
  Paper,
  //   Grid,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Avatar,
  FormControl,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  // Input,
  Chip,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  InputAdornment,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  OutlinedInput,
} from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import { TextValidator, TextField, Autocomplete, FileUpload, KanbanStep, Loading } from 'components/LifetekUi';
import GridUI from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';
import ReactGoogleMap from 'react-google-map';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import axios from 'axios';
import { injectIntl } from 'react-intl';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import TextFieldCode from '../../components/TextFieldCode';
import locationIcon from '../../images/location.png';
import { API_KEY } from '../../config/urlConfig';
import Attribute from '../../components/Attribute';
import makeSelectAddCustomerPage, { makeSelectlistAtt } from './selectors';
import reducer from './reducer';
import saga from './saga';
import avatarDefault from '../../images/default-avatar.png';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';

import {
  getInfo,
  postCustomer,
  putCustomer,
  handleChangeName,
  handleChangeLastName,
  handleChangeNickName,
  changeSelect,
  changeExpanded,
  getAttribute,
  handleChangeAtt,
} from './actions';
import messages from './messages';
import styles from './styles';
import { provincialColumns } from '../../variable';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import dot from 'dot-object';
import KanbanStepper from '../../components/KanbanStepper';

// Validate max date
const d = new Date();
const currentMonth = (d.getMonth() + 1).toString();
const currentDay = d.getDate().toString();
const month = currentMonth.length === 1 ? `0${currentMonth}` : currentMonth;
const day = currentDay.length === 1 ? `0${currentDay}` : currentDay;
const year = d.getFullYear();
const max = `${year}-${month}-${day}`;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
/* eslint-disable react/prefer-stateless-function */

export class AddCustomerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: '',
      code: '',
      name: '',
      lastName: '',
      nickName: '',
      email: '',
      phoneNumber: '',
      gender: 'male',
      provincial: null,
      locationAddress: '',
      location: { lat: 0, lng: 0 },
      zoom: 18,
      search: '',
      cityCircle: {},
      birthDay: moment().format('YYYY-MM-DD'),
      // address: 'Hanoi VietNam',
      address: '',
      website: '',
      avatar: '',
      fax: '',
      idetityCardNumber: '',
      passportNumber: '',
      bank: '',
      bankAccountNumber: '',
      taxCode: '',
      isTax: false,
      certifiedNoTaxNumber: '',
      businessRegistrationNumber: '',
      managerEmployee: '',
      peopleCanView: [],
      position: '',
      valueForTabs: 0,
      typeOfCustomer: this.addItem(CUSTOMER_TYPE_CODE)[0] ? this.addItem(CUSTOMER_TYPE_CODE)[0].props.value : null,
      group: '',
      branches: '',
      career: [],
      productType: [],
      contactWays: '',
      areas: [],
      introducedWay: '',
      introPerson: '',
      phoneIntroPerson: '',
      introducedNote: '',
      representativeName: '',
      representativePhone: '',
      representativeGender: 'male',
      representativeDob: moment().format('YYYY-MM-DD'),
      representativeEmail: '',
      representativePosition: '',
      representativeNote: '',
      rows: [],
      facebook: '',
      isTaxTitle: false,
      status: false,
      others: {},
      customerColumns: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Customer')
        .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
      crmSource: JSON.parse(localStorage.getItem('crmSource')),
      othersName: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Customer')
        .listDisplay.type.fields.type.others.map(item => ({ ...item, name: item.name.substring(7) })),
      errorName: true,
      listKanban: [],
      kanbanStatus: '',
      type: 1,
      checkShowForm: viewConfigCheckRequired('Customer', 'showForm'),
      checkRequired: viewConfigCheckRequired('Customer', 'required'),
      localMessages: {},
      note: '',
      disableAdd: false,
    };
  }

  componentDidMount() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const listKanBan = JSON.parse(localStorage.getItem('crmStatus'));
    if (listKanBan) {
      let customerKanbanStatus = listKanBan.find(p => p.code === 'ST18');
      if (customerKanbanStatus && customerKanbanStatus.data) {
        this.setState(prevState => ({ ...prevState, listKanban: customerKanbanStatus.data }));
        if (id === 'add') {
          const { _id } = customerKanbanStatus.data[0];
          this.setState({
            kanbanStatus: _id,
          });
        }
      }
    }
    if (id !== 'add') {
      this.props.getInfo(id);
      this.setState({ errorName: false });
    } else this.props.getAttribute();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;
  }
  getMessages() {
    const { callback } = this.props;
    const {
      type,
      kanbanStatus,
      others,
      facebook,
      code,
      name,
      lastName,
      nickName,
      phoneNumber,
      email,
      gender,
      birthDay,
      provincial,
      website,
      fax,
      idetityCardNumber,
      passportNumber,
      bank,
      bankAccountNumber,
      taxCode,
      isTax,
      locationAddress,
      certifiedNoTaxNumber,
      position,
      businessRegistrationNumber,
      managerEmployee,
      peopleCanView,
      note,
      avatar,
      avatarURL,
      typeOfCustomer,
      group,
      branches,
      career,
      productType,
      contactWays,
      areas,
      introducedWay,
      introPerson,
      phoneIntroPerson,
      introducedNote,
      representativeName,
      representativePhone,
      representativeGender,
      representativeDob,
      representativeEmail,
      representativePosition,
      representativeNote,
      rows,
      debitAccount,
      customDebitAccount,
      debtLimit,
      saleCount,
      debitAge,
      isTaxTitle,
      address
    } = this.state;

    const body = {
      type,
      kanbanStatus,
      others,
      callback,
      facebook,
      code,
      name,
      lastName,
      nickName,
      phoneNumber,
      email,
      gender,
      birthDay,
      provincial,
      website,
      fax,
      idetityCardNumber,
      passportNumber,
      bank,
      bankAccountNumber,
      taxCode,
      isTax,
      // address: locationAddress,
      address: address,

      certifiedNoTaxNumber,
      position,
      businessRegistrationNumber,
      managerEmployee: managerEmployee ? managerEmployee._id : null,
      viewableEmployees: peopleCanView && peopleCanView.length > 0 ? peopleCanView.map(item => item._id) : null,
      note,
      avatar,
      avatarURL,
      detailInfo: {
        typeCustomer: {
          typeOfCustomer,
          group,
          branches,
          career,
          productType,
          contactWays,
          areas,
          introducedWay,
          introPerson,
          phoneIntroPerson,
          introducedNote,
          // setAttribute: attributes,
        },
        represent: {
          name: representativeName,
          phoneNumber: representativePhone,
          gender: representativeGender,
          birthDay: representativeDob,
          email: representativeEmail,
          position: representativePosition,
          note: representativeNote,
          localPersonInfo: rows,
        },
        options: {
          debitAccount: debitAccount ? debitAccount : '',
          customDebitAccount: customDebitAccount ? customDebitAccount : '',
          debtLimit: debtLimit ? debtLimit : '',
          saleCount: saleCount ? saleCount : '',
          debitAge: debitAge ? debitAge : '',
          isTaxTitle: isTaxTitle ? isTaxTitle : '',
          taxTitle: [
            {
              name: 'bac',
              percent: 10,
            },
          ],
        },
      },
      note,
    };

    const data = dot.dot(body);
    const messages = viewConfigCheckForm('Customer', data);
    this.state.localMessages = messages;
  }

  static getDerivedStateFromProps(props, state) {
    const id = props.id ? props.id : props.match.params.id;
    if (id === 'add') return null;
    const status = props.addCustomerPage.loading ? 'loading' : props.addCustomerPage.success ? 'success' : null;
    if (props.addCustomerPage.loading) {
      return {
        status,
      };
    }
    if (props.addCustomerPage.success && state.status === 'success') {
      return null;
    }
    if (props.addCustomerPage.success) {
      const data = props.addCustomerPage.data;
      if (!data) return null;
      const { represent, typeCustomer, options } = props.addCustomerPage.data.detailInfo;
      const messages = viewConfigCheckForm('Customer', dot.dot(data));
      return {
        code: data.code,
        name: data.name,
        lastName: data.lastName,
        nickName: data.nickName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        gender: data.gender,
        birthDay: data.birthDay,
        provincial: data.provincial,
        website: data.website,
        avatar: data.avatar,
        fax: data.fax,
        idetityCardNumber: data.idetityCardNumber,
        passportNumber: data.passportNumber,
        bank: data.bank,
        bankAccountNumber: data.bankAccountNumber,
        taxCode: data.taxCode,
        peopleCanView: data.viewableEmployees,
        isTax: data.isTax,
        businessRegistrationNumber: data.businessRegistrationNumber,
        certifiedNoTaxNumber: data.certifiedNoTaxNumber,
        position: data.position,
        managerEmployee: data.managerEmployee,
        status,
        note: data.note,
        // locationAddress: data.address,
        address: data.address,

        representativeName: represent.name,
        representativePhone: represent.phoneNumber,
        representativeGender: represent.gender,
        representativeDob: represent.birthDay,
        representativeEmail: represent.email,
        representativePosition: represent.position,
        representativeNote: represent.note,
        rows: represent.localPersonInfo,
        debitAccount: options.debitAccount,
        customDebitAccount: options.customDebitAccount,
        debtLimit: options.debtLimit,
        saleCount: options.saleCount,
        debitAge: options.debitAge,
        isTaxTitle: options.isTaxTitle,
        introPerson: typeCustomer.introPerson,
        phoneIntroPerson: typeCustomer.phoneIntroPerson,
        introducedWay: typeCustomer.introducedWay,
        introducedNote: typeCustomer.introducedNote,
        typeOfCustomer: typeCustomer.typeOfCustomer,
        group: typeCustomer.group,
        branches: typeCustomer.branches,
        career: typeCustomer.career,
        productType: typeCustomer.productType,
        contactWays: typeCustomer.contactWays,
        areas: typeCustomer.areas,
        facebook: data.facebook,
        others: data.others,
        kanbanStatus: data.kanbanStatus,
        type: data.type,
        localMessages: messages,
      };
    }

    return null;
  }

  componentDidUpdate() {
    this.getMessages();
  }

  changeMutil(value) {
    // const arrayValue = value.map(item => item.value);
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'viewableEmployees', value);
    this.setState({
      peopleCanView: value,
      localMessages: messages,
    });
  }

  changeSingle(value) {
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'managerEmployee', value);
    this.setState({
      managerEmployee: value,
      localMessages: messages,
    });
  }

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.value}>{element.title}</MenuItem>);
    return null;
  };

  findAttribute = (attributes, id) => {
    const attribute = attributes.find(item => item.id === id).attributeGroups;
    const { classes, addCustomerPage } = this.props;
    if (attribute)
      return attribute.map(item => (
        <ExpansionPanel style={{ padding: 5 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography variant="subtitle2" color="primary">
              {item.name}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
            {item.attributes.map(at => {
              switch (at.type) {
                case 'text':
                case 'number':
                case 'date':
                  return (
                    <TextField
                      name={at.attributeId}
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      type={at.type}
                      fullWidth
                      label={at.name}
                      margin="normal"
                    />
                  );
                case 'select':
                  return (
                    <Select
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      inputProps={{
                        name: at.attributeId,
                      }}
                    >
                      {at.options.map(name => (
                        <MenuItem key={name.value} value={name.value}>
                          {name.name}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                case 'multiSelect':
                  return (
                    <FormControl>
                      <InputLabel htmlFor="select-multiple-chip">{at.name}</InputLabel>
                      <Select
                        multiple
                        value={addCustomerPage[at.attributeId]}
                        onChange={this.props.handleChangeAtt(at.attributeId)}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip key={value} label={at.options.find(item => item.value === value).name} className={classes.chip} />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {at.options.map(name => (
                          <MenuItem key={name.value} value={name.value}>
                            {name.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                case 'bool':
                  return <Checkbox />;

                default:
                  return (
                    <TextField
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      fullWidth
                      label={at.name}
                      margin="normal"
                    />
                  );
              }
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ));
    return null;
  };

  setOthers = (name, value) => {
    const { others } = this.state;
    const newOthers = { ...others };
    newOthers[name] = value;
    this.setState({ others: newOthers });
  };

  handleOthers = () => (
    <React.Fragment>
      {this.state.othersName.map(item => {
        switch (item.type) {
          case 'text':
          case 'number':
          case 'date':
            return (
              <TextField
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                type={item.type}
                defaultValue=""
                title={item.title}
                value={this.state.others ? this.state.others[item.name] : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );
          default:
            return (
              <TextField
                value={this.state.others ? this.state.others[item.name] : this.state.others}
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                // select
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {this.state.crmSource.find(el => el._id === item.type)
                  ? this.state.crmSource.find(el => el._id === item.type).data.map(ele => <MenuItem value={ele.value}>{ele.title}</MenuItem>)
                  : null}
              </TextField>
            );
        }
      })}
    </React.Fragment>
  );

  handleChangeKanban = item => {
    this.setState({ kanbanStatus: item.type });
  };

  handleChangeCustomer = (e, fieldName, isDate, isFirst) => {
    const name = isDate ? (isFirst ? 'birthDay' : 'representativeDob') : e.target.name;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    // const { target: { value, name } } = e;
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, fieldName, value);
    console.log(messages, 'cogik');
    this.setState({
      [name]: value,
      localMessages: messages,
    });
  };

  render() {
    const { intl } = this.props;
    const names = {};
    const config = {};
    const goBack = () => {
      this.props.history.goBack();
      // this.props.addCustomerPage.data = '';
      // this.state.load = true
      // console.log(this.state.load )
    };
    this.state.customerColumns.forEach(item => {
      names[item.name] = item.title;
      config[item.name] = item;
    });
    const { classes } = this.props;
    const { search, locationAddress, valueForTabs, localMessages, checkShowForm, checkRequired } = this.state;
    let { cityCircle } = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const status = id === 'add' ? true : this.state.status;
    return (
      <div style={!status ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' } : { display: 'intinial' }}>
        {id === 'add' ? null : <div>{this.state.code === '' ? <Loading /> : null}</div>}
        {!status ? (
          <CircularProgress />
        ) : (
          <div>
            <CustomAppBar
              title={
                id === 'add'
                  ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới khách hàng' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật khách hàng' })}`
              }
              onGoBack={() => {
                this.props.closeCustomer !== undefined ? this.props.closeCustomer() : goBack();
              }}
              onSubmit={this.onSave}
              disableAdd={this.state.disableAdd}
            />
            <Helmet>
              <title>
                {id === 'add'
                  ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
                  : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
              </title>
              <meta name="description" content="Description of AddCustomerPage" />
            </Helmet>

            <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
              <Breadcrumbs aria-label="Breadcrumb">
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                  Dashboard
                </Link>
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/ConfigCRM">
                  CRM
                </Link>
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/Customer">
                  {intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}
                </Link>
                <Typography color="textPrimary">
                  {id === 'add'
                    ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
                    : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
                </Typography>
              </Breadcrumbs>
            </Paper>
            <ValidatorForm onSubmit={this.onSave}>
              <Paper className={classes.paper}>
                <div style={{ marginTop: this.props.closeCustomer !== undefined ? '3rem' : 0 }}>
                  <KanbanStepper
                    listStatus={this.state.listKanban}
                    onKabanClick={value => {
                      this.setState({
                        kanbanStatus: value,
                      });
                    }}
                    activeStep={this.state.kanbanStatus}
                  />
                </div>
                <GridUI container item md={12}>
                  <GridUI item md={6}>
                    <Typography component="p" className={classes.paperTitle}>
                      <Edit style={{ fontSize: '20px', marginBottom: '5px' }} />{' '}
                      {intl.formatMessage(messages.thongtin || { id: 'thongtin', defaultMessage: 'thongtin' })}
                      <span className={classes.spanTitle}>
                        {' '}
                        {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                      </span>
                    </Typography>
                    {id === 'add' ? (
                      <TextFieldCode
                        // eslint-disable-next-line no-useless-escape
                        // validators={['required', 'matchRegexp:^[a-zA-Z0-9]{5,20}$']}
                        // errorMessages={['Không được bỏ trống', 'Mã khách hàng lớn hơn hoặc bằng 5 ký tự bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                        value={this.state.code}
                        fullWidth
                        name="code"
                        onChange={this.handleChange('code')}
                        label={names.code}
                        // required
                        code={11}
                      />
                    ) : (
                      <TextFieldCode
                        // eslint-disable-next-line no-useless-escape
                        // validators={['required', 'matchRegexp:^[a-zA-Z0-9]{5,20}$']}
                        // errorMessages={['Không được bỏ trống', 'Mã khách hàng lớn hơn hoặc bằng 5 ký tự bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                        value={this.state.code}
                        fullWidth
                        name="code"
                        // onChange={this.handleChange('code')}
                        // InputLabelProps={{ shrink: true }}
                        label={names.code}
                      // required
                      // code={11}
                      />
                    )}

                    {/* <GridUI item md={6} xl={6} lg={6} className="align-items-center">
                      <p className="mb-0">Thông tin khách hàng</p>
                    </GridUI>
                    <GridUI item md={6} xl={6} lg={6} className="col-6 text-right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          this.setState({ openingAddFieldDialog: true, newFieldConfig: { name: '', title: '', type: '', fromSource: '' } });
                        }}
                      >
                        <i className="far fa-plus-square fa-xs text-primary" />
                      </IconButton>
                    </GridUI> */}
                    <CustomInputBase
                      error={localMessages && localMessages.name}
                      helperText={localMessages && localMessages.name}
                      required={checkRequired.name}
                      checkedShowForm={checkShowForm.name}
                      label={names.name || 'TÊN KHÁCH'}
                      // onChange={this.handleChangeName('name')}
                      onChange={e => this.handleChangeCustomer(e, 'name')}
                      name="name"
                      value={this.state.name}
                      showRecorder
                      voiceInput
                    />
                    <CustomInputBase
                      required={checkRequired.lastName}
                      checkedShowForm={checkShowForm.lastName}
                      error={localMessages && localMessages.lastName}
                      helperText={localMessages && localMessages.lastName}
                      name="lastName"
                      label={names.lastName || 'HỌ KHÁCH'}
                      value={this.state.lastName}
                      // onChange={this.handleChangeLastName('lastName')}
                      onChange={e => this.handleChangeCustomer(e, 'lastName')}
                    />
                    <CustomInputBase
                      required={checkRequired.nickName}
                      checkedShowForm={checkShowForm.nickName}
                      error={localMessages && localMessages.nickName}
                      helperText={localMessages && localMessages.nickName}
                      name="nickName"
                      label={names.nickName || 'BIỆT DANH'}
                      value={this.state.nickName}
                      // onChange={this.handleChangeNickName('nickName')}
                      onChange={e => this.handleChangeCustomer(e, 'nickName')}
                    />

                    <CustomInputBase
                      value={this.state.phoneNumber}
                      name="phoneNumber"
                      // onChange={this.handleChange('phoneNumber')}
                      onChange={e => this.handleChangeCustomer(e, 'phoneNumber')}
                      label={names.phoneNumber}
                      error={localMessages && localMessages.phoneNumber}
                      helperText={localMessages && localMessages.phoneNumber}
                      required={checkRequired.phoneNumber}
                      checkedShowForm={checkShowForm.phoneNumber}
                    />

                    <CustomInputBase
                      value={this.state.address}
                      name="address"
                      // onChange={this.handleChange('phoneNumber')}
                      onChange={e => this.handleChangeCustomer(e, 'address')}
                      label={names.address || "Địa chỉ"}
                      error={localMessages && localMessages.address}
                      helperText={localMessages && localMessages.address}
                      required={checkRequired.address}
                      checkedShowForm={checkShowForm.address}
                    />

                    <CustomInputBase
                      name="email"
                      fullWidth
                      value={this.state.email}
                      // onChange={this.handleChange('email')}
                      onChange={e => this.handleChangeCustomer(e, 'email')}
                      label={names.email}
                      error={localMessages && localMessages.email}
                      helperText={localMessages && localMessages.email}
                      required={checkRequired.email}
                      checkedShowForm={checkShowForm.email}
                    />
                    <CustomInputBase
                      fullWidth
                      label={names.gender}
                      select
                      value={this.state.gender}
                      name="gender"
                      onChange={e => this.handleChangeCustomer(e, 'gender')}
                      error={localMessages && localMessages.gender}
                      helperText={localMessages && localMessages.gender}
                      required={checkRequired.gender}
                      checkedShowForm={checkShowForm.gender}
                    >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                    </CustomInputBase>
                    {/* <CustomInputBase
                        value={this.state.birthDay}
                        type="date"
                        name="birthDay"
                        // onChange={this.handleChange('birthDay')}
                        onChange={e => this.handleChangeCustomer(e, 'birthDay')}
                        label={names.birthDay}
                        error={localMessages && localMessages.birthDay}
                        helperText={localMessages && localMessages.birthDay}
                        required={checkRequired.birthDay}
                        checkedShowForm={checkShowForm.birthDay}
                        inputProps={{ max }}
                      /> */}
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY"
                        value={this.state.birthDay}
                        variant="outlined"
                        label={names.birthDay}
                        margin="dense"
                        required
                        name="birthDay"
                        error={localMessages && localMessages.birthDay}
                        helperText={localMessages && localMessages.birthDay}
                        checkedShowForm={checkShowForm.birthDay}
                        onChange={e => this.handleChangeCustomer(e, 'birthDay', true, true)}
                        disableFuture
                        fullWidth
                        keyboard
                        keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                      />
                    </MuiPickersUtilsProvider>

                    {/* ------- tỉnh thành -------- */}
                    {id === 'add' ? (
                      <CustomInputBase
                        value={this.state.provincial}
                        select
                        name="provincial"
                        onChange={e => this.handleChangeCustomer(e, 'provincial')}
                        label={names.provincial}
                        error={localMessages && localMessages.provincial}
                        helperText={localMessages && localMessages.provincial}
                        required={checkRequired.provincial}
                        checkedShowForm={checkShowForm.provincial}
                      >
                        {/* {provincialColumns.map(item => (
                            <MenuItem value={item}>{item}</MenuItem>
                          ))} */}
                        {this.addItem('S10')}
                      </CustomInputBase>
                    ) : (
                      <TextFieldCode
                        value={this.state.provincial}
                        select
                        name="provincial"
                        onChange={e => this.handleChangeCustomer(e, 'provincial')}
                        label={names.provincial}
                        error={localMessages && localMessages.provincial}
                        helperText={localMessages && localMessages.provincial}
                        required={checkRequired.provincial}
                        checkedShowForm={checkShowForm.provincial}
                      >
                        {/* {provincialColumns.map(item => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))} */}
                        {this.addItem('S10')}
                      </TextFieldCode>
                    )}

                    {/* <ReactGoogleMapLoader
                        params={{
                          key: API_KEY,
                          libraries: 'places,geocode',
                        }}
                        render={googleMaps =>
                          googleMaps && (
                            <div>
                              <ReactGooglePlacesSuggest
                                autocompletionRequest={{ input: search }}
                                googleMaps={googleMaps}
                                onSelectSuggest={this.handleSelectSuggest}
                              >
                                <Input
                                  // className="input phone"
                                  className={classes.addField}
                                  // floatingLabelText="Vị trí"
                                  placeholder="Vị trí"
                                  type="text"
                                  ref={ref => {
                                    this.desc = ref;
                                  }}
                                  style={{ marginTop: 20, marginBottom: 20 }}
                                  value={locationAddress}
                                  // floatingLabelStyle={styles.label}
                                  // floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                  onChange={this.handleInputChange}
                                  fullWidth
                                  endAdornment={
                                    <InputAdornment position="end" onClick={this.handleClickCurrentLocation}>
                                      <IconButton aria-label="Tìm địa điểm">{this.state.locationAddress ? <GpsFixed /> : ''}</IconButton>
                                    </InputAdornment>
                                  }
                                />
                              </ReactGooglePlacesSuggest>

                              <div style={{ height: '300px' }} className={classes.addField}>
                                <ReactGoogleMap
                                  googleMaps={googleMaps}
                                  center={this.state.location}
                                  zoom={this.state.zoom}
                                  coordinates={[
                                    {
                                      title: 'Vị trí của bạn',
                                      icon: locationIcon,
                                      draggable: true,
                                      position: this.state.location,
                                      // eslint-disable-next-line no-shadow
                                      onLoaded: (googleMaps, map, marker) => {
                                        // vòng vị trí
                                        if (Object.entries(cityCircle).length === 0) {
                                          cityCircle = new googleMaps.Circle({
                                            strokeColor: '#57aad7',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 1,
                                            fillColor: '#69c0ef',
                                            fillOpacity: 0.35,
                                            map,
                                            center: this.state.location,
                                            radius: 50,
                                          });
                                        } else {
                                          cityCircle.setMap(map);
                                          cityCircle.setCenter(this.state.location);
                                        }

                                        // hiển thị market ra giữa map
                                        map.panTo(this.state.location);

                                        // Set Marker animation
                                        // marker.setAnimation(googleMaps.Animation.BOUNCE)

                                        // Define Marker InfoWindow
                                        const infoWindow = new googleMaps.InfoWindow({
                                          content: `
                                  <div>
                                    <h5>${this.state.locationAddress}<h5>
                                  </div>
                                `,
                                        });

                                        //  OpenInfoWindow when Marker will be clicked
                                        googleMaps.event.addListener(marker, 'click', () => {
                                          infoWindow.open(map, marker);
                                        });

                                        // Change icon when Marker will be hovered
                                        googleMaps.event.addListener(marker, 'mouseover', () => {
                                          marker.setIcon(locationIcon);
                                        });

                                        googleMaps.event.addListener(marker, 'mouseout', () => {
                                          marker.setIcon(locationIcon);
                                        });

                                        googleMaps.event.addListener(marker, 'dragend', event => {
                                          this.onMarkerDragEnd(event);
                                          if (Object.entries(cityCircle).length !== 0) {
                                            cityCircle.setMap(null);
                                          }
                                        });
                                        // Open InfoWindow directly
                                        // infoWindow.open(map, marker);
                                      },
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                          )
                        }
                      /> */}

                    <CustomInputBase
                      value={this.state.website}
                      name="website"
                      // onChange={this.handleChange('website')}
                      onChange={e => this.handleChangeCustomer(e, 'website')}
                      label={names.website}
                      error={localMessages && localMessages.website}
                      helperText={localMessages && localMessages.website}
                      required={checkRequired.website}
                      checkedShowForm={checkShowForm.website}
                    />
                    <CustomInputBase
                      value={this.state.fax}
                      name="fax"
                      // onChange={this.handleChange('fax')}
                      onChange={e => this.handleChangeCustomer(e, 'fax')}
                      label="FAX"
                      type="number"
                      error={localMessages && localMessages.fax}
                      helperText={localMessages && localMessages.fax}
                      required={checkRequired.fax}
                      checkedShowForm={checkShowForm.fax}
                    />
                    <CustomInputBase
                      value={this.state.idetityCardNumber}
                      name="idetityCardNumber"
                      onChange={this.handleChangeidetityCardNumber('idetityCardNumber')}
                      label={names.idetityCardNumber}
                      type="number"
                      error={localMessages && localMessages.idetityCardNumber}
                      helperText={localMessages && localMessages.idetityCardNumber}
                      required={checkRequired.idetityCardNumber}
                      checkedShowForm={checkShowForm.idetityCardNumber}
                    />
                    <CustomInputBase
                      value={this.state.passportNumber}
                      name="passportNumber"
                      // onChange={this.handleChange('passportNumber')}
                      onChange={e => this.handleChangeCustomer(e, 'passportNumber')}
                      label={names.passportNumber}
                      error={localMessages && localMessages.passportNumber}
                      helperText={localMessages && localMessages.passportNumber}
                      required={checkRequired.passportNumber}
                      checkedShowForm={checkShowForm.passportNumber}
                    />

                    <CustomInputBase
                      label={names.bank}
                      value={this.state.bank}
                      displayEmpty
                      name="bank"
                      select
                      onChange={e => this.handleChangeCustomer(e, 'bank')}
                      error={localMessages && localMessages.bank}
                      helperText={localMessages && localMessages.bank}
                      required={checkRequired.bank}
                      checkedShowForm={checkShowForm.bank}
                    >
                      {this.addItem('S04')}
                    </CustomInputBase>
                    <CustomInputBase
                      value={this.state.bankAccountNumber}
                      type="number"
                      name="bankAccountNumber"
                      // onChange={this.handleChange('bankAccountNumber')}
                      onChange={e => this.handleChangeCustomer(e, 'bankAccountNumber')}
                      label={names.bankAccountNumber}
                      error={localMessages && localMessages.bankAccountNumber}
                      helperText={localMessages && localMessages.bankAccountNumber}
                      required={checkRequired.bankAccountNumber}
                      checkedShowForm={checkShowForm.bankAccountNumber}
                    />
                    <CustomInputBase
                      value={this.state.taxCode}
                      name="taxCode"
                      // onChange={this.handleChange('taxCode')}
                      onChange={e => this.handleChangeCustomer(e, 'taxCode')}
                      label={names.taxCode}
                      error={localMessages && localMessages.taxCode}
                      helperText={localMessages && localMessages.taxCode}
                      required={checkRequired.taxCode}
                      checkedShowForm={checkShowForm.taxCode}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginLeft: 10 }}
                          checked={this.state.isTax}
                          onChange={this.handleChangeCheckbox('isTax')}
                          color="primary"
                          InputLabelProps={{ shrink: true }}
                        />
                      }
                      label={names.isTax || 'Có giấy chứng nhận không thuế'}
                    />
                    {this.state.isTax === false ? (
                      <CustomInputBase
                        value={this.state.certifiedNoTaxNumber}
                        name="certifiedNoTaxNumber"
                        // onChange={this.handleChange('certifiedNoTaxNumber')}
                        onChange={e => this.handleChangeCustomer(e, 'certifiedNoTaxNumber')}
                        label="Số giấy chứng nhận không thuế"
                        error={localMessages && localMessages.certifiedNoTaxNumber}
                        helperText={localMessages && localMessages.certifiedNoTaxNumber}
                        required={checkRequired.certifiedNoTaxNumber}
                        checkedShowForm={checkShowForm.certifiedNoTaxNumber}
                      />
                    ) : (
                      ''
                    )}
                    <CustomInputBase
                      value={this.state.position}
                      fullWidth
                      name="position"
                      // onChange={this.handleChange('position')}
                      onChange={e => this.handleChangeCustomer(e, 'position')}
                      label={names.position}
                      error={localMessages && localMessages.position}
                      helperText={localMessages && localMessages.position}
                      required={checkRequired.position}
                      checkedShowForm={checkShowForm.position}
                    />
                    <CustomInputBase
                      value={this.state.businessRegistrationNumber}
                      fullWidth
                      name="businessRegistrationNumber"
                      // onChange={this.handleChange('businessRegistrationNumber')}
                      onChange={e => this.handleChangeCustomer(e, 'businessRegistrationNumber')}
                      label="Số đăng ký kinh doanh"
                      type="number"
                      error={localMessages && localMessages.businessRegistrationNumber}
                      helperText={localMessages && localMessages.businessRegistrationNumber}
                      required={checkRequired.businessRegistrationNumber}
                      checkedShowForm={checkShowForm.businessRegistrationNumber}
                    />
                    <Autocomplete
                      onChange={value => this.changeSingle(value)}
                      suggestions={this.props.addCustomerPage.users}
                      // placeholder="Nhân viên quản lý"
                      value={this.state.managerEmployee}
                      label={names.managerEmployee}
                      error={localMessages && localMessages.managerEmployee}
                      helperText={localMessages && localMessages.managerEmployee}
                      required={checkRequired.managerEmployee}
                      checkedShowForm={checkShowForm.managerEmployee}
                    />
                    {console.log(11111, this.state.peopleCanView)}
                    <Autocomplete
                      onChange={value => this.changeMutil(value)}
                      suggestions={this.props.addCustomerPage.users}
                      // placeholder="Chọn người được xem"
                      value={this.state.peopleCanView}
                      label={names.viewableEmployees}
                      isMulti
                      error={localMessages && localMessages.viewableEmployees}
                      helperText={localMessages && localMessages.viewableEmployees}
                      required={checkRequired.viewableEmployees}
                      checkedShowForm={checkShowForm.viewableEmployees}
                    />
                    <CustomInputBase
                      multiline
                      value={this.state.facebook}
                      fullWidth
                      name="facebook"
                      // onChange={this.handleChange('facebook')}
                      onChange={e => this.handleChangeCustomer(e, 'facebook')}
                      label={names.facebook}
                      error={localMessages && localMessages.facebook}
                      helperText={localMessages && localMessages.facebook}
                      required={checkRequired.facebook}
                      checkedShowForm={checkShowForm.facebook}
                    />
                  </GridUI>
                  <GridUI item md={6}>
                    <div style={{ display: 'grid', justifyContent: 'center' }}>
                      <Typography component="p" className={classes.paperTitle}>
                        <Person style={{ fontSize: '20px', marginBottom: '5px' }} />{' '}
                        {intl.formatMessage(messages.chonanh || { id: 'chonanh', defaultMessage: 'chonanh' })}
                      </Typography>

                      {/* <Avatar
                        alt="Ảnh đại diện"
                        src={`${this.state.avatarURL}` || `${this.state.avatar}?allowDefault=true` || avatarDefault}
                        className={classes.avatar}
                      /> */}
                      {id === 'add' ? (
                        <Avatar alt="Ảnh đại diện" src={`${this.state.avatarURL}` || avatarDefault} className={classes.avatar} />
                      ) : (
                        <div>
                          {this.state.avatar === '' ? (
                            <Avatar alt="Ảnh đại diện" src={`${this.state.avatarURL}` || avatarDefault} className={classes.avatar} />
                          ) : (
                            <Avatar
                              alt="Ảnh đại diện"
                              src={`${this.state.avatarURL}` || `${this.state.avatar}?allowDefault=true`}
                              className={classes.avatar}
                            />
                          )}
                        </div>
                      )}
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        multiple
                        onChange={this.onSelectImg}
                        type="file"
                      />
                      <div style={{ display: 'flex' }}>
                        <label htmlFor="contained-button-file">
                          <Button variant="contained" color="primary" component="span" className={classes.button}>
                            {intl.formatMessage(messages.themanh || { id: 'themanh', defaultMessage: 'themanh' })}
                          </Button>
                        </label>
                        {/* bỏ biểu tượng fb */}
                      </div>
                    </div>

                    <Typography component="p" className={classes.paperTitle} style={{ marginTop: 20, marginLeft: 20 }}>
                      <Edit style={{ fontSize: '20px', marginBottom: 7 }} />{' '}
                      {intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' })}{' '}
                      <span className={classes.spanTitle}>
                        {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                      </span>
                    </Typography>
                    <Tabs
                      value={this.state.valueForTabs}
                      onChange={this.handleChangeTab}
                      indicatorColor="primary"
                      variant="scrollable"
                      scrollButtons="on"
                    >
                      <Tab
                        disableRipple
                        classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                        label={intl.formatMessage(messages.nguoidaidien || { id: 'nguoidaidien', defaultMessage: 'nguoidaidien' })}
                      />
                      <Tab
                        disableRipple
                        classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                        label={intl.formatMessage(messages.phanloaikhachhang || { id: 'phanloaikhachhang', defaultMessage: 'phanloaikhachhang' })}
                      />
                      <Tab
                        disableRipple
                        classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                        label={intl.formatMessage(messages.tuychon || { id: 'tuychon', defaultMessage: 'tuychon' })}
                      />
                    </Tabs>
                    <SwipeableViews
                      // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      // style={{ overflowX: 'hidden !important' }}
                      index={valueForTabs}
                      onChangeIndex={this.handleChangeIndex}
                      width={window.innerWidth - 260}
                    >
                      <TabContainer>
                        <CustomInputBase
                          fullWidth
                          // value={this.state.fax}
                          className={classes.textField}
                          value={this.state.representativeName}
                          name="representativeName"
                          // onChange={this.handleChange('representativeName')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.name')}
                          label={names.detailInfo_represent_name}
                          error={localMessages && localMessages['detailInfo.represent.name']}
                          helperText={localMessages && localMessages['detailInfo.represent.name']}
                          required={checkRequired['detailInfo.represent.name']}
                          checkedShowForm={checkShowForm['detailInfo.represent.name']}
                        />

                        <CustomInputBase
                          value={this.state.representativePhone}
                          className={classes.textField}
                          name="representativePhone"
                          // onChange={this.handleChange('representativePhone')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.phoneNumber')}
                          label={names.detailInfo_represent_phoneNumber}
                          error={localMessages && localMessages['detailInfo.represent.phoneNumber']}
                          helperText={localMessages && localMessages['detailInfo.represent.phoneNumber']}
                          required={checkRequired['detailInfo.represent.phoneNumber']}
                          checkedShowForm={checkShowForm['detailInfo.represent.phoneNumber']}
                        />

                        <CustomInputBase
                          select
                          label={names.detailInfo_represent_gender}
                          className={classes.textField}
                          value={this.state.representativeGender}
                          name="representativeGender"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.gender')}
                          error={localMessages && localMessages['detailInfo.represent.gender']}
                          helperText={localMessages && localMessages['detailInfo.represent.gender']}
                          required={checkRequired['detailInfo.represent.gender']}
                          checkedShowForm={checkShowForm['detailInfo.represent.gender']}
                        >
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </CustomInputBase>

                        {/* <CustomInputBase
                            // value={this.state.dob}
                            className={classes.textField}
                            type="date"
                            value={this.state.representativeDob}
                            name="representativeDob"
                            // onChange={this.handleChange('representativeDob')}
                            onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.birthDay')}
                            label={names.detailInfo_represent_birthDay}
                            error={localMessages && localMessages["detailInfo.represent.birthDay"]}
                            helperText={localMessages && localMessages["detailInfo.represent.birthDay"]}
                            required={checkRequired["detailInfo.represent.birthDay"]}
                            checkedShowForm={checkShowForm["detailInfo.represent.birthDay"]}
                            inputProps={{ max }}
                          /> */}

                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            className={classes.textField}
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            value={this.state.representativeDob}
                            variant="outlined"
                            label={names.detailInfo_represent_birthDay}
                            margin="dense"
                            name="representativeDob"
                            error={localMessages && localMessages['detailInfo.represent.birthDay']}
                            helperText={localMessages && localMessages['detailInfo.represent.birthDay']}
                            required={checkRequired['detailInfo.represent.birthDay']}
                            checkedShowForm={checkShowForm['detailInfo.represent.birthDay']}
                            inputProps={{ max }}
                            onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.birthDay', true, false)}
                            disableFuture
                            fullWidth
                            keyboard
                            keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                          />
                        </MuiPickersUtilsProvider>

                        <CustomInputBase
                          value={this.state.representativeEmail}
                          className={classes.textField}
                          name="representativeEmail"
                          // onChange={this.handleChange('representativeEmail')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.email')}
                          label={names.detailInfo_represent_email}
                          error={localMessages && localMessages['detailInfo.represent.email']}
                          helperText={localMessages && localMessages['detailInfo.represent.email']}
                          required={checkRequired['detailInfo.represent.email']}
                          checkedShowForm={checkShowForm['detailInfo.represent.email']}
                        />
                        <CustomInputBase
                          // value={this.state.fax}
                          className={classes.textField}
                          value={this.state.representativePosition}
                          name="representativePosition"
                          // onChange={this.handleChange('representativePosition')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.position')}
                          label={names.detailInfo_represent_position}
                          error={localMessages && localMessages['detailInfo.represent.position']}
                          helperText={localMessages && localMessages['detailInfo.represent.position']}
                          required={checkRequired['detailInfo.represent.position']}
                          checkedShowForm={checkShowForm['detailInfo.represent.position']}
                        />
                        <TextField
                          // value={this.state.fax}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          className={classes.textField}
                          value={this.state.representativeNote}
                          multiline
                          rows={4}
                          name="representativeNote"
                          // onChange={this.handleChange('representativeNote')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.represent.note')}
                          label={names.detailInfo_represent_note}
                          error={localMessages && localMessages['detailInfo.represent.note']}
                          helperText={localMessages && localMessages['detailInfo.represent.note']}
                          required={checkRequired['detailInfo.represent.note']}
                          checkedShowForm={checkShowForm['detailInfo.represent.note']}
                        />
                        <Typography variant="subtitle2" style={{ padding: '20px 0px' }}>
                          Thông tin thêm
                        </Typography>
                        {this.handleOthers()}

                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          multiline
                          rows={4}
                          value={this.state.note}
                          name="note"
                          showSpeaker
                          // onChange={this.handleChange('note')}
                          onChange={e => this.handleChangeCustomer(e, 'note')}
                          label={names.note}
                          error={localMessages && localMessages.note}
                          helperText={localMessages && localMessages.note}
                          required={checkRequired.note}
                          checkedShowForm={checkShowForm.note}
                        />

                        <FileUpload name={this.state.name} id={id} code="Customer" />
                      </TabContainer>
                      <TabContainer>
                        <CustomInputBase
                          select
                          label={names.detailInfo_typeCustomer_typeOfCustomer}
                          value={this.state.typeOfCustomer}
                          name="typeOfCustomer"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.typeOfCustomer')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.typeOfCustomer']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.typeOfCustomer']}
                          required={checkRequired['detailInfo.typeCustomer.typeOfCustomer']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.typeOfCustomer']}
                        >
                          {this.addItem(CUSTOMER_TYPE_CODE)}
                        </CustomInputBase>

                        <CustomInputBase
                          select
                          label={names.detailInfo_typeCustomer_group}
                          value={this.state.group}
                          name="group"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.group')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.group']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.group']}
                          required={checkRequired['detailInfo.typeCustomer.group']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.group']}
                        >
                          {this.addItem('S07')}
                        </CustomInputBase>

                        <CustomInputBase
                          select
                          fullWidth
                          label={names.detailInfo_typeCustomer_branches}
                          value={this.state.branches}
                          name="branches"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.branches')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.branches']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.branches']}
                          required={checkRequired['detailInfo.typeCustomer.branches']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.branches']}
                        >
                          {this.addItem('pckh')}
                        </CustomInputBase>

                        <CustomInputBase
                          select
                          multiple
                          label={names.detailInfo_typeCustomer_career}
                          value={this.state.career}
                          name="career"
                          className={classes.textField}
                          fullWidth
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.career')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.career']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.career']}
                          required={checkRequired['detailInfo.typeCustomer.career']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.career']}
                        >
                          {this.addItem('S12')}
                        </CustomInputBase>

                        <CustomInputBase
                          select
                          multiple
                          label={names.detailInfo_typeCustomer_productType}
                          value={this.state.productType}
                          name="productType"
                          className={classes.textField}
                          fullWidth
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.productType')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.productType']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.productType']}
                          required={checkRequired['detailInfo.typeCustomer.productType']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.productType']}
                        >
                          {this.addItem('S02')}
                        </CustomInputBase>
                        <CustomInputBase
                          select
                          label={names.detailInfo_typeCustomer_contactWays}
                          className={classes.textField}
                          multiple
                          value={this.state.contactWays}
                          name="contactWays"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.contactWays')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.contactWays']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.contactWays']}
                          required={checkRequired['detailInfo.typeCustomer.contactWays']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.contactWays']}
                        >
                          {this.addItem('S06')}
                        </CustomInputBase>

                        <CustomInputBase
                          select
                          label={names.detailInfo_typeCustomer_areas}
                          className={classes.textField}
                          multiple
                          value={this.state.areas}
                          name="areas"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.areas')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.areas']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.areas']}
                          required={checkRequired['detailInfo.typeCustomer.areas']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.areas']}
                        >
                          {this.addItem('S10')}
                        </CustomInputBase>
                        <CustomInputBase
                          label={names.detailInfo_typeCustomer_introducedWay}
                          select
                          className={classes.textField}
                          fullWidth
                          value={this.state.introducedWay}
                          name="introducedWay"
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.introducedWay')}
                          error={localMessages && localMessages['detailInfo.typeCustomer.introducedWay']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.introducedWay']}
                          required={checkRequired['detailInfo.typeCustomer.introducedWay']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.introducedWay']}
                        >
                          {this.addItem('S03')}
                        </CustomInputBase>
                        <CustomInputBase
                          value={this.state.introPerson}
                          fullWidth
                          name="introPerson"
                          // onChange={this.handleChange('introPerson')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.introPerson')}
                          label={names.detailInfo_typeCustomer_introPerson}
                          error={localMessages && localMessages['detailInfo.typeCustomer.introPerson']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.introPerson']}
                          required={checkRequired['detailInfo.typeCustomer.introPerson']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.introPerson']}
                        />

                        <CustomInputBase
                          value={this.state.phoneIntroPerson}
                          fullWidth
                          name="phoneIntroPerson"
                          // onChange={this.handleChange('phoneIntroPerson')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.phoneIntroPerson')}
                          label={names.detailInfo_typeCustomer_phoneIntroPerson}
                          error={localMessages && localMessages['detailInfo.typeCustomer.phoneIntroPerson']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.phoneIntroPerson']}
                          required={checkRequired['detailInfo.typeCustomer.phoneIntroPerson']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.phoneIntroPerson']}
                        />
                        <CustomInputBase
                          value={this.state.introducedNote}
                          name="introducedNote"
                          multiline
                          rows={4}
                          // onChange={this.handleChange('introducedNote')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.typeCustomer.introducedNote')}
                          label={names.detailInfo_typeCustomer_introducedNote}
                          error={localMessages && localMessages['detailInfo.typeCustomer.introducedNote']}
                          helperText={localMessages && localMessages['detailInfo.typeCustomer.introducedNote']}
                          required={checkRequired['detailInfo.typeCustomer.introducedNote']}
                          checkedShowForm={checkShowForm['detailInfo.typeCustomer.introducedNote']}
                        />
                        <Typography component="p" className={classes.paperTitle} style={{ marginTop: 20 }}>
                          {names.detailInfo_typeCustomer_setAttribute}
                        </Typography>
                        <Select
                          fullWidth
                          className={classes.textField}
                          value={this.props.addCustomerPage.attributeSelect}
                          name="attributes"
                          onChange={this.props.handleChangeSelect}
                          input={<OutlinedInput name="age" id="outlined-age-native-simple" />}
                        >
                          {this.props.addCustomerPage.attributes.map(item => (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                          ))}
                        </Select>
                        {/* {this.props.addCustomerPage.attributeSelect
                          ? this.findAttribute(this.props.addCustomerPage.attributes, this.props.addCustomerPage.attributeSelect)
                          : null} */}
                        {this.props.addCustomerPage.attributeSelect ? (
                          <Attribute
                            page={this.props.addCustomerPage}
                            handleRemove={this.props.handleRemove}
                            handleChangeAtt={this.props.handleChangeAtt}
                            handleChecked={this.props.handleChecked}
                          />
                        ) : null}
                      </TabContainer>
                      <TabContainer>
                        <CustomInputBase
                          value={this.state.debitAccount}
                          className={classes.textField}
                          name="debitAccount"
                          // onChange={this.handleChange('debitAccount')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.options.debitAccount')}
                          label={names.detailInfo_options_debitAccount}
                          type="number"
                          error={localMessages && localMessages['detailInfo.options.debitAccount']}
                          helperText={localMessages && localMessages['detailInfo.options.debitAccount']}
                          required={checkRequired['detailInfo.options.debitAccount']}
                          checkedShowForm={checkShowForm['detailInfo.options.debitAccount']}
                        />
                        <CustomInputBase
                          value={this.state.customDebitAccount}
                          className={classes.textField}
                          name="customDebitAccount"
                          // onChange={this.handleChange('customDebitAccount')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.options.customDebitAccount')}
                          label={names.detailInfo_options_customDebitAccount}
                          type="number"
                          error={localMessages && localMessages['detailInfo.options.customDebitAccount']}
                          helperText={localMessages && localMessages['detailInfo.options.customDebitAccount']}
                          required={checkRequired['detailInfo.options.customDebitAccount']}
                          checkedShowForm={checkShowForm['detailInfo.options.customDebitAccount']}
                        />
                        <CustomInputBase
                          value={this.state.debtLimit}
                          className={classes.textField}
                          name={names.detailInfo_options_debtLimit}
                          // onChange={this.handleChange('debtLimit')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.options.debtLimit')}
                          label="Hạn mức công nợ"
                          error={localMessages && localMessages['detailInfo.options.debtLimit']}
                          helperText={localMessages && localMessages['detailInfo.options.debtLimit']}
                          required={checkRequired['detailInfo.options.debtLimit']}
                          checkedShowForm={checkShowForm['detailInfo.options.debtLimit']}
                        />
                        <CustomInputBase
                          value={this.state.saleCount}
                          className={classes.textField}
                          name="saleCount"
                          // onChange={this.handleChange('saleCount')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.options.saleCount')}
                          label={names.detailInfo_options_saleCount}
                          type="number"
                          error={localMessages && localMessages['detailInfo.options.saleCount']}
                          helperText={localMessages && localMessages['detailInfo.options.saleCount']}
                          required={checkRequired['detailInfo.options.saleCount']}
                          checkedShowForm={checkShowForm['detailInfo.options.saleCount']}
                        />
                        <CustomInputBase
                          fullWidth
                          value={this.state.debitAge}
                          className={classes.textField}
                          name="debitAge"
                          // onChange={this.handleChange('debitAge')}
                          onChange={e => this.handleChangeCustomer(e, 'detailInfo.options.debitAge')}
                          label={names.detailInfo_options_debitAge}
                          error={localMessages && localMessages['detailInfo.options.debitAge']}
                          helperText={localMessages && localMessages['detailInfo.options.debitAge']}
                          required={checkRequired['detailInfo.options.debitAge']}
                          checkedShowForm={checkShowForm['detailInfo.options.debitAge']}
                        />
                        {/* <FormControlLabel
                          control={
                            <Checkbox
                              style={{ marginLeft: 10 }}
                              checked={this.state.isTaxTitle}
                              onChange={this.handleChangeCheckbox('isTaxTitle')}
                              value="isTaxTitle"
                              color="primary"
                            />
                          }
                          label={names.detailInfo_options_isTaxTitle}
                        />
                        {this.state.isTaxTitle ? (
                          <div>
                            <div style={{ display: 'block' }}>
                              <InputLabel style={{ display: 'inline', verticalAlign: 'middle', marginRight: 20, marginBottom: 30 }}>
                                Thuế 1:{' '}
                              </InputLabel>
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%', display: 'inline', marginRight: 30 }}
                                inputRef={e => {
                                  this.taxName1 = e;
                                  return true;
                                }}
                                name="taxName1"
                                onChange={this.handleChange('taxName1')}
                                label={names.detailInfo_options_taxTitle}
                              />
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%' }}
                                inputRef={e => {
                                  this.taxPercent1 = e;
                                  return true;
                                }}
                                name="taxPercent1"
                                onChange={this.handleChange('taxPercent1')}
                                label="Phần trăm thuế"
                              />
                            </div>
                            <div style={{ display: 'block' }}>
                              <InputLabel style={{ display: 'inline', verticalAlign: 'middle', marginRight: 20, marginBottom: 30 }}>
                                Thuế 2:{' '}
                              </InputLabel>
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%', display: 'inline', marginRight: 30 }}
                                inputRef={e => {
                                  this.taxName2 = e;
                                  return true;
                                }}
                                name="taxName2"
                                onChange={this.handleChange('taxName2')}
                                label={names.detailInfo_options_taxTitle}
                              />
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%' }}
                                inputRef={e => {
                                  this.taxPercent2 = e;
                                  return true;
                                }}
                                name="taxPercent2"
                                onChange={this.handleChange('taxPercent2')}
                                label="Phần trăm thuế"
                              />
                            </div>
                            <div style={{ display: 'block' }}>
                              <InputLabel style={{ display: 'inline', verticalAlign: 'middle', marginRight: 20, marginBottom: 30 }}>
                                Thuế 3:{' '}
                              </InputLabel>
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%', display: 'inline', marginRight: 30 }}
                                inputRef={e => {
                                  this.taxName3 = e;
                                  return true;
                                }}
                                name="taxName3"
                                onChange={this.handleChange('taxName3')}
                                label={names.detailInfo_options_taxTitle}
                              />
                              <TextField
                                fullWidth
                                // value={this.state.fax}
                                style={{ width: '30%' }}
                                inputRef={e => {
                                  this.taxPercent3 = e;
                                  return true;
                                }}
                                name="taxPercent3"
                                onChange={this.handleChange('taxPercent3')}
                                label="Phần trăm thuế"
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )} */}
                      </TabContainer>
                    </SwipeableViews>
                  </GridUI>
                </GridUI>
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                    <Button
                      // type="submit"
                      type="button"
                      onClick={this.onSave}
                      variant="contained"
                      color="primary"

                    >
                      {[intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })]}
                    </Button>
                  </div> */}
                <GridUI item md={12}>
                  <Typography component="p" className={classes.paperTitle} style={{ marginTop: 20 }}>
                    <Edit style={{ fontSize: '20px', marginBottom: 7 }} />{' '}
                    {intl.formatMessage(messages.thongtindaumoi || { id: 'thongtindaumoi', defaultMessage: 'thongtindaumoi' })}
                  </Typography>
                  <DataGrid id="gridContainer" dataSource={this.state.rows} ders repaintChangesOnly>
                    <Paging enabled={false} />
                    <Editing
                      refreshMode="repaint"
                      mode="cell"
                      texts={{ confirmDeleteMessage: intl.formatMessage(messages.xoa || { id: 'xoa', defaultMessage: 'xoa' }) }}
                      allowUpdating
                      allowDeleting
                      allowAdding
                    />
                    <Column type="number" dataField="id" caption="STT" width={55} />
                    <Column dataField="name" caption="Họ tên" />
                    <Column dataField="phoneNumber" caption="SĐT" />
                    <Column dataField="email" caption="Email" />
                    <Column dataField="department" caption="Phòng ban" />
                    <Column dataField="note" caption="Ghi chú" />
                  </DataGrid>
                </GridUI>
              </Paper>
            </ValidatorForm>

            {/* <FormattedMessage {...messages.header} /> */}
          </div>
        )}
        {/* <Comment id={this.props.id ? this.props.id : this.props.match.params.id} code="Customer" /> */}
      </div>
    );
  }

  onLoadSuccess(customerInfo) {
    this.setState({ name: customerInfo.name });
  }

  handleChangeTab = (event, value) => {
    this.setState({ valueForTabs: value });
  };

  handleChangeIndex = index => {
    this.setState({ valueForTabs: index });
  };

  handleChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleChangeName = name => e => {
    const rex = /^([a-zàáâãèéêếìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+)$/i;
    const value = e.target.value.toLowerCase();
    const errorName = !rex.test(value);
    this.setState({ [name]: e.target.value, errorName });
  };

  handleChangeLastName = name => e => {
    const rex = /^[a-zA-Z]+[\s\w]{0,}$/;
    const value = e.target.value;
    const errorLastName = !rex.test(value);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ [name]: e.target.value, errorLastName });
  };

  handleChangeNickName = name => e => {
    const rex = /^[a-zA-Z0-9]+[\s\w]{4,}$/;
    const value = e.target.value;
    const errorNickName = !rex.test(value);
    this.setState({ [name]: e.target.value, errorNickName });
  };

  handleChangeidetityCardNumber = name => e => {
    if (e.target.value < 0) return;
    this.setState({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeProps = name => e => {
    this.props.handleChange({ [name]: e.target.value });
  };

  handleChangeSelect = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSave = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const state = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const listAtt = this.props.listAtt;
    const attributes = {};
    Object.keys(listAtt).forEach(item => {
      if (this.props.addCustomerPage[item] && this.props.addCustomerPage[item].length) attributes[item] = this.props.addCustomerPage[item];
    });

    const data = {
      type: state.type,
      kanbanStatus: state.kanbanStatus,
      others: state.others,
      callback: this.props.callback,
      facebook: state.facebook,
      code: state.code,
      name: state.name,
      lastName: state.lastName,
      nickName: state.nickName,
      phoneNumber: state.phoneNumber,
      email: state.email,
      gender: state.gender,
      birthDay: state.birthDay,
      provincial: state.provincial,
      website: state.website,
      fax: state.fax,
      idetityCardNumber: state.idetityCardNumber,
      passportNumber: state.passportNumber,
      bank: state.bank,
      bankAccountNumber: state.bankAccountNumber,
      taxCode: state.taxCode,
      isTax: state.isTax,
      // address: state.locationAddress,
      address: state.address,

      certifiedNoTaxNumber: state.certifiedNoTaxNumber,
      position: state.position,
      businessRegistrationNumber: state.businessRegistrationNumber,
      managerEmployee: state.managerEmployee ? state.managerEmployee._id : null,
      viewableEmployees: state.peopleCanView.map(item => item._id),
      note: state.note,
      avatar: state.avatar,
      avatarURL: state.avatarURL,
      detailInfo: {
        typeCustomer: {
          typeOfCustomer: state.typeOfCustomer,
          group: state.group,
          branches: state.branches,
          career: state.career,
          productType: state.productType,
          contactWays: state.contactWays,
          areas: state.areas,
          introducedWay: state.introducedWay,
          introPerson: state.introPerson,
          phoneIntroPerson: state.phoneIntroPerson,
          introducedNote: state.introducedNote,
          setAttribute: attributes,
        },
        represent: {
          name: state.representativeName,
          phoneNumber: state.representativePhone,
          gender: state.representativeGender,
          birthDay: moment(state.representativeDob).format('DD/MM/YYYY'),
          email: state.representativeEmail,
          position: state.representativePosition,
          note: state.representativeNote,
          localPersonInfo: state.rows,
        },
        options: {
          debitAccount: state.debitAccount,
          customDebitAccount: state.customDebitAccount,
          debtLimit: state.debtLimit,
          saleCount: state.saleCount,
          debitAge: state.debitAge,
          isTaxTitle: state.isTaxTitle,
          taxTitle: [
            {
              name: 'bac',
              percent: 10,
            },
          ],
        },
      },
    };
    const messages = viewConfigCheckForm('Customer', dot.dot(data));
    if (Object.keys(messages).length === 0) {
      if (id === 'add') {
        this.props.postCustomer(data);
      } else this.props.putCustomer(id, data);
      // this.props.history.goBack();
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };

  // CloseCustomer = () => {
  //   this.props.callback('close');
  // };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleInputChange = e => {
    this.setState({ search: e.target.value, locationAddress: e.target.value });
  };

  handleSelectSuggest = suggest => {
    const lat = suggest.geometry.location.lat();
    const lng = suggest.geometry.location.lng();
    this.setState({ search: '', locationAddress: suggest.formatted_address, location: { lat, lng } });
  };

  handleClickCurrentLocation = () => {
    const { lat, lng } = this.state.location;
    this.getLocationByLatLng(lat, lng, 'default');
  };
  /* eslint-disable */
  onMarkerDragEnd = evt => {
    if (window.google) {
      const cityCircle = new google.maps.Circle({
        strokeColor: '#57aad7',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#69c0ef',
        fillOpacity: 0.35,
        // map,
        // center: this.state.location,
        radius: 50,
      });
      this.state.cityCircle = cityCircle;
    }
    this.getLocationByLatLng(evt.latLng.lat(), evt.latLng.lng());
  };

  /* eslint-enable */
  getLocationByLatLng(latitude, longitude, df = false) {
    const self = this;
    let location = null;
    if (window.navigator && window.navigator.geolocation) {
      location = window.navigator.geolocation;
    }
    if (location) {
      location.getCurrentPosition(position => {
        let lat = latitude;
        let lng = longitude;
        if (df === 'default') {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAXhItM5DtDeNF7uesxuyhEGd3Wb_5skTg`;
        axios.get(url).then(data => {
          const { results } = data.data;
          if (!!results && !!results.length) {
            /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
            /* eslint-disable */
            const { formatted_address } = results[0];
            self.setState({
              locationAddress: formatted_address,
              location: { lat, lng },
            });
          }
        });
      });
    }
  }
}

function TabContainer({ children, dir }) {
  return (
    <GridUI item md={12} sm={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </GridUI>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

AddCustomerPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addCustomerPage: makeSelectAddCustomerPage(),
  listAtt: makeSelectlistAtt(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInfo: id => dispatch(getInfo(id)),
    postCustomer: data => dispatch(postCustomer(data)),
    putCustomer: (id, data) => dispatch(putCustomer(id, data)),
    handleChange: data => dispatch(handleChangeName(data)),
    handleChange: data => dispatch(handleChangeLastName(data)),
    handleChange: data => dispatch(handleChangeNickName(data)),
    handleChangeSelect: e => dispatch(changeSelect(e.target.value)),
    changeExpanded: id => dispatch(changeExpanded(id)),
    getAttribute: () => dispatch(getAttribute()),
    handleChangeAtt: name => event => dispatch(handleChangeAtt({ name: name, value: event.target.value })),
    handleRemove: (name, value) => dispatch(handleChangeAtt({ name, value })),
    handleChecked: name => event => dispatch(handleChangeAtt({ name: name, value: event.target.checked })),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addCustomerPage', reducer });
const withSaga = injectSaga({ key: 'addCustomerPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddCustomerPage);

AddCustomerPage.defaultProps = { callback: false };
