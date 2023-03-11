/**
 *
 * SystemConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { API_E_BILL_PROVIDER_LIST, API_E_BILL_PROVIDER_SEARCH } from '../../config/urlConfig';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import messages from './messages';
import './index.css';
import request from 'utils/request';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  InputLabel,
  // Input,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormLabel,
  FormHelperText,
  AppBar,
  Toolbar,
  Collapse,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { fetchData, serialize } from 'helper';

import { CameraAlt, ExpandLess, ExpandMore, Close } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSystemConfigPage from './selectors';
import IconButton from '@material-ui/core/IconButton';

import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import avatarA from '../../images/avatarCompany.png';
import { updateSysConfAct, createConfigCodeAct, getSysConfAct, resetNoti, getConfigCodeAct, updateSysData } from './actions';
import CustomAppBar from 'components/CustomAppBar';
import logoDefault from '../../images/logo.jpg';
import NumberFormat from 'react-number-format';
/* eslint-disable react/prefer-stateless-function */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};
const options = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

// TT - UPDATE=CREATE CODE - 24
const initialDataConfigCode = [
  {
    value: null, // 1
    name: 'moduleType',
    checked: true,
  },
  {
    value: null,
    checked: false,
    name: 'prefix',
  },
  {
    value: null,
    checked: false,
    name: 'formatDate',
  },
  {
    value: null,
    ckecked: false,
    name: 'numericalOrderFormat',
  },
  {
    value: false,
    checked: false,
    name: 'provincial',
  },
  {
    value: false,
    checked: false,
    name: 'productType',
  },
  {
    value: null,
    checked: false,
    name: 'intermediate',
  },
  {
    value: null,
    checked: false,
    name: 'suffixes',
  },
  {
    value: null,
    checked: false,
    name: 'nickname',
  },
  {
    value: null, // 1/ , 2-
    checked: true,
    name: 'breakCharacter',
  },
];

// TT - UPDATE=CREATE CODE - 23
export class SystemConfigPage extends React.Component {
  state = {
    codeExample: '',
    avatar: null,
    avatarURL: '',
    companyName: '',
    nameDisplay: '',
    website: '',
    email: '',
    holiday: '',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    startDay: 1,
    timeStart: '08:00',
    timeEnd: '17:30',
    daysInWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    language: 'vi',
    mailServer: '',
    passServer: '',
    serviceServer: '',
    smsBrandname: '',
    smsAccount: '',
    smsPass: '',
    errorCompanyName: false,
    errorTitleName: false,
    errorEmail: false,
    open: false,
    openSetupCode: false,
    openSetupBHXH: false,
    openSetupElectronicBill: false,
    openSetupSignature: false,
    dataConfigCode: initialDataConfigCode, // TT - UPDATE=CREATE CODE - 23
    facebook: '',
    zalo: '',
    youtube: '',
    linkedIn: '',
    bankAccount: '',
    daysInWeek: [],
    dataEBill: [],
    electronicBill: {},
    BHXH: {},
    signature: {},
    versionNo: 1
  };

  handleClick = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  handleClickSetupCodeCollapse = () => {
    this.setState(prevState => ({ openSetupCode: !prevState.openSetupCode }));
  };
  handleClickSetupBHXH = () => {
    this.setState(prevState => ({ openSetupBHXH: !prevState.openSetupBHXH }));
  };
  handleClickSetupElectronicBill = () => {
    this.setState(prevState => ({ openSetupElectronicBill: !prevState.openSetupElectronicBill }));
  };
  handleClickSetupSignature = () => {
    this.setState(prevState => ({ openSetupSignature: !prevState.openSetupSignature }));
  };
  componentWillMount() {
    // console.log('state', this.state);
    this.props.onGetConfigCode({ task: 'Task' });
    this.props.onGetConf();
  }

  async componentWillReceiveProps(props) {
    if (props.systemConfigPage !== this.props.systemConfigPage) {
      const { systemConfigPage } = props;
      const { configCode } = systemConfigPage;
      const configCodeDefault = {
        moduleType: null,
        prefix: null,
        formatDate: null,
        numericalOrderFormat: null,
        provincial: false,
        productType: false,
        intermediate: null,
        suffixes: null,
        nickname: null,
        breakCharacter: null,
      };
      const configCodeFull = Object.assign(configCodeDefault, configCode);
      if (configCodeFull.moduleType === 4) {
        configCodeFull.nickname = false;
      }
      if (Object.keys(configCodeFull).length) {
        const defaultDataConfigCode = [...initialDataConfigCode];
        const newDataConfigCode = defaultDataConfigCode.map(item => {
          const newVal = configCodeFull[item.name];
          return {
            value: newVal,
            checked: !!newVal,
            name: item.name,
          };
        });
        await this.setState({ dataConfigCode: newDataConfigCode });
        this.handleCodeFollowDataConfigCode();
      }
      if (systemConfigPage.sysConf) {
        const { sysConf } = systemConfigPage;
        const holiday = sysConf.holidays.join(', ');
        const daysInWeek = sysConf.workingDays.map(item => {
          if (parseInt(item, 10) > 1) {
            return `Thứ ${item}`;
          }
          return 'Chủ nhật';
        });
        this.setState({
          avatarURL: sysConf.logo,
          companyName: sysConf.name,
          nameDisplay: sysConf.displayName,
          website: sysConf.website,
          email: sysConf.email,
          holiday,
          dateFormat: sysConf.dateFomat || '',
          timeFormat: sysConf.timeFomat || '',
          startDay: sysConf.firstDayOfTheWeek - 1,
          timeStart: sysConf.workingTime.start,
          timeEnd: sysConf.workingTime.end,
          mailServer: sysConf.mailServer,
          passServer: sysConf.passServer,
          serviceServer: sysConf.serviceServer,
          smsBrandname: sysConf.smsBrandname,
          smsAccount: sysConf.smsAccount,
          smsPass: sysConf.smsPass,
          daysInWeek,
          language: sysConf.language,
          facebook: sysConf.facebook,
          zalo: sysConf.zalo,
          youtube: sysConf.youtube,
          linkedIn: sysConf.linkedIn,
          bankAccount: sysConf.bankAccount,
          versionNo: sysConf.versionNo
        });
      }
    }
  }

  // systemConfigPage :
  componentDidUpdate() {
    const { systemConfigPage } = this.props;
    if (systemConfigPage) {
      if (systemConfigPage.successUpdate === true || systemConfigPage.successCreateCode === true) {
        this.props.enqueueSnackbar('Thao tác thành công!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
      // if (systemConfigPage.successCreateCode === true) {
      //   this.props.enqueueSnackbar('Thao tác thành công!', {
      //     variant: 'success',
      //     anchorOrigin: {
      //       vertical: 'top',
      //       horizontal: 'right',
      //     },
      //   });
      //   this.props.onReset();
      // }
      if (systemConfigPage.error) {
        this.props.enqueueSnackbar('Thao tác thất bại!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
    }
  }

  // TT - UPDATE=CREATE CODE - 5
  // TT 1.2 - ONCHANGE - INPUT
  handleChangeInputForConfigCode = e => {
    const val = e.target.value;
    const name = e.target.name;

    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          if (item.name === name) {
            return { ...item, value: val };
          }
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 6
      () => this.handleCodeFollowDataConfigCode(),
    );
    // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
    if (e.target.name === 'moduleType') {
      const body = { task: null };
      switch (e.target.value) {
        case 1:
          body.task = 'Task';
          break;
        case 2:
          body.task = 'Contract';
          break;
        case 3:
          body.task = 'Customer';
          break;
        case 4:
          body.task = 'Supplier';
          break;
        case 5:
          body.task = 'SalesQuotation';
          break;
        default:
          break;
      }
      // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
      if (body) {
        this.props.onGetConfigCode(body);
      }
    }
  };

  // TT - UPDATE=CREATE CODE - 2
  // TT 1.1 - ONCHANGE - CHECK BOX truyen len fieldName : thay đổi checked dataConfigCode - fieldName truyền lên
  handleCheckBoxConfigCode = fieldName => {
    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          // nếu là dataConfigCode.item - fieldName truyen len :
          // toggle checked cua dataConfigCode.item (default : checked= false,) (THAY DOI - ITEM do)
          if (item.name === fieldName) {
            if (fieldName === 'nickname' || fieldName === 'provincial' || fieldName === 'productType') {
              return { ...item, checked: !item.checked, value: !item.checked }; // vi nickname bi DISABLE - khong bat ONCHANGE
            }
            return { ...item, checked: !item.checked };
          }
          // nếu khong phai là dataConfigCode.item - fieldName truyen len : thi tra ve ITEM cu (KO DOI)
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 3
      () => this.handleCodeFollowDataConfigCode(), // CB
    );
  };

  // TT - UPDATE=CREATE CODE - 4
  // TT 2 - ONCHANGE : để hiển thị : state codeExample.
  handleCodeFollowDataConfigCode = () => {
    // loc ITEM cua - dataConfigCode : ko phải moduleType,breakCharacter,null,'' (KO NỐI VÀO CHUỖI - codeExample)
    const data = this.state.dataConfigCode.filter(
      item => item.checked === true && item.name !== 'moduleType' && item.name !== 'breakCharacter' && item.value !== null && item.value !== '',
    );
    // NỐI CHUỖI - codeExample : sau do SETSTATE
    this.setState(prevState => ({
      codeExample: data
        .map(item => {
          if (item.name === 'formatDate') {
            if (item.value === 1) {
              return '01122021';
            }
            if (item.value === 2) {
              return '20211201';
            }
            if (item.value === 3) {
              return '12012021';
            }
          }
          if (item.name === 'numericalOrderFormat') {
            if (item.value === 1) {
              return '01';
            }
            if (item.value === 2) {
              return '001';
            }
            if (item.value === 3) {
              return '0001';
            }
          }
          if (item.name === 'nickname') {
            if (item.value === true) {
              return 'BIET DANH';
            }
            return '';
          }
          return item.value;
        })
        .join(
          prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 2
            ? '-'
            : prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 1
              ? '/'
              : '',
        ),
      // .join(prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value),
    }));
  };
  handleChange = event => {
    const value = event.target.value;
    // if (value[value.length - 1] === 'all') {
    //   setSelected(this.daysInWeek.length === options.length ? [] : options);
    //   return;
    // }
    this.setState({ [event.target.name]: event.target.value });
  };
  onGoBack = () => {
    this.props.history.push('/Kpi');
    // window.location.reload();
  };
  searchData = () => { };
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { electronicBill } = this.state
  //   if (prevState.electronicBill.providerName !== this.state.electronicBill.providerName && this.state.openSetupElectronicBill && (electronicBill.providerName !== null && electronicBill.providerName !== undefined)) {
  //     const token = localStorage.getItem('token');
  //     fetchData(`${API_Info_Repo_FIND}?serviceName=${electronicBill.serviceName}&providerName=${electronicBill.providerName}`, "GET", null).then(res => {
  //       console.log(res)
  //     })
  //   }
  // }
  componentDidMount() {
    const datas = fetchData(`${API_E_BILL_PROVIDER_LIST}`, 'GET', null).then(res => {
      this.setState({ dataEBill: res.data });
    });
  }
  render() {
    const isAllSelected = options.length > 0 && this.state.daysInWeek.length === options.length;
    const { classes, intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 6, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'config'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Cấu hình chung' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cấu hình chung' })}`
          }
          disableClose
          onGoBack={this.onGoBack}
          onSubmit={this.onSubmit}
        />
        <Helmet>
          <title>Cấu hình hệ thống</title>
          <meta name="description" content="Cấu hình hệ thống" />
        </Helmet>
        <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting">
              Thiết lập
            </Link>
            <Typography color="textPrimary">Cấu hình chung</Typography>
          </Breadcrumbs>
        </Paper>
        <Grid container style={{ marginTop: 50 }}>
          <Grid justify="center" md={6}>
            <Paper container direction="row" justify="center" alignItems="center">
              <FormControl className={classes.textField} error>
                <TextField
                  label="Tên công ty"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.companyName}
                  name="companyName"
                  margin="normal"
                  variant="outlined"
                // InputLabelProps={{
                //   shrink: true,
                // }}
                />
                {this.state.errorCompanyName ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -3 }}>
                    Tên công ty không được để trống
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <FormControl className={classes.textField} error>
                <TextField
                  label="Tên công ty hiển thị trên thanh tiêu đề"
                  onChange={this.handleChangeInput}
                  style={{ marginTop: '10px' }}
                  // className={classes.textField}
                  value={this.state.nameDisplay}
                  name="nameDisplay"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="displayName"
                />
                {this.state.errorTitleName ? (
                  <FormHelperText id="component-error-text1">Tên công ty hiển thị trên thanh tiêu đề không được để trống</FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <TextField
                label="Tên website"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.website}
                name="website"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Địa chỉ Facebook"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.facebook}
                name="facebook"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Địa chỉ Zalo"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.zalo}
                name="zalo"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Địa chỉ Youtube"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.youtube}
                name="youtube"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Địa chỉ LinkedIn"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.linkedIn}
                name="linkedIn"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Tài khoản ngân hàng"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.bankAccount}
                name="bankAccount"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <FormControl className={classes.textField} error>
                <TextField
                  label="Email administrator : "
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.email}
                  name="email"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
                {this.state.errorEmail ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -2 }}>
                    Email sai định dạng
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20 }}>Định dạng ngày tháng</InputLabel> */}
              <TextField
                select
                label="Định dạng ngày tháng"
                variant="outlined"
                className={classes.CustomInputBase}
                value={this.state.dateFormat}
                name="dateFormat"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select-checkbox" />}
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              </TextField>

              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" style={{ fontSize: 12 }}>
                  Định dạng thời gian
                </FormLabel>
                <RadioGroup
                  aria-label="timeFormat"
                  name="timeFormat"
                  className={classes.group}
                  value={this.state.timeFormat}
                  onChange={this.handleChangeInput}
                >
                  <FormControlLabel value="12h" control={<Radio />} label="12 giờ" />
                  <FormControlLabel value="24h" control={<Radio />} label="24 giờ" />
                </RadioGroup>
              </FormControl>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, display: 'block' }}>Ngày đầu tiên trong tuần</InputLabel> */}
              <TextField
                select
                label="Ngày đầu tiên trong tuần"
                variant="outlined"
                className={classes.textField}
                value={this.state.startDay}
                name="startDay"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select" />}
              >
                <MenuItem value={0}>Chủ nhật</MenuItem>
                <MenuItem value={1}>Thứ 2</MenuItem>
              </TextField>
              <Grid container justify="flex-start" className={classes.textField}>
                <FormLabel component="legend" style={{ fontSize: 12, marginTop: 40, marginRight: 20 }}>
                  Thời gian làm việc:
                </FormLabel>
                <TextField
                  onChange={this.handleChangeInput}
                  variant="outlined"
                  type="time"
                  // className={classes.textField}
                  name="timeStart"
                  value={this.state.timeStart}
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
                <span style={{ fontSize: 12, marginTop: 35, marginLeft: 20, marginRight: 20 }}>&nbsp;đến</span>
                <TextField
                  onChange={this.handleChangeInput}
                  type="time"
                  variant="outlined"
                  value={this.state.timeEnd}
                  // className={classes.textField}
                  name="timeEnd"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </Grid>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20, display: 'block' }}>Ngày trong tuần</InputLabel> */}
              {/* <TextField
                select
                label="Ngày trong tuần"
                variant="outlined"
                multiple
                value={this.state.daysInWeek}
                name="daysInWeek"
                className={classes.textField}
                onChange={this.handleChangeInput}
                // input={<Input id="select-multiple-checkbox" />}
                renderValue={daysInWeek => daysInWeek.join(', ')}
                MenuProps={MenuProps}
                input={<OutlinedInput labelWidth={0} id="select-multiple-checkbox" />}
              >
                <MenuItem value="Thứ 2">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 2') > -1} />
                  <ListItemText primary="Thứ 2" />
                </MenuItem>
                <MenuItem value="Thứ 3">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 3') > -1} />
                  <ListItemText primary="Thứ 3" />
                </MenuItem>
                <MenuItem value="Thứ 4">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 4') > -1} />
                  <ListItemText primary="Thứ 4" />
                </MenuItem>
                <MenuItem value="Thứ 5">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 5') > -1} />
                  <ListItemText primary="Thứ 5" />
                </MenuItem>
                <MenuItem value="Thứ 6">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 6') > -1} />
                  <ListItemText primary="Thứ 6" />
                </MenuItem>
                <MenuItem value="Thứ 7">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 7') > -1} />
                  <ListItemText primary="Thứ 7" />
                </MenuItem>
                <MenuItem value="Chủ nhật">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Chủ nhật') > -1} />
                  <ListItemText primary="Chủ nhật" />
                </MenuItem>
              </TextField> */}
              <FormControl className={classes.formControl} style={{ paddingRight: '2.5rem' }} variant="outlined" fullWidth>
                <InputLabel shrink={true} style={{ backgroundColor: '#ffffff', padding: 2 }}>
                  Ngày trong tuần
                </InputLabel>
                <Select
                  labelId="demo-mutiple-chip-label"
                  multiple
                  value={this.state.daysInWeek}
                  onChange={this.handleChange}
                  renderValue={daysInWeek => daysInWeek.join(', ')}
                  MenuProps={MenuProps}
                  name="daysInWeek"
                  input={<OutlinedInput label="Ngày trong tuần" />}
                >
                  {options.map(option => (
                    <MenuItem key={option} value={option}>
                      <ListItemIcon>
                        <Checkbox checked={(this, this.state.daysInWeek.indexOf(option) > -1)} />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ngày nghỉ(định dạng: dd/mm/yyyy, mỗi ngày cách nhau bởi một dấu phẩy): "
                onChange={this.handleChangeInput}
                className={classes.textField}
                name="holiday"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
                value={this.state.holiday}
              // InputLabelProps={{
              //   shrink: true,
              // }}
              />
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20, display: 'block' }}>Ngôn ngữ</InputLabel> */}
              <TextField
                select
                label="Ngôn ngữ"
                variant="outlined"
                className={classes.textField}
                value={this.state.language}
                name="language"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select-language" />}
              >
                <MenuItem value="vi">Việt Nam</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </TextField>
              <NumberFormat
                // error={!SMS.to}
                // helperText={SMS.to ? false : 'Không được bỏ trống'}
                label="Số hiệu phiên bản"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleChangeInput}
                name="versionNo"
                value={this.state.versionNo}
                margin="normal"
                customInput={CustomInputBase}
                allowNegative={false}
                decimalSeparator={null}
                style={{
                  width: "95%",
                  marginLeft: "3%"
                }}
              />
              <TextField disabled />
              {/* <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.button}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button}>
                Hủy
              </Button> */}

            </Paper>
          </Grid>
          <Grid style={{ height: '100%' }} md={6} justify="center" container flexWrap="wrap" className="avatar">
            <Avatar style={{ width: 300, height: 300 }} src={logoDefault} className={classes.avatar} srcSet={this.state.avatarURL} />
            <input
              className={classes.textFieldAva}
              onChange={this.onSelectImg}
              accept="image/*"
              name="avatar"
              type="file"
              style={{ cursor: 'pointer', opacity: 0, width: '300px', position: 'absolute', zIndex: '999', margin: '0px' }}
            />
            <span className={classes.spanAva}>
              <CameraAlt className={classes.iconCam} />
            </span>
            <Grid container justify="center">
              <span>Logo công ty </span>
            </Grid>
            <Grid container justify="center">
              <span>(Nhấp vào ảnh để thay đổi logo công ty)</span>
            </Grid>

            {/* TASK 1 - DIEN GIA TRI CHECKED */}
            <Grid container style={{ padding: 10 }}>
              <ListItem button onClick={() => this.handleClick()}>
                <ListItemIcon>
                  <Typography variant="body1">Sms và Email</Typography>
                </ListItemIcon>
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper container direction="row" justify="center" alignItems="center">
                <Collapse style={{ width: '100%', padding: 20 }} in={this.state.open} timeout={0} unmountOnExit>
                  <TextField
                    name="smsBrandname"
                    value={this.state.smsBrandname}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="smsBrandname"
                  />
                  <TextField
                    name="smsAccount"
                    value={this.state.smsAccount}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="smsAccount"
                  />
                  <TextField
                    name="smsPass"
                    value={this.state.smsPass}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="smsPass"
                  />
                  <TextField
                    name="serviceServer"
                    value={this.state.serviceServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="Service Server"
                  />
                  <TextField
                    name="mailServer"
                    value={this.state.mailServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="Mail Server"
                  />
                  <TextField
                    name="passServer"
                    value={this.state.passServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="Password Server"
                  />
                </Collapse>
              </Paper>

              <ListItem button onClick={() => this.handleClickSetupCodeCollapse()}>
                <ListItemIcon>
                  <Typography variant="body1">Cấu hình tạo mã hệ thống</Typography>
                </ListItemIcon>
                {this.state.openSetupCode ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupCode} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  {/* <Button variant="contained" color="primary" style={{ margin: 10, 'margin-left': 0 }}>
                    Thêm mới
                  </Button> */}
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>MODULE ÁP DỤNG</InputLabel>
                  <Select
                    className={classes.textField}
                    style={{ 'margin-left': 0, width: '100%' }}
                    // TT - UPDATE=CREATE CODE - 25
                    value={this.state.dataConfigCode.find(item => item.name === 'moduleType').value}
                    name="moduleType"
                    onChange={this.handleChangeInputForConfigCode}
                    input={<OutlinedInput labelWidth={0} id="select-language" />}
                  >
                    <MenuItem value={1}>Dự Án</MenuItem>
                    <MenuItem value={2}>Hợp Đồng</MenuItem>
                    <MenuItem value={3}>Khách Hàng</MenuItem>
                    <MenuItem value={4}>Nhà Cung Cấp</MenuItem>
                    <MenuItem value={5}>Báo Giá</MenuItem>
                  </Select>
                  <div className={classes.checkboxGroup}>
                    <TextField
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'prefix').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      name="prefix"
                      margin="normal"
                      variant={this.state.dataConfigCode.find(item => item.name === 'prefix').checked ? 'outlined' : 'filled'}
                      fullWidth
                      label="TIỀN TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('prefix')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>ĐỊNH DẠNG NGÀY</InputLabel>
                  <div className={classes.checkboxGroup}>
                    <Select
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? classes.textField : classes.disabledSelect
                      }
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'formatDate').value}
                      name="formatDate"
                      // variant={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? 'outlined' : 'filled'}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                    >
                      <MenuItem value={1}>DD/MM/YYYY</MenuItem>
                      <MenuItem value={2}>YYYY/MM/DD</MenuItem>
                      <MenuItem value={3}>MM/DD/YYYY</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('formatDate')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>ĐỊNH DẠNG SỐ THỨ TỰ</InputLabel>
                  <div className={classes.checkboxGroup}>
                    <Select
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 4
                      value={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').value}
                      // TT - UPDATE=CREATE CODE - 25
                      name="numericalOrderFormat"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      onChange={this.handleChangeInputForConfigCode}
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked
                          ? classes.textField
                          : classes.disabledSelect
                      }
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>2 Chữ số</MenuItem>
                      <MenuItem value={2}>3 Chữ số</MenuItem>
                      <MenuItem value={3}>4 Chữ số</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('numericalOrderFormat')}
                      color="primary"
                    />
                  </div>
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 3 ? (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'KHU VỰC' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="provincial"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="KHU VỰC"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'provincial').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('provincial');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 2 ? (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="productType"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'productType').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="LOẠI SẢN PHẨM"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'productType').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('productType');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'intermediate').value}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="intermediate"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="TRUNG TỐ"
                        disabled={!this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('intermediate');
                        }}
                        color="primary"
                      />
                    </div>
                  )}

                  <div className={classes.checkboxGroup}>
                    <TextField
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'suffixes').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      margin="normal"
                      name="suffixes"
                      fullWidth
                      variant={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked ? 'outlined' : 'filled'}
                      label="HẬU TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('suffixes')}
                      color="primary"
                    />
                  </div>
                  {/* NICKNAME */}
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value !== 4 && (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'nickname').value ? 'BIET DANH' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        margin="normal"
                        name="nickname"
                        variant="filled"
                        fullWidth
                        label="BIỆT DANH"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'nickname').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => this.handleCheckBoxConfigCode('nickname')}
                        color="primary"
                      />
                    </div>
                  )}

                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>KÍ TỰ NGẮT</InputLabel>
                  <div className={classes.exampleCodeGroup}>
                    <Select
                      className={classes.textField}
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'breakCharacter').value}
                      name="breakCharacter"
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>/</MenuItem>
                      <MenuItem value={2}>-</MenuItem>
                    </Select>
                    <TextField
                      style={{ margin: 0 }}
                      disabled
                      value={this.state.codeExample}
                      margin="normal"
                      variant="filled"
                      fullWidth
                      label="ĐỊNH DẠNG MÃ"
                    />
                  </div>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end', marginTop: 20 }}>
                    <Button variant="outlined" color="primary" onClick={this.onSubmitSaveConfigCode}>
                      Lưu
                    </Button>
                    <Button variant="outlined" color="secondary" style={{ marginLeft: 10 }} onClick={() => this.handleClickSetupCodeCollapse()}>
                      Hủy
                    </Button>
                  </Grid>
                  {/* <div className={classes.groupBtnForAction}> */}
                  {/* // TT - UPDATE=CREATE CODE - 8 - SUBMIT - SEND DATA */}
                  {/* <Button variant="outlined" color="primary" onClick={this.onSubmitSaveConfigCode}>
                      Lưu
                    </Button>
                    <Button variant="outlined">Hủy</Button> */}
                  {/* </div> */}
                </Collapse>
              </Paper>
              {/* hóa đơn điện tử */}
              <ListItem button onClick={() => this.handleClickSetupElectronicBill()}>
                <ListItemIcon>
                  <Typography variant="body1">Hóa đơn điện tử</Typography>
                </ListItemIcon>
                {this.state.openSetupElectronicBill ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupElectronicBill} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  <Grid item xs={12} md={12} xl={12}>
                    <CustomInputBase
                      select
                      label="Hóa đơn điện tử"
                      value={this.state.electronicBill.agencyCode}
                      name="agencyCode"
                      onChange={e => this.handleChangeInputelectronicBill(e)}
                    >
                      {this.state.dataEBill && this.state.dataEBill.map(el => {
                        return (
                          <MenuItem key={el.agencyCode} value={el.agencyCode}>
                            {el.agencyCode}
                          </MenuItem>
                        );
                      })}
                    </CustomInputBase>
                    <CustomInputBase
                      label="Tài khoản"
                      name="username"
                      value={this.state.electronicBill.username}
                      onChange={e => this.handleChangeInputelectronicBill(e)}
                    />
                    <CustomInputBase
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      value={this.state.electronicBill.password}
                      onChange={e => this.handleChangeInputelectronicBill(e)}
                    />
                    <CustomInputBase
                      label="Thông tin thứ 3"
                      name="thirdInfo"
                      value={this.state.electronicBill.thirdInfo}
                      onChange={e => this.handleChangeInputelectronicBill(e)}
                    />
                  </Grid>
                  {this.state.openSetupElectronicBill &&
                    !this.state.openSetupBHXH &&
                    !this.state.openSetupSignature && (
                      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                        {/* <div className={classes.groupBtnForAction}> */}
                        <Button variant="outlined" color="primary" onClick={this.onSubmitSaveData}>
                          Lưu
                        </Button>
                        <Button variant="outlined" color="secondary" style={{ marginLeft: 10 }} onClick={() => this.handleClickSetupElectronicBill()}>
                          Hủy
                        </Button>
                        {/* </div> */}
                      </Grid>
                    )}
                </Collapse>
              </Paper>
              {/* BHXH */}
              <ListItem button onClick={() => this.handleClickSetupBHXH()}>
                <ListItemIcon>
                  <Typography variant="body1"> BHXH</Typography>
                </ListItemIcon>
                {this.state.openSetupBHXH ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupBHXH} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  <Grid item xs={12}>
                    <CustomInputBase
                      select
                      label="BHXH"
                      value={this.state.BHXH.providerName}
                      name="providerName"
                      onChange={e => this.handleChangeInputBHXH(e)}
                    >
                      <MenuItem key={'NhanTho'} value={'NhanTho'}>
                        Nhân Thọ
                      </MenuItem>
                      <MenuItem key={'PhucTho'} value={'PhucTho'}>
                        Phúc Thọ
                      </MenuItem>
                      <MenuItem key={'TuNguyen'} value={'TuNguyen'}>
                        Tu Nguyen
                      </MenuItem>
                      <MenuItem key={'BatBuoc'} value={'BatBuoc'}>
                        Bat Buoc
                      </MenuItem>
                    </CustomInputBase>
                    <CustomInputBase label="Mã BHXH" name="code" value={this.state.BHXH.code} onChange={e => this.handleChangeInputBHXH(e)} />
                    <CustomInputBase
                      label="Chủ sở hữu"
                      name="ownerName"
                      value={this.state.BHXH.ownerName}
                      onChange={e => this.handleChangeInputBHXH(e)}
                    />
                  </Grid>
                  {((this.state.openSetupElectronicBill && this.state.openSetupBHXH && !this.state.openSetupSignature) ||
                    (!this.state.openSetupElectronicBill && this.state.openSetupBHXH && !this.state.openSetupSignature)) && (
                      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                        {/* <div className={classes.groupBtnForAction}> */}
                        <Button variant="outlined" color="primary" onClick={this.onSubmitSaveData}>
                          Lưu
                        </Button>
                        <Button variant="outlined" color="secondary" style={{ marginLeft: 10 }} onClick={() => this.handleClickSetupBHXH()}>
                          Hủy
                        </Button>
                        {/* </div> */}
                      </Grid>
                    )}
                </Collapse>
              </Paper>
              {/* Chữ ký số */}
              <ListItem button onClick={() => this.handleClickSetupSignature()}>
                <ListItemIcon>
                  <Typography variant="body1">Chữ ký số</Typography>
                </ListItemIcon>
                {this.state.openSetupSignature ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupSignature} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  <Grid item xs={12}>
                    <CustomInputBase
                      select
                      label="Chữ ký số"
                      value={this.state.signature.providerName}
                      name="providerName"
                      onChange={e => this.handleChangeInputSignature(e)}
                    >
                      <MenuItem key={'VNPT-CA'} value={'VNPT-CA'}>
                        VNPT-CA
                      </MenuItem>
                      <MenuItem key={'CA2'} value={'CA2'}>
                        CA2
                      </MenuItem>
                      <MenuItem key={'FPT-CA'} value={'FPT-CA'}>
                        FPT-CA
                      </MenuItem>
                    </CustomInputBase>
                    <CustomInputBase
                      label="public Key"
                      name="publicKey"
                      value={this.state.signature.publicKey}
                      onChange={e => this.handleChangeInputSignature(e)}
                    />
                    <Grid>
                      <CustomInputBase
                        label="private Key"
                        name="privateKey"
                        value={this.state.signature.privateKey}
                        onChange={e => this.handleChangeInputSignature(e)}
                      />
                    </Grid>
                  </Grid>
                  {this.state.openSetupSignature && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                      {/* <div className={classes.groupBtnForAction}> */}
                      <Button variant="outlined" color="primary" onClick={this.onSubmitSaveData}>
                        Lưu
                      </Button>
                      <Button variant="outlined" color="secondary" style={{ marginLeft: 10 }} onClick={() => this.handleClickSetupSignature()}>
                        Hủy
                      </Button>
                      {/* </div> */}
                    </Grid>
                  )}
                </Collapse>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  onSubmit = () => {
    const {
      avatar,
      companyName,
      nameDisplay,
      website,
      email,
      dateFormat,
      timeFormat,
      startDay,
      timeStart,
      avatarURL,
      timeEnd,
      daysInWeek,
      language,
      holiday,
      mailServer,
      serviceServer,
      passServer,
      smsBrandname,
      smsAccount,
      smsPass,
      facebook,
      youtube,
      zalo,
      linkedIn,
      bankAccount,
      versionNo
    } = this.state;
    const workDay = [];
    daysInWeek.forEach(item => {
      if (item === 'Chủ nhật') {
        workDay.push('1');
      } else {
        workDay.push(item[item.length - 1]);
      }
    });
    const firstDayOfTheWeek = startDay + 1;
    const restDay = holiday.split(',').map(item => item.trim());
    const rex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (companyName === '' || nameDisplay === '') {
      if (companyName === '') {
        this.setState({ errorCompanyName: true });
      }
      if (nameDisplay === '') {
        this.setState({ errorTitleName: true });
      }
    } else if (email && !rex.test(email.trim()) || email === '') {
      this.setState({ errorEmail: true });
    } else {
      const body = {
        firstDayOfTheWeek,
        name: companyName,
        displayName: nameDisplay,
        website,
        email,
        avatar,
        avatarURL,
        language,
        holidays: restDay,
        workingDay: workDay,
        workingTime: {
          start: timeStart,
          end: timeEnd,
        },
        timeFormat,
        agencyCode: this.state.electronicBill.agencyCode ? this.state.electronicBill.agencyCode : null,
        dateFormat,
        mailServer,
        serviceServer,
        passServer,
        smsBrandname,
        smsAccount,
        smsPass,
        facebook,
        zalo,
        youtube,
        linkedIn,
        bankAccount,
        versionNo
      };
      this.props.onUpdate(body);
    }
  };

  onSubmitSaveConfigCode = () => {
    const { dataConfigCode } = this.state;

    const body = dataConfigCode.reduce((map, obj) => {
      if (obj.checked === true && obj.value) {
        map[obj.name] = obj.value;
      }
      return map;
    }, {});
    this.props.onCreateConfigCode(body);
  };

  onSubmitSaveData = () => {
    const { electronicBill, BHXH, signature } = this.state;
    electronicBill.rememberClient = true;
    electronicBill.singleSignIn = true;
    if (this.state.openSetupElectronicBill) {
      this.props.onUpdateService({ ...electronicBill });
    }
  };
  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // avatar: e.target.files[0]
  };
  // handleChangeInputelectronicBill = (e) => {
  //   let { electronicBill } = this.state
  //   electronicBill = {
  //     ...electronicBill,
  //     [e.target.name]: e.target.value,
  //   }
  //   this.setState({ electronicBill })
  // }
  handleChangeInputelectronicBill = async e => {
    let { electronicBill } = this.state;
    electronicBill = {
      ...electronicBill,
      [e.target.name]: e.target.value,
    };
    if (e.target.name === 'agencyCode' && e.target.value !== undefined) {
      await fetchData(`${API_E_BILL_PROVIDER_SEARCH}?${e.target.name}=${e.target.value}`, 'GET', null).then(res => {
        if (res.status === 1) {
          const data = res.data.config;
          electronicBill = {
            ...electronicBill,
            ...data,
          };
        } else electronicBill = {};
      });
    }
    this.setState({ electronicBill });
  };
  handleChangeInputBHXH = e => {
    let { BHXH } = this.state;
    BHXH = {
      ...BHXH,
      [e.target.name]: e.target.value,
    };
    this.setState({ BHXH });
  };

  handleChangeInputSignature = e => {
    let { signature } = this.state;
    signature = {
      ...signature,
      [e.target.name]: e.target.value,
    };
    this.setState({ signature });
  };
  handleChangeInput = e => {
    if (e.target.name === 'email' || e.target.name === 'nameDisplay' || e.target.name === 'companyName') {
      if (e.target.name === 'email') {
        this.setState({ errorEmail: false });
      }
      if (e.target.name === 'nameDisplay') {
        this.setState({ errorTitleName: false });
      }
      if (e.target.name === 'companyName') {
        this.setState({ errorCompanyName: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

SystemConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

// TT - UPDATE=CREATE CODE - 19
const mapStateToProps = createStructuredSelector({
  systemConfigPage: makeSelectSystemConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdate: body => {
      dispatch(updateSysConfAct(body));
    },
    onUpdateService: data => {
      dispatch(updateSysData(data));
    },
    // TT
    // TT - UPDATE=CREATE CODE - 11
    onCreateConfigCode: body => {
      dispatch(createConfigCodeAct(body));
    },
    onGetConfigCode: body => {
      dispatch(getConfigCodeAct(body));
    },
    onGetConf: () => {
      dispatch(getSysConfAct());
    },
    onReset: () => {
      dispatch(resetNoti());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'systemConfigPage', reducer });
const withSaga = injectSaga({ key: 'systemConfigPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(SystemConfigPage);
