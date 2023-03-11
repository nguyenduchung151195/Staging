/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddAdvancePage
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
  withStyles,
  Grid,
  Paper,
  TextField,
  // MenuItem,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  DialogTitle,
  Fab,
  MenuItem,
} from '@material-ui/core';
import { AsyncAutocomplete } from '../../components/LifetekUi';
import { Add, Edit, Delete, Close } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddAdvancePage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { getCommandAct, createAdvanceRecordAct, resetNotiAct, getAdvanceRecordByIdAct, updateAdvanceRecordAct } from './actions';
import { provinceData } from '../../utils/provinceData';
import LoadingIndicator from '../../components/LoadingIndicator';
import { changeSnackbar } from '../Dashboard/actions';
import { API_USERS, API_BOS } from '../../config/urlConfig';
import { convertDatetimeToDate, getLabelName, viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from '../../utils/common';
import dot from 'dot-object';
import CustomInputBase from '../../components/Input/CustomInputBase';
import messages from './messages';
import { injectIntl } from 'react-intl';
import CustomAppBar from 'components/CustomAppBar';
import KanbanStepper from '../../components/KanbanStepper';

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddAdvancePage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.addItemBtn = React.createRef();
    const moduleCode = 'AdvanceRequire';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      errorCommand: false,
      tax: null,
      commandChoose: {},
      code: `TA - ${new Date() * 1}`,
      paymentExpiration: date,
      advanceDate: date,
      currentItem: {
        content: '',
        amount: 0,
        province: '',
        provinceCode: '',
      },
      // advancePerson: {
      //   name: '',
      //   employeeId: '',
      // },
      advancePerson: '',
      createdBy: {
        name: '',
        employeeId: '',
      },
      name: '',
      items: [],
      open: false,
      errorProvince: false,
      provinceList: [],
      provinceChoose: {},
      isEditItem: -1,
      commandList: [],
      isEditPage: false,
      fieldAdded: [],
      statusList: [
        {
          code: 0,
          name: 'Yêu cầu phê duyệt',
        },
        {
          code: 1,
          name: 'Đã phê duyệt',
        },
        {
          code: 2,
          name: 'Không phê duyệt',
        },
        {
          code: 3,
          name: 'Không cần phê duyệt',
        },

        {
          code: 4,
          name: 'Đã hoàn thành',
        },
      ],
      state: 0,
      note: '',
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
      commandNumber: null,
      listKanbanStatus: [],
      kanbanStatus: '',
      disableAdd: false,
    };
  }

  getMessages() {
    const {
      commandChoose,
      note,
      createdBy,
      code,
      paymentExpiration,
      advanceDate,
      items,
      tax,
      name,
      employee,
      isEditPage,
      commandNumber,
      fieldAdded,
    } = this.state;
    // const businessOpportunitiesRaw = {
    //   name: businessOpportunities.name,
    //   businessOpportunitiesId: businessOpportunities._id,
    // };
    // const advancePerson = {
    //   name: employee.name,
    //   employeeId: employee._id,
    // };
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const body = {
      name,
      // : businessOpportunitiesRaw,
      code,
      commandNumber: commandChoose && commandChoose.name,
      advancePerson: employee,
      advanceDate,
      state: this.state.state,
      paymentExpiration,
      items,
      others,
      createdBy,
      note,
      tax,
    };
    const data = dot.dot(body);
    const messages = viewConfigCheckForm(this.state.moduleCode, dot.dot(data));
    this.setState({
      localMessages: messages,
    });
  }

  componentWillMount() {
    this.props.onGetCommand();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetAdvanceRecordById(match.params.id);
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }

  async componentDidMount() {
    const provinceList = [];
    const provinceDataRaw = JSON.parse(provinceData);
    const keys = Object.keys(provinceDataRaw);
    keys.forEach((item, index) => {
      provinceList.push({
        label: provinceDataRaw[item].name,
        value: index + 1,
      });
    });
    this.setState({ provinceList });
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig')) || [];
    const currentViewConfig = listViewConfig.find(item => item.code === 'AdvanceRequire');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    if (this.props.dashboardPage.profile) {
      this.state.createdBy = {
        employeeId: this.props.dashboardPage.profile._id,
        name: this.props.dashboardPage.profile.name,
      };
    }
    const { addAdvancePage } = this.props;
    if (addAdvancePage) {
      const messages = viewConfigCheckForm(this.state.moduleCode, addAdvancePage);
      this.setState({
        localMessages: messages,
      });
    }
    this.getMessages();
    try {
      const listKanBan = await JSON.parse(localStorage.getItem('crmStatus')) || [];
      let listKanbanStatus = listKanBan.find(p => p.code === 'ST254') || {}
      this.setState({ listKanbanStatus: listKanbanStatus && listKanbanStatus.data || [] })

      if (!this.state.isEditPage && listKanbanStatus && listKanbanStatus.data && Array.isArray(listKanbanStatus.data) && listKanbanStatus.data.length) {
        // kanbanStatus
        this.setState({ kanbanStatus: listKanbanStatus.data[0]._id })
      }
    } catch (error) {
      console.log(error, 'error')
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { addAdvancePage, location } = props;
      const listData = location && location.state && location.state.dataItem;
      const list = addAdvancePage.allCommand || [];
      const recordList = addAdvancePage.advanceList || [];
      if (recordList.length > 0) {
        const commandList = [];
        list.forEach(item => {
          const x = recordList.findIndex(n => n.commandNumber === item.name);
          if (x === -1) {
            commandList.push({
              label: item.name,
              value: item._id,
              ...item,
            });
          }
        });
        this.setState({ commandList });
      } else {
        const commandList = [];
        list.forEach(item => {
          commandList.push({
            label: item.name,
            value: item._id,
            ...item,
          });
        });
        this.setState({ commandList });
      }
      const { recordSelected } = addAdvancePage;
      if (this.state.isEditPage) {
        // const x = list.findIndex(item => item.name === listData.commandNumber);
        // if (x > -1) {
        //   this.state.commandChoose = list[x];
        //   this.state.commandChoose.label = this.state.commandChoose ? this.state.commandChoose.name : '';
        //   this.state.commandChoose.value = this.state.commandChoose ? this.state.commandChoose._id : '';
        // } else {
        //   this.props.onChangeSnackbar({ status: true, message: 'Công lệnh đã bị xóa!', variant: 'error' });
        // }
        this.state.code = listData && listData.code;
        this.state.name = listData && listData.name || '';
        if (listData && listData['advancePerson.name'] && listData['advancePerson.employeeId']) {
          const advancePerson = {
            name: listData && listData['advancePerson.name'] || '',
            employeeId: listData && listData['advancePerson.employeeId'] || ''
          }
          this.state.advancePerson = advancePerson
        }

        // this.state.advancePerson.name = listData['advancePerson.name'] || '';
        // this.state.advancePerson.employeeId = listData['advancePerson.employeeId'] || '';
        this.state.createdBy.name = listData && listData['createdBy.name'] || '';
        this.state.createdBy.employeeId = listData && listData['createdBy.employeeId'] || '';
        this.state.state = listData && listData.state || 0;
        this.state.note = listData && listData.note || '';
        this.state.kanbanStatus = listData && listData.kanbanStatus || '';
        this.state.advanceDate = listData && convertDatetimeToDate(listData.advanceDate);
        this.state.paymentExpiration = listData && convertDatetimeToDate(listData.paymentExpiration);
        this.state.items = listData && listData.originItem.items;
        // if (recordSelected.others && Object.keys(recordSelected.others).length > 0) {
        //   const { fieldAdded } = this.state;
        //   const keys = Object.keys(recordSelected.others);
        //   fieldAdded.forEach(item => {
        //     const index = keys.findIndex(n => n === item.name.replace('others.', ''));
        //     if (index > -1) {
        //       item.value = recordSelected.others[keys[index]];
        //     }
        //   });
        //   this.state.fieldAdded = fieldAdded;
        // }
      }
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   const {
  //     commandChoose,
  //     note,
  //     createdBy,
  //     code,
  //     paymentExpiration,
  //     advanceDate,
  //     items,
  //     businessOpportunities,
  //     employee,
  //     isEditPage,
  //     fieldAdded,
  //   } = state;
  //   const businessOpportunitiesRaw = {
  //     name: businessOpportunities.name,
  //     businessOpportunitiesId: businessOpportunities._id,
  //   };
  //   const advancePerson = {
  //     name: employee.name,
  //     employeeId: employee._id,
  //   };
  //   const others = {};
  //   if (fieldAdded.length > 0) {
  //     fieldAdded.forEach(item => {
  //       others[item.name.replace('others.', '')] = item.value;
  //     });
  //   }
  //   const body = {
  //     businessOpportunities: businessOpportunitiesRaw,
  //     code,
  //     commandNumber: commandChoose.name,
  //     advancePerson,
  //     advanceDate,
  //     state: state.state,
  //     paymentExpiration,
  //     items,
  //     others,
  //     createdBy,
  //     note,
  //   };
  //   const messages = viewConfigCheckForm(state.moduleCode, dot.dot(body));
  //   if (messages) {
  //     return {
  //       localMessages: messages
  //     }
  //   }
  // }

  componentDidUpdate(props) {
    const { successCreate } = props.addAdvancePage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = 3;
      this.props.history.push('/RevenueExpenditure');
    }
  }

  render() {
    const { classes, addAdvancePage, intl } = this.props;
    const { name, employee, localMessages, checkRequired, checkShowForm, listKanbanStatus, kanbanStatus } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    let total = 0;
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tạm ứng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật tạm ứng' })}`
          }
          onGoBack={() => {
            this.props.history.goBack();
          }}
          onSubmit={this.handleSubmitForm}
          disableAdd={this.state.disableAdd}
        />
        {addAdvancePage.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>Tạm ứng</title>
          <meta name="description" content="Description of AddAdvancePage" />
        </Helmet>
        <Grid>

          <Paper style={{ padding: '20px' }}>
            <ValidatorForm>
              <KanbanStepper
                // listStatus={listKanbanStatus}
                listStatus={listKanbanStatus}
                // onKabanClick={value => {
                //   if (typeOfRecord === 0) {
                //     this.setState({ kanbanStatus: value });
                //   } else if (typeOfRecord === 1) {
                //     this.setState({ kanbanStatusImport: value });
                //   } else if (typeOfRecord === 2) {
                //     this.setState({ kanbanStatusExport: value });
                //   }
                // }}
                onKabanClick={(value) => {
                  this.setState({ kanbanStatus: value });
                }}
                activeStep={kanbanStatus}
              />
              <Grid container md={12} item spacing={24} style={{ width: '100%' }}>

                <Grid item md={6} style={{ paddingTop: '17px' }}>
                  <CustomInputBase
                    label={'TÊN'}
                    value={this.state.name}
                    // disabled
                    onChange={event => {
                      let { name } = this.state;
                      name = event.target.value;
                      this.setState({ name });
                    }}
                    error={localMessages && localMessages['businessOpportunities.name']}
                    helperText={localMessages && localMessages['businessOpportunities.name']}
                    required={checkRequired['businessOpportunities.name']}
                    checkedShowForm={checkShowForm['businessOpportunities.name']}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('code', 'AdvanceRequire')}
                    value={this.state.code}
                    // onChange={event => {
                    //   let { code } = this.state;
                    //   code = event.target.value;
                    //   this.setState({ code });
                    // }}
                    disabled
                    error={localMessages && localMessages['code']}
                    helperText={localMessages && localMessages['code']}
                    required={checkRequired['code']}
                    checkedShowForm={checkShowForm['code']}
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('commandNumber', 'AdvanceRequire')}
                  </Typography>
                  <AsyncSelect
                    // cacheOptions
                    value={this.state.commandChoose}
                    className={classes.reactSelect}
                    isDisabled={this.state.isEditPage}
                    loadOptions={this.loadOptions}
                    defaultOptions={this.state.commandList}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChangeSelect}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                  {this.state.errorCommand ? (
                    <Typography component="p" style={{ color: 'red' }}>
                      Không được để trống trường này
                    </Typography>
                  ) : (
                    ''
                  )}
                </Grid> */}
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('code', 'AdvanceRequire')}
                    name="code"
                    disabled={this.state.isEditPage}
                    value={this.state.code}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.code}
                    helperText={localMessages && localMessages.code}
                    required={checkRequired.code}
                    checkedShowForm={checkShowForm.code}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <AsyncAutocomplete
                    // isMulti
                    label={getLabelName('advancePerson.name', 'AdvanceRequire')}
                    onChange={value => {
                      if (!value) {
                        this.setState({ businessOpportunities: null });
                      }
                      else {
                        const advancePerson = {
                          employeeId: value._id,
                          name: value.name
                        }
                        this.setState({ advancePerson: advancePerson });
                      }
                    }}
                    error={localMessages && localMessages['advancePerson.name']}
                    helperText={localMessages && localMessages['advancePerson.name']}
                    required={checkRequired['advancePerson.name']}
                    checkedShowForm={checkShowForm['advancePerson.name']}
                    value={this.state.advancePerson}
                    url={API_USERS}
                  />
                  {/* <CustomInputBase
                    label={getLabelName('advancePerson.name', 'AdvanceRequire')}
                    // disabled
                    onChange={event => {
                      let { employee } = this.state;
                      employee.name = event.target.value;
                      this.setState({ employee });
                    }}
                    value={Object.keys(employee).length > 0 ? employee.name : ''}
                    error={localMessages && localMessages['advancePerson.name']}
                    helperText={localMessages && localMessages['advancePerson.name']}
                    required={checkRequired['advancePerson.name']}
                    checkedShowForm={checkShowForm['advancePerson.name']}
                  /> */}
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('createdBy.name', 'AdvanceRequire')}
                    disabled
                    value={Object.keys(this.state.createdBy).length > 0 ? this.state.createdBy.name : ''}
                    error={localMessages && localMessages['createdBy.name']}
                    helperText={localMessages && localMessages['createdBy.name']}
                    required={checkRequired['createdBy.name']}
                    checkedShowForm={checkShowForm['createdBy.name']}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('advanceDate', 'AdvanceRequire')}
                    type="date"
                    onChange={this.handleChange}
                    name="advanceDate"
                    value={this.state.advanceDate}
                    error={localMessages && localMessages.advanceDate}
                    helperText={localMessages && localMessages.advanceDate}
                    required={checkRequired.advanceDate}
                    checkedShowForm={checkShowForm.advanceDate}
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('paymentExpiration', 'AdvanceRequire')}
                    type="date"
                    onChange={this.handleChange}
                    name="paymentExpiration"
                    value={this.state.paymentExpiration}
                    error={localMessages && localMessages.paymentExpiration}
                    helperText={localMessages && localMessages.paymentExpiration}
                    required={checkRequired.paymentExpiration}
                    checkedShowForm={checkShowForm.paymentExpiration}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <CustomInputBase
                    label="Trạng thái"
                    name="state"
                    select
                    // disabled
                    value={this.state.state}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.state}
                    helperText={localMessages && localMessages.state}
                    required={checkRequired.state}
                    checkedShowForm={checkShowForm.state}
                  >
                    {this.state.statusList.map(item => (
                      <MenuItem value={item.code} key={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label="Ghi chú"
                    onChange={this.handleChange}
                    name="note"
                    value={this.state.note}
                    multiline
                    rows={3}
                    error={localMessages && localMessages.note}
                    helperText={localMessages && localMessages.note}
                    required={checkRequired.note}
                    checkedShowForm={checkShowForm.note}
                  />
                </Grid>
                {this.state.fieldAdded.length > 0
                  ? this.state.fieldAdded.map((item, index) => {
                    if (item.checked) {
                      return (
                        <Grid item md={6} key={item.name}>
                          <CustomInputBase
                            label={item.title}
                            type={item.type === 'string' ? 'text' : item.type}
                            value={item.value}
                            onChange={event => this.handleChangeAddedField(index, event)}
                            error={localMessages && localMessages[`${item.name}`]}
                            helperText={localMessages && localMessages[`${item.name}`]}
                            required={checkRequired[`${item.name}`]}
                            checkedShowForm={checkShowForm[`${item.name}`]}
                          />
                        </Grid>
                      );
                    }
                  })
                  : ''}
                {/* <Grid item md={12}>
                  <Button
                    onClick={this.handleSubmitForm}
                    variant="contained"
                    color="primary"
                    autoFocus
                  >
                    Lưu
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    onClick={() => {
                      this.props.history.goBack();
                    }}
                    variant="contained"
                  >
                    Quay lại
                  </Button>
                </Grid> */}
                <Grid item md={12} style={{ padding: 0, paddingLeft: '12px' }}>
                  <Typography component="p">Tạm ứng chi phí chi tiết cho từng khoản mục</Typography>
                </Grid>
                <Grid item md={12}>
                  <Fab color="primary" aria-label="Add" size="small" onClick={this.handleOpenAddItem}>
                    <Add />
                  </Fab>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nội dung</TableCell>
                        <TableCell>Số tiền</TableCell>
                        {/* <TableCell>Tỉnh</TableCell> */}
                        {/* <TableCell>Mã tỉnh</TableCell> */}
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state && this.state.items && this.state.items.length > 0
                        ? this.state.items.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <TableRow key={index}>
                            <TableCell>{item.content}</TableCell>
                            <TableCell>
                              {formatNumber(Number(item.amount))}
                              <Typography style={{ display: 'none' }}>{(total += Number(item.amount))}</Typography>
                            </TableCell>
                            {/* <TableCell>{item.province}</TableCell>
                              <TableCell>{item.provinceCode}</TableCell> */}
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editItem(index)}>
                                <Edit />
                              </Fab>
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteItem(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                        : ''}
                      <TableRow>
                        <TableCell>Tổng số tiền</TableCell>
                        <TableCell>{formatNumber(Number(total))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </Paper>
        </Grid>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            Cập nhật chi phí
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px', height: '400px' }}>
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleAddItem}>
              <TextValidator
                label="Nội dung"
                onChange={this.handleChangeItem('content')}
                name="content"
                value={this.state.currentItem.content}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
                validators={['required', 'trim']}
                errorMessages={['Không được để trống trường này', 'Không được để trống trường này']}
              />
              <TextValidator
                label="Số tiền"
                variant="outlined"
                value={this.state.currentItem.amount}
                name="amount"
                margin="normal"
                style={{ width: '100%' }}
                onChange={this.handleChangeItem('amount')}
                validators={['minNumber:0', 'required']}
                errorMessages={['Không được nhỏ hơn 0', 'Không được để trống trường này']}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              {/* <Typography component="p" style={{ color: '#a4a4a4' }}>
                Tỉnh thành
              </Typography>
              <AsyncSelect
                // cacheOptions
                value={this.state.provinceChoose}
                className={classes.reactSelect2}
                loadOptions={this.loadOptionsProvince}
                defaultOptions={this.state.provinceList}
                onInputChange={this.handleInputChange}
                onChange={this.handleChangeSelectProvince}
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '55px',
                  },
                })}
              />
              {this.state.errorProvince ? (
                <Typography component="p" style={{ color: 'red' }}>
                  Không được để trống trường này
                </Typography>
              ) : (
                ''
              )} */}
              <div style={{ display: 'none' }}>
                <button ref={this.addItemBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions style={{ zIndex: 999 }}>
            <Button
              style={{ margin: 20 }}
              onClick={() => {
                this.addItemBtn.current.click();
              }}
              variant="outlined"
              color="primary"
              autoFocus
            >
              Lưu
            </Button>
            <Button style={{ margin: 20 }} onClick={this.handleClose} color="secondary" variant="outlined">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmitForm = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const { addAdvancePage, location } = this.props;
    const id = location && location.state && location.state.dataItem && location.state.dataItem._id;
    const {
      commandChoose,
      note,
      createdBy,
      state,
      code,
      paymentExpiration,
      advanceDate,
      items,
      name,
      advancePerson,
      isEditPage,
      fieldAdded,
      kanbanStatus,
    } = this.state;
    let error = false;
    // thêm kanbanStatus vào body
    // if (Object.keys(commandChoose).length === 0) {
    //   error = true;
    //   this.setState({ errorCommand: true });
    // }
    const data1 = {
      id,
      name,
      code,
      commandNumber: commandChoose.name,
      advancePerson,
      advanceDate,
      state,
      paymentExpiration,
      items,
      // others,
      createdBy,
      note,
      kanbanStatus
    };
    const data = {
      name,
      code,
      commandNumber: commandChoose.name,
      advancePerson,
      advanceDate,
      state,
      paymentExpiration,
      items,
      // others,
      createdBy,
      note,
      kanbanStatus
    };
    if (isEditPage === true) { this.props.onUpdateAdvanceRecord(data1) }
    else { this.props.onCreateAdvanceRecord(data); }
    // if (!error) {
    //   const businessOpportunitiesRaw = {
    //     name: businessOpportunities.name,
    //     businessOpportunitiesId: businessOpportunities._id,
    //   };
    //   const advancePerson = {
    //     name: employee.name,
    //     employeeId: employee._id,
    //   };
    //   const others = {};
    //   if (fieldAdded.length > 0) {
    //     fieldAdded.forEach(item => {
    //       others[item.name.replace('others.', '')] = item.value;
    //     });
    //   }
    //   const body = {
    //     businessOpportunities: businessOpportunitiesRaw,
    //     code,
    //     commandNumber: commandChoose.name,
    //     advancePerson,
    //     advanceDate,
    //     state,
    //     paymentExpiration,
    //     items,
    //     others,
    //     createdBy,
    //     note,
    //   };

    //   if (businessOpportunitiesRaw.name === undefined) {
    //     this.props.onChangeSnackbar({ status: true, message: 'Dự án trống!', variant: 'error' });
    //     return;
    //   }
    //   if (advancePerson.name === undefined) {
    //     this.props.onChangeSnackbar({ status: true, message: 'Nhân viên trống!', variant: 'error' });
    //     return;
    //   }

    //   const { localMessages } = this.state;
    //   if (Object.keys(localMessages).length === 0) {
    //     if (!isEditPage) {
    //       this.props.onCreateAdvanceRecord(body);
    //     } else {
    //       const { match } = this.props;
    //       body.id = match.params.id;
    //       body.businessOpportunities = businessOpportunities;
    //       body.advancePerson = employee;
    //       this.props.onUpdateAdvanceRecord(body);
    //     }
    //   }
    // }
  };

  editItem = index => {
    const { items } = this.state;
    const current = Object.assign(items[index]);
    const choose = {
      label: current.province,
      value: current.provinceCode,
    };
    this.setState({ currentItem: current, provinceChoose: choose, open: true, isEditItem: index });
  };

  deleteItem = index => {
    const { items } = this.state;
    items.splice(index, 1);
    this.setState({ items });
  };

  handleAddItem = () => {
    const { provinceChoose, currentItem, items, isEditItem } = this.state;
    let error = false;
    if (Object.keys(currentItem).length === 0) {
      error = true;
      this.setState({ errorProvince: true });
    }
    if (!error) {
      currentItem.province = provinceChoose.label;
      currentItem.provinceCode = provinceChoose.value;
      const cur = {
        content: '',
        amount: 0,
        province: '',
        provinceCode: '',
      };
      if (isEditItem === -1) {
        items.push(currentItem);
      } else {
        items[isEditItem] = currentItem;
      }
      this.setState({ items, currentItem: cur, open: false, isEditItem: -1, provinceChoose: {} });
    }
  };

  handleOpenAddItem = () => {
    const cur = {
      content: '',
      amount: 0,
      province: '',
      provinceCode: '',
    };
    this.setState({ open: true, currentItem: cur });
  };

  handleChangeItem = name => e => {
    const { currentItem, moduleCode, localMessages } = this.state;
    currentItem[name] = e.target.value;
    this.setState({ currentItem });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleClose = () => {
    const cur = {
      content: '',
      amount: 0,
      province: '',
      provinceCode: '',
    };
    this.setState({ open: false, currentItem: cur });
  };

  handleInputChange = newValue => newValue;

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, e.target.name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeSelect = selectedOption => {
    if (!selectedOption.dataduan || !selectedOption.canbokinhdoanh) {
      this.props.onChangeSnackbar({ status: true, message: 'Công lệnh bạn chọn không có dự án hoặc nhân viên', variant: 'error' });
      // return;
    }
    // if (!selectedOption.macanbokinhdoanh) {
    //   this.props.onChangeSnackbar({ status: true, message: 'Công lệnh bạn chọn không có nhân viên', variant: 'error' });
    //   return;
    // }
    if (selectedOption.dataduan && selectedOption.dataduan !== '') {
      // eslint-disable-next-line no-unused-vars
      const businessOpportunities = this.callApi(API_BOS, selectedOption.dataduan);
    } else {
      this.setState({ businessOpportunities: {} });
    }
    if (selectedOption.canbokinhdoanh && selectedOption.canbokinhdoanh !== '') {
      // eslint-disable-next-line no-unused-vars
      const employee = this.callApi(API_USERS, selectedOption.canbokinhdoanh);
    } else {
      this.setState({ employee: {} });
    }
    this.setState({ commandChoose: selectedOption, errorCommand: false });
  };

  callApi = (api, newValue) => {
    const token = localStorage.getItem('token');
    return fetch(`${api}/${newValue}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myData => {
        if (api.includes('employee')) {
          if (myData.data) {
            this.setState({ employee: myData.data });
          } else {
            this.props.onChangeSnackbar({ status: true, message: 'Nhân viên đã bị xóa', variant: 'error' });
            this.setState({ employee: {} });
          }
        } else if (myData) {
          this.setState({ businessOpportunities: myData });
        } else {
          this.props.onChangeSnackbar({ status: true, message: 'Dự án bị xóa', variant: 'error' });
          this.setState({ businessOpportunities: {} });
        }
      });
  };

  handleChangeSelectProvince = selectedOption => {
    this.setState({ provinceChoose: selectedOption, errorProvince: false });
  };

  filterColors = newValue => {
    const { commandList } = this.state;
    return commandList.filter(i =>
      String(i.label)
        .toLowerCase()
        .includes(String(newValue).toLowerCase()),
    );
  };

  loadOptions = (newValue, callback) => {
    setTimeout(() => {
      callback(this.filterColors(newValue));
    }, 500);
  };

  filterProvince = newValue => {
    const { provinceList } = this.state;
    // console.log(newValue)
    return provinceList.filter(i => i.label.toLowerCase().includes(newValue.toLowerCase()));
  };

  loadOptionsProvince = (newValue, callback) =>
    // eslint-disable-next-line no-unused-vars
    new Promise(resolve => {
      // console.log(action)
      setTimeout(() => {
        callback(this.filterProvince(newValue));
      }, 500);
    });
}

AddAdvancePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addAdvancePage: makeSelectAddAdvancePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCommand: () => {
      dispatch(getCommandAct());
    },
    onCreateAdvanceRecord: body => {
      dispatch(createAdvanceRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onGetAdvanceRecordById: body => {
      dispatch(getAdvanceRecordByIdAct(body));
    },
    onUpdateAdvanceRecord: body => {
      dispatch(updateAdvanceRecordAct(body));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addAdvancePage', reducer });
const withSaga = injectSaga({ key: 'addAdvancePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddAdvancePage);
