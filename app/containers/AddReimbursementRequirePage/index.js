/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddReimbursementRequirePage
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
  MenuItem,
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
  DialogTitle,
  AppBar,
  Toolbar,
  Fab,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Add, Edit, Delete, SaveAlt, Close } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectAddReimbursementRequirePage, { makeSelectDashboardPage } from './selectors';
import LoadingIndicator from '../../components/LoadingIndicator';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { injectIntl } from 'react-intl';
import { convertDatetimeToDate, getLabelName, viewConfigCheckForm, viewConfigHandleOnChange, viewConfigCheckRequired } from '../../utils/common';
import { getAdvanceAct, createReiburementRecordAct, resetNotiAct, getReibursementAct, updateReiburementRecordAct } from './actions';
import { provinceData } from '../../utils/provinceData';
import CustomInputBase from '../../components/Input/CustomInputBase';
import dot from 'dot-object';
import messages from './messages';
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
export class AddReimbursementRequirePage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.addItemBtn = React.createRef();
    const moduleCode = 'ReimbursementRequire';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      valueOfPrevTab: 0,
      errorAdvance: false,
      commandNumber: null,
      advanceChoose: {},
      code: `HU - ${new Date() * 1}`,
      paymentDate: date,
      currentItem: {
        content: '',
        amount: 0,
        province: '',
        provinceCode: '',
      },
      employee: {
        name: '',
        employeeId: '',
      },
      businessOpportunities: {
        name: '',
        businessOpportunitiesId: '',
      },
      items: [],
      itemsAdded: [],
      note: null,
      open: false,
      errorProvince: false,
      provinceList: [],
      provinceChoose: {},
      isEditItem: -1,
      advanceList: [],
      isEditPage: false,
      fieldAdded: [],
      advanceMoney: 0,
      spendMoney: 0,
      totalAmount: 0,
      file: null,
      fileRecived: '',
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
      createdBy: {},
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
      listKanbanStatus: [],
      kanbanStatus: '',
      disableAdd: false,
    };
  }

  getMessages() {
    const {
      code,
      advanceChoose,
      employee,
      businessOpportunities,
      paymentDate,
      commandNumber,
      items,
      itemsAdded,
      note,
      file,
      fieldAdded,
      createdBy,
      state,
    } = this.state;
    let { totalAmount } = this.state;
    // let error = false;
    // if (Object.keys(advanceChoose).length === 0) {
    //   error = true;
    //   this.setState({ errorAdvance: true });
    // }

    const mergeItems = items.concat(itemsAdded);
    const advanceRequireNumber = {
      name: advanceChoose.name,
      code: advanceChoose.code,
      advanceRequireId: advanceChoose.value,
    };
    if (Number(totalAmount) < 0) {
      totalAmount = -Number(totalAmount);
    }
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const body = {
      code,
      businessOpportunities,
      advancePerson: employee,
      advanceRequireNumber,
      commandNumber,
      paymentDate,
      note,
      file,
      state,
      items: mergeItems,
      totalAmount,
      others,
      createdBy,
    };

    const data = dot.dot(body);
    const messages = viewConfigCheckForm(this.state.moduleCode, data);

    this.setState({
      localMessages: messages,
    });
  }

  componentWillMount() {
    this.props.onGetAdvance();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetReibursement(match.params.id);
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }

  componentDidMount() {
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
    const currentViewConfig = listViewConfig.find(item => item.code === 'ReimbursementRequire');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    if (this.props.dashboardPage && this.props.dashboardPage.profile) {
      this.state.createdBy = {
        employeeId: this.props.dashboardPage.profile._id,
        name: this.props.dashboardPage.profile.name,
      };
    }
    const { addReimbursementRequirePage } = this.props;
    if (addReimbursementRequirePage) {
      const messages = viewConfigCheckForm(this.state.moduleCode, addReimbursementRequirePage);
      this.setState({
        localMessages: messages,
      });
    }
    this.getMessages();

    const valuePrevTab = this.props.history.location.state ? this.props.history.location.state.typeOfRecord : 0;
    this.setState({ valueOfPrevTab: valuePrevTab });

    try {
      const listKanBan = JSON.parse(localStorage.getItem('crmStatus')) || [];

      let listKanbanStatus = listKanBan.find(p => p.code === 'ST255') || {}
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
      const { addReimbursementRequirePage } = props;
      const list = addReimbursementRequirePage.allAdvance || [];
      const advanceList = [];
      if (list.length > 0) {
        list.forEach(item => {
          advanceList.push({
            label: item.code,
            value: item._id,
            ...item,
          });
        });
        this.setState({ advanceList });
      }
      const { reibursementSelected } = addReimbursementRequirePage;
      if (this.state.isEditPage && reibursementSelected !== this.props.addReimbursementRequirePage.reibursementSelected) {
        this.state.code = reibursementSelected.code;
        this.state.businessOpportunities = reibursementSelected.businessOpportunities;
        this.state.employee = reibursementSelected.advancePerson;
        if (!reibursementSelected.advanceRequireNumber) {
          this.props.onChangeSnackbar({ status: true, message: 'Tạm ứng đã bị xóa!', variant: 'error' });
        }
        const advanceChoose1 =
          advanceList.find(
            item => (item.value === reibursementSelected.advanceRequireNumber ? reibursementSelected.advanceRequireNumber.advanceRequireId : ''),
          ) || null;
        this.state.commandNumber = reibursementSelected.commandNumber;
        this.state.paymentDate = convertDatetimeToDate(reibursementSelected.paymentDate);
        this.state.note = reibursementSelected.note;
        this.state.fileRecived = reibursementSelected.file;
        const itemsAdvance = advanceChoose1 ? advanceChoose1.items : [];
        this.state.advanceChoose = reibursementSelected.advanceRequireNumber || {};
        this.state.advanceChoose.label = reibursementSelected.advanceRequireNumber ? reibursementSelected.advanceRequireNumber.code : '';
        this.state.createdBy = reibursementSelected.createdBy || {};
        this.state.state = reibursementSelected.state || 0;
        this.state.kanbanStatus = reibursementSelected.kanbanStatus || '';
        this.state.advanceMoney = 0;
        if (itemsAdvance.length > 0) {
          itemsAdvance.forEach(item => {
            this.state.advanceMoney += Number(item.amount) || 0;
          });
        }
        if (reibursementSelected.items && reibursementSelected.items.length > 0) {
          this.state.items = reibursementSelected.items.slice(0, itemsAdvance.length);
          this.state.itemsAdded = reibursementSelected.items.slice(itemsAdvance.length, reibursementSelected.items.length);
        }
        if (reibursementSelected.others && Object.keys(reibursementSelected.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(reibursementSelected.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = reibursementSelected.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }

  componentDidUpdate(props) {
    const { successCreate } = props.addReimbursementRequirePage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = 4;
      this.props.history.push('/RevenueExpenditure');
    }
  }

  render() {
    const { classes, addReimbursementRequirePage, intl } = this.props;
    const { employee, businessOpportunities, commandNumber, items, itemsAdded, localMessages, checkRequired, checkShowForm, listKanbanStatus, kanbanStatus } = this.state;
    // this.state.spendMoney = 0;
    // items.forEach(item => {
    //   this.state.spendMoney += Number(item.amount) || 0;
    // });
    // itemsAdded.forEach(item => {
    //   this.state.spendMoney += Number(item.amount) || 0;
    // });
    this.state.totalAmount = this.state.advanceMoney - this.state.spendMoney;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới hoàn ứng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật hoàn ứng' })}`
          }
          onGoBack={() => {
            this.props.history.goBack();
            this.props.history.value = this.state.valueOfPrevTab;
          }}
          onSubmit={() => this.submitBtn.current.click()}
          disableAdd={this.state.disableAdd}
        />
        {addReimbursementRequirePage.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>Hoàn ứng</title>
          <meta name="description" content="Description of AddReimbursementRequirePage" />
        </Helmet>
        <Grid>
          <Paper style={{ padding: '20px' }}>
            <KanbanStepper
              listStatus={listKanbanStatus}
              onKabanClick={(value) => {
                this.setState({ kanbanStatus: value });
              }}
              activeStep={kanbanStatus}
            />
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleSubmitForm}>
              <Grid container md={12} item spacing={24} style={{ width: '100%' }}>
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('businessOpportunities.name', 'ReimbursementRequire')}
                    // disabled
                    onChange={event => {
                      let { businessOpportunities } = this.state;
                      businessOpportunities.name = event.target.value;
                      this.setState({ businessOpportunities });
                    }}
                    value={Object.keys(businessOpportunities).length > 0 ? businessOpportunities.name : ''}
                    error={localMessages && localMessages['businessOpportunities.name']}
                    helperText={localMessages && localMessages['businessOpportunities.name']}
                    required={checkRequired['businessOpportunities.name']}
                    checkedShowForm={checkShowForm['businessOpportunities.name']}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4', marginTop: 5 }}>
                    {"  "}
                  </Typography>
                  <CustomInputBase
                    label={getLabelName('advanceRequireNumber.name', 'ReimbursementRequire')}
                    disabled
                    // onChange={event => {
                    //   let { advanceRequireNumber } = this.state;
                    //   // advanceRequireNumber.name = event.target.value;
                    //   if (advanceRequireNumber) {
                    //     advanceRequireNumber = {
                    //       ...advanceRequireNumber,
                    //       name: event.target.value
                    //     }
                    //   }
                    //   else {
                    //     advanceRequireNumber = {
                    //       name: event.target.value
                    //     }
                    //   }
                    //   this.setState({ advanceRequireNumber });
                    // }}
                    margin="normal"
                    value={this.state.advanceChoose && this.state.advanceChoose.name}
                    // value={Object.keys(businessOpportunities).length > 0 ? businessOpportunities.name : ''}
                    // value={this.state.advanceRequireNumber && this.state.advanceRequireNumber.name}
                    error={localMessages && localMessages['advanceRequireNumber.name']}
                    helperText={localMessages && localMessages['advanceRequireNumber.name']}
                    required={checkRequired['advanceRequireNumber.name']}
                    checkedShowForm={checkShowForm['advanceRequireNumber.name']}
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('commandNumber', 'ReimbursementRequire')}
                    disabled
                    value={commandNumber}
                    error={localMessages && localMessages.commandNumber}
                    helperText={localMessages && localMessages.commandNumber}
                    required={checkRequired.commandNumber}
                    checkedShowForm={checkShowForm.commandNumber}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('advanceRequireNumber.code', 'ReimbursementRequire')}
                  </Typography>
                  <AsyncSelect
                    // cacheOptions
                    value={this.state.advanceChoose}
                    className={classes.reactSelect}
                    isDisabled={this.state.isEditPage}
                    loadOptions={this.loadOptions}
                    defaultOptions={this.state.advanceList}
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
                  {this.state.errorAdvance ? (
                    <Typography component="p" style={{ color: 'red' }}>
                      Không được để trống trường này
                    </Typography>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item md={6} style={{ paddingTop: '17px' }}>
                  <CustomInputBase
                    label={getLabelName('code', 'ReimbursementRequire')}
                    name="code"
                    // disabled={this.state.isEditPage}
                    disabled
                    value={this.state.code}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.code}
                    helperText={localMessages && localMessages.code}
                    required={checkRequired.code}
                    checkedShowForm={checkShowForm.code}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('advancePerson.name', 'ReimbursementRequire')}
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
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('paymentDate', 'ReimbursementRequire')}
                    type="date"
                    onChange={this.handleChange}
                    name="paymentDate"
                    value={this.state.paymentDate}
                    error={localMessages && localMessages['paymentDate']}
                    helperText={localMessages && localMessages['paymentDate']}
                    required={checkRequired['paymentDate']}
                    checkedShowForm={checkShowForm['paymentDate']}
                  />
                </Grid> */}
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('createdBy.name', 'ReimbursementRequire')}
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
                    label="Số tiền đã tạm ứng"
                    // disabled
                    value={this.state.advanceMoney}
                    onChange={event => {
                      let { advanceMoney } = this.state;
                      advanceMoney = event.target.value;
                      this.setState({ advanceMoney });
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    error={localMessages && localMessages.advanceMoney}
                    helperText={localMessages && localMessages.advanceMoney}
                    required={checkRequired.advanceMoney}
                    checkedShowForm={checkShowForm.advanceMoney}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label="Số tiền chi tiêu"
                    // disabled
                    onChange={event => {
                      let { spendMoney } = this.state;
                      spendMoney = event.target.value;
                      console.log(spendMoney, 'spendMoneyspendMoney');
                      this.setState({ spendMoney });
                    }}
                    value={this.state.spendMoney}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    error={localMessages && localMessages.spendMoney}
                    helperText={localMessages && localMessages.spendMoney}
                    required={checkRequired.spendMoney}
                    checkedShowForm={checkShowForm.spendMoney}
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label={this.state.totalAmount >= 0 ? 'Số tiền hoàn ứng' : 'Số tiền cần thanh toán'}
                    disabled
                    onChange={event => {
                      let { totalAmount } = this.state;
                      totalAmount = event.target.value;
                      this.setState({ totalAmount });
                    }}
                    value={this.state.totalAmount >= 0 ? this.state.totalAmount : -Number(this.state.totalAmount)}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    error={localMessages && localMessages.totalAmount}
                    helperText={localMessages && localMessages.totalAmount}
                    required={checkRequired.totalAmount}
                    checkedShowForm={checkShowForm.totalAmount}
                  />
                </Grid>
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
                    onClick={() => {
                      this.submitBtn.current.click();
                    }}
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
                      this.props.history.value = 4;
                    }}
                    variant="contained"
                  >
                    Quay lại
                  </Button>
                </Grid> */}
              </Grid>
              <Grid item md={6} style={{ padding: '12px', paddingLeft: 0 }}>
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
                      {/* <TableCell>Tỉnh</TableCell>
                      <TableCell>Mã tỉnh</TableCell> */}
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.items.length > 0
                      ? this.state.items.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <TableRow key={index}>
                          <TableCell>{item.content}</TableCell>
                          <TableCell>
                            <TextValidator
                              variant="outlined"
                              name="amount"
                              margin="normal"
                              value={item.amount}
                              style={{ width: '200px' }}
                              onChange={e => this.handleChangeItems('amount', index, e)}
                              validators={['minNumber:0', 'required']}
                              errorMessages={['Không được nhỏ hơn 0', 'Không được để trống trường này']}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </TableCell>
                          {/* <TableCell>{item.province}</TableCell>
                            <TableCell>{item.provinceCode}</TableCell> */}
                          <TableCell />
                        </TableRow>
                      ))
                      : ''}
                    {this.state.itemsAdded.length > 0
                      ? this.state.itemsAdded.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <TableRow key={index}>
                          <TableCell>{item.content}</TableCell>
                          <TableCell>{formatNumber(Number(item.amount))}</TableCell>
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
                  </TableBody>
                </Table>
                <Grid item md={12}>
                  <TextField
                    multiline
                    rows={4}
                    label="Ghi chú"
                    InputLabelProps={{ shrink: true }}
                    style={{ width: '100%' }}
                    variant="outlined"
                    name="note"
                    value={this.state.note}
                    onChange={this.handleChange}
                    margin="normal"
                    error={localMessages && localMessages.note}
                    helperText={localMessages && localMessages.note}
                    required={checkRequired.note}
                    checkedShowForm={checkShowForm.note}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    label="Tệp đính kèm"
                    style={{ width: '100%' }}
                    variant="outlined"
                    name="note"
                    type="file"
                    onChange={this.handleChangeFile}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {this.state.isEditPage && this.state.fileRecived !== '' ? (
                            <IconButton edge="end" style={{ cursor: 'pointer' }} onClick={() => window.open(this.state.fileRecived)}>
                              <SaveAlt color="primary" />
                            </IconButton>
                          ) : (
                            ''
                          )}
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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

  handleSubmitForm = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const {
      code,
      advanceChoose,
      employee,
      businessOpportunities,
      paymentDate,
      commandNumber,
      items,
      itemsAdded,
      note,
      file,
      fieldAdded,
      createdBy,
      state,
      kanbanStatus,
    } = this.state;
    let { totalAmount } = this.state;
    let error = false;
    if (Object.keys(advanceChoose).length === 0) {
      error = true;
      this.setState({ errorAdvance: true });
    }
    if (!error) {
      const mergeItems = items.concat(itemsAdded);
      console.log(advanceChoose, 'advanceRequireNumber')
      const advanceRequireNumber = {
        code: advanceChoose.code,
        name: advanceChoose.name,
        advanceRequireId: advanceChoose.value,
      };
      if (Number(totalAmount) < 0) {
        totalAmount = -Number(totalAmount);
      }
      const others = {};
      if (fieldAdded.length > 0) {
        fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      const body = {
        code,
        businessOpportunities,
        advancePerson: employee,
        advanceRequireNumber,
        commandNumber,
        paymentDate,
        note,
        file,
        state,
        items: mergeItems,
        totalAmount,
        others,
        createdBy,
        kanbanStatus
      };
      if (!this.state.isEditPage) {
        this.props.onCreate(body);
      } else {
        const { match } = this.props;
        body.id = match.params.id;
        body.fileRecived = this.state.fileRecived;
        this.props.onUpdate(body);
      }
    }
  };

  handleChangeFile = e => {
    this.setState({ file: e.target.files[0] });
  };

  editItem = index => {
    const { itemsAdded } = this.state;
    const current = Object.assign(itemsAdded[index]);
    const choose = {
      label: current.province,
      value: current.provinceCode,
    };
    this.setState({ currentItem: current, provinceChoose: choose, open: true, isEditItem: index });
  };

  deleteItem = index => {
    const { itemsAdded } = this.state;
    itemsAdded.splice(index, 1);
    this.setState({ itemsAdded });
  };

  handleAddItem = () => {
    const { provinceChoose, currentItem, itemsAdded, isEditItem } = this.state;
    let error = false;
    if (Object.keys(provinceChoose).length === 0) {
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
        itemsAdded.push(currentItem);
      } else {
        itemsAdded[isEditItem] = currentItem;
      }
      this.setState({ itemsAdded, currentItem: cur, open: false, isEditItem: -1, provinceChoose: {} });
    }
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
    const { currentItem } = this.state;
    currentItem[name] = e.target.value;
    this.setState({ currentItem });
  };

  handleChangeItems = (name, index, e) => {
    const { items } = this.state;
    items[index][name] = e.target.value;
    this.setState({ items });
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleChangeSelect = selectedOption => {
    console.log(selectedOption, 'selectedOptionselectedOption');
    const bos = selectedOption.businessOpportunities;
    const emp = selectedOption.advancePerson;
    const cmd = selectedOption.commandNumber;
    const items = selectedOption.items;
    let total = 0;
    items.forEach(item => {
      total += Number(item.amount) || 0;
    });
    this.setState({
      advanceChoose: selectedOption,
      errorAdvance: false,
      businessOpportunities: bos,
      employee: emp,
      commandNumber: cmd,
      items,
      advanceMoney: total,
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(this.state.moduleCode, this.state.localMessages, e.target.name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleInputChange = newValue => newValue;

  filterColors = newValue => {
    const { advanceList } = this.state;
    return advanceList.filter(i =>
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

  loadOptionsProvince = (newValue, callback) => {
    setTimeout(() => {
      callback(this.filterProvince(newValue));
    }, 500);
  };

  handleChangeSelectProvince = selectedOption => {
    this.setState({ provinceChoose: selectedOption, errorProvince: false });
  };
}

AddReimbursementRequirePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addReimbursementRequirePage: makeSelectAddReimbursementRequirePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAdvance: () => {
      dispatch(getAdvanceAct());
    },
    onCreate: body => {
      dispatch(createReiburementRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onGetReibursement: id => {
      dispatch(getReibursementAct(id));
    },
    onUpdate: body => {
      dispatch(updateReiburementRecordAct(body));
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

const withReducer = injectReducer({ key: 'addReimbursementRequirePage', reducer });
const withSaga = injectSaga({ key: 'addReimbursementRequirePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddReimbursementRequirePage);
