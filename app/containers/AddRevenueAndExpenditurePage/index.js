/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddRevenueAndExpenditurePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TextField } from '../../components/LifetekUi';
import CustomDatePicker from '../../components/CustomDatePicker';
import {
  withStyles,
  Grid,
  Paper,
  MenuItem,
  Button,
  Typography,
  Table,
  AppBar,
  Toolbar,
  IconButton,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CheckBox,
} from '@material-ui/core';
import { Cancel, Delete, Close } from '@material-ui/icons'; // Done, Add
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import NumberFormat from 'react-number-format';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FileUpload } from '../../components/LifetekUi';
import makeSelectAddRevenueAndExpenditurePage from './selectors';
import {
  API_USERS,
  API_SALE,
  API_BILLS,
  GET_CONTRACT,
  API_TASK_PROJECT,
  API_ORDER_PO,
  API_BANK_ACCOUNT,
  API_HRM_WAGES,
  API_RECRUITMENT_WAVE,
} from '../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import _ from 'lodash';
import { changeSnackbar } from '../Dashboard/actions';
import { getCatalogAct, createRecordAct, resetNoti, getRecordAct, updateRecordAct } from './actions';
import styles from './styles';
import { convertDatetimeToDate, getLabelName, serialize } from '../../utils/common';
import LoadingIndicator from '../../components/LoadingIndicator';
import TextFieldCode from '../../components/TextFieldCode';
import CustomInputBase from '../../components/Input/CustomInputBase';
import {
  viewConfigCheckRequired,
  viewConfigCheckForm,
  viewConfigHandleOnChange,
  viewConfigName2Title,
  viewConfigCheckShowFormNoName,
} from '../../utils/common';
import dot from 'dot-object';
import messages from './messages';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { injectIntl } from 'react-intl';
import KanbanStepper from '../../components/KanbanStepper';
import CustomAppBar from 'components/CustomAppBar';
import CustomInputField from '../../components/Input/CustomInputField';

// import messages from './messages';

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;

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
export class AddRevenueAndExpenditurePage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    const moduleCode = 'RevenueExpenditure';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');

    this.state = {
      typeOfRecord: null,
      typeOfRnE: null,
      typeOfChoose: 0,
      choose: null,
      date,
      amount: null,
      tax: null,
      reason: '',
      costType: '',
      performedBy: {},
      approvedBy: {},
      paymentMethod: null,
      note: '',
      paymentMethodList: [],
      fieldAdded: [],
      isEditPage: false,
      errorPerform: false,
      code: undefined,
      hrmRecruimentWageId: null,
      total: null,
      totalAmount: null,
      customer: '',
      hrmWage: null,
      // errorApproved: false,
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
      listChild: [],
      listChildAll: [],
      checkRequired,
      checkShowForm,
      moduleCode,
      checkShowFormPro: {},
      localMessages: {},
      name2Title: {},
      allMoney: null,
      sourceData: [],
      valueOfPrevTab: 0,
      kanbanStatus: '602dd55e18dc4f58c68680c5',
      // kanbanStatusImport: '602dd55e18dc4f58c68680c5',
      // kanbanStatusExport: '602dd55e18dc4f58c68680c5',
      listKanbanStatus: [],
      disableAdd: false,
    };
  }

  getMessages() {
    const {
      typeOfRecord,
      typeOfChoose,
      choose,
      typeOfRnE,
      costType,
      // approvedBy,
      state: localState,
      performedBy,
      date,
      amount,
      tax,
      reason,
      note,
      paymentMethod,
      fieldAdded,
      code,
      total,
      totalAmount,
      customer,
      type,
    } = this.state;
    const others = {};
    if (fieldAdded && fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    let order;
    let bill;
    let contract;
    let task;
    let orderPo;
    if (typeOfRnE !== 0) {
      switch (typeOfChoose) {
        case 0:
          order = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 1:
          bill = {
            billId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 2:
          contract = {
            contractId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 3:
          task = {
            taskId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 4:
          orderPo = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
      }
    }
    const body = {
      type: typeOfRecord,
      costType: typeOfRnE,
      order,
      bill,
      task,
      contract,
      performedBy,
      createDate: date,
      amount,
      tax,
      reason,
      state: localState,
      note,
      payMethod: paymentMethod,
      others,
      code,
      // total: this.state.choose !== null ? this.state.choose.total : total,
      // totalAmount: this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      // customer: this.state.choose !== null ? this.state.choose.customer : customer,
      orderPo,
    };
    const body2 = {
      type: typeOfRecord,
      costType: typeOfRnE,
      order,
      bill,
      task,
      contract,
      performedBy,
      createDate: date,
      amount,
      tax,
      reason,
      state: localState,
      note,
      payMethod: paymentMethod,
      others,
      code,
      total: this.state.choose !== null ? this.state.choose.total : total,
      totalAmount: this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      customer: this.state.choose !== null ? this.state.choose.customer : customer,
      orderPo,
    };
    // check messages
    const { moduleCode } = this.state;
    const data = dot.dot(type === 0 ? body2 : body);
    const messages = viewConfigCheckForm(moduleCode, data);
    this.setState({
      localMessages: messages,
    });
  }

  componentWillMount() {
    // this.props.onGetCategory();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetRecordById(match.params.id);
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }

  async componentDidMount() {
    const listKanBan = JSON.parse(localStorage.getItem('crmStatus')) || [];
    if (listKanBan) {
      let crmKanbanStatus = listKanBan.find(p => p.code === 'ST19') || {};
      let crmKanbanStatusImport = listKanBan.find(p => p.code === 'ST250') || {};
      let crmKanbanStatusExport = listKanBan.find(p => p.code === 'ST251') || {};
      if (
        this.props &&
        this.props.history &&
        this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.typeOfRecord === 0
      ) {
        this.setState({
          listKanbanStatus: crmKanbanStatus && crmKanbanStatus.data || [],
          kanbanStatus:
            (crmKanbanStatus.data && Array.isArray(crmKanbanStatus.data) && crmKanbanStatus.data.length && crmKanbanStatus.data[0]._id) || '',
        });
      } else if (
        this.props &&
        this.props.history &&
        this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.typeOfRecord === 1
      ) {
        this.setState({
          listKanbanStatus: crmKanbanStatusImport && crmKanbanStatusImport.data || [],
          kanbanStatus:
            (crmKanbanStatusImport.data &&
              Array.isArray(crmKanbanStatusImport.data) &&
              crmKanbanStatusImport.data.length &&
              crmKanbanStatusImport.data[0]._id) ||
            '',
        });
      } else if (
        this.props &&
        this.props.history &&
        this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.typeOfRecord === 2
      ) {
        this.setState({
          listKanbanStatus: crmKanbanStatusExport && crmKanbanStatusExport.data || [],
          kanbanStatus:
            (crmKanbanStatusExport.data &&
              Array.isArray(crmKanbanStatusExport.data) &&
              crmKanbanStatusExport.data.length &&
              crmKanbanStatusExport.data[0]._id) ||
            '',
        });
      }
    }
    const checkAdd = this.props.history.location.state ? this.props.history.location.state.add : false;
    if (checkAdd) {
      const valuePrevTab = this.props.history.location.state ? this.props.history.location.state.typeOfRecord : 0;
      this.setState({ valueOfPrevTab: valuePrevTab });
    }
    const crmSource = await JSON.parse(localStorage.getItem('crmSource')) || [];
    const paymentMethodLocal = crmSource.find(item => item.code === 'S17') || {};
    const paymentMethod = paymentMethodLocal.data || [];
    const sourceDataLocal = crmSource.find(item => item.code === 'S24') || {};
    const sourceData = sourceDataLocal.data || [];
    this.setState({ paymentMethodList: paymentMethod, sourceData: sourceData });
    const listViewConfig = await JSON.parse(localStorage.getItem('viewConfig')) || [];
    // console.log(listViewConfig, 'listViewConfig')
    const currentViewConfig = listViewConfig.find(item => item.code === 'RevenueExpenditure');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }

    if (this.props.history.value) {
      this.setState({ valueOfPrevTab: this.props.history.value });
      this.props.history.value = undefined;
    }
    const { moduleCode } = this.state;
    const { addRevenueAndExpenditurePage } = this.props;
    const { recordSelected } = addRevenueAndExpenditurePage;
    if (recordSelected && Object.keys(recordSelected).length !== 0) {
      const messages = viewConfigCheckForm(moduleCode, recordSelected);
      this.setState({
        localMessages: messages,
      });
    }
    const checkShowFormPro = viewConfigCheckShowFormNoName('RevenueExpenditure', '', 'checkedShowForm', 'isRequired', 'checkedRequireForm') || {};

    const name2Title = viewConfigName2Title('RevenueExpenditure');
    this.setState({
      name2Title,
      checkShowFormPro,
    });
    this.getMessages();
    // const messages = viewConfigCheckForm(moduleCode, this.state);
    // this.setState({
    //   localMessages: messages
    // })
  }

  componentWillReceiveProps(props, prevState) {
    // if (prevState !== this.state) {
    //   this.getMessages();
    // }
    if (props !== this.props) {
      const { addRevenueAndExpenditurePage } = props;
      const { recordSelected } = addRevenueAndExpenditurePage;
      const { moduleCode } = this.state;

      if (recordSelected) {
        const data = dot.dot(recordSelected);
        const messages = viewConfigCheckForm(moduleCode, data);
        this.setState({
          localMessages: messages,
        });
      }
      if (this.state.isEditPage && recordSelected !== this.props.addRevenueAndExpenditurePage.recordSelected) {
        this.state.typeOfRecord = recordSelected.type;
        this.state.typeOfRnE = recordSelected.expenseType;
        if (recordSelected.costType !== 0) {
          if (recordSelected.order) {
            this.state.choose = recordSelected.order;
            this.state.typeOfChoose = 0;
          }
          if (recordSelected.bill) {
            this.state.choose = recordSelected.bill;
            this.state.typeOfChoose = 1;
          }
          if (recordSelected.customer) {
            this.state.customer = recordSelected.customer;
          }
          if (recordSelected.contract) {
            this.state.choose = recordSelected.contract;
            this.state.typeOfChoose = 2;
            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}/${recordSelected.contract.contractId}`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 1 && data.saleQuotation) {
                  const token = localStorage.getItem('token');
                  const url = `${API_SALE}/${data.saleQuotation.saleQuotationId}`;
                  fetch(url, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then(res => res.json())
                    .then(data => {
                      this.setState({ listChild: data !== null ? [data] : [] });
                    });
                }
                if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 2 && data.order) {
                  const token = localStorage.getItem('token');
                  const url = `${API_ORDER_PO}/${data.order.orderId}`;
                  fetch(url, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then(res => res.json())
                    .then(data => {
                      this.setState({ listChild: data !== null ? [data] : [] });
                    });
                }
              });
          }

          if (recordSelected.orderPo) {
            this.state.choose = recordSelected.orderPo;
            this.state.typeOfChoose = 4;
          }
          if (recordSelected.task) {
            this.state.choose = recordSelected.task;
            this.state.typeOfChoose = 3;
            const params = {
              filter: {
                'task.taskId': recordSelected.task.taskId,
              },
            };
            const filter = serialize(params);
            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}?${filter}`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                this.setState({ listChild: data.data });
              });
          }
        }
        this.state.date = convertDatetimeToDate(recordSelected.createDate);
        this.state.amount = recordSelected.amount;
        this.state.costType = recordSelected.typeOfCost;
        this.state.tax = recordSelected.tax;
        this.state.code = recordSelected.code;
        this.state.reason = recordSelected.reason;
        this.state.note = recordSelected.note;
        this.state.hrmWage = recordSelected.hrmWage;
        this.state.state = recordSelected.state || 0;
        this.state.performedBy = recordSelected.performedBy;
        this.state.approvedBy = recordSelected.approvedBy;
        this.state.paymentMethod = recordSelected.payMethod;
        this.state.kanbanStatus = recordSelected.kanbanStatus;
        // this.state.kanbanStatusImport = recordSelected.kanbanStatusImport;
        // this.state.kanbanStatusExport = recordSelected.kanbanStatusExport;
        if (this.state.choose !== null) {
          this.state.choose.total = recordSelected.total;
          this.state.choose.totalAmount = recordSelected.totalAmount;
          this.state.choose.customer = recordSelected.customer;
        }

        if (recordSelected.others && Object.keys(recordSelected.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(recordSelected.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = recordSelected.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }
  handleOnChange = (e, id) => {
    let clonePayment;
    if (e.target.checked === true) {
      const payment = this.state.listChild;
      clonePayment = _.cloneDeep(payment);
      clonePayment.forEach(item => {
        if (item._id === id) {
          item.checked = true;
        }
      });
      this.setState({ listChild: clonePayment });
    }
    if (e.target.checked === false) {
      const payment = this.state.listChild;
      clonePayment = _.cloneDeep(payment);
      clonePayment.forEach(item => {
        if (item._id === id) {
          item.checked = false;
        }
      });
      this.setState({ listChild: clonePayment });
    }
    let allAmount = 0;
    clonePayment &&
      clonePayment.forEach(item => {
        if (item.checked === true) {
          allAmount = allAmount + item.amount;
        }
      });
    this.setState({ amount: allAmount });
  };
  customRecruiment = option => {
    return option.name;
  };

  customSalary = option => {
    const org = option.organizationUnitId ? (option.organizationUnitId.name ? option.organizationUnitId.name : '') : '';
    const month = option.month ? option.month : '';
    const year = option.year ? option.year : '';
    return `${org} - ${month}/${year}`;
  };
  customBankAccount = option => {
    const currentBalance = option.bank ? option.bank.title : '';
    const customerName = option.name ? option.name : '';
    if (customerName || currentBalance) {
      return `${customerName} - ${currentBalance}`;
    }
    return '';
  };
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  fomatStatus = statusPay => {
    if (statusPay === 1) {
      return 'Đã thanh lý';
    } else if (statusPay === 3) {
      return 'Đã nghiệm thu';
    }
  };

  componentDidUpdate(props, prevState) {
    const { successCreate } = props.addRevenueAndExpenditurePage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = this.state.valueOfPrevTab;
      this.props.history.push('/RevenueExpenditure');
    }
  }
  // shouldComponentUpdate(nextProps) {
  //   // Rendering the component only if
  //   // passed props value is changed

  //   if (nextProps.value !== this.props.value) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  render() {
    const id = this.props.match.params.id;
    const { classes, addRevenueAndExpenditurePage, intl } = this.props;

    const {
      localMessages,
      checkRequired,
      checkShowForm,
      checkShowFormPro,
      name2Title,
      sourceData,
      kanbanStatus,
      kanbanStatusImport,
      kanbanStatusExport,
      listKanbanStatus,
      choose,
    } = this.state;
    const topNavList = [
      {
        id: 'internal',
      },
      {
        id: 'receipt',
      },
      {
        id: 'sell',
      },
      {
        id: 'advances',
      },
      {
        id: 'reimbursement',
      },
      {
        id: 'pay',
      },
    ];
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    const costsLocal = JSON.parse(localStorage.getItem('crmSource')) || [];
    const costs = costsLocal ? costsLocal.find(item => item.code === 'S24') : {};
    const costTypes = costs ? costs.data : [];
    const typeOfRecord = this.props.history.location && this.props.history.location.state && this.props.history.location.state.typeOfRecord;

    let label = '';
    return (
      <div>
        {addRevenueAndExpenditurePage.loading ? <LoadingIndicator /> : null}

        <Helmet>
          {/* <title>{this.state.isEditPage ? 'Cập nhật  tài chính' : 'Thêm mới  tài chính'} </title> */}
          {typeOfRecord === 0 ? (
            <title>{this.state.isEditPage ? 'Cập nhật  nội bộ' : 'Thêm mới  nội bộ'} </title>
          ) : typeOfRecord === 1 ? (
            <title>{this.state.isEditPage ? 'Cập nhật  nhập hàng' : 'Thêm mới  nhập hàng'}</title>
          ) : typeOfRecord === 2 ? (
            <title>{this.state.isEditPage ? 'Cập nhật  bán hàng' : 'Thêm mới  bán hàng'}</title>
          ) : (
            ''
          )}
          <meta name="description" content="Description of AddRevenueAndExpenditurePage" />
        </Helmet>
        <KanbanStepper
          listStatus={listKanbanStatus}
          onKabanClick={value => {
            // if (typeOfRecord === 0) {
            //   this.setState({ kanbanStatus: value });
            // } else if (typeOfRecord === 1) {
            //   this.setState({ kanbanStatusImport: value });
            // } else if (typeOfRecord === 2) {
            //   this.setState({ kanbanStatusExport: value });
            // }
            this.setState({ kanbanStatus: value });
          }}
          // activeStep={typeOfRecord === 0 ? kanbanStatus : typeOfRecord === 1 ? kanbanStatusImport : kanbanStatusExport}
          activeStep={kanbanStatus}
        />
        <Grid>
          <Paper style={{ padding: '20px' }}>
            <CustomAppBar
              className
              title={
                typeOfRecord === 0
                  ? addStock === 'add'
                    ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tài chính nội bộ' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật tài chính nội bộ' })}`
                  : typeOfRecord === 1
                    ? addStock === 'add'
                      ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tài chính nhập hàng' })}`
                      : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật tài chính nhập hàng' })}`
                    : typeOfRecord === 2
                      ? addStock === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tài chính bán hàng' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật tài chính bán hàng' })}`
                      : ''
                // addStock === 'add'
                //     ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tài chính nội bộ' })}`
                //     : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật tài chính nội bộ' })}`
              }
              onGoBack={() => {
                this.props.history.goBack();
                this.props.history.value = this.state.valueOfPrevTab;
              }}
              onSubmit={() => this.handleSubmitForm()}
              disableAdd={this.state.disableAdd}
            />
            <Grid container md={12} item spacing={24} style={{ width: '100%' }}>
              {/* {checkShowFormPro.type && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('type', 'RevenueExpenditure')}
                  label={name2Title.type}
                  name="type"
                  select
                  value={this.state.typeOfRecord}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.type}
                  helperText={localMessages && localMessages.type}
                  required={checkRequired.type}
                  checkedShowForm={checkShowForm.type}
                >
                  {/* {topNavList.map((item, index) => (
                    <MenuItem value={index}>{intl.formatMessage(messages[item.id] || { id: item.id })}</MenuItem>
                  ))} */}
                  <MenuItem value={0}>Thu</MenuItem>
                  <MenuItem value={1}>Chi</MenuItem>
                </CustomInputBase>
              </Grid>
              {/* )} */}

              {/* {checkShowFormPro.costType && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('type', 'RevenueExpenditure')}
                  label={name2Title && name2Title.costType}
                  name="costType"
                  select
                  value={this.state.costType}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.costType}
                  helperText={localMessages && localMessages.costType}
                  required={checkRequired.costType}
                  checkedShowForm={checkShowForm.costType}
                >
                  {costTypes.map((item, index) => <MenuItem value={item.value}>{item.title}</MenuItem>)}
                  {/* <MenuItem value={0}>Thu</MenuItem>
                  <MenuItem value={1}>Chi</MenuItem> */}
                </CustomInputBase>
              </Grid>
              {/* )}  */}

              {/* {checkShowFormPro.code && ( */}
              <Grid item md={6}>
                <TextFieldCode
                  // label={getLabelName('code', 'RevenueExpenditure')}
                  label={name2Title.code}
                  name="code"
                  value={this.state.code}
                  // onChange={this.handleChangeNumber('code')}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.code}
                  helperText={localMessages && localMessages.code}
                  required={checkRequired.code}
                  checkedShowForm={checkShowForm.code}
                  code={13}
                />
              </Grid>
              {/* )} */}
              {this.state.costType === '234' && (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    label={'Chọn đợt tuyển dụng'}
                    customOptionLabel={this.customRecruiment}
                    url={API_RECRUITMENT_WAVE}
                    value={this.state.hrmRecruimentWageId}
                    onChange={(newVal, e) => {
                      this.setState({ hrmRecruimentWageId: newVal });
                    }}
                  />
                </Grid>
              )}
              {this.state.costType === 'CPTTL' && (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    label={'Chọn bảng lương'}
                    customOptionLabel={this.customSalary}
                    url={API_HRM_WAGES}
                    value={this.state.hrmWage}
                    onChange={(newVal, e) => {
                      // console.log(newVal, 1234);
                      this.setState({
                        hrmWage: newVal,
                        // , amount: newVal.totalSalary
                      });
                    }}
                  />
                </Grid>
              )}

              {/* {(this.state.typeOfRecord === 0 || this.state.typeOfRecord === 1 || this.state.typeOfRecord === 2) && (
                <Grid item md={6}>
                  <CustomInputBase
                    // label={getLabelName('costType', 'RevenueExpenditure')}
                    label={name2Title.expenseType}
                    name="typeOfRnE"
                    select
                    value={this.state.typeOfRnE}
                    onChange={this.handleChange}
                    error={localMessages && localMessages.expenseType}
                    helperText={localMessages && localMessages.expenseType}
                    required={checkRequired.expenseType}
                    checkedShowForm={checkShowForm.expenseType}
                  >
                    {sourceData.map((item, index) => (
                      <MenuItem value={item.value}>{item.title}</MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
              )} */}
              {/* {checkShowFormPro.tax && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('tax', 'RevenueExpenditure')}
                  label={name2Title.tax}
                  name="tax"
                  value={this.state.tax}
                  onChange={this.handleChangeNumber('tax')}
                  // onChange={this.handleChange}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  error={localMessages && localMessages.tax}
                  helperText={localMessages && localMessages.tax}
                  required={checkRequired.tax}
                  checkedShowForm={checkShowForm.tax}
                />
              </Grid>
              {/* )} */}
              {/* {checkShowFormPro.amount && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  label={name2Title.amount}
                  name="amount"
                  value={this.state.amount}
                  onChange={this.handleChangeMoney}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  error={localMessages && localMessages.amount}
                  helperText={localMessages && localMessages.amount}
                  required={checkRequired.amount}
                  checkedShowForm={checkShowForm.amount}
                />
              </Grid>
              {/* )} */}

              {/* {this.state.paymentMethod !== 1 ? null : 
              <Grid item md={6}>
              <CustomInputField
                configType="crmSource"
                configCode="S04"
                type="Source|CrmSource,S04|Id||_id"
                label={name2Title.bank}
                value={this.state.bank}
                onChange={(newVal, e) => {
                  this.setState({ bank: newVal.target.value });
                }}
              />
            </Grid>} */}

              {this.state.valueOfPrevTab !== 0 ? (
                <React.Fragment>
                  {/* {checkShowFormPro.typeOfChoose && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      label="Loại"
                      name="typeOfChoose"
                      select
                      value={this.state.typeOfChoose}
                      onChange={this.handleChange}
                    // defaultValue={0}
                    >
                      <MenuItem value={0}>Đơn hàng</MenuItem>
                      <MenuItem value={1}>Hóa đơn</MenuItem>
                      <MenuItem value={2}>Hợp đồng</MenuItem>
                      <MenuItem value={3}>Dự án</MenuItem>
                      <MenuItem value={4}>Đơn hàng PO</MenuItem>
                    </CustomInputBase>
                  </Grid>
                  {/* )}  */}

                  <Grid item md={6}>
                    {this.state.typeOfChoose === 0
                      ? (label = 'Đơn hàng')
                      : this.state.typeOfChoose === 1
                        ? (label = 'Hóa đơn')
                        : this.state.typeOfChoose === 2
                          ? (label = 'Hợp đồng')
                          : this.state.typeOfChoose === 3
                            ? (label = 'Dự án')
                            : (label = 'Đơn hàng PO')}

                    <AsyncAutocomplete
                      style={this.state.typeOfChoose === 0 ? { display: 'initial' } : { display: 'none' }}
                      url={API_SALE}
                      value={this.state.choose}
                      onChange={(newVal, e) => {
                        this.setState({ choose: newVal });
                      }}
                    />
                    <AsyncAutocomplete
                      style={this.state.typeOfChoose === 1 ? { display: 'initial' } : { display: 'none' }}
                      url={API_BILLS}
                      value={this.state.choose}
                      onChange={(newVal, e) => {
                        this.setState({ choose: newVal });
                      }}
                    />
                    <AsyncAutocomplete
                      style={this.state.typeOfChoose === 2 ? { display: 'initial' } : { display: 'none' }}
                      url={GET_CONTRACT}
                      value={this.state.choose}
                      onChange={(newVal, e) => {
                        this.setState({ choose: newVal });
                      }}
                    />
                    <AsyncAutocomplete
                      style={this.state.typeOfChoose === 3 ? { display: 'initial' } : { display: 'none' }}
                      url={API_TASK_PROJECT}
                      value={this.state.choose}
                      onChange={(newVal, e) => {
                        this.setState({ choose: newVal });
                      }}
                    />
                    <AsyncAutocomplete
                      url={API_ORDER_PO}
                      style={this.state.typeOfChoose === 4 ? { display: 'initial' } : { display: 'none' }}
                      value={this.state.choose}
                      onChange={(newVal, e) => {
                        this.setState({ choose: newVal });
                      }}
                    />
                    {/* <Typography
                      style={{
                        color: 'grey',
                      }}
                    >
                      {this.state.typeOfChoose === 0
                        ? 'Đơn hàng'
                        : this.state.typeOfChoose === 1
                          ? 'Hóa đơn'
                          : this.state.typeOfChoose === 2
                            ? 'Hợp đồng'
                            : this.state.typeOfChoose === 3
                              ? 'Dự án'
                              : 'Đơn hàng PO'}
                    </Typography> */}
                    {/* {this.loadFindOption(true)} */}
                  </Grid>
                </React.Fragment>
              ) : (
                ''
              )}

              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 0 ? (
                <React.Fragment>
                  {/* {checkShowFormPro.totalAmount && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tổng tiền"
                      label={name2Title.totalAmount}
                      name="totalAmount"
                      onChange={this.handleChange}
                      value={this.state.choose !== null ? this.state.choose.totalAmount : ''}
                      // multiline
                      error={localMessages && localMessages.totalAmount}
                      helperText={localMessages && localMessages.totalAmount}
                      required={checkRequired.totalAmount}
                      checkedShowForm={checkShowForm.totalAmount}
                    />
                  </Grid>
                  {/* )} */}
                  {/* {checkShowFormPro.customer && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tên khách hàng"
                      label={name2Title.customer}
                      name="customer"
                      onChange={this.handleChange}
                      value={this.state.choose !== null ? this.state.choose.customer && this.state.choose.customer.name : this.state.customer}
                      error={localMessages && localMessages.customer}
                      helperText={localMessages && localMessages.customer}
                      required={checkRequired.customer}
                      checkedShowForm={checkShowForm.customer}
                    />
                  </Grid>
                  {/* )} */}
                </React.Fragment>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 1 ? (
                <React.Fragment>
                  {/* {checkShowFormPro.total && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tổng tiền"
                      label={name2Title.total}
                      name="total"
                      onChange={this.handleChange}
                      value={this.state.choose !== null ? this.state.choose.total : ''}
                      multiline
                      error={localMessages && localMessages.total}
                      helperText={localMessages && localMessages.total}
                      required={checkRequired.total}
                      checkedShowForm={checkShowForm.total}
                    />
                  </Grid>
                  {/* )} */}
                  {/* {checkShowFormPro.customer && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tên khách hàng"
                      label={name2Title.customer}
                      onChange={this.handleChange}
                      name="customer"
                      value={this.state.choose !== null ? this.state.choose.customer && this.state.choose.customer.name : this.state.customer}
                      error={localMessages && localMessages.customer}
                      helperText={localMessages && localMessages.customer}
                      required={checkRequired.customer}
                      checkedShowForm={checkShowForm.customer}
                    />
                  </Grid>
                  {/* )} */}
                </React.Fragment>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 2 ? (
                <React.Fragment>
                  {/* {checkShowFormPro.allMoney && ( */}

                  <Grid item md={6}>
                    <CustomInputBase
                      // label={getLabelName('amount', 'RevenueExpenditure')}
                      label={'TỔNG TIỀN'}
                      name="allMoney"
                      // value={this.state.allMoney}
                      value={this.state.choose !== null ? this.state.choose && this.state.choose.totalContractValue : ''}
                      // onChange={this.handleChangeMoney}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      // disabled
                      error={localMessages && localMessages.totalAmount}
                      helperText={localMessages && localMessages.totalAmount}
                      required={checkRequired.totalAmount}
                      checkedShowForm={checkShowForm.totalAmount}
                    />
                  </Grid>
                  {/* )} */}
                </React.Fragment>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 &&
                this.state.typeOfChoose === 2 &&
                this.state.listChild &&
                this.state.listChild.length > 0 &&
                this.state.listChild[0] !== null ? (
                <Grid item md={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên đơn hàng liên quan</TableCell>
                        <TableCell>Tên khách hàng/nhà cung cấp</TableCell>
                        <TableCell>Ngày tạo</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell>Chọn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.listChild.map(item => (
                        <TableRow>
                          <TableCell>{item ? item.name : ''}</TableCell>
                          <TableCell>{item ? (item.customer || item.supplier || {}).name || '' : ''}</TableCell>
                          <TableCell>{item ? moment(item.createDate).format('DD-MM-YYYY') : ''}</TableCell>
                          <TableCell>{item ? this.fomatStatus(item.statusPay) : ''}</TableCell>
                          <TableCell>{item ? this.numberWithCommas(parseInt(item.amount)) : ''}</TableCell>
                          <TableCell>
                            {/* <CheckBox
                              // onChange={e => {
                              //   this.handleOnChange(e, row.codeModleFunction);
                              // }}
                              // name={`${row.codeModleFunction}/${(row.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }).name}`}
                              // checked={(row.methods.find(item => item.name === 'VIEWCONFIG') || { allow: false }).allow}
                              checked = {true}
                            /> */}
                            <input
                              type="checkbox"
                              id="paymentRequest"
                              onChange={e => {
                                this.handleOnChange(e, item._id);
                              }}
                              value={item._id}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 3 && this.state.listChild && this.state.listChild.length > 0 ? (
                <Grid item md={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên hợp đồng liên quan</TableCell>
                        <TableCell>Tên khách hàng/nhà cung cấp</TableCell>
                        <TableCell>Ngày kí</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.listChild.map(item => (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.customer ? item.customer.name : item.supplier ? item.supplier.name : ''}</TableCell>
                          <TableCell>{moment(item.contractSigningDate).format('DD-MM-YYYY')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              ) : (
                ''
              )}

              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 4 ? (
                // <Grid container md={12}>
                <React.Fragment>
                  {/* {checkShowFormPro.total && ( */}

                  <Grid item md={6}>
                    <CustomInputBase
                      label="Tổng tiền PO"
                      name="totalPo"
                      onChange={this.handleChange}
                      value={this.state.choose !== null ? this.state.choose.amount : ''}
                      multiline
                      error={localMessages && localMessages.totalPo}
                      helperText={localMessages && localMessages.totalPo}
                      required={checkRequired.totalPo}
                      checkedShowForm={checkShowForm.totalPo}
                    />
                  </Grid>
                  {/* )} */}
                  {/* {checkShowFormPro.customer && ( */}
                  <Grid item md={6}>
                    <CustomInputBase
                      label="Tên nhà cung cấp"
                      onChange={this.handleChange}
                      name="supplier"
                      value={this.state.choose !== null ? this.state.choose.supplier && this.state.choose.supplier.name : null}
                      error={localMessages && localMessages.supplier}
                      helperText={localMessages && localMessages.supplier}
                      required={checkRequired.supplier}
                      checkedShowForm={checkShowForm.supplier}
                    />
                  </Grid>
                  {/* )} */}
                </React.Fragment>
              ) : (
                // </Grid>
                ''
              )}
              {/* {checkShowFormPro.createDate && ( */}
              <Grid item md={6}>
                <CustomDatePicker
                  InputLabelProps={{ shrink: true }}
                  label={name2Title.createDate || 'NGÀY TẠO'}
                  // type="date"
                  onChange={this.handleChange}
                  name="date"
                  value={this.state.date}
                  error={localMessages && localMessages.createDate}
                  helperText={localMessages && localMessages.createDate}
                  required={checkRequired.createDate}
                  checkedShowForm={checkShowForm.createDate}
                />
              </Grid>
              {/* )} */}
              {/* {checkShowFormPro['performedBy.code'] && ( */}
              <Grid item md={6}>
                {/* <Typography component="p" style={{ color: '#a4a4a4' }}>
                  {getLabelName('performedBy.name', 'RevenueExpenditure')}
                </Typography> */}
                <AsyncAutocomplete
                  // label="NHÂN VIÊN PHỤ TRÁCH"
                  label={name2Title['performedBy.code'] || 'MÃ NHÂN VIÊN'}
                  url={API_USERS}
                  className={classes.reactSelect}
                  placeholder="Tìm kiếm nhân viên thực hiện ..."
                  // loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_USERS)}
                  // loadingMessage={() => 'Đang tải ...'}
                  value={this.state.performedBy}
                  // components={{ Option, SingleValue }}
                  onChange={this.handleEmployee}
                // theme={theme => ({
                //   ...theme,
                //   spacing: {
                //     ...theme.spacing,
                //     controlHeight: '55px',
                //   },
                // })}
                />
                {this.state.errorPerform ? (
                  <Typography component="p" style={{ color: 'red' }}>
                    Không được để trống trường này
                  </Typography>
                ) : (
                  ''
                )}
              </Grid>
              {/* )} */}

              {/* <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('approvedBy.name', 'RevenueExpenditure')}
                  </Typography>
                  <AsyncSelect
                    className={classes.reactSelect}
                    placeholder="Tìm kiếm nhân viên phê duyệt..."
                    loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_USERS)}
                    loadingMessage={() => 'Đang tải ...'}
                    value={this.state.approvedBy}
                    components={{ Option, SingleValue }}
                    onChange={this.handleEmployeeApprove}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                  {this.state.errorApproved ? (
                    <Typography component="p" style={{ color: 'red' }}>
                      Không được để trống trường này
                    </Typography>
                  ) : (
                    ''
                  )}
                </Grid> */}
              {/* {checkShowFormPro.payMethod && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  label={name2Title.payMethod}
                  value={this.state.paymentMethod}
                  name="payMethod"
                  select
                  onChange={this.handleChange}
                  error={localMessages && localMessages.payMethod}
                  helperText={localMessages && localMessages.payMethod}
                  required={checkRequired.payMethod}
                  checkedShowForm={checkShowForm.payMethod}
                >
                  {this.state.paymentMethodList.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem value={index} key={index}>
                      {item.title}
                    </MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
              {/* )} */}

              {this.state.paymentMethod !== 0 ? null : (
                <React.Fragment>
                  {/* {checkShowFormPro.customBankAccount && ( */}
                  <Grid item md={6}>
                    <AsyncAutocomplete
                      label={'Tài khoản ngân hàng'}
                      customOptionLabel={this.customBankAccount}
                      url={API_BANK_ACCOUNT}
                      value={this.state.bank}
                      onChange={(newVal, e) => {
                        this.setState({ bank: newVal });
                      }}
                    />
                  </Grid>
                  {/* )} */}

                  {/* <CustomInputField
                configType="crmSource"
                configCode="S04"
                type="Source|CrmSource,S04|Id||_id"
                label={name2Title.bank}
                value={this.state.bank}
                onChange={(newVal, e) => {
                  this.setState({ bank: newVal.target.value });
                }}
              /> */}
                </React.Fragment>
              )}
              {/* {checkShowFormPro.state && ( */}
              <Grid item md={6}>
                <CustomInputBase
                  // label="Trạng thái"
                  label={name2Title.state}
                  name="state"
                  select
                  disabled
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
              {/* )} */}

              {/* {checkShowFormPro.typeOfRecord && ( */}
              <Grid item md={6}>
                <FileUpload name={this.state.typeOfRecord} id={id} code="RevenueExpenditure" />
              </Grid>
              {/* )} */}

              {this.state.fieldAdded && this.state.fieldAdded.length > 0
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
              {/* {checkShowFormPro.note && ( */}
              <Grid item md={6}>
                <TextField
                  label={name2Title.note || 'GHI CHÚ'}
                  name="note"
                  onChange={this.handleChange}
                  value={this.state.note}
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  rows={4}
                  error={localMessages && localMessages.note}
                  helperText={localMessages && localMessages.note}
                  required={checkRequired.note}
                  checkedShowForm={checkShowForm.note}
                />
              </Grid>
              {/* )} */}
              {/* {checkShowFormPro.reason && ( */}
              <Grid item md={6}>
                <TextField
                  label={name2Title.reason || 'LÝ DO'}
                  name="reason"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  multiline
                  rows={4}
                  value={this.state.reason}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.reason}
                  helperText={localMessages && localMessages.reason}
                  required={checkRequired.reason}
                  checkedShowForm={checkShowForm.reason}
                />
              </Grid>
              {/* )} */}
            </Grid>

            {/* <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmitForm}
              >
                Lưu
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="contained"
                onClick={() => {
                  this.props.history.goBack();
                  this.props.history.value = this.state.valueOfPrevTab;
                }}
              >
                Quay lại
              </Button>
            </Grid> */}
          </Paper>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
  handleChange = e => {
    const { moduleCode, localMessages } = this.state;
    const {
      target: { value, name },
    } = e;

    if (name === 'typeOfChoose') {
      this.setState({ listChild: [], choose: null });
    }
    if (name === 'type') {
      this.setState({ typeOfRecord: value });
    }
    if (name === 'payMethod') {
      this.setState({ paymentMethod: value });
    }
    if (name === 'customer') {
      this.setState({ customer: value });
    }
    if (name === 'totalAmount') {
      this.setState({ totalAmount: value });
    }
    this.setState({ [name]: value });

    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeNumber = name => e => {
    const { moduleCode, localMessages } = this.state;
    this.setState({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeMoney = e => {
    const { choose, moduleCode, localMessages } = this.state;

    if (choose !== null && choose.total && choose.total < e.target.value) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngân sách không được lớn hơn tổng tiền', variant: 'error' });
      return;
    }
    if (choose !== null && choose.totalAmount && choose.totalAmount < e.target.value) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngân sách không được lớn hơn tổng tiền', variant: 'error' });
      return;
    }

    this.setState({ amount: e.target.value });
    this.setState({ money: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, 'amount', e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleEmployee = value => {
    const performedBy = {
      employeeId: value._id,
      name: value.name,
    };
    this.setState({ performedBy, errorPerform: false });
  };

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
    this.props.history.value = this.state.valueOfPrevTab;
    const {
      valueOfPrevTab,
      typeOfRecord,
      typeOfChoose,
      choose,
      typeOfRnE,
      costType,
      // approvedBy,
      performedBy,
      date,
      amount,
      tax,
      reason,
      hrmWage,
      hrmRecruimentWageId,
      note,
      paymentMethod,
      fieldAdded,
      code,
      total,
      totalAmount,
      customer,
      allMoney,
      kanbanStatus,
      kanbanStatusImport,
      kanbanStatusExport,
      bank,
    } = this.state;

    let error = false;
    if (Object.keys(performedBy).length === 0) {
      error = true;
      // if (Object.keys(approvedBy).length === 0) {
      //   this.setState({ errorApproved: true });
      // }
      if (Object.keys(performedBy).length === 0) {
        this.setState({ errorPerform: true });
      }
    }
    const others = {};
    if (fieldAdded && fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }

    let order;
    let bill;
    let contract;
    let task;
    let orderPo;
    if (valueOfPrevTab !== 0) {
      switch (typeOfChoose) {
        case 0:
          order = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };

          break;
        case 1:
          bill = {
            billId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 2:
          contract = {
            contractId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 3:
          task = {
            taskId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 4:
          orderPo = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
      }
    }
    const chooses = {};
    chooses.name = choose && choose.name;
    chooses.code = choose && choose.code;
    chooses.orderId = choose && choose._id;
    chooses.organizationUnitId = choose && choose.organizationUnitId;
    const hrmId = hrmWage ? hrmWage._id : null;
    const hrmRecruimentWageIds = hrmRecruimentWageId ? hrmRecruimentWageId._id : null;

    let body = {
      type: typeOfRecord,
      costType: valueOfPrevTab,
      expenseType: typeOfRnE,
      kanbanStatus,
      // kanbanStatusImport: kanbanStatusImport,
      // kanbanStatusExport: kanbanStatusExport,
      typeOfCost: costType,
      order: order && order.orderId,
      bill,
      task,
      contract,
      performedBy,
      createDate: date,
      amount,
      tax,
      hrmRecruimentWageId: hrmRecruimentWageIds,
      hrmWage: hrmId,
      reason,
      state: this.state.state,
      note,
      payMethod: paymentMethod,
      others,
      code,
      total: this.state.choose !== null ? this.state.choose.total : total,
      totalAmount: this.state.allMoney ? this.state.allMoney : this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      customer: this.state.choose !== null ? this.state.choose.customer : customer,
      bank,
      orderPo,
      order: chooses,
    };

    const { localMessages } = this.state;
    body = {
      ...body,
      customer: body.customer && body.customer.name ? body.customer.name : customer,
    };
    // console.log(error, 'error', "localMessages", localMessages, body)
    if (localMessages && Object.keys(localMessages).length === 0) {
      if (!error) {
        if (this.state.isEditPage) {
          const { match } = this.props;
          body.id = match.params.id;
          this.props.onUpdateRecord(body);
        } else {
          this.props.onCreateRecord(body);
        }
      }
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };

  handleAddSale = sale => {
    const { typeOfChoose } = this.state;
    const choose = {
      id: sale._id,
      name: sale.name,
      total: typeOfChoose !== 4 ? sale.total : sale.amount,
      totalAmount: sale.totalAmount,
      customer: sale.customer ? sale.customer.name : sale.supplier ? sale.supplier.name : '',
    };
    this.state.listChild = [];
    if (typeOfChoose === 2) {
      const paymentRequest = sale.paymentRequest ? sale.paymentRequest : [];
      let AllMoney = 0;
      paymentRequest.forEach(item => {
        AllMoney = AllMoney + item.amount;
      });
      const filterPaymentRequest = paymentRequest.filter(item => item.statusPay === 3 || item.statusPay === 1);
      this.setState({ listChild: filterPaymentRequest, allMoney: AllMoney, listChildAll: paymentRequest });
      // if (Number(sale.catalogContract) === 1 && Number(sale.typeContract) === 1 && sale.saleQuotation) {
      //   const token = localStorage.getItem('token');
      //   const url = `${API_SALE}/${sale.saleQuotation.saleQuotationId}`;
      //   fetch(url, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      //     .then(res => res.json())
      //     .then(data => {
      //       this.setState({ listChild: data ? [data] : [] });
      //     });
      // }
      // if (Number(sale.catalogContract) === 1 && Number(sale.typeContract) === 2 && sale.order) {
      //   const token = localStorage.getItem('token');
      //   const url = `${API_ORDER_PO}/${sale.order.orderId}`;
      //   fetch(url, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      //     .then(res => res.json())
      //     .then(data => {
      //       this.setState({ listChild: data ? [data] : [] });
      //     });
      // }
    }
    if (typeOfChoose === 3) {
      const params = {
        filter: {
          'task.taskId': sale._id,
        },
      };
      const filter = serialize(params);
      const token = localStorage.getItem('token');
      const url = `${GET_CONTRACT}?${filter}`;
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ listChild: data.data });
        });
    }
    if (typeOfChoose === 4) {
      const token = localStorage.getItem('token');
      const url = `${API_ORDER_PO}/${sale._id}`;
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ listChild: data.data });
        });
    }
    this.setState({ choose });
  };

  loadFindOption = (required = false) => {
    const { typeOfChoose } = this.state;

    let label = '';
    this.state.typeOfChoose === 0
      ? (label = 'Đơn hàng')
      : this.state.typeOfChoose === 1
        ? (label = 'Hóa đơn')
        : this.state.typeOfChoose === 2
          ? (label = 'Hợp đồng')
          : this.state.typeOfChoose === 3
            ? (label = 'Dự án')
            : (label = 'Đơn hàng PO');
    let api = '';
    let functionHandle = this.handleAddSale;
    switch (typeOfChoose) {
      case 0:
        api = API_SALE;
        functionHandle = this.handleAddSale;
        break;
      case 1:
        api = API_BILLS;
        functionHandle = this.handleAddSale;
        functionHandle();
        break;
      case 2:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
      case 3:
        api = API_TASK_PROJECT;
        functionHandle = this.handleAddSale;
        break;
      case 4:
        api = API_ORDER_PO;
        functionHandle = this.handleAddSale;
        break;
      default:
        api = API_SALE;
        functionHandle = this.handleAddSale;
        break;
    }

    return (
      // <AsyncSelect
      //   className={this.props.classes.reactSelect1}
      //   placeholder="Tìm kiếm ..."
      //   label='122163'
      //   loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, api)}
      //   loadingMessage={() => 'Đang tải ...'}
      //   components={{ Option, SingleValue }}
      //   onChange={functionHandle}
      //   value={this.state.choose}
      //   theme={theme => ({
      //     ...theme,
      //     spacing: {
      //       ...theme.spacing,
      //       controlHeight: '55px',
      //     },
      //   })}
      // />

      <AsyncAutocomplete
        label={label}
        // customOptionLabel={this.customRecruiment}
        required={required}
        url={api}
        value={this.state.choose}
        onChange={(newVal, e) => {
          this.setState({ choose: newVal });
        }}
      />
    );
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${api === API_TASK_PROJECT ? '&filter%5BisProject%5D=true' : ''
      }`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };
}

AddRevenueAndExpenditurePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addRevenueAndExpenditurePage: makeSelectAddRevenueAndExpenditurePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCategory: () => {
      dispatch(getCatalogAct());
    },
    onCreateRecord: body => {
      dispatch(createRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onGetRecordById: id => {
      dispatch(getRecordAct(id));
    },
    onUpdateRecord: body => {
      dispatch(updateRecordAct(body));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar src={props.data.avatar} /> */}
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
      <div style={{ marginTop: 5 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addRevenueAndExpenditurePage', reducer });
const withSaga = injectSaga({ key: 'addRevenueAndExpenditurePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddRevenueAndExpenditurePage);
